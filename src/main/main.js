var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2(
  (target, value) => __defProp22(target, "name", { value, configurable: true }),
  "__name"
);
var require_main = /* @__PURE__ */ __name22(async (module) => {
  const { setupUTF8Encoding, setupConsoleUTF8 } = require("./utils/encoding");
  setupUTF8Encoding();
  setupConsoleUTF8();
  process.on("warning", (warning) => {
    if (warning.name === "DeprecationWarning" || warning.message.includes("Autofill") || warning.message.includes("devtools") || warning.message.includes("protocol_client")) {
      return;
    }
    debugManager.warn("\u26A0\uFE0F Warning:", warning.message);
  });
  const { app, BrowserWindow, ipcMain, shell, dialog, nativeTheme } = require("electron");
  app.commandLine.appendSwitch(
    "--disable-features",
    "AutofillServerCommunication,AutofillCrowdsourcing,AutofillAssistant,TranslateUI,MediaRouter,OutOfBlinkCors"
  );
  app.commandLine.appendSwitch("--disable-background-timer-throttling");
  app.commandLine.appendSwitch("--disable-backgrounding-occluded-windows");
  app.commandLine.appendSwitch("--disable-renderer-backgrounding");
  app.commandLine.appendSwitch("--disable-field-trial-config");
  app.commandLine.appendSwitch("--disable-ipc-flooding-protection");
  app.commandLine.appendSwitch("--memory-pressure-off");
  app.commandLine.appendSwitch("--max_old_space_size=4096");
  app.commandLine.appendSwitch("--enable-gpu-rasterization");
  app.commandLine.appendSwitch("--enable-zero-copy");
  app.commandLine.appendSwitch("--disable-strict-mixed-content-checking");
  app.commandLine.appendSwitch("--allow-file-access-from-files");
  if (process.env.NODE_ENV !== "development") {
    app.commandLine.appendSwitch("--disable-logging");
    app.commandLine.appendSwitch("--disable-dev-shm-usage");
  }
  const path = require("node:path");
  const os = require("node:os");
  const debugModule = require("./modules/debug-manager");
  const getDebugManager = debugModule.getDebugManager || debugModule.default && debugModule.default.getDebugManager;
  const debugManager = getDebugManager();
  const i18nModule = require("./modules/i18n");
  const setupI18n = i18nModule.setupI18n || i18nModule.default && i18nModule.default.setupI18n;
  const filesystemModule = require("./modules/filesystem");
  const setupFileSystem = filesystemModule.setupFileSystem || filesystemModule.default && filesystemModule.default.setupFileSystem;
  const windowManagerModule = require("./modules/window-manager");
  const setupWindowManager = windowManagerModule.setupWindowManager || windowManagerModule.default && windowManagerModule.default.setupWindowManager;
  const performanceModule = require("./modules/performance");
  const setupPerformance = performanceModule.setupPerformance || performanceModule.default && performanceModule.default.setupPerformance;
  const crashModule = require("./modules/crash-reporter");
  const setupCrashReporter = crashModule.setupCrashReporter || crashModule.default && crashModule.default.setupCrashReporter;
  const securityModule = require("./modules/security-manager");
  const sandboxModule = require("./modules/sandbox-manager");
  const getSecurityManager = securityModule.getSecurityManager || securityModule.default && securityModule.default.getSecurityManager;
  const getSandboxManager = sandboxModule.getSandboxManager || sandboxModule.default && sandboxModule.default.getSandboxManager;
  const gseModule = require("./modules/gse-saves");
  const GSESavesManager = gseModule.GSESavesManager || gseModule.default && gseModule.default.GSESavesManager || gseModule;
  const configModule = require("./modules/config");
  const ConfigManager = configModule.ConfigManager || configModule.default || configModule;
  const goldbergModule = require("./modules/goldberg-migration");
  const GoldbergMigrationManager = goldbergModule.GoldbergMigrationManager || goldbergModule.default && goldbergModule.default.GoldbergMigrationManager || goldbergModule;
  const steamIntegrationModule = require("./modules/steam-integration");
  const SteamIntegrationManager = steamIntegrationModule.SteamIntegrationManager || steamIntegrationModule.default && steamIntegrationModule.default.SteamIntegrationManager || steamIntegrationModule;
  const steamLocalModule = require("./modules/steam-local-games");
  const SteamLocalGamesManager = steamLocalModule.SteamLocalGamesManager || steamLocalModule.default || steamLocalModule;
  const pathModule = require("./modules/path-manager");
  const setupPathManager = pathModule.setupPathManager || pathModule.default && pathModule.default.setupPathManager;
  const gamesModule = require("./modules/games");
  const setupGames = gamesModule.setupGames || gamesModule.default && gamesModule.default.setupGames;
  const achievementsModule = require("./modules/achievements");
  const setupAchievements = achievementsModule.setupAchievements || achievementsModule.default && achievementsModule.default.setupAchievements;
  process.on("uncaughtException", (error) => {
    debugManager.error("Erro cr\xEDtico n\xE3o tratado:", error);
    process.exit(1);
  });
  process.on("unhandledRejection", (reason, promise) => {
    if (reason && reason.message && reason.message.includes("could not be cloned")) {
      if (debugManager?.isEnabled()) {
        debugManager.ipc(
          "PROMISE REJECTION - ERRO DE CLONAGEM:",
          reason,
          promise,
          /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
        );
      }
    }
  });
  process.on("warning", (warning) => {
    if (warning.message && (warning.message.includes("could not be cloned") || warning.message.includes("IpcRendererInternal") || warning.message.includes("structuredClone"))) {
      if (debugManager?.isEnabled()) {
        debugManager.ipc(
          "WARNING IPC DETECTADO:",
          warning.name,
          warning.message,
          warning.stack,
          /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
        );
      }
    }
  });
  const isDev = process.env.NODE_ENV === "development";
  function isInstalledVersion() {
    try {
      const appPath = app.getAppPath();
      const execPath = process.execPath;
      const installPaths = ["Program Files", "Program Files (x86)", "AppData\\Local\\Programs"];
      const isInInstallPath = installPaths.some(
        (installPath) => execPath.includes(installPath) || appPath.includes(installPath)
      );
      const isPortable = execPath.includes("portable") || appPath.includes("portable") || execPath.includes(os.homedir()) || execPath.includes("Desktop");
      return isInInstallPath && !isPortable;
    } catch (error) {
      debugManager.warn("Erro ao detectar tipo de instala\xE7\xE3o:", error);
      return false;
    }
  }
  __name(isInstalledVersion, "isInstalledVersion");
  __name2(isInstalledVersion, "isInstalledVersion");
  __name22(isInstalledVersion, "isInstalledVersion");
  let store = null;
  let mainWindow;
  let splashWindow;
  let windowBoundsCache = {
    width: 1200,
    height: 800,
    x: void 0,
    y: void 0
  };
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
        contextIsolation: true
      }
    });
    const liteMode = store.get("liteMode", false);
    if (isDev) {
      const splashUrl = `http://localhost:3000/splash.html?liteMode=${liteMode}`;
      splashWindow.loadURL(splashUrl).catch((err) => {
        debugManager.error("\u274C Erro ao carregar splash do servidor de desenvolvimento:", err);
        debugManager.log("\u{1F504} Tentando carregar arquivo est\xE1tico como fallback...");
        const fallbackUrl = `file://${path.join(__dirname, "../renderer/splash.html")}?liteMode=${liteMode}`;
        splashWindow.loadURL(fallbackUrl);
      });
    } else {
      const splashUrl = `file://${path.join(__dirname, "../renderer/splash.html")}?liteMode=${liteMode}`;
      splashWindow.loadURL(splashUrl);
    }
    splashWindow.on("closed", () => {
      splashWindow = null;
    });
  }
  __name(createSplashWindow, "createSplashWindow");
  __name2(createSplashWindow, "createSplashWindow");
  __name22(createSplashWindow, "createSplashWindow");
  function createMainWindow() {
    const bounds = windowBoundsCache;
    const preloadPath = path.join(__dirname, "../preload/preload.js");
    const securityManager = typeof getSecurityManager === "function" ? getSecurityManager() : (() => {
      throw new Error("getSecurityManager is not available");
    })();
    const sandboxManager = typeof getSandboxManager === "function" ? getSandboxManager() : (() => {
      throw new Error("getSandboxManager is not available");
    })();
    mainWindow = new BrowserWindow({
      ...bounds,
      webPreferences: {
        ...securityManager.getSecureWebPreferences(preloadPath),
        ...sandboxManager.getMainWindowSandboxConfig(),
        devTools: isDev
        // Desabilitar DevTools em produção
      },
      frame: false,
      resizable: true,
      minWidth: 800,
      minHeight: 600,
      show: false,
      // Não mostrar até estar pronto
      autoHideMenuBar: true,
      ...process.platform === "win32" && {
        titleBarStyle: "hidden"
      }
    });
    mainWindow.webContents.on("context-menu", (e) => {
      e.preventDefault();
    });
    if (isDev) {
      mainWindow.loadURL("http://localhost:3000").catch(() => {
        const htmlPath = path.join(__dirname, "../renderer/index.html");
        mainWindow.loadFile(htmlPath);
      });
    } else {
      const htmlPath = path.join(__dirname, "../renderer/index.html");
      mainWindow.loadFile(htmlPath);
    }
    securityManager.setupSecurityHeaders(mainWindow.webContents);
    securityManager.setupURLValidation(mainWindow.webContents);
    setupWindowEvents();
    const closeSplashIfPresent = /* @__PURE__ */ __name22(() => {
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close();
        splashWindow = null;
      }
    }, "closeSplashIfPresent");
    const boostWindowFocus = /* @__PURE__ */ __name22(() => {
      if (!mainWindow || mainWindow.isDestroyed()) return;
      mainWindow.show();
      setTimeout(() => {
        mainWindow.focus();
        mainWindow.moveTop();
        mainWindow.setAlwaysOnTop(true);
        setTimeout(() => {
          mainWindow.setAlwaysOnTop(false);
        }, 1e3);
      }, 500);
    }, "boostWindowFocus");
    const handleDidFailLoad = /* @__PURE__ */ __name22((validatedURL) => {
      if (isDev && validatedURL && validatedURL.includes("localhost:3000")) {
        debugManager.warn(
          "\u26A0\uFE0F Servidor de desenvolvimento n\xE3o dispon\xEDvel, usando arquivo est\xE1tico"
        );
        mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
        return;
      }
    }, "handleDidFailLoad");
    const handleDidFinishLoad = /* @__PURE__ */ __name22(() => {
      if (!isDev) return;
      debugManager.log("\u2705 P\xE1gina carregada com sucesso");
    }, "handleDidFinishLoad");
    const ensureLiteModeCSS = /* @__PURE__ */ __name22(() => {
      if (!store.get("liteMode")) return;
      mainWindow.webContents.insertCSS(`
        * {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `);
    }, "ensureLiteModeCSS");
    mainWindow.once("ready-to-show", () => {
      closeSplashIfPresent();
      boostWindowFocus();
      if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });
    });
    mainWindow.webContents.on("did-fail-load", handleDidFailLoad);
    mainWindow.webContents.on("did-finish-load", handleDidFinishLoad);
    mainWindow.on("enter-full-screen", () => {
      if (isDev) {
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
    mainWindow.on("leave-full-screen", () => {
      if (isDev) {
        mainWindow.webContents.executeJavaScript(`
        const devToolsIndicator = document.querySelector('.devtools-indicator');
        if (devToolsIndicator) {
          devToolsIndicator.style.display = '';
        }
      `);
      }
    });
    mainWindow.webContents.on("dom-ready", ensureLiteModeCSS);
  }
  __name(createMainWindow, "createMainWindow");
  __name2(createMainWindow, "createMainWindow");
  __name22(createMainWindow, "createMainWindow");
  function setupWindowEvents() {
    const saveBoundsIfNormal = /* @__PURE__ */ __name22(() => {
      if (!mainWindow || mainWindow.isDestroyed()) return;
      const isNormalState = !mainWindow.isMaximized() && !mainWindow.isMinimized() && !mainWindow.isFullScreen();
      if (isNormalState) {
        const bounds = mainWindow.getBounds();
        windowBoundsCache = bounds;
      }
    }, "saveBoundsIfNormal");
    mainWindow.on("resize", saveBoundsIfNormal);
    mainWindow.on("move", saveBoundsIfNormal);
    mainWindow.on("unmaximize", saveBoundsIfNormal);
    mainWindow.on("close", (event2) => {
      if (process.platform !== "darwin") {
        app.quit();
      } else {
        event2.preventDefault();
        mainWindow.hide();
      }
    });
    mainWindow.on("closed", () => {
      mainWindow = null;
    });
    mainWindow.webContents.on("will-navigate", (event2, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      if (parsedUrl.origin !== "file://") {
        event2.preventDefault();
        shell.openExternal(navigationUrl);
      }
    });
    mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
      if (!isDev && details.url.includes("devtools")) {
        callback({ cancel: true });
      } else {
        callback({});
      }
    });
  }
  __name(setupWindowEvents, "setupWindowEvents");
  __name2(setupWindowEvents, "setupWindowEvents");
  __name22(setupWindowEvents, "setupWindowEvents");
  function setupSystemTheme() {
    const theme = store.get("theme", "auto");
    if (theme === "auto") {
      nativeTheme.themeSource = "system";
    } else {
      nativeTheme.themeSource = theme;
    }
    nativeTheme.on("updated", () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        try {
          debugManager.log("\u{1F3A8} [THEME] Mudan\xE7a de tema detectada, preparando envio...");
          const systemTheme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
          const sanitizedThemeData = JSON.parse(
            JSON.stringify({
              shouldUseDarkColors: !!nativeTheme.shouldUseDarkColors,
              themeSource: (nativeTheme.themeSource || "system").toString(),
              systemTheme: systemTheme.toString()
            })
          );
          try {
            structuredClone(sanitizedThemeData);
            structuredClone(systemTheme);
            debugManager.log("\u2705 [THEME] Dados verificados como clon\xE1veis");
          } catch (cloneError) {
            debugManager.error("\u274C [THEME] ERRO DE CLONAGEM detectado:", cloneError);
            debugManager.error("\u274C [THEME] Dados problem\xE1ticos:", {
              sanitizedThemeData,
              systemTheme
            });
            return;
          }
          setTimeout(() => {
            try {
              debugManager.log("\u{1F4E4} [THEME] Enviando theme:systemChanged:", systemTheme);
              mainWindow.webContents.send("theme:systemChanged", systemTheme);
              debugManager.log("\u{1F4E4} [THEME] Enviando theme-changed:", sanitizedThemeData);
              mainWindow.webContents.send("theme-changed", sanitizedThemeData);
              debugManager.log("\u2705 [THEME] Dados de tema enviados com sucesso");
            } catch (sendError) {
              debugManager.error("\u274C [THEME] Erro ao enviar dados de tema:", sendError);
              if (sendError.message && sendError.message.includes("could not be cloned")) {
                debugManager.error("\u{1F6A8} [THEME] ERRO DE CLONAGEM CONFIRMADO no envio!");
              }
            }
          }, 10);
        } catch (error) {
          debugManager.error("\u274C [THEME] Erro ao processar mudan\xE7a de tema:", error);
          debugManager.error("\u274C [THEME] Stack trace:", error.stack);
        }
      }
    });
    ipcMain.handle("set-theme", (_event, theme2) => {
      try {
        nativeTheme.themeSource = theme2;
        store.set("theme", theme2);
        return { success: true };
      } catch (error) {
        debugManager.error("Erro ao definir tema:", error);
        return { success: false, error: error.message };
      }
    });
    ipcMain.handle("get-theme", () => {
      return {
        current: String(nativeTheme.themeSource || "system"),
        shouldUseDarkColors: Boolean(nativeTheme.shouldUseDarkColors)
      };
    });
    ipcMain.handle("theme:getSystemTheme", () => {
      return String(nativeTheme.shouldUseDarkColors ? "dark" : "light");
    });
  }
  __name(setupSystemTheme, "setupSystemTheme");
  __name2(setupSystemTheme, "setupSystemTheme");
  __name22(setupSystemTheme, "setupSystemTheme");
  function setupAutoStart() {
    ipcMain.handle("set-auto-start", (_event, enabled) => {
      try {
        const isInstalled = store.get("isInstalledVersion", false);
        if (!isInstalled) {
          return {
            success: false,
            error: "Auto-start s\xF3 est\xE1 dispon\xEDvel na vers\xE3o instalada"
          };
        }
        app.setLoginItemSettings({
          openAtLogin: enabled,
          openAsHidden: true,
          // Inicia em segundo plano
          args: ["--hidden"]
        });
        store.set("autoStartWindows", enabled);
        return { success: true };
      } catch (error) {
        debugManager.error("Erro ao configurar auto-start:", error);
        return { success: false, error: error.message };
      }
    });
    ipcMain.handle("get-auto-start", () => {
      const isInstalled = store.get("isInstalledVersion", false);
      const enabled = store.get("autoStartWindows", false);
      const loginItemSettings = app.getLoginItemSettings();
      return {
        enabled: enabled && loginItemSettings.openAtLogin,
        available: isInstalled
      };
    });
  }
  __name(setupAutoStart, "setupAutoStart");
  __name2(setupAutoStart, "setupAutoStart");
  __name22(setupAutoStart, "setupAutoStart");
  function protectCriticalSettings(store2, pathManager) {
    if (!pathManager || pathManager.isInstalledVersion()) {
      return;
    }
    const criticalSettings = {
      isInstalledVersion: false
      // Não definir steamPath e userDataPath aqui pois eles podem ser undefined nos defaults
    };
    for (const [key, safeValue] of Object.entries(criticalSettings)) {
      const currentValue = store2.get(key);
      if (currentValue !== safeValue) {
        store2.set(key, safeValue);
      }
    }
    const steamPath = store2.get("steamPath");
    if (steamPath !== void 0) {
      store2.delete("steamPath");
    }
  }
  __name(protectCriticalSettings, "protectCriticalSettings");
  __name2(protectCriticalSettings, "protectCriticalSettings");
  __name22(protectCriticalSettings, "protectCriticalSettings");
  async function initializeApp() {
    try {
      const pathManager = await setupPathManager();
      const isInstalled = pathManager.isInstalledVersion();
      const Store2 = (await import("electron-store")).default;
      const settingsPath = isInstalled ? pathManager.getUserDataPath() : pathManager.getPaths().settings;
      store = new Store2({
        name: "app",
        // Define o nome do arquivo como app.json
        cwd: settingsPath,
        // Usar o caminho correto baseado no tipo de instalação
        defaults: {
          // Configurações básicas
          setupComplete: false,
          language: "pt-BR",
          theme: "dark",
          liteMode: true,
          virtualScrolling: true,
          autoStartWindows: false,
          isInstalledVersion: isInstalled,
          // Configurações de API
          apiSource: "steam",
          // Configurações de performance
          performance: {
            enableVirtualScrolling: true,
            enableLazyLoading: true,
            showTooltips: true,
            autoSync: true,
            cacheSize: 100
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
        }
      });
      protectCriticalSettings(store, pathManager);
      await setupCrashReporter();
      const configManager = new ConfigManager();
      await configManager.init(pathManager.getUserDataPath());
      await configManager.initializeDefaultConfigs();
      await setupI18n(pathManager);
      await setupFileSystem(store, pathManager, globalThis.crashReporter, configManager);
      await setupWindowManager(ipcMain, store);
      await setupPerformance(store);
      const gseSavesManager = new GSESavesManager(pathManager, debugManager);
      await gseSavesManager.initialize();
      const goldbergMigrationManager = new GoldbergMigrationManager(
        globalThis.crashReporter,
        pathManager
      );
      await goldbergMigrationManager.initialize();
      const steamIntegration = new SteamIntegrationManager(
        pathManager,
        configManager,
        debugManager
      );
      globalThis.steamIntegrationManager = steamIntegration;
      const steamLocalGames = new SteamLocalGamesManager(debugManager, globalThis.crashReporter);
      globalThis.steamLocalGamesManager = steamLocalGames;
      setupGames(configManager, globalThis.crashReporter);
      setupAchievements(configManager, globalThis.crashReporter);
      setupSystemTheme();
      setupAutoStart();
      const shouldStartHidden = process.argv.includes("--hidden") || store.get("autoStartWindows", false);
      if (!shouldStartHidden) {
        createSplashWindow();
      }
      setTimeout(() => {
        createMainWindow();
      }, 1500);
    } catch {
      dialog.showErrorBox("Erro de Inicializa\xE7\xE3o", "Falha ao inicializar a aplica\xE7\xE3o");
      app.quit();
    }
  }
  __name(initializeApp, "initializeApp");
  __name2(initializeApp, "initializeApp");
  __name22(initializeApp, "initializeApp");
  app.whenReady().then(async () => {
    try {
      await initializeApp();
    } catch {
      app.quit();
    }
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
  app.on("before-quit", async (_event) => {
    app.isQuitting = true;
    debugManager.log("\u{1F504} Iniciando processo de cleanup...");
    try {
      if (splashWindow && !splashWindow.isDestroyed()) {
        debugManager.log("\u{1F9F9} Limpando splash window...");
        splashWindow.close();
        splashWindow = null;
      }
      try {
        debugManager.log("\u{1F9F9} Finalizando processos sandbox...");
        const sandboxManager = getSandboxManager();
        await sandboxManager.shutdown();
        debugManager.log("\u2705 Processos sandbox finalizados");
      } catch (error) {
        debugManager.error("\u274C Erro ao finalizar processos sandbox:", error);
      }
      debugManager.log("\u2705 Cleanup conclu\xEDdo com sucesso!");
    } catch (error) {
      debugManager.error("\u274C Erro durante cleanup:", error);
    }
  });
  app.on("web-contents-created", (event2, contents) => {
    contents.on("new-window", (event22, navigationUrl) => {
      event22.preventDefault();
      shell.openExternal(navigationUrl);
    });
  });
  ipcMain.handle("debug:log", (_event, ...args) => {
    if (debugManager) {
      debugManager.log(...args);
    }
  });
  ipcMain.handle("debug:error", (_event, ...args) => {
    if (debugManager) {
      debugManager.error(...args);
    }
  });
  ipcMain.handle("debug:warn", (_event, ...args) => {
    if (debugManager) {
      debugManager.warn(...args);
    }
  });
  ipcMain.handle("app:getVersion", () => app.getVersion());
  ipcMain.handle("app:getPlatform", () => process.platform);
  ipcMain.handle("app:getPath", (_event, name) => app.getPath(name));
  ipcMain.handle("system:getVersion", () => app.getVersion());
  ipcMain.handle("system:getPlatform", () => process.platform);
  ipcMain.handle("system:getSystemInfo", () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: app.getVersion(),
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node
    };
  });
  ipcMain.handle("system:openExternal", (_event, url) => shell.openExternal(url));
  ipcMain.handle("system:showInFolder", (_event, path2) => shell.showItemInFolder(path2));
  ipcMain.handle("system:quit", () => app.quit());
  ipcMain.handle("system:minimize", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) focusedWindow.minimize();
  });
  ipcMain.handle("system:maximize", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      if (focusedWindow.isMaximized()) {
        focusedWindow.unmaximize();
      } else {
        focusedWindow.maximize();
      }
    }
  });
  ipcMain.handle("system:unmaximize", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) focusedWindow.unmaximize();
  });
  ipcMain.handle("system:isMaximized", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    return focusedWindow ? focusedWindow.isMaximized() : false;
  });
  ipcMain.handle("system:close", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) focusedWindow.close();
  });
  ipcMain.handle("system:isInstalledVersion", () => {
    return isInstalledVersion();
  });
  ipcMain.handle("system:isDevelopmentMode", () => {
    return isDev;
  });
  ipcMain.handle("path:getDataPath", () => {
    const { getPathManager } = require("./modules/path-manager");
    const pathManager = getPathManager();
    return pathManager ? pathManager.getDataPath() : null;
  });
  ipcMain.handle("path:getUserDataPath", () => {
    const { getPathManager } = require("./modules/path-manager");
    const pathManager = getPathManager();
    return pathManager ? pathManager.getUserDataPath() : null;
  });
  ipcMain.handle("path:isInstalledVersion", () => {
    const { getPathManager } = require("./modules/path-manager");
    const pathManager = getPathManager();
    return pathManager ? pathManager.isInstalledVersion() : false;
  });
  ipcMain.handle("system:setAutoStart", (_event, enabled) => {
    return ipcMain.emit("set-auto-start", event, enabled);
  });
  ipcMain.handle("system:getAutoStart", () => {
    const isInstalled = store.get("isInstalledVersion", false);
    const enabled = store.get("autoStartWindows", false);
    const loginItemSettings = app.getLoginItemSettings();
    return {
      enabled: enabled && loginItemSettings.openAtLogin,
      available: isInstalled
    };
  });
  ipcMain.handle("app:restart", () => {
    try {
      const isInstalled = isInstalledVersion();
      if (isInstalled) {
        debugManager.system("\u{1F504} Reiniciando aplicativo (vers\xE3o instalada)...");
        app.relaunch();
        app.exit(0);
      } else {
        debugManager.system("\u{1F504} Finalizando aplicativo (vers\xE3o portable)...");
        app.quit();
      }
    } catch (error) {
      debugManager.error("\u274C Erro ao reiniciar aplicativo:", error);
      throw error;
    }
  });
  module.exports = { mainWindow, store };
}, "require_main");
var main_default = require_main();
export {
  main_default as default
};
