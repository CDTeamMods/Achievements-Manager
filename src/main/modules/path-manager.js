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
var require_path_manager = __commonJS({
  "src/main/modules/path-manager.js"(exports, module) {
    const { app } = require("electron");
    const path = require("node:path");
    const os = require("node:os");
    const { getDebugManager } = require("./debug-manager");
    class PathManager {
      static {
        __name(this, "PathManager");
      }
      static {
        __name2(this, "PathManager");
      }
      static {
        __name22(this, "PathManager");
      }
      static {
        __name222(this, "PathManager");
      }
      static {
        __name2222(this, "PathManager");
      }
      static {
        __name22222(this, "PathManager");
      }
      constructor() {
        this.isInstalled = false;
        this.isDevelopment = false;
        this.userDataPath = null;
        this.dataPath = null;
        this.cachePath = null;
        this.initialized = false;
        this.debugManager = getDebugManager();
      }
      /**
       * Inicializa o gerenciador de caminhos
       */
      async initialize() {
        try {
          this.isDevelopment = !app.isPackaged && process.env.NODE_ENV === "development";
          this.isInstalled = this.detectInstallationType();
          this.setupPaths();
          this.initialized = true;
          return true;
        } catch (error) {
          this.debugManager.error("\u274C Erro ao inicializar Path Manager:", error);
          return false;
        }
      }
      /**
       * Detecta se o aplicativo foi instalado via setup (não portable)
       */
      detectInstallationType() {
        const appPath = app.getAppPath();
        const execPath = process.execPath;
        const installPaths = ["Program Files", "Program Files (x86)", "AppData\\Local\\Programs"];
        const isInInstallPath = installPaths.some(
          (installPath) => execPath.includes(installPath) || appPath.includes(installPath)
        );
        const isPortable = execPath.includes("portable") || appPath.includes("portable") || execPath.includes(os.homedir()) || execPath.includes("Desktop");
        return isInInstallPath && !isPortable;
      }
      /**
       * Configura os caminhos baseado no tipo de instalação e modo de desenvolvimento
       */
      setupPaths() {
        if (this.isInstalled) {
          this.userDataPath = app.getPath("userData");
          this.dataPath = path.join(this.userDataPath, "data");
          this.cachePath = path.join(this.userDataPath, "Cache");
        } else {
          if (this.isDevelopment) {
            this.userDataPath = path.join(__dirname, "..", "..");
            this.dataPath = path.join(__dirname, "..", "..", "src", "data");
            this.cachePath = path.join(__dirname, "..", "..", "src", "data", "cache");
          } else {
            const execDir = path.dirname(process.execPath);
            this.userDataPath = execDir;
            this.dataPath = path.join(execDir, "data");
            this.cachePath = path.join(execDir, "data", "cache");
          }
        }
      }
      /**
       * Obtém o caminho base de dados
       */
      getDataPath() {
        if (!this.initialized) {
          throw new Error("PathManager n\xE3o foi inicializado");
        }
        return this.dataPath;
      }
      /**
       * Obtém o caminho do userData
       */
      getUserDataPath() {
        if (!this.initialized) {
          throw new Error("PathManager n\xE3o foi inicializado");
        }
        return this.userDataPath;
      }
      /**
       * Obtém o caminho do cache
       */
      getCachePath() {
        if (!this.initialized) {
          throw new Error("PathManager n\xE3o foi inicializado");
        }
        return this.cachePath;
      }
      /**
       * Obtém um caminho específico dentro da pasta de dados
       */
      getPath(subPath) {
        if (!this.initialized) {
          throw new Error("PathManager n\xE3o foi inicializado");
        }
        return path.join(this.dataPath, subPath);
      }
      /**
       * Obtém caminhos específicos para diferentes tipos de dados
       */
      getPaths() {
        if (!this.initialized) {
          throw new Error("PathManager n\xE3o foi inicializado");
        }
        return {
          data: this.dataPath,
          userData: this.userDataPath,
          cache: this.cachePath,
          logs: path.join(this.dataPath, "logs"),
          settings: path.join(this.dataPath, "settings")
        };
      }
      /**
       * Verifica se é versão instalada
       */
      isInstalledVersion() {
        return this.isInstalled;
      }
      /**
       * Verifica se está em modo de desenvolvimento
       */
      isDevelopmentMode() {
        return this.isDevelopment;
      }
      /**
       * Obtém informações sobre os caminhos
       */
      getInfo() {
        return {
          isInstalled: this.isInstalled,
          isDevelopment: this.isDevelopment,
          userDataPath: this.userDataPath,
          dataPath: this.dataPath,
          cachePath: this.cachePath,
          paths: this.getPaths()
        };
      }
    }
    let pathManager = null;
    async function setupPathManager() {
      if (!pathManager) {
        pathManager = new PathManager();
        await pathManager.initialize();
      }
      return pathManager;
    }
    __name(setupPathManager, "setupPathManager");
    __name2(setupPathManager, "setupPathManager");
    __name22(setupPathManager, "setupPathManager");
    __name222(setupPathManager, "setupPathManager");
    __name2222(setupPathManager, "setupPathManager");
    __name22222(setupPathManager, "setupPathManager");
    function getPathManager() {
      if (!pathManager) {
        throw new Error("PathManager n\xE3o foi inicializado. Chame setupPathManager() primeiro.");
      }
      return pathManager;
    }
    __name(getPathManager, "getPathManager");
    __name2(getPathManager, "getPathManager");
    __name22(getPathManager, "getPathManager");
    __name222(getPathManager, "getPathManager");
    __name2222(getPathManager, "getPathManager");
    __name22222(getPathManager, "getPathManager");
    module.exports = {
      PathManager,
      setupPathManager,
      getPathManager
    };
  }
});
var path_manager_default = require_path_manager();
export {
  path_manager_default as default
};
