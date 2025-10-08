// Processo Principal - Achievements Manager
// Configurar encoding UTF-8 para o console
const { setupUTF8Encoding, setupConsoleUTF8 } = require('./utils/encoding');

// Configurar encoding UTF-8 e console
setupUTF8Encoding();
setupConsoleUTF8();

// Suprimir warnings desnecessários do console
process.on('warning', warning => {
  // Suprimir warnings específicos do Electron/DevTools
  if (
    warning.name === 'DeprecationWarning' ||
    warning.message.includes('Autofill') ||
    warning.message.includes('devtools') ||
    warning.message.includes('protocol_client')
  ) {
    return; // Ignorar esses warnings
  }
  debugManager.warn('⚠️ Warning:', warning.message);
});

const { app, BrowserWindow, ipcMain, shell, dialog, nativeTheme, Tray, Menu } = require('electron');

// Configurar argumentos do Chromium para melhor experiência e performance
app.commandLine.appendSwitch(
  '--disable-features',
  'AutofillServerCommunication,AutofillCrowdsourcing,AutofillAssistant,TranslateUI,MediaRouter,OutOfBlinkCors'
);

// Otimizações de performance
app.commandLine.appendSwitch('--disable-background-timer-throttling');
app.commandLine.appendSwitch('--disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('--disable-renderer-backgrounding');
app.commandLine.appendSwitch('--disable-field-trial-config');
app.commandLine.appendSwitch('--disable-ipc-flooding-protection');

// Otimizações de memória
app.commandLine.appendSwitch('--memory-pressure-off');
app.commandLine.appendSwitch('--max_old_space_size=4096');

// Otimizações de GPU (se disponível)
app.commandLine.appendSwitch('--enable-gpu-rasterization');
app.commandLine.appendSwitch('--enable-zero-copy');

// Desabilitar verificação MIME rigorosa para evitar erros do DevTools
app.commandLine.appendSwitch('--disable-strict-mixed-content-checking');
app.commandLine.appendSwitch('--allow-file-access-from-files');

// Configurar logging do Electron
if (process.env.NODE_ENV !== 'development') {
  app.commandLine.appendSwitch('--disable-logging');
  app.commandLine.appendSwitch('--disable-dev-shm-usage');
}
const path = require('path');
const Store = require('electron-store');
const fs = require('fs').promises;
const os = require('os');

// Função writeDebugLog removida - debug.log não é mais gerado automaticamente

// Importar DebugManager primeiro
const { getDebugManager } = require('./modules/debug-manager');
const debugManager = getDebugManager();

// Importar módulos personalizados
const { setupI18n } = require('./modules/i18n');
const { setupFileSystem } = require('./modules/filesystem');
const { setupWindowManager } = require('./modules/window-manager');
const { setupPerformance } = require('./modules/performance');
const { setupCrashReporter } = require('./modules/crash-reporter');
const { getSecurityManager } = require('./modules/security-manager');
const { getSandboxManager } = require('./modules/sandbox-manager');
const { GSESavesManager } = require('./modules/gse-saves');
const ConfigManager = require('./modules/config');
const { GoldbergMigrationManager } = require('./modules/goldberg-migration');
const { SteamIntegrationManager } = require('./modules/steam-integration');
const SteamLocalGamesManager = require('./modules/steam-local-games');
const { setupPathManager } = require('./modules/path-manager');
const { setupGames } = require('./modules/games');
const { setupAchievements } = require('./modules/achievements');

// Interceptador de erros críticos
process.on('uncaughtException', error => {
  debugManager.error('Erro crítico não tratado:', error);
  process.exit(1);
});

// Interceptar erros não tratados de promises
process.on('unhandledRejection', (reason, promise) => {
  if (reason && reason.message && reason.message.includes('could not be cloned')) {
    if (debugManager && debugManager.isEnabled()) {
      debugManager.ipc(
        'PROMISE REJECTION - ERRO DE CLONAGEM:',
        reason,
        promise,
        new Date().toISOString()
      );
    }
  }
});

// Interceptar warnings relacionados a IPC
process.on('warning', warning => {
  if (
    warning.message &&
    (warning.message.includes('could not be cloned') ||
      warning.message.includes('IpcRendererInternal') ||
      warning.message.includes('structuredClone'))
  ) {
    if (debugManager && debugManager.isEnabled()) {
      debugManager.ipc(
        'WARNING IPC DETECTADO:',
        warning.name,
        warning.message,
        warning.stack,
        new Date().toISOString()
      );
    }
  }
});

// Configurações globais
const isDev = process.env.NODE_ENV === 'development';

/**
 * Detecta se o aplicativo foi instalado via setup (não portable)
 */
function isInstalledVersion() {
  try {
    // Verifica se está em uma pasta de instalação típica do Windows
    const appPath = app.getAppPath();
    const execPath = process.execPath;

    // Caminhos típicos de instalação
    const installPaths = ['Program Files', 'Program Files (x86)', 'AppData\\Local\\Programs'];

    // Verifica se está em um dos caminhos de instalação
    const isInInstallPath = installPaths.some(
      installPath => execPath.includes(installPath) || appPath.includes(installPath)
    );

    // Verifica se não é portable (portable geralmente fica na pasta do usuário ou desktop)
    const isPortable =
      execPath.includes('portable') ||
      appPath.includes('portable') ||
      execPath.includes(os.homedir()) ||
      execPath.includes('Desktop');

    return isInInstallPath && !isPortable;
  } catch (error) {
    debugManager.warn('Erro ao detectar tipo de instalação:', error);
    return false;
  }
}

// Store será inicializado na função initializeApp
let store = null;

let mainWindow;
let splashWindow;
let tray = null;

// Cache interno (em memória) para tamanho/posição da janela
// Não persiste em arquivo físico
let windowBoundsCache = {
  width: 1200,
  height: 800,
  x: undefined,
  y: undefined,
};

// Instâncias dos módulos para cleanup
let performanceManager = null;
let gamesManager = null;
let achievementsManager = null;

/**
 * Cria a janela de splash screen
 */
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 400,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    center: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Obter configuração do modo lite
  const liteMode = store.get('liteMode', false);
  
  // Carregar splash screen
  if (isDev) {
    // Em desenvolvimento, carregar do servidor Vite
    const splashUrl = `http://localhost:3000/splash.html?liteMode=${liteMode}`;
    splashWindow.loadURL(splashUrl).catch(err => {
      debugManager.error('❌ Erro ao carregar splash do servidor de desenvolvimento:', err);
      debugManager.log('🔄 Tentando carregar arquivo estático como fallback...');
      // Fallback para arquivo estático se o servidor não estiver disponível
      const fallbackUrl = `file://${path.join(__dirname, '../renderer/splash.html')}?liteMode=${liteMode}`;
      splashWindow.loadURL(fallbackUrl);
    });
  } else {
    // Em produção, carregar arquivo estático
    const splashUrl = `file://${path.join(__dirname, '../renderer/splash.html')}?liteMode=${liteMode}`;
    splashWindow.loadURL(splashUrl);
  }

  splashWindow.on('closed', () => {
    splashWindow = null;
  });
}

/**
 * Cria a janela principal com configurações otimizadas
 */
function createMainWindow() {
  // Usar somente cache interno em memória
  const bounds = windowBoundsCache;

  const preloadPath = path.join(__dirname, '../preload/preload.js');
  
  // Verificar caminhos alternativos
  const alternativePaths = [
    path.join(__dirname, '../preload/preload.js'),
    path.join(__dirname, '../../preload/preload.js'),
    path.join(__dirname, 'preload/preload.js'),
    path.join(process.resourcesPath, 'app.asar', 'dist', 'preload', 'preload.js'),
    path.join(process.resourcesPath, 'app.asar', 'preload', 'preload.js')
  ];
  
  // Caminhos alternativos verificados (debug log removido)

  // Obter configurações de segurança otimizadas
  const securityManager = getSecurityManager();
  const sandboxManager = getSandboxManager();
  
  mainWindow = new BrowserWindow({
    ...bounds,
    webPreferences: {
      ...securityManager.getSecureWebPreferences(preloadPath),
      ...sandboxManager.getMainWindowSandboxConfig(),
      devTools: isDev // Desabilitar DevTools em produção
    },
    frame: false,
    resizable: true,
    minWidth: 800,
    minHeight: 600,
    show: false, // Não mostrar até estar pronto
    autoHideMenuBar: true,
    ...(process.platform === 'win32' && {
      titleBarStyle: 'hidden',
    }),
  });

  // Configuração do preload concluída (debug logs removidos)
  
  // Capturar erros do preload
  mainWindow.webContents.on('preload-error', (event, preloadPath, error) => {
    console.error('PRELOAD ERROR:', error.message);
    console.error('PRELOAD PATH:', preloadPath);
  });

  // Verificar quando o preload é carregado
  mainWindow.webContents.on('dom-ready', () => {
    // DOM pronto (debug log removido)
  });

  // Verificar se o contexto foi criado
  mainWindow.webContents.on('context-menu', () => {
    // Menu de contexto ativado (debug log removido)
  });



  // Carregar a aplicação
  if (isDev) {
    // Em desenvolvimento, carregar do servidor Vite para hot reload
    mainWindow.loadURL('http://localhost:3000').catch(err => {
      console.error('Erro ao carregar servidor de desenvolvimento:', err.message);
      const htmlPath = path.join(__dirname, '../renderer/index.html');
      // Fallback para arquivo estático se o servidor não estiver disponível
      mainWindow.loadFile(htmlPath);
    });
  } else {
    // Em produção, carregar arquivo estático
    const htmlPath = path.join(__dirname, '../renderer/index.html');
    mainWindow.loadFile(htmlPath);
  }

  // Configurar eventos de segurança
  securityManager.setupSecurityHeaders(mainWindow.webContents);
  securityManager.setupURLValidation(mainWindow.webContents);
  
  // Configurar eventos da janela
  setupWindowEvents();

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    // Evento ready-to-show disparado (debug log removido)
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow.show();

    // Verificar propriedades da janela após mostrar
    setTimeout(() => {
      // Verificação de propriedades da janela (debug logs removidos)
      const bounds = mainWindow.getBounds();
      
      // Forçar foco e trazer para frente
      mainWindow.focus();
      mainWindow.moveTop();
      mainWindow.setAlwaysOnTop(true);
      setTimeout(() => {
        mainWindow.setAlwaysOnTop(false);
        // Janela configurada para ficar visível (debug log removido)
      }, 1000);
    }, 500);

    // Focar na janela
    if (isDev) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });

  // Eventos de carregamento (debug logs removidos)
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Falha ao carregar:', errorCode, '-', errorDescription, '- URL:', validatedURL);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    // Carregamento concluído com sucesso (debug log removido)
  });

  mainWindow.webContents.on('dom-ready', () => {
    // DOM pronto (debug log removido)
  });

  // Ocultar barra do DevTools em tela cheia (modo desenvolvimento)
  mainWindow.on('enter-full-screen', () => {
    if (isDev) {
      // Ocultar a barra de desenvolvimento em tela cheia
      mainWindow.webContents.executeJavaScript(`
        const devToolsIndicator = document.querySelector('.devtools-indicator');
        if (devToolsIndicator) {
          devToolsIndicator.style.display = 'none';
        }
        
        // Adicionar CSS para ocultar qualquer indicador do DevTools
        const style = document.createElement('style');
        style.textContent = \`
          .devtools-indicator,
          [class*="devtools"],
          [id*="devtools"] {
            display: none !important;
            visibility: hidden !important;
          }
        \`;
        document.head.appendChild(style);
      `);
    }
  });

  mainWindow.on('leave-full-screen', () => {
    if (isDev) {
      // Restaurar indicadores quando sair da tela cheia
      mainWindow.webContents.executeJavaScript(`
        const devToolsIndicator = document.querySelector('.devtools-indicator');
        if (devToolsIndicator) {
          devToolsIndicator.style.display = '';
        }
      `);
    }
  });

  // Configurar hot reload para desenvolvimento
  if (isDev) {
    // Listener para detectar quando a página falha ao carregar (servidor não disponível)
    mainWindow.webContents.on(
      'did-fail-load',
      (event, errorCode, errorDescription, validatedURL) => {
        if (validatedURL.includes('localhost:3000')) {
          debugManager.warn(
            '⚠️ Servidor de desenvolvimento não disponível, usando arquivo estático'
          );
          mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
        }
      }
    );

    // Listener para detectar quando a página carrega com sucesso
    mainWindow.webContents.on('did-finish-load', () => {
      debugManager.log('✅ Página carregada com sucesso');
    });
  }

  // Otimizações de performance
  mainWindow.webContents.on('dom-ready', () => {
    // Injetar CSS de performance se necessário
    if (store.get('liteMode')) {
      mainWindow.webContents.insertCSS(`
        * {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `);
    }
  });
}

/**
 * Configura eventos da janela principal
 */
function setupWindowEvents() {
  // Salvar posição e tamanho da janela apenas quando em estado normal (não maximizada/minimizada/tela cheia)
  const saveBoundsIfNormal = () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    const isNormalState =
      !mainWindow.isMaximized() && !mainWindow.isMinimized() && !mainWindow.isFullScreen();
    if (isNormalState) {
      const bounds = mainWindow.getBounds();
      // Atualizar apenas o cache interno (não salvar em arquivo)
      windowBoundsCache = bounds;
    }
  };

  // Eventos que podem alterar posição/tamanho
  mainWindow.on('resize', saveBoundsIfNormal);
  mainWindow.on('move', saveBoundsIfNormal);
  // Ao sair do estado maximizado, salvar o tamanho/posição restaurados
  mainWindow.on('unmaximize', saveBoundsIfNormal);

  // Evento de fechar janela
  mainWindow.on('close', event => {
    const minimizeToTray = store.get('minimizeToTray', false);

    if (minimizeToTray && tray && !app.isQuitting) {
      // Se minimize to tray está ativo, apenas esconder a janela
      event.preventDefault();
      mainWindow.hide();
    } else if (process.platform !== 'darwin') {
      // No Windows/Linux, fechar a janela encerra o app
      app.quit();
    } else {
      // No macOS, apenas esconder a janela
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevenir navegação externa
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (parsedUrl.origin !== 'file://') {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // Otimizar carregamento de recursos
  mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    // Bloquear recursos desnecessários em produção
    if (!isDev && details.url.includes('devtools')) {
      callback({ cancel: true });
    } else {
      callback({});
    }
  });
}

/**
 * Configura o tema do sistema
 */
function setupSystemTheme() {
  // Aplicar tema baseado nas configurações
  const theme = store.get('theme', 'auto');

  if (theme === 'auto') {
    nativeTheme.themeSource = 'system';
  } else {
    nativeTheme.themeSource = theme;
  }

  // Listener para mudanças no tema do sistema
  nativeTheme.on('updated', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      try {
        debugManager.log('🎨 [THEME] Mudança de tema detectada, preparando envio...');

        // Criar dados completamente primitivos para evitar problemas de clonagem
        const systemTheme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';

        // Sanitizar dados com conversão explícita para primitivos
        const sanitizedThemeData = JSON.parse(
          JSON.stringify({
            shouldUseDarkColors: !!nativeTheme.shouldUseDarkColors,
            themeSource: (nativeTheme.themeSource || 'system').toString(),
            systemTheme: systemTheme.toString(),
          })
        );

        // Verificar se os dados são clonáveis antes do envio
        try {
          structuredClone(sanitizedThemeData);
          structuredClone(systemTheme);
          debugManager.log('✅ [THEME] Dados verificados como clonáveis');
        } catch (cloneError) {
          debugManager.error('❌ [THEME] ERRO DE CLONAGEM detectado:', cloneError);
          debugManager.error('❌ [THEME] Dados problemáticos:', {
            sanitizedThemeData,
            systemTheme,
          });
          return; // Não enviar se não for clonável
        }

        // Usar setTimeout para evitar problemas de timing
        setTimeout(() => {
          try {
            debugManager.log('📤 [THEME] Enviando theme:systemChanged:', systemTheme);
            mainWindow.webContents.send('theme:systemChanged', systemTheme);

            debugManager.log('📤 [THEME] Enviando theme-changed:', sanitizedThemeData);
            mainWindow.webContents.send('theme-changed', sanitizedThemeData);

            debugManager.log('✅ [THEME] Dados de tema enviados com sucesso');
          } catch (sendError) {
            debugManager.error('❌ [THEME] Erro ao enviar dados de tema:', sendError);
            if (sendError.message && sendError.message.includes('could not be cloned')) {
              debugManager.error('🚨 [THEME] ERRO DE CLONAGEM CONFIRMADO no envio!');
            }
          }
        }, 10);
      } catch (error) {
        debugManager.error('❌ [THEME] Erro ao processar mudança de tema:', error);
        debugManager.error('❌ [THEME] Stack trace:', error.stack);
      }
    }
  });

  // IPC para mudança de tema
  ipcMain.handle('set-theme', (event, theme) => {
    try {
      nativeTheme.themeSource = theme;
      store.set('theme', theme);
      return { success: true };
    } catch (error) {
      debugManager.error('Erro ao definir tema:', error);
      return { success: false, error: error.message };
    }
  });

  // IPC para obter tema atual
  ipcMain.handle('get-theme', () => {
    return {
      current: String(nativeTheme.themeSource || 'system'),
      shouldUseDarkColors: Boolean(nativeTheme.shouldUseDarkColors),
    };
  });

  // IPC para obter tema do sistema (para modo automático)
  ipcMain.handle('theme:getSystemTheme', () => {
    return String(nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
  });
}

/**
 * Configura o auto-start do Windows
 */
function setupAutoStart() {
  // IPC para configurar auto-start
  ipcMain.handle('set-auto-start', (event, enabled) => {
    try {
      const isInstalled = store.get('isInstalledVersion', false);

      if (!isInstalled) {
        return {
          success: false,
          error: 'Auto-start só está disponível na versão instalada',
        };
      }

      app.setLoginItemSettings({
        openAtLogin: enabled,
        openAsHidden: true, // Inicia em segundo plano
        args: ['--hidden'],
      });

      store.set('autoStartWindows', enabled);
      return { success: true };
    } catch (error) {
      debugManager.error('Erro ao configurar auto-start:', error);
      return { success: false, error: error.message };
    }
  });

  // IPC para verificar status do auto-start
  ipcMain.handle('get-auto-start', () => {
    const isInstalled = store.get('isInstalledVersion', false);
    const enabled = store.get('autoStartWindows', false);
    const loginItemSettings = app.getLoginItemSettings();

    return {
      enabled: enabled && loginItemSettings.openAtLogin,
      available: isInstalled,
    };
  });
}

/**
 * Cria o tray icon
 */
function createTray() {
  try {
    const iconPath = path.join(__dirname, '../../assets/icons/icon.ico');
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Mostrar Achievements Manager',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        },
      },
      {
        label: 'Sair',
        click: () => {
          app.isQuiting = true;
          app.quit();
        },
      },
    ]);

    tray.setToolTip('Achievements Manager');
    tray.setContextMenu(contextMenu);

    // Duplo clique para mostrar a janela
    tray.on('double-click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });

    return true;
  } catch (error) {
    debugManager.error('Erro ao criar tray:', error);
    return false;
  }
}

/**
 * Configura o comportamento de minimizar para tray
 */
function setupMinimizeToTray() {
  // IPC para configurar minimizar para tray
  ipcMain.handle('set-minimize-to-tray', (event, enabled) => {
    try {
      const isInstalled = store.get('isInstalledVersion', false);

      if (!isInstalled) {
        return {
          success: false,
          error: 'Minimizar para bandeja só está disponível na versão instalada',
        };
      }

      store.set('minimizeToTray', enabled);

      // Criar ou destruir tray baseado na configuração
      if (enabled && !tray) {
        createTray();
      } else if (!enabled && tray) {
        tray.destroy();
        tray = null;
      }

      return { success: true };
    } catch (error) {
      debugManager.error('Erro ao configurar minimizar para tray:', error);
      return { success: false, error: error.message };
    }
  });

  // IPC para verificar status do minimize to tray
  ipcMain.handle('get-minimize-to-tray', event => {
    const isInstalled = store.get('isInstalledVersion', false);
    const enabled = store.get('minimizeToTray', false);

    return {
      enabled: enabled,
      available: isInstalled,
    };
  });
}

/**
 * Protege configurações críticas em modo portable
 * Evita que alterações manuais no app.json quebrem o aplicativo
 */
function protectCriticalSettings(store, pathManager) {
  try {
    // Só aplicar proteção se estiver em modo portable
    if (!pathManager || pathManager.isInstalledVersion()) {
      return;
    }

    let needsCorrection = false;
    const criticalSettings = {
      isInstalledVersion: false,
      // Não definir steamPath e userDataPath aqui pois eles podem ser undefined nos defaults
    };

    // Verificar e corrigir configurações críticas
    for (const [key, safeValue] of Object.entries(criticalSettings)) {
      const currentValue = store.get(key);
      if (currentValue !== safeValue) {
        console.warn(
          `🛡️ Proteção ativada: Corrigindo ${key} de "${currentValue}" para "${safeValue}"`
        );
        store.set(key, safeValue);
        needsCorrection = true;
      }
    }

    // Verificar se steamPath ou userDataPath foram definidos manualmente (perigoso em portable)
    const steamPath = store.get('steamPath');
    const userDataPath = store.get('userDataPath');

    if (steamPath !== undefined) {
      console.warn(`🛡️ Proteção ativada: Removendo steamPath customizado em modo portable`);
      store.delete('steamPath');
      needsCorrection = true;
    }

    if (userDataPath !== undefined) {
      console.warn(`🛡️ Proteção ativada: Removendo userDataPath customizado em modo portable`);
      store.delete('userDataPath');
      needsCorrection = true;
    }

    if (needsCorrection) {
      console.log('🛡️ Configurações críticas protegidas e corrigidas automaticamente');
    }
  } catch (error) {
    console.error('❌ Erro ao proteger configurações críticas:', error);
  }
}

/**
 * Inicialização da aplicação
 */
async function initializeApp() {
  try {
    // Inicializar gerenciadores de segurança primeiro
    const securityManager = getSecurityManager();
    const sandboxManager = getSandboxManager();

    // Inicializar Path Manager primeiro
    const pathManager = await setupPathManager();
    const isInstalled = pathManager.isInstalledVersion();

    // Inicializar electron-store dinamicamente
    const Store = (await import('electron-store')).default;

    // Definir o caminho correto para o arquivo de configurações
    const settingsPath = isInstalled
      ? pathManager.getUserDataPath() // Versão instalada: usar AppData
      : pathManager.getPaths().settings; // Modo dev: usar src/data/settings;

    store = new Store({
      name: 'app', // Define o nome do arquivo como app.json
      cwd: settingsPath, // Usar o caminho correto baseado no tipo de instalação
      defaults: {
        // Configurações básicas
        setupComplete: false,
        language: 'pt-BR',
        theme: 'dark',
        liteMode: true,
        virtualScrolling: true,
        autoStartWindows: false,
        minimizeToTray: false,
        isInstalledVersion: isInstalled,

        // Configurações de API
        apiSource: 'steam',

        // Configurações de performance
        performance: {
          enableVirtualScrolling: true,
          enableLazyLoading: true,
          showTooltips: true,
          autoSync: true,
          cacheSize: 100,
        },

        // Configurações de janela
        // Removido armazenamento físico de windowBounds; agora em cache interno

        // Configurações individuais (para compatibilidade)
        showTooltips: true,
        autoSync: true,
        cacheSize: "100",

        // Configurações de sistema
        crashReports: true,

        // Cache
        cache: {
          images: {}
        }
      },
    });
    // Proteger configurações críticas em modo portable
    protectCriticalSettings(store, pathManager);

    // Inicializar crash reporter primeiro
    await setupCrashReporter();

    // Inicializar gerenciador de configurações
    const configManager = new ConfigManager();
    await configManager.init(pathManager.getUserDataPath());

    // Inicializar configurações padrão através do ConfigManager
    await configManager.initializeDefaultConfigs();

    // Configurar módulos
    await setupI18n(pathManager);

    // Configurar filesystem e criar apenas pastas essenciais
    const filesystemManager = await setupFileSystem(
      store,
      pathManager,
      global.crashReporter,
      configManager
    );
    
    await setupWindowManager(ipcMain, store);
    
    performanceManager = await setupPerformance(store);
    
    const gseSavesManager = new GSESavesManager(pathManager, debugManager);
    await gseSavesManager.initialize();

    // Inicializar Goldberg Migration Manager
    const goldbergMigrationManager = new GoldbergMigrationManager(
      global.crashReporter,
      pathManager
    );
    await goldbergMigrationManager.initialize();

    // Inicializar Steam Integration Manager
    const steamIntegration = new SteamIntegrationManager(pathManager, configManager, debugManager);
    global.steamIntegrationManager = steamIntegration; // Tornar disponível globalmente

    // Inicializar Steam Local Games Manager
    const steamLocalGames = new SteamLocalGamesManager(debugManager, global.crashReporter);
    global.steamLocalGamesManager = steamLocalGames; // Tornar disponível globalmente

    // Inicializar Games Manager
    gamesManager = setupGames(configManager, global.crashReporter);

    // Inicializar Achievements Manager
    achievementsManager = setupAchievements(configManager, global.crashReporter);

    // Configurar tema do sistema
    setupSystemTheme();

    // Configurar auto-start e minimize to tray
    setupAutoStart();
    setupMinimizeToTray();

    // Verificar se deve iniciar minimizado
    const shouldStartHidden =
      process.argv.includes('--hidden') || store.get('autoStartWindows', false);

    // Criar tray se necessário
    if (store.get('minimizeToTray', false)) {
      createTray();
    }

    // Criar janelas
    if (!shouldStartHidden) {
      createSplashWindow();
    }

    // Aguardar um pouco para mostrar o splash
    setTimeout(() => {
      createMainWindow();
    }, 1500);
  } catch (error) {
    // Mostrar dialog de erro
    dialog.showErrorBox(
      'Erro de Inicialização',
      `Falha ao inicializar a aplicação: ${error.message}`
    );

    app.quit();
  }
}

// Eventos do Electron
app.whenReady().then(async () => {
  try {
    await initializeApp();
  } catch (error) {
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

// Cleanup antes de fechar o app
app.on('before-quit', async event => {
  app.isQuitting = true;
  debugManager.log('🔄 Iniciando processo de cleanup...');

  try {
    // Cleanup do PerformanceManager - Desabilitado
    // if (performanceManager && typeof performanceManager.stopMonitoring === 'function') {
    //   console.log('🧹 Limpando PerformanceManager...');
    //   performanceManager.stopMonitoring();
    // }

    // Cleanup do tray
    if (tray && !tray.isDestroyed()) {
      debugManager.log('🧹 Limpando tray...');
      tray.destroy();
    }

    // Cleanup do splash window
    if (splashWindow && !splashWindow.isDestroyed()) {
      debugManager.log('🧹 Limpando splash window...');
      splashWindow.close();
      splashWindow = null;
    }

    // Cleanup dos processos sandbox
    try {
      debugManager.log('🧹 Finalizando processos sandbox...');
      const sandboxManager = getSandboxManager();
      await sandboxManager.shutdown();
      debugManager.log('✅ Processos sandbox finalizados');
    } catch (error) {
      debugManager.error('❌ Erro ao finalizar processos sandbox:', error);
    }

    debugManager.log('✅ Cleanup concluído com sucesso!');
  } catch (error) {
    debugManager.error('❌ Erro durante cleanup:', error);
  }
});

// Configurações de segurança
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });

  // Configurar DevTools para suprimir erros específicos
  contents.once('dom-ready', () => {
    if (isDev) {
      // Injetar script para suprimir erros específicos do console
      contents.executeJavaScript(`
        const originalError = console.error;
        console.error = function(...args) {
          const message = args.join(' ');
          if (message.includes('Autofill.enable') || 
              message.includes('Autofill.setAddresses') ||
              message.includes('protocol_client')) {
            return; // Suprimir esses erros específicos
          }
          originalError.apply(console, args);
        };
      `);
    }
  });
});

// Handlers IPC para debug (receber logs do preload)
ipcMain.handle('debug:log', (event, ...args) => {
  if (debugManager) {
    debugManager.log(...args);
  }
});

ipcMain.handle('debug:error', (event, ...args) => {
  if (debugManager) {
    debugManager.error(...args);
  }
});

ipcMain.handle('debug:warn', (event, ...args) => {
  if (debugManager) {
    debugManager.warn(...args);
  }
});

// Handlers IPC básicos
ipcMain.handle('app:getVersion', () => app.getVersion());
ipcMain.handle('app:getPlatform', () => process.platform);
ipcMain.handle('app:getPath', (event, name) => app.getPath(name));

// Handlers do sistema
ipcMain.handle('system:getVersion', () => app.getVersion());
ipcMain.handle('system:getPlatform', () => process.platform);
ipcMain.handle('system:getSystemInfo', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: app.getVersion(),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
  };
});
ipcMain.handle('system:openExternal', (event, url) => shell.openExternal(url));
ipcMain.handle('system:showInFolder', (event, path) => shell.showItemInFolder(path));
ipcMain.handle('system:quit', () => app.quit());
ipcMain.handle('system:minimize', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) focusedWindow.minimize();
});
ipcMain.handle('system:maximize', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    if (focusedWindow.isMaximized()) {
      focusedWindow.unmaximize();
    } else {
      focusedWindow.maximize();
    }
  }
});
ipcMain.handle('system:unmaximize', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) focusedWindow.unmaximize();
});
ipcMain.handle('system:isMaximized', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  return focusedWindow ? focusedWindow.isMaximized() : false;
});
ipcMain.handle('system:close', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) focusedWindow.close();
});

// Handlers window:* são configurados em src/main/modules/window-manager.js via setupWindowManager(ipcMain, store).

// Handler para verificar se é versão instalada
ipcMain.handle('system:isInstalledVersion', () => {
  return isInstalledVersion();
});

ipcMain.handle('system:isDevelopmentMode', () => {
  return isDev;
});

// Handlers para Path Manager
ipcMain.handle('path:getDataPath', () => {
  const { getPathManager } = require('./modules/path-manager');
  const pathManager = getPathManager();
  return pathManager ? pathManager.getDataPath() : null;
});

ipcMain.handle('path:getUserDataPath', () => {
  const { getPathManager } = require('./modules/path-manager');
  const pathManager = getPathManager();
  return pathManager ? pathManager.getUserDataPath() : null;
});

ipcMain.handle('path:isInstalledVersion', () => {
  const { getPathManager } = require('./modules/path-manager');
  const pathManager = getPathManager();
  return pathManager ? pathManager.isInstalledVersion() : false;
});

// Handlers para auto-start (aliases para compatibilidade)
ipcMain.handle('system:setAutoStart', (event, enabled) => {
  return ipcMain.emit('set-auto-start', event, enabled);
});

ipcMain.handle('system:getAutoStart', () => {
  const isInstalled = store.get('isInstalledVersion', false);
  const enabled = store.get('autoStartWindows', false);
  const loginItemSettings = app.getLoginItemSettings();

  return {
    enabled: enabled && loginItemSettings.openAtLogin,
    available: isInstalled,
  };
});

// Handlers para minimize to tray (aliases para compatibilidade)
ipcMain.handle('system:setMinimizeToTray', (event, enabled) => {
  try {
    const isInstalled = store.get('isInstalledVersion', false);

    if (!isInstalled) {
      return {
        success: false,
        error: 'Minimizar para bandeja só está disponível na versão instalada',
      };
    }

    store.set('minimizeToTray', enabled);

    // Criar ou destruir tray baseado na configuração
    if (enabled && !tray) {
      createTray();
    } else if (!enabled && tray) {
      tray.destroy();
      tray = null;
    }

    return { success: true };
  } catch (error) {
    debugManager.error('Erro ao configurar minimizar para tray:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('system:getMinimizeToTray', () => {
  const isInstalled = store.get('isInstalledVersion', false);
  const enabled = store.get('minimizeToTray', false);

  return {
    enabled: enabled,
    available: isInstalled,
  };
});

// Handler para reinicialização do aplicativo
ipcMain.handle('app:restart', () => {
  try {
    const isInstalled = isInstalledVersion();

    if (isInstalled) {
      // Versão instalada: reinicia automaticamente
      debugManager.system('🔄 Reiniciando aplicativo (versão instalada)...');
      app.relaunch();
      app.exit(0);
    } else {
      // Versão portable: apenas finaliza o programa
      debugManager.system('🔄 Finalizando aplicativo (versão portable)...');
      app.quit();
    }
  } catch (error) {
    debugManager.error('❌ Erro ao reiniciar aplicativo:', error);
    throw error;
  }
});

// Handlers de erro global são gerenciados pelo crash reporter

module.exports = { mainWindow, store };
