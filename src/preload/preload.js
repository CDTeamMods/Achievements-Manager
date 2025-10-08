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
const { contextBridge, ipcRenderer } = require("electron");
function analyzeObject(obj, path = "root") {
  const analysis = {
    path,
    type: typeof obj,
    constructor: obj?.constructor?.name || "unknown",
    isCloneable: false,
    issues: []
  };
  try {
    structuredClone(obj);
    analysis.isCloneable = true;
  } catch (error) {
    analysis.issues.push(`structuredClone failed: ${error.message}`);
  }
  if (typeof obj === "object" && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "function") {
        analysis.issues.push(`Function property: ${key}`);
      } else if (value instanceof Node) {
        analysis.issues.push(`DOM Node property: ${key}`);
      } else if (value instanceof Window) {
        analysis.issues.push(`Window object property: ${key}`);
      } else if (value && typeof value === "object" && value.constructor && ["HTMLElement", "EventTarget", "Navigator", "Location"].includes(value.constructor.name)) {
        analysis.issues.push(`Browser API object property: ${key} (${value.constructor.name})`);
      }
    }
  }
  return analysis;
}
__name(analyzeObject, "analyzeObject");
__name2(analyzeObject, "analyzeObject");
__name22(analyzeObject, "analyzeObject");
__name222(analyzeObject, "analyzeObject");
function sanitizeArgs(args) {
  if (!Array.isArray(args)) return args;
  return args.map((arg, index) => {
    const argPath = `args[${index}]`;
    if (arg === null || arg === void 0) {
      return arg;
    }
    if (typeof arg !== "object") {
      return arg;
    }
    if (Array.isArray(arg)) {
      try {
        return arg.map((item) => {
          if (typeof item === "object" && item !== null) {
            try {
              return structuredClone(item);
            } catch {
              return { __sanitized: true, __type: typeof item };
            }
          }
          return item;
        });
      } catch {
        return [];
      }
    }
    const analysis = analyzeObject(arg, argPath);
    if (analysis.isCloneable) {
      return arg;
    }
    try {
      const serialized = JSON.parse(
        JSON.stringify(arg, (key, value) => {
          if (typeof value === "function") return void 0;
          if (value instanceof Node) return void 0;
          if (value instanceof Window) return void 0;
          if (value instanceof HTMLElement) return void 0;
          if (value instanceof EventTarget) return void 0;
          try {
            JSON.stringify(value);
            return value;
          } catch {
            return void 0;
          }
        })
      );
      try {
        structuredClone(serialized);
        return serialized;
      } catch {
        return {
          __sanitized: true,
          __type: analysis.type,
          __constructor: analysis.constructor,
          __keys: Object.keys(arg).slice(0, 10)
          // Limitar a 10 chaves
        };
      }
    } catch (jsonError) {
      return {
        __sanitized: true,
        __type: analysis.type,
        __constructor: analysis.constructor,
        __error: "Object could not be serialized",
        __message: jsonError.message
      };
    }
  });
}
__name(sanitizeArgs, "sanitizeArgs");
__name2(sanitizeArgs, "sanitizeArgs");
__name22(sanitizeArgs, "sanitizeArgs");
__name222(sanitizeArgs, "sanitizeArgs");
function isDebugToolsEnabled() {
  if (process.env.DEBUG_TOOLS === "true") return true;
  if (process.env.DEBUG_TOOLS === "false") return false;
  if (typeof localStorage !== "undefined") {
    const localStorageDebug = localStorage.getItem("DEBUG_TOOLS");
    if (localStorageDebug === "true") return true;
    if (localStorageDebug === "false") return false;
  }
  if (typeof window !== "undefined" && window.DEBUG_TOOLS === true) return true;
  return false;
}
__name(isDebugToolsEnabled, "isDebugToolsEnabled");
__name2(isDebugToolsEnabled, "isDebugToolsEnabled");
__name22(isDebugToolsEnabled, "isDebugToolsEnabled");
__name222(isDebugToolsEnabled, "isDebugToolsEnabled");
function simpleInvoke(channel, ...args) {
  return ipcRenderer.invoke(channel, ...args).catch((error) => {
    if (error.message && (error.message.includes("could not be cloned") || error.message.includes("IpcRendererInternal.send") || error.message.includes("An object could not be cloned"))) {
      return null;
    }
    throw error;
  });
}
__name(simpleInvoke, "simpleInvoke");
__name2(simpleInvoke, "simpleInvoke");
__name22(simpleInvoke, "simpleInvoke");
__name222(simpleInvoke, "simpleInvoke");
function debugInvoke(channel, ...args) {
  if (!isDebugToolsEnabled()) {
    return simpleInvoke(channel, ...args);
  }
  return new Promise((resolve, reject) => {
    try {
      const sanitizedArgs = sanitizeArgs(args);
      let argsToUse = sanitizedArgs;
      try {
        sanitizedArgs.forEach((arg) => {
          structuredClone(arg);
        });
      } catch {
        const fallbackArgs = args.map((arg) => {
          if (arg === null || arg === void 0 || typeof arg !== "object") {
            return arg;
          }
          try {
            return structuredClone(arg);
          } catch {
            return { __sanitized: true, __type: typeof arg };
          }
        });
        argsToUse = fallbackArgs;
      }
      try {
        const result = ipcRenderer.invoke(channel, ...argsToUse);
        resolve(result);
        return;
      } catch (ipcError) {
        if (ipcError.message && (ipcError.message.includes("could not be cloned") || ipcError.message.includes("IpcRendererInternal.send") || ipcError.message.includes("An object could not be cloned"))) {
          try {
            ipcRenderer.invoke(
              "debug:warn",
              `\u26A0\uFE0F Erro de clonagem IPC ignorado para canal ${channel}:`,
              ipcError.message
            );
          } catch {
          }
          resolve(null);
          return;
        }
        reject(ipcError);
      }
    } catch (error) {
      reject(error);
    }
  });
}
__name(debugInvoke, "debugInvoke");
__name2(debugInvoke, "debugInvoke");
__name22(debugInvoke, "debugInvoke");
__name222(debugInvoke, "debugInvoke");
const electronAPI = {
  // Configurações
  config: {
    get: /* @__PURE__ */ __name222((key) => debugInvoke("config:get", key), "get"),
    set: /* @__PURE__ */ __name222((key, value) => debugInvoke("config:set", key, value), "set"),
    getAll: /* @__PURE__ */ __name222(() => debugInvoke("config:getAll"), "getAll"),
    reset: /* @__PURE__ */ __name222(() => debugInvoke("config:reset"), "reset")
  },
  // Jogos
  games: {
    getAll: /* @__PURE__ */ __name222(() => debugInvoke("games:getAll"), "getAll"),
    getById: /* @__PURE__ */ __name222((id) => debugInvoke("games:getById", id), "getById"),
    add: /* @__PURE__ */ __name222((game) => debugInvoke("games:add", game), "add"),
    update: /* @__PURE__ */ __name222((id, data) => debugInvoke("games:update", id, data), "update"),
    delete: /* @__PURE__ */ __name222((id) => debugInvoke("games:delete", id), "delete"),
    scan: /* @__PURE__ */ __name222(() => debugInvoke("games:scan"), "scan"),
    import: /* @__PURE__ */ __name222((filePath) => debugInvoke("games:import", filePath), "import"),
    export: /* @__PURE__ */ __name222(
      (filePath, gameIds) => debugInvoke("games:export", filePath, gameIds),
      "export"
    )
  },
  // Conquistas
  achievements: {
    getAll: /* @__PURE__ */ __name222(() => debugInvoke("achievements:getAll"), "getAll"),
    getByGameId: /* @__PURE__ */ __name222(
      (gameId) => debugInvoke("achievements:getByGameId", gameId),
      "getByGameId"
    ),
    getById: /* @__PURE__ */ __name222((id) => debugInvoke("achievements:getById", id), "getById"),
    add: /* @__PURE__ */ __name222(
      (achievement) => debugInvoke("achievements:add", achievement),
      "add"
    ),
    update: /* @__PURE__ */ __name222(
      (id, data) => debugInvoke("achievements:update", id, data),
      "update"
    ),
    delete: /* @__PURE__ */ __name222((id) => debugInvoke("achievements:delete", id), "delete"),
    unlock: /* @__PURE__ */ __name222((id) => debugInvoke("achievements:unlock", id), "unlock"),
    lock: /* @__PURE__ */ __name222((id) => debugInvoke("achievements:lock", id), "lock"),
    getStats: /* @__PURE__ */ __name222(() => debugInvoke("achievements:getStats"), "getStats"),
    sync: /* @__PURE__ */ __name222((gameId) => debugInvoke("achievements:sync", gameId), "sync")
  },
  // API de jogos (Steam e GSE Saves)
  api: {
    steam: {
      authenticate: /* @__PURE__ */ __name222(
        () => debugInvoke("api:steam:authenticate"),
        "authenticate"
      ),
      getGames: /* @__PURE__ */ __name222(() => debugInvoke("api:steam:getGames"), "getGames"),
      getUserGames: /* @__PURE__ */ __name222(
        (options = {}) => debugInvoke("steam.getUserGames", options),
        "getUserGames"
      ),
      getAchievements: /* @__PURE__ */ __name222(
        (appId) => debugInvoke("api:steam:getAchievements", appId),
        "getAchievements"
      ),
      getUserStats: /* @__PURE__ */ __name222(
        (appId) => debugInvoke("api:steam:getUserStats", appId),
        "getUserStats"
      ),
      setCredentials: /* @__PURE__ */ __name222(
        (apiKey, steamId = null) => debugInvoke("steam.setCredentials", apiKey, steamId),
        "setCredentials"
      ),
      // Métodos de cache
      clearCache: /* @__PURE__ */ __name222(
        (type = null) => debugInvoke("steam.clearCache", type),
        "clearCache"
      ),
      getCacheStats: /* @__PURE__ */ __name222(
        () => debugInvoke("steam.getCacheStats"),
        "getCacheStats"
      )
    },
    // GSE Saves API
    gseSaves: {
      // Métodos de verificação e detecção
      detectPaths: /* @__PURE__ */ __name222(() => debugInvoke("gse:detectPaths"), "detectPaths"),
      getCurrentUser: /* @__PURE__ */ __name222(
        () => debugInvoke("gse:getCurrentUser"),
        "getCurrentUser"
      ),
      getStatus: /* @__PURE__ */ __name222(() => debugInvoke("gse:getStatus"), "getStatus"),
      // Métodos de dados
      getGames: /* @__PURE__ */ __name222(() => debugInvoke("gse:getGames"), "getGames"),
      getAchievements: /* @__PURE__ */ __name222(
        (gameId) => debugInvoke("gse:getAchievements", gameId),
        "getAchievements"
      ),
      // Métodos legados (mantidos para compatibilidade)
      syncAchievements: /* @__PURE__ */ __name222(
        (gameId) => debugInvoke("api:gseSaves:syncAchievements", gameId),
        "syncAchievements"
      )
    },
    request: /* @__PURE__ */ __name222((options) => debugInvoke("api:request", options), "request"),
    clearCache: /* @__PURE__ */ __name222(() => debugInvoke("api:clearCache"), "clearCache"),
    getCacheStats: /* @__PURE__ */ __name222(
      () => debugInvoke("api:getCacheStats"),
      "getCacheStats"
    )
  },
  // Sistema de arquivos
  fs: {
    selectFile: /* @__PURE__ */ __name222(
      (options) => debugInvoke("fs:selectFile", options),
      "selectFile"
    ),
    selectDirectory: /* @__PURE__ */ __name222(
      (options) => debugInvoke("fs:selectDirectory", options),
      "selectDirectory"
    ),
    saveFile: /* @__PURE__ */ __name222((options) => debugInvoke("fs:saveFile", options), "saveFile"),
    readFile: /* @__PURE__ */ __name222(
      (filePath) => debugInvoke("fs:readFile", filePath),
      "readFile"
    ),
    writeFile: /* @__PURE__ */ __name222(
      (filePath, data) => debugInvoke("fs:writeFile", filePath, data),
      "writeFile"
    ),
    exists: /* @__PURE__ */ __name222((path) => debugInvoke("fs:exists", path), "exists"),
    createBackup: /* @__PURE__ */ __name222(
      (name) => debugInvoke("fs:createBackup", name),
      "createBackup"
    ),
    restoreBackup: /* @__PURE__ */ __name222(
      (backupId) => debugInvoke("fs:restoreBackup", backupId),
      "restoreBackup"
    ),
    listBackups: /* @__PURE__ */ __name222(() => debugInvoke("fs:listBackups"), "listBackups"),
    deleteBackup: /* @__PURE__ */ __name222(
      (backupId) => debugInvoke("fs:deleteBackup", backupId),
      "deleteBackup"
    ),
    saveSettings: /* @__PURE__ */ __name222(
      (settings) => debugInvoke("fs:saveSettings", settings),
      "saveSettings"
    ),
    loadSettings: /* @__PURE__ */ __name222(() => debugInvoke("fs:loadSettings"), "loadSettings")
  },
  // Configurações (alias para compatibilidade)
  saveSettings: /* @__PURE__ */ __name222(
    (settings) => debugInvoke("fs:saveSettings", settings),
    "saveSettings"
  ),
  // Tema
  theme: {
    getSystemTheme: /* @__PURE__ */ __name222(
      () => debugInvoke("theme:getSystemTheme"),
      "getSystemTheme"
    ),
    setTheme: /* @__PURE__ */ __name222((theme) => debugInvoke("set-theme", theme), "setTheme"),
    getTheme: /* @__PURE__ */ __name222(() => debugInvoke("get-theme"), "getTheme")
  },
  // Internacionalização
  i18n: {
    getLanguage: /* @__PURE__ */ __name222(() => debugInvoke("i18n:getLanguage"), "getLanguage"),
    getCurrentLanguage: /* @__PURE__ */ __name222(
      () => debugInvoke("i18n:getCurrentLanguage"),
      "getCurrentLanguage"
    ),
    setLanguage: /* @__PURE__ */ __name222(
      (lang) => debugInvoke("i18n:setLanguage", lang),
      "setLanguage"
    ),
    getTranslations: /* @__PURE__ */ __name222(
      (lang) => debugInvoke("i18n:getTranslations", lang),
      "getTranslations"
    ),
    getAvailableLanguages: /* @__PURE__ */ __name222(
      () => debugInvoke("i18n:getAvailableLanguages"),
      "getAvailableLanguages"
    ),
    translate: /* @__PURE__ */ __name222(
      (key, params) => debugInvoke("i18n:translate", key, params),
      "translate"
    )
  },
  // Goldberg Migration
  goldberg: {
    checkFolder: /* @__PURE__ */ __name222(() => debugInvoke("goldberg:checkFolder"), "checkFolder"),
    getGames: /* @__PURE__ */ __name222(() => debugInvoke("goldberg:getGames"), "getGames"),
    migrateGame: /* @__PURE__ */ __name222(
      (gameData) => debugInvoke("goldberg:migrateGame", gameData),
      "migrateGame"
    ),
    getSettings: /* @__PURE__ */ __name222(() => debugInvoke("goldberg:getSettings"), "getSettings"),
    setSetting: /* @__PURE__ */ __name222(
      (key, value) => debugInvoke("goldberg:setSetting", key, value),
      "setSetting"
    ),
    getLastCheck: /* @__PURE__ */ __name222(
      () => debugInvoke("goldberg:getLastCheck"),
      "getLastCheck"
    ),
    checkMigration: /* @__PURE__ */ __name222(
      () => debugInvoke("goldberg:checkMigration"),
      "checkMigration"
    )
  },
  // APIs simplificadas para compatibilidade
  getGoldbergSettings: /* @__PURE__ */ __name222(
    () => debugInvoke("goldberg:getSettings"),
    "getGoldbergSettings"
  ),
  setGoldbergSetting: /* @__PURE__ */ __name222(
    (key, value) => debugInvoke("goldberg:setSetting", key, value),
    "setGoldbergSetting"
  ),
  getGoldbergLastCheck: /* @__PURE__ */ __name222(
    () => debugInvoke("goldberg:getLastCheck"),
    "getGoldbergLastCheck"
  ),
  checkGoldbergMigration: /* @__PURE__ */ __name222(
    () => debugInvoke("goldberg:checkMigration"),
    "checkGoldbergMigration"
  ),
  // Performance
  performance: {
    getMetrics: /* @__PURE__ */ __name222(() => debugInvoke("performance:getMetrics"), "getMetrics"),
    clearCache: /* @__PURE__ */ __name222(() => debugInvoke("performance:clearCache"), "clearCache"),
    optimizeMemory: /* @__PURE__ */ __name222(
      () => debugInvoke("performance:optimizeMemory"),
      "optimizeMemory"
    ),
    getSystemResources: /* @__PURE__ */ __name222(
      () => debugInvoke("performance:getSystemResources"),
      "getSystemResources"
    )
  },
  // Crash Reporter
  crashReporter: {
    reportError: /* @__PURE__ */ __name222(
      (errorData) => debugInvoke("crash-reporter:report-error", errorData),
      "reportError"
    ),
    getStats: /* @__PURE__ */ __name222(() => debugInvoke("crash-reporter:get-stats"), "getStats"),
    clearReports: /* @__PURE__ */ __name222(
      () => debugInvoke("crash-reporter:clear-reports"),
      "clearReports"
    ),
    getCrashList: /* @__PURE__ */ __name222(
      () => debugInvoke("crash-reporter:get-crash-list"),
      "getCrashList"
    )
  },
  // API Steam direta
  steam: {
    authenticate: /* @__PURE__ */ __name222(
      () => debugInvoke("api:steam:authenticate"),
      "authenticate"
    ),
    getGames: /* @__PURE__ */ __name222(() => debugInvoke("api:steam:getGames"), "getGames"),
    getUserGames: /* @__PURE__ */ __name222(
      (options = {}) => debugInvoke("steam.getUserGames", options),
      "getUserGames"
    ),
    getAchievements: /* @__PURE__ */ __name222(
      (appId) => debugInvoke("api:steam:getAchievements", appId),
      "getAchievements"
    ),
    getUserStats: /* @__PURE__ */ __name222(
      (appId) => debugInvoke("api:steam:getUserStats", appId),
      "getUserStats"
    ),
    getUserGameAchievements: /* @__PURE__ */ __name222(
      (gameId) => debugInvoke("steam.getUserGameAchievements", gameId),
      "getUserGameAchievements"
    ),
    setCredentials: /* @__PURE__ */ __name222(
      (apiKey, steamId = null) => debugInvoke("steam.setCredentials", apiKey, steamId),
      "setCredentials"
    ),
    getCredentials: /* @__PURE__ */ __name222(
      () => debugInvoke("steam.getCredentials"),
      "getCredentials"
    ),
    checkConnection: /* @__PURE__ */ __name222(
      () => debugInvoke("steam.checkConnection"),
      "checkConnection"
    ),
    // Métodos de cache
    clearCache: /* @__PURE__ */ __name222(
      (type = null) => debugInvoke("steam.clearCache", type),
      "clearCache"
    ),
    getCacheStats: /* @__PURE__ */ __name222(
      () => debugInvoke("steam.getCacheStats"),
      "getCacheStats"
    )
  },
  // Sistema
  system: {
    getVersion: /* @__PURE__ */ __name222(() => debugInvoke("system:getVersion"), "getVersion"),
    getPlatform: /* @__PURE__ */ __name222(() => debugInvoke("system:getPlatform"), "getPlatform"),
    getSystemInfo: /* @__PURE__ */ __name222(
      () => debugInvoke("system:getSystemInfo"),
      "getSystemInfo"
    ),
    openExternal: /* @__PURE__ */ __name222(
      (url) => debugInvoke("system:openExternal", url),
      "openExternal"
    ),
    showInFolder: /* @__PURE__ */ __name222(
      (path) => debugInvoke("system:showInFolder", path),
      "showInFolder"
    ),
    quit: /* @__PURE__ */ __name222(() => debugInvoke("system:quit"), "quit"),
    minimize: /* @__PURE__ */ __name222(() => debugInvoke("system:minimize"), "minimize"),
    maximize: /* @__PURE__ */ __name222(() => debugInvoke("system:maximize"), "maximize"),
    unmaximize: /* @__PURE__ */ __name222(() => debugInvoke("system:unmaximize"), "unmaximize"),
    isMaximized: /* @__PURE__ */ __name222(() => debugInvoke("system:isMaximized"), "isMaximized"),
    close: /* @__PURE__ */ __name222(() => debugInvoke("system:close"), "close"),
    restart: /* @__PURE__ */ __name222(() => debugInvoke("app:restart"), "restart")
  },
  // Configurações e detecção de ambiente
  isDevelopmentMode: /* @__PURE__ */ __name222(
    () => debugInvoke("system:isDevelopmentMode"),
    "isDevelopmentMode"
  ),
  // Configurações do sistema (auto-start e tray)
  isInstalledVersion: /* @__PURE__ */ __name222(
    () => debugInvoke("system:isInstalledVersion"),
    "isInstalledVersion"
  ),
  setAutoStart: /* @__PURE__ */ __name222(
    (enabled) => debugInvoke("system:setAutoStart", enabled),
    "setAutoStart"
  ),
  getAutoStart: /* @__PURE__ */ __name222(() => debugInvoke("system:getAutoStart"), "getAutoStart"),
  setMinimizeToTray: /* @__PURE__ */ __name222(
    (enabled) => debugInvoke("system:setMinimizeToTray", enabled),
    "setMinimizeToTray"
  ),
  getMinimizeToTray: /* @__PURE__ */ __name222(
    () => debugInvoke("system:getMinimizeToTray"),
    "getMinimizeToTray"
  ),
  // Controles de janela
  minimizeWindow: /* @__PURE__ */ __name222(() => debugInvoke("window:minimize"), "minimizeWindow"),
  maximizeWindow: /* @__PURE__ */ __name222(() => debugInvoke("window:maximize"), "maximizeWindow"),
  closeWindow: /* @__PURE__ */ __name222(() => debugInvoke("window:close"), "closeWindow"),
  isMaximized: /* @__PURE__ */ __name222(() => debugInvoke("window:isMaximized"), "isMaximized"),
  // Eventos
  on: /* @__PURE__ */ __name222((channel, callback) => {
    const validChannels = [
      "game-added",
      "game-updated",
      "game-deleted",
      "achievement-unlocked",
      "achievement-locked",
      "sync-progress",
      "sync-complete",
      "backup-created",
      "backup-restored",
      "language-changed",
      "theme-changed",
      "theme:systemChanged",
      "window-focus",
      "window-blur",
      "goldberg-migration-dialog",
      "goldberg-migration-completed"
    ];
    if (validChannels.includes(channel)) {
      const safeCallback = /* @__PURE__ */ __name222((event, ...args) => {
        try {
          const safeArgs = args.map((arg) => {
            if (arg === null || arg === void 0 || typeof arg === "string" || typeof arg === "number" || typeof arg === "boolean") {
              return arg;
            }
            if (typeof arg === "object") {
              const cloned = structuredClone(arg);
              return cloned;
            }
            return null;
          });
          callback(event, ...safeArgs);
        } catch (error) {
          ipcRenderer.invoke(
            "debug:error",
            `[PRELOAD] Erro no callback do canal '${channel}':`,
            error
          );
          try {
            callback(event);
          } catch (fallbackError) {
            ipcRenderer.invoke(
              "debug:error",
              `[PRELOAD] Erro no fallback do callback '${channel}':`,
              fallbackError
            );
          }
        }
      }, "safeCallback");
      ipcRenderer.on(channel, safeCallback);
    }
  }, "on"),
  off: /* @__PURE__ */ __name222((channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  }, "off"),
  once: /* @__PURE__ */ __name222((channel, callback) => {
    const validChannels = [
      "game-added",
      "game-updated",
      "game-deleted",
      "achievement-unlocked",
      "achievement-locked",
      "sync-progress",
      "sync-complete",
      "backup-created",
      "backup-restored",
      "language-changed",
      "theme-changed"
    ];
    if (validChannels.includes(channel)) {
      const safeCallback = /* @__PURE__ */ __name222((event, ...args) => {
        try {
          const safeArgs = args.map((arg) => {
            if (arg === null || arg === void 0 || typeof arg === "string" || typeof arg === "number" || typeof arg === "boolean") {
              return arg;
            }
            if (typeof arg === "object") {
              const cloned = structuredClone(arg);
              return cloned;
            }
            return null;
          });
          callback(event, ...safeArgs);
        } catch (error) {
          ipcRenderer.invoke(
            "debug:error",
            `[PRELOAD] Erro no callback do canal '${channel}':`,
            error
          );
          try {
            callback(event);
          } catch (fallbackError) {
            ipcRenderer.invoke(
              "debug:error",
              `[PRELOAD] Erro no fallback do callback '${channel}':`,
              fallbackError
            );
          }
        }
      }, "safeCallback");
      ipcRenderer.once(channel, safeCallback);
    }
  }, "once")
};
contextBridge.exposeInMainWorld("electronAPI", electronAPI);
const packageJson = require("../../package.json");
contextBridge.exposeInMainWorld("env", {
  NODE_ENV: process.env.NODE_ENV || "development",
  PLATFORM: process.platform,
  ARCH: process.arch,
  APP_VERSION: packageJson.version
});
contextBridge.exposeInMainWorld("utils", {
  isElectron: true,
  versions: process.versions
});
window.preloadTest = "Preload funcionando!";
window.testAPI = {
  test: /* @__PURE__ */ __name222(() => "API funcionando!", "test")
};
process.on("unhandledRejection", (reason) => {
  if (reason && reason.message && (reason.message.includes("could not be cloned") || reason.message.includes("IpcRendererInternal.send") || reason.message.includes("An object could not be cloned"))) {
    return;
  }
});
process.on("uncaughtException", (error) => {
  if (error && error.message && (error.message.includes("could not be cloned") || error.message.includes("IpcRendererInternal.send") || error.message.includes("An object could not be cloned"))) {
    return;
  }
});
