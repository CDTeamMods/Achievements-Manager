var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2(
  (target, value) => __defProp22(target, "name", { value, configurable: true }),
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
          ipcRenderer.invoke(
            "debug:warn",
            `\u26A0\uFE0F Erro de clonagem IPC ignorado para canal ${channel}:`,
            ipcError.message
          );
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
const electronAPI = {
  // Configurações
  config: {
    get: debugInvoke("config:get"),
    set: debugInvoke("config:set"),
    getAll: debugInvoke("config:getAll"),
    reset: debugInvoke("config:reset")
  },
  // Jogos
  games: {
    getAll: debugInvoke("games:getAll"),
    getById: debugInvoke("games:getById"),
    add: debugInvoke("games:add"),
    update: debugInvoke("games:update"),
    delete: debugInvoke("games:delete"),
    scan: debugInvoke("games:scan"),
    import: debugInvoke("games:import"),
    export: debugInvoke("games:export")
  },
  // Conquistas
  achievements: {
    getAll: debugInvoke("achievements:getAll"),
    getByGameId: debugInvoke("achievements:getByGameId"),
    getById: debugInvoke("achievements:getById"),
    add: debugInvoke("achievements:add"),
    update: debugInvoke("achievements:update"),
    delete: debugInvoke("achievements:delete"),
    unlock: debugInvoke("achievements:unlock"),
    lock: debugInvoke("achievements:lock"),
    getStats: debugInvoke("achievements:getStats"),
    sync: debugInvoke("achievements:sync")
  },
  // API de jogos (Steam e GSE Saves)
  api: {
    steam: {
      authenticate: debugInvoke("api:steam:authenticate"),
      getGames: debugInvoke("api:steam:getGames"),
      getUserGames: debugInvoke("steam.getUserGames"),
      getAchievements: debugInvoke("api:steam:getAchievements"),
      getUserStats: debugInvoke("api:steam:getUserStats"),
      setCredentials: debugInvoke("steam.setCredentials"),
      clearCache: debugInvoke("steam.clearCache"),
      getCacheStats: debugInvoke("steam.getCacheStats")
    },
    // GSE Saves API
    gseSaves: {
      // Métodos de verificação e detecção
      detectPaths: debugInvoke("gse:detectPaths"),
      getCurrentUser: debugInvoke("gse:getCurrentUser"),
      getStatus: debugInvoke("gse:getStatus"),
      // Métodos de dados
      getGames: debugInvoke("gse:getGames"),
      getAchievements: debugInvoke("gse:getAchievements"),
      // Métodos legados (mantidos para compatibilidade)
      syncAchievements: debugInvoke("api:gseSaves:syncAchievements")
    },
    request: debugInvoke("api:request"),
    clearCache: debugInvoke("api:clearCache"),
    getCacheStats: debugInvoke("api:getCacheStats")
  },
  // Sistema de arquivos
  fs: {
    selectFile: debugInvoke("fs:selectFile"),
    selectDirectory: debugInvoke("fs:selectDirectory"),
    saveFile: debugInvoke("fs:saveFile"),
    readFile: debugInvoke("fs:readFile"),
    writeFile: debugInvoke("fs:writeFile"),
    exists: debugInvoke("fs:exists"),
    createBackup: debugInvoke("fs:createBackup"),
    restoreBackup: debugInvoke("fs:restoreBackup"),
    listBackups: debugInvoke("fs:listBackups"),
    deleteBackup: debugInvoke("fs:deleteBackup"),
    saveSettings: debugInvoke("fs:saveSettings"),
    loadSettings: debugInvoke("fs:loadSettings")
  },
  // Configurações (alias para compatibilidade)
  saveSettings: debugInvoke("fs:saveSettings"),
  // Tema
  theme: {
    getSystemTheme: debugInvoke("theme:getSystemTheme"),
    setTheme: debugInvoke("set-theme"),
    getTheme: debugInvoke("get-theme")
  },
  // Internacionalização
  i18n: {
    getLanguage: debugInvoke("i18n:getLanguage"),
    getCurrentLanguage: debugInvoke("i18n:getCurrentLanguage"),
    setLanguage: debugInvoke("i18n:setLanguage"),
    getTranslations: debugInvoke("i18n:getTranslations"),
    getAvailableLanguages: debugInvoke("i18n:getAvailableLanguages"),
    translate: debugInvoke("i18n:translate")
  },
  // Goldberg Migration
  goldberg: {
    checkFolder: debugInvoke("goldberg:checkFolder"),
    getGames: debugInvoke("goldberg:getGames"),
    migrateGame: debugInvoke("goldberg:migrateGame"),
    getSettings: debugInvoke("goldberg:getSettings"),
    setSetting: debugInvoke("goldberg:setSetting"),
    getLastCheck: debugInvoke("goldberg:getLastCheck"),
    checkMigration: debugInvoke("goldberg:checkMigration")
  },
  // APIs simplificadas para compatibilidade
  getGoldbergSettings: debugInvoke("goldberg:getSettings"),
  setGoldbergSetting: debugInvoke("goldberg:setSetting"),
  getGoldbergLastCheck: debugInvoke("goldberg:getLastCheck"),
  checkGoldbergMigration: debugInvoke("goldberg:checkMigration"),
  // Performance
  performance: {
    getMetrics: debugInvoke("performance:getMetrics"),
    clearCache: debugInvoke("performance:clearCache"),
    optimizeMemory: debugInvoke("performance:optimizeMemory"),
    getSystemResources: debugInvoke("performance:getSystemResources")
  },
  // Crash Reporter
  crashReporter: {
    reportError: debugInvoke("crash-reporter:report-error"),
    getStats: debugInvoke("crash-reporter:get-stats"),
    clearReports: debugInvoke("crash-reporter:clear-reports"),
    getCrashList: debugInvoke("crash-reporter:get-crash-list")
  },
  // API Steam direta
  steam: {
    authenticate: debugInvoke("api:steam:authenticate"),
    getGames: debugInvoke("api:steam:getGames"),
    getUserGames: debugInvoke("steam.getUserGames"),
    getAchievements: debugInvoke("api:steam:getAchievements"),
    getUserStats: debugInvoke("api:steam:getUserStats"),
    getUserGameAchievements: debugInvoke("steam.getUserGameAchievements"),
    setCredentials: debugInvoke("steam.setCredentials"),
    getCredentials: debugInvoke("steam.getCredentials"),
    checkConnection: debugInvoke("steam.checkConnection"),
    // Métodos de cache
    clearCache: debugInvoke("steam.clearCache"),
    getCacheStats: debugInvoke("steam.getCacheStats")
  },
  // Sistema
  system: {
    getVersion: debugInvoke("system:getVersion"),
    getPlatform: debugInvoke("system:getPlatform"),
    getSystemInfo: debugInvoke("system:getSystemInfo"),
    openExternal: debugInvoke("system:openExternal"),
    showInFolder: debugInvoke("system:showInFolder"),
    quit: debugInvoke("system:quit"),
    minimize: debugInvoke("system:minimize"),
    maximize: debugInvoke("system:maximize"),
    unmaximize: debugInvoke("system:unmaximize"),
    isMaximized: debugInvoke("system:isMaximized"),
    close: debugInvoke("system:close"),
    restart: debugInvoke("app:restart")
  },
  // Configurações e detecção de ambiente
  isDevelopmentMode: debugInvoke("system:isDevelopmentMode"),
  // Configurações do sistema (auto-start e tray)
  isInstalledVersion: debugInvoke("system:isInstalledVersion"),
  setAutoStart: debugInvoke("system:setAutoStart"),
  getAutoStart: debugInvoke("system:getAutoStart"),
  setMinimizeToTray: debugInvoke("system:setMinimizeToTray"),
  getMinimizeToTray: debugInvoke("system:getMinimizeToTray"),
  // Controles de janela
  minimizeWindow: debugInvoke("window:minimize"),
  maximizeWindow: debugInvoke("window:maximize"),
  closeWindow: debugInvoke("window:close"),
  isMaximized: debugInvoke("window:isMaximized"),
  // Eventos
  on: /* @__PURE__ */ __name22((channel, callback) => {
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
      const safeCallback = /* @__PURE__ */ __name22((event, ...args) => {
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
  off: /* @__PURE__ */ __name22((channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  }, "off"),
  once: /* @__PURE__ */ __name22((channel, callback) => {
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
      const safeCallback = /* @__PURE__ */ __name22((event, ...args) => {
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
  test: "API funcionando!"
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
