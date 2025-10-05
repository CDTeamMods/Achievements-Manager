"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _require = require('electron'),
  BrowserWindow = _require.BrowserWindow;
var WindowManager = function () {
  function WindowManager(store) {
    _classCallCheck(this, WindowManager);
    this.store = store;
    this.windows = new Map();
  }
  return _createClass(WindowManager, [{
    key: "setupIPC",
    value: function setupIPC(ipcMain) {
      var _this = this;
      ipcMain.handle('window:minimize', function () {
        var focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.minimize();
        }
      });
      ipcMain.handle('window:maximize', function () {
        var focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          if (focusedWindow.isMaximized()) {
            focusedWindow.unmaximize();
          } else {
            focusedWindow.maximize();
          }
        }
      });
      ipcMain.handle('window:close', function () {
        var focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.close();
        }
      });
      ipcMain.handle('window:isMaximized', function () {
        var focusedWindow = BrowserWindow.getFocusedWindow();
        return focusedWindow ? focusedWindow.isMaximized() : false;
      });
      ipcMain.handle('window:setAlwaysOnTop', function (event, flag) {
        var focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.setAlwaysOnTop(flag);
          _this.store.set('window.alwaysOnTop', flag);
        }
      });
      ipcMain.handle('window:setOpacity', function (event, opacity) {
        var focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.setOpacity(opacity);
          _this.store.set('window.opacity', opacity);
        }
      });
      ipcMain.handle('window:getBounds', function () {
        var focusedWindow = BrowserWindow.getFocusedWindow();
        return focusedWindow ? focusedWindow.getBounds() : null;
      });
      ipcMain.handle('window:getDisplays', function () {
        var _require2 = require('electron'),
          screen = _require2.screen;
        return screen.getAllDisplays();
      });
    }
  }, {
    key: "createModal",
    value: function createModal() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var parent = BrowserWindow.getFocusedWindow();
      var modal = new BrowserWindow(_objectSpread({
        width: options.width || 600,
        height: options.height || 400,
        parent: parent,
        modal: true,
        frame: false,
        resizable: options.resizable || false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: options.preload
        }
      }, options));
      if (parent) {
        var parentBounds = parent.getBounds();
        var modalBounds = modal.getBounds();
        modal.setPosition(Math.round(parentBounds.x + (parentBounds.width - modalBounds.width) / 2), Math.round(parentBounds.y + (parentBounds.height - modalBounds.height) / 2));
      }
      return modal;
    }
  }, {
    key: "optimizeWindow",
    value: function optimizeWindow(window) {
      window.webContents.setBackgroundThrottling(false);
      window.webContents.session.setCache({
        maxSize: 100 * 1024 * 1024
      });
      window.webContents.on('dom-ready', function () {
        window.webContents.executeJavaScript("\n        // Preload de fontes cr\xEDticas\n        const fontPreloads = [\n          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'\n        ];\n        \n        fontPreloads.forEach(font => {\n          const link = document.createElement('link');\n          link.rel = 'preload';\n          link.as = 'style';\n          link.href = font;\n          document.head.appendChild(link);\n        });\n      ");
      });
    }
  }, {
    key: "saveWindowState",
    value: function saveWindowState(window, id) {
      var bounds = window.getBounds();
      var isMaximized = window.isMaximized();
      this.store.set("windows.".concat(id), {
        bounds: bounds,
        isMaximized: isMaximized,
        timestamp: Date.now()
      });
    }
  }, {
    key: "restoreWindowState",
    value: function restoreWindowState(window, id) {
      var state = this.store.get("windows.".concat(id));
      if (state) {
        window.setBounds(state.bounds);
        if (state.isMaximized) {
          window.maximize();
        }
      }
    }
  }]);
}();
function setupWindowManager(_x, _x2) {
  return _setupWindowManager.apply(this, arguments);
}
function _setupWindowManager() {
  _setupWindowManager = _asyncToGenerator(_regenerator().m(function _callee(ipcMain, store) {
    var windowManager;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          windowManager = new WindowManager(store);
          windowManager.setupIPC(ipcMain);
          return _context.a(2, windowManager);
      }
    }, _callee);
  }));
  return _setupWindowManager.apply(this, arguments);
}
module.exports = {
  WindowManager: WindowManager,
  setupWindowManager: setupWindowManager
};