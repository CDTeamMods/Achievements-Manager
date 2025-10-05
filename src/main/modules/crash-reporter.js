// Sistema de Crash Reports - Achievements Manager

const { app, ipcMain } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { getDebugManager } = require('./debug-manager');

class CrashReporter {
  constructor() {
    this.appName = 'Achievements Manager';
    this.appDataPath = null;
    this.crashReportsPath = null;
    this.maxCrashFiles = 10; // Máximo de arquivos de crash
    this.maxFileAge = 30 * 24 * 60 * 60 * 1000; // 30 dias em milliseconds
    this.initialized = false;
    this.debug = getDebugManager();

    // Não inicializar imediatamente, aguardar o app estar pronto
  }

  initializeAppDataPath() {
    if (!this.appDataPath) {
      try {
        // Tentar obter o path do userData do Electron
        if (app && app.getPath) {
          const userDataPath = app.getPath('userData');

          if (userDataPath) {
            this.appDataPath = path.join(
              path.dirname(userDataPath),
              this.appName.replace(/\s+/g, '-')
            );
            this.crashReportsPath = path.join(this.appDataPath, 'Crash-Reports');
            return this.appDataPath;
          }
        }

        // Fallback: usar diretório temporário
        throw new Error('Electron app not ready, using fallback');
      } catch (error) {
        // Fallback para desenvolvimento ou quando o app não está pronto
        const tempDir = os.tmpdir();
        const appNameSafe = this.appName.replace(/\s+/g, '-').toLowerCase();
        this.appDataPath = path.join(tempDir, appNameSafe);
        this.crashReportsPath = path.join(this.appDataPath, 'Crash-Reports');
      }
    }
    return this.appDataPath;
  }

  async init() {
    if (this.initialized) {
      return;
    }

    try {
      // Inicializar paths
      this.getAppDataPath();

      // Criar diretórios necessários
      await this.createDirectories();

      // Configurar handlers de erro
      this.setupErrorHandlers();

      // Configurar IPC
      this.setupIPC();

      // Limpar arquivos antigos
      await this.cleanOldCrashFiles();

      this.initialized = true;
    } catch (error) {
      this.debug.error('Error initializing Crash Reporter:', error);
      // Não marcar como inicializado se houve erro
    }
  }

  async createDirectories() {
    try {
      // Garantir que os paths estão definidos
      if (!this.appDataPath || !this.crashReportsPath) {
        this.initializeAppDataPath();

        if (!this.appDataPath || !this.crashReportsPath) {
          throw new Error('Failed to initialize crash reporter paths');
        }
      }

      // Criar pasta principal na AppData
      await fs.mkdir(this.appDataPath, { recursive: true });

      // Criar pasta de crash reports
      await fs.mkdir(this.crashReportsPath, { recursive: true });

      // Criar outras pastas úteis
      const subFolders = ['logs', 'cache'];
      for (const folder of subFolders) {
        await fs.mkdir(path.join(this.appDataPath, folder), { recursive: true });
      }
    } catch (error) {
      this.debug.error('Error creating directories:', error);
      throw error;
    }
  }

  setupErrorHandlers() {
    // Handler para erros não capturados
    process.on('uncaughtException', error => {
      this.reportCrash('uncaughtException', error);
    });

    // Handler para promises rejeitadas
    process.on('unhandledRejection', (reason, promise) => {
      // Sanitizar o contexto da promise para evitar problemas de clonagem
      let promiseContext = {
        type: 'Promise',
        state: 'unknown',
        hasValue: false,
        hasReason: false,
      };

      try {
        if (promise) {
          // Tentar extrair informações úteis da promise
          promiseContext.constructor = promise.constructor?.name || 'Promise';

          // Verificar se a promise tem propriedades úteis
          if (promise.then && typeof promise.then === 'function') {
            promiseContext.hasValue = true;
            promiseContext.state = 'pending or resolved';
          }

          // Tentar obter stack trace se disponível
          if (promise.stack) {
            promiseContext.stack = promise.stack.split('\n').slice(0, 3).join('\n');
          }

          // Se a promise tem uma propriedade de erro
          if (promise.reason) {
            promiseContext.hasReason = true;
            promiseContext.reasonType = typeof promise.reason;
          }
        }
      } catch (e) {
        promiseContext = {
          type: 'Promise',
          error: 'Failed to extract promise info: ' + e.message,
        };
      }

      // Não reportar erros de clonagem IPC (são problemas internos do Electron)
      if (
        reason &&
        reason.message &&
        (reason.message.includes('could not be cloned') ||
          reason.message.includes('IpcRendererInternal.send') ||
          reason.message.includes('An object could not be cloned'))
      ) {
        this.debug.ipc('Erro de clonagem IPC ignorado (main)', reason.message);
        return;
      }

      // Também verificar no stack trace
      if (
        reason &&
        reason.stack &&
        (reason.stack.includes('IpcRendererInternal.send') ||
          reason.stack.includes('could not be cloned'))
      ) {
        this.debug.ipc('Erro de clonagem IPC ignorado (main stack)', reason.stack);
        return;
      }

      this.reportCrash('unhandledRejection', reason, { promiseInfo: promiseContext });
    });

    // Handler para avisos
    process.on('warning', warning => {
      this.reportWarning(warning);
    });
  }

  sanitizeErrorData(errorData) {
    // Função para sanitizar recursivamente objetos removendo propriedades não clonáveis
    const sanitize = (obj, depth = 0, seen = new WeakSet()) => {
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
        return obj.map(item => sanitize(item, depth + 1, seen));
      }

      // Tratar objetos
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        try {
          // Pular propriedades que podem causar problemas
          if (typeof value === 'function') {
            sanitized[key] = '[Function]';
          } else if (value instanceof Promise) {
            // Tratamento específico para promises
            sanitized[key] = {
              type: 'Promise',
              constructor: value.constructor?.name || 'Promise',
              state: 'unknown',
            };
          } else if (
            value &&
            typeof value === 'object' &&
            value.then &&
            typeof value.then === 'function'
          ) {
            // Objetos que parecem promises (thenable)
            sanitized[key] = {
              type: 'Thenable',
              constructor: value.constructor?.name || 'Unknown',
              hasValue: !!value.value,
              hasReason: !!value.reason,
            };
          } else if (value instanceof Node) {
            sanitized[key] = '[DOM Node]';
          } else if (value instanceof Window) {
            sanitized[key] = '[Window Object]';
          } else if (value instanceof HTMLElement) {
            sanitized[key] = '[HTML Element]';
          } else if (key === 'target' && value && value.tagName) {
            // Elementos DOM específicos
            sanitized[key] = `[${value.tagName} Element]`;
          } else {
            sanitized[key] = sanitize(value, depth + 1, seen);
          }
        } catch (error) {
          sanitized[key] = `[Sanitization Error: ${error.message}]`;
        }
      }

      return sanitized;
    };

    try {
      return sanitize(errorData);
    } catch (error) {
      // Fallback extremo
      return {
        error: {
          name: 'SanitizationFailure',
          message: 'Could not sanitize error data',
          stack: error.stack || 'No stack available',
        },
        context: {
          sanitizationError: error.message,
          originalDataType: typeof errorData,
        },
      };
    }
  }

  setupIPC() {
    // Handler para reportar erros do renderer
    ipcMain.handle('crash-reporter:report-error', async (event, errorData) => {
      try {
        // Sanitizar dados de entrada para evitar problemas de clonagem
        const sanitizedErrorData = this.sanitizeErrorData(errorData);
        return await this.reportCrash(
          'renderer-error',
          sanitizedErrorData.error,
          sanitizedErrorData.context
        );
      } catch (sanitizeError) {
        this.debug.error('Error sanitizing crash report data:', sanitizeError);
        // Fallback: tentar com dados básicos
        const fallbackError = {
          name: 'SanitizationError',
          message: 'Failed to sanitize error data',
          stack: sanitizeError.stack || 'No stack available',
        };
        const fallbackContext = {
          originalErrorType: typeof errorData,
          sanitizationError: sanitizeError.message,
        };
        return await this.reportCrash('renderer-error', fallbackError, fallbackContext);
      }
    });

    // Handler para obter estatísticas de crash
    ipcMain.handle('crash-reporter:get-stats', async () => {
      return await this.getCrashStats();
    });

    // Handler para limpar crash reports
    ipcMain.handle('crash-reporter:clear-reports', async () => {
      return await this.clearCrashReports();
    });

    // Handler para obter lista de crashes
    ipcMain.handle('crash-reporter:get-crash-list', async () => {
      return await this.getCrashList();
    });
  }

  async reportCrash(type, error, context = {}) {
    try {
      const timestamp = new Date().toISOString();
      const crashId = this.generateCrashId();

      const crashData = {
        id: crashId,
        timestamp,
        type,
        error: {
          name: error.name || 'Unknown Error',
          message: error.message || error.toString(),
          stack: error.stack || 'No stack trace available',
        },
        context,
        system: {
          platform: os.platform(),
          arch: os.arch(),
          nodeVersion: process.version,
          electronVersion: process.versions.electron,
          appVersion: app.getVersion(),
          totalMemory: os.totalmem(),
          freeMemory: os.freemem(),
          uptime: os.uptime(),
        },
        app: {
          uptime: process.uptime(),
          pid: process.pid,
          cwd: process.cwd(),
          argv: process.argv,
        },
      };

      const fileName = `crash_${crashId}_${timestamp.replace(/[:.]/g, '-')}.log`;
      const filePath = path.join(this.crashReportsPath, fileName);

      await fs.writeFile(filePath, JSON.stringify(crashData, null, 2), 'utf8');

      this.debug.crash(`Crash reported: ${fileName}`);
      this.debug.crash('Error details', error);

      return crashId;
    } catch (reportError) {
      this.debug.error('Error reporting crash', reportError);
      return null;
    }
  }

  async reportWarning(warning) {
    try {
      const timestamp = new Date().toISOString();
      const warningId = this.generateCrashId();

      const warningData = {
        id: warningId,
        timestamp,
        type: 'warning',
        warning: {
          name: warning.name,
          message: warning.message,
          stack: warning.stack,
        },
        system: {
          platform: os.platform(),
          nodeVersion: process.version,
          electronVersion: process.versions.electron,
        },
      };

      const fileName = `warning_${warningId}_${timestamp.replace(/[:.]/g, '-')}.log`;
      const filePath = path.join(this.crashReportsPath, fileName);

      await fs.writeFile(filePath, JSON.stringify(warningData, null, 2), 'utf8');

      this.debug.warn(`Warning reported: ${fileName}`);
    } catch (error) {
      this.debug.error('Error reporting warning:', error);
    }
  }

  generateCrashId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  async getCrashStats() {
    try {
      const files = await fs.readdir(this.crashReportsPath);
      const crashFiles = files.filter(file => file.startsWith('crash_'));
      const warningFiles = files.filter(file => file.startsWith('warning_'));

      const stats = {
        totalCrashes: crashFiles.length,
        totalWarnings: warningFiles.length,
        totalReports: files.length,
        crashReportsPath: this.crashReportsPath,
        lastCrash: null,
        crashTypes: {},
      };

      if (crashFiles.length > 0) {
        // Encontrar o último crash
        const sortedCrashes = crashFiles.sort().reverse();
        const lastCrashFile = path.join(this.crashReportsPath, sortedCrashes[0]);

        try {
          const lastCrashData = JSON.parse(await fs.readFile(lastCrashFile, 'utf8'));
          stats.lastCrash = {
            timestamp: lastCrashData.timestamp,
            type: lastCrashData.type,
            error: lastCrashData.error.name,
          };
        } catch (error) {
          this.debug.error('Error reading last crash file:', error);
        }

        // Contar tipos de crash
        for (const file of crashFiles.slice(0, 10)) {
          // Apenas os 10 mais recentes
          try {
            const filePath = path.join(this.crashReportsPath, file);
            const crashData = JSON.parse(await fs.readFile(filePath, 'utf8'));
            const type = crashData.type || 'unknown';
            stats.crashTypes[type] = (stats.crashTypes[type] || 0) + 1;
          } catch (error) {
            this.debug.error(`Error reading crash file ${file}:`, error);
          }
        }
      }

      return stats;
    } catch (error) {
      this.debug.error('Error getting crash stats:', error);
      return {
        totalCrashes: 0,
        totalWarnings: 0,
        totalReports: 0,
        crashReportsPath: this.crashReportsPath,
        lastCrash: null,
        crashTypes: {},
      };
    }
  }

  async getCrashList() {
    try {
      const files = await fs.readdir(this.crashReportsPath);
      const crashFiles = files.filter(file => file.endsWith('.log'));

      const crashes = [];
      for (const file of crashFiles.slice(0, 20)) {
        // Últimos 20
        try {
          const filePath = path.join(this.crashReportsPath, file);
          const stat = await fs.stat(filePath);
          const crashData = JSON.parse(await fs.readFile(filePath, 'utf8'));

          crashes.push({
            id: crashData.id,
            fileName: file,
            timestamp: crashData.timestamp,
            type: crashData.type,
            errorName: crashData.error?.name || crashData.warning?.name || 'Unknown',
            errorMessage: crashData.error?.message || crashData.warning?.message || 'No message',
            size: stat.size,
          });
        } catch (error) {
          this.debug.error(`Error reading crash file ${file}:`, error);
        }
      }

      return crashes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      this.debug.error('Error getting crash list:', error);
      return [];
    }
  }

  async clearCrashReports() {
    try {
      const files = await fs.readdir(this.crashReportsPath);

      for (const file of files) {
        if (file.endsWith('.log')) {
          await fs.unlink(path.join(this.crashReportsPath, file));
        }
      }

      return true;
    } catch (error) {
      this.debug.error('Error clearing crash reports:', error);
      return false;
    }
  }

  async cleanOldCrashFiles() {
    try {
      const files = await fs.readdir(this.crashReportsPath);
      const now = Date.now();
      let deletedCount = 0;

      for (const file of files) {
        if (!file.endsWith('.log')) continue;

        const filePath = path.join(this.crashReportsPath, file);
        const stat = await fs.stat(filePath);

        // Deletar arquivos mais antigos que maxFileAge
        if (now - stat.mtime.getTime() > this.maxFileAge) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }

      // Se ainda há muitos arquivos, deletar os mais antigos
      const remainingFiles = await fs.readdir(this.crashReportsPath);
      const logFiles = remainingFiles.filter(f => f.endsWith('.log'));

      if (logFiles.length > this.maxCrashFiles) {
        const filesWithStats = await Promise.all(
          logFiles.map(async file => {
            const filePath = path.join(this.crashReportsPath, file);
            const stat = await fs.stat(filePath);
            return { file, mtime: stat.mtime };
          })
        );

        filesWithStats.sort((a, b) => a.mtime - b.mtime);
        const filesToDelete = filesWithStats.slice(0, logFiles.length - this.maxCrashFiles);

        for (const { file } of filesToDelete) {
          await fs.unlink(path.join(this.crashReportsPath, file));
          deletedCount++;
        }
      }
    } catch (error) {
      this.debug.error('Error cleaning old crash files:', error);
    }
  }

  getAppDataPath() {
    return this.appDataPath;
  }

  getCrashReportsPath() {
    return this.crashReportsPath;
  }
}

// Instância global
let crashReporter = null;

async function setupCrashReporter() {
  if (!crashReporter) {
    crashReporter = new CrashReporter();
    // Definir globalmente para acesso em outros módulos
    global.crashReporter = crashReporter;

    // Aguardar o app estar pronto antes de inicializar
    if (app.isReady()) {
      await crashReporter.init();
    } else {
      app.whenReady().then(() => crashReporter.init());
    }
  }
  return crashReporter;
}

// Função para reportar erro do renderer
function reportRendererError(error, context = {}) {
  if (crashReporter) {
    return crashReporter.reportCrash('renderer-error', error, context);
  }
  return null;
}

module.exports = { CrashReporter, setupCrashReporter, reportRendererError };
