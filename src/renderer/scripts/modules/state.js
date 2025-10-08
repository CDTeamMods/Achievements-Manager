// State Manager - Gerenciamento de Estado Global
class StateManager {
  constructor() {
    this.state = new Map();
    this.listeners = new Map();
    this.init();
  }

  init() {}

  setState(key, value) {
    const oldValue = this.state.get(key);
    this.state.set(key, value);

    // Notificar listeners
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(callback => {
        try {
          callback(value, oldValue);
        } catch (error) {
          // Log removido para evitar dependência circular com DebugManager
        }
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
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    // Retornar função para unsubscribe
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
    try {
      const value = this.getState(key);
      if (value !== undefined) {
        localStorage.setItem(`achievements-${key}`, JSON.stringify(value));
      }
    } catch (error) {
      // Log removido para evitar dependência circular com DebugManager
    }
  }

  // Carregar estado do localStorage
  loadFromStorage(key) {
    try {
      const stored = localStorage.getItem(`achievements-${key}`);
      if (stored) {
        const value = JSON.parse(stored);
        this.setState(key, value);
        return value;
      }
    } catch (error) {
      // Log removido para evitar dependência circular com DebugManager
    }
    return null;
  }
}

// Exportar para uso global

// Exportar a classe StateManager
export { StateManager };

// Disponibilizar globalmente para compatibilidade
window.StateManager = StateManager;
