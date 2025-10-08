/**
 * 📦 Sandbox Manager
 * Gerencia isolamento de processos e configurações de sandbox
 */

const { app, utilityProcess } = require('electron');
const path = require('path');

class SandboxManager {
  constructor() {
    this.isDev = process.env.NODE_ENV === 'development';
    this.sandboxedProcesses = new Map();
    this.processPool = new Map();
    
    this.initializeSandbox();
  }

  /**
   * Inicializa configurações de sandbox
   */
  initializeSandbox() {
    this.setupProcessIsolation();
    this.setupResourceLimits();
    this.setupProcessMonitoring();
  }

  /**
   * Configura isolamento de processos
   */
  setupProcessIsolation() {
    // Configurações de isolamento por tipo de processo
    this.isolationConfig = {
      fileOperations: {
        sandbox: true,
        allowedPaths: [
          app.getPath('userData'),
          app.getPath('documents'),
          app.getPath('downloads')
        ],
        maxMemory: 128 * 1024 * 1024, // 128MB
        maxCPU: 50 // 50% CPU
      },
      steamIntegration: {
        sandbox: false, // Precisa de acesso ao sistema
        allowedPaths: [
          app.getPath('userData'),
          'C:\\Program Files (x86)\\Steam',
          'C:\\Program Files\\Steam'
        ],
        maxMemory: 256 * 1024 * 1024, // 256MB
        maxCPU: 30
      },
      gameProcessing: {
        sandbox: true,
        allowedPaths: [
          app.getPath('userData')
        ],
        maxMemory: 512 * 1024 * 1024, // 512MB
        maxCPU: 70
      },
      networkOperations: {
        sandbox: true,
        allowedDomains: [
          'api.steampowered.com',
          'steamcommunity.com',
          'github.com'
        ],
        maxMemory: 64 * 1024 * 1024, // 64MB
        maxCPU: 20
      }
    };
  }

  /**
   * Configura limites de recursos
   */
  setupResourceLimits() {
    this.resourceLimits = {
      maxProcesses: 5,
      maxMemoryPerProcess: 512 * 1024 * 1024, // 512MB
      maxCPUPerProcess: 80, // 80%
      processTimeout: 30000, // 30 segundos
      idleTimeout: 60000 // 1 minuto
    };
  }

  /**
   * Configura monitoramento de processos
   */
  setupProcessMonitoring() {
    this.processMetrics = {
      created: 0,
      destroyed: 0,
      active: 0,
      errors: 0,
      memoryUsage: 0,
      cpuUsage: 0
    };

    // Monitor de recursos a cada 5 segundos
    setInterval(() => {
      this.monitorProcessResources();
    }, 5000);
  }

  /**
   * Cria um processo sandboxed para operações específicas
   */
  async createSandboxedProcess(type, options = {}) {
    try {
      const config = this.isolationConfig[type];
      if (!config) {
        throw new Error(`Tipo de processo não suportado: ${type}`);
      }

      // Verificar limites de processos
      if (this.sandboxedProcesses.size >= this.resourceLimits.maxProcesses) {
        await this.cleanupIdleProcesses();
      }

      const processId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const processOptions = {
        serviceName: `achievements-manager-${type}`,
        modulePath: path.join(__dirname, 'workers', `${type}-worker.js`),
        allowLoadingUnsignedLibraries: false,
        options: {
          ...options,
          processId,
          config
        }
      };

      // Criar processo utilitário
      const process = utilityProcess.fork(
        processOptions.modulePath,
        [],
        {
          serviceName: processOptions.serviceName,
          allowLoadingUnsignedLibraries: processOptions.allowLoadingUnsignedLibraries,
          stdio: 'pipe'
        }
      );

      // Configurar processo
      const processInfo = {
        id: processId,
        type,
        process,
        config,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        memoryUsage: 0,
        cpuUsage: 0,
        messageCount: 0
      };

      this.sandboxedProcesses.set(processId, processInfo);
      this.processMetrics.created++;
      this.processMetrics.active++;

      // Configurar eventos do processo
      this.setupProcessEvents(processInfo);

      console.log(`📦 Processo sandboxed criado: ${processId} (${type})`);
      return processId;

    } catch (error) {
      console.error(`❌ Erro ao criar processo sandboxed: ${error.message}`);
      this.processMetrics.errors++;
      throw error;
    }
  }

  /**
   * Configura eventos de um processo
   */
  setupProcessEvents(processInfo) {
    const { process, id, type } = processInfo;

    // Evento de mensagem
    process.on('message', (message) => {
      processInfo.lastActivity = Date.now();
      processInfo.messageCount++;
      this.handleProcessMessage(id, message);
    });

    // Evento de erro
    process.on('error', (error) => {
      console.error(`❌ Erro no processo ${id}: ${error.message}`);
      this.processMetrics.errors++;
      this.destroyProcess(id);
    });

    // Evento de saída
    process.on('exit', (code) => {
      console.log(`📦 Processo ${id} finalizado com código: ${code}`);
      this.sandboxedProcesses.delete(id);
      this.processMetrics.active--;
      this.processMetrics.destroyed++;
    });

    // Configurar timeout
    setTimeout(() => {
      if (this.sandboxedProcesses.has(id)) {
        const timeSinceActivity = Date.now() - processInfo.lastActivity;
        if (timeSinceActivity > this.resourceLimits.idleTimeout) {
          console.log(`⏰ Processo ${id} inativo, finalizando...`);
          this.destroyProcess(id);
        }
      }
    }, this.resourceLimits.processTimeout);
  }

  /**
   * Manipula mensagens de processos
   */
  handleProcessMessage(processId, message) {
    const processInfo = this.sandboxedProcesses.get(processId);
    if (!processInfo) return;

    switch (message.type) {
      case 'resource-usage':
        processInfo.memoryUsage = message.data.memory;
        processInfo.cpuUsage = message.data.cpu;
        break;
      
      case 'error':
        console.error(`❌ Erro reportado pelo processo ${processId}: ${message.data}`);
        this.processMetrics.errors++;
        break;
      
      case 'ready':
        console.log(`✅ Processo ${processId} pronto`);
        break;
      
      default:
        console.log(`📦 Mensagem do processo ${processId}:`, message);
    }
  }

  /**
   * Envia mensagem para um processo específico
   */
  async sendMessageToProcess(processId, message) {
    const processInfo = this.sandboxedProcesses.get(processId);
    if (!processInfo) {
      throw new Error(`Processo não encontrado: ${processId}`);
    }

    return new Promise((resolve, reject) => {
      const messageId = Date.now().toString();
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout na mensagem para processo ${processId}`));
      }, 10000);

      const messageWithId = {
        ...message,
        id: messageId,
        timestamp: Date.now()
      };

      // Listener para resposta
      const responseListener = (response) => {
        if (response.id === messageId) {
          clearTimeout(timeoutId);
          processInfo.process.off('message', responseListener);
          resolve(response.data);
        }
      };

      processInfo.process.on('message', responseListener);
      processInfo.process.postMessage(messageWithId);
    });
  }

  /**
   * Destrói um processo específico
   */
  destroyProcess(processId) {
    const processInfo = this.sandboxedProcesses.get(processId);
    if (!processInfo) return;

    try {
      processInfo.process.kill();
      this.sandboxedProcesses.delete(processId);
      this.processMetrics.active--;
      this.processMetrics.destroyed++;
      
      console.log(`🗑️ Processo ${processId} destruído`);
    } catch (error) {
      console.error(`❌ Erro ao destruir processo ${processId}: ${error.message}`);
    }
  }

  /**
   * Limpa processos inativos
   */
  async cleanupIdleProcesses() {
    const now = Date.now();
    const processesToCleanup = [];

    for (const [id, processInfo] of this.sandboxedProcesses) {
      const timeSinceActivity = now - processInfo.lastActivity;
      if (timeSinceActivity > this.resourceLimits.idleTimeout) {
        processesToCleanup.push(id);
      }
    }

    for (const id of processesToCleanup) {
      this.destroyProcess(id);
    }

    console.log(`🧹 Limpeza concluída: ${processesToCleanup.length} processos removidos`);
  }

  /**
   * Monitora recursos dos processos
   */
  monitorProcessResources() {
    let totalMemory = 0;
    let totalCPU = 0;

    for (const [id, processInfo] of this.sandboxedProcesses) {
      totalMemory += processInfo.memoryUsage;
      totalCPU += processInfo.cpuUsage;

      // Verificar limites por processo
      if (processInfo.memoryUsage > processInfo.config.maxMemory) {
        console.warn(`⚠️ Processo ${id} excedeu limite de memória`);
        this.destroyProcess(id);
      }

      if (processInfo.cpuUsage > processInfo.config.maxCPU) {
        console.warn(`⚠️ Processo ${id} excedeu limite de CPU`);
        this.destroyProcess(id);
      }
    }

    this.processMetrics.memoryUsage = totalMemory;
    this.processMetrics.cpuUsage = totalCPU;
  }

  /**
   * Retorna estatísticas dos processos
   */
  getProcessStats() {
    return {
      ...this.processMetrics,
      activeProcesses: Array.from(this.sandboxedProcesses.values()).map(p => ({
        id: p.id,
        type: p.type,
        createdAt: p.createdAt,
        lastActivity: p.lastActivity,
        memoryUsage: p.memoryUsage,
        cpuUsage: p.cpuUsage,
        messageCount: p.messageCount
      }))
    };
  }

  /**
   * Configura sandbox para janela principal
   */
  getMainWindowSandboxConfig() {
    return {
      sandbox: false, // Mantido false para compatibilidade
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      webSecurity: true, // Sempre habilitado para segurança
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      plugins: false,
      navigateOnDragDrop: false
    };
  }

  /**
   * Finaliza todos os processos
   */
  async shutdown() {
    console.log('📦 Finalizando todos os processos sandboxed...');
    
    const processIds = Array.from(this.sandboxedProcesses.keys());
    for (const id of processIds) {
      this.destroyProcess(id);
    }

    // Aguardar finalização
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Todos os processos sandboxed finalizados');
  }
}

// Instância singleton
let sandboxManager = null;

function getSandboxManager() {
  if (!sandboxManager) {
    sandboxManager = new SandboxManager();
  }
  return sandboxManager;
}

module.exports = {
  SandboxManager,
  getSandboxManager
};