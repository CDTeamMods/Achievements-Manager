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
var require_filesystem = __commonJS({
  "src/main/modules/filesystem.js"(exports, module) {
    const { ipcMain, dialog } = require("electron");
    const fs = require("node:fs").promises;
    const fsSync = require("node:fs");
    const path = require("node:path");
    const { getDebugManager } = require("./debug-manager");
    class FilesystemManager {
      static {
        __name(this, "FilesystemManager");
      }
      static {
        __name2(this, "FilesystemManager");
      }
      static {
        __name22(this, "FilesystemManager");
      }
      static {
        __name222(this, "FilesystemManager");
      }
      static {
        __name2222(this, "FilesystemManager");
      }
      static {
        __name22222(this, "FilesystemManager");
      }
      constructor(pathManager, crashReporter = null, configManager = null) {
        this.pathManager = pathManager;
        this.crashReporter = crashReporter;
        this.configManager = configManager;
        this.debug = getDebugManager();
        const paths = pathManager.getPaths();
        this.dataPath = pathManager.getDataPath();
        this.cachePath = paths.cache;
        this.logsPath = paths.logs;
      }
      async init() {
        try {
          await this.createDirectories();
          this.setupFileWatchers();
          this.debug.info("\u{1F4C1} Filesystem Manager initialized successfully");
          return true;
        } catch (error) {
          this.debug.error("\u274C Error initializing Filesystem Manager:", error);
          await this.reportFilesystemError("init", error, { operation: "initialization" });
          throw error;
        }
      }
      /**
       * Reporta erros de filesystem para o crash-reporter
       */
      async reportFilesystemError(operation, error, context = {}) {
        try {
          if (this.crashReporter) {
            const errorContext = {
              operation,
              isPortable: this.pathManager?.isInstalledVersion() === false,
              dataPath: this.dataPath,
              timestamp: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
              ...context
            };
            await this.crashReporter.reportCrash("filesystem", error, errorContext);
            if (this.debug?.isDebugEnabled) {
              this.debug.error("Filesystem error reported:", operation, error.message);
            }
          }
        } catch (reportError) {
          this.debug.warn("\u26A0\uFE0F Failed to report filesystem error:", reportError);
        }
      }
      async createDirectories() {
        const essentialDirectories = [
          this.dataPath,
          path.join(this.dataPath, "settings"),
          this.cachePath,
          this.logsPath
        ];
        for (const dir of essentialDirectories) {
          try {
            await fs.mkdir(dir, { recursive: true });
            this.debug.log(
              `\u{1F4C1} Pasta criada: ${path.relative(this.dataPath, dir) || "data"}`
            );
          } catch (error) {
            this.debug.error(`\u274C Erro ao criar pasta ${dir}:`, error);
            await this.reportFilesystemError("createDirectories", error, { directory: dir });
            throw error;
          }
        }
        this.debug.log("\u2705 Estrutura de pastas essenciais criada com sucesso");
      }
      /**
       * Cria pastas específicas apenas quando necessário
       */
      setupIPC() {
        ipcMain.handle("fs:readFile", async (event, filePath, encoding = "utf8") => {
          return await this.readFile(filePath, encoding);
        });
        ipcMain.handle("fs:writeFile", async (event, filePath, data, encoding = "utf8") => {
          return await this.writeFile(filePath, data, encoding);
        });
        ipcMain.handle("fs:deleteFile", async (event, filePath) => {
          return await this.deleteFile(filePath);
        });
        ipcMain.handle("fs:exists", async (event, filePath) => {
          return await this.exists(filePath);
        });
        ipcMain.handle("fs:readDirectory", async (event, dirPath) => {
          return await this.readDirectory(dirPath);
        });
        ipcMain.handle("fs:createDirectory", async (event, dirPath) => {
          return await this.createDirectory(dirPath);
        });
        ipcMain.handle("fs:deleteDirectory", async (event, dirPath) => {
          return await this.deleteDirectory(dirPath);
        });
        ipcMain.handle("fs:getFileInfo", async (event, filePath) => {
          return await this.getFileInfo(filePath);
        });
        ipcMain.handle("fs:saveGameData", async (event, gameId, data) => {
          return await this.saveGameData(gameId, data);
        });
        ipcMain.handle("fs:loadGameData", async (event, gameId) => {
          return await this.loadGameData(gameId);
        });
        ipcMain.handle("fs:saveAchievementData", async (event, gameId, achievements) => {
          return await this.saveAchievementData(gameId, achievements);
        });
        ipcMain.handle("fs:loadAchievementData", async (event, gameId) => {
          return await this.loadAchievementData(gameId);
        });
        ipcMain.handle("fs:saveSettings", async (settings) => {
          return await this.saveSettings(settings);
        });
        ipcMain.handle("fs:loadSettings", async () => {
          return await this.loadSettings();
        });
        ipcMain.handle("fs:createBackup", async (name) => {
          return await this.createBackup(name);
        });
        ipcMain.handle("fs:restoreBackup", async (backupId) => {
          return await this.restoreBackup(backupId);
        });
        ipcMain.handle("fs:listBackups", async () => {
          return await this.listBackups();
        });
        ipcMain.handle("fs:deleteBackup", async (backupId) => {
          return await this.deleteBackup(backupId);
        });
        ipcMain.handle("fs:exportData", async (options = {}) => {
          return await this.exportData(options);
        });
        ipcMain.handle("fs:importData", async (filePath) => {
          return await this.importData(filePath);
        });
        ipcMain.handle("fs:showOpenDialog", async (options = {}) => {
          return await this.showOpenDialog(options);
        });
        ipcMain.handle("fs:showSaveDialog", async (options = {}) => {
          return await this.showSaveDialog(options);
        });
        ipcMain.handle("fs:clearCache", async () => {
          return await this.clearCache();
        });
        ipcMain.handle("fs:getCacheSize", async () => {
          return await this.getCacheSize();
        });
        ipcMain.handle("fs:getLogs", async (options = {}) => {
          return await this.getLogs(options);
        });
        ipcMain.handle("fs:clearLogs", async () => {
          return await this.clearLogs();
        });
      }
      // File operations
      async readFile(filePath, encoding = "utf8") {
        let safePath;
        try {
          safePath = this.getSafePath(filePath);
          return await fs.readFile(safePath, encoding);
        } catch (error) {
          this.debug.error(`Error reading file ${filePath}:`, error);
          await this.reportFilesystemError("readFile", error, {
            filePath,
            encoding,
            safePath: safePath || "unknown"
          });
          throw error;
        }
      }
      async writeFile(filePath, data, encoding = "utf8") {
        let safePath;
        try {
          safePath = this.getSafePath(filePath);
          await this.ensureDirectoryExists(path.dirname(safePath));
          await fs.writeFile(safePath, data, encoding);
          return true;
        } catch (error) {
          this.debug.error(`Error writing file ${filePath}:`, error);
          await this.reportFilesystemError("writeFile", error, {
            filePath,
            encoding,
            dataSize: data?.length || 0,
            safePath: safePath || "unknown"
          });
          throw error;
        }
      }
      async deleteFile(filePath) {
        let safePath;
        try {
          safePath = this.getSafePath(filePath);
          await fs.unlink(safePath);
          return true;
        } catch (error) {
          this.debug.error(`Error deleting file ${filePath}:`, error);
          await this.reportFilesystemError("deleteFile", error, {
            filePath,
            safePath: safePath || "unknown"
          });
          throw error;
        }
      }
      async exists(filePath) {
        try {
          const safePath = this.getSafePath(filePath);
          await fs.access(safePath);
          return true;
        } catch {
          return false;
        }
      }
      async ensureDirectoryExists(dirPath) {
        try {
          await fs.mkdir(dirPath, { recursive: true });
          return true;
        } catch (error) {
          this.debug.error(`Error creating directory ${dirPath}:`, error);
          await this.reportFilesystemError("ensureDirectoryExists", error, {
            dirPath
          });
          throw error;
        }
      }
      getSafePath(filePath) {
        const resolvedPath = path.resolve(this.dataPath, filePath);
        if (!resolvedPath.startsWith(this.dataPath)) {
          throw new Error("Access denied: Path outside allowed directory");
        }
        return resolvedPath;
      }
      // Directory operations
      async readDirectory(dirPath) {
        let safePath;
        try {
          safePath = this.getSafePath(dirPath);
          const entries = await fs.readdir(safePath, { withFileTypes: true });
          return entries.map((entry) => ({
            name: entry.name,
            isDirectory: entry.isDirectory(),
            isFile: entry.isFile(),
            path: path.join(dirPath, entry.name)
          }));
        } catch (error) {
          this.debug.error(`Error reading directory ${dirPath}:`, error);
          await this.reportFilesystemError("readDirectory", error, {
            dirPath,
            safePath: safePath || "unknown"
          });
          throw error;
        }
      }
      async listDirectory(dirPath) {
        let safePath;
        try {
          safePath = this.getSafePath(dirPath);
          return await fs.readdir(safePath);
        } catch (error) {
          this.debug.error(`Error listing directory ${dirPath}:`, error);
          await this.reportFilesystemError("listDirectory", error, {
            dirPath,
            safePath: safePath || "unknown"
          });
          throw error;
        }
      }
      async createDirectory(dirPath) {
        let safePath;
        try {
          safePath = this.getSafePath(dirPath);
          await fs.mkdir(safePath, { recursive: true });
          return true;
        } catch (error) {
          this.debug.error(`Error creating directory ${dirPath}:`, error);
          await this.reportFilesystemError("createDirectory", error, {
            dirPath,
            safePath: safePath || "unknown"
          });
          throw error;
        }
      }
      async deleteDirectory(dirPath) {
        let safePath;
        try {
          safePath = this.getSafePath(dirPath);
          await fs.rmdir(safePath, { recursive: true });
          return true;
        } catch (error) {
          this.debug.error(`Error deleting directory ${dirPath}:`, error);
          await this.reportFilesystemError("deleteDirectory", error, {
            dirPath,
            safePath: safePath || "unknown"
          });
          throw error;
        }
      }
      async getFileInfo(filePath) {
        try {
          const safePath = this.getSafePath(filePath);
          const stats = await fs.stat(safePath);
          return {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            accessed: stats.atime,
            isDirectory: stats.isDirectory(),
            isFile: stats.isFile()
          };
        } catch (error) {
          this.debug.error(`Error getting file info ${filePath}:`, error);
          throw error;
        }
      }
      // Data management
      async saveGameData(gameId, data) {
        try {
          const filePath = path.join("games", `${gameId}.json`);
          const gameData = {
            ...data,
            id: gameId,
            lastModified: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
            version: "0.0.1-beta"
          };
          await this.writeFile(filePath, JSON.stringify(gameData, null, 2));
          return true;
        } catch (error) {
          this.debug.error(`Error saving game data for ${gameId}:`, error);
          throw error;
        }
      }
      async loadGameData(gameId) {
        try {
          const filePath = path.join("games", `${gameId}.json`);
          if (!await this.exists(filePath)) {
            return null;
          }
          const data = await this.readFile(filePath);
          return JSON.parse(data);
        } catch (error) {
          this.debug.error(`Error loading game data for ${gameId}:`, error);
          throw error;
        }
      }
      async saveAchievementData(gameId, achievements) {
        try {
          const filePath = path.join("achievements", `${gameId}.json`);
          const achievementData = {
            gameId,
            achievements,
            lastModified: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
            version: "0.0.1-beta"
          };
          await this.writeFile(filePath, JSON.stringify(achievementData, null, 2));
          return true;
        } catch (error) {
          this.debug.error(`Error saving achievement data for ${gameId}:`, error);
          throw error;
        }
      }
      async loadAchievementData(gameId) {
        try {
          const filePath = path.join("achievements", `${gameId}.json`);
          if (!await this.exists(filePath)) {
            return null;
          }
          const data = await this.readFile(filePath);
          return JSON.parse(data);
        } catch (error) {
          this.debug.error(`Error loading achievement data for ${gameId}:`, error);
          throw error;
        }
      }
      async saveSettings(settings) {
        try {
          if (this.configManager) {
            for (const [key, value] of Object.entries(settings)) {
              await this.configManager.set(key, value);
            }
            return true;
          }
          const filePath = path.join("settings", "app.json");
          const settingsData = {
            ...settings,
            lastModified: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
            version: "0.0.1-beta"
          };
          await this.writeFile(filePath, JSON.stringify(settingsData, null, 2));
          return true;
        } catch (error) {
          this.debug.error("Error saving settings:", error);
          throw error;
        }
      }
      async loadSettings() {
        try {
          const filePath = path.join("settings", "app.json");
          const safePath = this.getSafePath(filePath);
          this.debug.info("\u{1F50D} LoadSettings Debug Info:");
          this.debug.info(`\u{1F4C1} DataPath: ${this.dataPath}`);
          this.debug.info(`\u{1F4C4} FilePath: ${filePath}`);
          this.debug.info(`\u{1F6E1}\uFE0F SafePath: ${safePath}`);
          this.debug.info(`\u{1F4CB} File exists check: ${await this.exists(filePath)}`);
          if (!await this.exists(filePath)) {
            this.debug.warn(
              "\u26A0\uFE0F app.json n\xE3o encontrado, retornando configura\xE7\xF5es padr\xE3o"
            );
            return {
              language: "pt-BR",
              theme: "auto",
              performanceMode: "normal",
              animations: "enabled",
              version: "0.0.1-beta"
            };
          }
          this.debug.info("\u2705 app.json encontrado, carregando...");
          const data = await this.readFile(filePath);
          const parsedData = JSON.parse(data);
          this.debug.info("\u{1F4CA} Configura\xE7\xF5es carregadas:", parsedData);
          return parsedData;
        } catch (error) {
          this.debug.error("\u274C Error loading settings:", error);
          this.debug.error("\u274C Error details:", {
            message: error.message,
            stack: error.stack,
            dataPath: this.dataPath
          });
          throw error;
        }
      }
      // Backup operations
      async createBackup(name) {
        try {
          const timestamp = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-").replaceAll(".", "-");
          const backupId = `${timestamp}_${name || "manual"}`;
          const backupDir = path.join(this.backupsPath, backupId);
          await fs.mkdir(backupDir, { recursive: true });
          await this.copyDirectoryRecursive(this.dataPath, backupDir, [
            "backups",
            "cache",
            "temp",
            "logs"
          ]);
          const metadata = {
            id: backupId,
            name: name || "Manual Backup",
            created: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
            version: "0.0.1-beta",
            size: await this.getDirectorySize(backupDir)
          };
          await fs.writeFile(
            path.join(backupDir, "backup.json"),
            JSON.stringify(metadata, null, 2)
          );
          return metadata;
        } catch (error) {
          this.debug.error("Error creating backup:", error);
          throw error;
        }
      }
      async restoreBackup(backupId) {
        try {
          const backupDir = path.join(this.backupsPath, backupId);
          if (!await this.exists(backupDir)) {
            throw new Error("Backup not found");
          }
          await this.createBackup("pre_restore");
          const dataEntries = await fs.readdir(this.dataPath, { withFileTypes: true });
          for (const entry of dataEntries) {
            if (entry.name !== "backups" && entry.name !== "temp") {
              const entryPath = path.join(this.dataPath, entry.name);
              if (entry.isDirectory()) {
                await fs.rmdir(entryPath, { recursive: true });
              } else {
                await fs.unlink(entryPath);
              }
            }
          }
          await this.copyDirectoryRecursive(backupDir, this.dataPath, ["backup.json"]);
          return true;
        } catch (error) {
          this.debug.error("Error restoring backup:", error);
          throw error;
        }
      }
      async listBackups() {
        try {
          const backups = [];
          const entries = await fs.readdir(this.backupsPath, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isDirectory()) {
              const metadataPath = path.join(this.backupsPath, entry.name, "backup.json");
              if (await this.exists(metadataPath)) {
                const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));
                backups.push(metadata);
              }
            }
          }
          return backups.sort((a, b) => new Date(b.created) - new Date(a.created));
        } catch (error) {
          this.debug.error("Error listing backups:", error);
          throw error;
        }
      }
      async deleteBackup(backupId) {
        try {
          const backupDir = path.join(this.backupsPath, backupId);
          await fs.rmdir(backupDir, { recursive: true });
          return true;
        } catch (error) {
          this.debug.error(`Error deleting backup ${backupId}:`, error);
          throw error;
        }
      }
      // Import/Export
      async exportData(options = {}) {
        try {
          const timestamp = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-").replaceAll(".", "-");
          const exportName = options.name || `achievements_export_${timestamp}`;
          const exportPath = path.join(this.dataPath, "exports", `${exportName}.json`);
          await this.ensureDirectoryExists(path.dirname(exportPath));
          const exportData = {
            metadata: {
              name: exportName,
              created: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
              version: "0.0.1-beta",
              type: options.type || "full"
            },
            games: [],
            achievements: [],
            settings: await this.loadSettings()
          };
          if (options.includeGames !== false) {
            const gamesDir = path.join(this.dataPath, "games");
            const gameFiles = await fs.readdir(gamesDir);
            for (const file of gameFiles) {
              if (file.endsWith(".json")) {
                const gameData = JSON.parse(await fs.readFile(path.join(gamesDir, file), "utf8"));
                exportData.games.push(gameData);
              }
            }
          }
          if (options.includeAchievements !== false) {
            const achievementsDir = path.join(this.dataPath, "achievements");
            const achievementFiles = await fs.readdir(achievementsDir);
            for (const file of achievementFiles) {
              if (file.endsWith(".json")) {
                const achievementData = JSON.parse(
                  await fs.readFile(path.join(achievementsDir, file), "utf8")
                );
                exportData.achievements.push(achievementData);
              }
            }
          }
          await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2));
          return {
            path: exportPath,
            name: exportName,
            size: (await this.getFileInfo(exportPath)).size
          };
        } catch (error) {
          this.debug.error("Error exporting data:", error);
          throw error;
        }
      }
      async importData(filePath) {
        try {
          const data = JSON.parse(await fs.readFile(filePath, "utf8"));
          if (!data.metadata || !data.metadata.version) {
            throw new Error("Invalid export file format");
          }
          await this.createBackup("pre_import");
          const results = {
            games: 0,
            achievements: 0,
            settings: false
          };
          if (data.games && Array.isArray(data.games)) {
            for (const game of data.games) {
              await this.saveGameData(game.id, game);
              results.games++;
            }
          }
          if (data.achievements && Array.isArray(data.achievements)) {
            for (const achievement of data.achievements) {
              await this.saveAchievementData(achievement.gameId, achievement.achievements);
              results.achievements++;
            }
          }
          if (data.settings) {
            await this.saveSettings(data.settings);
            results.settings = true;
          }
          return results;
        } catch (error) {
          this.debug.error("Error importing data:", error);
          throw error;
        }
      }
      // Dialog operations
      async showOpenDialog(options = {}) {
        try {
          const result = await dialog.showOpenDialog({
            properties: ["openFile"],
            filters: [
              { name: "JSON Files", extensions: ["json"] },
              { name: "All Files", extensions: ["*"] }
            ],
            ...options
          });
          return result;
        } catch (error) {
          this.debug.error("Error showing open dialog:", error);
          throw error;
        }
      }
      async showSaveDialog(options = {}) {
        try {
          const result = await dialog.showSaveDialog({
            filters: [
              { name: "JSON Files", extensions: ["json"] },
              { name: "All Files", extensions: ["*"] }
            ],
            ...options
          });
          return result;
        } catch (error) {
          this.debug.error("Error showing save dialog:", error);
          throw error;
        }
      }
      // Cache operations
      async clearCache() {
        try {
          await fs.rmdir(this.cachePath, { recursive: true });
          await fs.mkdir(this.cachePath, { recursive: true });
          return true;
        } catch (error) {
          this.debug.error("Error clearing cache:", error);
          throw error;
        }
      }
      async getCacheSize() {
        try {
          return await this.getDirectorySize(this.cachePath);
        } catch (error) {
          this.debug.error("Error getting cache size:", error);
          return 0;
        }
      }
      // Logs
      async getLogs() {
        try {
          const logs = [];
          const logFiles = await fs.readdir(this.logsPath);
          for (const file of logFiles) {
            if (file.endsWith(".log")) {
              const filePath = path.join(this.logsPath, file);
              const content = await fs.readFile(filePath, "utf8");
              const stats = await this.getFileInfo(filePath);
              logs.push({
                name: file,
                content,
                size: stats.size,
                modified: stats.modified
              });
            }
          }
          return logs.sort((a, b) => new Date(b.modified) - new Date(a.modified));
        } catch (error) {
          this.debug.error("Error getting logs:", error);
          throw error;
        }
      }
      async clearLogs() {
        try {
          const logFiles = await fs.readdir(this.logsPath);
          for (const file of logFiles) {
            if (file.endsWith(".log")) {
              await fs.unlink(path.join(this.logsPath, file));
            }
          }
          return true;
        } catch (error) {
          this.debug.error("Error clearing logs:", error);
          throw error;
        }
      }
      async copyFile(sourcePath, destPath) {
        let safeSrc, safeDest;
        try {
          safeSrc = this.getSafePath(sourcePath);
          safeDest = this.getSafePath(destPath);
          await this.ensureDirectoryExists(path.dirname(safeDest));
          await fs.copyFile(safeSrc, safeDest);
          return true;
        } catch (error) {
          this.debug.error(`Error copying file from ${sourcePath} to ${destPath}:`, error);
          await this.reportFilesystemError("copyFile", error, {
            sourcePath,
            destPath,
            safeSrc: safeSrc || "unknown",
            safeDest: safeDest || "unknown"
          });
          throw error;
        }
      }
      async moveFile(sourcePath, destPath) {
        let safeSrc, safeDest;
        try {
          safeSrc = this.getSafePath(sourcePath);
          safeDest = this.getSafePath(destPath);
          await this.ensureDirectoryExists(path.dirname(safeDest));
          await fs.rename(safeSrc, safeDest);
          return true;
        } catch (error) {
          this.debug.error(`Error moving file from ${sourcePath} to ${destPath}:`, error);
          await this.reportFilesystemError("moveFile", error, {
            sourcePath,
            destPath,
            safeSrc: safeSrc || "unknown",
            safeDest: safeDest || "unknown"
          });
          throw error;
        }
      }
      // Utility methods
      async copyDirectoryRecursive(source, destination, exclude = []) {
        await fs.mkdir(destination, { recursive: true });
        const entries = await fs.readdir(source, { withFileTypes: true });
        for (const entry of entries) {
          if (exclude.includes(entry.name)) {
            continue;
          }
          const sourcePath = path.join(source, entry.name);
          const destPath = path.join(destination, entry.name);
          if (entry.isDirectory()) {
            await this.copyDirectoryRecursive(sourcePath, destPath, exclude);
          } else {
            await fs.copyFile(sourcePath, destPath);
          }
        }
      }
      async getDirectorySize(dirPath) {
        let totalSize = 0;
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          const entryPath = path.join(dirPath, entry.name);
          if (entry.isDirectory()) {
            totalSize += await this.getDirectorySize(entryPath);
          } else {
            const stats = await fs.stat(entryPath);
            totalSize += stats.size;
          }
        }
        return totalSize;
      }
      setupFileWatchers() {
        const watchOptions = { recursive: true };
        fsSync.watch(this.dataPath, watchOptions, (eventType, filename) => {
          if (filename && !filename.includes("temp") && !filename.includes("cache")) {
            if (globalThis.mainWindow && !globalThis.mainWindow.isDestroyed()) {
              const fileChangeData = structuredClone({
                type: String(eventType || "unknown"),
                filename: String(filename || ""),
                timestamp: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
              });
              globalThis.mainWindow.webContents.send("file-changed", fileChangeData);
            }
          }
        });
      }
    }
    let filesystemManager = null;
    async function setupFileSystem(store, pathManager, crashReporter = null, configManager = null) {
      filesystemManager = new FilesystemManager(pathManager, crashReporter, configManager);
      await filesystemManager.init();
      filesystemManager.setupIPC();
      return filesystemManager;
    }
    __name(setupFileSystem, "setupFileSystem");
    __name2(setupFileSystem, "setupFileSystem");
    __name22(setupFileSystem, "setupFileSystem");
    __name222(setupFileSystem, "setupFileSystem");
    __name2222(setupFileSystem, "setupFileSystem");
    __name22222(setupFileSystem, "setupFileSystem");
    module.exports = { FilesystemManager, setupFileSystem };
  }
});
var filesystem_default = require_filesystem();
export {
  filesystem_default as default
};
