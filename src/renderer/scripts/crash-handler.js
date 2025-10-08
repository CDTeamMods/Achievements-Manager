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
var __name222222 = /* @__PURE__ */ __name22222(
  (target, value) => __defProp222222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp2222222 = Object.defineProperty;
var __name2222222 = /* @__PURE__ */ __name222222(
  (target, value) => __defProp2222222(target, "name", { value, configurable: true }),
  "__name"
);
class CrashHandler {
  static {
    __name(this, "CrashHandler");
  }
  static {
    __name2(this, "CrashHandler");
  }
  static {
    __name22(this, "CrashHandler");
  }
  static {
    __name222(this, "CrashHandler");
  }
  static {
    __name2222(this, "CrashHandler");
  }
  static {
    __name22222(this, "CrashHandler");
  }
  static {
    __name222222(this, "CrashHandler");
  }
  static {
    __name2222222(this, "CrashHandler");
  }
  constructor() {
    this.isReporting = false;
    this.debug = {
      ipc: /* @__PURE__ */ __name2222222(() => {
      }, "ipc"),
      crash: /* @__PURE__ */ __name2222222(() => {
      }, "crash"),
      error: /* @__PURE__ */ __name2222222(() => {
      }, "error"),
      info: /* @__PURE__ */ __name2222222(() => {
      }, "info"),
      warn: /* @__PURE__ */ __name2222222(() => {
      }, "warn"),
      sanitize: /* @__PURE__ */ __name2222222(() => {
      }, "sanitize")
    };
    this.setupErrorHandlers();
    this.setupConsoleOverrides();
  }
  setupErrorHandlers() {
    window.addEventListener("error", (event) => {
      this.reportError({
        type: "javascript-error",
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
      });
    });
    window.addEventListener("unhandledrejection", (event) => {
      this.reportError({
        type: "unhandled-promise-rejection",
        message: event.reason?.message || event.reason?.toString() || "Unknown rejection",
        stack: event.reason?.stack,
        timestamp: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
        context: {
          // Não incluir a promise diretamente para evitar problemas de clonagem
          promiseInfo: {
            type: "Promise",
            state: "rejected",
            hasValue: false,
            hasReason: true,
            constructor: event.promise?.constructor?.name || "Promise"
          }
        }
      });
    });
    window.addEventListener(
      "error",
      (event) => {
        if (event.target !== window) {
          this.reportError({
            type: "resource-error",
            message: `Failed to load resource: ${event.target.src || event.target.href}`,
            element: event.target.tagName,
            timestamp: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      },
      true
    );
  }
  async reportError(errorData) {
    if (this.isReporting) {
      return null;
    }
    if (errorData.message && (errorData.message.includes("could not be cloned") || errorData.message.includes("IpcRendererInternal.send") || errorData.message.includes("An object could not be cloned"))) {
      this.debug.ipc("Erro de clonagem IPC ignorado (renderer)", errorData.message);
      return null;
    }
    if (errorData.stack && (errorData.stack.includes("IpcRendererInternal.send") || errorData.stack.includes("could not be cloned"))) {
      this.debug.ipc("Erro de clonagem IPC ignorado (renderer stack)", errorData.stack);
      return null;
    }
    this.isReporting = true;
    try {
      const contextInfo = {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        memory: performance.memory ? {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        } : null,
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : null
      };
      const fullErrorData = {
        error: errorData,
        context: {
          ...contextInfo,
          ...errorData.context
        }
      };
      if (window.electronAPI && window.electronAPI.crashReporter) {
        let sanitizedErrorData;
        if (window.IPCSanitizer) {
          sanitizedErrorData = window.IPCSanitizer.sanitize(fullErrorData);
        } else {
          sanitizedErrorData = this.manualSanitize(fullErrorData);
        }
        const crashId = await window.electronAPI.crashReporter.reportError(sanitizedErrorData);
        this.debug.crash(`Error reported with ID: ${crashId}`);
        return crashId;
      } else {
        this.debug.warn("Crash reporter not available, logging error locally:", fullErrorData);
        return null;
      }
    } catch (reportError) {
      this.debug.error("Failed to report error:", reportError);
      return null;
    } finally {
      this.isReporting = false;
    }
  }
  // Método para sanitizar dados manualmente quando IPCSanitizer não está disponível
  manualSanitize(obj, depth = 0, seen = /* @__PURE__ */ new WeakSet()) {
    if (depth > 10) return "[Max Depth Reached]";
    if (obj && typeof obj === "object" && seen.has(obj)) {
      return "[Circular Reference]";
    }
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    seen.add(obj);
    if (Array.isArray(obj)) {
      return obj.map((item) => this.manualSanitize(item, depth + 1, seen));
    }
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      try {
        if (value instanceof Promise || value && typeof value.then === "function") {
          sanitized[key] = {
            type: "Promise",
            state: value.constructor ? value.constructor.name : "Promise",
            hasValue: false,
            hasReason: false,
            constructor: value.constructor ? value.constructor.name : "Promise"
          };
        } else if (typeof value === "function") {
          sanitized[key] = "[Function]";
        } else if (value instanceof Node) {
          sanitized[key] = "[DOM Node]";
        } else if (value instanceof Window) {
          sanitized[key] = "[Window Object]";
        } else if (value instanceof HTMLElement) {
          sanitized[key] = "[HTML Element]";
        } else if (key === "target" && value && value.tagName) {
          sanitized[key] = `[${value.tagName} Element]`;
        } else if (value && typeof value === "object" && value.constructor && value.constructor.name !== "Object") {
          sanitized[key] = `[${value.constructor.name} Instance]`;
        } else {
          sanitized[key] = this.manualSanitize(value, depth + 1, seen);
        }
      } catch (error) {
        sanitized[key] = `[Sanitization Error: ${error.message}]`;
      }
    }
    return sanitized;
  }
  // Método público para reportar erros manualmente
  static reportManualError(error, context = {}) {
    if (window.crashHandler) {
      return window.crashHandler.reportError({
        type: "manual-error",
        message: error.message || error.toString(),
        stack: error.stack,
        timestamp: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
        context
      });
    }
    return null;
  }
  // Método para testar o sistema de crash reports
  static testCrashReporter() {
    CrashHandler.reportManualError(new Error("Test error from crash handler"), {
      testType: "manual-test",
      description: "This is a test error to verify crash reporting functionality"
    });
  }
  // Método para obter estatísticas de crash
  static async getCrashStats() {
    try {
      if (window.electronAPI && window.electronAPI.crashReporter) {
        return await window.electronAPI.crashReporter.getStats();
      }
      return null;
    } catch (error) {
      await window.electronAPI.debug.error("Failed to get crash stats:", error);
      return null;
    }
  }
  // Método para limpar crash reports
  static async clearCrashReports() {
    try {
      if (window.electronAPI && window.electronAPI.crashReporter) {
        return await window.electronAPI.crashReporter.clearReports();
      }
      return false;
    } catch (error) {
      await window.electronAPI.debug.error("Failed to clear crash reports:", error);
      return false;
    }
  }
  // Método para obter lista de crashes
  static async getCrashList() {
    try {
      if (window.electronAPI && window.electronAPI.crashReporter) {
        return await window.electronAPI.crashReporter.getCrashList();
      }
      return [];
    } catch (error) {
      await window.electronAPI.debug.error("Failed to get crash list:", error);
      return [];
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  window.crashHandler = new CrashHandler();
});
window.CrashHandler = CrashHandler;
export {
  CrashHandler
};
