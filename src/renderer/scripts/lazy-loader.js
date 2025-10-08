/**
 * Sistema de Lazy Loading para Achievements Manager
 * Carrega módulos dinamicamente conforme necessário para melhor performance
 */

class LazyLoader {
  constructor() {
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
    this.moduleCache = new Map();

  }

  /**
   * Carrega um módulo dinamicamente
   * @param {string} moduleName - Nome do módulo
   * @param {string} modulePath - Caminho do módulo
   * @returns {Promise<any>} - Módulo carregado
   */
  async loadModule(moduleName, modulePath) {
    // Verificar se já está carregado
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }

    // Verificar se já está sendo carregado
    if (this.loadingPromises.has(moduleName)) {
      return await this.loadingPromises.get(moduleName);
    }

    // Criar promise de carregamento
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
      './modules/state.js': () => import('./modules/state.js'),
      './modules/navigation.js': () => import('./modules/navigation.js'),
      './components.js': () => import('./components.js'),
      './modules/settings.js': () => import('./modules/settings.js'),
      './modules/events.js': () => import('./modules/events.js'),
      './modules/helpers.js': () => import('./modules/helpers.js'),
      './performance.js': () => import('./performance.js'),
      './modules/steam-games.js': () => import('./modules/steam-games.js')
    };
    
    return moduleMap[modulePath] || (() => import(/* @vite-ignore */ modulePath));
  }

  /**
   * Carregamento interno do módulo
   * @param {string} moduleName - Nome do módulo
   * @param {string} modulePath - Caminho do módulo
   * @returns {Promise<any>} - Módulo carregado
   */
  async loadModuleInternal(moduleName, modulePath) {
    try {
      const importer = LazyLoader.getModuleImporter(modulePath);
      const module = await importer();
      return module;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Pré-carrega módulos críticos
   * @param {Array<{name: string, path: string}>} modules - Lista de módulos para pré-carregar
   */
  async preloadCriticalModules(modules) {

    const preloadPromises = modules.map(({ name, path }) => 
      this.loadModule(name, path).catch(error => {

        return null;
      })
    );

    await Promise.allSettled(preloadPromises);

  }

  /**
   * Carrega módulos sob demanda (quando necessário)
   * @param {string} moduleName - Nome do módulo
   * @param {string} modulePath - Caminho do módulo
   * @param {Function} callback - Callback para executar após carregamento
   */
  async loadOnDemand(moduleName, modulePath, callback = null) {
    try {
      const module = await this.loadModule(moduleName, modulePath);
      
      if (callback && typeof callback === 'function') {
        await callback(module);
      }
      
      return module;
    } catch (error) {

      throw error;
    }
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

// Configuração de módulos para lazy loading
export const MODULE_CONFIG = {
  // Módulos críticos (carregados imediatamente)
  critical: [
    { name: 'StateManager', path: './modules/state.js' },
    { name: 'NavigationManager', path: './modules/navigation.js' },
    { name: 'ComponentManager', path: './components.js' }
  ],
  
  // Módulos sob demanda (carregados quando necessário)
  onDemand: [
    { name: 'SettingsManager', path: './modules/settings.js' },
    { name: 'EventsManager', path: './modules/events.js' },
    { name: 'HelpersManager', path: './modules/helpers.js' },
    { name: 'PerformanceMonitor', path: './performance.js' },
    { name: 'SteamGamesManager', path: './modules/steam-games.js' }
  ]
};

// Instância global do lazy loader
export const lazyLoader = new LazyLoader();

// Exportar classe para uso direto
export { LazyLoader };