"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _require = require('electron'),
  app = _require.app;
var path = require('path');
var os = require('os');
var _require2 = require('./debug-manager'),
  getDebugManager = _require2.getDebugManager;
var PathManager = function () {
  function PathManager() {
    _classCallCheck(this, PathManager);
    this.isInstalled = false;
    this.isDevelopment = false;
    this.userDataPath = null;
    this.dataPath = null;
    this.cachePath = null;
    this.initialized = false;
    this.debugManager = getDebugManager();
  }
  return _createClass(PathManager, [{
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              this.isDevelopment = !app.isPackaged && process.env.NODE_ENV === 'development';
              this.isInstalled = this.detectInstallationType();
              this.setupPaths();
              this.initialized = true;
              console.log('📁 Path Manager inicializado:');
              console.log("   Modo: ".concat(this.isDevelopment ? 'Desenvolvimento' : 'Produção'));
              console.log("   Tipo: ".concat(this.isInstalled ? 'Instalado' : 'Portable'));
              console.log("   UserData: ".concat(this.userDataPath));
              console.log("   Data: ".concat(this.dataPath));
              console.log("   Cache: ".concat(this.cachePath));
              return _context.a(2, true);
            case 1:
              _context.p = 1;
              _t = _context.v;
              this.debugManager.error('❌ Erro ao inicializar Path Manager:', _t);
              return _context.a(2, false);
          }
        }, _callee, this, [[0, 1]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }())
  }, {
    key: "detectInstallationType",
    value: function detectInstallationType() {
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
        console.warn('⚠️ Erro ao detectar tipo de instalação:', error);
        return false;
      }
    }
  }, {
    key: "setupPaths",
    value: function setupPaths() {
      if (this.isInstalled) {
        this.userDataPath = app.getPath('userData');
        this.dataPath = path.join(this.userDataPath, 'data');
        this.cachePath = path.join(this.userDataPath, 'Cache');
      } else {
        if (this.isDevelopment) {
          this.userDataPath = path.join(__dirname, '..', '..', '..');
          this.dataPath = path.join(__dirname, '..', '..', 'data');
          this.cachePath = path.join(__dirname, '..', '..', 'data', 'cache');
        } else {
          var execDir = path.dirname(process.execPath);
          this.userDataPath = execDir;
          this.dataPath = path.join(execDir, 'data');
          this.cachePath = path.join(execDir, 'data', 'cache');
        }
      }
    }
  }, {
    key: "getDataPath",
    value: function getDataPath() {
      if (!this.initialized) {
        throw new Error('PathManager não foi inicializado');
      }
      return this.dataPath;
    }
  }, {
    key: "getUserDataPath",
    value: function getUserDataPath() {
      if (!this.initialized) {
        throw new Error('PathManager não foi inicializado');
      }
      return this.userDataPath;
    }
  }, {
    key: "getCachePath",
    value: function getCachePath() {
      if (!this.initialized) {
        throw new Error('PathManager não foi inicializado');
      }
      return this.cachePath;
    }
  }, {
    key: "getPath",
    value: function getPath(subPath) {
      if (!this.initialized) {
        throw new Error('PathManager não foi inicializado');
      }
      return path.join(this.dataPath, subPath);
    }
  }, {
    key: "getPaths",
    value: function getPaths() {
      if (!this.initialized) {
        throw new Error('PathManager não foi inicializado');
      }
      return {
        data: this.dataPath,
        userData: this.userDataPath,
        backups: path.join(this.dataPath, 'backups'),
        cache: this.cachePath,
        logs: path.join(this.dataPath, 'logs'),
        games: path.join(this.dataPath, 'games'),
        achievements: path.join(this.dataPath, 'achievements'),
        settings: path.join(this.dataPath, 'settings'),
        exports: path.join(this.dataPath, 'exports'),
        imports: path.join(this.dataPath, 'imports'),
        temp: path.join(this.dataPath, 'temp'),
        gseSaves: path.join(this.dataPath, 'GSE Saves')
      };
    }
  }, {
    key: "isInstalledVersion",
    value: function isInstalledVersion() {
      return this.isInstalled;
    }
  }, {
    key: "isDevelopmentMode",
    value: function isDevelopmentMode() {
      return this.isDevelopment;
    }
  }, {
    key: "getInfo",
    value: function getInfo() {
      return {
        isInstalled: this.isInstalled,
        isDevelopment: this.isDevelopment,
        userDataPath: this.userDataPath,
        dataPath: this.dataPath,
        cachePath: this.cachePath,
        paths: this.getPaths()
      };
    }
  }]);
}();
var pathManager = null;
function setupPathManager() {
  return _setupPathManager.apply(this, arguments);
}
function _setupPathManager() {
  _setupPathManager = _asyncToGenerator(_regenerator().m(function _callee2() {
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          if (pathManager) {
            _context2.n = 1;
            break;
          }
          pathManager = new PathManager();
          _context2.n = 1;
          return pathManager.initialize();
        case 1:
          return _context2.a(2, pathManager);
      }
    }, _callee2);
  }));
  return _setupPathManager.apply(this, arguments);
}
function getPathManager() {
  if (!pathManager) {
    throw new Error('PathManager não foi inicializado. Chame setupPathManager() primeiro.');
  }
  return pathManager;
}
module.exports = {
  PathManager: PathManager,
  setupPathManager: setupPathManager,
  getPathManager: getPathManager
};