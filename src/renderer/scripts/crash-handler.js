// Crash Handler para Renderer Process - Achievements Manager

/**
 * Sistema de relatório de crashes para o renderer process
 * Captura erros não tratados e os envia para o main process
 */

// Sistema de relatório de crashes para o renderer process
// Interceptador removido para evitar loops infinitos

class CrashHandler {
  constructor() {
    this.isReporting = false; // Proteção contra loops

    // Inicializar debug manager se disponível
    if (typeof getDebugManager === 'function') {
      this.debug = getDebugManager();
    } else {
      // Fallback se debug manager não estiver carregado
      this.debug = {
        ipc: () => {},
        crash: () => {},
        error: () => {},
        info: () => {},
        warn: () => {},
        sanitize: () => {},
      };
    }

    this.setupErrorHandlers();
    this.setupConsoleOverrides();
  }

  setupErrorHandlers() {
    // Handler para erros JavaScript não capturados
    window.addEventListener('error', event => {
      this.reportError({
        type: 'javascript-error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
      });
    });

    // Handler para promises rejeitadas não tratadas
    window.addEventListener('unhandledrejection', event => {
      this.reportError({
        type: 'unhandled-promise-rejection',
        message: event.reason?.message || event.reason?.toString() || 'Unknown rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        context: {
          // Não incluir a promise diretamente para evitar problemas de clonagem
          promiseInfo: {
            type: 'Promise',
            state: 'rejected',
            hasValue: false,
            hasReason: true,
            constructor: event.promise?.constructor?.name || 'Promise',
          },
        },
      });
    });

    // Handler para erros de recursos (imagens, scripts, etc.)
    window.addEventListener(
      'error',
      event => {
        if (event.target !== window) {
          this.reportError({
            type: 'resource-error',
            message: `Failed to load resource: ${event.target.src || event.target.href}`,
            element: event.target.tagName,
            timestamp: new Date().toISOString(),
          });
        }
      },
      true
    );
  }

  setupConsoleOverrides() {
    // Interceptar console.error para reportar erros
    const originalError = console.error;
    console.error = (...args) => {
      originalError.apply(console, args);

      // Evitar interceptar logs do próprio crash handler para prevenir loops
      const errorMessage = args.join(' ');
      if (
        errorMessage.includes('🚨 ERRO DE CLONAGEM DETECTADO') ||
        errorMessage.includes('Stack trace completo:') ||
        errorMessage.includes('Dados do erro:') ||
        errorMessage.includes('Timestamp:') ||
        errorMessage.includes('INTERCEPTADO - Erro de clonagem detectado') ||
        errorMessage.includes('could not be cloned') ||
        errorMessage.includes('IpcRendererInternal.send')
      ) {
        return; // Não reportar logs do próprio crash handler ou erros de clonagem IPC
      }

      // Reportar apenas se parecer um erro real
      if (args.length > 0 && (args[0] instanceof Error || typeof args[0] === 'string')) {
        this.reportError({
          type: 'console-error',
          message: args
            .map(arg =>
              arg instanceof Error
                ? arg.message
                : typeof arg === 'object'
                  ? JSON.stringify(arg)
                  : String(arg)
            )
            .join(' '),
          stack: args[0] instanceof Error ? args[0].stack : undefined,
          timestamp: new Date().toISOString(),
          context: { consoleArgs: args.length },
        });
      }
    };
  }

  async reportError(errorData) {
    // Evitar loops infinitos
    if (this.isReporting) {
      return null;
    }

    // Não reportar erros de clonagem IPC (são problemas internos do Electron)
    if (
      errorData.message &&
      (errorData.message.includes('could not be cloned') ||
        errorData.message.includes('IpcRendererInternal.send') ||
        errorData.message.includes('An object could not be cloned'))
    ) {
      this.debug.ipc('Erro de clonagem IPC ignorado (renderer)', errorData.message);
      return null;
    }

    // Também verificar no stack trace
    if (
      errorData.stack &&
      (errorData.stack.includes('IpcRendererInternal.send') ||
        errorData.stack.includes('could not be cloned'))
    ) {
      this.debug.ipc('Erro de clonagem IPC ignorado (renderer stack)', errorData.stack);
      return null;
    }

    this.isReporting = true;

    try {
      // Adicionar informações do contexto
      const contextInfo = {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        memory: performance.memory
          ? {
              usedJSHeapSize: performance.memory.usedJSHeapSize,
              totalJSHeapSize: performance.memory.totalJSHeapSize,
              jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            }
          : null,
        connection: navigator.connection
          ? {
              effectiveType: navigator.connection.effectiveType,
              downlink: navigator.connection.downlink,
              rtt: navigator.connection.rtt,
            }
          : null,
      };

      const fullErrorData = {
        error: errorData,
        context: {
          ...contextInfo,
          ...errorData.context,
        },
      };

      // Enviar para o processo principal
      if (window.electronAPI && window.electronAPI.crashReporter) {
        // Sanitizar dados de erro antes de enviar via IPC
        let sanitizedErrorData;

        if (window.IPCSanitizer) {
          sanitizedErrorData = window.IPCSanitizer.sanitize(fullErrorData);
        } else {
          // Fallback manual para sanitização sem IPCSanitizer
          sanitizedErrorData = this.manualSanitize(fullErrorData);
        }

        const crashId = await window.electronAPI.crashReporter.reportError(sanitizedErrorData);
        this.debug.crash(`Error reported with ID: ${crashId}`);
        return crashId;
      } else {
        this.debug.warn('Crash reporter not available, logging error locally:', fullErrorData);
        return null;
      }
    } catch (reportError) {
      this.debug.error('Failed to report error:', reportError);
      return null;
    } finally {
      this.isReporting = false; // Reset da flag
    }
  }

  // Método para sanitizar dados manualmente quando IPCSanitizer não está disponível
  manualSanitize(obj, depth = 0, seen = new WeakSet()) {
    // Evitar recursão infinita
    if (depth > 10) return '[Max Depth Reached]';

    // Verificar referências circulares
    if (obj && typeof obj === 'object' && seen.has(obj)) {
      return '[Circular Reference]';
    }

    // Tipos primitivos são seguros
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // Adicionar à lista de objetos vistos
    seen.add(obj);

    // Tratar arrays
    if (Array.isArray(obj)) {
      return obj.map(item => this.manualSanitize(item, depth + 1, seen));
    }

    // Tratar objetos
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      try {
        // Pular propriedades que podem causar problemas
        if (value instanceof Promise || (value && typeof value.then === 'function')) {
          sanitized[key] = {
            type: 'Promise',
            state: value.constructor ? value.constructor.name : 'Promise',
            hasValue: false,
            hasReason: false,
            constructor: value.constructor ? value.constructor.name : 'Promise',
          };
        } else if (typeof value === 'function') {
          sanitized[key] = '[Function]';
        } else if (value instanceof Node) {
          sanitized[key] = '[DOM Node]';
        } else if (value instanceof Window) {
          sanitized[key] = '[Window Object]';
        } else if (value instanceof HTMLElement) {
          sanitized[key] = '[HTML Element]';
        } else if (key === 'target' && value && value.tagName) {
          // Elementos DOM específicos
          sanitized[key] = `[${value.tagName} Element]`;
        } else if (
          value &&
          typeof value === 'object' &&
          value.constructor &&
          value.constructor.name !== 'Object'
        ) {
          // Instâncias de classes específicas
          sanitized[key] = `[${value.constructor.name} Instance]`;
        } else {
          sanitized[key] = this.manualSanitize(value, depth + 1, seen);
        }
      } catch (error) {
        sanitized[key] = `[Sanitization Error: ${error.message}]`;
      }
    }

    return sanitized;
  }

  // Método público para reportar erros manualmente
  static reportManualError(error, context = {}) {
    if (window.crashHandler) {
      return window.crashHandler.reportError({
        type: 'manual-error',
        message: error.message || error.toString(),
        stack: error.stack,
        timestamp: new Date().toISOString(),
        context,
      });
    }
    return null;
  }

  // Método para testar o sistema de crash reports
  static testCrashReporter() {

    // Teste 1: Erro manual
    CrashHandler.reportManualError(new Error('Test error from crash handler'), {
      testType: 'manual-test',
      description: 'This is a test error to verify crash reporting functionality',
    });

    // Teste 2: Console error
    // console.error('Test console error for crash reporting'); // Removido para evitar dependência circular com DebugManager

    // Teste 3: Promise rejection (comentado para não quebrar a aplicação)
    // Promise.reject(new Error('Test promise rejection'));

  }

  // Método para obter estatísticas de crash
  static async getCrashStats() {
    try {
      if (window.electronAPI && window.electronAPI.crashReporter) {
        return await window.electronAPI.crashReporter.getStats();
      }
      return null;
    } catch (error) {
      // Usar IPC para reportar erro via DebugManager
      try {
        await window.electronAPI.debug.error('Failed to get crash stats:', error);
      } catch (ipcError) {
        // Fallback para console se IPC falhar
        // console.error('Failed to get crash stats:', error); // Removido para evitar dependência circular com DebugManager
      }
      return null;
    }
  }

  // Método para limpar crash reports
  static async clearCrashReports() {
    try {
      if (window.electronAPI && window.electronAPI.crashReporter) {
        return await window.electronAPI.crashReporter.clearReports();
      }
      return false;
    } catch (error) {
      // Usar IPC para reportar erro via DebugManager
      try {
        await window.electronAPI.debug.error('Failed to clear crash reports:', error);
      } catch (ipcError) {
        // Fallback para console se IPC falhar
        // console.error('Failed to clear crash reports:', error); // Removido para evitar dependência circular com DebugManager
      }
      return false;
    }
  }

  // Método para obter lista de crashes
  static async getCrashList() {
    try {
      if (window.electronAPI && window.electronAPI.crashReporter) {
        return await window.electronAPI.crashReporter.getCrashList();
      }
      return [];
    } catch (error) {
      // Usar IPC para reportar erro via DebugManager
      try {
        await window.electronAPI.debug.error('Failed to get crash list:', error);
      } catch (ipcError) {
        // Fallback para console se IPC falhar
        // console.error('Failed to get crash list:', error); // Removido para evitar dependência circular com DebugManager
      }
      return [];
    }
  }
}

// Inicializar o crash handler quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.crashHandler = new CrashHandler();

});

// Exportar a classe
export { CrashHandler };

// Exportar para uso global para compatibilidade
window.CrashHandler = CrashHandler;
