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
var __name22222 = /* @__PURE__ */ __name2222(
  (target, value) => __defProp22222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp222222 = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name222222 = /* @__PURE__ */ __name22222(
  (target, value) => __defProp222222(target, "name", { value, configurable: true }),
  "__name"
);
var __commonJS = /* @__PURE__ */ __name22222(
  (cb, mod) => /* @__PURE__ */ __name22222(
    /* @__PURE__ */ __name2222(
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
    "__require"
  ),
  "__commonJS"
);
var require_gse_saves = __commonJS({
  "src/main/modules/gse-saves.js"(exports, module) {
    const { ipcMain } = require("electron");
    const fs = require("node:fs").promises;
    const path = require("node:path");
    const os = require("node:os");
    class GSESavesManager {
      static {
        __name(this, "GSESavesManager");
      }
      static {
        __name2(this, "GSESavesManager");
      }
      static {
        __name22(this, "GSESavesManager");
      }
      static {
        __name222(this, "GSESavesManager");
      }
      static {
        __name2222(this, "GSESavesManager");
      }
      static {
        __name22222(this, "GSESavesManager");
      }
      static {
        __name222222(this, "GSESavesManager");
      }
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
          return true;
        } catch (error) {
          this.debugManager?.error("\u274C Erro ao inicializar GSE Saves Manager:", error);
          return false;
        }
      }
      /**
       * Detecta o usuário local do sistema
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
          return null;
        } catch (error) {
          this.debugManager?.error("\u274C Erro ao detectar usu\xE1rio:", error);
          return null;
        }
      }
      /**
       * Verifica se uma pasta existe
       */
      async checkDirectoryExists(dirPath) {
        const stats = await fs.stat(dirPath);
        return stats.isDirectory();
      }
      /**
       * Detecta automaticamente as pastas do GSE Saves
       */
      async detectGSESavesPaths() {
        this.debugManager?.log("\u{1F50D} Detectando pastas do GSE Saves...");
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
          throw new Error("N\xE3o foi poss\xEDvel detectar o usu\xE1rio atual");
        }
        const possiblePaths = [
          `C:\\Users\\${currentUser}\\AppData\\Roaming\\GSE Saves`,
          `C:\\Users\\${currentUser}\\AppData\\Roaming\\Goldberg SteamEmu Saves`,
          // Caminhos alternativos caso o usuário tenha configurações diferentes
          `C:\\Users\\${currentUser}\\Documents\\GSE Saves`,
          `C:\\Users\\${currentUser}\\Documents\\Goldberg SteamEmu Saves`
        ];
        this.gseSavesPaths = [];
        for (const dirPath of possiblePaths) {
          const exists = await this.checkDirectoryExists(dirPath);
          if (exists) {
            this.debugManager?.log(`\u2705 Pasta encontrada: ${dirPath}`);
            this.gseSavesPaths.push({
              path: dirPath,
              type: dirPath.includes("Goldberg") ? "goldberg" : "gse",
              name: path.basename(dirPath)
            });
          }
        }
        if (this.gseSavesPaths.length === 0) {
          this.debugManager?.log("\u26A0\uFE0F Nenhuma pasta GSE Saves encontrada");
        } else {
          this.debugManager?.log(
            `\u{1F3AF} Total de pastas GSE Saves encontradas: ${this.gseSavesPaths.length}`
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
            this.debugManager?.log(`\u{1F3AE} Escaneando jogos em: ${saveFolder.path}`);
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
                    sourceFolder: saveFolder.name
                  });
                }
              }
            } catch (error) {
              this.debugManager?.error(`\u274C Erro ao escanear ${saveFolder.path}:`, error);
            }
          }
          this.debugManager?.log(`\u{1F3AF} Total de jogos encontrados: ${games.length}`);
          return games;
        } catch (error) {
          this.debugManager?.error("\u274C Erro ao buscar jogos GSE Saves:", error);
          return [];
        }
      }
      /**
       * Obtém achievements de um jogo específico
       */
      async getGSESavesAchievements(gameId) {
        try {
          this.debugManager?.log(`\u{1F3C6} Buscando achievements para: ${gameId}`);
          const achievements = [];
          for (const saveFolder of this.gseSavesPaths) {
            const gamePath = path.join(saveFolder.path, gameId);
            const exists = await this.checkDirectoryExists(gamePath);
            if (exists) {
              this.debugManager?.log(`\u{1F4C1} Jogo encontrado em: ${gamePath}`);
              const files = await fs.readdir(gamePath);
              for (const file of files) {
                if (file.includes("achievement") || file.includes("stats") || file.endsWith(".dat")) {
                  const filePath = path.join(gamePath, file);
                  achievements.push({
                    id: file,
                    name: file,
                    path: filePath,
                    source: saveFolder.type,
                    unlocked: true,
                    // Por padrão, se existe o arquivo, foi desbloqueado
                    unlockedAt: null
                    // Seria necessário ler o arquivo para obter a data
                  });
                }
              }
            }
          }
          this.debugManager?.log(
            `\u{1F3C6} Achievements encontrados para ${gameId}: ${achievements.length}`
          );
          return achievements;
        } catch (error) {
          this.debugManager?.error(`\u274C Erro ao buscar achievements para ${gameId}:`, error);
          return [];
        }
      }
      /**
       * Configura os handlers IPC
       */
      setupIpcHandlers() {
        ipcMain.handle("gse:detectPaths", async () => {
          return await this.detectGSESavesPaths();
        });
        ipcMain.handle("gse:getCurrentUser", () => {
          return this.getCurrentUser();
        });
        ipcMain.handle("gse:getGames", async () => {
          return await this.getGSESavesGames();
        });
        ipcMain.handle("gse:getAchievements", async (event, gameId) => {
          return await this.getGSESavesAchievements(gameId);
        });
        ipcMain.handle("gse:getStatus", () => {
          return {
            initialized: this.isInitialized,
            pathsFound: this.gseSavesPaths.length,
            paths: this.gseSavesPaths,
            currentUser: this.getCurrentUser()
          };
        });
      }
    }
    module.exports = { GSESavesManager };
  }
});
var gse_saves_default = require_gse_saves();
export {
  gse_saves_default as default
};
