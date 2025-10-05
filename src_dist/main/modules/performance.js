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
  app = _require.app;
var os = require('os');
var PerformanceManager = function () {
  function PerformanceManager(store) {
    _classCallCheck(this, PerformanceManager);
    this.store = store;
    this.metrics = {
      memoryUsage: [],
      cpuUsage: [],
      renderTimes: []
    };
    this.monitoringInterval = null;
    this.memoryCleanupInterval = null;
    this.memoryMonitoringInterval = null;
  }
  return _createClass(PerformanceManager, [{
    key: "initialize",
    value: function initialize() {
      this.setupAppOptimizations();
      this.setupMemoryManagement();
      this.setupCPUOptimizations();
    }
  }, {
    key: "setupAppOptimizations",
    value: function setupAppOptimizations() {
      var liteMode = this.store.get('liteMode', false);
      if (liteMode) {
        app.commandLine.appendSwitch('--disable-gpu');
        app.commandLine.appendSwitch('--disable-software-rasterizer');
        app.commandLine.appendSwitch('--disable-background-timer-throttling');
        app.commandLine.appendSwitch('--max_old_space_size=2048');
      } else {
        app.commandLine.appendSwitch('--enable-gpu-rasterization');
        app.commandLine.appendSwitch('--enable-zero-copy');
        app.commandLine.appendSwitch('--disable-background-timer-throttling');
        app.commandLine.appendSwitch('--disable-renderer-backgrounding');
        app.commandLine.appendSwitch('--disable-backgrounding-occluded-windows');
        app.commandLine.appendSwitch('--memory-pressure-off');
        app.commandLine.appendSwitch('--max_old_space_size=3072');
      }
      app.commandLine.appendSwitch('--aggressive-cache-discard');
    }
  }, {
    key: "setupMemoryManagement",
    value: function setupMemoryManagement() {
      var _this = this;
      this.memoryCleanupInterval = setInterval(function () {
        if (global.gc) {
          global.gc();
        }
        _this.cleanupUnusedResources();
      }, 30000);
      this.memoryMonitoringInterval = setInterval(function () {
        var memUsage = process.memoryUsage();
        _this.metrics.memoryUsage.push(_objectSpread({
          timestamp: Date.now()
        }, memUsage));
        if (_this.metrics.memoryUsage.length > 100) {
          _this.metrics.memoryUsage.shift();
        }
        var heapUsedMB = memUsage.heapUsed / 1024 / 1024;
        if (heapUsedMB > 500) {
          console.warn("\u26A0\uFE0F Alto uso de mem\xF3ria: ".concat(heapUsedMB.toFixed(2), "MB"));
          _this.forceGarbageCollection();
        }
      }, 5000);
    }
  }, {
    key: "setupCPUOptimizations",
    value: function setupCPUOptimizations() {
      var cpuCount = os.cpus().length;
      var liteMode = this.store.get('liteMode', false);
      var maxWorkers;
      if (liteMode) {
        maxWorkers = 2;
      } else {
        maxWorkers = Math.min(4, Math.max(2, Math.floor(cpuCount / 2)));
      }
      app.commandLine.appendSwitch('--max-workers', maxWorkers.toString());
    }
  }, {
    key: "forceGarbageCollection",
    value: function forceGarbageCollection() {
      if (global.gc) {
        global.gc();
        console.log('🧹 Garbage collection executado');
      }
    }
  }, {
    key: "cleanupUnusedResources",
    value: function cleanupUnusedResources() {
      var imageCache = this.store.get('cache.images', {});
      var now = Date.now();
      var maxAge = 24 * 60 * 60 * 1000;
      Object.keys(imageCache).forEach(function (key) {
        if (now - imageCache[key].timestamp > maxAge) {
          delete imageCache[key];
        }
      });
      this.store.set('cache.images', imageCache);
      var logs = this.store.get('logs', []);
      if (logs.length > 1000) {
        this.store.set('logs', logs.slice(-500));
      }
    }
  }, {
    key: "startMonitoring",
    value: function startMonitoring() {
      var _this2 = this;
      this.clearStoredMetrics();
      this.monitoringInterval = setInterval(function () {
        _this2.collectMetrics();
      }, 10000);
    }
  }, {
    key: "clearStoredMetrics",
    value: function clearStoredMetrics() {
      if (this.store.has('performance.metrics')) {
        this.store["delete"]('performance.metrics');
        console.log('🧹 Métricas antigas removidas do settings.json');
      }
    }
  }, {
    key: "collectMetrics",
    value: function collectMetrics() {
      var metrics = {
        timestamp: Date.now(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime(),
        platform: process.platform,
        arch: process.arch
      };
      console.log('📊 Métricas coletadas:', {
        memory: "".concat(Math.round(metrics.memory.heapUsed / 1024 / 1024), "MB"),
        uptime: "".concat(Math.round(metrics.uptime), "s")
      });
    }
  }, {
    key: "applyLiteMode",
    value: function applyLiteMode(enabled) {
      if (enabled) {
        app.commandLine.appendSwitch('--disable-gpu-compositing');
        app.commandLine.appendSwitch('--disable-software-rasterizer');
      }
    }
  }, {
    key: "setupIPC",
    value: function setupIPC(ipcMain) {
      var _this3 = this;
      ipcMain.handle('performance:getMetrics', function () {
        return {
          memory: process.memoryUsage(),
          cpu: process.cpuUsage(),
          uptime: process.uptime(),
          metrics: _this3.metrics || {},
          memoryUsage: _this3.metrics.memoryUsage || [],
          cpuUsage: _this3.metrics.cpuUsage || [],
          isLiteMode: _this3.store.get('liteMode', false)
        };
      });
      ipcMain.handle('performance:forceGC', function () {
        _this3.forceGarbageCollection();
        return {
          success: true
        };
      });
      ipcMain.handle('performance:cleanup', function () {
        _this3.cleanupUnusedResources();
        return {
          success: true
        };
      });
      ipcMain.handle('performance:setLiteMode', function (event, enabled) {
        _this3.applyLiteMode(enabled);
        _this3.store.set('liteMode', enabled);
        return {
          success: true
        };
      });
    }
  }, {
    key: "stopMonitoring",
    value: function stopMonitoring() {
      console.log('🧹 Limpando recursos do PerformanceManager...');
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
        this.monitoringInterval = null;
      }
      if (this.memoryCleanupInterval) {
        clearInterval(this.memoryCleanupInterval);
        this.memoryCleanupInterval = null;
      }
      if (this.memoryMonitoringInterval) {
        clearInterval(this.memoryMonitoringInterval);
        this.memoryMonitoringInterval = null;
      }
      console.log('✅ Recursos do PerformanceManager limpos');
    }
  }]);
}();
function setupPerformance(_x) {
  return _setupPerformance.apply(this, arguments);
}
function _setupPerformance() {
  _setupPerformance = _asyncToGenerator(_regenerator().m(function _callee(store) {
    var _require2, ipcMain, performanceManager;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _require2 = require('electron'), ipcMain = _require2.ipcMain;
          performanceManager = new PerformanceManager(store);
          performanceManager.initialize();
          performanceManager.setupIPC(ipcMain);
          return _context.a(2, performanceManager);
      }
    }, _callee);
  }));
  return _setupPerformance.apply(this, arguments);
}
module.exports = {
  PerformanceManager: PerformanceManager,
  setupPerformance: setupPerformance
};