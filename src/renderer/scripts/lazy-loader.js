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
class LazyLoader {
  static {
    __name(this, "LazyLoader");
  }
  static {
    __name2(this, "LazyLoader");
  }
  static {
    __name22(this, "LazyLoader");
  }
  static {
    __name222(this, "LazyLoader");
  }
  static {
    __name2222(this, "LazyLoader");
  }
  static {
    __name22222(this, "LazyLoader");
  }
  constructor() {
    this.loadedModules = /* @__PURE__ */ new Map();
    this.loadingPromises = /* @__PURE__ */ new Map();
    this.moduleCache = /* @__PURE__ */ new Map();
  }
  /**
   * Carrega um módulo dinamicamente
   * @param {string} moduleName - Nome do módulo
   * @param {string} modulePath - Caminho do módulo
   * @returns {Promise<any>} - Módulo carregado
   */
  async loadModule(moduleName, modulePath) {
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }
    if (this.loadingPromises.has(moduleName)) {
      return await this.loadingPromises.get(moduleName);
    }
    const loadingPromise = this.loadModuleInternal(moduleName, modulePath);
    this.loadingPromises.set(moduleName, loadingPromise);
    try {
      const module = await loadingPromise;
      this.loadedModules.set(moduleName, module);
      this.loadingPromises.delete(moduleName);
      return module;
    } catch (error) {
      this.loadingPromises.delete(moduleName);
      throw error;
    }
  }
  /**
   * Mapeamento estático de módulos para compatibilidade com Vite
   */
  static getModuleImporter(modulePath) {
    const moduleMap = {
      "./modules/state.js": /* @__PURE__ */ __name22222(
        () => import("./modules/state.js"),
        "./modules/state.js"
      ),
      "./modules/navigation.js": /* @__PURE__ */ __name22222(
        () => import("./modules/navigation.js"),
        "./modules/navigation.js"
      ),
      "./components.js": /* @__PURE__ */ __name22222(
        () => import("./components.js"),
        "./components.js"
      ),
      "./modules/settings.js": /* @__PURE__ */ __name22222(
        () => import("./modules/settings.js"),
        "./modules/settings.js"
      ),
      "./modules/events.js": /* @__PURE__ */ __name22222(
        () => import("./modules/events.js"),
        "./modules/events.js"
      ),
      "./modules/helpers.js": /* @__PURE__ */ __name22222(
        () => import("./modules/helpers.js"),
        "./modules/helpers.js"
      ),
      "./performance.js": /* @__PURE__ */ __name22222(
        () => import("./performance.js"),
        "./performance.js"
      ),
      "./modules/steam-games.js": /* @__PURE__ */ __name22222(
        () => import("./modules/steam-games.js"),
        "./modules/steam-games.js"
      )
    };
    return moduleMap[modulePath] || (() => import(
      /* @vite-ignore */
      modulePath
    ));
  }
  /**
   * Carregamento interno do módulo
   * @param {string} moduleName - Nome do módulo
   * @param {string} modulePath - Caminho do módulo
   * @returns {Promise<any>} - Módulo carregado
   */
  async loadModuleInternal(moduleName, modulePath) {
    moduleName = null;
    const importer = LazyLoader.getModuleImporter(modulePath);
    const module = await importer();
    return module;
  }
  /**
   * Pré-carrega módulos críticos
   * @param {Array<{name: string, path: string}>} modules - Lista de módulos para pré-carregar
   */
  async preloadCriticalModules(modules) {
    const preloadPromises = modules.map(({ name, path }) => this.loadModule(name, path));
    await Promise.allSettled(preloadPromises);
  }
  /**
   * Carrega módulos sob demanda (quando necessário)
   * @param {string} moduleName - Nome do módulo
   * @param {string} modulePath - Caminho do módulo
   * @param {Function} callback - Callback para executar após carregamento
   */
  async loadOnDemand(moduleName, modulePath, callback = null) {
    const module = await this.loadModule(moduleName, modulePath);
    if (callback && typeof callback === "function") {
      await callback(module);
    }
    return module;
  }
  /**
   * Verifica se um módulo está carregado
   * @param {string} moduleName - Nome do módulo
   * @returns {boolean} - Se o módulo está carregado
   */
  isModuleLoaded(moduleName) {
    return this.loadedModules.has(moduleName);
  }
  /**
   * Obtém um módulo carregado
   * @param {string} moduleName - Nome do módulo
   * @returns {any|null} - Módulo carregado ou null
   */
  getLoadedModule(moduleName) {
    return this.loadedModules.get(moduleName) || null;
  }
  /**
   * Remove um módulo do cache (para recarregamento)
   * @param {string} moduleName - Nome do módulo
   */
  unloadModule(moduleName) {
    this.loadedModules.delete(moduleName);
    this.loadingPromises.delete(moduleName);
  }
  /**
   * Limpa todo o cache de módulos
   */
  clearCache() {
    this.loadedModules.clear();
    this.loadingPromises.clear();
    this.moduleCache.clear();
  }
  /**
   * Obtém estatísticas do lazy loader
   * @returns {Object} - Estatísticas
   */
  getStats() {
    return {
      loadedModules: this.loadedModules.size,
      loadingModules: this.loadingPromises.size,
      cachedModules: this.moduleCache.size,
      moduleNames: Array.from(this.loadedModules.keys())
    };
  }
}
const MODULE_CONFIG = {
  // Módulos críticos (carregados imediatamente)
  critical: [
    { name: "StateManager", path: "./modules/state.js" },
    { name: "NavigationManager", path: "./modules/navigation.js" },
    { name: "ComponentManager", path: "./components.js" }
  ],
  // Módulos sob demanda (carregados quando necessário)
  onDemand: [
    { name: "SettingsManager", path: "./modules/settings.js" },
    { name: "EventsManager", path: "./modules/events.js" },
    { name: "HelpersManager", path: "./modules/helpers.js" },
    { name: "PerformanceMonitor", path: "./performance.js" },
    { name: "SteamGamesManager", path: "./modules/steam-games.js" }
  ]
};
const lazyLoader = new LazyLoader();
export {
  LazyLoader,
  MODULE_CONFIG,
  lazyLoader
};
