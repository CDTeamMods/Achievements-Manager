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
var require_goldberg_migration = __commonJS({
  "src/main/modules/goldberg-migration.js"(exports, module) {
    const { ipcMain } = require("electron");
    const fs = require("node:fs").promises;
    const path = require("node:path");
    const os = require("node:os");
    const { getDebugManager } = require("./debug-manager");
    class GoldbergMigrationManager {
      static {
        __name(this, "GoldbergMigrationManager");
      }
      static {
        __name2(this, "GoldbergMigrationManager");
      }
      static {
        __name22(this, "GoldbergMigrationManager");
      }
      static {
        __name222(this, "GoldbergMigrationManager");
      }
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
          lastCheck: null
        };
      }
      /**
       * Inicializa o sistema de migração
       */
      async initialize() {
        try {
          this.currentUser = this.getCurrentUser();
          this.goldbergPath = path.join(
            "C:",
            "Users",
            this.currentUser,
            "AppData",
            "Roaming",
            "Goldberg SteamEmu Saves"
          );
          this.gseSavesPath = this.pathManager ? path.join(this.pathManager.getDataPath(), "GSE Saves") : path.join(__dirname, "..", "..", "data", "GSE Saves");
          await this.loadMigrationSettings();
          this.setupIpcHandlers();
          this.isInitialized = true;
          const goldbergInfo = await this.checkGoldbergFolder();
          if (goldbergInfo.exists && this.migrationSettings.autoMigration) {
            this.debugManager.log(
              "\u{1F504} Executando verifica\xE7\xE3o autom\xE1tica na inicializa\xE7\xE3o..."
            );
            setTimeout(() => {
              this.performAutoCheck();
            }, 3e3);
          }
          return true;
        } catch (error) {
          this.debugManager.error("\u274C Erro ao inicializar Goldberg Migration Manager:", error);
          if (this.crashReporter && this.crashReporter.reportError) {
            this.crashReporter.reportError("GoldbergMigrationManager.initialize", error);
          }
          return false;
        }
      }
      /**
       * Obtém o usuário atual do sistema
       */
      getCurrentUser() {
        try {
          let username = process.env.USERNAME || process.env.USER;
          if (username && username.trim()) {
            this.debugManager?.log(`\u{1F464} Usu\xE1rio detectado via env: ${username}`);
            return username.trim();
          }
          try {
            const userInfo = os.userInfo();
            if (userInfo && userInfo.username && userInfo.username.trim()) {
              username = userInfo.username.trim();
              this.debugManager?.log(`\u{1F464} Usu\xE1rio detectado via os.userInfo: ${username}`);
              return username;
            }
          } catch (osError) {
            this.debugManager?.warn("\u26A0\uFE0F os.userInfo() falhou:", osError.message);
          }
          try {
            const homedir = os.homedir();
            if (homedir) {
              const pathParts = homedir.split(path.sep);
              const usernameFromPath = pathParts[pathParts.length - 1];
              if (usernameFromPath && usernameFromPath.trim() && usernameFromPath !== "Users") {
                username = usernameFromPath.trim();
                this.debugManager?.log(`\u{1F464} Usu\xE1rio detectado via homedir: ${username}`);
                return username;
              }
            }
          } catch (homedirError) {
            this.debugManager?.warn(
              "\u26A0\uFE0F Extra\xE7\xE3o do homedir falhou:",
              homedirError.message
            );
          }
          const alternativeEnvs = ["USERPROFILE", "LOGNAME", "USER_NAME"];
          for (const envVar of alternativeEnvs) {
            const envValue = process.env[envVar];
            if (envValue) {
              if (envValue.includes(path.sep)) {
                const pathParts = envValue.split(path.sep);
                username = pathParts[pathParts.length - 1];
              } else {
                username = envValue;
              }
              if (username && username.trim()) {
                this.debugManager?.log(`\u{1F464} Usu\xE1rio detectado via ${envVar}: ${username}`);
                return username.trim();
              }
            }
          }
          this.debugManager?.warn(
            "\u26A0\uFE0F N\xE3o foi poss\xEDvel detectar o usu\xE1rio do sistema"
          );
          return "DefaultUser";
        } catch (error) {
          this.debugManager?.error("\u274C Erro ao detectar usu\xE1rio:", error);
          return "DefaultUser";
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
            const games = await this.getGoldbergGames();
            return {
              exists: true,
              path: this.goldbergPath,
              gamesCount: games.length,
              games,
              currentUser
            };
          }
          return {
            exists: false,
            path: this.goldbergPath,
            gamesCount: 0,
            games: [],
            currentUser
          };
        } catch (error) {
          this.debugManager.log(`\u274C Pasta Goldberg n\xE3o encontrada: ${error.message}`);
          return {
            exists: false,
            path: this.goldbergPath,
            gamesCount: 0,
            games: [],
            currentUser: this.getCurrentUser(),
            error: error.message
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
          this.debugManager.error("\u274C Erro ao obter jogos Goldberg:", error);
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
            (file) => file.includes("achievement") || file.includes("stats") || file.endsWith(".dat") || file.endsWith(".json")
          );
          return {
            id: gameId,
            name: `Game ${gameId}`,
            path: gamePath,
            achievementFiles,
            hasAchievements: achievementFiles.length > 0,
            lastModified: await this.getLastModified(gamePath)
          };
        } catch (error) {
          this.debugManager.error(`\u274C Erro ao analisar jogo ${gameId}:`, error);
          return null;
        }
      }
      /**
       * Obtém data da última modificação
       */
      async getLastModified(dirPath) {
        const stats = await fs.stat(dirPath);
        return stats.mtime.toISOString();
      }
      /**
       * Migra um jogo específico da pasta antiga Goldberg SteamEmu Saves para GSE Saves
       * Pasta origem: C:\Users\[Usuario]\AppData\Roaming\Goldberg SteamEmu Saves\[GameID]
       * Pasta destino: [AppData]\GSE Saves\[GameID]
       */
      async migrateGame(gameInfo) {
        try {
          this.debugManager.log(`\u{1F504} Migrando jogo ${gameInfo.id}...`);
          const destPath = path.join(this.gseSavesPath, gameInfo.id);
          await fs.mkdir(destPath, { recursive: true });
          const migratedFiles = [];
          for (const file of gameInfo.achievementFiles) {
            const sourcePath = path.join(gameInfo.path, file);
            const destFilePath = path.join(destPath, file);
            try {
              await fs.copyFile(sourcePath, destFilePath);
              migratedFiles.push(file);
              this.debugManager.log(`\u2705 Arquivo copiado: ${file}`);
            } catch (error) {
              this.debugManager.error(`\u274C Erro ao copiar ${file}:`, error);
            }
          }
          await this.createGSEAchievementsFile(destPath, gameInfo, migratedFiles);
          this.debugManager.log(`\u2705 Jogo ${gameInfo.id} migrado com sucesso`);
          return {
            success: true,
            gameId: gameInfo.id,
            migratedFiles,
            destPath
          };
        } catch (error) {
          this.debugManager.error(`\u274C Erro ao migrar jogo ${gameInfo.id}:`, error);
          if (global.crashReporter) {
            global.crashReporter.reportError("GoldbergMigrationManager.migrateGame", error, {
              gameId: gameInfo.id
            });
          }
          return {
            success: false,
            gameId: gameInfo.id,
            error: error.message
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
            lastModified: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
            version: "1.0.0",
            source: "Goldberg_Migration",
            originalFiles: migratedFiles,
            migrationDate: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
          };
          for (const file of migratedFiles) {
            const filePath = path.join(destPath, file);
            try {
              if (file.endsWith(".json")) {
                const content = await fs.readFile(filePath, "utf8");
                const data = JSON.parse(content);
                if (data.achievements) {
                  achievementsData.achievements = data.achievements;
                  achievementsData.totalAchievements = data.achievements.length;
                  achievementsData.unlockedCount = data.achievements.filter((a) => a.unlocked).length;
                }
              }
            } catch (error) {
              this.debugManager.log(
                `\u26A0\uFE0F N\xE3o foi poss\xEDvel processar ${file}: ${error.message}`
              );
            }
          }
          if (achievementsData.totalAchievements > 0) {
            achievementsData.completionPercentage = achievementsData.unlockedCount / achievementsData.totalAchievements * 100;
          }
          const achievementsPath = path.join(destPath, "achievements.json");
          await fs.writeFile(achievementsPath, JSON.stringify(achievementsData, null, 2));
          this.debugManager.log(`\u2705 Arquivo achievements.json criado para jogo ${gameInfo.id}`);
        } catch (error) {
          this.debugManager.error(
            `\u274C Erro ao criar achievements.json para ${gameInfo.id}:`,
            error
          );
        }
      }
      /**
       * Migra todos os jogos encontrados
       */
      async migrateAllGames() {
        try {
          this.debugManager.log("\u{1F504} Iniciando migra\xE7\xE3o completa...");
          const goldbergInfo = await this.checkGoldbergFolder();
          if (!goldbergInfo.exists || goldbergInfo.gamesCount === 0) {
            return {
              success: false,
              message: "Nenhum jogo encontrado na pasta Goldberg SteamEmu Saves"
            };
          }
          const results = [];
          for (const game of goldbergInfo.games) {
            const result = await this.migrateGame(game);
            results.push(result);
          }
          const successCount = results.filter((r) => r.success).length;
          this.debugManager.log(
            `\u2705 Migra\xE7\xE3o completa: ${successCount}/${results.length} jogos migrados`
          );
          return {
            success: true,
            totalGames: results.length,
            successCount,
            results
          };
        } catch (error) {
          this.debugManager.error("\u274C Erro na migra\xE7\xE3o completa:", error);
          if (this.crashReporter) {
            this.crashReporter.reportError("GoldbergMigrationManager.migrateAllGames", error);
          }
          return {
            success: false,
            error: error.message
          };
        }
      }
      /**
       * Carrega configurações de migração
       */
      async loadMigrationSettings() {
        try {
          const settingsPath = this.pathManager ? path.join(this.pathManager.getDataPath(), "settings", "migration-settings.json") : path.join(__dirname, "..", "..", "data", "settings", "migration-settings.json");
          const content = await fs.readFile(settingsPath, "utf8");
          this.migrationSettings = { ...this.migrationSettings, ...JSON.parse(content) };
          this.debugManager.log(
            "\u2699\uFE0F Configura\xE7\xF5es de migra\xE7\xE3o carregadas:",
            this.migrationSettings
          );
        } catch (error) {
          this.debugManager.error(
            "\u274C Erro ao carregar configura\xE7\xF5es de migra\xE7\xE3o:",
            error
          );
        }
      }
      /**
       * Salva configurações de migração
       */
      async saveMigrationSettings() {
        try {
          const settingsPath = this.pathManager ? path.join(this.pathManager.getDataPath(), "settings", "migration-settings.json") : path.join(__dirname, "..", "..", "data", "settings", "migration-settings.json");
          const settingsDir = path.dirname(settingsPath);
          await fs.mkdir(settingsDir, { recursive: true });
          await fs.writeFile(settingsPath, JSON.stringify(this.migrationSettings, null, 2));
          this.debugManager.log("\u{1F4BE} Configura\xE7\xF5es de migra\xE7\xE3o salvas");
        } catch (error) {
          this.debugManager.error(
            "\u274C Erro ao salvar configura\xE7\xF5es de migra\xE7\xE3o:",
            error
          );
        }
      }
      /**
       * Atualiza configurações de migração
       */
      async updateMigrationSettings(newSettings) {
        try {
          this.migrationSettings = { ...this.migrationSettings, ...newSettings };
          await this.saveMigrationSettings();
          this.debugManager.log(
            "\u2699\uFE0F Configura\xE7\xF5es de migra\xE7\xE3o atualizadas:",
            this.migrationSettings
          );
          return { success: true };
        } catch (error) {
          this.debugManager.error("\u274C Erro ao atualizar configura\xE7\xF5es:", error);
          return { success: false, error: error.message };
        }
      }
      /**
       * Executa verificação automática
       */
      async performAutoCheck() {
        try {
          this.debugManager.log("\u{1F50D} Executando verifica\xE7\xE3o autom\xE1tica...");
          const goldbergInfo = await this.checkGoldbergFolder();
          if (!goldbergInfo.exists || goldbergInfo.gamesCount === 0) {
            this.debugManager.log(
              "\u{1F4ED} Nenhum jogo encontrado na verifica\xE7\xE3o autom\xE1tica"
            );
            return;
          }
          const hasNewGames = await this.hasNewOrModifiedGames(goldbergInfo.games);
          if (!hasNewGames) {
            this.debugManager.log("\u{1F4CB} Nenhum jogo novo ou modificado encontrado");
            return;
          }
          this.debugManager.log(
            `\u{1F3AE} ${goldbergInfo.gamesCount} jogo(s) encontrado(s) para migra\xE7\xE3o autom\xE1tica`
          );
          if (this.migrationSettings.showDialog) {
            if (globalThis.mainWindow && !globalThis.mainWindow.isDestroyed()) {
              try {
                structuredClone(goldbergInfo);
                globalThis.mainWindow.webContents.send("goldberg-migration-dialog", goldbergInfo);
                this.debugManager.log(
                  "\u{1F4E4} Evento goldberg-migration-dialog enviado com sucesso"
                );
              } catch (cloneError) {
                this.debugManager.error(
                  "\u274C Erro de clonagem em goldberg-migration-dialog:",
                  cloneError
                );
                const serializedInfo = { ...goldbergInfo };
                globalThis.mainWindow.webContents.send("goldberg-migration-dialog", serializedInfo);
                this.debugManager.log(
                  "\u{1F4E4} Evento goldberg-migration-dialog enviado com dados serializados"
                );
              }
            }
          } else if (this.migrationSettings.autoMigration) {
            const result = await this.migrateAllGames();
            if (result.success) {
              this.debugManager.log(
                `\u2705 Migra\xE7\xE3o autom\xE1tica conclu\xEDda: ${result.successCount}/${result.totalGames} jogos`
              );
              if (globalThis.mainWindow && !globalThis.mainWindow.isDestroyed()) {
                try {
                  structuredClone(result);
                  globalThis.mainWindow.webContents.send("goldberg-migration-completed", result);
                  this.debugManager.log(
                    "\u{1F4E4} Evento goldberg-migration-completed enviado com sucesso"
                  );
                } catch (cloneError) {
                  this.debugManager.error(
                    "\u274C Erro de clonagem em goldberg-migration-completed:",
                    cloneError
                  );
                  const serializedResult = { ...result };
                  globalThis.mainWindow.webContents.send(
                    "goldberg-migration-completed",
                    serializedResult
                  );
                  this.debugManager.log(
                    "\u{1F4E4} Evento goldberg-migration-completed enviado com dados serializados"
                  );
                }
              }
            } else {
              this.debugManager.error("\u274C Erro na migra\xE7\xE3o autom\xE1tica:", result.error);
            }
          }
          this.migrationSettings.lastCheck = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString();
          await this.saveMigrationSettings();
        } catch (error) {
          this.debugManager.error("\u274C Erro na verifica\xE7\xE3o autom\xE1tica:", error);
          if (this.crashReporter) {
            this.crashReporter.reportError("GoldbergMigrationManager.performAutoCheck", error);
          }
        }
      }
      /**
       * Verifica se há jogos novos ou modificados
       */
      async hasNewOrModifiedGames(games) {
        try {
          if (!this.migrationSettings.lastCheck) {
            return true;
          }
          const lastCheckDate = new Date(this.migrationSettings.lastCheck);
          for (const game of games) {
            const gameModified = new Date(game.lastModified);
            if (gameModified > lastCheckDate) {
              this.debugManager.log(
                `\u{1F195} Jogo modificado encontrado: ${game.name} (${game.id})`
              );
              return true;
            }
            const gsePath = path.join(this.gseSavesPath, game.id);
            const gseExists = await fs.access(gsePath).then(() => true).catch(() => false);
            if (!gseExists) {
              this.debugManager.log(`\u{1F195} Jogo novo encontrado: ${game.name} (${game.id})`);
              return true;
            }
          }
          return false;
        } catch (error) {
          this.debugManager.error("\u274C Erro ao verificar jogos novos/modificados:", error);
          return true;
        }
      }
      /**
       * Configura handlers IPC
       */
      setupIpcHandlers() {
        ipcMain.handle("goldberg:checkFolder", async () => {
          return await this.checkGoldbergFolder();
        });
        ipcMain.handle("goldberg:getCurrentUser", () => {
          return this.getCurrentUser();
        });
        ipcMain.handle("goldberg:migrateAll", async () => {
          return await this.migrateAllGames();
        });
        ipcMain.handle("goldberg:migrateGame", async (event, gameInfo) => {
          return await this.migrateGame(gameInfo);
        });
        ipcMain.handle("goldberg:getSettings", () => {
          return this.migrationSettings;
        });
        ipcMain.handle("goldberg:updateSettings", async (event, settings) => {
          return await this.updateMigrationSettings(settings);
        });
        ipcMain.handle("goldberg:getStatus", async () => {
          const goldbergInfo = await this.checkGoldbergFolder();
          return {
            initialized: this.isInitialized,
            currentUser: this.currentUser,
            goldbergPath: this.goldbergPath,
            gseSavesPath: this.gseSavesPath,
            goldbergExists: goldbergInfo.exists,
            gamesCount: goldbergInfo.gamesCount,
            settings: this.migrationSettings
          };
        });
        ipcMain.handle("goldberg:getGames", async () => {
          return await this.getGoldbergGames();
        });
        ipcMain.handle("goldberg:setSetting", async (event, key, value) => {
          try {
            this.debugManager.log(
              `\u{1F527} Tentando salvar configura\xE7\xE3o: ${key} = ${value}`
            );
            if (!key || key.trim() === "") {
              throw new Error("Chave da configura\xE7\xE3o n\xE3o pode estar vazia");
            }
            if (!this.migrationSettings) {
              this.debugManager.log(
                "\u26A0\uFE0F migrationSettings n\xE3o existe, inicializando..."
              );
              this.migrationSettings = {
                autoMigration: false,
                showDialog: true,
                lastCheck: null
              };
            }
            this.debugManager.log(
              "\u{1F4CB} Estado atual das configura\xE7\xF5es:",
              this.migrationSettings
            );
            this.migrationSettings[key] = value;
            this.debugManager.log(`\u2705 Configura\xE7\xE3o ${key} atualizada para: ${value}`);
            await this.saveMigrationSettings();
            this.debugManager.log("\u{1F4BE} Configura\xE7\xF5es salvas com sucesso");
            return { success: true, message: `Configura\xE7\xE3o ${key} salva com sucesso` };
          } catch (error) {
            this.debugManager.error("\u274C Erro ao salvar configura\xE7\xE3o:", error);
            this.debugManager.error("\u{1F4CA} Stack trace:", error.stack);
            return { success: false, error: error.message, stack: error.stack };
          }
        });
        ipcMain.handle("goldberg:getLastCheck", () => {
          return this.migrationSettings.lastCheck || null;
        });
        ipcMain.handle("goldberg:checkMigration", async () => {
          try {
            const goldbergInfo = await this.checkGoldbergFolder();
            this.migrationSettings.lastCheck = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString();
            await this.saveMigrationSettings();
            return {
              hasGames: goldbergInfo.exists && goldbergInfo.gamesCount > 0,
              gameCount: goldbergInfo.gamesCount,
              games: goldbergInfo.games || []
            };
          } catch (error) {
            this.debugManager.error("\u274C Erro na verifica\xE7\xE3o de migra\xE7\xE3o:", error);
            return {
              hasGames: false,
              gameCount: 0,
              games: [],
              error: error.message
            };
          }
        });
      }
    }
    module.exports = { GoldbergMigrationManager };
  }
});
var goldberg_migration_default = require_goldberg_migration();
export {
  goldberg_migration_default as default
};
