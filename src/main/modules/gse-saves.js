const { ipcMain } = require('electron');
const fs = require('node:fs').promises;
const path = require('node:path');
const os = require('node:os');

class GSESavesManager {
  constructor(pathManager, debugManager) {
    this.pathManager = pathManager;
    this.debugManager = debugManager;
    this.gseSavesPaths = [];
    this.isInitialized = false;
  }

  async initialize() {
    try {
      await this.detectGSESavesPaths();
      this.setupIpcHandlers();
      this.isInitialized = true;

      // Testar detecção do usuário na inicialização
      const currentUser = this.getCurrentUser();

      return true;
    } catch (error) {
      this.debugManager?.error('❌ Erro ao inicializar GSE Saves Manager:', error);
      return false;
    }
  }

  /**
   * Detecta o usuário local do sistema
   */
  getCurrentUser() {
    try {
      // Método 1: Variável de ambiente USERNAME (Windows)
      let username = process.env.USERNAME || process.env.USER;

      if (username && username.trim()) {
        this.debugManager?.log(`👤 Usuário detectado via env: ${username}`);
        return username.trim();
      }

      // Método 2: Usar os.userInfo() como fallback
      try {
        const userInfo = os.userInfo();
        if (userInfo && userInfo.username && userInfo.username.trim()) {
          username = userInfo.username.trim();
          this.debugManager?.log(`👤 Usuário detectado via os.userInfo: ${username}`);
          return username;
        }
      } catch (osError) {
        console.log('❌ [GSE] os.userInfo() falhou:', osError.message);
        this.debugManager?.warn('⚠️ os.userInfo() falhou:', osError.message);
      }

      // Método 3: Tentar extrair do homedir
      try {
        const homedir = os.homedir();
        if (homedir) {
          // Extrair username do caminho do homedir (ex: C:\Users\username)
          const pathParts = homedir.split(path.sep);
          const usernameFromPath = pathParts[pathParts.length - 1];

          if (usernameFromPath && usernameFromPath.trim() && usernameFromPath !== 'Users') {
            username = usernameFromPath.trim();
            this.debugManager?.log(`👤 Usuário detectado via homedir: ${username}`);
            return username;
          }
        }
      } catch (homedirError) {
        console.log('❌ [GSE] Extração do homedir falhou:', homedirError.message);
        this.debugManager?.warn('⚠️ Extração do homedir falhou:', homedirError.message);
      }

      // Método 4: Tentar outras variáveis de ambiente
      const alternativeEnvs = ['USERPROFILE', 'LOGNAME', 'USER_NAME'];
      for (const envVar of alternativeEnvs) {
        const envValue = process.env[envVar];
        if (envValue) {
          // Se for um caminho, extrair o username
          if (envValue.includes(path.sep)) {
            const pathParts = envValue.split(path.sep);
            username = pathParts[pathParts.length - 1];
          } else {
            username = envValue;
          }

          if (username && username.trim()) {
            this.debugManager?.log(`👤 Usuário detectado via ${envVar}: ${username}`);
            return username.trim();
          }
        }
      }

      console.log('❌ [GSE] Não foi possível detectar o usuário do sistema');
      this.debugManager?.warn('⚠️ Não foi possível detectar o usuário do sistema');
      return null;
    } catch (error) {
      console.log('❌ [GSE] Erro ao detectar usuário:', error);
      this.debugManager?.error('❌ Erro ao detectar usuário:', error);
      return null;
    }
  }

  /**
   * Verifica se uma pasta existe
   */
  async checkDirectoryExists(dirPath) {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch (error) {
      return false;
    }
  }

  /**
   * Detecta automaticamente as pastas do GSE Saves
   */
  async detectGSESavesPaths() {
    this.debugManager?.log('🔍 Detectando pastas do GSE Saves...');

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Não foi possível detectar o usuário atual');
    }

    // Caminhos possíveis para as pastas GSE Saves
    const possiblePaths = [
      `C:\\Users\\${currentUser}\\AppData\\Roaming\\GSE Saves`,
      `C:\\Users\\${currentUser}\\AppData\\Roaming\\Goldberg SteamEmu Saves`,
      // Caminhos alternativos caso o usuário tenha configurações diferentes
      `C:\\Users\\${currentUser}\\Documents\\GSE Saves`,
      `C:\\Users\\${currentUser}\\Documents\\Goldberg SteamEmu Saves`,
    ];

    this.gseSavesPaths = [];

    for (const dirPath of possiblePaths) {
      const exists = await this.checkDirectoryExists(dirPath);
      if (exists) {
        this.debugManager?.log(`✅ Pasta encontrada: ${dirPath}`);
        this.gseSavesPaths.push({
          path: dirPath,
          type: dirPath.includes('Goldberg') ? 'goldberg' : 'gse',
          name: path.basename(dirPath),
        });
      }
    }

    if (this.gseSavesPaths.length === 0) {
      this.debugManager?.log('⚠️ Nenhuma pasta GSE Saves encontrada');
    } else {
      this.debugManager?.log(
        `🎯 Total de pastas GSE Saves encontradas: ${this.gseSavesPaths.length}`
      );
    }

    return this.gseSavesPaths;
  }

  /**
   * Obtém lista de jogos das pastas GSE Saves
   */
  async getGSESavesGames() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const games = [];

      for (const saveFolder of this.gseSavesPaths) {
        this.debugManager?.log(`🎮 Escaneando jogos em: ${saveFolder.path}`);

        try {
          const entries = await fs.readdir(saveFolder.path, { withFileTypes: true });

          for (const entry of entries) {
            if (entry.isDirectory()) {
              const gamePath = path.join(saveFolder.path, entry.name);

              games.push({
                id: entry.name,
                name: entry.name,
                path: gamePath,
                source: saveFolder.type,
                sourceFolder: saveFolder.name,
              });
            }
          }
        } catch (error) {
          this.debugManager?.error(`❌ Erro ao escanear ${saveFolder.path}:`, error);
        }
      }

      this.debugManager?.log(`🎯 Total de jogos encontrados: ${games.length}`);
      return games;
    } catch (error) {
      this.debugManager?.error('❌ Erro ao buscar jogos GSE Saves:', error);
      return [];
    }
  }

  /**
   * Obtém achievements de um jogo específico
   */
  async getGSESavesAchievements(gameId) {
    try {
      this.debugManager?.log(`🏆 Buscando achievements para: ${gameId}`);

      const achievements = [];

      for (const saveFolder of this.gseSavesPaths) {
        const gamePath = path.join(saveFolder.path, gameId);
        const exists = await this.checkDirectoryExists(gamePath);

        if (exists) {
          this.debugManager?.log(`📁 Jogo encontrado em: ${gamePath}`);

          // Procurar por arquivos de achievements
          const files = await fs.readdir(gamePath);

          for (const file of files) {
            if (file.includes('achievement') || file.includes('stats') || file.endsWith('.dat')) {
              const filePath = path.join(gamePath, file);

              achievements.push({
                id: file,
                name: file,
                path: filePath,
                source: saveFolder.type,
                unlocked: true, // Por padrão, se existe o arquivo, foi desbloqueado
                unlockedAt: null, // Seria necessário ler o arquivo para obter a data
              });
            }
          }
        }
      }

      this.debugManager?.log(`🏆 Achievements encontrados para ${gameId}: ${achievements.length}`);
      return achievements;
    } catch (error) {
      this.debugManager?.error(`❌ Erro ao buscar achievements para ${gameId}:`, error);
      return [];
    }
  }

  /**
   * Configura os handlers IPC
   */
  setupIpcHandlers() {
    // Verificar pastas GSE Saves
    ipcMain.handle('gse:detectPaths', async () => {
      return await this.detectGSESavesPaths();
    });

    // Obter informações do usuário atual
    ipcMain.handle('gse:getCurrentUser', () => {
      return this.getCurrentUser();
    });

    // Obter jogos
    ipcMain.handle('gse:getGames', async () => {
      return await this.getGSESavesGames();
    });

    // Obter achievements
    ipcMain.handle('gse:getAchievements', async (event, gameId) => {
      return await this.getGSESavesAchievements(gameId);
    });

    // Obter status das pastas
    ipcMain.handle('gse:getStatus', () => {
      return {
        initialized: this.isInitialized,
        pathsFound: this.gseSavesPaths.length,
        paths: this.gseSavesPaths,
        currentUser: this.getCurrentUser(),
      };
    });
  }
}

module.exports = { GSESavesManager };
