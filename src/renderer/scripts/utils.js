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
function debounce(func, wait, immediate = false) {
  let timeout;
  return /* @__PURE__ */ __name222222(
    /* @__PURE__ */ __name22222(
      /* @__PURE__ */ __name2222(
        /* @__PURE__ */ __name222(
          /* @__PURE__ */ __name22(
            /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function executedFunction(...args) {
              const later = /* @__PURE__ */ __name222222(() => {
                timeout = null;
                if (!immediate) func.apply(this, args);
              }, "later");
              const callNow = immediate && !timeout;
              clearTimeout(timeout);
              timeout = setTimeout(later, wait);
              if (callNow) func.apply(this, args);
            }, "executedFunction"), "executedFunction"),
            "executedFunction"
          ),
          "executedFunction"
        ),
        "executedFunction"
      ),
      "executedFunction"
    ),
    "executedFunction"
  );
}
__name(debounce, "debounce");
__name2(debounce, "debounce");
__name22(debounce, "debounce");
__name222(debounce, "debounce");
__name2222(debounce, "debounce");
__name22222(debounce, "debounce");
__name222222(debounce, "debounce");
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
__name(throttle, "throttle");
__name2(throttle, "throttle");
__name22(throttle, "throttle");
__name222(throttle, "throttle");
__name2222(throttle, "throttle");
__name22222(throttle, "throttle");
__name222222(throttle, "throttle");
const NumberUtils = {
  // Formatar número com separadores
  format(number, locale = "pt-BR") {
    return new Intl.NumberFormat(locale).format(number);
  },
  // Formatar porcentagem
  formatPercent(number, decimals = 1, locale = "pt-BR") {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number / 100);
  },
  // Formatar bytes
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  },
  // Abreviar números grandes
  abbreviate(number) {
    if (number < 1e3) return number.toString();
    if (number < 1e6) return (number / 1e3).toFixed(1) + "K";
    if (number < 1e9) return (number / 1e6).toFixed(1) + "M";
    return (number / 1e9).toFixed(1) + "B";
  }
};
const DateUtils = {
  // Formatar data relativa
  formatRelative(date, locale = "pt-BR") {
    const now = /* @__PURE__ */ new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1e3);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return "agora mesmo";
    if (minutes < 60) return `${minutes} minuto${minutes > 1 ? "s" : ""} atr\xE1s`;
    if (hours < 24) return `${hours} hora${hours > 1 ? "s" : ""} atr\xE1s`;
    if (days < 7) return `${days} dia${days > 1 ? "s" : ""} atr\xE1s`;
    return new Intl.DateTimeFormat(locale).format(new Date(date));
  },
  // Formatar duração
  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1e3);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  },
  // Verificar se é hoje
  isToday(date) {
    const today = /* @__PURE__ */ new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
  },
  // Verificar se é esta semana
  isThisWeek(date) {
    const now = /* @__PURE__ */ new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    const checkDate = new Date(date);
    return checkDate >= weekStart && checkDate <= weekEnd;
  }
};
const StringUtils = {
  // Capitalizar primeira letra
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  // Converter para title case
  titleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  },
  // Truncar string
  truncate(str, length, suffix = "...") {
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },
  // Remover acentos
  removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  },
  // Gerar slug
  slugify(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  },
  // Escapar HTML
  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },
  // Gerar ID único
  generateId(prefix = "id") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};
const ArrayUtils = {
  // Remover duplicatas
  unique(array, key = null) {
    if (key) {
      const seen = /* @__PURE__ */ new Set();
      return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      });
    }
    return [...new Set(array)];
  },
  // Agrupar por propriedade
  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },
  // Ordenar por múltiplos critérios
  sortBy(array, ...keys) {
    return array.sort((a, b) => {
      for (const key of keys) {
        const aVal = typeof key === "function" ? key(a) : a[key];
        const bVal = typeof key === "function" ? key(b) : b[key];
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
      }
      return 0;
    });
  },
  // Dividir array em chunks
  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
  // Embaralhar array
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};
const ObjectUtils = {
  // Deep clone
  deepClone(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map((item) => ObjectUtils.deepClone(item));
    if (typeof obj === "object") {
      const cloned = {};
      Object.keys(obj).forEach((key) => {
        cloned[key] = ObjectUtils.deepClone(obj[key]);
      });
      return cloned;
    }
  },
  // Merge profundo
  deepMerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    if (ObjectUtils.isObject(target) && ObjectUtils.isObject(source)) {
      for (const key in source) {
        if (ObjectUtils.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          ObjectUtils.deepMerge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    return ObjectUtils.deepMerge(target, ...sources);
  },
  // Verificar se é objeto
  isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  },
  // Obter valor aninhado
  get(obj, path, defaultValue = void 0) {
    const keys = path.split(".");
    let result = obj;
    for (const key of keys) {
      if (result === null || result === void 0) {
        return defaultValue;
      }
      result = result[key];
    }
    return result !== void 0 ? result : defaultValue;
  },
  // Definir valor aninhado
  set(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    let current = obj;
    for (const key of keys) {
      if (!(key in current) || !ObjectUtils.isObject(current[key])) {
        current[key] = {};
      }
      current = current[key];
    }
    current[lastKey] = value;
    return obj;
  }
};
const DOMUtils = {
  // Criar elemento com atributos
  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "innerHTML") {
        element.innerHTML = value;
      } else if (key === "textContent") {
        element.textContent = value;
      } else if (key.startsWith("data-")) {
        element.setAttribute(key, value);
      } else {
        element[key] = value;
      }
    });
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  },
  // Verificar se elemento está visível
  isVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
  },
  // Scroll suave para elemento
  scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  },
  // Adicionar classe com animação
  addClassWithAnimation(element, className, duration = 300) {
    element.classList.add(className);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  },
  // Remover classe com animação
  removeClassWithAnimation(element, className, duration = 300) {
    return new Promise((resolve) => {
      setTimeout(() => {
        element.classList.remove(className);
        resolve();
      }, duration);
    });
  }
};
const ValidationUtils = {
  // Validar email
  isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  // Validar URL
  isUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  // Validar número
  isNumber(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },
  // Validar string não vazia
  isNotEmpty(value) {
    return typeof value === "string" && value.trim().length > 0;
  },
  // Validar comprimento
  hasLength(value, min, max = Infinity) {
    const length = typeof value === "string" ? value.length : 0;
    return length >= min && length <= max;
  }
};
const PerformanceUtils = {
  // Medir tempo de execução
  measure(name, fn) {
    const result = fn();
    return result;
  },
  // Medir tempo de execução async
  async measureAsync(name, fn) {
    name = null;
    const result = await fn();
    return result;
  },
  // Lazy loading de imagens
  lazyLoadImages(selector = "img[data-src]") {
    const images = document.querySelectorAll(selector);
    const imageObserver = new IntersectionObserver((entries, _observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach((img) => imageObserver.observe(img));
  },
  // Detectar idle state
  onIdle(callback, timeout = 5e3) {
    let timer;
    const resetTimer = /* @__PURE__ */ __name222222(() => {
      clearTimeout(timer);
      timer = setTimeout(callback, timeout);
    }, "resetTimer");
    ["mousedown", "mousemove", "keypress", "scroll", "touchstart"].forEach((event) => {
      document.addEventListener(event, resetTimer, true);
    });
    resetTimer();
  }
};
const StorageUtils = {
  // Local storage com fallback
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  // Session storage
  setSessionItem(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  getSessionItem(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
};
const ColorUtils = {
  // Converter hex para RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  // Converter RGB para hex
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },
  // Gerar cor aleatória
  randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  },
  // Verificar se cor é clara
  isLight(hex) {
    const rgb = ColorUtils.hexToRgb(hex);
    if (!rgb) return false;
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
    return brightness > 128;
  }
};
class EventEmitter {
  static {
    __name(this, "EventEmitter");
  }
  static {
    __name2(this, "EventEmitter");
  }
  static {
    __name22(this, "EventEmitter");
  }
  static {
    __name222(this, "EventEmitter");
  }
  static {
    __name2222(this, "EventEmitter");
  }
  static {
    __name22222(this, "EventEmitter");
  }
  static {
    __name222222(this, "EventEmitter");
  }
  constructor() {
    this.events = {};
  }
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }
  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(...args));
  }
  once(event, callback) {
    const onceCallback = /* @__PURE__ */ __name222222((...args) => {
      callback(...args);
      this.off(event, onceCallback);
    }, "onceCallback");
    this.on(event, onceCallback);
  }
}
if (typeof window !== "undefined") {
  window.Utils = {
    debounce,
    throttle,
    NumberUtils,
    DateUtils,
    StringUtils,
    ArrayUtils,
    ObjectUtils,
    DOMUtils,
    ValidationUtils,
    PerformanceUtils,
    StorageUtils,
    ColorUtils,
    EventEmitter
  };
}
export {
  ArrayUtils,
  ColorUtils,
  DOMUtils,
  DateUtils,
  EventEmitter,
  NumberUtils,
  ObjectUtils,
  PerformanceUtils,
  StorageUtils,
  StringUtils,
  ValidationUtils,
  debounce,
  throttle
};
