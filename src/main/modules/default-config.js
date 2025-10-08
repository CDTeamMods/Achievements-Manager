var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2(
  (target, value) => __defProp22(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp222 = Object.defineProperty;
var __name222 = /* @__PURE__ */ __name22(
  (target, value) => __defProp222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp2222 = Object.defineProperty;
var __name2222 = /* @__PURE__ */ __name222(
  (target, value) => __defProp2222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp22222 = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name22222 = /* @__PURE__ */ __name2222(
  (target, value) => __defProp22222(target, "name", { value, configurable: true }),
  "__name"
);
var __commonJS = /* @__PURE__ */ __name2222(
  (cb, mod) => /* @__PURE__ */ __name2222(
    /* @__PURE__ */ __name222(
      /* @__PURE__ */ __name22(
        /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function __require() {
          return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
        }, "__require"), "__require"),
        "__require"
      ),
      "__require"
    ),
    "__require"
  ),
  "__commonJS"
);
var require_default_config = __commonJS({
  "src/main/modules/default-config.js"(exports, module) {
    const fs = require("node:fs").promises;
    const path = require("node:path");
    const { getDebugManager } = require("./debug-manager");
    class DefaultConfigManager {
      static {
        __name(this, "DefaultConfigManager");
      }
      static {
        __name2(this, "DefaultConfigManager");
      }
      static {
        __name22(this, "DefaultConfigManager");
      }
      static {
        __name222(this, "DefaultConfigManager");
      }
      static {
        __name2222(this, "DefaultConfigManager");
      }
      static {
        __name22222(this, "DefaultConfigManager");
      }
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
          // Configurações básicas
          setupComplete: false,
          language: "pt-BR",
          theme: "dark",
          liteMode: true,
          virtualScrolling: true,
          autoStartWindows: false,
          minimizeToTray: false,
          isInstalledVersion: false,
          // Configurações de API
          apiSource: "steam",
          // Configurações de performance
          performance: {
            enableVirtualScrolling: true,
            enableLazyLoading: true,
            showTooltips: true,
            autoSync: true,
            cacheSize: 100
          },
          // Configurações de janela
          windowBounds: {
            width: 1200,
            height: 800,
            x: void 0,
            y: void 0
          },
          // Configurações individuais (para compatibilidade)
          showTooltips: true,
          autoSync: true,
          cacheSize: "100",
          // Configurações de sistema
          crashReports: true,
          // Cache
          cache: {
            images: {}
          }
        };
      }
      /**
       * Configurações padrão de migração
       */
      getDefaultMigrationConfig() {
        return {
          autoMigration: false,
          showDialog: true,
          lastCheck: null
        };
      }
      /**
       * Configurações padrão gerais
       */
      getDefaultSettings() {
        return {
          language: "en",
          theme: "auto",
          lastSync: null
        };
      }
      /**
       * Cria um arquivo de configuração se não existir
       */
      async ensureConfigFile(filePath) {
        await fs.access(filePath);
      }
      /**
       * Inicializa todas as configurações padrão
       */
      async initializeDefaultConfigs() {
        try {
          const dataPath = this.pathManager ? this.pathManager.getDataPath() : path.join(__dirname, "..", "..", "data");
          const settingsPath = path.join(dataPath, "settings");
          await this.migrateOldSettings();
          await this.ensureConfigFile(
            path.join(settingsPath, "app.json"),
            this.getDefaultAppConfig()
          );
          await this.ensureConfigFile(
            path.join(settingsPath, "migration-settings.json"),
            this.getDefaultMigrationConfig()
          );
          this.debugManager.log("\u2705 Configura\xE7\xF5es padr\xE3o inicializadas com sucesso");
        } catch (error) {
          this.debugManager.error(
            "\u274C Erro ao inicializar configura\xE7\xF5es padr\xE3o:",
            error
          );
          if (this.crashReporter && typeof this.crashReporter.logError === "function") {
            this.crashReporter.logError("DefaultConfigManager", error, {
              action: "initializeDefaultConfigs"
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
          const content = await fs.readFile(filePath, "utf8");
          const currentConfig = JSON.parse(content);
          let hasNewFields = false;
          const updatedConfig = { ...currentConfig };
          for (const [key, value] of Object.entries(defaultConfig)) {
            if (!(key in currentConfig)) {
              updatedConfig[key] = value;
              hasNewFields = true;
            }
          }
          if (hasNewFields) {
            await fs.writeFile(filePath, JSON.stringify(updatedConfig, null, 2), "utf8");
          }
        } catch {
          return;
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
          const oldSettingsPath = path.join(dataPath, "settings.json");
          const newSettingsPath = path.join(settingsPath, "app.json");
          const oldSettingsContent = await fs.readFile(oldSettingsPath, "utf8");
          const oldSettings = JSON.parse(oldSettingsContent);
          const migratedSettings = {
            ...oldSettings
          };
          await fs.mkdir(settingsPath, { recursive: true });
          await fs.writeFile(newSettingsPath, JSON.stringify(migratedSettings, null, 2), "utf8");
          await fs.unlink(oldSettingsPath);
        } catch (error) {
          this.debugManager.error("\u274C Erro ao migrar configura\xE7\xF5es antigas:", error);
          if (this.crashReporter && typeof this.crashReporter.logError === "function") {
            this.crashReporter.logError("DefaultConfigManager", error, {
              action: "migrateOldSettings"
            });
          }
        }
      }
    }
    let defaultConfigManager = null;
    function setupDefaultConfig(pathManager = null, crashReporter = null) {
      if (!defaultConfigManager) {
        defaultConfigManager = new DefaultConfigManager(pathManager, crashReporter);
      }
      return defaultConfigManager;
    }
    __name(setupDefaultConfig, "setupDefaultConfig");
    __name2(setupDefaultConfig, "setupDefaultConfig");
    __name22(setupDefaultConfig, "setupDefaultConfig");
    __name222(setupDefaultConfig, "setupDefaultConfig");
    __name2222(setupDefaultConfig, "setupDefaultConfig");
    __name22222(setupDefaultConfig, "setupDefaultConfig");
    function getDefaultConfigManager() {
      return defaultConfigManager;
    }
    __name(getDefaultConfigManager, "getDefaultConfigManager");
    __name2(getDefaultConfigManager, "getDefaultConfigManager");
    __name22(getDefaultConfigManager, "getDefaultConfigManager");
    __name222(getDefaultConfigManager, "getDefaultConfigManager");
    __name2222(getDefaultConfigManager, "getDefaultConfigManager");
    __name22222(getDefaultConfigManager, "getDefaultConfigManager");
    module.exports = {
      DefaultConfigManager,
      setupDefaultConfig,
      getDefaultConfigManager
    };
  }
});
var default_config_default = require_default_config();
export {
  default_config_default as default
};
