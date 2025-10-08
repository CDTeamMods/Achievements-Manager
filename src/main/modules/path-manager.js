// Path Manager - Achievements Manager
// Gerencia caminhos baseado no tipo de instalação (portable vs instalado)

const { app } = require('electron');
const path = require('path');
const os = require('os');
const { getDebugManager } = require('./debug-manager');

class PathManager {
  constructor() {
    this.isInstalled = false;
    this.isDevelopment = false;
    this.userDataPath = null;
    this.dataPath = null;
    this.cachePath = null;
    this.initialized = false;
    this.debugManager = getDebugManager();
  }

  /**
   * Inicializa o gerenciador de caminhos
   */
  async initialize() {
    try {
      // Detectar modo de desenvolvimento
      // Se a aplicação está empacotada, sempre é produção
      this.isDevelopment = !app.isPackaged && process.env.NODE_ENV === 'development';

      // Detectar tipo de instalação
      this.isInstalled = this.detectInstallationType();

      // Definir caminhos baseado no tipo
      this.setupPaths();

      this.initialized = true;

      console.log('📁 Path Manager inicializado:');
      console.log(`   Modo: ${this.isDevelopment ? 'Desenvolvimento' : 'Produção'}`);
      console.log(`   Tipo: ${this.isInstalled ? 'Instalado' : 'Portable'}`);
      console.log(`   UserData: ${this.userDataPath}`);
      console.log(`   Data: ${this.dataPath}`);
      console.log(`   Cache: ${this.cachePath}`);

      return true;
    } catch (error) {
      this.debugManager.error('❌ Erro ao inicializar Path Manager:', error);
      return false;
    }
  }

  /**
   * Detecta se o aplicativo foi instalado via setup (não portable)
   */
  detectInstallationType() {
    try {
      // Verifica se está em uma pasta de instalação típica do Windows
      const appPath = app.getAppPath();
      const execPath = process.execPath;

      // Caminhos típicos de instalação
      const installPaths = ['Program Files', 'Program Files (x86)', 'AppData\\Local\\Programs'];

      // Verifica se está em um dos caminhos de instalação
      const isInInstallPath = installPaths.some(
        installPath => execPath.includes(installPath) || appPath.includes(installPath)
      );

      // Verifica se não é portable (portable geralmente fica na pasta do usuário ou desktop)
      const isPortable =
        execPath.includes('portable') ||
        appPath.includes('portable') ||
        execPath.includes(os.homedir()) ||
        execPath.includes('Desktop');

      return isInInstallPath && !isPortable;
    } catch (error) {
      console.warn('⚠️ Erro ao detectar tipo de instalação:', error);
      return false; // Default para portable em caso de erro
    }
  }

  /**
   * Configura os caminhos baseado no tipo de instalação e modo de desenvolvimento
   */
  setupPaths() {
    if (this.isInstalled) {
      // Versão instalada: usar AppData
      this.userDataPath = app.getPath('userData');
      this.dataPath = path.join(this.userDataPath, 'data');
      this.cachePath = path.join(this.userDataPath, 'Cache');
    } else {
      if (this.isDevelopment) {
        // Modo desenvolvimento: usar pasta do projeto
        this.userDataPath = path.join(__dirname, '..', '..');
        this.dataPath = path.join(__dirname, '..', '..', 'src', 'data');
        this.cachePath = path.join(__dirname, '..', '..', 'src', 'data', 'cache');
      } else {
        // Modo portable: usar pasta do executável
        const execDir = path.dirname(process.execPath);
        this.userDataPath = execDir;
        this.dataPath = path.join(execDir, 'data');
        this.cachePath = path.join(execDir, 'data', 'cache');
      }
    }
  }

  /**
   * Obtém o caminho base de dados
   */
  getDataPath() {
    if (!this.initialized) {
      throw new Error('PathManager não foi inicializado');
    }
    return this.dataPath;
  }

  /**
   * Obtém o caminho do userData
   */
  getUserDataPath() {
    if (!this.initialized) {
      throw new Error('PathManager não foi inicializado');
    }
    return this.userDataPath;
  }

  /**
   * Obtém o caminho do cache
   */
  getCachePath() {
    if (!this.initialized) {
      throw new Error('PathManager não foi inicializado');
    }
    return this.cachePath;
  }

  /**
   * Obtém um caminho específico dentro da pasta de dados
   */
  getPath(subPath) {
    if (!this.initialized) {
      throw new Error('PathManager não foi inicializado');
    }
    return path.join(this.dataPath, subPath);
  }

  /**
   * Obtém caminhos específicos para diferentes tipos de dados
   */
  getPaths() {
    if (!this.initialized) {
      throw new Error('PathManager não foi inicializado');
    }

    return {
      data: this.dataPath,
      userData: this.userDataPath,
      cache: this.cachePath,
      logs: path.join(this.dataPath, 'logs'),
      settings: path.join(this.dataPath, 'settings'),
    };
  }

  /**
   * Verifica se é versão instalada
   */
  isInstalledVersion() {
    return this.isInstalled;
  }

  /**
   * Verifica se está em modo de desenvolvimento
   */
  isDevelopmentMode() {
    return this.isDevelopment;
  }

  /**
   * Obtém informações sobre os caminhos
   */
  getInfo() {
    return {
      isInstalled: this.isInstalled,
      isDevelopment: this.isDevelopment,
      userDataPath: this.userDataPath,
      dataPath: this.dataPath,
      cachePath: this.cachePath,
      paths: this.getPaths(),
    };
  }
}

// Instância singleton
let pathManager = null;

/**
 * Inicializa o Path Manager
 */
async function setupPathManager() {
  if (!pathManager) {
    pathManager = new PathManager();
    await pathManager.initialize();
  }
  return pathManager;
}

/**
 * Obtém a instância do Path Manager
 */
function getPathManager() {
  if (!pathManager) {
    throw new Error('PathManager não foi inicializado. Chame setupPathManager() primeiro.');
  }
  return pathManager;
}

module.exports = {
  PathManager,
  setupPathManager,
  getPathManager,
};
