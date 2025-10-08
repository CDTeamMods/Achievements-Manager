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
class StateManager {
  static {
    __name(this, "StateManager");
  }
  static {
    __name2(this, "StateManager");
  }
  static {
    __name22(this, "StateManager");
  }
  static {
    __name222(this, "StateManager");
  }
  static {
    __name2222(this, "StateManager");
  }
  static {
    __name22222(this, "StateManager");
  }
  constructor() {
    this.state = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Map();
    this.init();
  }
  init() {
  }
  setState(key, value) {
    const oldValue = this.state.get(key);
    this.state.set(key, value);
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach((callback) => {
        callback(value, oldValue);
      });
    }
  }
  getState(key) {
    return this.state.get(key);
  }
  getAllState() {
    return Object.fromEntries(this.state);
  }
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, /* @__PURE__ */ new Set());
    }
    this.listeners.get(key).add(callback);
    return () => {
      if (this.listeners.has(key)) {
        this.listeners.get(key).delete(callback);
      }
    };
  }
  unsubscribe(key, callback) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).delete(callback);
    }
  }
  clearState(key) {
    if (key) {
      this.state.delete(key);
      this.listeners.delete(key);
    } else {
      this.state.clear();
      this.listeners.clear();
    }
  }
  // Persistir estado no localStorage
  saveToStorage(key) {
    const value = this.getState(key);
    if (value !== void 0) {
      localStorage.setItem(`achievements-${key}`, JSON.stringify(value));
    }
  }
  // Carregar estado do localStorage
  loadFromStorage(key) {
    const stored = localStorage.getItem(`achievements-${key}`);
    if (stored) {
      const value = JSON.parse(stored);
      this.setState(key, value);
      return value;
    }
    return null;
  }
}
window.StateManager = StateManager;
export {
  StateManager
};
