const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { getDebugManager } = require('./debug-manager');
const { getPathManager } = require('./path-manager');

class ConfigManager {
  constructor() {
    this.configPath = null;
    this.config = {};
    this.debugManager = getDebugManager();
    this.defaultConfig = {
      // Configurações básicas
      setupComplete: false,
      language: 'pt-BR',
      theme: 'dark',
      liteMode: false,
      virtualScrolling: true,
      autoStartWindows: false,
      minimizeToTray: false,
      isInstalledVersion: false,

      // Configurações de API
      apiSource: 'steam',
      steamApiKey: '',

      // Configurações de performance
      performance: {
        enableVirtualScrolling: true,
        showTooltips: true,
        autoSync: true,
        cacheSize: 100,
      },

      // Configurações de janela
      windowBounds: {
        width: 1200,
        height: 800,
        x: undefined,
        y: undefined,
      },

      // Configurações individuais (para compatibilidade)
      showTooltips: true,
      autoSync: true,
      cacheSize: 100,

      // Configurações de sistema
      crashReports: true,
    };
  }

  async init(userDataPath) {
    const pathManager = getPathManager();

    // Definir o caminho correto baseado no tipo de instalação
    if (pathManager.isInstalledVersion()) {
      // Versão instalada: usar AppData
      this.configPath = path.join(userDataPath, 'config.json');
    } else {
      // Versão portable: usar pasta settings no projeto
      const settingsPath = path.join(pathManager.getDataPath(), 'settings');
      this.configPath = path.join(settingsPath, 'app.json');
    }

    await this.loadConfig();
    this.setupIpcHandlers();
  }

  /**
   * Inicializa as configurações padrão da aplicação
   */
  async initializeDefaultConfigs() {
    try {
      const pathManager = getPathManager();
      const dataPath = pathManager.getDataPath();
      const settingsPath = path.join(dataPath, 'settings');

      // Criar arquivo de configuração principal se não existir
      await this.ensureConfigFile(this.configPath, this.defaultConfig);

      // Criar arquivo de configurações de migração se não existir
      const migrationConfigPath = path.join(settingsPath, 'migration-settings.json');
      const defaultMigrationConfig = {
        version: '0.0.1-beta',
        lastMigration: null,
        autoMigration: true,
        backupBeforeMigration: true,
        migrationHistory: [],
      };

      await this.ensureConfigFile(migrationConfigPath, defaultMigrationConfig);

      this.debugManager.log('✅ Configurações padrão inicializadas com sucesso');
      return true;
    } catch (error) {
      this.debugManager.error('❌ Erro ao inicializar configurações padrão:', error);
      throw error;
    }
  }

  /**
   * Garante que um arquivo de configuração existe com valores padrão
   */
  async ensureConfigFile(filePath, defaultConfig) {
    try {
      // Criar diretório se não existir
      const configDir = path.dirname(filePath);
      await fs.mkdir(configDir, { recursive: true });

      // Verificar se o arquivo já existe
      try {
        await fs.access(filePath);
        this.debugManager.log(`📄 Arquivo de configuração já existe: ${path.basename(filePath)}`);
        return;
      } catch {
        // Arquivo não existe, criar com configurações padrão
      }

      // Criar arquivo com configurações padrão
      await fs.writeFile(filePath, JSON.stringify(defaultConfig, null, 2), 'utf8');
      this.debugManager.log(`📄 Arquivo de configuração criado: ${path.basename(filePath)}`);
    } catch (error) {
      this.debugManager.error(`❌ Erro ao criar arquivo de configuração ${filePath}:`, error);
      throw error;
    }
  }

  async loadConfig() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = { ...this.defaultConfig, ...JSON.parse(configData) };

      // Migrar configurações antigas se necessário
      if (this.config.version !== this.defaultConfig.version) {
        await this.migrateConfig();
      }

      // Proteger configurações críticas em modo portable
      await this.protectCriticalSettings();
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Arquivo não existe, usar configuração padrão
        this.config = { ...this.defaultConfig };
        await this.saveConfig();
      } else {
        this.config = { ...this.defaultConfig };
      }
    }
  }

  async saveConfig() {
    try {
      await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
      this.debugManager.log('✅ Configurações salvas com sucesso');
    } catch (error) {
      this.debugManager.error('❌ Erro ao salvar configurações:', error);
    }
  }

  /**
   * Migra configurações antigas para a versão atual
   */
  async migrateConfig() {
    try {
      this.debugManager.log('🔄 Migrando configurações para nova versão...');

      // Atualizar versão da configuração
      this.config.version = this.defaultConfig.version;

      // Aqui você pode adicionar lógica específica de migração conforme necessário
      // Por exemplo, remover configurações obsoletas, renomear chaves, etc.

      // Remover configurações relacionadas à Steam API se existirem
      if (this.config.steamApiKey) {
        delete this.config.steamApiKey;
        this.debugManager.log('🗑️ Removida configuração obsoleta: steamApiKey');
      }

      if (this.config.steamUserId) {
        delete this.config.steamUserId;
        this.debugManager.log('🗑️ Removida configuração obsoleta: steamUserId');
      }

      // Salvar configurações migradas
      await this.saveConfig();
      this.debugManager.log('✅ Migração de configurações concluída');
    } catch (error) {
      this.debugManager.error('❌ Erro durante migração de configurações:', error);
    }
  }

  /**
   * Protege configurações críticas em modo portable
   * Evita que alterações manuais no config.json quebrem o aplicativo
   */
  async protectCriticalSettings() {
    try {
      const pathManager = getPathManager();

      // Só aplicar proteção se estiver em modo portable
      if (!pathManager || pathManager.isInstalledVersion()) {
        return;
      }

      let needsSave = false;
      const criticalSettings = {
        isInstalledVersion: false,
        steamPath: this.defaultConfig.steamPath,
        userDataPath: this.defaultConfig.userDataPath,
      };

      // Verificar e corrigir configurações críticas
      for (const [key, safeValue] of Object.entries(criticalSettings)) {
        if (this.config[key] !== safeValue) {
          this.config[key] = safeValue;
          needsSave = true;
        }
      }

      // Salvar se houve correções
      if (needsSave) {
        await this.saveConfig();
      }
    } catch (error) {
      // Erro ao proteger configurações críticas
    }
  }

  get(key) {
    return key ? this.config[key] : this.config;
  }

  async set(key, value) {
    // Proteger configurações críticas em modo portable
    if (typeof key === 'object') {
      // Se key é um objeto, filtrar configurações perigosas e validar
      const filteredConfig = this.filterCriticalSettings(key);
      const validatedConfig = this.validateSettings(filteredConfig);
      this.config = { ...this.config, ...validatedConfig };
    } else {
      // Se key é uma string, verificar se é uma configuração crítica e válida
      if (this.isCriticalSetting(key, value)) {
        return this.config;
      }

      // Validar se a configuração é conhecida
      if (!this.isValidSetting(key)) {
        this.debugManager.warn(`⚠️ Configuração desconhecida ignorada: ${key}`);
        return this.config;
      }

      this.config[key] = value;
    }
    await this.saveConfig();
    return this.config;
  }

  /**
   * Verifica se uma configuração é válida (conhecida)
   */
  isValidSetting(key) {
    return this.getAllowedSettingKeys().includes(key);
  }

  /**
   * Obtém todas as chaves de configuração permitidas
   */
  getAllowedSettingKeys() {
    const flattenKeys = (obj, prefix = '') => {
      const keys = [];
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        keys.push(fullKey);
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          keys.push(...flattenKeys(value, fullKey));
        }
      }
      return keys;
    };

    return flattenKeys(this.defaultConfig);
  }

  /**
   * Valida um objeto de configurações, mantendo apenas as conhecidas
   */
  validateSettings(settings) {
    if (!settings || typeof settings !== 'object') {
      return {};
    }

    const allowedKeys = this.getAllowedSettingKeys();
    const validated = {};

    for (const [key, value] of Object.entries(settings)) {
      if (allowedKeys.includes(key)) {
        validated[key] = value;
      } else {
        this.debugManager.warn(`⚠️ Configuração desconhecida ignorada: ${key}`);
      }
    }

    return validated;
  }

  /**
   * Verifica se uma configuração é crítica e não deve ser alterada em modo portable
   */
  isCriticalSetting(key, value) {
    const pathManager = getPathManager();

    // Só aplicar proteção se estiver em modo portable
    if (!pathManager || pathManager.isInstalledVersion()) {
      return false;
    }

    const criticalKeys = ['isInstalledVersion', 'steamPath', 'userDataPath'];

    if (criticalKeys.includes(key)) {
      // Para isInstalledVersion, só permitir false em modo portable
      if (key === 'isInstalledVersion' && value !== false) {
        return true;
      }
      // Para steamPath e userDataPath, só permitir valores padrão
      if ((key === 'steamPath' || key === 'userDataPath') && value !== this.defaultConfig[key]) {
        return true;
      }
    }

    return false;
  }

  /**
   * Filtra configurações críticas de um objeto de configurações
   */
  filterCriticalSettings(configObject) {
    const pathManager = getPathManager();

    // Só aplicar proteção se estiver em modo portable
    if (!pathManager || pathManager.isInstalledVersion()) {
      return configObject;
    }

    const filtered = { ...configObject };
    const criticalKeys = ['isInstalledVersion', 'steamPath', 'userDataPath'];

    for (const key of criticalKeys) {
      if (key in filtered) {
        if (this.isCriticalSetting(key, filtered[key])) {
          delete filtered[key];
        }
      }
    }

    return filtered;
  }

  async reset() {
    this.config = { ...this.defaultConfig };
    await this.saveConfig();
    return this.config;
  }

  setupIpcHandlers() {
    // Obter configuração específica
    ipcMain.handle('config:get', (event, key) => {
      return this.get(key);
    });

    // Obter todas as configurações
    ipcMain.handle('config:getAll', () => {
      return this.config;
    });

    // Definir configuração
    ipcMain.handle('config:set', async (event, key, value) => {
      return await this.set(key, value);
    });

    // Resetar configurações
    ipcMain.handle('config:reset', async () => {
      return await this.reset();
    });

    // Testar conexão Steam
    ipcMain.handle('test-steam-connection', async (event, { apiKey, steamId }) => {
      try {
        const { getSteamIntegrationManager } = require('./steam-integration');
        const steamManager = getSteamIntegrationManager();

        // Testar conexão com as credenciais fornecidas
        const result = await steamManager.testConnection(apiKey, steamId);
        return result;
      } catch (error) {
        this.debugManager.error('❌ Erro ao testar conexão Steam:', error);
        return {
          success: false,
          error: 'Erro interno ao testar conexão',
        };
      }
    });
  }
}

module.exports = ConfigManager;
