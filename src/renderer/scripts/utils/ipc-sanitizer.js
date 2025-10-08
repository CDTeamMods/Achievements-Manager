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
import { ALLOWED_SETTINGS_KEYS } from "../config/allowed-settings-keys.js";
class IPCSanitizer {
  static {
    __name(this, "IPCSanitizer");
  }
  static {
    __name2(this, "IPCSanitizer");
  }
  static {
    __name22(this, "IPCSanitizer");
  }
  static {
    __name222(this, "IPCSanitizer");
  }
  static {
    __name2222(this, "IPCSanitizer");
  }
  /**
   * Sanitiza um objeto removendo propriedades que não podem ser clonadas pelo IPC
   * @param {any} obj - Objeto a ser sanitizado
   * @param {number} maxDepth - Profundidade máxima para evitar loops infinitos
   * @param {WeakSet} seen - Set para detectar referências circulares
   * @returns {any} Objeto sanitizado
   */
  static sanitize(obj, maxDepth = 10, seen = /* @__PURE__ */ new WeakSet()) {
    if (maxDepth <= 0) {
      return "[Max Depth Exceeded]";
    }
    if (obj && typeof obj === "object" && seen.has(obj)) {
      return "[Circular Reference]";
    }
    if (obj === null || obj === void 0) {
      return obj;
    }
    if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
      return obj;
    }
    if (obj instanceof Date) {
      return obj.toISOString();
    }
    if (obj instanceof Node || obj instanceof Window || obj instanceof Document) {
      return "[DOM Object]";
    }
    if (obj instanceof Promise || obj && typeof obj.then === "function") {
      return {
        type: "Promise",
        state: obj.constructor ? obj.constructor.name : "Promise",
        hasValue: false,
        hasReason: false,
        constructor: obj.constructor ? obj.constructor.name : "Promise"
      };
    }
    if (typeof obj === "function") {
      return "[Function]";
    }
    if (Array.isArray(obj)) {
      seen.add(obj);
      const result = obj.map((item) => this.sanitize(item, maxDepth - 1, seen)).filter((item) => item !== void 0);
      seen.delete(obj);
      return result;
    }
    if (typeof obj === "object") {
      seen.add(obj);
      try {
        if (obj.constructor && obj.constructor.name) {
          const constructorName = obj.constructor.name;
          if (constructorName === "MemoryInfo") {
            const result = {
              usedJSHeapSize: obj.usedJSHeapSize || 0,
              totalJSHeapSize: obj.totalJSHeapSize || 0,
              jsHeapSizeLimit: obj.jsHeapSizeLimit || 0
            };
            seen.delete(obj);
            return result;
          }
          if (constructorName === "NetworkInformation") {
            const result = {
              effectiveType: obj.effectiveType || "unknown",
              downlink: obj.downlink || 0,
              rtt: obj.rtt || 0
            };
            seen.delete(obj);
            return result;
          }
          if (["HTMLElement", "EventTarget", "Navigator", "Location", "History", "Screen"].includes(
            constructorName
          )) {
            seen.delete(obj);
            return `[${constructorName} Object]`;
          }
        }
        if (obj.constructor !== Object && obj.constructor !== void 0) {
          const serializable = {};
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              const value = obj[key];
              if (this.isSerializable(value)) {
                serializable[key] = this.sanitize(value, maxDepth - 1, seen);
              }
            }
          }
          seen.delete(obj);
          return serializable;
        }
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
          if (this.isSerializable(value)) {
            const sanitizedValue = this.sanitize(value, maxDepth - 1, seen);
            if (sanitizedValue !== void 0) {
              sanitized[key] = sanitizedValue;
            }
          }
        }
        seen.delete(obj);
        return sanitized;
      } catch (error) {
        seen.delete(obj);
        return `[Sanitization Error: ${error.message}]`;
      }
    }
    return void 0;
  }
  /**
   * Verifica se um valor é serializável
   * @param {any} value - Valor a ser verificado
   * @returns {boolean} True se for serializável
   */
  static isSerializable(value) {
    if (value === null || value === void 0) {
      return true;
    }
    const type = typeof value;
    if (type === "string" || type === "number" || type === "boolean") {
      return true;
    }
    if (value instanceof Date) {
      return true;
    }
    if (type === "object" && (Array.isArray(value) || value.constructor === Object)) {
      return true;
    }
    if (value instanceof Promise || value && typeof value.then === "function") {
      return false;
    }
    if (type === "function" || type === "symbol") {
      return false;
    }
    if (type === "object" && value.constructor !== Object && value.constructor !== Array) {
      if (value instanceof Map || value instanceof Set || value instanceof WeakMap || value instanceof WeakSet) {
        return false;
      }
      return true;
    }
    return false;
  }
  /**
   * Sanitiza especificamente configurações
   * @param {Object} settings - Configurações a serem sanitizadas
   * @returns {Object} Configurações sanitizadas
   */
  static sanitizeSettings(settings) {
    if (!settings || typeof settings !== "object") {
      return settings;
    }
    const allowedKeys = ALLOWED_SETTINGS_KEYS;
    const sanitized = {};
    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(settings, key)) {
        const value = settings[key];
        if (this.isSerializable(value)) {
          sanitized[key] = this.sanitize(value, 5);
        }
      }
    }
    return sanitized;
  }
  /**
   * Cria uma versão deep clone segura de um objeto
   * @param {any} obj - Objeto a ser clonado
   * @returns {any} Clone do objeto
   */
  static safeClone(obj) {
    try {
      const sanitized = this.sanitize(obj);
      try {
        return structuredClone(sanitized);
      } catch {
        return { ...sanitized };
      }
    } catch {
      return this.sanitize(obj);
    }
  }
}
window.IPCSanitizer = IPCSanitizer;
export {
  IPCSanitizer
};
