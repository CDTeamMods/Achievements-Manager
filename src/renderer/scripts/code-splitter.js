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
class CodeSplitter {
  static {
    __name(this, "CodeSplitter");
  }
  static {
    __name2(this, "CodeSplitter");
  }
  static {
    __name22(this, "CodeSplitter");
  }
  static {
    __name222(this, "CodeSplitter");
  }
  constructor() {
    this.chunks = /* @__PURE__ */ new Map();
    this.loadedChunks = /* @__PURE__ */ new Set();
    this.chunkDependencies = /* @__PURE__ */ new Map();
    this.initializeChunks();
  }
  /**
   * Inicializa a configuração de chunks
   */
  initializeChunks() {
    this.chunkDependencies.set("core", []);
    this.chunkDependencies.set("ui", ["core"]);
    this.chunkDependencies.set("settings", ["core", "ui"]);
    this.chunkDependencies.set("games", ["core", "ui"]);
    this.chunkDependencies.set("achievements", ["core", "ui", "games"]);
    this.chunkDependencies.set("steam", ["core", "ui", "games"]);
    this.chunkDependencies.set("performance", ["core"]);
  }
  /**
   * Carrega um chunk específico
   * @param {string} chunkName - Nome do chunk
   * @returns {Promise<any>} - Chunk carregado
   */
  async loadChunk(chunkName) {
    if (this.loadedChunks.has(chunkName)) {
      return this.chunks.get(chunkName);
    }
    const dependencies = this.chunkDependencies.get(chunkName) || [];
    for (const dep of dependencies) {
      if (!this.loadedChunks.has(dep)) {
        await this.loadChunk(dep);
      }
    }
    try {
      const chunk = await this.loadChunkByName(chunkName);
      this.chunks.set(chunkName, chunk);
      this.loadedChunks.add(chunkName);
      return chunk;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Carrega chunk por nome
   * @param {string} chunkName - Nome do chunk
   * @returns {Promise<any>} - Chunk carregado
   */
  async loadChunkByName(chunkName) {
    switch (chunkName) {
      case "core":
        return await this.loadCoreChunk();
      case "ui":
        return await this.loadUIChunk();
      case "settings":
        return await this.loadSettingsChunk();
      case "games":
        return await this.loadGamesChunk();
      case "achievements":
        return await this.loadAchievementsChunk();
      case "steam":
        return await this.loadSteamChunk();
      case "performance":
        return await this.loadPerformanceChunk();
      default:
        throw new Error(`Chunk desconhecido: ${chunkName}`);
    }
  }
  /**
   * Carrega chunk core (essencial)
   */
  async loadCoreChunk() {
    const [{ StateManager }, { NavigationManager }, { ComponentManager }] = await Promise.all([
      import("./modules/state.js"),
      import("./modules/navigation.js"),
      import("./components.js")
    ]);
    return {
      StateManager,
      NavigationManager,
      ComponentManager
    };
  }
  /**
   * Carrega chunk UI (interface)
   */
  async loadUIChunk() {
    const uiModules = await Promise.all([import("./animations.js").catch(() => ({ default: {} }))]);
    return {
      animations: uiModules[0].default || {}
    };
  }
  /**
   * Carrega chunk settings (configurações)
   */
  async loadSettingsChunk() {
    const { SettingsManager } = await import("./modules/settings.js");
    return { SettingsManager };
  }
  /**
   * Carrega chunk games (jogos)
   */
  async loadGamesChunk() {
    const modules = await Promise.all([
      import("./modules/helpers.js"),
      import("./modules/events.js")
    ]);
    return {
      HelpersManager: modules[0].HelpersManager,
      EventsManager: modules[1].EventsManager
    };
  }
  /**
   * Carrega chunk achievements (conquistas)
   */
  async loadAchievementsChunk() {
    return {
      achievements: {},
      helpers: {}
    };
  }
  /**
   * Carrega chunk steam (Steam integration)
   */
  async loadSteamChunk() {
    try {
      const { SteamGamesManager } = await import("./modules/steam-games.js");
      return { SteamGamesManager };
    } catch (error) {
      return { SteamGamesManager: null };
    }
  }
  /**
   * Carrega chunk performance (monitoramento)
   */
  async loadPerformanceChunk() {
    try {
      const { PerformanceMonitor } = await import("./performance.js");
      return { PerformanceMonitor };
    } catch (error) {
      return { PerformanceMonitor: null };
    }
  }
  /**
   * Pré-carrega chunks críticos
   * @param {Array<string>} chunkNames - Nomes dos chunks para pré-carregar
   */
  async preloadChunks(chunkNames) {
    const preloadPromises = chunkNames.map(
      (chunkName) => this.loadChunk(chunkName).catch((error) => {
        return null;
      })
    );
    await Promise.allSettled(preloadPromises);
  }
  /**
   * Carrega chunks sob demanda
   * @param {Array<string>} chunkNames - Nomes dos chunks
   * @param {Function} callback - Callback após carregamento
   */
  async loadOnDemand(chunkNames, callback = null) {
    try {
      const chunks = await Promise.all(chunkNames.map((chunkName) => this.loadChunk(chunkName)));
      if (callback && typeof callback === "function") {
        await callback(chunks);
      }
      return chunks;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Verifica se um chunk está carregado
   * @param {string} chunkName - Nome do chunk
   * @returns {boolean} - Se o chunk está carregado
   */
  isChunkLoaded(chunkName) {
    return this.loadedChunks.has(chunkName);
  }
  /**
   * Obtém um chunk carregado
   * @param {string} chunkName - Nome do chunk
   * @returns {any|null} - Chunk carregado ou null
   */
  getLoadedChunk(chunkName) {
    return this.chunks.get(chunkName) || null;
  }
  /**
   * Remove chunk do cache
   * @param {string} chunkName - Nome do chunk
   */
  unloadChunk(chunkName) {
    this.chunks.delete(chunkName);
    this.loadedChunks.delete(chunkName);
  }
  /**
   * Obtém estatísticas dos chunks
   * @returns {Object} - Estatísticas
   */
  getStats() {
    return {
      totalChunks: this.chunkDependencies.size,
      loadedChunks: this.loadedChunks.size,
      loadedChunkNames: Array.from(this.loadedChunks),
      chunkSizes: this.getChunkSizes()
    };
  }
  /**
   * Calcula tamanhos aproximados dos chunks
   * @returns {Object} - Tamanhos dos chunks
   */
  getChunkSizes() {
    const sizes = {};
    for (const [chunkName, chunk] of this.chunks) {
      try {
        sizes[chunkName] = JSON.stringify(chunk).length;
      } catch (error) {
        sizes[chunkName] = "N/A";
      }
    }
    return sizes;
  }
}
const CHUNK_CONFIG = {
  // Chunks críticos (carregados imediatamente)
  critical: ["core"],
  // Chunks de UI (carregados após core)
  ui: ["ui"],
  // Chunks sob demanda
  onDemand: ["settings", "games", "achievements", "steam", "performance"]
};
const codeSplitter = new CodeSplitter();
export {
  CHUNK_CONFIG,
  CodeSplitter,
  codeSplitter
};
