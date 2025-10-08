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
var require_debug_manager = __commonJS({
  "src/main/modules/debug-manager.js"(exports, module) {
    class DebugManager {
      static {
        __name(this, "DebugManager");
      }
      static {
        __name2(this, "DebugManager");
      }
      static {
        __name22(this, "DebugManager");
      }
      static {
        __name222(this, "DebugManager");
      }
      static {
        __name2222(this, "DebugManager");
      }
      static {
        __name22222(this, "DebugManager");
      }
      constructor() {
        this.isDebugEnabled = process.env.DEBUG_TOOLS === "true";
        this.debugLevel = process.env.DEBUG_LEVEL || "info";
        this.init();
      }
      init() {
        if (this.isDebugEnabled) {
          this.warn();
        }
      }
      /**
       * Verifica se o debug está habilitado
       * @returns {boolean}
       */
      isEnabled() {
        return this.isDebugEnabled;
      }
      /**
       * Log de informação
       * @param {string} message
       * @param {any} data
       */
      info(message, data = null) {
        this.log("info", message, data);
      }
      /**
       * Log de aviso
       * @param {string} message
       * @param {any} data
       */
      warn(message, data = null) {
        this.log("warn", message, data);
      }
      /**
       * Log de erro
       * @param {string} message
       * @param {any} data
       */
      error(message, data = null) {
        this.log("error", message, data);
      }
      /**
       * Log verboso (apenas quando DEBUG_LEVEL=verbose)
       * @param {string} message
       * @param {any} data
       */
      verbose(message, data = null) {
        if (this.debugLevel === "verbose") {
          this.log("verbose", message, data);
        }
      }
      /**
       * Log específico para crash reports
       * @param {string} message
       * @param {any} data
       */
      crash(message, data = null) {
        if (this.isDebugEnabled) {
          this.log("crash", `\u{1F4A5} CRASH: ${message}`, data);
        }
      }
      /**
       * Log específico para IPC
       * @param {string} message
       * @param {any} data
       */
      ipc(message, data = null) {
        if (this.isDebugEnabled) {
          this.log("ipc", `\u{1F4E1} IPC: ${message}`, data);
        }
      }
      /**
       * Log específico para sanitização
       * @param {string} message
       * @param {any} data
       */
      sanitize(message, data = null) {
        if (this.isDebugEnabled) {
          this.log("sanitize", `\u{1F9F9} SANITIZE: ${message}`, data);
        }
      }
      /**
       * Obtém o prefixo do log baseado no nível
       * @param {string} level
       * @returns {string}
       */
      getLogPrefix(level) {
        const prefixes = {
          info: "\u{1F4DD}",
          warn: "\u26A0\uFE0F",
          error: "\u274C",
          verbose: "\u{1F50D}",
          crash: "\u{1F4A5}",
          ipc: "\u{1F4E1}",
          sanitize: "\u{1F9F9}"
        };
        return prefixes[level] || "\u{1F4DD}";
      }
      /**
       * Ativa/desativa debug em tempo de execução
       * @param {boolean} enabled
       */
      setDebugEnabled(enabled) {
        this.isDebugEnabled = enabled;
      }
      /**
       * Define o nível de debug
       * @param {string} level
       */
      setDebugLevel(level) {
        this.debugLevel = level;
        this.info(`N\xEDvel de debug alterado para: ${level}`);
      }
      /**
       * Obtém estatísticas de debug
       * @returns {object}
       */
      getStats() {
        return {
          enabled: this.isDebugEnabled,
          level: this.debugLevel,
          environment: process.env.NODE_ENV,
          debugTools: process.env.DEBUG_TOOLS
        };
      }
    }
    let debugManager = null;
    function getDebugManager() {
      if (!debugManager) {
        debugManager = new DebugManager();
      }
      return debugManager;
    }
    __name(getDebugManager, "getDebugManager");
    __name2(getDebugManager, "getDebugManager");
    __name22(getDebugManager, "getDebugManager");
    __name222(getDebugManager, "getDebugManager");
    __name2222(getDebugManager, "getDebugManager");
    __name22222(getDebugManager, "getDebugManager");
    module.exports = { DebugManager, getDebugManager };
  }
});
var debug_manager_default = require_debug_manager();
export {
  debug_manager_default as default
};
