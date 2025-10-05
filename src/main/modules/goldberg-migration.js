// Goldberg SteamEmu Migration Manager - Achievements Manager
const { ipcMain, dialog } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { getDebugManager } = require('./debug-manager');

class GoldbergMigrationManager {
  constructor(crashReporter = null, pathManager = null) {
    this.currentUser = null;
    this.goldbergPath = null;
    this.gseSavesPath = null;
    this.isInitialized = false;
    this.crashReporter = crashReporter;
    this.pathManager = pathManager;
    this.debugManager = getDebugManager();
    this.migrationSettings = {
      autoMigration: false,
      showDialog: true,
      lastCheck: null,
    };
  }

  /**
   * Inicializa o sistema de migração
   */
  async initialize() {
    try {
      // Detectar usuário atual
      this.currentUser = this.getCurrentUser();

      // Definir caminhos (pasta antiga do Goldberg)
      this.goldbergPath = path.join(
        'C:',
        'Users',
        this.currentUser,
        'AppData',
        'Roaming',
        'Goldberg SteamEmu Saves'
      );
      // Pasta nova (GSE Saves) - sempre na pasta de dados do app
      this.gseSavesPath = this.pathManager
        ? path.join(this.pathManager.getDataPath(), 'GSE Saves')
        : path.join(__dirname, '..', '..', 'data', 'GSE Saves');

      // Carregar configurações
      await this.loadMigrationSettings();

      // Configurar handlers IPC
      this.setupIpcHandlers();

      this.isInitialized = true;

      // Verificação automática na inicialização
      const goldbergInfo = await this.checkGoldbergFolder();
      if (goldbergInfo.exists && this.migrationSettings.autoMigration) {
        this.debugManager.log('🔄 Executando verificação automática na inicialização...');
        setTimeout(() => {
          this.performAutoCheck();
        }, 3000); // Aguardar 3 segundos para não interferir na inicialização
      }

      return true;
    } catch (error) {
      this.debugManager.error('❌ Erro ao inicializar Goldberg Migration Manager:', error);

      // Reportar erro ao sistema de crash
      if (this.crashReporter && this.crashReporter.reportError) {
        this.crashReporter.reportError('GoldbergMigrationManager.initialize', error);
      }

      return false;
    }
  }

  /**
   * Obtém o usuário atual do sistema
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
        console.log('❌ [Goldberg] os.userInfo() falhou:', osError.message);
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

      this.debugManager?.warn('⚠️ Não foi possível detectar o usuário do sistema');
      return 'DefaultUser';
    } catch (error) {
      this.debugManager?.error('❌ Erro ao detectar usuário:', error);
      return 'DefaultUser';
    }
  }

  /**
   * Verifica se a pasta Goldberg SteamEmu Saves existe
   */
  async checkGoldbergFolder() {
    try {
      const currentUser = this.getCurrentUser();
      const stats = await fs.stat(this.goldbergPath);
      const exists = stats.isDirectory();

      if (exists) {
        // Verificar se há jogos na pasta
        const games = await this.getGoldbergGames();

        return {
          exists: true,
          path: this.goldbergPath,
          gamesCount: games.length,
          games: games,
          currentUser: currentUser,
        };
      }

      return {
        exists: false,
        path: this.goldbergPath,
        gamesCount: 0,
        games: [],
        currentUser: currentUser,
      };
    } catch (error) {
      this.debugManager.log(`❌ Pasta Goldberg não encontrada: ${error.message}`);
      return {
        exists: false,
        path: this.goldbergPath,
        gamesCount: 0,
        games: [],
        currentUser: this.getCurrentUser(),
        error: error.message,
      };
    }
  }

  /**
   * Obtém lista de jogos da pasta Goldberg
   */
  async getGoldbergGames() {
    try {
      const entries = await fs.readdir(this.goldbergPath, { withFileTypes: true });
      const games = [];

      for (const entry of entries) {
        if (entry.isDirectory() && /^\d+$/.test(entry.name)) {
          const gamePath = path.join(this.goldbergPath, entry.name);
          const gameInfo = await this.analyzeGoldbergGame(gamePath, entry.name);

          if (gameInfo) {
            games.push(gameInfo);
          }
        }
      }

      return games;
    } catch (error) {
      this.debugManager.error('❌ Erro ao obter jogos Goldberg:', error);
      return [];
    }
  }

  /**
   * Analisa um jogo específico da pasta Goldberg
   */
  async analyzeGoldbergGame(gamePath, gameId) {
    try {
      const files = await fs.readdir(gamePath);
      const achievementFiles = files.filter(
        file =>
          file.includes('achievement') ||
          file.includes('stats') ||
          file.endsWith('.dat') ||
          file.endsWith('.json')
      );

      return {
        id: gameId,
        name: `Game ${gameId}`,
        path: gamePath,
        achievementFiles: achievementFiles,
        hasAchievements: achievementFiles.length > 0,
        lastModified: await this.getLastModified(gamePath),
      };
    } catch (error) {
      this.debugManager.error(`❌ Erro ao analisar jogo ${gameId}:`, error);
      return null;
    }
  }

  /**
   * Obtém data da última modificação
   */
  async getLastModified(dirPath) {
    try {
      const stats = await fs.stat(dirPath);
      return stats.mtime.toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  }

  /**
   * Migra um jogo específico da pasta antiga Goldberg SteamEmu Saves para GSE Saves
   * Pasta origem: C:\Users\[Usuario]\AppData\Roaming\Goldberg SteamEmu Saves\[GameID]
   * Pasta destino: [AppData]\GSE Saves\[GameID]
   */
  async migrateGame(gameInfo) {
    try {
      this.debugManager.log(`🔄 Migrando jogo ${gameInfo.id}...`);

      // Criar pasta de destino
      const destPath = path.join(this.gseSavesPath, gameInfo.id);
      await fs.mkdir(destPath, { recursive: true });

      // Copiar arquivos de achievements
      const migratedFiles = [];

      for (const file of gameInfo.achievementFiles) {
        const sourcePath = path.join(gameInfo.path, file);
        const destFilePath = path.join(destPath, file);

        try {
          await fs.copyFile(sourcePath, destFilePath);
          migratedFiles.push(file);
          this.debugManager.log(`✅ Arquivo copiado: ${file}`);
        } catch (error) {
          this.debugManager.error(`❌ Erro ao copiar ${file}:`, error);
        }
      }

      // Criar arquivo achievements.json no formato GSE Saves
      await this.createGSEAchievementsFile(destPath, gameInfo, migratedFiles);

      this.debugManager.log(`✅ Jogo ${gameInfo.id} migrado com sucesso`);

      return {
        success: true,
        gameId: gameInfo.id,
        migratedFiles: migratedFiles,
        destPath: destPath,
      };
    } catch (error) {
      this.debugManager.error(`❌ Erro ao migrar jogo ${gameInfo.id}:`, error);

      // Reportar erro
      if (global.crashReporter) {
        global.crashReporter.reportError('GoldbergMigrationManager.migrateGame', error, {
          gameId: gameInfo.id,
        });
      }

      return {
        success: false,
        gameId: gameInfo.id,
        error: error.message,
      };
    }
  }

  /**
   * Cria arquivo achievements.json no formato GSE Saves
   */
  async createGSEAchievementsFile(destPath, gameInfo, migratedFiles) {
    try {
      const achievementsData = {
        gameId: gameInfo.id,
        gameName: gameInfo.name,
        achievements: [],
        totalAchievements: 0,
        unlockedCount: 0,
        completionPercentage: 0,
        lastModified: new Date().toISOString(),
        version: '1.0.0',
        source: 'Goldberg_Migration',
        originalFiles: migratedFiles,
        migrationDate: new Date().toISOString(),
      };

      // Tentar extrair informações dos arquivos migrados
      for (const file of migratedFiles) {
        const filePath = path.join(destPath, file);

        try {
          if (file.endsWith('.json')) {
            // Tentar ler arquivo JSON
            const content = await fs.readFile(filePath, 'utf8');
            const data = JSON.parse(content);

            // Processar dados baseado na estrutura encontrada
            if (data.achievements) {
              achievementsData.achievements = data.achievements;
              achievementsData.totalAchievements = data.achievements.length;
              achievementsData.unlockedCount = data.achievements.filter(a => a.unlocked).length;
            }
          }
        } catch (error) {
          this.debugManager.log(`⚠️ Não foi possível processar ${file}: ${error.message}`);
        }
      }

      // Calcular porcentagem de conclusão
      if (achievementsData.totalAchievements > 0) {
        achievementsData.completionPercentage =
          (achievementsData.unlockedCount / achievementsData.totalAchievements) * 100;
      }

      // Salvar arquivo
      const achievementsPath = path.join(destPath, 'achievements.json');
      await fs.writeFile(achievementsPath, JSON.stringify(achievementsData, null, 2));

      this.debugManager.log(`✅ Arquivo achievements.json criado para jogo ${gameInfo.id}`);
    } catch (error) {
      this.debugManager.error(`❌ Erro ao criar achievements.json para ${gameInfo.id}:`, error);
    }
  }

  /**
   * Migra todos os jogos encontrados
   */
  async migrateAllGames() {
    try {
      this.debugManager.log('🔄 Iniciando migração completa...');

      const goldbergInfo = await this.checkGoldbergFolder();

      if (!goldbergInfo.exists || goldbergInfo.gamesCount === 0) {
        return {
          success: false,
          message: 'Nenhum jogo encontrado na pasta Goldberg SteamEmu Saves',
        };
      }

      const results = [];

      for (const game of goldbergInfo.games) {
        const result = await this.migrateGame(game);
        results.push(result);
      }

      const successCount = results.filter(r => r.success).length;

      this.debugManager.log(
        `✅ Migração completa: ${successCount}/${results.length} jogos migrados`
      );

      return {
        success: true,
        totalGames: results.length,
        successCount: successCount,
        results: results,
      };
    } catch (error) {
      this.debugManager.error('❌ Erro na migração completa:', error);

      if (this.crashReporter) {
        this.crashReporter.reportError('GoldbergMigrationManager.migrateAllGames', error);
      }

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Carrega configurações de migração
   */
  async loadMigrationSettings() {
    try {
      const settingsPath = this.pathManager
        ? path.join(this.pathManager.getDataPath(), 'settings', 'migration-settings.json')
        : path.join(__dirname, '..', '..', 'data', 'settings', 'migration-settings.json');

      try {
        const content = await fs.readFile(settingsPath, 'utf8');
        this.migrationSettings = { ...this.migrationSettings, ...JSON.parse(content) };
      } catch (error) {
        // Arquivo não existe, usar configurações padrão
        await this.saveMigrationSettings();
      }

      this.debugManager.log('⚙️ Configurações de migração carregadas:', this.migrationSettings);
    } catch (error) {
      this.debugManager.error('❌ Erro ao carregar configurações de migração:', error);
    }
  }

  /**
   * Salva configurações de migração
   */
  async saveMigrationSettings() {
    try {
      const settingsPath = this.pathManager
        ? path.join(this.pathManager.getDataPath(), 'settings', 'migration-settings.json')
        : path.join(__dirname, '..', '..', 'data', 'settings', 'migration-settings.json');
      const settingsDir = path.dirname(settingsPath);

      await fs.mkdir(settingsDir, { recursive: true });
      await fs.writeFile(settingsPath, JSON.stringify(this.migrationSettings, null, 2));

      this.debugManager.log('💾 Configurações de migração salvas');
    } catch (error) {
      this.debugManager.error('❌ Erro ao salvar configurações de migração:', error);
    }
  }

  /**
   * Atualiza configurações de migração
   */
  async updateMigrationSettings(newSettings) {
    try {
      this.migrationSettings = { ...this.migrationSettings, ...newSettings };
      await this.saveMigrationSettings();

      this.debugManager.log('⚙️ Configurações de migração atualizadas:', this.migrationSettings);

      return { success: true };
    } catch (error) {
      this.debugManager.error('❌ Erro ao atualizar configurações:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Executa verificação automática
   */
  async performAutoCheck() {
    try {
      this.debugManager.log('🔍 Executando verificação automática...');

      const goldbergInfo = await this.checkGoldbergFolder();

      if (!goldbergInfo.exists || goldbergInfo.gamesCount === 0) {
        this.debugManager.log('📭 Nenhum jogo encontrado na verificação automática');
        return;
      }

      // Verificar se há jogos novos ou modificados
      const hasNewGames = await this.hasNewOrModifiedGames(goldbergInfo.games);

      if (!hasNewGames) {
        this.debugManager.log('📋 Nenhum jogo novo ou modificado encontrado');
        return;
      }

      this.debugManager.log(
        `🎮 ${goldbergInfo.gamesCount} jogo(s) encontrado(s) para migração automática`
      );

      // Se deve mostrar diálogo
      if (this.migrationSettings.showDialog) {
        // Enviar evento para mostrar diálogo
        if (global.mainWindow && !global.mainWindow.isDestroyed()) {
          try {
            // Verificar se goldbergInfo pode ser clonado
            structuredClone(goldbergInfo);
            global.mainWindow.webContents.send('goldberg-migration-dialog', goldbergInfo);
            this.debugManager.log('📤 Evento goldberg-migration-dialog enviado com sucesso');
          } catch (cloneError) {
            this.debugManager.error(
              '❌ Erro de clonagem em goldberg-migration-dialog:',
              cloneError
            );

            // Criar versão serializada
            const serializedInfo = JSON.parse(JSON.stringify(goldbergInfo));
            global.mainWindow.webContents.send('goldberg-migration-dialog', serializedInfo);
            this.debugManager.log(
              '📤 Evento goldberg-migration-dialog enviado com dados serializados'
            );
          }
        }
      } else if (this.migrationSettings.autoMigration) {
        // Migrar automaticamente
        const result = await this.migrateAllGames();

        if (result.success) {
          this.debugManager.log(
            `✅ Migração automática concluída: ${result.successCount}/${result.totalGames} jogos`
          );

          // Notificar usuário
          if (global.mainWindow && !global.mainWindow.isDestroyed()) {
            try {
              // Verificar se result pode ser clonado
              structuredClone(result);
              global.mainWindow.webContents.send('goldberg-migration-completed', result);
              this.debugManager.log('📤 Evento goldberg-migration-completed enviado com sucesso');
            } catch (cloneError) {
              this.debugManager.error(
                '❌ Erro de clonagem em goldberg-migration-completed:',
                cloneError
              );

              // Criar versão serializada
              const serializedResult = JSON.parse(JSON.stringify(result));
              global.mainWindow.webContents.send('goldberg-migration-completed', serializedResult);
              this.debugManager.log(
                '📤 Evento goldberg-migration-completed enviado com dados serializados'
              );
            }
          }
        } else {
          this.debugManager.error('❌ Erro na migração automática:', result.error);
        }
      }

      // Atualizar última verificação
      this.migrationSettings.lastCheck = new Date().toISOString();
      await this.saveMigrationSettings();
    } catch (error) {
      this.debugManager.error('❌ Erro na verificação automática:', error);

      if (this.crashReporter) {
        this.crashReporter.reportError('GoldbergMigrationManager.performAutoCheck', error);
      }
    }
  }

  /**
   * Verifica se há jogos novos ou modificados
   */
  async hasNewOrModifiedGames(games) {
    try {
      if (!this.migrationSettings.lastCheck) {
        return true; // Primeira verificação
      }

      const lastCheckDate = new Date(this.migrationSettings.lastCheck);

      for (const game of games) {
        const gameModified = new Date(game.lastModified);

        if (gameModified > lastCheckDate) {
          this.debugManager.log(`🆕 Jogo modificado encontrado: ${game.name} (${game.id})`);
          return true;
        }

        // Verificar se já existe no GSE Saves
        const gsePath = path.join(this.gseSavesPath, game.id);
        const gseExists = await fs
          .access(gsePath)
          .then(() => true)
          .catch(() => false);

        if (!gseExists) {
          this.debugManager.log(`🆕 Jogo novo encontrado: ${game.name} (${game.id})`);
          return true;
        }
      }

      return false;
    } catch (error) {
      this.debugManager.error('❌ Erro ao verificar jogos novos/modificados:', error);
      return true; // Em caso de erro, assumir que há jogos novos
    }
  }

  /**
   * Configura handlers IPC
   */
  setupIpcHandlers() {
    // Verificar pasta Goldberg
    ipcMain.handle('goldberg:checkFolder', async () => {
      return await this.checkGoldbergFolder();
    });

    // Obter usuário atual
    ipcMain.handle('goldberg:getCurrentUser', () => {
      return this.getCurrentUser();
    });

    // Migrar todos os jogos
    ipcMain.handle('goldberg:migrateAll', async () => {
      return await this.migrateAllGames();
    });

    // Migrar jogo específico
    ipcMain.handle('goldberg:migrateGame', async (event, gameInfo) => {
      return await this.migrateGame(gameInfo);
    });

    // Obter configurações
    ipcMain.handle('goldberg:getSettings', () => {
      return this.migrationSettings;
    });

    // Atualizar configurações
    ipcMain.handle('goldberg:updateSettings', async (event, settings) => {
      return await this.updateMigrationSettings(settings);
    });

    // Obter status geral
    ipcMain.handle('goldberg:getStatus', async () => {
      const goldbergInfo = await this.checkGoldbergFolder();

      return {
        initialized: this.isInitialized,
        currentUser: this.currentUser,
        goldbergPath: this.goldbergPath,
        gseSavesPath: this.gseSavesPath,
        goldbergExists: goldbergInfo.exists,
        gamesCount: goldbergInfo.gamesCount,
        settings: this.migrationSettings,
      };
    });

    // Obter jogos Goldberg
    ipcMain.handle('goldberg:getGames', async () => {
      return await this.getGoldbergGames();
    });

    // Definir configuração específica
    ipcMain.handle('goldberg:setSetting', async (event, key, value) => {
      try {
        this.debugManager.log(`🔧 Tentando salvar configuração: ${key} = ${value}`);

        // Validar parâmetros
        if (!key || key.trim() === '') {
          throw new Error('Chave da configuração não pode estar vazia');
        }

        // Verificar se migrationSettings existe
        if (!this.migrationSettings) {
          this.debugManager.log('⚠️ migrationSettings não existe, inicializando...');
          this.migrationSettings = {
            autoMigration: false,
            showDialog: true,
            lastCheck: null,
          };
        }

        this.debugManager.log('📋 Estado atual das configurações:', this.migrationSettings);

        // Atualizar configuração
        this.migrationSettings[key] = value;
        this.debugManager.log(`✅ Configuração ${key} atualizada para: ${value}`);

        // Salvar configurações
        await this.saveMigrationSettings();
        this.debugManager.log('💾 Configurações salvas com sucesso');

        return { success: true, message: `Configuração ${key} salva com sucesso` };
      } catch (error) {
        this.debugManager.error('❌ Erro ao salvar configuração:', error);
        this.debugManager.error('📊 Stack trace:', error.stack);
        return { success: false, error: error.message, stack: error.stack };
      }
    });

    // Obter última verificação
    ipcMain.handle('goldberg:getLastCheck', () => {
      return this.migrationSettings.lastCheck || null;
    });

    // Verificar migração (verificação manual)
    ipcMain.handle('goldberg:checkMigration', async () => {
      try {
        const goldbergInfo = await this.checkGoldbergFolder();

        // Atualizar última verificação
        this.migrationSettings.lastCheck = new Date().toISOString();
        await this.saveMigrationSettings();

        return {
          hasGames: goldbergInfo.exists && goldbergInfo.gamesCount > 0,
          gameCount: goldbergInfo.gamesCount,
          games: goldbergInfo.games || [],
        };
      } catch (error) {
        this.debugManager.error('❌ Erro na verificação de migração:', error);
        return {
          hasGames: false,
          gameCount: 0,
          games: [],
          error: error.message,
        };
      }
    });
  }
}

module.exports = { GoldbergMigrationManager };
