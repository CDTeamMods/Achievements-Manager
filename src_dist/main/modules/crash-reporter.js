"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
  app = _require.app,
  ipcMain = _require.ipcMain;
var fs = require('fs').promises;
var path = require('path');
var os = require('os');
var _require2 = require('./debug-manager'),
  getDebugManager = _require2.getDebugManager;
var CrashReporter = function () {
  function CrashReporter() {
    _classCallCheck(this, CrashReporter);
    this.appName = 'Achievements Manager';
    this.appDataPath = null;
    this.crashReportsPath = null;
    this.maxCrashFiles = 10;
    this.maxFileAge = 30 * 24 * 60 * 60 * 1000;
    this.initialized = false;
    this.debug = getDebugManager();
  }
  return _createClass(CrashReporter, [{
    key: "initializeAppDataPath",
    value: function initializeAppDataPath() {
      if (!this.appDataPath) {
        try {
          if (app && app.getPath) {
            var userDataPath = app.getPath('userData');
            if (userDataPath) {
              this.appDataPath = path.join(path.dirname(userDataPath), this.appName.replace(/\s+/g, '-'));
              this.crashReportsPath = path.join(this.appDataPath, 'Crash-Reports');
              return this.appDataPath;
            }
          }
          throw new Error('Electron app not ready, using fallback');
        } catch (error) {
          var tempDir = os.tmpdir();
          var appNameSafe = this.appName.replace(/\s+/g, '-').toLowerCase();
          this.appDataPath = path.join(tempDir, appNameSafe);
          this.crashReportsPath = path.join(this.appDataPath, 'Crash-Reports');
        }
      }
      return this.appDataPath;
    }
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!this.initialized) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              _context.p = 1;
              this.getAppDataPath();
              _context.n = 2;
              return this.createDirectories();
            case 2:
              this.setupErrorHandlers();
              this.setupIPC();
              _context.n = 3;
              return this.cleanOldCrashFiles();
            case 3:
              this.initialized = true;
              _context.n = 5;
              break;
            case 4:
              _context.p = 4;
              _t = _context.v;
              this.debug.error('Error initializing Crash Reporter:', _t);
            case 5:
              return _context.a(2);
          }
        }, _callee, this, [[1, 4]]);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }, {
    key: "createDirectories",
    value: function () {
      var _createDirectories = _asyncToGenerator(_regenerator().m(function _callee2() {
        var subFolders, _i, _subFolders, folder, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              if (!(!this.appDataPath || !this.crashReportsPath)) {
                _context2.n = 1;
                break;
              }
              this.initializeAppDataPath();
              if (!(!this.appDataPath || !this.crashReportsPath)) {
                _context2.n = 1;
                break;
              }
              throw new Error('Failed to initialize crash reporter paths');
            case 1:
              _context2.n = 2;
              return fs.mkdir(this.appDataPath, {
                recursive: true
              });
            case 2:
              _context2.n = 3;
              return fs.mkdir(this.crashReportsPath, {
                recursive: true
              });
            case 3:
              subFolders = ['logs', 'cache'];
              _i = 0, _subFolders = subFolders;
            case 4:
              if (!(_i < _subFolders.length)) {
                _context2.n = 6;
                break;
              }
              folder = _subFolders[_i];
              _context2.n = 5;
              return fs.mkdir(path.join(this.appDataPath, folder), {
                recursive: true
              });
            case 5:
              _i++;
              _context2.n = 4;
              break;
            case 6:
              _context2.n = 8;
              break;
            case 7:
              _context2.p = 7;
              _t2 = _context2.v;
              this.debug.error('Error creating directories:', _t2);
              throw _t2;
            case 8:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 7]]);
      }));
      function createDirectories() {
        return _createDirectories.apply(this, arguments);
      }
      return createDirectories;
    }()
  }, {
    key: "setupErrorHandlers",
    value: function setupErrorHandlers() {
      var _this = this;
      process.on('uncaughtException', function (error) {
        _this.reportCrash('uncaughtException', error);
      });
      process.on('unhandledRejection', function (reason, promise) {
        var promiseContext = {
          type: 'Promise',
          state: 'unknown',
          hasValue: false,
          hasReason: false
        };
        try {
          if (promise) {
            var _promise$constructor;
            promiseContext.constructor = ((_promise$constructor = promise.constructor) === null || _promise$constructor === void 0 ? void 0 : _promise$constructor.name) || 'Promise';
            if (promise.then && typeof promise.then === 'function') {
              promiseContext.hasValue = true;
              promiseContext.state = 'pending or resolved';
            }
            if (promise.stack) {
              promiseContext.stack = promise.stack.split('\n').slice(0, 3).join('\n');
            }
            if (promise.reason) {
              promiseContext.hasReason = true;
              promiseContext.reasonType = _typeof(promise.reason);
            }
          }
        } catch (e) {
          promiseContext = {
            type: 'Promise',
            error: 'Failed to extract promise info: ' + e.message
          };
        }
        if (reason && reason.message && (reason.message.includes('could not be cloned') || reason.message.includes('IpcRendererInternal.send') || reason.message.includes('An object could not be cloned'))) {
          _this.debug.ipc('Erro de clonagem IPC ignorado (main)', reason.message);
          return;
        }
        if (reason && reason.stack && (reason.stack.includes('IpcRendererInternal.send') || reason.stack.includes('could not be cloned'))) {
          _this.debug.ipc('Erro de clonagem IPC ignorado (main stack)', reason.stack);
          return;
        }
        _this.reportCrash('unhandledRejection', reason, {
          promiseInfo: promiseContext
        });
      });
      process.on('warning', function (warning) {
        _this.reportWarning(warning);
      });
    }
  }, {
    key: "sanitizeErrorData",
    value: function sanitizeErrorData(errorData) {
      var _sanitize = function sanitize(obj) {
        var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var seen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new WeakSet();
        if (depth > 10) return '[Max Depth Reached]';
        if (obj && _typeof(obj) === 'object' && seen.has(obj)) {
          return '[Circular Reference]';
        }
        if (obj === null || _typeof(obj) !== 'object') {
          return obj;
        }
        seen.add(obj);
        if (Array.isArray(obj)) {
          return obj.map(function (item) {
            return _sanitize(item, depth + 1, seen);
          });
        }
        var sanitized = {};
        for (var _i2 = 0, _Object$entries = Object.entries(obj); _i2 < _Object$entries.length; _i2++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];
          try {
            if (typeof value === 'function') {
              sanitized[key] = '[Function]';
            } else if (value instanceof Promise) {
              var _value$constructor;
              sanitized[key] = {
                type: 'Promise',
                constructor: ((_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name) || 'Promise',
                state: 'unknown'
              };
            } else if (value && _typeof(value) === 'object' && value.then && typeof value.then === 'function') {
              var _value$constructor2;
              sanitized[key] = {
                type: 'Thenable',
                constructor: ((_value$constructor2 = value.constructor) === null || _value$constructor2 === void 0 ? void 0 : _value$constructor2.name) || 'Unknown',
                hasValue: !!value.value,
                hasReason: !!value.reason
              };
            } else if (value instanceof Node) {
              sanitized[key] = '[DOM Node]';
            } else if (value instanceof Window) {
              sanitized[key] = '[Window Object]';
            } else if (value instanceof HTMLElement) {
              sanitized[key] = '[HTML Element]';
            } else if (key === 'target' && value && value.tagName) {
              sanitized[key] = "[".concat(value.tagName, " Element]");
            } else {
              sanitized[key] = _sanitize(value, depth + 1, seen);
            }
          } catch (error) {
            sanitized[key] = "[Sanitization Error: ".concat(error.message, "]");
          }
        }
        return sanitized;
      };
      try {
        return _sanitize(errorData);
      } catch (error) {
        return {
          error: {
            name: 'SanitizationFailure',
            message: 'Could not sanitize error data',
            stack: error.stack || 'No stack available'
          },
          context: {
            sanitizationError: error.message,
            originalDataType: _typeof(errorData)
          }
        };
      }
    }
  }, {
    key: "setupIPC",
    value: function setupIPC() {
      var _this2 = this;
      ipcMain.handle('crash-reporter:report-error', function () {
        var _ref = _asyncToGenerator(_regenerator().m(function _callee3(event, errorData) {
          var sanitizedErrorData, fallbackError, fallbackContext, _t3;
          return _regenerator().w(function (_context3) {
            while (1) switch (_context3.p = _context3.n) {
              case 0:
                _context3.p = 0;
                sanitizedErrorData = _this2.sanitizeErrorData(errorData);
                _context3.n = 1;
                return _this2.reportCrash('renderer-error', sanitizedErrorData.error, sanitizedErrorData.context);
              case 1:
                return _context3.a(2, _context3.v);
              case 2:
                _context3.p = 2;
                _t3 = _context3.v;
                _this2.debug.error('Error sanitizing crash report data:', _t3);
                fallbackError = {
                  name: 'SanitizationError',
                  message: 'Failed to sanitize error data',
                  stack: _t3.stack || 'No stack available'
                };
                fallbackContext = {
                  originalErrorType: _typeof(errorData),
                  sanitizationError: _t3.message
                };
                _context3.n = 3;
                return _this2.reportCrash('renderer-error', fallbackError, fallbackContext);
              case 3:
                return _context3.a(2, _context3.v);
            }
          }, _callee3, null, [[0, 2]]);
        }));
        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
      ipcMain.handle('crash-reporter:get-stats', _asyncToGenerator(_regenerator().m(function _callee4() {
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return _this2.getCrashStats();
            case 1:
              return _context4.a(2, _context4.v);
          }
        }, _callee4);
      })));
      ipcMain.handle('crash-reporter:clear-reports', _asyncToGenerator(_regenerator().m(function _callee5() {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              _context5.n = 1;
              return _this2.clearCrashReports();
            case 1:
              return _context5.a(2, _context5.v);
          }
        }, _callee5);
      })));
      ipcMain.handle('crash-reporter:get-crash-list', _asyncToGenerator(_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return _this2.getCrashList();
            case 1:
              return _context6.a(2, _context6.v);
          }
        }, _callee6);
      })));
    }
  }, {
    key: "reportCrash",
    value: function () {
      var _reportCrash = _asyncToGenerator(_regenerator().m(function _callee7(type, error) {
        var context,
          timestamp,
          crashId,
          crashData,
          fileName,
          filePath,
          _args7 = arguments,
          _t4;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              context = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : {};
              _context7.p = 1;
              timestamp = new Date().toISOString();
              crashId = this.generateCrashId();
              crashData = {
                id: crashId,
                timestamp: timestamp,
                type: type,
                error: {
                  name: error.name || 'Unknown Error',
                  message: error.message || error.toString(),
                  stack: error.stack || 'No stack trace available'
                },
                context: context,
                system: {
                  platform: os.platform(),
                  arch: os.arch(),
                  nodeVersion: process.version,
                  electronVersion: process.versions.electron,
                  appVersion: app.getVersion(),
                  totalMemory: os.totalmem(),
                  freeMemory: os.freemem(),
                  uptime: os.uptime()
                },
                app: {
                  uptime: process.uptime(),
                  pid: process.pid,
                  cwd: process.cwd(),
                  argv: process.argv
                }
              };
              fileName = "crash_".concat(crashId, "_").concat(timestamp.replace(/[:.]/g, '-'), ".log");
              filePath = path.join(this.crashReportsPath, fileName);
              _context7.n = 2;
              return fs.writeFile(filePath, JSON.stringify(crashData, null, 2), 'utf8');
            case 2:
              this.debug.crash("Crash reported: ".concat(fileName));
              this.debug.crash('Error details', error);
              return _context7.a(2, crashId);
            case 3:
              _context7.p = 3;
              _t4 = _context7.v;
              this.debug.error('Error reporting crash', _t4);
              return _context7.a(2, null);
          }
        }, _callee7, this, [[1, 3]]);
      }));
      function reportCrash(_x3, _x4) {
        return _reportCrash.apply(this, arguments);
      }
      return reportCrash;
    }()
  }, {
    key: "reportWarning",
    value: function () {
      var _reportWarning = _asyncToGenerator(_regenerator().m(function _callee8(warning) {
        var timestamp, warningId, warningData, fileName, filePath, _t5;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              timestamp = new Date().toISOString();
              warningId = this.generateCrashId();
              warningData = {
                id: warningId,
                timestamp: timestamp,
                type: 'warning',
                warning: {
                  name: warning.name,
                  message: warning.message,
                  stack: warning.stack
                },
                system: {
                  platform: os.platform(),
                  nodeVersion: process.version,
                  electronVersion: process.versions.electron
                }
              };
              fileName = "warning_".concat(warningId, "_").concat(timestamp.replace(/[:.]/g, '-'), ".log");
              filePath = path.join(this.crashReportsPath, fileName);
              _context8.n = 1;
              return fs.writeFile(filePath, JSON.stringify(warningData, null, 2), 'utf8');
            case 1:
              this.debug.warn("Warning reported: ".concat(fileName));
              _context8.n = 3;
              break;
            case 2:
              _context8.p = 2;
              _t5 = _context8.v;
              this.debug.error('Error reporting warning:', _t5);
            case 3:
              return _context8.a(2);
          }
        }, _callee8, this, [[0, 2]]);
      }));
      function reportWarning(_x5) {
        return _reportWarning.apply(this, arguments);
      }
      return reportWarning;
    }()
  }, {
    key: "generateCrashId",
    value: function generateCrashId() {
      return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
  }, {
    key: "getCrashStats",
    value: function () {
      var _getCrashStats = _asyncToGenerator(_regenerator().m(function _callee9() {
        var files, crashFiles, warningFiles, stats, sortedCrashes, lastCrashFile, lastCrashData, _iterator, _step, file, filePath, crashData, type, _t6, _t7, _t8, _t9, _t0, _t1;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              _context9.n = 1;
              return fs.readdir(this.crashReportsPath);
            case 1:
              files = _context9.v;
              crashFiles = files.filter(function (file) {
                return file.startsWith('crash_');
              });
              warningFiles = files.filter(function (file) {
                return file.startsWith('warning_');
              });
              stats = {
                totalCrashes: crashFiles.length,
                totalWarnings: warningFiles.length,
                totalReports: files.length,
                crashReportsPath: this.crashReportsPath,
                lastCrash: null,
                crashTypes: {}
              };
              if (!(crashFiles.length > 0)) {
                _context9.n = 15;
                break;
              }
              sortedCrashes = crashFiles.sort().reverse();
              lastCrashFile = path.join(this.crashReportsPath, sortedCrashes[0]);
              _context9.p = 2;
              _t6 = JSON;
              _context9.n = 3;
              return fs.readFile(lastCrashFile, 'utf8');
            case 3:
              lastCrashData = _t6.parse.call(_t6, _context9.v);
              stats.lastCrash = {
                timestamp: lastCrashData.timestamp,
                type: lastCrashData.type,
                error: lastCrashData.error.name
              };
              _context9.n = 5;
              break;
            case 4:
              _context9.p = 4;
              _t7 = _context9.v;
              this.debug.error('Error reading last crash file:', _t7);
            case 5:
              _iterator = _createForOfIteratorHelper(crashFiles.slice(0, 10));
              _context9.p = 6;
              _iterator.s();
            case 7:
              if ((_step = _iterator.n()).done) {
                _context9.n = 12;
                break;
              }
              file = _step.value;
              _context9.p = 8;
              filePath = path.join(this.crashReportsPath, file);
              _t8 = JSON;
              _context9.n = 9;
              return fs.readFile(filePath, 'utf8');
            case 9:
              crashData = _t8.parse.call(_t8, _context9.v);
              type = crashData.type || 'unknown';
              stats.crashTypes[type] = (stats.crashTypes[type] || 0) + 1;
              _context9.n = 11;
              break;
            case 10:
              _context9.p = 10;
              _t9 = _context9.v;
              this.debug.error("Error reading crash file ".concat(file, ":"), _t9);
            case 11:
              _context9.n = 7;
              break;
            case 12:
              _context9.n = 14;
              break;
            case 13:
              _context9.p = 13;
              _t0 = _context9.v;
              _iterator.e(_t0);
            case 14:
              _context9.p = 14;
              _iterator.f();
              return _context9.f(14);
            case 15:
              return _context9.a(2, stats);
            case 16:
              _context9.p = 16;
              _t1 = _context9.v;
              this.debug.error('Error getting crash stats:', _t1);
              return _context9.a(2, {
                totalCrashes: 0,
                totalWarnings: 0,
                totalReports: 0,
                crashReportsPath: this.crashReportsPath,
                lastCrash: null,
                crashTypes: {}
              });
          }
        }, _callee9, this, [[8, 10], [6, 13, 14, 15], [2, 4], [0, 16]]);
      }));
      function getCrashStats() {
        return _getCrashStats.apply(this, arguments);
      }
      return getCrashStats;
    }()
  }, {
    key: "getCrashList",
    value: function () {
      var _getCrashList = _asyncToGenerator(_regenerator().m(function _callee0() {
        var files, crashFiles, crashes, _iterator2, _step2, file, _crashData$error, _crashData$warning, _crashData$error2, _crashData$warning2, filePath, stat, crashData, _t10, _t11, _t12, _t13;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              _context0.p = 0;
              _context0.n = 1;
              return fs.readdir(this.crashReportsPath);
            case 1:
              files = _context0.v;
              crashFiles = files.filter(function (file) {
                return file.endsWith('.log');
              });
              crashes = [];
              _iterator2 = _createForOfIteratorHelper(crashFiles.slice(0, 20));
              _context0.p = 2;
              _iterator2.s();
            case 3:
              if ((_step2 = _iterator2.n()).done) {
                _context0.n = 9;
                break;
              }
              file = _step2.value;
              _context0.p = 4;
              filePath = path.join(this.crashReportsPath, file);
              _context0.n = 5;
              return fs.stat(filePath);
            case 5:
              stat = _context0.v;
              _t10 = JSON;
              _context0.n = 6;
              return fs.readFile(filePath, 'utf8');
            case 6:
              crashData = _t10.parse.call(_t10, _context0.v);
              crashes.push({
                id: crashData.id,
                fileName: file,
                timestamp: crashData.timestamp,
                type: crashData.type,
                errorName: ((_crashData$error = crashData.error) === null || _crashData$error === void 0 ? void 0 : _crashData$error.name) || ((_crashData$warning = crashData.warning) === null || _crashData$warning === void 0 ? void 0 : _crashData$warning.name) || 'Unknown',
                errorMessage: ((_crashData$error2 = crashData.error) === null || _crashData$error2 === void 0 ? void 0 : _crashData$error2.message) || ((_crashData$warning2 = crashData.warning) === null || _crashData$warning2 === void 0 ? void 0 : _crashData$warning2.message) || 'No message',
                size: stat.size
              });
              _context0.n = 8;
              break;
            case 7:
              _context0.p = 7;
              _t11 = _context0.v;
              this.debug.error("Error reading crash file ".concat(file, ":"), _t11);
            case 8:
              _context0.n = 3;
              break;
            case 9:
              _context0.n = 11;
              break;
            case 10:
              _context0.p = 10;
              _t12 = _context0.v;
              _iterator2.e(_t12);
            case 11:
              _context0.p = 11;
              _iterator2.f();
              return _context0.f(11);
            case 12:
              return _context0.a(2, crashes.sort(function (a, b) {
                return new Date(b.timestamp) - new Date(a.timestamp);
              }));
            case 13:
              _context0.p = 13;
              _t13 = _context0.v;
              this.debug.error('Error getting crash list:', _t13);
              return _context0.a(2, []);
          }
        }, _callee0, this, [[4, 7], [2, 10, 11, 12], [0, 13]]);
      }));
      function getCrashList() {
        return _getCrashList.apply(this, arguments);
      }
      return getCrashList;
    }()
  }, {
    key: "clearCrashReports",
    value: function () {
      var _clearCrashReports = _asyncToGenerator(_regenerator().m(function _callee1() {
        var files, _iterator3, _step3, file, _t14, _t15;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              _context1.p = 0;
              _context1.n = 1;
              return fs.readdir(this.crashReportsPath);
            case 1:
              files = _context1.v;
              _iterator3 = _createForOfIteratorHelper(files);
              _context1.p = 2;
              _iterator3.s();
            case 3:
              if ((_step3 = _iterator3.n()).done) {
                _context1.n = 5;
                break;
              }
              file = _step3.value;
              if (!file.endsWith('.log')) {
                _context1.n = 4;
                break;
              }
              _context1.n = 4;
              return fs.unlink(path.join(this.crashReportsPath, file));
            case 4:
              _context1.n = 3;
              break;
            case 5:
              _context1.n = 7;
              break;
            case 6:
              _context1.p = 6;
              _t14 = _context1.v;
              _iterator3.e(_t14);
            case 7:
              _context1.p = 7;
              _iterator3.f();
              return _context1.f(7);
            case 8:
              return _context1.a(2, true);
            case 9:
              _context1.p = 9;
              _t15 = _context1.v;
              this.debug.error('Error clearing crash reports:', _t15);
              return _context1.a(2, false);
          }
        }, _callee1, this, [[2, 6, 7, 8], [0, 9]]);
      }));
      function clearCrashReports() {
        return _clearCrashReports.apply(this, arguments);
      }
      return clearCrashReports;
    }()
  }, {
    key: "cleanOldCrashFiles",
    value: function () {
      var _cleanOldCrashFiles = _asyncToGenerator(_regenerator().m(function _callee11() {
        var _this3 = this;
        var files, now, deletedCount, _iterator4, _step4, _file, filePath, stat, remainingFiles, logFiles, filesWithStats, filesToDelete, _iterator5, _step5, file, _t16, _t17, _t18;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.p = _context11.n) {
            case 0:
              _context11.p = 0;
              _context11.n = 1;
              return fs.readdir(this.crashReportsPath);
            case 1:
              files = _context11.v;
              now = Date.now();
              deletedCount = 0;
              _iterator4 = _createForOfIteratorHelper(files);
              _context11.p = 2;
              _iterator4.s();
            case 3:
              if ((_step4 = _iterator4.n()).done) {
                _context11.n = 8;
                break;
              }
              _file = _step4.value;
              if (_file.endsWith('.log')) {
                _context11.n = 4;
                break;
              }
              return _context11.a(3, 7);
            case 4:
              filePath = path.join(this.crashReportsPath, _file);
              _context11.n = 5;
              return fs.stat(filePath);
            case 5:
              stat = _context11.v;
              if (!(now - stat.mtime.getTime() > this.maxFileAge)) {
                _context11.n = 7;
                break;
              }
              _context11.n = 6;
              return fs.unlink(filePath);
            case 6:
              deletedCount++;
            case 7:
              _context11.n = 3;
              break;
            case 8:
              _context11.n = 10;
              break;
            case 9:
              _context11.p = 9;
              _t16 = _context11.v;
              _iterator4.e(_t16);
            case 10:
              _context11.p = 10;
              _iterator4.f();
              return _context11.f(10);
            case 11:
              _context11.n = 12;
              return fs.readdir(this.crashReportsPath);
            case 12:
              remainingFiles = _context11.v;
              logFiles = remainingFiles.filter(function (f) {
                return f.endsWith('.log');
              });
              if (!(logFiles.length > this.maxCrashFiles)) {
                _context11.n = 21;
                break;
              }
              _context11.n = 13;
              return Promise.all(logFiles.map(function () {
                var _ref5 = _asyncToGenerator(_regenerator().m(function _callee10(file) {
                  var filePath, stat;
                  return _regenerator().w(function (_context10) {
                    while (1) switch (_context10.n) {
                      case 0:
                        filePath = path.join(_this3.crashReportsPath, file);
                        _context10.n = 1;
                        return fs.stat(filePath);
                      case 1:
                        stat = _context10.v;
                        return _context10.a(2, {
                          file: file,
                          mtime: stat.mtime
                        });
                    }
                  }, _callee10);
                }));
                return function (_x6) {
                  return _ref5.apply(this, arguments);
                };
              }()));
            case 13:
              filesWithStats = _context11.v;
              filesWithStats.sort(function (a, b) {
                return a.mtime - b.mtime;
              });
              filesToDelete = filesWithStats.slice(0, logFiles.length - this.maxCrashFiles);
              _iterator5 = _createForOfIteratorHelper(filesToDelete);
              _context11.p = 14;
              _iterator5.s();
            case 15:
              if ((_step5 = _iterator5.n()).done) {
                _context11.n = 18;
                break;
              }
              file = _step5.value.file;
              _context11.n = 16;
              return fs.unlink(path.join(this.crashReportsPath, file));
            case 16:
              deletedCount++;
            case 17:
              _context11.n = 15;
              break;
            case 18:
              _context11.n = 20;
              break;
            case 19:
              _context11.p = 19;
              _t17 = _context11.v;
              _iterator5.e(_t17);
            case 20:
              _context11.p = 20;
              _iterator5.f();
              return _context11.f(20);
            case 21:
              _context11.n = 23;
              break;
            case 22:
              _context11.p = 22;
              _t18 = _context11.v;
              this.debug.error('Error cleaning old crash files:', _t18);
            case 23:
              return _context11.a(2);
          }
        }, _callee11, this, [[14, 19, 20, 21], [2, 9, 10, 11], [0, 22]]);
      }));
      function cleanOldCrashFiles() {
        return _cleanOldCrashFiles.apply(this, arguments);
      }
      return cleanOldCrashFiles;
    }()
  }, {
    key: "getAppDataPath",
    value: function getAppDataPath() {
      return this.appDataPath;
    }
  }, {
    key: "getCrashReportsPath",
    value: function getCrashReportsPath() {
      return this.crashReportsPath;
    }
  }]);
}();
var crashReporter = null;
function setupCrashReporter() {
  return _setupCrashReporter.apply(this, arguments);
}
function _setupCrashReporter() {
  _setupCrashReporter = _asyncToGenerator(_regenerator().m(function _callee12() {
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          if (crashReporter) {
            _context12.n = 3;
            break;
          }
          crashReporter = new CrashReporter();
          global.crashReporter = crashReporter;
          if (!app.isReady()) {
            _context12.n = 2;
            break;
          }
          _context12.n = 1;
          return crashReporter.init();
        case 1:
          _context12.n = 3;
          break;
        case 2:
          app.whenReady().then(function () {
            return crashReporter.init();
          });
        case 3:
          return _context12.a(2, crashReporter);
      }
    }, _callee12);
  }));
  return _setupCrashReporter.apply(this, arguments);
}
function reportRendererError(error) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (crashReporter) {
    return crashReporter.reportCrash('renderer-error', error, context);
  }
  return null;
}
module.exports = {
  CrashReporter: CrashReporter,
  setupCrashReporter: setupCrashReporter,
  reportRendererError: reportRendererError
};