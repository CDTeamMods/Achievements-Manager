var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2(
  (target, value) => __defProp22(target, "name", { value, configurable: true }),
  "__name"
);
class RendererDebugManager {
  static {
    __name(this, "RendererDebugManager");
  }
  static {
    __name2(this, "RendererDebugManager");
  }
  static {
    __name22(this, "RendererDebugManager");
  }
  constructor() {
    this.isDebugEnabled = this.checkDebugEnabled();
    this.debugLevel = "info";
    this.init();
  }
  checkDebugEnabled() {
    try {
      const localStorageDebug = localStorage.getItem("DEBUG_TOOLS");
      if (localStorageDebug === "true") return true;
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("debug") === "true") return true;
      if (window.location.protocol === "file:" && window.location.href.includes("src")) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
  init() {
  }
  /**
   * Verifica se o debug está habilitado
   * @returns {boolean}
   */
  isEnabled() {
    return this.isDebugEnabled;
  }
  /**
   * Log de debug condicional
   * @param {string} level - Nível do log
   * @param {string} message - Mensagem
   * @param {any} data - Dados adicionais
   */
  log(level, message, _data = null) {
    if (!this.isDebugEnabled) return;
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
    localStorage.setItem("DEBUG_TOOLS", enabled.toString());
  }
  /**
   * Obtém estatísticas de debug
   * @returns {object}
   */
  getStats() {
    return {
      enabled: this.isDebugEnabled,
      level: this.debugLevel,
      location: window.location.href,
      userAgent: navigator.userAgent
    };
  }
}
let debugManager = null;
function getDebugManager() {
  if (!debugManager) {
    debugManager = new RendererDebugManager();
  }
  return debugManager;
}
__name(getDebugManager, "getDebugManager");
__name2(getDebugManager, "getDebugManager");
__name22(getDebugManager, "getDebugManager");
window.DebugManager = RendererDebugManager;
window.getDebugManager = getDebugManager;
export {
  RendererDebugManager,
  getDebugManager
};
