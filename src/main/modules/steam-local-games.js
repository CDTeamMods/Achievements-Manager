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
var require_steam_local_games = __commonJS({
  "src/main/modules/steam-local-games.js"(exports, module) {
    const fs = require("node:fs").promises;
    const path = require("node:path");
    const { ipcMain } = require("electron");
    class SteamLocalGamesManager {
      static {
        __name(this, "SteamLocalGamesManager");
      }
      static {
        __name2(this, "SteamLocalGamesManager");
      }
      static {
        __name22(this, "SteamLocalGamesManager");
      }
      static {
        __name222(this, "SteamLocalGamesManager");
      }
      static {
        __name2222(this, "SteamLocalGamesManager");
      }
      static {
        __name22222(this, "SteamLocalGamesManager");
      }
      constructor(debugManager, crashReporter) {
        this.debugManager = debugManager;
        this.crashReporter = crashReporter;
        this.installedGames = /* @__PURE__ */ new Set();
        this.steamPaths = [];
        this.lastScan = null;
        this.setupIpcHandlers();
      }
      /**
       * Configurar handlers IPC
       */
      setupIpcHandlers() {
        ipcMain.handle("steam.getInstalledGames", async () => {
          return await this.getInstalledGames();
        });
        ipcMain.handle("steam.scanInstalledGames", async () => {
          return await this.scanInstalledGames();
        });
        ipcMain.handle("steam.isGameInstalled", async (event, appId) => {
          return this.isGameInstalled(appId);
        });
      }
      /**
       * Detectar caminhos do Steam automaticamente
       */
      async detectSteamPaths() {
        const possiblePaths = [
          "C:\\Program Files (x86)\\Steam",
          "C:\\Program Files\\Steam",
          "D:\\Steam",
          "E:\\Steam",
          "F:\\Steam"
        ];
        const validPaths = [];
        for (const steamPath of possiblePaths) {
          const steamAppsPath = path.join(steamPath, "steamapps");
          await fs.access(steamAppsPath);
          validPaths.push(steamAppsPath);
        }
        for (const steamAppsPath of validPaths) {
          const libraryFoldersPath = path.join(steamAppsPath, "libraryfolders.vdf");
          const libraryContent = await fs.readFile(libraryFoldersPath, "utf8");
          const pathMatches = libraryContent.match(/"path"\s+"([^"]+)"/g);
          if (pathMatches) {
            for (const match of pathMatches) {
              const pathMatch = match.match(/"path"\s+"([^"]+)"/);
              if (pathMatch) {
                const additionalPath = path.join(pathMatch[1].replace(/\\\\/g, "\\"), "steamapps");
                if (!validPaths.includes(additionalPath)) {
                  await fs.access(additionalPath);
                  validPaths.push(additionalPath);
                }
              }
            }
          }
        }
        this.steamPaths = validPaths;
        return validPaths;
      }
      /**
       * Escanear jogos instalados em todos os caminhos Steam
       */
      async scanInstalledGames() {
        try {
          if (this.steamPaths.length === 0) {
            await this.detectSteamPaths();
          }
          if (this.steamPaths.length === 0) {
            return {
              success: false,
              error: "Nenhuma instala\xE7\xE3o do Steam encontrada",
              installedGames: []
            };
          }
          const installedGames = /* @__PURE__ */ new Set();
          for (const steamAppsPath of this.steamPaths) {
            const files = await fs.readdir(steamAppsPath).catch((err) => {
              this.debugManager?.warn(
                `\u26A0\uFE0F Erro ao escanear ${steamAppsPath}:`,
                err.message
              );
              return [];
            });
            for (const file of files) {
              if (file.startsWith("appmanifest_") && file.endsWith(".acf")) {
                const appId = file.match(/appmanifest_(\d+)\.acf/);
                if (appId) {
                  const gameAppId = appId[1];
                  const manifestPath = path.join(steamAppsPath, file);
                  const manifestContent = await fs.readFile(manifestPath, "utf8").catch((err) => {
                    this.debugManager?.warn(
                      `\u26A0\uFE0F Erro ao ler manifest ${file}:`,
                      err.message
                    );
                    return null;
                  });
                  if (!manifestContent) continue;
                  const stateFlagsMatch = manifestContent.match(/"StateFlags"\s+"(\d+)"/);
                  if (stateFlagsMatch) {
                    const stateFlags = parseInt(stateFlagsMatch[1]);
                    if (stateFlags === 4) {
                      installedGames.add(gameAppId);
                    }
                  }
                }
              }
            }
          }
          this.installedGames = installedGames;
          this.lastScan = /* @__PURE__ */ new Date();
          return {
            success: true,
            installedGames: Array.from(installedGames),
            totalInstalled: installedGames.size,
            steamPaths: this.steamPaths,
            lastScan: this.lastScan
          };
        } catch (error) {
          this.crashReporter.logError("SteamLocalGamesManager.scanInstalledGames", error);
          return {
            success: false,
            error: `Erro ao escanear jogos: ${error.message}`,
            installedGames: []
          };
        }
      }
      /**
       * Obter lista de jogos instalados (com cache)
       */
      async getInstalledGames() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1e3);
        if (!this.lastScan || this.lastScan < oneHourAgo) {
          return await this.scanInstalledGames();
        }
        return {
          success: true,
          installedGames: Array.from(this.installedGames),
          totalInstalled: this.installedGames.size,
          steamPaths: this.steamPaths,
          lastScan: this.lastScan,
          fromCache: true
        };
      }
      /**
       * Verificar se um jogo específico está instalado
       */
      isGameInstalled(appId) {
        return this.installedGames.has(String(appId));
      }
      /**
       * Filtrar lista de jogos para mostrar apenas os instalados
       */
      filterInstalledGames(allGames) {
        if (!Array.isArray(allGames)) {
          return [];
        }
        return allGames.filter((game) => {
          const gameId = String(game.id || game.appid || game.appID);
          return this.installedGames.has(gameId);
        });
      }
      /**
       * Obter estatísticas
       */
      getStats() {
        return {
          totalInstalled: this.installedGames.size,
          steamPaths: this.steamPaths.length,
          lastScan: this.lastScan,
          isInitialized: this.steamPaths.length > 0
        };
      }
    }
    module.exports = SteamLocalGamesManager;
  }
});
var steam_local_games_default = require_steam_local_games();
export {
  steam_local_games_default as default
};
