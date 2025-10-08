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
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name22222 = /* @__PURE__ */ __name2222(
  (target, value) => __defProp22222(target, "name", { value, configurable: true }),
  "__name"
);
var __commonJS = /* @__PURE__ */ __name2222(
  (cb, mod) => /* @__PURE__ */ __name2222(
    /* @__PURE__ */ __name222(
      /* @__PURE__ */ __name22(
        /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function __require() {
          return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
        }, "__require"), "__require"),
        "__require"
      ),
      "__require"
    ),
    "__require"
  ),
  "__commonJS"
);
var require_sandbox_manager = __commonJS({
  "src/main/modules/sandbox-manager.js"(exports, module) {
    const { app, utilityProcess } = require("electron");
    const path = require("node:path");
    class SandboxManager {
      static {
        __name(this, "SandboxManager");
      }
      static {
        __name2(this, "SandboxManager");
      }
      static {
        __name22(this, "SandboxManager");
      }
      static {
        __name222(this, "SandboxManager");
      }
      static {
        __name2222(this, "SandboxManager");
      }
      static {
        __name22222(this, "SandboxManager");
      }
      constructor() {
        this.isDev = process.env.NODE_ENV === "development";
        this.sandboxedProcesses = /* @__PURE__ */ new Map();
        this.processPool = /* @__PURE__ */ new Map();
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
        this.isolationConfig = {
          fileOperations: {
            sandbox: true,
            allowedPaths: [
              app.getPath("userData"),
              app.getPath("documents"),
              app.getPath("downloads")
            ],
            maxMemory: 128 * 1024 * 1024,
            // 128MB
            maxCPU: 50
            // 50% CPU
          },
          steamIntegration: {
            sandbox: false,
            // Precisa de acesso ao sistema
            allowedPaths: [
              app.getPath("userData"),
              "C:\\Program Files (x86)\\Steam",
              "C:\\Program Files\\Steam"
            ],
            maxMemory: 256 * 1024 * 1024,
            // 256MB
            maxCPU: 30
          },
          gameProcessing: {
            sandbox: true,
            allowedPaths: [app.getPath("userData")],
            maxMemory: 512 * 1024 * 1024,
            // 512MB
            maxCPU: 70
          },
          networkOperations: {
            sandbox: true,
            allowedDomains: ["api.steampowered.com", "steamcommunity.com", "github.com"],
            maxMemory: 64 * 1024 * 1024,
            // 64MB
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
          maxMemoryPerProcess: 512 * 1024 * 1024,
          // 512MB
          maxCPUPerProcess: 80,
          // 80%
          processTimeout: 3e4,
          // 30 segundos
          idleTimeout: 6e4
          // 1 minuto
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
        setInterval(() => {
          this.monitorProcessResources();
        }, 5e3);
      }
      /**
       * Cria um processo sandboxed para operações específicas
       */
      async createSandboxedProcess(type, options = {}) {
        try {
          const config = this.isolationConfig[type];
          if (!config) {
            throw new Error(`Tipo de processo n\xE3o suportado: ${type}`);
          }
          if (this.sandboxedProcesses.size >= this.resourceLimits.maxProcesses) {
            await this.cleanupIdleProcesses();
          }
          const processId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const processOptions = {
            serviceName: `achievements-manager-${type}`,
            modulePath: path.join(__dirname, "workers", `${type}-worker.js`),
            allowLoadingUnsignedLibraries: false,
            options: {
              ...options,
              processId,
              config
            }
          };
          const process2 = utilityProcess.fork(processOptions.modulePath, [], {
            serviceName: processOptions.serviceName,
            allowLoadingUnsignedLibraries: processOptions.allowLoadingUnsignedLibraries,
            stdio: "pipe"
          });
          const processInfo = {
            id: processId,
            type,
            process: process2,
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
          this.setupProcessEvents(processInfo);
          return processId;
        } catch (error) {
          this.processMetrics.errors++;
          throw error;
        }
      }
      /**
       * Configura eventos de um processo
       */
      setupProcessEvents(processInfo) {
        const { process: process2, id } = processInfo;
        process2.on("message", (message) => {
          processInfo.lastActivity = Date.now();
          processInfo.messageCount++;
          this.handleProcessMessage(id, message);
        });
        process2.on("error", () => {
          this.processMetrics.errors++;
          this.destroyProcess(id);
        });
        process2.on("exit", () => {
          this.sandboxedProcesses.delete(id);
          this.processMetrics.active--;
          this.processMetrics.destroyed++;
        });
        setTimeout(() => {
          if (this.sandboxedProcesses.has(id)) {
            const timeSinceActivity = Date.now() - processInfo.lastActivity;
            if (timeSinceActivity > this.resourceLimits.idleTimeout) {
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
          case "resource-usage":
            processInfo.memoryUsage = message.data.memory;
            processInfo.cpuUsage = message.data.cpu;
            break;
          case "error":
            this.processMetrics.errors++;
            break;
        }
      }
      /**
       * Envia mensagem para um processo específico
       */
      async sendMessageToProcess(processId, message) {
        const processInfo = this.sandboxedProcesses.get(processId);
        if (!processInfo) {
          throw new Error(`Processo n\xE3o encontrado: ${processId}`);
        }
        return new Promise((resolve, reject) => {
          const messageId = Date.now().toString();
          const timeoutId = setTimeout(() => {
            reject(new Error(`Timeout na mensagem para processo ${processId}`));
          }, 1e4);
          const messageWithId = {
            ...message,
            id: messageId,
            timestamp: Date.now()
          };
          const responseListener = /* @__PURE__ */ __name22222((response) => {
            if (response.id === messageId) {
              clearTimeout(timeoutId);
              processInfo.process.off("message", responseListener);
              resolve(response.data);
            }
          }, "responseListener");
          processInfo.process.on("message", responseListener);
          processInfo.process.postMessage(messageWithId);
        });
      }
      /**
       * Destrói um processo específico
       */
      destroyProcess(processId) {
        const processInfo = this.sandboxedProcesses.get(processId);
        if (!processInfo) return;
        processInfo.process.kill();
        this.sandboxedProcesses.delete(processId);
        this.processMetrics.active--;
        this.processMetrics.destroyed++;
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
          if (processInfo.memoryUsage > processInfo.config.maxMemory) {
            this.destroyProcess(id);
          }
          if (processInfo.cpuUsage > processInfo.config.maxCPU) {
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
          activeProcesses: Array.from(this.sandboxedProcesses.values()).map((p) => ({
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
          sandbox: false,
          // Mantido false para compatibilidade
          contextIsolation: true,
          nodeIntegration: false,
          enableRemoteModule: false,
          webSecurity: true,
          // Sempre habilitado para segurança
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
        const processIds = Array.from(this.sandboxedProcesses.keys());
        for (const id of processIds) {
          this.destroyProcess(id);
        }
        await new Promise((resolve) => setTimeout(resolve, 1e3));
      }
    }
    let sandboxManager = null;
    function getSandboxManager() {
      if (!sandboxManager) {
        sandboxManager = new SandboxManager();
      }
      return sandboxManager;
    }
    __name(getSandboxManager, "getSandboxManager");
    __name2(getSandboxManager, "getSandboxManager");
    __name22(getSandboxManager, "getSandboxManager");
    __name222(getSandboxManager, "getSandboxManager");
    __name2222(getSandboxManager, "getSandboxManager");
    __name22222(getSandboxManager, "getSandboxManager");
    module.exports = {
      SandboxManager,
      getSandboxManager
    };
  }
});
var sandbox_manager_default = require_sandbox_manager();
export {
  sandbox_manager_default as default
};
