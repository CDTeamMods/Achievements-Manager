const fs = require('fs').promises;
const path = require('path');
const { getDebugManager } = require('./debug-manager');

/**
 * Gerenciador de configurações padrão
 * Cria automaticamente arquivos de configuração necessários
 */
class DefaultConfigManager {
  constructor(pathManager = null, crashReporter = null) {
    this.pathManager = pathManager;
    this.crashReporter = crashReporter;
    this.debugManager = getDebugManager();
  }

  /**
   * Configurações padrão do aplicativo
   */
  getDefaultAppConfig() {
    return {
      setupComplete: false,
      language: 'en',
      theme: 'auto',
      liteMode: true,
      virtualScrolling: true,
      showTooltips: true,
      notifications: {
        enabled: true,
        sound: true,
        position: 'bottom-right',
      },

      autoUpdate: true,
      crashReports: true,
    };
  }

  /**
   * Configurações padrão de migração
   */
  getDefaultMigrationConfig() {
    return {
      autoMigration: false,
      showDialog: true,
      lastCheck: null,
    };
  }

  /**
   * Configurações padrão gerais
   */
  getDefaultSettings() {
    return {
      language: 'en',
      theme: 'auto',
      lastSync: null,
    };
  }

  /**
   * Cria um arquivo de configuração se não existir
   */
  async ensureConfigFile(filePath, defaultConfig) {
    try {
      // Verifica se o arquivo existe
      await fs.access(filePath);
    } catch (error) {
      // Arquivo não existe, criar com configurações padrão
      try {
        // Criar diretório se não existir
        await fs.mkdir(path.dirname(filePath), { recursive: true });

        // Criar arquivo com configurações padrão
        await fs.writeFile(filePath, JSON.stringify(defaultConfig, null, 2), 'utf8');
      } catch (createError) {
        this.debugManager.error(
          `❌ Erro ao criar arquivo de configuração ${path.basename(filePath)}:`,
          createError
        );

        if (this.crashReporter && this.crashReporter.logError) {
          this.crashReporter.logError('DefaultConfigManager', createError, {
            action: 'ensureConfigFile',
            filePath: filePath,
          });
        }

        throw createError;
      }
    }
  }

  /**
   * Inicializa todas as configurações padrão
   */
  async initializeDefaultConfigs() {
    try {
      const dataPath = this.pathManager
        ? this.pathManager.getDataPath()
        : path.join(__dirname, '..', '..', 'data');

      const settingsPath = path.join(dataPath, 'settings');

      // Migrar configurações antigas antes de criar as novas
      await this.migrateOldSettings();

      // Criar arquivos de configuração padrão
      await this.ensureConfigFile(path.join(settingsPath, 'app.json'), this.getDefaultAppConfig());

      await this.ensureConfigFile(
        path.join(settingsPath, 'migration-settings.json'),
        this.getDefaultMigrationConfig()
      );

      this.debugManager.log('✅ Configurações padrão inicializadas com sucesso');
    } catch (error) {
      this.debugManager.error('❌ Erro ao inicializar configurações padrão:', error);

      if (this.crashReporter && typeof this.crashReporter.logError === 'function') {
        this.crashReporter.logError('DefaultConfigManager', error, {
          action: 'initializeDefaultConfigs',
        });
      }

      throw error;
    }
  }

  /**
   * Verifica e atualiza configurações existentes com novos campos
   */
  async updateConfigIfNeeded(filePath, defaultConfig) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const currentConfig = JSON.parse(content);

      // Verificar se há novos campos no defaultConfig
      let hasNewFields = false;
      const updatedConfig = { ...currentConfig };

      for (const [key, value] of Object.entries(defaultConfig)) {
        if (!(key in currentConfig)) {
          updatedConfig[key] = value;
          hasNewFields = true;
        }
      }

      if (hasNewFields) {
        await fs.writeFile(filePath, JSON.stringify(updatedConfig, null, 2), 'utf8');
      }
    } catch (error) {
      // Erro ao atualizar configuração
    }
  }

  /**
   * Migra configurações antigas do settings.json para settings/app.json
   */
  async migrateOldSettings() {
    try {
      if (!this.pathManager) {
        return;
      }

      const dataPath = this.pathManager.getDataPath();
      const settingsPath = this.pathManager.getPaths().settings;

      const oldSettingsPath = path.join(dataPath, 'settings.json');
      const newSettingsPath = path.join(settingsPath, 'app.json');

      // Verifica se o arquivo antigo existe
      try {
        await fs.access(oldSettingsPath);
      } catch (error) {
        // Arquivo antigo não existe, não há nada para migrar
        return;
      }

      // Verifica se o novo arquivo já existe
      try {
        await fs.access(newSettingsPath);
        await fs.unlink(oldSettingsPath);
        return;
      } catch (error) {
        // Novo arquivo não existe, proceder com a migração
      }

      // Lê as configurações antigas
      const oldSettingsContent = await fs.readFile(oldSettingsPath, 'utf8');
      const oldSettings = JSON.parse(oldSettingsContent);

      // Migra configurações para o novo formato
      const migratedSettings = {
        ...oldSettings,
      };

      // Garante que o diretório de configurações existe
      await fs.mkdir(settingsPath, { recursive: true });

      // Salva no novo local
      await fs.writeFile(newSettingsPath, JSON.stringify(migratedSettings, null, 2), 'utf8');

      // Remove o arquivo antigo
      await fs.unlink(oldSettingsPath);
    } catch (error) {
      this.debugManager.error('❌ Erro ao migrar configurações antigas:', error);

      if (this.crashReporter && typeof this.crashReporter.logError === 'function') {
        this.crashReporter.logError('DefaultConfigManager', error, {
          action: 'migrateOldSettings',
        });
      }
    }
  }
}

// Instância global
let defaultConfigManager = null;

/**
 * Configura o gerenciador de configurações padrão
 */
function setupDefaultConfig(pathManager = null, crashReporter = null) {
  if (!defaultConfigManager) {
    defaultConfigManager = new DefaultConfigManager(pathManager, crashReporter);
  }
  return defaultConfigManager;
}

/**
 * Obtém o gerenciador de configurações padrão
 */
function getDefaultConfigManager() {
  return defaultConfigManager;
}

module.exports = {
  DefaultConfigManager,
  setupDefaultConfig,
  getDefaultConfigManager,
};
