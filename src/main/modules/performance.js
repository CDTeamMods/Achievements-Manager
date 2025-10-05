const { app } = require('electron');
const os = require('os');

/**
 * Gerenciador de performance otimizado
 */
class PerformanceManager {
  constructor(store) {
    this.store = store;
    this.metrics = {
      memoryUsage: [],
      cpuUsage: [],
      renderTimes: [],
    };
    this.monitoringInterval = null;
    // IDs dos intervalos para cleanup
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
    // this.startMonitoring(); // Desabilitado - métricas removidas
  }

  /**
   * Configura otimizações do app
   */
  setupAppOptimizations() {
    const liteMode = this.store.get('liteMode', false);

    if (liteMode) {
      // Modo lite: configurações para economia de recursos
      app.commandLine.appendSwitch('--disable-gpu');
      app.commandLine.appendSwitch('--disable-software-rasterizer');
      app.commandLine.appendSwitch('--disable-background-timer-throttling');
      app.commandLine.appendSwitch('--max_old_space_size=2048'); // Menos memória
    } else {
      // Modo normal: otimizações balanceadas
      app.commandLine.appendSwitch('--enable-gpu-rasterization');
      app.commandLine.appendSwitch('--enable-zero-copy');
      app.commandLine.appendSwitch('--disable-background-timer-throttling');
      app.commandLine.appendSwitch('--disable-renderer-backgrounding');
      app.commandLine.appendSwitch('--disable-backgrounding-occluded-windows');

      // Otimizações de memória moderadas
      app.commandLine.appendSwitch('--memory-pressure-off');
      app.commandLine.appendSwitch('--max_old_space_size=3072'); // Reduzido de 4GB para 3GB
    }

    // Otimizações de rede (sempre ativas)
    app.commandLine.appendSwitch('--aggressive-cache-discard');
  }

  /**
   * Gerenciamento inteligente de memória
   */
  setupMemoryManagement() {
    // Limpeza automática de memória
    this.memoryCleanupInterval = setInterval(() => {
      if (global.gc) {
        global.gc();
      }
      this.cleanupUnusedResources();
    }, 30000); // A cada 30 segundos

    // Monitorar uso de memória
    this.memoryMonitoringInterval = setInterval(() => {
      const memUsage = process.memoryUsage();
      this.metrics.memoryUsage.push({
        timestamp: Date.now(),
        ...memUsage,
      });

      // Manter apenas os últimos 100 registros
      if (this.metrics.memoryUsage.length > 100) {
        this.metrics.memoryUsage.shift();
      }

      // Alertar se uso de memória estiver alto
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
      if (heapUsedMB > 500) {
        // 500MB
        console.warn(`⚠️ Alto uso de memória: ${heapUsedMB.toFixed(2)}MB`);
        this.forceGarbageCollection();
      }
    }, 5000); // A cada 5 segundos
  }

  /**
   * Otimizações de CPU
   */
  setupCPUOptimizations() {
    const cpuCount = os.cpus().length;
    const liteMode = this.store.get('liteMode', false);

    // Configuração conservadora baseada no modo
    let maxWorkers;
    if (liteMode) {
      // Modo lite: usar apenas 2 workers
      maxWorkers = 2;
    } else {
      // Modo normal: usar no máximo metade dos núcleos ou 4, o que for menor
      maxWorkers = Math.min(4, Math.max(2, Math.floor(cpuCount / 2)));
    }

    app.commandLine.appendSwitch('--max-workers', maxWorkers.toString());
  }

  /**
   * Força coleta de lixo
   */
  forceGarbageCollection() {
    if (global.gc) {
      global.gc();
      console.log('🧹 Garbage collection executado');
    }
  }

  /**
   * Limpa recursos não utilizados
   */
  cleanupUnusedResources() {
    // Limpar cache de imagens antigas
    const imageCache = this.store.get('cache.images', {});
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas

    Object.keys(imageCache).forEach(key => {
      if (now - imageCache[key].timestamp > maxAge) {
        delete imageCache[key];
      }
    });

    this.store.set('cache.images', imageCache);

    // Limpar logs antigos
    const logs = this.store.get('logs', []);
    if (logs.length > 1000) {
      this.store.set('logs', logs.slice(-500)); // Manter apenas os últimos 500
    }
  }

  /**
   * Inicia monitoramento de performance
   */
  startMonitoring() {
    // Limpar métricas existentes do settings.json
    this.clearStoredMetrics();

    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, 10000); // A cada 10 segundos
  }

  /**
   * Limpa métricas armazenadas no settings.json
   */
  clearStoredMetrics() {
    if (this.store.has('performance.metrics')) {
      this.store.delete('performance.metrics');
      console.log('🧹 Métricas antigas removidas do settings.json');
    }
  }

  /**
   * Coleta métricas de performance
   */
  collectMetrics() {
    const metrics = {
      timestamp: Date.now(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      uptime: process.uptime(),
      platform: process.platform,
      arch: process.arch,
    };

    // Métricas coletadas apenas para monitoramento interno
    // Não salvar no settings.json para evitar acúmulo de dados
    console.log('📊 Métricas coletadas:', {
      memory: `${Math.round(metrics.memory.heapUsed / 1024 / 1024)}MB`,
      uptime: `${Math.round(metrics.uptime)}s`,
    });
  }

  /**
   * Otimiza baseado no modo lite
   */
  applyLiteMode(enabled) {
    if (enabled) {
      // Desabilitar animações e efeitos
      app.commandLine.appendSwitch('--disable-gpu-compositing');
      app.commandLine.appendSwitch('--disable-software-rasterizer');
    }
  }

  /**
   * Configura handlers IPC para performance
   */
  setupIPC(ipcMain) {
    ipcMain.handle('performance:getMetrics', () => {
      return {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime(),
        metrics: this.metrics || {},
        memoryUsage: this.metrics.memoryUsage || [],
        cpuUsage: this.metrics.cpuUsage || [],
        isLiteMode: this.store.get('liteMode', false),
      };
    });

    ipcMain.handle('performance:forceGC', () => {
      this.forceGarbageCollection();
      return { success: true };
    });

    ipcMain.handle('performance:cleanup', () => {
      this.cleanupUnusedResources();
      return { success: true };
    });

    ipcMain.handle('performance:setLiteMode', (event, enabled) => {
      this.applyLiteMode(enabled);
      this.store.set('liteMode', enabled);
      return { success: true };
    });
  }

  /**
   * Para o monitoramento e limpa todos os recursos
   */
  stopMonitoring() {
    console.log('🧹 Limpando recursos do PerformanceManager...');

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

    console.log('✅ Recursos do PerformanceManager limpos');
  }
}

/**
 * Configura o gerenciador de performance
 */
async function setupPerformance(store) {
  const { ipcMain } = require('electron');
  const performanceManager = new PerformanceManager(store);
  performanceManager.initialize();
  performanceManager.setupIPC(ipcMain);

  return performanceManager;
}

module.exports = { PerformanceManager, setupPerformance };
