// IPC Sanitizer - Remove propriedades não clonáveis dos objetos
import { ALLOWED_SETTINGS_KEYS } from '../config/allowed-settings-keys.js';

class IPCSanitizer {
  /**
   * Sanitiza um objeto removendo propriedades que não podem ser clonadas pelo IPC
   * @param {any} obj - Objeto a ser sanitizado
   * @param {number} maxDepth - Profundidade máxima para evitar loops infinitos
   * @param {WeakSet} seen - Set para detectar referências circulares
   * @returns {any} Objeto sanitizado
   */
  static sanitize(obj, maxDepth = 10, seen = new WeakSet()) {
    if (maxDepth <= 0) {
      return '[Max Depth Exceeded]';
    }

    // Verificar se já processamos este objeto
    if (obj && typeof obj === 'object' && seen.has(obj)) {
      return '[Circular Reference]';
    }

    // Tipos primitivos são seguros
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }

    // Datas são convertidas para ISO string
    if (obj instanceof Date) {
      return obj.toISOString();
    }

    // Objetos DOM e outros objetos não serializáveis
    if (obj instanceof Node || obj instanceof Window || obj instanceof Document) {
      return '[DOM Object]';
    }

    // Promises - tratamento específico
    if (obj instanceof Promise || (obj && typeof obj.then === 'function')) {
      return {
        type: 'Promise',
        state: obj.constructor ? obj.constructor.name : 'Promise',
        hasValue: false,
        hasReason: false,
        constructor: obj.constructor ? obj.constructor.name : 'Promise',
      };
    }

    // Funções
    if (typeof obj === 'function') {
      return '[Function]';
    }

    // Arrays
    if (Array.isArray(obj)) {
      seen.add(obj);
      const result = obj
        .map(item => this.sanitize(item, maxDepth - 1, seen))
        .filter(item => item !== undefined);
      seen.delete(obj);
      return result;
    }

    // Objetos
    if (typeof obj === 'object') {
      seen.add(obj);

      try {
        // Objetos específicos do browser que podem causar problemas
        if (obj.constructor && obj.constructor.name) {
          const constructorName = obj.constructor.name;

          // Performance Memory API
          if (constructorName === 'MemoryInfo') {
            const result = {
              usedJSHeapSize: obj.usedJSHeapSize || 0,
              totalJSHeapSize: obj.totalJSHeapSize || 0,
              jsHeapSizeLimit: obj.jsHeapSizeLimit || 0,
            };
            seen.delete(obj);
            return result;
          }

          // Network Information API
          if (constructorName === 'NetworkInformation') {
            const result = {
              effectiveType: obj.effectiveType || 'unknown',
              downlink: obj.downlink || 0,
              rtt: obj.rtt || 0,
            };
            seen.delete(obj);
            return result;
          }

          // Outros objetos nativos problemáticos
          if (
            ['HTMLElement', 'EventTarget', 'Navigator', 'Location', 'History', 'Screen'].includes(
              constructorName
            )
          ) {
            seen.delete(obj);
            return `[${constructorName} Object]`;
          }
        }

        // Verificar se é um objeto simples (não uma instância de classe)
        if (obj.constructor !== Object && obj.constructor !== undefined) {
          // Se for uma instância de classe, tentar extrair propriedades serializáveis
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

        // Objeto simples
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
          if (this.isSerializable(value)) {
            const sanitizedValue = this.sanitize(value, maxDepth - 1, seen);
            if (sanitizedValue !== undefined) {
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

    // Outros tipos não serializáveis
    return undefined;
  }

  /**
   * Verifica se um valor é serializável
   * @param {any} value - Valor a ser verificado
   * @returns {boolean} True se for serializável
   */
  static isSerializable(value) {
    if (value === null || value === undefined) {
      return true;
    }

    const type = typeof value;

    // Tipos primitivos
    if (type === 'string' || type === 'number' || type === 'boolean') {
      return true;
    }

    // Datas
    if (value instanceof Date) {
      return true;
    }

    // Arrays e objetos simples
    if (type === 'object' && (Array.isArray(value) || value.constructor === Object)) {
      return true;
    }

    // Promises não são serializáveis diretamente
    if (value instanceof Promise || (value && typeof value.then === 'function')) {
      return false;
    }

    // Funções, símbolos, etc. não são serializáveis
    if (type === 'function' || type === 'symbol') {
      return false;
    }

    // Objetos com protótipos complexos podem ser problemáticos
    if (type === 'object' && value.constructor !== Object && value.constructor !== Array) {
      // Permitir alguns tipos conhecidos
      if (
        value instanceof Map ||
        value instanceof Set ||
        value instanceof WeakMap ||
        value instanceof WeakSet
      ) {
        return false;
      }
      // Outros objetos podem ser tentados
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
    if (!settings || typeof settings !== 'object') {
      return settings;
    }

    // Usa a configuração centralizada
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
      return JSON.parse(JSON.stringify(sanitized));
    } catch (error) {
      // Log removido para evitar dependência circular com DebugManager
      return this.sanitize(obj);
    }
  }
}

// Exportar para uso global
window.IPCSanitizer = IPCSanitizer;
// Log removido para evitar dependência circular com DebugManager

// Export ES6
export { IPCSanitizer };
