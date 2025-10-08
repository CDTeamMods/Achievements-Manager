const { contextBridge, ipcRenderer } = require('electron');

// Log imediato para verificar se o preload está sendo executado
console.log('🔧 [PRELOAD] Preload script iniciado!');
console.log('🔧 [PRELOAD] contextBridge disponível:', typeof contextBridge);
console.log('🔧 [PRELOAD] ipcRenderer disponível:', typeof ipcRenderer);

// Função para logs de debug detalhados (só funciona quando DEBUG_TOOLS = true)
function debugLog(operation, channel, args = null, result = null, error = null) {
  // Só executar se DEBUG_TOOLS estiver habilitado
  try {
    if (
      process.env.DEBUG_TOOLS !== 'true' &&
      (typeof localStorage === 'undefined' || localStorage.getItem('DEBUG_TOOLS') !== 'true') &&
      (typeof window === 'undefined' || window.DEBUG_TOOLS !== true)
    ) {
      return; // Não fazer nada se debug não estiver habilitado
    }
  } catch (e) {
    return; // Se houver erro na verificação, não fazer debug
  }

  const timestamp = new Date().toISOString();
  // Usar ipcRenderer para enviar logs para o main process onde o DebugManager está disponível
  try {
    ipcRenderer.invoke('debug:log', `[DEBUG ${timestamp}] ${operation} - Channel: ${channel}`);

    if (args !== null) {
      ipcRenderer.invoke('debug:log', `[DEBUG ARGS] Tipo: ${typeof args}, Valor:`, args);
    }

    if (result !== null) {
      ipcRenderer.invoke('debug:log', `[DEBUG RESULT] Tipo: ${typeof result}, Valor:`, result);
    }

    if (error) {
      ipcRenderer.invoke('debug:error', `[DEBUG ERROR] ${error.message}`, error);
    }
  } catch (e) {
    // Fallback para console se IPC falhar
    console.log(`[DEBUG ${timestamp}] ${operation} - Channel: ${channel}`);
    if (args !== null) console.log(`[DEBUG ARGS] Tipo: ${typeof args}, Valor:`, args);
    if (result !== null) console.log(`[DEBUG RESULT] Tipo: ${typeof result}, Valor:`, result);
    if (error) console.error(`[DEBUG ERROR] ${error.message}`, error);
  }
}

// Função para analisar profundamente objetos problemáticos
function analyzeObject(obj, path = 'root') {
  const analysis = {
    path,
    type: typeof obj,
    constructor: obj?.constructor?.name || 'unknown',
    isCloneable: false,
    issues: [],
  };

  try {
    structuredClone(obj);
    analysis.isCloneable = true;
  } catch (error) {
    analysis.issues.push(`structuredClone failed: ${error.message}`);
  }

  if (typeof obj === 'object' && obj !== null) {
    // Verificar propriedades específicas que podem causar problemas
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'function') {
        analysis.issues.push(`Function property: ${key}`);
      } else if (value instanceof Node) {
        analysis.issues.push(`DOM Node property: ${key}`);
      } else if (value instanceof Window) {
        analysis.issues.push(`Window object property: ${key}`);
      } else if (
        value &&
        typeof value === 'object' &&
        value.constructor &&
        ['HTMLElement', 'EventTarget', 'Navigator', 'Location'].includes(value.constructor.name)
      ) {
        analysis.issues.push(`Browser API object property: ${key} (${value.constructor.name})`);
      }
    }
  }

  return analysis;
}

// Função para sanitizar argumentos antes do envio IPC
function sanitizeArgs(args) {
  if (!Array.isArray(args)) return args;

  return args.map((arg, index) => {
    const argPath = `args[${index}]`;

    if (arg === null || arg === undefined) {
      return arg;
    }

    // Primitivos são seguros
    if (typeof arg !== 'object') {
      return arg;
    }

    // Verificar se é um array
    if (Array.isArray(arg)) {
      try {
        return arg.map(item => {
          if (typeof item === 'object' && item !== null) {
            try {
              return structuredClone(item);
            } catch {
              return { __sanitized: true, __type: typeof item };
            }
          }
          return item;
        });
      } catch {
        return [];
      }
    }

    // Analisar o objeto
    const analysis = analyzeObject(arg, argPath);

    // Se é clonável, manter original
    if (analysis.isCloneable) {
      return arg;
    }

    // Tentar serializar via JSON com tratamento mais robusto
    try {
      const serialized = JSON.parse(
        JSON.stringify(arg, (key, value) => {
          // Filtrar propriedades problemáticas
          if (typeof value === 'function') return undefined;
          if (value instanceof Node) return undefined;
          if (value instanceof Window) return undefined;
          if (value instanceof HTMLElement) return undefined;
          if (value instanceof EventTarget) return undefined;

          // Verificar se é um objeto circular
          try {
            JSON.stringify(value);
            return value;
          } catch {
            return undefined;
          }
        })
      );

      // Verificar se o objeto serializado é clonável
      try {
        structuredClone(serialized);
        return serialized;
      } catch {
        // Se ainda não for clonável, criar versão simplificada
        return {
          __sanitized: true,
          __type: analysis.type,
          __constructor: analysis.constructor,
          __keys: Object.keys(arg).slice(0, 10), // Limitar a 10 chaves
        };
      }
    } catch (jsonError) {
      // Se falhar completamente, retornar representação mínima segura
      return {
        __sanitized: true,
        __type: analysis.type,
        __constructor: analysis.constructor,
        __error: 'Object could not be serialized',
        __message: jsonError.message,
      };
    }
  });
}

// Verificar se DEBUG_TOOLS está habilitado
function isDebugToolsEnabled() {
  try {
    // Verificar process.env primeiro
    if (process.env.DEBUG_TOOLS === 'true') return true;
    if (process.env.DEBUG_TOOLS === 'false') return false;

    // Verificar localStorage se disponível
    if (typeof localStorage !== 'undefined') {
      const localStorageDebug = localStorage.getItem('DEBUG_TOOLS');
      if (localStorageDebug === 'true') return true;
      if (localStorageDebug === 'false') return false;
    }

    // Verificar variável global
    if (typeof window !== 'undefined' && window.DEBUG_TOOLS === true) return true;

    return false;
  } catch (error) {
    return false;
  }
}

// Wrapper para ipcRenderer.invoke - versão simplificada para produção
function simpleInvoke(channel, ...args) {
  return ipcRenderer.invoke(channel, ...args).catch(error => {
    // Ignorar erros de clonagem silenciosamente em produção
    if (
      error.message &&
      (error.message.includes('could not be cloned') ||
        error.message.includes('IpcRendererInternal.send') ||
        error.message.includes('An object could not be cloned'))
    ) {
      return null;
    }
    throw error;
  });
}

// Wrapper para ipcRenderer.invoke com sanitização completa (só para DEBUG_TOOLS = true)
function debugInvoke(channel, ...args) {
  // Se DEBUG_TOOLS não estiver habilitado, usar versão simplificada
  if (!isDebugToolsEnabled()) {
    return simpleInvoke(channel, ...args);
  }

  // Versão completa com debug e sanitização
  return new Promise(async (resolve, reject) => {
    try {
      // Sanitizar argumentos antes do envio
      const sanitizedArgs = sanitizeArgs(args);

      // Verificar se os argumentos sanitizados são realmente clonáveis
      try {
        sanitizedArgs.forEach((arg, index) => {
          structuredClone(arg);
        });
      } catch (cloneTestError) {
        // Se falhar na clonagem, tentar uma sanitização mais agressiva
        try {
          ipcRenderer.invoke(
            'debug:warn',
            `⚠️ Argumento ${index} falhou no teste de clonagem, aplicando sanitização agressiva`
          );
        } catch (e) {
          console.warn(
            `⚠️ Argumento ${index} falhou no teste de clonagem, aplicando sanitização agressiva`
          );
        }
        const fallbackArgs = args.map(arg => {
          if (arg === null || arg === undefined || typeof arg !== 'object') {
            return arg;
          }
          try {
            return structuredClone(arg);
          } catch {
            return { __sanitized: true, __type: typeof arg };
          }
        });

        try {
          const result = await ipcRenderer.invoke(channel, ...fallbackArgs);
          resolve(result);
          return;
        } catch (fallbackError) {
          reject(
            new Error(`IPC call failed even with fallback sanitization: ${fallbackError.message}`)
          );
          return;
        }
      }

      // Tentar a chamada IPC normal
      try {
        const result = await ipcRenderer.invoke(channel, ...sanitizedArgs);
        resolve(result);
      } catch (ipcError) {
        // Se o erro for relacionado à clonagem, não propagar
        if (
          ipcError.message &&
          (ipcError.message.includes('could not be cloned') ||
            ipcError.message.includes('IpcRendererInternal.send') ||
            ipcError.message.includes('An object could not be cloned'))
        ) {
          try {
            ipcRenderer.invoke(
              'debug:warn',
              `⚠️ Erro de clonagem IPC ignorado para canal ${channel}:`,
              ipcError.message
            );
          } catch (e) {
            console.warn(
              `⚠️ Erro de clonagem IPC ignorado para canal ${channel}:`,
              ipcError.message
            );
          }
          resolve(null); // Retornar null em vez de rejeitar
        } else {
          reject(ipcError);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}

// IPC com logs de debug detalhados

// API segura para o renderer
const electronAPI = {
  // Configurações
  config: {
    get: key => debugInvoke('config:get', key),
    set: (key, value) => debugInvoke('config:set', key, value),
    getAll: () => debugInvoke('config:getAll'),
    reset: () => debugInvoke('config:reset'),
  },

  // Jogos
  games: {
    getAll: () => debugInvoke('games:getAll'),
    getById: id => debugInvoke('games:getById', id),
    add: game => debugInvoke('games:add', game),
    update: (id, data) => debugInvoke('games:update', id, data),
    delete: id => debugInvoke('games:delete', id),
    scan: () => debugInvoke('games:scan'),
    import: filePath => debugInvoke('games:import', filePath),
    export: (filePath, gameIds) => debugInvoke('games:export', filePath, gameIds),
  },

  // Conquistas
  achievements: {
    getAll: () => debugInvoke('achievements:getAll'),
    getByGameId: gameId => debugInvoke('achievements:getByGameId', gameId),
    getById: id => debugInvoke('achievements:getById', id),
    add: achievement => debugInvoke('achievements:add', achievement),
    update: (id, data) => debugInvoke('achievements:update', id, data),
    delete: id => debugInvoke('achievements:delete', id),
    unlock: id => debugInvoke('achievements:unlock', id),
    lock: id => debugInvoke('achievements:lock', id),
    getStats: () => debugInvoke('achievements:getStats'),
    sync: gameId => debugInvoke('achievements:sync', gameId),
  },

  // API de jogos (Steam e GSE Saves)
  api: {
    steam: {
      authenticate: () => debugInvoke('api:steam:authenticate'),
      getGames: () => debugInvoke('api:steam:getGames'),
      getUserGames: (options = {}) => debugInvoke('steam.getUserGames', options),
      getAchievements: appId => debugInvoke('api:steam:getAchievements', appId),
      getUserStats: appId => debugInvoke('api:steam:getUserStats', appId),
      setCredentials: (apiKey, steamId = null) =>
        debugInvoke('steam.setCredentials', apiKey, steamId),

      // Métodos de cache
      clearCache: (type = null) => debugInvoke('steam.clearCache', type),
      getCacheStats: () => debugInvoke('steam.getCacheStats'),
    },

    // GSE Saves API
    gseSaves: {
      // Métodos de verificação e detecção
      detectPaths: () => debugInvoke('gse:detectPaths'),
      getCurrentUser: () => debugInvoke('gse:getCurrentUser'),
      getStatus: () => debugInvoke('gse:getStatus'),

      // Métodos de dados
      getGames: () => debugInvoke('gse:getGames'),
      getAchievements: gameId => debugInvoke('gse:getAchievements', gameId),

      // Métodos legados (mantidos para compatibilidade)
      syncAchievements: gameId => debugInvoke('api:gseSaves:syncAchievements', gameId),
    },
    request: options => debugInvoke('api:request', options),
    clearCache: () => debugInvoke('api:clearCache'),
    getCacheStats: () => debugInvoke('api:getCacheStats'),
  },

  // Sistema de arquivos
  fs: {
    selectFile: options => debugInvoke('fs:selectFile', options),
    selectDirectory: options => debugInvoke('fs:selectDirectory', options),
    saveFile: options => debugInvoke('fs:saveFile', options),
    readFile: filePath => debugInvoke('fs:readFile', filePath),
    writeFile: (filePath, data) => debugInvoke('fs:writeFile', filePath, data),
    exists: path => debugInvoke('fs:exists', path),
    createBackup: name => debugInvoke('fs:createBackup', name),
    restoreBackup: backupId => debugInvoke('fs:restoreBackup', backupId),
    listBackups: () => debugInvoke('fs:listBackups'),
    deleteBackup: backupId => debugInvoke('fs:deleteBackup', backupId),
    saveSettings: settings => debugInvoke('fs:saveSettings', settings),
    loadSettings: () => debugInvoke('fs:loadSettings'),
  },

  // Configurações (alias para compatibilidade)
  saveSettings: settings => debugInvoke('fs:saveSettings', settings),

  // Tema
  theme: {
    getSystemTheme: () => debugInvoke('theme:getSystemTheme'),
    setTheme: theme => debugInvoke('set-theme', theme),
    getTheme: () => debugInvoke('get-theme'),
  },

  // Internacionalização
  i18n: {
    getLanguage: () => debugInvoke('i18n:getLanguage'),
    getCurrentLanguage: () => debugInvoke('i18n:getCurrentLanguage'),
    setLanguage: lang => debugInvoke('i18n:setLanguage', lang),
    getTranslations: lang => debugInvoke('i18n:getTranslations', lang),
    getAvailableLanguages: () => debugInvoke('i18n:getAvailableLanguages'),
    translate: (key, params) => debugInvoke('i18n:translate', key, params),
  },

  // Goldberg Migration
  goldberg: {
    checkFolder: () => debugInvoke('goldberg:checkFolder'),
    getGames: () => debugInvoke('goldberg:getGames'),
    migrateGame: gameData => debugInvoke('goldberg:migrateGame', gameData),
    getSettings: () => debugInvoke('goldberg:getSettings'),
    setSetting: (key, value) => debugInvoke('goldberg:setSetting', key, value),
    getLastCheck: () => debugInvoke('goldberg:getLastCheck'),
    checkMigration: () => debugInvoke('goldberg:checkMigration'),
  },

  // APIs simplificadas para compatibilidade
  getGoldbergSettings: () => debugInvoke('goldberg:getSettings'),
  setGoldbergSetting: (key, value) => debugInvoke('goldberg:setSetting', key, value),
  getGoldbergLastCheck: () => debugInvoke('goldberg:getLastCheck'),
  checkGoldbergMigration: () => debugInvoke('goldberg:checkMigration'),

  // Performance
  performance: {
    getMetrics: () => debugInvoke('performance:getMetrics'),
    clearCache: () => debugInvoke('performance:clearCache'),
    optimizeMemory: () => debugInvoke('performance:optimizeMemory'),
    getSystemResources: () => debugInvoke('performance:getSystemResources'),
  },

  // Crash Reporter
  crashReporter: {
    reportError: errorData => debugInvoke('crash-reporter:report-error', errorData),
    getStats: () => debugInvoke('crash-reporter:get-stats'),
    clearReports: () => debugInvoke('crash-reporter:clear-reports'),
    getCrashList: () => debugInvoke('crash-reporter:get-crash-list'),
  },

  // API Steam direta
  steam: {
    authenticate: () => debugInvoke('api:steam:authenticate'),
    getGames: () => debugInvoke('api:steam:getGames'),
    getUserGames: (options = {}) => debugInvoke('steam.getUserGames', options),
    getAchievements: appId => debugInvoke('api:steam:getAchievements', appId),
    getUserStats: appId => debugInvoke('api:steam:getUserStats', appId),
    getUserGameAchievements: gameId => debugInvoke('steam.getUserGameAchievements', gameId),
    setCredentials: (apiKey, steamId = null) =>
      debugInvoke('steam.setCredentials', apiKey, steamId),
    getCredentials: () => debugInvoke('steam.getCredentials'),
    checkConnection: () => debugInvoke('steam.checkConnection'),

    // Métodos de cache
    clearCache: (type = null) => debugInvoke('steam.clearCache', type),
    getCacheStats: () => debugInvoke('steam.getCacheStats'),
  },

  // Sistema
  system: {
    getVersion: () => debugInvoke('system:getVersion'),
    getPlatform: () => debugInvoke('system:getPlatform'),
    getSystemInfo: () => debugInvoke('system:getSystemInfo'),
    openExternal: url => debugInvoke('system:openExternal', url),
    showInFolder: path => debugInvoke('system:showInFolder', path),
    quit: () => debugInvoke('system:quit'),
    minimize: () => debugInvoke('system:minimize'),
    maximize: () => debugInvoke('system:maximize'),
    unmaximize: () => debugInvoke('system:unmaximize'),
    isMaximized: () => debugInvoke('system:isMaximized'),
    close: () => debugInvoke('system:close'),
    restart: () => debugInvoke('app:restart'),
  },

  // Configurações e detecção de ambiente
  isDevelopmentMode: () => debugInvoke('system:isDevelopmentMode'),

  // Configurações do sistema (auto-start e tray)
  isInstalledVersion: () => debugInvoke('system:isInstalledVersion'),
  setAutoStart: enabled => debugInvoke('system:setAutoStart', enabled),
  getAutoStart: () => debugInvoke('system:getAutoStart'),
  setMinimizeToTray: enabled => debugInvoke('system:setMinimizeToTray', enabled),
  getMinimizeToTray: () => debugInvoke('system:getMinimizeToTray'),

  // Controles de janela
  minimizeWindow: () => debugInvoke('window:minimize'),
  maximizeWindow: () => debugInvoke('window:maximize'),
  closeWindow: () => debugInvoke('window:close'),
  isMaximized: () => debugInvoke('window:isMaximized'),

  // Eventos
  on: (channel, callback) => {
    const validChannels = [
      'game-added',
      'game-updated',
      'game-deleted',
      'achievement-unlocked',
      'achievement-locked',
      'sync-progress',
      'sync-complete',
      'backup-created',
      'backup-restored',
      'language-changed',
      'theme-changed',
      'theme:systemChanged',
      'window-focus',
      'window-blur',
      'goldberg-migration-dialog',
      'goldberg-migration-completed',
    ];

    if (validChannels.includes(channel)) {
      // Wrapper mais seguro para filtrar objetos não serializáveis
      const safeCallback = (event, ...args) => {
        try {
          // Sanitizar argumentos de forma mais robusta
          const safeArgs = args.map(arg => {
            // Tipos primitivos são sempre seguros
            if (
              arg === null ||
              arg === undefined ||
              typeof arg === 'string' ||
              typeof arg === 'number' ||
              typeof arg === 'boolean'
            ) {
              return arg;
            }

            // Para objetos, usar uma abordagem mais conservadora
            if (typeof arg === 'object') {
              try {
                // Tentar clone direto; se falhar, sanitizar
                const cloned = structuredClone(arg);
                return cloned;
              } catch (e) {
                console.warn(
                  `[PRELOAD] Objeto não serializável filtrado no canal '${channel}':`,
                  e.message
                );
                // Retornar uma representação segura do objeto
                if (Array.isArray(arg)) {
                  return [];
                }
                return {};
              }
            }

            // Para outros tipos (functions, symbols, etc.), retornar null
            return null;
          });

          // Chamar o callback original com argumentos seguros
          callback(event, ...safeArgs);
        } catch (error) {
          try {
            ipcRenderer.invoke(
              'debug:error',
              `[PRELOAD] Erro no callback do canal '${channel}':`,
              error
            );
          } catch (e) {
            console.error(`[PRELOAD] Erro no callback do canal '${channel}':`, error);
          }
          // Em caso de erro, chamar o callback com argumentos vazios
          try {
            callback(event);
          } catch (fallbackError) {
            try {
              ipcRenderer.invoke(
                'debug:error',
                `[PRELOAD] Erro no fallback do callback '${channel}':`,
                fallbackError
              );
            } catch (e) {
              console.error(`[PRELOAD] Erro no fallback do callback '${channel}':`, fallbackError);
            }
          }
        }
      };

      ipcRenderer.on(channel, safeCallback);
    }
  },

  off: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  },

  once: (channel, callback) => {
    const validChannels = [
      'game-added',
      'game-updated',
      'game-deleted',
      'achievement-unlocked',
      'achievement-locked',
      'sync-progress',
      'sync-complete',
      'backup-created',
      'backup-restored',
      'language-changed',
      'theme-changed',
    ];

    if (validChannels.includes(channel)) {
      // Wrapper mais seguro para filtrar objetos não serializáveis
      const safeCallback = (event, ...args) => {
        try {
          // Sanitizar argumentos de forma mais robusta
          const safeArgs = args.map(arg => {
            // Tipos primitivos são sempre seguros
            if (
              arg === null ||
              arg === undefined ||
              typeof arg === 'string' ||
              typeof arg === 'number' ||
              typeof arg === 'boolean'
            ) {
              return arg;
            }

            // Para objetos, usar uma abordagem mais conservadora
            if (typeof arg === 'object') {
              try {
                // Tentar clone direto; se falhar, sanitizar
                const cloned = structuredClone(arg);
                return cloned;
              } catch (e) {
                console.warn(
                  `[PRELOAD] Objeto não serializável filtrado no canal '${channel}':`,
                  e.message
                );
                // Retornar uma representação segura do objeto
                if (Array.isArray(arg)) {
                  return [];
                }
                return {};
              }
            }

            // Para outros tipos (functions, symbols, etc.), retornar null
            return null;
          });

          // Chamar o callback original com argumentos seguros
          callback(event, ...safeArgs);
        } catch (error) {
          try {
            ipcRenderer.invoke(
              'debug:error',
              `[PRELOAD] Erro no callback do canal '${channel}':`,
              error
            );
          } catch (e) {
            console.error(`[PRELOAD] Erro no callback do canal '${channel}':`, error);
          }
          // Em caso de erro, chamar o callback com argumentos vazios
          try {
            callback(event);
          } catch (fallbackError) {
            try {
              ipcRenderer.invoke(
                'debug:error',
                `[PRELOAD] Erro no fallback do callback '${channel}':`,
                fallbackError
              );
            } catch (e) {
              console.error(`[PRELOAD] Erro no fallback do callback '${channel}':`, fallbackError);
            }
          }
        }
      };

      ipcRenderer.once(channel, safeCallback);
    }
  },
};

// Expor API de forma segura
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Informações do ambiente
// Importar package.json para pegar a versão
let packageJson;
try {
  packageJson = require('../../package.json');
} catch (error) {
  packageJson = { version: '0.0.1-beta' };
}

contextBridge.exposeInMainWorld('env', {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PLATFORM: process.platform,
  ARCH: process.arch,
  APP_VERSION: packageJson.version,
});

// Utilitários
contextBridge.exposeInMainWorld('utils', {
  isElectron: true,
  versions: process.versions,
});

// Log para debug (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  // console.log('📦 APIs disponíveis:', Object.keys(electronAPI));
}

// Testes de debug (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Testando setGoldbergSetting:', typeof electronAPI.setGoldbergSetting);
  console.log('🔧 Testando goldberg.setSetting:', typeof electronAPI.goldberg?.setSetting);
}

// Teste direto no window para debug
window.preloadTest = 'Preload funcionando!';
window.testAPI = {
  test: () => 'API funcionando!',
};

// Handler global para promises rejeitadas (especialmente erros de IPC)
process.on('unhandledRejection', (reason, promise) => {
  // Ignorar erros específicos de clonagem IPC
  if (
    reason &&
    reason.message &&
    (reason.message.includes('could not be cloned') ||
      reason.message.includes('IpcRendererInternal.send') ||
      reason.message.includes('An object could not be cloned'))
  ) {
    console.warn('⚠️ Promise rejeitada por erro de clonagem IPC (ignorado):', reason.message);
    return;
  }

  // Para outros erros, apenas logar sem quebrar a aplicação
  console.error('❌ Promise rejeitada não tratada:', reason);
});

// Handler para erros não capturados
process.on('uncaughtException', error => {
  // Ignorar erros específicos de clonagem IPC
  if (
    error &&
    error.message &&
    (error.message.includes('could not be cloned') ||
      error.message.includes('IpcRendererInternal.send') ||
      error.message.includes('An object could not be cloned'))
  ) {
    console.warn('⚠️ Exceção não capturada por erro de clonagem IPC (ignorado):', error.message);
    return;
  }

  // Para outros erros, logar e continuar
  console.error('❌ Exceção não capturada:', error);
});
