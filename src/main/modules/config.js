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
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name222 = /* @__PURE__ */ __name22(
  (target, value) => __defProp222(target, "name", { value, configurable: true }),
  "__name"
);
var __commonJS = /* @__PURE__ */ __name22(
  (cb, mod) => /* @__PURE__ */ __name22(
    /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function __require() {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    }, "__require"), "__require"),
    "__require"
  ),
  "__commonJS"
);
var require_config = __commonJS({
  "src/main/modules/config.js"(exports, module) {
    const { ipcMain } = require("electron");
    const path = require("node:path");
    const fs = require("node:fs").promises;
    const { getDebugManager } = require("./debug-manager");
    const { getPathManager } = require("./path-manager");
    class ConfigManager {
      static {
        __name(this, "ConfigManager");
      }
      static {
        __name2(this, "ConfigManager");
      }
      static {
        __name22(this, "ConfigManager");
      }
      static {
        __name222(this, "ConfigManager");
      }
      constructor() {
        this.configPath = null;
        this.config = {};
        this.debugManager = getDebugManager();
        this.defaultConfig = {
          // Configurações básicas
          setupComplete: false,
          language: "pt-BR",
          theme: "dark",
          liteMode: false,
          virtualScrolling: true,
          autoStartWindows: false,
          isInstalledVersion: false,
          // Configurações de API
          apiSource: "steam",
          // Configurações de performance
          performance: {
            enableVirtualScrolling: true,
            showTooltips: true,
            autoSync: true,
            cacheSize: 100
          },
          // Configurações individuais (para compatibilidade)
          showTooltips: true,
          autoSync: true,
          cacheSize: 100,
          // Configurações de sistema
          crashReports: true
        };
      }
      async init(userDataPath) {
        const pathManager = getPathManager();
        if (pathManager.isInstalledVersion()) {
          this.configPath = path.join(userDataPath, "config.json");
        } else {
          const settingsPath = path.join(pathManager.getDataPath(), "settings");
          this.configPath = path.join(settingsPath, "app.json");
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
          const settingsPath = path.join(dataPath, "settings");
          await this.ensureConfigFile(this.configPath, this.defaultConfig);
          const migrationConfigPath = path.join(settingsPath, "migration-settings.json");
          const defaultMigrationConfig = {
            version: "0.0.1-beta",
            lastMigration: null,
            autoMigration: true,
            backupBeforeMigration: true,
            migrationHistory: []
          };
          await this.ensureConfigFile(migrationConfigPath, defaultMigrationConfig);
          this.debugManager.log("\u2705 Configura\xE7\xF5es padr\xE3o inicializadas com sucesso");
          return true;
        } catch (error) {
          this.debugManager.error(
            "\u274C Erro ao inicializar configura\xE7\xF5es padr\xE3o:",
            error
          );
          throw error;
        }
      }
      /**
       * Garante que um arquivo de configuração existe com valores padrão
       */
      async ensureConfigFile(filePath, defaultConfig) {
        try {
          const configDir = path.dirname(filePath);
          await fs.mkdir(configDir, { recursive: true });
          try {
            await fs.access(filePath);
            this.debugManager.log(
              `\u{1F4C4} Arquivo de configura\xE7\xE3o j\xE1 existe: ${path.basename(filePath)}`
            );
            return;
          } catch {
          }
          await fs.writeFile(filePath, JSON.stringify(defaultConfig, null, 2), "utf8");
          this.debugManager.log(
            `\u{1F4C4} Arquivo de configura\xE7\xE3o criado: ${path.basename(filePath)}`
          );
        } catch (error) {
          this.debugManager.error(
            `\u274C Erro ao criar arquivo de configura\xE7\xE3o ${filePath}:`,
            error
          );
          throw error;
        }
      }
      async loadConfig() {
        try {
          const configData = await fs.readFile(this.configPath, "utf8");
          this.config = { ...this.defaultConfig, ...JSON.parse(configData) };
          if (this.config.version !== this.defaultConfig.version) {
            await this.migrateConfig();
          }
          await this.protectCriticalSettings();
        } catch (error) {
          if (error.code === "ENOENT") {
            this.config = { ...this.defaultConfig };
            await this.saveConfig();
          } else {
            this.config = { ...this.defaultConfig };
          }
        }
      }
      async saveConfig() {
        try {
          await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2), "utf8");
          this.debugManager.log("\u2705 Configura\xE7\xF5es salvas com sucesso");
        } catch (error) {
          this.debugManager.error("\u274C Erro ao salvar configura\xE7\xF5es:", error);
        }
      }
      /**
       * Migra configurações antigas para a versão atual
       */
      async migrateConfig() {
        try {
          this.debugManager.log("\u{1F504} Migrando configura\xE7\xF5es para nova vers\xE3o...");
          this.config.version = this.defaultConfig.version;
          if (this.config.steamApiKey) {
            delete this.config.steamApiKey;
            this.debugManager.log(
              "\u{1F5D1}\uFE0F Removida configura\xE7\xE3o obsoleta: steamApiKey"
            );
          }
          if (this.config.steamUserId) {
            delete this.config.steamUserId;
            this.debugManager.log(
              "\u{1F5D1}\uFE0F Removida configura\xE7\xE3o obsoleta: steamUserId"
            );
          }
          await this.saveConfig();
          this.debugManager.log("\u2705 Migra\xE7\xE3o de configura\xE7\xF5es conclu\xEDda");
        } catch (error) {
          this.debugManager.error(
            "\u274C Erro durante migra\xE7\xE3o de configura\xE7\xF5es:",
            error
          );
        }
      }
      /**
       * Protege configurações críticas em modo portable
       * Evita que alterações manuais no config.json quebrem o aplicativo
       */
      async protectCriticalSettings() {
        const pathManager = getPathManager();
        if (!pathManager || pathManager.isInstalledVersion()) {
          return;
        }
        let needsSave = false;
        const criticalSettings = {
          isInstalledVersion: false,
          steamPath: this.defaultConfig.steamPath,
          userDataPath: this.defaultConfig.userDataPath
        };
        for (const [key, safeValue] of Object.entries(criticalSettings)) {
          if (this.config[key] !== safeValue) {
            this.config[key] = safeValue;
            needsSave = true;
          }
        }
        if (needsSave) {
          await this.saveConfig();
        }
      }
      get(key) {
        return key ? this.config[key] : this.config;
      }
      async set(key, value) {
        if (typeof key === "object") {
          const filteredConfig = this.filterCriticalSettings(key);
          const validatedConfig = this.validateSettings(filteredConfig);
          this.config = { ...this.config, ...validatedConfig };
        } else {
          if (this.isCriticalSetting(key, value)) {
            return this.config;
          }
          if (!this.isValidSetting(key)) {
            this.debugManager.warn(`\u26A0\uFE0F Configura\xE7\xE3o desconhecida ignorada: ${key}`);
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
        const flattenKeys = /* @__PURE__ */ __name222((obj, prefix = "") => {
          const keys = [];
          for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            keys.push(fullKey);
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
              keys.push(...flattenKeys(value, fullKey));
            }
          }
          return keys;
        }, "flattenKeys");
        return flattenKeys(this.defaultConfig);
      }
      /**
       * Valida um objeto de configurações, mantendo apenas as conhecidas
       */
      validateSettings(settings) {
        if (!settings || typeof settings !== "object") {
          return {};
        }
        const allowedKeys = this.getAllowedSettingKeys();
        const validated = {};
        for (const [key, value] of Object.entries(settings)) {
          if (allowedKeys.includes(key)) {
            validated[key] = value;
          } else {
            this.debugManager.warn(`\u26A0\uFE0F Configura\xE7\xE3o desconhecida ignorada: ${key}`);
          }
        }
        return validated;
      }
      /**
       * Verifica se uma configuração é crítica e não deve ser alterada em modo portable
       */
      isCriticalSetting(key, value) {
        const pathManager = getPathManager();
        if (!pathManager || pathManager.isInstalledVersion()) {
          return false;
        }
        const criticalKeys = ["isInstalledVersion", "steamPath", "userDataPath"];
        if (criticalKeys.includes(key)) {
          if (key === "isInstalledVersion" && value !== false) {
            return true;
          }
          if ((key === "steamPath" || key === "userDataPath") && value !== this.defaultConfig[key]) {
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
        if (!pathManager || pathManager.isInstalledVersion()) {
          return configObject;
        }
        const filtered = { ...configObject };
        const criticalKeys = ["isInstalledVersion", "steamPath", "userDataPath"];
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
        ipcMain.handle("config:get", (event, key) => {
          return this.get(key);
        });
        ipcMain.handle("config:getAll", () => {
          return this.config;
        });
        ipcMain.handle("config:set", async (event, key, value) => {
          return await this.set(key, value);
        });
        ipcMain.handle("config:reset", async () => {
          return await this.reset();
        });
        ipcMain.handle("test-steam-connection", async (event, { apiKey, steamId }) => {
          try {
            const { getSteamIntegrationManager } = require("./steam-integration");
            const steamManager = getSteamIntegrationManager();
            const result = await steamManager.testConnection(apiKey, steamId);
            return result;
          } catch (error) {
            this.debugManager.error("\u274C Erro ao testar conex\xE3o Steam:", error);
            return {
              success: false,
              error: "Erro interno ao testar conex\xE3o"
            };
          }
        });
      }
    }
    module.exports = ConfigManager;
  }
});
var config_default = require_config();
export {
  config_default as default
};
