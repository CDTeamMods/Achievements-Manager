var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2(
  (target, value) => __defProp22(target, "name", { value, configurable: true }),
  "__name"
);
const require_performance = /* @__PURE__ */ __name22((module) => {
  const { app } = require("electron");
  const os = require("node:os");
  class PerformanceManager {
    static {
      __name(this, "PerformanceManager");
    }
    static {
      __name2(this, "PerformanceManager");
    }
    static {
      __name22(this, "PerformanceManager");
    }
    constructor(store) {
      this.store = store;
      this.metrics = {
        memoryUsage: [],
        cpuUsage: [],
        renderTimes: []
      };
      this.monitoringInterval = null;
      this.memoryCleanupInterval = null;
      this.memoryMonitoringInterval = null;
    }
    /**
     * Inicializa otimizações de performance
     */
    initialize() {
      this.setupAppOptimizations();
      this.setupMemoryManagement();
      this.setupCPUOptimizations();
    }
    /**
     * Configura otimizações do app
     */
    setupAppOptimizations() {
      const liteMode = this.store.get("liteMode", false);
      if (liteMode) {
        app.commandLine.appendSwitch("--disable-gpu");
        app.commandLine.appendSwitch("--disable-software-rasterizer");
        app.commandLine.appendSwitch("--disable-background-timer-throttling");
        app.commandLine.appendSwitch("--max_old_space_size=2048");
      } else {
        app.commandLine.appendSwitch("--enable-gpu-rasterization");
        app.commandLine.appendSwitch("--enable-zero-copy");
        app.commandLine.appendSwitch("--disable-background-timer-throttling");
        app.commandLine.appendSwitch("--disable-renderer-backgrounding");
        app.commandLine.appendSwitch("--disable-backgrounding-occluded-windows");
        app.commandLine.appendSwitch("--memory-pressure-off");
        app.commandLine.appendSwitch("--max_old_space_size=3072");
      }
      app.commandLine.appendSwitch("--aggressive-cache-discard");
    }
    /**
     * Gerenciamento inteligente de memória
     */
    setupMemoryManagement() {
      this.memoryCleanupInterval = setInterval(() => {
        if (global.gc) {
          global.gc();
        }
        this.cleanupUnusedResources();
      }, 3e4);
      this.memoryMonitoringInterval = setInterval(() => {
        const memUsage = process.memoryUsage();
        this.metrics.memoryUsage.push({
          timestamp: Date.now(),
          ...memUsage
        });
        if (this.metrics.memoryUsage.length > 100) {
          this.metrics.memoryUsage.shift();
        }
        const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
        if (heapUsedMB > 500) {
          this.forceGarbageCollection();
        }
      }, 5e3);
    }
    /**
     * Otimizações de CPU
     */
    setupCPUOptimizations() {
      const cpuCount = os.cpus().length;
      const liteMode = this.store.get("liteMode", false);
      let maxWorkers;
      if (liteMode) {
        maxWorkers = 2;
      } else {
        maxWorkers = Math.min(4, Math.max(2, Math.floor(cpuCount / 2)));
      }
      app.commandLine.appendSwitch("--max-workers", maxWorkers.toString());
    }
    /**
     * Força coleta de lixo
     */
    forceGarbageCollection() {
      if (global.gc) {
        global.gc();
      }
    }
    /**
     * Limpa recursos não utilizados
     */
    cleanupUnusedResources() {
      const imageCache = this.store.get("cache.images", {});
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1e3;
      Object.keys(imageCache).forEach((key) => {
        if (now - imageCache[key].timestamp > maxAge) {
          delete imageCache[key];
        }
      });
      this.store.set("cache.images", imageCache);
      const logs = this.store.get("logs", []);
      if (logs.length > 1e3) {
        this.store.set("logs", logs.slice(-500));
      }
    }
    /**
     * Inicia monitoramento de performance
     */
    startMonitoring() {
      this.clearStoredMetrics();
      this.monitoringInterval = setInterval(() => {
        this.collectMetrics();
      }, 1e4);
    }
    /**
     * Limpa métricas armazenadas no settings.json
     */
    clearStoredMetrics() {
      if (this.store.has("performance.metrics")) {
        this.store.delete("performance.metrics");
      }
    }
    /**
     * Otimiza baseado no modo lite
     */
    applyLiteMode(enabled) {
      if (enabled) {
        app.commandLine.appendSwitch("--disable-gpu-compositing");
        app.commandLine.appendSwitch("--disable-software-rasterizer");
      }
    }
    /**
     * Configura handlers IPC para performance
     */
    setupIPC(ipcMain) {
      ipcMain.handle("performance:getMetrics", () => {
        return {
          memory: process.memoryUsage(),
          cpu: process.cpuUsage(),
          uptime: process.uptime(),
          metrics: this.metrics || {},
          memoryUsage: this.metrics.memoryUsage || [],
          cpuUsage: this.metrics.cpuUsage || [],
          isLiteMode: this.store.get("liteMode", false)
        };
      });
      ipcMain.handle("performance:forceGC", () => {
        this.forceGarbageCollection();
        return { success: true };
      });
      ipcMain.handle("performance:cleanup", () => {
        this.cleanupUnusedResources();
        return { success: true };
      });
      ipcMain.handle("performance:setLiteMode", (event, enabled) => {
        this.applyLiteMode(enabled);
        this.store.set("liteMode", enabled);
        return { success: true };
      });
    }
    /**
     * Para o monitoramento e limpa todos os recursos
     */
    stopMonitoring() {
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
        this.monitoringInterval = null;
      }
      if (this.memoryCleanupInterval) {
        clearInterval(this.memoryCleanupInterval);
        this.memoryCleanupInterval = null;
      }
      if (this.memoryMonitoringInterval) {
        clearInterval(this.memoryMonitoringInterval);
        this.memoryMonitoringInterval = null;
      }
    }
  }
  async function setupPerformance(store) {
    const { ipcMain } = require("electron");
    const performanceManager = new PerformanceManager(store);
    performanceManager.initialize();
    performanceManager.setupIPC(ipcMain);
    return performanceManager;
  }
  __name(setupPerformance, "setupPerformance");
  __name2(setupPerformance, "setupPerformance");
  __name22(setupPerformance, "setupPerformance");
  module.exports = { PerformanceManager, setupPerformance };
}, "require_performance");
const performance_default = require_performance();
export {
  performance_default as default
};
