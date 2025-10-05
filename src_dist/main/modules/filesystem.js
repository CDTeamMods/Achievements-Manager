"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
  ipcMain = _require.ipcMain,
  dialog = _require.dialog;
var fs = require('fs').promises;
var path = require('path');
var _require2 = require('./debug-manager'),
  getDebugManager = _require2.getDebugManager;
var FilesystemManager = function () {
  function FilesystemManager(pathManager) {
    var crashReporter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var configManager = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    _classCallCheck(this, FilesystemManager);
    this.pathManager = pathManager;
    this.crashReporter = crashReporter;
    this.configManager = configManager;
    this.debug = getDebugManager();
    var paths = pathManager.getPaths();
    this.dataPath = pathManager.getDataPath();
    this.cachePath = paths.cache;
    this.logsPath = paths.logs;
    this.backupsPath = paths.backups;
    this.tempPath = paths.temp;
  }
  return _createClass(FilesystemManager, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return this.createDirectories();
            case 1:
              this.setupFileWatchers();
              this.debug.info('📁 Filesystem Manager initialized successfully');
              return _context.a(2, true);
            case 2:
              _context.p = 2;
              _t = _context.v;
              this.debug.error('❌ Error initializing Filesystem Manager:', _t);
              _context.n = 3;
              return this.reportFilesystemError('init', _t, {
                operation: 'initialization'
              });
            case 3:
              throw _t;
            case 4:
              return _context.a(2);
          }
        }, _callee, this, [[0, 2]]);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }, {
    key: "reportFilesystemError",
    value: (function () {
      var _reportFilesystemError = _asyncToGenerator(_regenerator().m(function _callee2(operation, error) {
        var context,
          _this$pathManager,
          _this$debug,
          errorContext,
          _args2 = arguments,
          _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              context = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
              _context2.p = 1;
              if (!this.crashReporter) {
                _context2.n = 3;
                break;
              }
              errorContext = _objectSpread({
                operation: operation,
                isPortable: ((_this$pathManager = this.pathManager) === null || _this$pathManager === void 0 ? void 0 : _this$pathManager.isInstalledVersion()) === false,
                dataPath: this.dataPath,
                timestamp: new Date().toISOString()
              }, context);
              _context2.n = 2;
              return this.crashReporter.reportCrash('filesystem', error, errorContext);
            case 2:
              if ((_this$debug = this.debug) !== null && _this$debug !== void 0 && _this$debug.isDebugEnabled) {
                this.debug.error('Filesystem error reported:', operation, error.message);
              }
            case 3:
              _context2.n = 5;
              break;
            case 4:
              _context2.p = 4;
              _t2 = _context2.v;
              this.debug.warn('⚠️ Failed to report filesystem error:', _t2);
            case 5:
              return _context2.a(2);
          }
        }, _callee2, this, [[1, 4]]);
      }));
      function reportFilesystemError(_x, _x2) {
        return _reportFilesystemError.apply(this, arguments);
      }
      return reportFilesystemError;
    }())
  }, {
    key: "createDirectories",
    value: function () {
      var _createDirectories = _asyncToGenerator(_regenerator().m(function _callee3() {
        var essentialDirectories, _i, _essentialDirectories, dir, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              essentialDirectories = [this.dataPath, path.join(this.dataPath, 'settings'), this.cachePath, this.logsPath, this.backupsPath, this.tempPath];
              _i = 0, _essentialDirectories = essentialDirectories;
            case 1:
              if (!(_i < _essentialDirectories.length)) {
                _context3.n = 7;
                break;
              }
              dir = _essentialDirectories[_i];
              _context3.p = 2;
              _context3.n = 3;
              return fs.mkdir(dir, {
                recursive: true
              });
            case 3:
              this.debug.log("\uD83D\uDCC1 Pasta criada: ".concat(path.relative(this.dataPath, dir) || 'data'));
              _context3.n = 6;
              break;
            case 4:
              _context3.p = 4;
              _t3 = _context3.v;
              this.debug.error("\u274C Erro ao criar pasta ".concat(dir, ":"), _t3);
              _context3.n = 5;
              return this.reportFilesystemError('createDirectories', _t3, {
                directory: dir
              });
            case 5:
              throw _t3;
            case 6:
              _i++;
              _context3.n = 1;
              break;
            case 7:
              this.debug.log('✅ Estrutura de pastas essenciais criada com sucesso');
            case 8:
              return _context3.a(2);
          }
        }, _callee3, this, [[2, 4]]);
      }));
      function createDirectories() {
        return _createDirectories.apply(this, arguments);
      }
      return createDirectories;
    }()
  }, {
    key: "ensureDataDirectories",
    value: (function () {
      var _ensureDataDirectories = _asyncToGenerator(_regenerator().m(function _callee4() {
        var dataDirectories, _i2, _dataDirectories, dir, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              dataDirectories = [path.join(this.dataPath, 'achievements'), path.join(this.dataPath, 'games'), path.join(this.dataPath, 'exports'), path.join(this.dataPath, 'imports')];
              _i2 = 0, _dataDirectories = dataDirectories;
            case 1:
              if (!(_i2 < _dataDirectories.length)) {
                _context4.n = 7;
                break;
              }
              dir = _dataDirectories[_i2];
              _context4.p = 2;
              _context4.n = 3;
              return fs.mkdir(dir, {
                recursive: true
              });
            case 3:
              this.debug.log("\uD83D\uDCC1 Pasta de dados criada: ".concat(path.relative(this.dataPath, dir)));
              _context4.n = 6;
              break;
            case 4:
              _context4.p = 4;
              _t4 = _context4.v;
              this.debug.error("\u274C Erro ao criar pasta de dados ".concat(dir, ":"), _t4);
              _context4.n = 5;
              return this.reportFilesystemError('ensureDataDirectories', _t4, {
                directory: dir
              });
            case 5:
              throw _t4;
            case 6:
              _i2++;
              _context4.n = 1;
              break;
            case 7:
              return _context4.a(2, true);
          }
        }, _callee4, this, [[2, 4]]);
      }));
      function ensureDataDirectories() {
        return _ensureDataDirectories.apply(this, arguments);
      }
      return ensureDataDirectories;
    }())
  }, {
    key: "setupIPC",
    value: function setupIPC() {
      var _this = this;
      ipcMain.handle('fs:readFile', function () {
        var _ref = _asyncToGenerator(_regenerator().m(function _callee5(event, filePath) {
          var encoding,
            _args5 = arguments;
          return _regenerator().w(function (_context5) {
            while (1) switch (_context5.n) {
              case 0:
                encoding = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 'utf8';
                _context5.n = 1;
                return _this.readFile(filePath, encoding);
              case 1:
                return _context5.a(2, _context5.v);
            }
          }, _callee5);
        }));
        return function (_x3, _x4) {
          return _ref.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:writeFile', function () {
        var _ref2 = _asyncToGenerator(_regenerator().m(function _callee6(event, filePath, data) {
          var encoding,
            _args6 = arguments;
          return _regenerator().w(function (_context6) {
            while (1) switch (_context6.n) {
              case 0:
                encoding = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : 'utf8';
                _context6.n = 1;
                return _this.writeFile(filePath, data, encoding);
              case 1:
                return _context6.a(2, _context6.v);
            }
          }, _callee6);
        }));
        return function (_x5, _x6, _x7) {
          return _ref2.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:deleteFile', function () {
        var _ref3 = _asyncToGenerator(_regenerator().m(function _callee7(event, filePath) {
          return _regenerator().w(function (_context7) {
            while (1) switch (_context7.n) {
              case 0:
                _context7.n = 1;
                return _this.deleteFile(filePath);
              case 1:
                return _context7.a(2, _context7.v);
            }
          }, _callee7);
        }));
        return function (_x8, _x9) {
          return _ref3.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:exists', function () {
        var _ref4 = _asyncToGenerator(_regenerator().m(function _callee8(event, filePath) {
          return _regenerator().w(function (_context8) {
            while (1) switch (_context8.n) {
              case 0:
                _context8.n = 1;
                return _this.exists(filePath);
              case 1:
                return _context8.a(2, _context8.v);
            }
          }, _callee8);
        }));
        return function (_x0, _x1) {
          return _ref4.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:readDirectory', function () {
        var _ref5 = _asyncToGenerator(_regenerator().m(function _callee9(event, dirPath) {
          return _regenerator().w(function (_context9) {
            while (1) switch (_context9.n) {
              case 0:
                _context9.n = 1;
                return _this.readDirectory(dirPath);
              case 1:
                return _context9.a(2, _context9.v);
            }
          }, _callee9);
        }));
        return function (_x10, _x11) {
          return _ref5.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:createDirectory', function () {
        var _ref6 = _asyncToGenerator(_regenerator().m(function _callee0(event, dirPath) {
          return _regenerator().w(function (_context0) {
            while (1) switch (_context0.n) {
              case 0:
                _context0.n = 1;
                return _this.createDirectory(dirPath);
              case 1:
                return _context0.a(2, _context0.v);
            }
          }, _callee0);
        }));
        return function (_x12, _x13) {
          return _ref6.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:deleteDirectory', function () {
        var _ref7 = _asyncToGenerator(_regenerator().m(function _callee1(event, dirPath) {
          return _regenerator().w(function (_context1) {
            while (1) switch (_context1.n) {
              case 0:
                _context1.n = 1;
                return _this.deleteDirectory(dirPath);
              case 1:
                return _context1.a(2, _context1.v);
            }
          }, _callee1);
        }));
        return function (_x14, _x15) {
          return _ref7.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:getFileInfo', function () {
        var _ref8 = _asyncToGenerator(_regenerator().m(function _callee10(event, filePath) {
          return _regenerator().w(function (_context10) {
            while (1) switch (_context10.n) {
              case 0:
                _context10.n = 1;
                return _this.getFileInfo(filePath);
              case 1:
                return _context10.a(2, _context10.v);
            }
          }, _callee10);
        }));
        return function (_x16, _x17) {
          return _ref8.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:saveGameData', function () {
        var _ref9 = _asyncToGenerator(_regenerator().m(function _callee11(event, gameId, data) {
          return _regenerator().w(function (_context11) {
            while (1) switch (_context11.n) {
              case 0:
                _context11.n = 1;
                return _this.saveGameData(gameId, data);
              case 1:
                return _context11.a(2, _context11.v);
            }
          }, _callee11);
        }));
        return function (_x18, _x19, _x20) {
          return _ref9.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:loadGameData', function () {
        var _ref0 = _asyncToGenerator(_regenerator().m(function _callee12(event, gameId) {
          return _regenerator().w(function (_context12) {
            while (1) switch (_context12.n) {
              case 0:
                _context12.n = 1;
                return _this.loadGameData(gameId);
              case 1:
                return _context12.a(2, _context12.v);
            }
          }, _callee12);
        }));
        return function (_x21, _x22) {
          return _ref0.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:saveAchievementData', function () {
        var _ref1 = _asyncToGenerator(_regenerator().m(function _callee13(event, gameId, achievements) {
          return _regenerator().w(function (_context13) {
            while (1) switch (_context13.n) {
              case 0:
                _context13.n = 1;
                return _this.saveAchievementData(gameId, achievements);
              case 1:
                return _context13.a(2, _context13.v);
            }
          }, _callee13);
        }));
        return function (_x23, _x24, _x25) {
          return _ref1.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:loadAchievementData', function () {
        var _ref10 = _asyncToGenerator(_regenerator().m(function _callee14(event, gameId) {
          return _regenerator().w(function (_context14) {
            while (1) switch (_context14.n) {
              case 0:
                _context14.n = 1;
                return _this.loadAchievementData(gameId);
              case 1:
                return _context14.a(2, _context14.v);
            }
          }, _callee14);
        }));
        return function (_x26, _x27) {
          return _ref10.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:saveSettings', function () {
        var _ref11 = _asyncToGenerator(_regenerator().m(function _callee15(event, settings) {
          return _regenerator().w(function (_context15) {
            while (1) switch (_context15.n) {
              case 0:
                _context15.n = 1;
                return _this.saveSettings(settings);
              case 1:
                return _context15.a(2, _context15.v);
            }
          }, _callee15);
        }));
        return function (_x28, _x29) {
          return _ref11.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:loadSettings', function () {
        var _ref12 = _asyncToGenerator(_regenerator().m(function _callee16(event) {
          return _regenerator().w(function (_context16) {
            while (1) switch (_context16.n) {
              case 0:
                _context16.n = 1;
                return _this.loadSettings();
              case 1:
                return _context16.a(2, _context16.v);
            }
          }, _callee16);
        }));
        return function (_x30) {
          return _ref12.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:createBackup', function () {
        var _ref13 = _asyncToGenerator(_regenerator().m(function _callee17(event, name) {
          return _regenerator().w(function (_context17) {
            while (1) switch (_context17.n) {
              case 0:
                _context17.n = 1;
                return _this.createBackup(name);
              case 1:
                return _context17.a(2, _context17.v);
            }
          }, _callee17);
        }));
        return function (_x31, _x32) {
          return _ref13.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:restoreBackup', function () {
        var _ref14 = _asyncToGenerator(_regenerator().m(function _callee18(event, backupId) {
          return _regenerator().w(function (_context18) {
            while (1) switch (_context18.n) {
              case 0:
                _context18.n = 1;
                return _this.restoreBackup(backupId);
              case 1:
                return _context18.a(2, _context18.v);
            }
          }, _callee18);
        }));
        return function (_x33, _x34) {
          return _ref14.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:listBackups', function () {
        var _ref15 = _asyncToGenerator(_regenerator().m(function _callee19(event) {
          return _regenerator().w(function (_context19) {
            while (1) switch (_context19.n) {
              case 0:
                _context19.n = 1;
                return _this.listBackups();
              case 1:
                return _context19.a(2, _context19.v);
            }
          }, _callee19);
        }));
        return function (_x35) {
          return _ref15.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:deleteBackup', function () {
        var _ref16 = _asyncToGenerator(_regenerator().m(function _callee20(event, backupId) {
          return _regenerator().w(function (_context20) {
            while (1) switch (_context20.n) {
              case 0:
                _context20.n = 1;
                return _this.deleteBackup(backupId);
              case 1:
                return _context20.a(2, _context20.v);
            }
          }, _callee20);
        }));
        return function (_x36, _x37) {
          return _ref16.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:exportData', function () {
        var _ref17 = _asyncToGenerator(_regenerator().m(function _callee21(event) {
          var options,
            _args21 = arguments;
          return _regenerator().w(function (_context21) {
            while (1) switch (_context21.n) {
              case 0:
                options = _args21.length > 1 && _args21[1] !== undefined ? _args21[1] : {};
                _context21.n = 1;
                return _this.exportData(options);
              case 1:
                return _context21.a(2, _context21.v);
            }
          }, _callee21);
        }));
        return function (_x38) {
          return _ref17.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:importData', function () {
        var _ref18 = _asyncToGenerator(_regenerator().m(function _callee22(event, filePath) {
          return _regenerator().w(function (_context22) {
            while (1) switch (_context22.n) {
              case 0:
                _context22.n = 1;
                return _this.importData(filePath);
              case 1:
                return _context22.a(2, _context22.v);
            }
          }, _callee22);
        }));
        return function (_x39, _x40) {
          return _ref18.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:showOpenDialog', function () {
        var _ref19 = _asyncToGenerator(_regenerator().m(function _callee23(event) {
          var options,
            _args23 = arguments;
          return _regenerator().w(function (_context23) {
            while (1) switch (_context23.n) {
              case 0:
                options = _args23.length > 1 && _args23[1] !== undefined ? _args23[1] : {};
                _context23.n = 1;
                return _this.showOpenDialog(options);
              case 1:
                return _context23.a(2, _context23.v);
            }
          }, _callee23);
        }));
        return function (_x41) {
          return _ref19.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:showSaveDialog', function () {
        var _ref20 = _asyncToGenerator(_regenerator().m(function _callee24(event) {
          var options,
            _args24 = arguments;
          return _regenerator().w(function (_context24) {
            while (1) switch (_context24.n) {
              case 0:
                options = _args24.length > 1 && _args24[1] !== undefined ? _args24[1] : {};
                _context24.n = 1;
                return _this.showSaveDialog(options);
              case 1:
                return _context24.a(2, _context24.v);
            }
          }, _callee24);
        }));
        return function (_x42) {
          return _ref20.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:clearCache', function () {
        var _ref21 = _asyncToGenerator(_regenerator().m(function _callee25(event) {
          return _regenerator().w(function (_context25) {
            while (1) switch (_context25.n) {
              case 0:
                _context25.n = 1;
                return _this.clearCache();
              case 1:
                return _context25.a(2, _context25.v);
            }
          }, _callee25);
        }));
        return function (_x43) {
          return _ref21.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:getCacheSize', function () {
        var _ref22 = _asyncToGenerator(_regenerator().m(function _callee26(event) {
          return _regenerator().w(function (_context26) {
            while (1) switch (_context26.n) {
              case 0:
                _context26.n = 1;
                return _this.getCacheSize();
              case 1:
                return _context26.a(2, _context26.v);
            }
          }, _callee26);
        }));
        return function (_x44) {
          return _ref22.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:getLogs', function () {
        var _ref23 = _asyncToGenerator(_regenerator().m(function _callee27(event) {
          var options,
            _args27 = arguments;
          return _regenerator().w(function (_context27) {
            while (1) switch (_context27.n) {
              case 0:
                options = _args27.length > 1 && _args27[1] !== undefined ? _args27[1] : {};
                _context27.n = 1;
                return _this.getLogs(options);
              case 1:
                return _context27.a(2, _context27.v);
            }
          }, _callee27);
        }));
        return function (_x45) {
          return _ref23.apply(this, arguments);
        };
      }());
      ipcMain.handle('fs:clearLogs', function () {
        var _ref24 = _asyncToGenerator(_regenerator().m(function _callee28(event) {
          return _regenerator().w(function (_context28) {
            while (1) switch (_context28.n) {
              case 0:
                _context28.n = 1;
                return _this.clearLogs();
              case 1:
                return _context28.a(2, _context28.v);
            }
          }, _callee28);
        }));
        return function (_x46) {
          return _ref24.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "readFile",
    value: function () {
      var _readFile = _asyncToGenerator(_regenerator().m(function _callee29(filePath) {
        var encoding,
          safePath,
          _args29 = arguments,
          _t5;
        return _regenerator().w(function (_context29) {
          while (1) switch (_context29.p = _context29.n) {
            case 0:
              encoding = _args29.length > 1 && _args29[1] !== undefined ? _args29[1] : 'utf8';
              _context29.p = 1;
              safePath = this.getSafePath(filePath);
              _context29.n = 2;
              return fs.readFile(safePath, encoding);
            case 2:
              return _context29.a(2, _context29.v);
            case 3:
              _context29.p = 3;
              _t5 = _context29.v;
              this.debug.error("Error reading file ".concat(filePath, ":"), _t5);
              _context29.n = 4;
              return this.reportFilesystemError('readFile', _t5, {
                filePath: filePath,
                encoding: encoding,
                safePath: safePath || 'unknown'
              });
            case 4:
              throw _t5;
            case 5:
              return _context29.a(2);
          }
        }, _callee29, this, [[1, 3]]);
      }));
      function readFile(_x47) {
        return _readFile.apply(this, arguments);
      }
      return readFile;
    }()
  }, {
    key: "writeFile",
    value: function () {
      var _writeFile = _asyncToGenerator(_regenerator().m(function _callee30(filePath, data) {
        var encoding,
          safePath,
          _args30 = arguments,
          _t6;
        return _regenerator().w(function (_context30) {
          while (1) switch (_context30.p = _context30.n) {
            case 0:
              encoding = _args30.length > 2 && _args30[2] !== undefined ? _args30[2] : 'utf8';
              _context30.p = 1;
              safePath = this.getSafePath(filePath);
              _context30.n = 2;
              return this.ensureDirectoryExists(path.dirname(safePath));
            case 2:
              _context30.n = 3;
              return fs.writeFile(safePath, data, encoding);
            case 3:
              return _context30.a(2, true);
            case 4:
              _context30.p = 4;
              _t6 = _context30.v;
              this.debug.error("Error writing file ".concat(filePath, ":"), _t6);
              _context30.n = 5;
              return this.reportFilesystemError('writeFile', _t6, {
                filePath: filePath,
                encoding: encoding,
                dataSize: (data === null || data === void 0 ? void 0 : data.length) || 0,
                safePath: safePath || 'unknown'
              });
            case 5:
              throw _t6;
            case 6:
              return _context30.a(2);
          }
        }, _callee30, this, [[1, 4]]);
      }));
      function writeFile(_x48, _x49) {
        return _writeFile.apply(this, arguments);
      }
      return writeFile;
    }()
  }, {
    key: "deleteFile",
    value: function () {
      var _deleteFile = _asyncToGenerator(_regenerator().m(function _callee31(filePath) {
        var safePath, _t7;
        return _regenerator().w(function (_context31) {
          while (1) switch (_context31.p = _context31.n) {
            case 0:
              _context31.p = 0;
              safePath = this.getSafePath(filePath);
              _context31.n = 1;
              return fs.unlink(safePath);
            case 1:
              return _context31.a(2, true);
            case 2:
              _context31.p = 2;
              _t7 = _context31.v;
              this.debug.error("Error deleting file ".concat(filePath, ":"), _t7);
              _context31.n = 3;
              return this.reportFilesystemError('deleteFile', _t7, {
                filePath: filePath,
                safePath: safePath || 'unknown'
              });
            case 3:
              throw _t7;
            case 4:
              return _context31.a(2);
          }
        }, _callee31, this, [[0, 2]]);
      }));
      function deleteFile(_x50) {
        return _deleteFile.apply(this, arguments);
      }
      return deleteFile;
    }()
  }, {
    key: "exists",
    value: function () {
      var _exists = _asyncToGenerator(_regenerator().m(function _callee32(filePath) {
        var safePath, _t8;
        return _regenerator().w(function (_context32) {
          while (1) switch (_context32.p = _context32.n) {
            case 0:
              _context32.p = 0;
              safePath = this.getSafePath(filePath);
              _context32.n = 1;
              return fs.access(safePath);
            case 1:
              return _context32.a(2, true);
            case 2:
              _context32.p = 2;
              _t8 = _context32.v;
              return _context32.a(2, false);
          }
        }, _callee32, this, [[0, 2]]);
      }));
      function exists(_x51) {
        return _exists.apply(this, arguments);
      }
      return exists;
    }()
  }, {
    key: "ensureDirectoryExists",
    value: function () {
      var _ensureDirectoryExists = _asyncToGenerator(_regenerator().m(function _callee33(dirPath) {
        var _t9;
        return _regenerator().w(function (_context33) {
          while (1) switch (_context33.p = _context33.n) {
            case 0:
              _context33.p = 0;
              _context33.n = 1;
              return fs.mkdir(dirPath, {
                recursive: true
              });
            case 1:
              return _context33.a(2, true);
            case 2:
              _context33.p = 2;
              _t9 = _context33.v;
              this.debug.error("Error creating directory ".concat(dirPath, ":"), _t9);
              _context33.n = 3;
              return this.reportFilesystemError('ensureDirectoryExists', _t9, {
                dirPath: dirPath
              });
            case 3:
              throw _t9;
            case 4:
              return _context33.a(2);
          }
        }, _callee33, this, [[0, 2]]);
      }));
      function ensureDirectoryExists(_x52) {
        return _ensureDirectoryExists.apply(this, arguments);
      }
      return ensureDirectoryExists;
    }()
  }, {
    key: "getSafePath",
    value: function getSafePath(filePath) {
      var resolvedPath = path.resolve(this.dataPath, filePath);
      if (!resolvedPath.startsWith(this.dataPath)) {
        throw new Error('Access denied: Path outside allowed directory');
      }
      return resolvedPath;
    }
  }, {
    key: "readDirectory",
    value: function () {
      var _readDirectory = _asyncToGenerator(_regenerator().m(function _callee34(dirPath) {
        var safePath, entries, _t0;
        return _regenerator().w(function (_context34) {
          while (1) switch (_context34.p = _context34.n) {
            case 0:
              _context34.p = 0;
              safePath = this.getSafePath(dirPath);
              _context34.n = 1;
              return fs.readdir(safePath, {
                withFileTypes: true
              });
            case 1:
              entries = _context34.v;
              return _context34.a(2, entries.map(function (entry) {
                return {
                  name: entry.name,
                  isDirectory: entry.isDirectory(),
                  isFile: entry.isFile(),
                  path: path.join(dirPath, entry.name)
                };
              }));
            case 2:
              _context34.p = 2;
              _t0 = _context34.v;
              this.debug.error("Error reading directory ".concat(dirPath, ":"), _t0);
              _context34.n = 3;
              return this.reportFilesystemError('readDirectory', _t0, {
                dirPath: dirPath,
                safePath: safePath || 'unknown'
              });
            case 3:
              throw _t0;
            case 4:
              return _context34.a(2);
          }
        }, _callee34, this, [[0, 2]]);
      }));
      function readDirectory(_x53) {
        return _readDirectory.apply(this, arguments);
      }
      return readDirectory;
    }()
  }, {
    key: "listDirectory",
    value: function () {
      var _listDirectory = _asyncToGenerator(_regenerator().m(function _callee35(dirPath) {
        var safePath, _t1;
        return _regenerator().w(function (_context35) {
          while (1) switch (_context35.p = _context35.n) {
            case 0:
              _context35.p = 0;
              safePath = this.getSafePath(dirPath);
              _context35.n = 1;
              return fs.readdir(safePath);
            case 1:
              return _context35.a(2, _context35.v);
            case 2:
              _context35.p = 2;
              _t1 = _context35.v;
              this.debug.error("Error listing directory ".concat(dirPath, ":"), _t1);
              _context35.n = 3;
              return this.reportFilesystemError('listDirectory', _t1, {
                dirPath: dirPath,
                safePath: safePath || 'unknown'
              });
            case 3:
              throw _t1;
            case 4:
              return _context35.a(2);
          }
        }, _callee35, this, [[0, 2]]);
      }));
      function listDirectory(_x54) {
        return _listDirectory.apply(this, arguments);
      }
      return listDirectory;
    }()
  }, {
    key: "createDirectory",
    value: function () {
      var _createDirectory = _asyncToGenerator(_regenerator().m(function _callee36(dirPath) {
        var safePath, _t10;
        return _regenerator().w(function (_context36) {
          while (1) switch (_context36.p = _context36.n) {
            case 0:
              _context36.p = 0;
              safePath = this.getSafePath(dirPath);
              _context36.n = 1;
              return fs.mkdir(safePath, {
                recursive: true
              });
            case 1:
              return _context36.a(2, true);
            case 2:
              _context36.p = 2;
              _t10 = _context36.v;
              this.debug.error("Error creating directory ".concat(dirPath, ":"), _t10);
              _context36.n = 3;
              return this.reportFilesystemError('createDirectory', _t10, {
                dirPath: dirPath,
                safePath: safePath || 'unknown'
              });
            case 3:
              throw _t10;
            case 4:
              return _context36.a(2);
          }
        }, _callee36, this, [[0, 2]]);
      }));
      function createDirectory(_x55) {
        return _createDirectory.apply(this, arguments);
      }
      return createDirectory;
    }()
  }, {
    key: "deleteDirectory",
    value: function () {
      var _deleteDirectory = _asyncToGenerator(_regenerator().m(function _callee37(dirPath) {
        var safePath, _t11;
        return _regenerator().w(function (_context37) {
          while (1) switch (_context37.p = _context37.n) {
            case 0:
              _context37.p = 0;
              safePath = this.getSafePath(dirPath);
              _context37.n = 1;
              return fs.rmdir(safePath, {
                recursive: true
              });
            case 1:
              return _context37.a(2, true);
            case 2:
              _context37.p = 2;
              _t11 = _context37.v;
              this.debug.error("Error deleting directory ".concat(dirPath, ":"), _t11);
              _context37.n = 3;
              return this.reportFilesystemError('deleteDirectory', _t11, {
                dirPath: dirPath,
                safePath: safePath || 'unknown'
              });
            case 3:
              throw _t11;
            case 4:
              return _context37.a(2);
          }
        }, _callee37, this, [[0, 2]]);
      }));
      function deleteDirectory(_x56) {
        return _deleteDirectory.apply(this, arguments);
      }
      return deleteDirectory;
    }()
  }, {
    key: "getFileInfo",
    value: function () {
      var _getFileInfo = _asyncToGenerator(_regenerator().m(function _callee38(filePath) {
        var safePath, stats, _t12;
        return _regenerator().w(function (_context38) {
          while (1) switch (_context38.p = _context38.n) {
            case 0:
              _context38.p = 0;
              safePath = this.getSafePath(filePath);
              _context38.n = 1;
              return fs.stat(safePath);
            case 1:
              stats = _context38.v;
              return _context38.a(2, {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                accessed: stats.atime,
                isDirectory: stats.isDirectory(),
                isFile: stats.isFile()
              });
            case 2:
              _context38.p = 2;
              _t12 = _context38.v;
              this.debug.error("Error getting file info ".concat(filePath, ":"), _t12);
              throw _t12;
            case 3:
              return _context38.a(2);
          }
        }, _callee38, this, [[0, 2]]);
      }));
      function getFileInfo(_x57) {
        return _getFileInfo.apply(this, arguments);
      }
      return getFileInfo;
    }()
  }, {
    key: "saveGameData",
    value: function () {
      var _saveGameData = _asyncToGenerator(_regenerator().m(function _callee39(gameId, data) {
        var filePath, gameData, _t13;
        return _regenerator().w(function (_context39) {
          while (1) switch (_context39.p = _context39.n) {
            case 0:
              _context39.p = 0;
              filePath = path.join('games', "".concat(gameId, ".json"));
              gameData = _objectSpread(_objectSpread({}, data), {}, {
                id: gameId,
                lastModified: new Date().toISOString(),
                version: '0.0.1-beta'
              });
              _context39.n = 1;
              return this.writeFile(filePath, JSON.stringify(gameData, null, 2));
            case 1:
              return _context39.a(2, true);
            case 2:
              _context39.p = 2;
              _t13 = _context39.v;
              this.debug.error("Error saving game data for ".concat(gameId, ":"), _t13);
              throw _t13;
            case 3:
              return _context39.a(2);
          }
        }, _callee39, this, [[0, 2]]);
      }));
      function saveGameData(_x58, _x59) {
        return _saveGameData.apply(this, arguments);
      }
      return saveGameData;
    }()
  }, {
    key: "loadGameData",
    value: function () {
      var _loadGameData = _asyncToGenerator(_regenerator().m(function _callee40(gameId) {
        var filePath, data, _t14;
        return _regenerator().w(function (_context40) {
          while (1) switch (_context40.p = _context40.n) {
            case 0:
              _context40.p = 0;
              filePath = path.join('games', "".concat(gameId, ".json"));
              _context40.n = 1;
              return this.exists(filePath);
            case 1:
              if (_context40.v) {
                _context40.n = 2;
                break;
              }
              return _context40.a(2, null);
            case 2:
              _context40.n = 3;
              return this.readFile(filePath);
            case 3:
              data = _context40.v;
              return _context40.a(2, JSON.parse(data));
            case 4:
              _context40.p = 4;
              _t14 = _context40.v;
              this.debug.error("Error loading game data for ".concat(gameId, ":"), _t14);
              throw _t14;
            case 5:
              return _context40.a(2);
          }
        }, _callee40, this, [[0, 4]]);
      }));
      function loadGameData(_x60) {
        return _loadGameData.apply(this, arguments);
      }
      return loadGameData;
    }()
  }, {
    key: "saveAchievementData",
    value: function () {
      var _saveAchievementData = _asyncToGenerator(_regenerator().m(function _callee41(gameId, achievements) {
        var filePath, achievementData, _t15;
        return _regenerator().w(function (_context41) {
          while (1) switch (_context41.p = _context41.n) {
            case 0:
              _context41.p = 0;
              filePath = path.join('achievements', "".concat(gameId, ".json"));
              achievementData = {
                gameId: gameId,
                achievements: achievements,
                lastModified: new Date().toISOString(),
                version: '0.0.1-beta'
              };
              _context41.n = 1;
              return this.writeFile(filePath, JSON.stringify(achievementData, null, 2));
            case 1:
              return _context41.a(2, true);
            case 2:
              _context41.p = 2;
              _t15 = _context41.v;
              this.debug.error("Error saving achievement data for ".concat(gameId, ":"), _t15);
              throw _t15;
            case 3:
              return _context41.a(2);
          }
        }, _callee41, this, [[0, 2]]);
      }));
      function saveAchievementData(_x61, _x62) {
        return _saveAchievementData.apply(this, arguments);
      }
      return saveAchievementData;
    }()
  }, {
    key: "loadAchievementData",
    value: function () {
      var _loadAchievementData = _asyncToGenerator(_regenerator().m(function _callee42(gameId) {
        var filePath, data, _t16;
        return _regenerator().w(function (_context42) {
          while (1) switch (_context42.p = _context42.n) {
            case 0:
              _context42.p = 0;
              filePath = path.join('achievements', "".concat(gameId, ".json"));
              _context42.n = 1;
              return this.exists(filePath);
            case 1:
              if (_context42.v) {
                _context42.n = 2;
                break;
              }
              return _context42.a(2, null);
            case 2:
              _context42.n = 3;
              return this.readFile(filePath);
            case 3:
              data = _context42.v;
              return _context42.a(2, JSON.parse(data));
            case 4:
              _context42.p = 4;
              _t16 = _context42.v;
              this.debug.error("Error loading achievement data for ".concat(gameId, ":"), _t16);
              throw _t16;
            case 5:
              return _context42.a(2);
          }
        }, _callee42, this, [[0, 4]]);
      }));
      function loadAchievementData(_x63) {
        return _loadAchievementData.apply(this, arguments);
      }
      return loadAchievementData;
    }()
  }, {
    key: "saveSettings",
    value: function () {
      var _saveSettings = _asyncToGenerator(_regenerator().m(function _callee43(settings) {
        var _i3, _Object$entries, _Object$entries$_i, key, value, filePath, settingsData, _t17;
        return _regenerator().w(function (_context43) {
          while (1) switch (_context43.p = _context43.n) {
            case 0:
              _context43.p = 0;
              if (!this.configManager) {
                _context43.n = 4;
                break;
              }
              _i3 = 0, _Object$entries = Object.entries(settings);
            case 1:
              if (!(_i3 < _Object$entries.length)) {
                _context43.n = 3;
                break;
              }
              _Object$entries$_i = _slicedToArray(_Object$entries[_i3], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];
              _context43.n = 2;
              return this.configManager.set(key, value);
            case 2:
              _i3++;
              _context43.n = 1;
              break;
            case 3:
              return _context43.a(2, true);
            case 4:
              filePath = path.join('settings', 'app.json');
              settingsData = _objectSpread(_objectSpread({}, settings), {}, {
                lastModified: new Date().toISOString(),
                version: '0.0.1-beta'
              });
              _context43.n = 5;
              return this.writeFile(filePath, JSON.stringify(settingsData, null, 2));
            case 5:
              return _context43.a(2, true);
            case 6:
              _context43.p = 6;
              _t17 = _context43.v;
              this.debug.error('Error saving settings:', _t17);
              throw _t17;
            case 7:
              return _context43.a(2);
          }
        }, _callee43, this, [[0, 6]]);
      }));
      function saveSettings(_x64) {
        return _saveSettings.apply(this, arguments);
      }
      return saveSettings;
    }()
  }, {
    key: "loadSettings",
    value: function () {
      var _loadSettings = _asyncToGenerator(_regenerator().m(function _callee44() {
        var filePath, data, _t18;
        return _regenerator().w(function (_context44) {
          while (1) switch (_context44.p = _context44.n) {
            case 0:
              _context44.p = 0;
              filePath = path.join('settings', 'app.json');
              _context44.n = 1;
              return this.exists(filePath);
            case 1:
              if (_context44.v) {
                _context44.n = 2;
                break;
              }
              return _context44.a(2, {
                language: 'pt-BR',
                theme: 'auto',
                performanceMode: 'normal',
                animations: 'enabled',
                version: '0.0.1-beta'
              });
            case 2:
              _context44.n = 3;
              return this.readFile(filePath);
            case 3:
              data = _context44.v;
              return _context44.a(2, JSON.parse(data));
            case 4:
              _context44.p = 4;
              _t18 = _context44.v;
              this.debug.error('Error loading settings:', _t18);
              throw _t18;
            case 5:
              return _context44.a(2);
          }
        }, _callee44, this, [[0, 4]]);
      }));
      function loadSettings() {
        return _loadSettings.apply(this, arguments);
      }
      return loadSettings;
    }()
  }, {
    key: "createBackup",
    value: function () {
      var _createBackup = _asyncToGenerator(_regenerator().m(function _callee45(name) {
        var timestamp, backupId, backupDir, metadata, _t19, _t20, _t21, _t22, _t23;
        return _regenerator().w(function (_context45) {
          while (1) switch (_context45.p = _context45.n) {
            case 0:
              _context45.p = 0;
              timestamp = new Date().toISOString().replace(/[:.]/g, '-');
              backupId = "".concat(timestamp, "_").concat(name || 'manual');
              backupDir = path.join(this.backupsPath, backupId);
              _context45.n = 1;
              return fs.mkdir(backupDir, {
                recursive: true
              });
            case 1:
              _context45.n = 2;
              return this.copyDirectoryRecursive(this.dataPath, backupDir, ['backups', 'cache', 'temp', 'logs']);
            case 2:
              _t19 = backupId;
              _t20 = name || 'Manual Backup';
              _t21 = new Date().toISOString();
              _context45.n = 3;
              return this.getDirectorySize(backupDir);
            case 3:
              _t22 = _context45.v;
              metadata = {
                id: _t19,
                name: _t20,
                created: _t21,
                version: '0.0.1-beta',
                size: _t22
              };
              _context45.n = 4;
              return fs.writeFile(path.join(backupDir, 'backup.json'), JSON.stringify(metadata, null, 2));
            case 4:
              return _context45.a(2, metadata);
            case 5:
              _context45.p = 5;
              _t23 = _context45.v;
              this.debug.error('Error creating backup:', _t23);
              throw _t23;
            case 6:
              return _context45.a(2);
          }
        }, _callee45, this, [[0, 5]]);
      }));
      function createBackup(_x65) {
        return _createBackup.apply(this, arguments);
      }
      return createBackup;
    }()
  }, {
    key: "restoreBackup",
    value: function () {
      var _restoreBackup = _asyncToGenerator(_regenerator().m(function _callee46(backupId) {
        var backupDir, dataEntries, _iterator, _step, entry, entryPath, _t24, _t25;
        return _regenerator().w(function (_context46) {
          while (1) switch (_context46.p = _context46.n) {
            case 0:
              _context46.p = 0;
              backupDir = path.join(this.backupsPath, backupId);
              _context46.n = 1;
              return this.exists(backupDir);
            case 1:
              if (_context46.v) {
                _context46.n = 2;
                break;
              }
              throw new Error('Backup not found');
            case 2:
              _context46.n = 3;
              return this.createBackup('pre_restore');
            case 3:
              _context46.n = 4;
              return fs.readdir(this.dataPath, {
                withFileTypes: true
              });
            case 4:
              dataEntries = _context46.v;
              _iterator = _createForOfIteratorHelper(dataEntries);
              _context46.p = 5;
              _iterator.s();
            case 6:
              if ((_step = _iterator.n()).done) {
                _context46.n = 10;
                break;
              }
              entry = _step.value;
              if (!(entry.name !== 'backups' && entry.name !== 'temp')) {
                _context46.n = 9;
                break;
              }
              entryPath = path.join(this.dataPath, entry.name);
              if (!entry.isDirectory()) {
                _context46.n = 8;
                break;
              }
              _context46.n = 7;
              return fs.rmdir(entryPath, {
                recursive: true
              });
            case 7:
              _context46.n = 9;
              break;
            case 8:
              _context46.n = 9;
              return fs.unlink(entryPath);
            case 9:
              _context46.n = 6;
              break;
            case 10:
              _context46.n = 12;
              break;
            case 11:
              _context46.p = 11;
              _t24 = _context46.v;
              _iterator.e(_t24);
            case 12:
              _context46.p = 12;
              _iterator.f();
              return _context46.f(12);
            case 13:
              _context46.n = 14;
              return this.copyDirectoryRecursive(backupDir, this.dataPath, ['backup.json']);
            case 14:
              return _context46.a(2, true);
            case 15:
              _context46.p = 15;
              _t25 = _context46.v;
              this.debug.error('Error restoring backup:', _t25);
              throw _t25;
            case 16:
              return _context46.a(2);
          }
        }, _callee46, this, [[5, 11, 12, 13], [0, 15]]);
      }));
      function restoreBackup(_x66) {
        return _restoreBackup.apply(this, arguments);
      }
      return restoreBackup;
    }()
  }, {
    key: "listBackups",
    value: function () {
      var _listBackups = _asyncToGenerator(_regenerator().m(function _callee47() {
        var backups, entries, _iterator2, _step2, entry, metadataPath, metadata, _t26, _t27, _t28, _t29;
        return _regenerator().w(function (_context47) {
          while (1) switch (_context47.p = _context47.n) {
            case 0:
              _context47.p = 0;
              backups = [];
              _context47.n = 1;
              return fs.readdir(this.backupsPath, {
                withFileTypes: true
              });
            case 1:
              entries = _context47.v;
              _iterator2 = _createForOfIteratorHelper(entries);
              _context47.p = 2;
              _iterator2.s();
            case 3:
              if ((_step2 = _iterator2.n()).done) {
                _context47.n = 9;
                break;
              }
              entry = _step2.value;
              if (!entry.isDirectory()) {
                _context47.n = 8;
                break;
              }
              metadataPath = path.join(this.backupsPath, entry.name, 'backup.json');
              _context47.n = 4;
              return this.exists(metadataPath);
            case 4:
              if (!_context47.v) {
                _context47.n = 8;
                break;
              }
              _context47.p = 5;
              _t26 = JSON;
              _context47.n = 6;
              return fs.readFile(metadataPath, 'utf8');
            case 6:
              metadata = _t26.parse.call(_t26, _context47.v);
              backups.push(metadata);
              _context47.n = 8;
              break;
            case 7:
              _context47.p = 7;
              _t27 = _context47.v;
              console.warn("Invalid backup metadata: ".concat(entry.name));
            case 8:
              _context47.n = 3;
              break;
            case 9:
              _context47.n = 11;
              break;
            case 10:
              _context47.p = 10;
              _t28 = _context47.v;
              _iterator2.e(_t28);
            case 11:
              _context47.p = 11;
              _iterator2.f();
              return _context47.f(11);
            case 12:
              return _context47.a(2, backups.sort(function (a, b) {
                return new Date(b.created) - new Date(a.created);
              }));
            case 13:
              _context47.p = 13;
              _t29 = _context47.v;
              this.debug.error('Error listing backups:', _t29);
              throw _t29;
            case 14:
              return _context47.a(2);
          }
        }, _callee47, this, [[5, 7], [2, 10, 11, 12], [0, 13]]);
      }));
      function listBackups() {
        return _listBackups.apply(this, arguments);
      }
      return listBackups;
    }()
  }, {
    key: "deleteBackup",
    value: function () {
      var _deleteBackup = _asyncToGenerator(_regenerator().m(function _callee48(backupId) {
        var backupDir, _t30;
        return _regenerator().w(function (_context48) {
          while (1) switch (_context48.p = _context48.n) {
            case 0:
              _context48.p = 0;
              backupDir = path.join(this.backupsPath, backupId);
              _context48.n = 1;
              return fs.rmdir(backupDir, {
                recursive: true
              });
            case 1:
              return _context48.a(2, true);
            case 2:
              _context48.p = 2;
              _t30 = _context48.v;
              this.debug.error("Error deleting backup ".concat(backupId, ":"), _t30);
              throw _t30;
            case 3:
              return _context48.a(2);
          }
        }, _callee48, this, [[0, 2]]);
      }));
      function deleteBackup(_x67) {
        return _deleteBackup.apply(this, arguments);
      }
      return deleteBackup;
    }()
  }, {
    key: "exportData",
    value: function () {
      var _exportData = _asyncToGenerator(_regenerator().m(function _callee49() {
        var options,
          timestamp,
          exportName,
          exportPath,
          _exportData2,
          gamesDir,
          gameFiles,
          _iterator3,
          _step3,
          file,
          gameData,
          achievementsDir,
          achievementFiles,
          _iterator4,
          _step4,
          _file,
          achievementData,
          _args49 = arguments,
          _t31,
          _t32,
          _t33,
          _t34,
          _t35,
          _t36,
          _t37,
          _t38,
          _t39,
          _t40,
          _t41,
          _t42,
          _t43,
          _t44;
        return _regenerator().w(function (_context49) {
          while (1) switch (_context49.p = _context49.n) {
            case 0:
              options = _args49.length > 0 && _args49[0] !== undefined ? _args49[0] : {};
              _context49.p = 1;
              timestamp = new Date().toISOString().replace(/[:.]/g, '-');
              exportName = options.name || "achievements_export_".concat(timestamp);
              exportPath = path.join(this.dataPath, 'exports', "".concat(exportName, ".json"));
              _context49.n = 2;
              return this.ensureDirectoryExists(path.dirname(exportPath));
            case 2:
              _t31 = {
                name: exportName,
                created: new Date().toISOString(),
                version: '0.0.1-beta',
                type: options.type || 'full'
              };
              _t32 = [];
              _t33 = [];
              _context49.n = 3;
              return this.loadSettings();
            case 3:
              _t34 = _context49.v;
              _exportData2 = {
                metadata: _t31,
                games: _t32,
                achievements: _t33,
                settings: _t34
              };
              if (!(options.includeGames !== false)) {
                _context49.n = 15;
                break;
              }
              gamesDir = path.join(this.dataPath, 'games');
              _context49.p = 4;
              _context49.n = 5;
              return fs.readdir(gamesDir);
            case 5:
              gameFiles = _context49.v;
              _iterator3 = _createForOfIteratorHelper(gameFiles);
              _context49.p = 6;
              _iterator3.s();
            case 7:
              if ((_step3 = _iterator3.n()).done) {
                _context49.n = 10;
                break;
              }
              file = _step3.value;
              if (!file.endsWith('.json')) {
                _context49.n = 9;
                break;
              }
              _t35 = JSON;
              _context49.n = 8;
              return fs.readFile(path.join(gamesDir, file), 'utf8');
            case 8:
              gameData = _t35.parse.call(_t35, _context49.v);
              _exportData2.games.push(gameData);
            case 9:
              _context49.n = 7;
              break;
            case 10:
              _context49.n = 12;
              break;
            case 11:
              _context49.p = 11;
              _t36 = _context49.v;
              _iterator3.e(_t36);
            case 12:
              _context49.p = 12;
              _iterator3.f();
              return _context49.f(12);
            case 13:
              _context49.n = 15;
              break;
            case 14:
              _context49.p = 14;
              _t37 = _context49.v;
              console.warn('No games to export:', _t37);
            case 15:
              if (!(options.includeAchievements !== false)) {
                _context49.n = 27;
                break;
              }
              achievementsDir = path.join(this.dataPath, 'achievements');
              _context49.p = 16;
              _context49.n = 17;
              return fs.readdir(achievementsDir);
            case 17:
              achievementFiles = _context49.v;
              _iterator4 = _createForOfIteratorHelper(achievementFiles);
              _context49.p = 18;
              _iterator4.s();
            case 19:
              if ((_step4 = _iterator4.n()).done) {
                _context49.n = 22;
                break;
              }
              _file = _step4.value;
              if (!_file.endsWith('.json')) {
                _context49.n = 21;
                break;
              }
              _t38 = JSON;
              _context49.n = 20;
              return fs.readFile(path.join(achievementsDir, _file), 'utf8');
            case 20:
              achievementData = _t38.parse.call(_t38, _context49.v);
              _exportData2.achievements.push(achievementData);
            case 21:
              _context49.n = 19;
              break;
            case 22:
              _context49.n = 24;
              break;
            case 23:
              _context49.p = 23;
              _t39 = _context49.v;
              _iterator4.e(_t39);
            case 24:
              _context49.p = 24;
              _iterator4.f();
              return _context49.f(24);
            case 25:
              _context49.n = 27;
              break;
            case 26:
              _context49.p = 26;
              _t40 = _context49.v;
              console.warn('No achievements to export:', _t40);
            case 27:
              _context49.n = 28;
              return fs.writeFile(exportPath, JSON.stringify(_exportData2, null, 2));
            case 28:
              _t41 = exportPath;
              _t42 = exportName;
              _context49.n = 29;
              return this.getFileInfo(exportPath);
            case 29:
              _t43 = _context49.v.size;
              return _context49.a(2, {
                path: _t41,
                name: _t42,
                size: _t43
              });
            case 30:
              _context49.p = 30;
              _t44 = _context49.v;
              this.debug.error('Error exporting data:', _t44);
              throw _t44;
            case 31:
              return _context49.a(2);
          }
        }, _callee49, this, [[18, 23, 24, 25], [16, 26], [6, 11, 12, 13], [4, 14], [1, 30]]);
      }));
      function exportData() {
        return _exportData.apply(this, arguments);
      }
      return exportData;
    }()
  }, {
    key: "importData",
    value: function () {
      var _importData = _asyncToGenerator(_regenerator().m(function _callee50(filePath) {
        var data, results, _iterator5, _step5, game, _iterator6, _step6, achievement, _t45, _t46, _t47, _t48;
        return _regenerator().w(function (_context50) {
          while (1) switch (_context50.p = _context50.n) {
            case 0:
              _context50.p = 0;
              _t45 = JSON;
              _context50.n = 1;
              return fs.readFile(filePath, 'utf8');
            case 1:
              data = _t45.parse.call(_t45, _context50.v);
              if (!(!data.metadata || !data.metadata.version)) {
                _context50.n = 2;
                break;
              }
              throw new Error('Invalid export file format');
            case 2:
              _context50.n = 3;
              return this.createBackup('pre_import');
            case 3:
              results = {
                games: 0,
                achievements: 0,
                settings: false
              };
              if (!(data.games && Array.isArray(data.games))) {
                _context50.n = 11;
                break;
              }
              _iterator5 = _createForOfIteratorHelper(data.games);
              _context50.p = 4;
              _iterator5.s();
            case 5:
              if ((_step5 = _iterator5.n()).done) {
                _context50.n = 8;
                break;
              }
              game = _step5.value;
              _context50.n = 6;
              return this.saveGameData(game.id, game);
            case 6:
              results.games++;
            case 7:
              _context50.n = 5;
              break;
            case 8:
              _context50.n = 10;
              break;
            case 9:
              _context50.p = 9;
              _t46 = _context50.v;
              _iterator5.e(_t46);
            case 10:
              _context50.p = 10;
              _iterator5.f();
              return _context50.f(10);
            case 11:
              if (!(data.achievements && Array.isArray(data.achievements))) {
                _context50.n = 19;
                break;
              }
              _iterator6 = _createForOfIteratorHelper(data.achievements);
              _context50.p = 12;
              _iterator6.s();
            case 13:
              if ((_step6 = _iterator6.n()).done) {
                _context50.n = 16;
                break;
              }
              achievement = _step6.value;
              _context50.n = 14;
              return this.saveAchievementData(achievement.gameId, achievement.achievements);
            case 14:
              results.achievements++;
            case 15:
              _context50.n = 13;
              break;
            case 16:
              _context50.n = 18;
              break;
            case 17:
              _context50.p = 17;
              _t47 = _context50.v;
              _iterator6.e(_t47);
            case 18:
              _context50.p = 18;
              _iterator6.f();
              return _context50.f(18);
            case 19:
              if (!data.settings) {
                _context50.n = 21;
                break;
              }
              _context50.n = 20;
              return this.saveSettings(data.settings);
            case 20:
              results.settings = true;
            case 21:
              return _context50.a(2, results);
            case 22:
              _context50.p = 22;
              _t48 = _context50.v;
              this.debug.error('Error importing data:', _t48);
              throw _t48;
            case 23:
              return _context50.a(2);
          }
        }, _callee50, this, [[12, 17, 18, 19], [4, 9, 10, 11], [0, 22]]);
      }));
      function importData(_x68) {
        return _importData.apply(this, arguments);
      }
      return importData;
    }()
  }, {
    key: "showOpenDialog",
    value: function () {
      var _showOpenDialog = _asyncToGenerator(_regenerator().m(function _callee51() {
        var options,
          result,
          _args51 = arguments,
          _t49;
        return _regenerator().w(function (_context51) {
          while (1) switch (_context51.p = _context51.n) {
            case 0:
              options = _args51.length > 0 && _args51[0] !== undefined ? _args51[0] : {};
              _context51.p = 1;
              _context51.n = 2;
              return dialog.showOpenDialog(_objectSpread({
                properties: ['openFile'],
                filters: [{
                  name: 'JSON Files',
                  extensions: ['json']
                }, {
                  name: 'All Files',
                  extensions: ['*']
                }]
              }, options));
            case 2:
              result = _context51.v;
              return _context51.a(2, result);
            case 3:
              _context51.p = 3;
              _t49 = _context51.v;
              this.debug.error('Error showing open dialog:', _t49);
              throw _t49;
            case 4:
              return _context51.a(2);
          }
        }, _callee51, this, [[1, 3]]);
      }));
      function showOpenDialog() {
        return _showOpenDialog.apply(this, arguments);
      }
      return showOpenDialog;
    }()
  }, {
    key: "showSaveDialog",
    value: function () {
      var _showSaveDialog = _asyncToGenerator(_regenerator().m(function _callee52() {
        var options,
          result,
          _args52 = arguments,
          _t50;
        return _regenerator().w(function (_context52) {
          while (1) switch (_context52.p = _context52.n) {
            case 0:
              options = _args52.length > 0 && _args52[0] !== undefined ? _args52[0] : {};
              _context52.p = 1;
              _context52.n = 2;
              return dialog.showSaveDialog(_objectSpread({
                filters: [{
                  name: 'JSON Files',
                  extensions: ['json']
                }, {
                  name: 'All Files',
                  extensions: ['*']
                }]
              }, options));
            case 2:
              result = _context52.v;
              return _context52.a(2, result);
            case 3:
              _context52.p = 3;
              _t50 = _context52.v;
              this.debug.error('Error showing save dialog:', _t50);
              throw _t50;
            case 4:
              return _context52.a(2);
          }
        }, _callee52, this, [[1, 3]]);
      }));
      function showSaveDialog() {
        return _showSaveDialog.apply(this, arguments);
      }
      return showSaveDialog;
    }()
  }, {
    key: "clearCache",
    value: function () {
      var _clearCache = _asyncToGenerator(_regenerator().m(function _callee53() {
        var _t51;
        return _regenerator().w(function (_context53) {
          while (1) switch (_context53.p = _context53.n) {
            case 0:
              _context53.p = 0;
              _context53.n = 1;
              return fs.rmdir(this.cachePath, {
                recursive: true
              });
            case 1:
              _context53.n = 2;
              return fs.mkdir(this.cachePath, {
                recursive: true
              });
            case 2:
              return _context53.a(2, true);
            case 3:
              _context53.p = 3;
              _t51 = _context53.v;
              this.debug.error('Error clearing cache:', _t51);
              throw _t51;
            case 4:
              return _context53.a(2);
          }
        }, _callee53, this, [[0, 3]]);
      }));
      function clearCache() {
        return _clearCache.apply(this, arguments);
      }
      return clearCache;
    }()
  }, {
    key: "getCacheSize",
    value: function () {
      var _getCacheSize = _asyncToGenerator(_regenerator().m(function _callee54() {
        var _t52;
        return _regenerator().w(function (_context54) {
          while (1) switch (_context54.p = _context54.n) {
            case 0:
              _context54.p = 0;
              _context54.n = 1;
              return this.getDirectorySize(this.cachePath);
            case 1:
              return _context54.a(2, _context54.v);
            case 2:
              _context54.p = 2;
              _t52 = _context54.v;
              this.debug.error('Error getting cache size:', _t52);
              return _context54.a(2, 0);
          }
        }, _callee54, this, [[0, 2]]);
      }));
      function getCacheSize() {
        return _getCacheSize.apply(this, arguments);
      }
      return getCacheSize;
    }()
  }, {
    key: "getLogs",
    value: function () {
      var _getLogs = _asyncToGenerator(_regenerator().m(function _callee55() {
        var options,
          logs,
          logFiles,
          _iterator7,
          _step7,
          file,
          filePath,
          content,
          stats,
          _args55 = arguments,
          _t53,
          _t54;
        return _regenerator().w(function (_context55) {
          while (1) switch (_context55.p = _context55.n) {
            case 0:
              options = _args55.length > 0 && _args55[0] !== undefined ? _args55[0] : {};
              _context55.p = 1;
              logs = [];
              _context55.n = 2;
              return fs.readdir(this.logsPath);
            case 2:
              logFiles = _context55.v;
              _iterator7 = _createForOfIteratorHelper(logFiles);
              _context55.p = 3;
              _iterator7.s();
            case 4:
              if ((_step7 = _iterator7.n()).done) {
                _context55.n = 8;
                break;
              }
              file = _step7.value;
              if (!file.endsWith('.log')) {
                _context55.n = 7;
                break;
              }
              filePath = path.join(this.logsPath, file);
              _context55.n = 5;
              return fs.readFile(filePath, 'utf8');
            case 5:
              content = _context55.v;
              _context55.n = 6;
              return this.getFileInfo(filePath);
            case 6:
              stats = _context55.v;
              logs.push({
                name: file,
                content: content,
                size: stats.size,
                modified: stats.modified
              });
            case 7:
              _context55.n = 4;
              break;
            case 8:
              _context55.n = 10;
              break;
            case 9:
              _context55.p = 9;
              _t53 = _context55.v;
              _iterator7.e(_t53);
            case 10:
              _context55.p = 10;
              _iterator7.f();
              return _context55.f(10);
            case 11:
              return _context55.a(2, logs.sort(function (a, b) {
                return new Date(b.modified) - new Date(a.modified);
              }));
            case 12:
              _context55.p = 12;
              _t54 = _context55.v;
              this.debug.error('Error getting logs:', _t54);
              throw _t54;
            case 13:
              return _context55.a(2);
          }
        }, _callee55, this, [[3, 9, 10, 11], [1, 12]]);
      }));
      function getLogs() {
        return _getLogs.apply(this, arguments);
      }
      return getLogs;
    }()
  }, {
    key: "clearLogs",
    value: function () {
      var _clearLogs = _asyncToGenerator(_regenerator().m(function _callee56() {
        var logFiles, _iterator8, _step8, file, _t55, _t56;
        return _regenerator().w(function (_context56) {
          while (1) switch (_context56.p = _context56.n) {
            case 0:
              _context56.p = 0;
              _context56.n = 1;
              return fs.readdir(this.logsPath);
            case 1:
              logFiles = _context56.v;
              _iterator8 = _createForOfIteratorHelper(logFiles);
              _context56.p = 2;
              _iterator8.s();
            case 3:
              if ((_step8 = _iterator8.n()).done) {
                _context56.n = 5;
                break;
              }
              file = _step8.value;
              if (!file.endsWith('.log')) {
                _context56.n = 4;
                break;
              }
              _context56.n = 4;
              return fs.unlink(path.join(this.logsPath, file));
            case 4:
              _context56.n = 3;
              break;
            case 5:
              _context56.n = 7;
              break;
            case 6:
              _context56.p = 6;
              _t55 = _context56.v;
              _iterator8.e(_t55);
            case 7:
              _context56.p = 7;
              _iterator8.f();
              return _context56.f(7);
            case 8:
              return _context56.a(2, true);
            case 9:
              _context56.p = 9;
              _t56 = _context56.v;
              this.debug.error('Error clearing logs:', _t56);
              throw _t56;
            case 10:
              return _context56.a(2);
          }
        }, _callee56, this, [[2, 6, 7, 8], [0, 9]]);
      }));
      function clearLogs() {
        return _clearLogs.apply(this, arguments);
      }
      return clearLogs;
    }()
  }, {
    key: "copyFile",
    value: function () {
      var _copyFile = _asyncToGenerator(_regenerator().m(function _callee57(sourcePath, destPath) {
        var safeSrc, safeDest, _t57;
        return _regenerator().w(function (_context57) {
          while (1) switch (_context57.p = _context57.n) {
            case 0:
              _context57.p = 0;
              safeSrc = this.getSafePath(sourcePath);
              safeDest = this.getSafePath(destPath);
              _context57.n = 1;
              return this.ensureDirectoryExists(path.dirname(safeDest));
            case 1:
              _context57.n = 2;
              return fs.copyFile(safeSrc, safeDest);
            case 2:
              return _context57.a(2, true);
            case 3:
              _context57.p = 3;
              _t57 = _context57.v;
              this.debug.error("Error copying file from ".concat(sourcePath, " to ").concat(destPath, ":"), _t57);
              _context57.n = 4;
              return this.reportFilesystemError('copyFile', _t57, {
                sourcePath: sourcePath,
                destPath: destPath,
                safeSrc: safeSrc || 'unknown',
                safeDest: safeDest || 'unknown'
              });
            case 4:
              throw _t57;
            case 5:
              return _context57.a(2);
          }
        }, _callee57, this, [[0, 3]]);
      }));
      function copyFile(_x69, _x70) {
        return _copyFile.apply(this, arguments);
      }
      return copyFile;
    }()
  }, {
    key: "moveFile",
    value: function () {
      var _moveFile = _asyncToGenerator(_regenerator().m(function _callee58(sourcePath, destPath) {
        var safeSrc, safeDest, _t58;
        return _regenerator().w(function (_context58) {
          while (1) switch (_context58.p = _context58.n) {
            case 0:
              _context58.p = 0;
              safeSrc = this.getSafePath(sourcePath);
              safeDest = this.getSafePath(destPath);
              _context58.n = 1;
              return this.ensureDirectoryExists(path.dirname(safeDest));
            case 1:
              _context58.n = 2;
              return fs.rename(safeSrc, safeDest);
            case 2:
              return _context58.a(2, true);
            case 3:
              _context58.p = 3;
              _t58 = _context58.v;
              this.debug.error("Error moving file from ".concat(sourcePath, " to ").concat(destPath, ":"), _t58);
              _context58.n = 4;
              return this.reportFilesystemError('moveFile', _t58, {
                sourcePath: sourcePath,
                destPath: destPath,
                safeSrc: safeSrc || 'unknown',
                safeDest: safeDest || 'unknown'
              });
            case 4:
              throw _t58;
            case 5:
              return _context58.a(2);
          }
        }, _callee58, this, [[0, 3]]);
      }));
      function moveFile(_x71, _x72) {
        return _moveFile.apply(this, arguments);
      }
      return moveFile;
    }()
  }, {
    key: "copyDirectoryRecursive",
    value: function () {
      var _copyDirectoryRecursive = _asyncToGenerator(_regenerator().m(function _callee59(source, destination) {
        var exclude,
          entries,
          _iterator9,
          _step9,
          entry,
          sourcePath,
          destPath,
          _args59 = arguments,
          _t59;
        return _regenerator().w(function (_context59) {
          while (1) switch (_context59.p = _context59.n) {
            case 0:
              exclude = _args59.length > 2 && _args59[2] !== undefined ? _args59[2] : [];
              _context59.n = 1;
              return fs.mkdir(destination, {
                recursive: true
              });
            case 1:
              _context59.n = 2;
              return fs.readdir(source, {
                withFileTypes: true
              });
            case 2:
              entries = _context59.v;
              _iterator9 = _createForOfIteratorHelper(entries);
              _context59.p = 3;
              _iterator9.s();
            case 4:
              if ((_step9 = _iterator9.n()).done) {
                _context59.n = 9;
                break;
              }
              entry = _step9.value;
              if (!exclude.includes(entry.name)) {
                _context59.n = 5;
                break;
              }
              return _context59.a(3, 8);
            case 5:
              sourcePath = path.join(source, entry.name);
              destPath = path.join(destination, entry.name);
              if (!entry.isDirectory()) {
                _context59.n = 7;
                break;
              }
              _context59.n = 6;
              return this.copyDirectoryRecursive(sourcePath, destPath, exclude);
            case 6:
              _context59.n = 8;
              break;
            case 7:
              _context59.n = 8;
              return fs.copyFile(sourcePath, destPath);
            case 8:
              _context59.n = 4;
              break;
            case 9:
              _context59.n = 11;
              break;
            case 10:
              _context59.p = 10;
              _t59 = _context59.v;
              _iterator9.e(_t59);
            case 11:
              _context59.p = 11;
              _iterator9.f();
              return _context59.f(11);
            case 12:
              return _context59.a(2);
          }
        }, _callee59, this, [[3, 10, 11, 12]]);
      }));
      function copyDirectoryRecursive(_x73, _x74) {
        return _copyDirectoryRecursive.apply(this, arguments);
      }
      return copyDirectoryRecursive;
    }()
  }, {
    key: "getDirectorySize",
    value: function () {
      var _getDirectorySize = _asyncToGenerator(_regenerator().m(function _callee60(dirPath) {
        var totalSize, entries, _iterator0, _step0, entry, entryPath, stats, _t60, _t61, _t62;
        return _regenerator().w(function (_context60) {
          while (1) switch (_context60.p = _context60.n) {
            case 0:
              totalSize = 0;
              _context60.p = 1;
              _context60.n = 2;
              return fs.readdir(dirPath, {
                withFileTypes: true
              });
            case 2:
              entries = _context60.v;
              _iterator0 = _createForOfIteratorHelper(entries);
              _context60.p = 3;
              _iterator0.s();
            case 4:
              if ((_step0 = _iterator0.n()).done) {
                _context60.n = 9;
                break;
              }
              entry = _step0.value;
              entryPath = path.join(dirPath, entry.name);
              if (!entry.isDirectory()) {
                _context60.n = 6;
                break;
              }
              _t60 = totalSize;
              _context60.n = 5;
              return this.getDirectorySize(entryPath);
            case 5:
              totalSize = _t60 += _context60.v;
              _context60.n = 8;
              break;
            case 6:
              _context60.n = 7;
              return fs.stat(entryPath);
            case 7:
              stats = _context60.v;
              totalSize += stats.size;
            case 8:
              _context60.n = 4;
              break;
            case 9:
              _context60.n = 11;
              break;
            case 10:
              _context60.p = 10;
              _t61 = _context60.v;
              _iterator0.e(_t61);
            case 11:
              _context60.p = 11;
              _iterator0.f();
              return _context60.f(11);
            case 12:
              _context60.n = 14;
              break;
            case 13:
              _context60.p = 13;
              _t62 = _context60.v;
              console.warn("Error calculating directory size for ".concat(dirPath, ":"), _t62);
            case 14:
              return _context60.a(2, totalSize);
          }
        }, _callee60, this, [[3, 10, 11, 12], [1, 13]]);
      }));
      function getDirectorySize(_x75) {
        return _getDirectorySize.apply(this, arguments);
      }
      return getDirectorySize;
    }()
  }, {
    key: "setupFileWatchers",
    value: function setupFileWatchers() {
      var watchOptions = {
        recursive: true
      };
      try {
        fs.watch(this.dataPath, watchOptions, function (eventType, filename) {
          if (filename && !filename.includes('temp') && !filename.includes('cache')) {
            if (global.mainWindow && !global.mainWindow.isDestroyed()) {
              try {
                var fileChangeData = JSON.parse(JSON.stringify({
                  type: String(eventType || 'unknown'),
                  filename: String(filename || ''),
                  timestamp: new Date().toISOString()
                }));
                try {
                  structuredClone(fileChangeData);
                  global.mainWindow.webContents.send('file-changed', fileChangeData);
                } catch (cloneError) {
                  console.error('📁 [FILESYSTEM] ❌ ERRO DE CLONAGEM em file-changed:', cloneError);
                  console.error('📁 [FILESYSTEM] Dados problemáticos:', fileChangeData);
                }
              } catch (sendError) {
                console.error('📁 [FILESYSTEM] ❌ Erro ao enviar evento file-changed:', sendError);
              }
            }
          }
        });
      } catch (error) {
        console.warn('Could not setup file watchers:', error);
      }
    }
  }]);
}();
var filesystemManager = null;
function setupFileSystem(_x76, _x77) {
  return _setupFileSystem.apply(this, arguments);
}
function _setupFileSystem() {
  _setupFileSystem = _asyncToGenerator(_regenerator().m(function _callee61(store, pathManager) {
    var crashReporter,
      configManager,
      _args61 = arguments;
    return _regenerator().w(function (_context61) {
      while (1) switch (_context61.n) {
        case 0:
          crashReporter = _args61.length > 2 && _args61[2] !== undefined ? _args61[2] : null;
          configManager = _args61.length > 3 && _args61[3] !== undefined ? _args61[3] : null;
          filesystemManager = new FilesystemManager(pathManager, crashReporter, configManager);
          _context61.n = 1;
          return filesystemManager.init();
        case 1:
          filesystemManager.setupIPC();
          return _context61.a(2, filesystemManager);
      }
    }, _callee61);
  }));
  return _setupFileSystem.apply(this, arguments);
}
module.exports = {
  FilesystemManager: FilesystemManager,
  setupFileSystem: setupFileSystem
};