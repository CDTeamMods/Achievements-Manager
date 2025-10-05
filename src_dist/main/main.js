"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _require = require('./utils/encoding'),
  setupUTF8Encoding = _require.setupUTF8Encoding,
  setupConsoleUTF8 = _require.setupConsoleUTF8;
setupUTF8Encoding();
setupConsoleUTF8();
process.on('warning', function (warning) {
  if (warning.name === 'DeprecationWarning' || warning.message.includes('Autofill') || warning.message.includes('devtools') || warning.message.includes('protocol_client')) {
    return;
  }
  debugManager.warn('⚠️ Warning:', warning.message);
});
var _require2 = require('electron'),
  app = _require2.app,
  BrowserWindow = _require2.BrowserWindow,
  ipcMain = _require2.ipcMain,
  shell = _require2.shell,
  dialog = _require2.dialog,
  nativeTheme = _require2.nativeTheme,
  Tray = _require2.Tray,
  Menu = _require2.Menu;
app.commandLine.appendSwitch('--disable-features', 'AutofillServerCommunication,AutofillCrowdsourcing,AutofillAssistant');
if (process.env.NODE_ENV !== 'development') {
  app.commandLine.appendSwitch('--disable-logging');
}
var path = require('path');
var Store = require('electron-store');
var fs = require('fs').promises;
var os = require('os');
var _require3 = require('./modules/debug-manager'),
  getDebugManager = _require3.getDebugManager;
var debugManager = getDebugManager();
var _require4 = require('./modules/i18n'),
  setupI18n = _require4.setupI18n;
var _require5 = require('./modules/filesystem'),
  setupFileSystem = _require5.setupFileSystem;
var _require6 = require('./modules/window-manager'),
  setupWindowManager = _require6.setupWindowManager;
var _require7 = require('./modules/performance'),
  setupPerformance = _require7.setupPerformance;
var _require8 = require('./modules/crash-reporter'),
  setupCrashReporter = _require8.setupCrashReporter;
var _require9 = require('./modules/gse-saves'),
  GSESavesManager = _require9.GSESavesManager;
var ConfigManager = require('./modules/config');
var _require0 = require('./modules/goldberg-migration'),
  GoldbergMigrationManager = _require0.GoldbergMigrationManager;
var _require1 = require('./modules/steam-integration'),
  SteamIntegrationManager = _require1.SteamIntegrationManager;
var SteamLocalGamesManager = require('./modules/steam-local-games');
var _require10 = require('./modules/path-manager'),
  setupPathManager = _require10.setupPathManager;
var _require11 = require('./modules/games'),
  setupGames = _require11.setupGames;
var _require12 = require('./modules/achievements'),
  setupAchievements = _require12.setupAchievements;
process.on('uncaughtException', function (error) {
  debugManager.error('Erro crítico não tratado:', error);
  process.exit(1);
});
process.on('unhandledRejection', function (reason, promise) {
  if (reason && reason.message && reason.message.includes('could not be cloned')) {
    if (debugManager && debugManager.isEnabled()) {
      debugManager.ipc('PROMISE REJECTION - ERRO DE CLONAGEM:', reason, promise, new Date().toISOString());
    }
  }
});
process.on('warning', function (warning) {
  if (warning.message && (warning.message.includes('could not be cloned') || warning.message.includes('IpcRendererInternal') || warning.message.includes('structuredClone'))) {
    if (debugManager && debugManager.isEnabled()) {
      debugManager.ipc('WARNING IPC DETECTADO:', warning.name, warning.message, warning.stack, new Date().toISOString());
    }
  }
});
function setupWebContentsInterceptor() {
  debugManager.log('[DEBUG] Interceptador de webContents será configurado via web-contents-created');
}
var isDev = process.env.NODE_ENV === 'development';
function isInstalledVersion() {
  try {
    var appPath = app.getAppPath();
    var execPath = process.execPath;
    var installPaths = ['Program Files', 'Program Files (x86)', 'AppData\\Local\\Programs'];
    var isInInstallPath = installPaths.some(function (installPath) {
      return execPath.includes(installPath) || appPath.includes(installPath);
    });
    var isPortable = execPath.includes('portable') || appPath.includes('portable') || execPath.includes(os.homedir()) || execPath.includes('Desktop');
    return isInInstallPath && !isPortable;
  } catch (error) {
    debugManager.warn('Erro ao detectar tipo de instalação:', error);
    return false;
  }
}
var store = null;
var mainWindow;
var splashWindow;
var tray = null;
var performanceManager = null;
var gamesManager = null;
var achievementsManager = null;
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
  var liteMode = store.get('liteMode', false);
  var splashUrl = "file://".concat(path.join(__dirname, '../renderer/splash.html'), "?liteMode=").concat(liteMode);
  splashWindow.loadURL(splashUrl);
  splashWindow.on('closed', function () {
    splashWindow = null;
  });
}
function createMainWindow() {
  var bounds = store.get('windowBounds');
  var preloadPath = path.join(__dirname, '../preload/preload.js');
  debugManager.log('🔧 Caminho do preload:', preloadPath);
  debugManager.log('🔧 Preload existe:', require('fs').existsSync(preloadPath));
  mainWindow = new BrowserWindow(_objectSpread(_objectSpread({}, bounds), {}, {
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: preloadPath,
      webSecurity: true,
      sandbox: false,
      devTools: isDev
    },
    frame: false,
    resizable: true,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true
  }, process.platform === 'win32' && {
    titleBarStyle: 'hidden'
  }));
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')["catch"](function (err) {
      debugManager.error('❌ Erro ao carregar servidor de desenvolvimento:', err);
      debugManager.log('🔄 Tentando carregar arquivo estático como fallback...');
      mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
  setupWindowEvents();
  mainWindow.once('ready-to-show', function () {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools({
        mode: 'detach'
      });
    }
  });
  mainWindow.on('enter-full-screen', function () {
    if (isDev) {
      mainWindow.webContents.executeJavaScript("\n        const devToolsIndicator = document.querySelector('.devtools-indicator');\n        if (devToolsIndicator) {\n          devToolsIndicator.style.display = 'none';\n        }\n        \n        // Adicionar CSS para ocultar qualquer indicador do DevTools\n        const style = document.createElement('style');\n        style.textContent = `\n          .devtools-indicator,\n          [class*=\"devtools\"],\n          [id*=\"devtools\"] {\n            display: none !important;\n            visibility: hidden !important;\n          }\n        `;\n        document.head.appendChild(style);\n      ");
    }
  });
  mainWindow.on('leave-full-screen', function () {
    if (isDev) {
      mainWindow.webContents.executeJavaScript("\n        const devToolsIndicator = document.querySelector('.devtools-indicator');\n        if (devToolsIndicator) {\n          devToolsIndicator.style.display = '';\n        }\n      ");
    }
  });
  if (isDev) {
    mainWindow.webContents.on('did-fail-load', function (event, errorCode, errorDescription, validatedURL) {
      if (validatedURL.includes('localhost:3000')) {
        debugManager.warn('⚠️ Servidor de desenvolvimento não disponível, usando arquivo estático');
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
      }
    });
    mainWindow.webContents.on('did-finish-load', function () {
      debugManager.log('✅ Página carregada com sucesso');
    });
  }
  mainWindow.webContents.on('dom-ready', function () {
    if (store.get('liteMode')) {
      mainWindow.webContents.insertCSS("\n        * {\n          animation-duration: 0s !important;\n          transition-duration: 0s !important;\n        }\n      ");
    }
  });
}
function setupWindowEvents() {
  mainWindow.on('resize', function () {
    store.set('windowBounds', mainWindow.getBounds());
  });
  mainWindow.on('move', function () {
    store.set('windowBounds', mainWindow.getBounds());
  });
  mainWindow.on('close', function (event) {
    var minimizeToTray = store.get('minimizeToTray', false);
    if (minimizeToTray && tray && !app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    } else if (process.platform !== 'darwin') {
      app.quit();
    } else {
      event.preventDefault();
      mainWindow.hide();
    }
  });
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.webContents.on('will-navigate', function (event, navigationUrl) {
    var parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'file://') {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });
  mainWindow.webContents.session.webRequest.onBeforeRequest(function (details, callback) {
    if (!isDev && details.url.includes('devtools')) {
      callback({
        cancel: true
      });
    } else {
      callback({});
    }
  });
}
function setupSystemTheme() {
  var theme = store.get('theme', 'auto');
  if (theme === 'auto') {
    nativeTheme.themeSource = 'system';
  } else {
    nativeTheme.themeSource = theme;
  }
  nativeTheme.on('updated', function () {
    if (mainWindow && !mainWindow.isDestroyed()) {
      try {
        debugManager.log('🎨 [THEME] Mudança de tema detectada, preparando envio...');
        var systemTheme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
        var sanitizedThemeData = JSON.parse(JSON.stringify({
          shouldUseDarkColors: !!nativeTheme.shouldUseDarkColors,
          themeSource: (nativeTheme.themeSource || 'system').toString(),
          systemTheme: systemTheme.toString()
        }));
        try {
          structuredClone(sanitizedThemeData);
          structuredClone(systemTheme);
          debugManager.log('✅ [THEME] Dados verificados como clonáveis');
        } catch (cloneError) {
          debugManager.error('❌ [THEME] ERRO DE CLONAGEM detectado:', cloneError);
          debugManager.error('❌ [THEME] Dados problemáticos:', {
            sanitizedThemeData: sanitizedThemeData,
            systemTheme: systemTheme
          });
          return;
        }
        setTimeout(function () {
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
  ipcMain.handle('set-theme', function (event, theme) {
    try {
      nativeTheme.themeSource = theme;
      store.set('theme', theme);
      return {
        success: true
      };
    } catch (error) {
      debugManager.error('Erro ao definir tema:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });
  ipcMain.handle('get-theme', function () {
    return {
      current: String(nativeTheme.themeSource || 'system'),
      shouldUseDarkColors: Boolean(nativeTheme.shouldUseDarkColors)
    };
  });
  ipcMain.handle('theme:getSystemTheme', function () {
    return String(nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
  });
}
function setupAutoStart() {
  ipcMain.handle('set-auto-start', function (event, enabled) {
    try {
      var isInstalled = store.get('isInstalledVersion', false);
      if (!isInstalled) {
        return {
          success: false,
          error: 'Auto-start só está disponível na versão instalada'
        };
      }
      app.setLoginItemSettings({
        openAtLogin: enabled,
        openAsHidden: true,
        args: ['--hidden']
      });
      store.set('autoStartWindows', enabled);
      return {
        success: true
      };
    } catch (error) {
      debugManager.error('Erro ao configurar auto-start:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });
  ipcMain.handle('get-auto-start', function () {
    var isInstalled = store.get('isInstalledVersion', false);
    var enabled = store.get('autoStartWindows', false);
    var loginItemSettings = app.getLoginItemSettings();
    return {
      enabled: enabled && loginItemSettings.openAtLogin,
      available: isInstalled
    };
  });
}
function createTray() {
  try {
    var iconPath = path.join(__dirname, '../../assets/icons/icon.ico');
    tray = new Tray(iconPath);
    var contextMenu = Menu.buildFromTemplate([{
      label: 'Mostrar Achievements Manager',
      click: function click() {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    }, {
      label: 'Sair',
      click: function click() {
        app.isQuiting = true;
        app.quit();
      }
    }]);
    tray.setToolTip('Achievements Manager');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', function () {
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
function setupMinimizeToTray() {
  ipcMain.handle('set-minimize-to-tray', function (event, enabled) {
    try {
      var isInstalled = store.get('isInstalledVersion', false);
      if (!isInstalled) {
        return {
          success: false,
          error: 'Minimizar para bandeja só está disponível na versão instalada'
        };
      }
      store.set('minimizeToTray', enabled);
      if (enabled && !tray) {
        createTray();
      } else if (!enabled && tray) {
        tray.destroy();
        tray = null;
      }
      return {
        success: true
      };
    } catch (error) {
      debugManager.error('Erro ao configurar minimizar para tray:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });
  ipcMain.handle('get-minimize-to-tray', function (event) {
    var isInstalled = store.get('isInstalledVersion', false);
    var enabled = store.get('minimizeToTray', false);
    return {
      enabled: enabled,
      available: isInstalled
    };
  });
}
function protectCriticalSettings(store, pathManager) {
  try {
    if (!pathManager || pathManager.isInstalledVersion()) {
      return;
    }
    var needsCorrection = false;
    var criticalSettings = {
      isInstalledVersion: false
    };
    for (var _i = 0, _Object$entries = Object.entries(criticalSettings); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        safeValue = _Object$entries$_i[1];
      var currentValue = store.get(key);
      if (currentValue !== safeValue) {
        console.warn("\uD83D\uDEE1\uFE0F Prote\xE7\xE3o ativada: Corrigindo ".concat(key, " de \"").concat(currentValue, "\" para \"").concat(safeValue, "\""));
        store.set(key, safeValue);
        needsCorrection = true;
      }
    }
    var steamPath = store.get('steamPath');
    var userDataPath = store.get('userDataPath');
    if (steamPath !== undefined) {
      console.warn("\uD83D\uDEE1\uFE0F Prote\xE7\xE3o ativada: Removendo steamPath customizado em modo portable");
      store["delete"]('steamPath');
      needsCorrection = true;
    }
    if (userDataPath !== undefined) {
      console.warn("\uD83D\uDEE1\uFE0F Prote\xE7\xE3o ativada: Removendo userDataPath customizado em modo portable");
      store["delete"]('userDataPath');
      needsCorrection = true;
    }
    if (needsCorrection) {
      console.log('🛡️ Configurações críticas protegidas e corrigidas automaticamente');
    }
  } catch (error) {
    console.error('❌ Erro ao proteger configurações críticas:', error);
  }
}
function initializeApp() {
  return _initializeApp.apply(this, arguments);
}
function _initializeApp() {
  _initializeApp = _asyncToGenerator(_regenerator().m(function _callee2() {
    var pathManager, isInstalled, _Store, settingsPath, configManager, filesystemManager, gseSavesManager, goldbergMigrationManager, steamIntegration, steamLocalGames, shouldStartHidden, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          debugManager.info('🚀 Initializing Achievements Manager...');
          _context2.n = 1;
          return setupPathManager();
        case 1:
          pathManager = _context2.v;
          isInstalled = pathManager.isInstalledVersion();
          _context2.n = 2;
          return Promise.resolve().then(function () {
            return _interopRequireWildcard(require('electron-store'));
          });
        case 2:
          _Store = _context2.v["default"];
          settingsPath = isInstalled ? pathManager.getUserDataPath() : pathManager.getPaths().settings;
          store = new _Store({
            name: 'app',
            cwd: settingsPath,
            defaults: {
              setupComplete: false,
              windowBounds: {
                width: 1024,
                height: 768
              },
              theme: 'auto',
              language: 'en',
              liteMode: false,
              apiSource: 'steam',
              isInstalledVersion: isInstalled,
              autoStartWindows: false,
              minimizeToTray: false,
              performance: {
                enableVirtualScrolling: true,
                enableLazyLoading: true,
                showTooltips: true,
                autoSync: true,
                cacheSize: 100
              }
            }
          });
          protectCriticalSettings(store, pathManager);
          _context2.n = 3;
          return setupCrashReporter();
        case 3:
          configManager = new ConfigManager();
          _context2.n = 4;
          return configManager.init(pathManager.getUserDataPath());
        case 4:
          _context2.n = 5;
          return configManager.initializeDefaultConfigs();
        case 5:
          _context2.n = 6;
          return setupI18n(pathManager);
        case 6:
          _context2.n = 7;
          return setupFileSystem(store, pathManager, global.crashReporter, configManager);
        case 7:
          filesystemManager = _context2.v;
          _context2.n = 8;
          return setupWindowManager(ipcMain, store);
        case 8:
          _context2.n = 9;
          return setupPerformance(store);
        case 9:
          performanceManager = _context2.v;
          gseSavesManager = new GSESavesManager(pathManager, debugManager);
          _context2.n = 10;
          return gseSavesManager.initialize();
        case 10:
          goldbergMigrationManager = new GoldbergMigrationManager(global.crashReporter, pathManager);
          _context2.n = 11;
          return goldbergMigrationManager.initialize();
        case 11:
          steamIntegration = new SteamIntegrationManager(pathManager, configManager, debugManager);
          global.steamIntegrationManager = steamIntegration;
          debugManager.info('✅ Steam Integration Manager inicializado');
          steamLocalGames = new SteamLocalGamesManager(debugManager, global.crashReporter);
          global.steamLocalGamesManager = steamLocalGames;
          debugManager.info('✅ Steam Local Games Manager inicializado');
          gamesManager = setupGames(configManager, global.crashReporter);
          achievementsManager = setupAchievements(configManager, global.crashReporter);
          setupSystemTheme();
          setupAutoStart();
          setupMinimizeToTray();
          shouldStartHidden = process.argv.includes('--hidden') || store.get('autoStartWindows', false);
          if (store.get('minimizeToTray', false)) {
            createTray();
          }
          if (!shouldStartHidden) {
            createSplashWindow();
          }
          setTimeout(function () {
            createMainWindow();
          }, 1500);
          _context2.n = 13;
          break;
        case 12:
          _context2.p = 12;
          _t = _context2.v;
          debugManager.error('❌ Erro na inicialização:', _t);
          dialog.showErrorBox('Erro de Inicialização', "Falha ao inicializar a aplica\xE7\xE3o: ".concat(_t.message));
          app.quit();
        case 13:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 12]]);
  }));
  return _initializeApp.apply(this, arguments);
}
app.whenReady().then(initializeApp);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
app.on('before-quit', function () {
  var _ref = _asyncToGenerator(_regenerator().m(function _callee(event) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          app.isQuitting = true;
          debugManager.log('🔄 Iniciando processo de cleanup...');
          try {
            if (tray && !tray.isDestroyed()) {
              debugManager.log('🧹 Limpando tray...');
              tray.destroy();
            }
            if (splashWindow && !splashWindow.isDestroyed()) {
              debugManager.log('🧹 Limpando splash window...');
              splashWindow.close();
              splashWindow = null;
            }
            debugManager.log('✅ Cleanup concluído com sucesso!');
          } catch (error) {
            debugManager.error('❌ Erro durante cleanup:', error);
          }
        case 1:
          return _context.a(2);
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
app.on('web-contents-created', function (event, contents) {
  contents.on('new-window', function (event, navigationUrl) {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
  contents.once('dom-ready', function () {
    if (isDev) {
      contents.executeJavaScript("\n        const originalError = console.error;\n        console.error = function(...args) {\n          const message = args.join(' ');\n          if (message.includes('Autofill.enable') || \n              message.includes('Autofill.setAddresses') ||\n              message.includes('protocol_client')) {\n            return; // Suprimir esses erros espec\xEDficos\n          }\n          originalError.apply(console, args);\n        };\n      ");
    }
  });
});
ipcMain.handle('debug:log', function (event) {
  if (debugManager) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    debugManager.log.apply(debugManager, args);
  }
});
ipcMain.handle('debug:error', function (event) {
  if (debugManager) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    debugManager.error.apply(debugManager, args);
  }
});
ipcMain.handle('debug:warn', function (event) {
  if (debugManager) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    debugManager.warn.apply(debugManager, args);
  }
});
ipcMain.handle('app:getVersion', function () {
  return app.getVersion();
});
ipcMain.handle('app:getPlatform', function () {
  return process.platform;
});
ipcMain.handle('app:getPath', function (event, name) {
  return app.getPath(name);
});
ipcMain.handle('system:getVersion', function () {
  return app.getVersion();
});
ipcMain.handle('system:getPlatform', function () {
  return process.platform;
});
ipcMain.handle('system:getSystemInfo', function () {
  return {
    platform: process.platform,
    arch: process.arch,
    version: app.getVersion(),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node
  };
});
ipcMain.handle('system:openExternal', function (event, url) {
  return shell.openExternal(url);
});
ipcMain.handle('system:showInFolder', function (event, path) {
  return shell.showItemInFolder(path);
});
ipcMain.handle('system:quit', function () {
  return app.quit();
});
ipcMain.handle('system:minimize', function () {
  var focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) focusedWindow.minimize();
});
ipcMain.handle('system:maximize', function () {
  var focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    if (focusedWindow.isMaximized()) {
      focusedWindow.unmaximize();
    } else {
      focusedWindow.maximize();
    }
  }
});
ipcMain.handle('system:unmaximize', function () {
  var focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) focusedWindow.unmaximize();
});
ipcMain.handle('system:isMaximized', function () {
  var focusedWindow = BrowserWindow.getFocusedWindow();
  return focusedWindow ? focusedWindow.isMaximized() : false;
});
ipcMain.handle('system:close', function () {
  var focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) focusedWindow.close();
});
ipcMain.handle('system:isInstalledVersion', function () {
  return isInstalledVersion();
});
ipcMain.handle('system:isDevelopmentMode', function () {
  return isDev;
});
ipcMain.handle('path:getDataPath', function () {
  var _require13 = require('./modules/path-manager'),
    getPathManager = _require13.getPathManager;
  var pathManager = getPathManager();
  return pathManager ? pathManager.getDataPath() : null;
});
ipcMain.handle('path:getUserDataPath', function () {
  var _require14 = require('./modules/path-manager'),
    getPathManager = _require14.getPathManager;
  var pathManager = getPathManager();
  return pathManager ? pathManager.getUserDataPath() : null;
});
ipcMain.handle('path:isInstalledVersion', function () {
  var _require15 = require('./modules/path-manager'),
    getPathManager = _require15.getPathManager;
  var pathManager = getPathManager();
  return pathManager ? pathManager.isInstalledVersion() : false;
});
ipcMain.handle('system:setAutoStart', function (event, enabled) {
  return ipcMain.emit('set-auto-start', event, enabled);
});
ipcMain.handle('system:getAutoStart', function () {
  var isInstalled = store.get('isInstalledVersion', false);
  var enabled = store.get('autoStartWindows', false);
  var loginItemSettings = app.getLoginItemSettings();
  return {
    enabled: enabled && loginItemSettings.openAtLogin,
    available: isInstalled
  };
});
ipcMain.handle('system:setMinimizeToTray', function (event, enabled) {
  try {
    var isInstalled = store.get('isInstalledVersion', false);
    if (!isInstalled) {
      return {
        success: false,
        error: 'Minimizar para bandeja só está disponível na versão instalada'
      };
    }
    store.set('minimizeToTray', enabled);
    if (enabled && !tray) {
      createTray();
    } else if (!enabled && tray) {
      tray.destroy();
      tray = null;
    }
    return {
      success: true
    };
  } catch (error) {
    debugManager.error('Erro ao configurar minimizar para tray:', error);
    return {
      success: false,
      error: error.message
    };
  }
});
ipcMain.handle('system:getMinimizeToTray', function () {
  var isInstalled = store.get('isInstalledVersion', false);
  var enabled = store.get('minimizeToTray', false);
  return {
    enabled: enabled,
    available: isInstalled
  };
});
ipcMain.handle('app:restart', function () {
  try {
    var isInstalled = isInstalledVersion();
    if (isInstalled) {
      debugManager.system('🔄 Reiniciando aplicativo (versão instalada)...');
      app.relaunch();
      app.exit(0);
    } else {
      debugManager.system('🔄 Finalizando aplicativo (versão portable)...');
      app.quit();
    }
  } catch (error) {
    debugManager.error('❌ Erro ao reiniciar aplicativo:', error);
    throw error;
  }
});
module.exports = {
  mainWindow: mainWindow,
  store: store
};