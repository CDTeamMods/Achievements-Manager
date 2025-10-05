"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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
  ipcMain = _require.ipcMain;
var fs = require('fs').promises;
var path = require('path');
var os = require('os');
var GSESavesManager = function () {
  function GSESavesManager(pathManager, debugManager) {
    _classCallCheck(this, GSESavesManager);
    this.pathManager = pathManager;
    this.debugManager = debugManager;
    this.gseSavesPaths = [];
    this.isInitialized = false;
  }
  return _createClass(GSESavesManager, [{
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator(_regenerator().m(function _callee() {
        var currentUser, _this$debugManager, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return this.detectGSESavesPaths();
            case 1:
              this.setupIpcHandlers();
              this.isInitialized = true;
              currentUser = this.getCurrentUser();
              return _context.a(2, true);
            case 2:
              _context.p = 2;
              _t = _context.v;
              (_this$debugManager = this.debugManager) === null || _this$debugManager === void 0 || _this$debugManager.error('❌ Erro ao inicializar GSE Saves Manager:', _t);
              return _context.a(2, false);
          }
        }, _callee, this, [[0, 2]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
  }, {
    key: "getCurrentUser",
    value: function getCurrentUser() {
      try {
        var _this$debugManager8;
        var username = process.env.USERNAME || process.env.USER;
        if (username && username.trim()) {
          var _this$debugManager2;
          (_this$debugManager2 = this.debugManager) === null || _this$debugManager2 === void 0 || _this$debugManager2.log("\uD83D\uDC64 Usu\xE1rio detectado via env: ".concat(username));
          return username.trim();
        }
        try {
          var userInfo = os.userInfo();
          if (userInfo && userInfo.username && userInfo.username.trim()) {
            var _this$debugManager3;
            username = userInfo.username.trim();
            (_this$debugManager3 = this.debugManager) === null || _this$debugManager3 === void 0 || _this$debugManager3.log("\uD83D\uDC64 Usu\xE1rio detectado via os.userInfo: ".concat(username));
            return username;
          }
        } catch (osError) {
          var _this$debugManager4;
          console.log('❌ [GSE] os.userInfo() falhou:', osError.message);
          (_this$debugManager4 = this.debugManager) === null || _this$debugManager4 === void 0 || _this$debugManager4.warn('⚠️ os.userInfo() falhou:', osError.message);
        }
        try {
          var homedir = os.homedir();
          if (homedir) {
            var pathParts = homedir.split(path.sep);
            var usernameFromPath = pathParts[pathParts.length - 1];
            if (usernameFromPath && usernameFromPath.trim() && usernameFromPath !== 'Users') {
              var _this$debugManager5;
              username = usernameFromPath.trim();
              (_this$debugManager5 = this.debugManager) === null || _this$debugManager5 === void 0 || _this$debugManager5.log("\uD83D\uDC64 Usu\xE1rio detectado via homedir: ".concat(username));
              return username;
            }
          }
        } catch (homedirError) {
          var _this$debugManager6;
          console.log('❌ [GSE] Extração do homedir falhou:', homedirError.message);
          (_this$debugManager6 = this.debugManager) === null || _this$debugManager6 === void 0 || _this$debugManager6.warn('⚠️ Extração do homedir falhou:', homedirError.message);
        }
        var alternativeEnvs = ['USERPROFILE', 'LOGNAME', 'USER_NAME'];
        for (var _i = 0, _alternativeEnvs = alternativeEnvs; _i < _alternativeEnvs.length; _i++) {
          var envVar = _alternativeEnvs[_i];
          var envValue = process.env[envVar];
          if (envValue) {
            if (envValue.includes(path.sep)) {
              var _pathParts = envValue.split(path.sep);
              username = _pathParts[_pathParts.length - 1];
            } else {
              username = envValue;
            }
            if (username && username.trim()) {
              var _this$debugManager7;
              (_this$debugManager7 = this.debugManager) === null || _this$debugManager7 === void 0 || _this$debugManager7.log("\uD83D\uDC64 Usu\xE1rio detectado via ".concat(envVar, ": ").concat(username));
              return username.trim();
            }
          }
        }
        console.log('❌ [GSE] Não foi possível detectar o usuário do sistema');
        (_this$debugManager8 = this.debugManager) === null || _this$debugManager8 === void 0 || _this$debugManager8.warn('⚠️ Não foi possível detectar o usuário do sistema');
        return null;
      } catch (error) {
        var _this$debugManager9;
        console.log('❌ [GSE] Erro ao detectar usuário:', error);
        (_this$debugManager9 = this.debugManager) === null || _this$debugManager9 === void 0 || _this$debugManager9.error('❌ Erro ao detectar usuário:', error);
        return null;
      }
    }
  }, {
    key: "checkDirectoryExists",
    value: (function () {
      var _checkDirectoryExists = _asyncToGenerator(_regenerator().m(function _callee2(dirPath) {
        var stats, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return fs.stat(dirPath);
            case 1:
              stats = _context2.v;
              return _context2.a(2, stats.isDirectory());
            case 2:
              _context2.p = 2;
              _t2 = _context2.v;
              return _context2.a(2, false);
          }
        }, _callee2, null, [[0, 2]]);
      }));
      function checkDirectoryExists(_x) {
        return _checkDirectoryExists.apply(this, arguments);
      }
      return checkDirectoryExists;
    }())
  }, {
    key: "detectGSESavesPaths",
    value: (function () {
      var _detectGSESavesPaths = _asyncToGenerator(_regenerator().m(function _callee3() {
        var _this$debugManager0;
        var currentUser, possiblePaths, _i2, _possiblePaths, dirPath, exists, _this$debugManager1, _this$debugManager10, _this$debugManager11;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              (_this$debugManager0 = this.debugManager) === null || _this$debugManager0 === void 0 || _this$debugManager0.log('🔍 Detectando pastas do GSE Saves...');
              currentUser = this.getCurrentUser();
              if (currentUser) {
                _context3.n = 1;
                break;
              }
              throw new Error('Não foi possível detectar o usuário atual');
            case 1:
              possiblePaths = ["C:\\Users\\".concat(currentUser, "\\AppData\\Roaming\\GSE Saves"), "C:\\Users\\".concat(currentUser, "\\AppData\\Roaming\\Goldberg SteamEmu Saves"), "C:\\Users\\".concat(currentUser, "\\Documents\\GSE Saves"), "C:\\Users\\".concat(currentUser, "\\Documents\\Goldberg SteamEmu Saves")];
              this.gseSavesPaths = [];
              _i2 = 0, _possiblePaths = possiblePaths;
            case 2:
              if (!(_i2 < _possiblePaths.length)) {
                _context3.n = 5;
                break;
              }
              dirPath = _possiblePaths[_i2];
              _context3.n = 3;
              return this.checkDirectoryExists(dirPath);
            case 3:
              exists = _context3.v;
              if (exists) {
                (_this$debugManager1 = this.debugManager) === null || _this$debugManager1 === void 0 || _this$debugManager1.log("\u2705 Pasta encontrada: ".concat(dirPath));
                this.gseSavesPaths.push({
                  path: dirPath,
                  type: dirPath.includes('Goldberg') ? 'goldberg' : 'gse',
                  name: path.basename(dirPath)
                });
              }
            case 4:
              _i2++;
              _context3.n = 2;
              break;
            case 5:
              if (this.gseSavesPaths.length === 0) {
                (_this$debugManager10 = this.debugManager) === null || _this$debugManager10 === void 0 || _this$debugManager10.log('⚠️ Nenhuma pasta GSE Saves encontrada');
              } else {
                (_this$debugManager11 = this.debugManager) === null || _this$debugManager11 === void 0 || _this$debugManager11.log("\uD83C\uDFAF Total de pastas GSE Saves encontradas: ".concat(this.gseSavesPaths.length));
              }
              return _context3.a(2, this.gseSavesPaths);
          }
        }, _callee3, this);
      }));
      function detectGSESavesPaths() {
        return _detectGSESavesPaths.apply(this, arguments);
      }
      return detectGSESavesPaths;
    }())
  }, {
    key: "getGSESavesGames",
    value: (function () {
      var _getGSESavesGames = _asyncToGenerator(_regenerator().m(function _callee4() {
        var _this$debugManager12, games, _iterator, _step, _this$debugManager13, saveFolder, entries, _iterator2, _step2, entry, gamePath, _this$debugManager14, _this$debugManager15, _t3, _t4, _t5;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              if (this.isInitialized) {
                _context4.n = 1;
                break;
              }
              _context4.n = 1;
              return this.initialize();
            case 1:
              games = [];
              _iterator = _createForOfIteratorHelper(this.gseSavesPaths);
              _context4.p = 2;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context4.n = 8;
                break;
              }
              saveFolder = _step.value;
              (_this$debugManager13 = this.debugManager) === null || _this$debugManager13 === void 0 || _this$debugManager13.log("\uD83C\uDFAE Escaneando jogos em: ".concat(saveFolder.path));
              _context4.p = 4;
              _context4.n = 5;
              return fs.readdir(saveFolder.path, {
                withFileTypes: true
              });
            case 5:
              entries = _context4.v;
              _iterator2 = _createForOfIteratorHelper(entries);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  entry = _step2.value;
                  if (entry.isDirectory()) {
                    gamePath = path.join(saveFolder.path, entry.name);
                    games.push({
                      id: entry.name,
                      name: entry.name,
                      path: gamePath,
                      source: saveFolder.type,
                      sourceFolder: saveFolder.name
                    });
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              _context4.n = 7;
              break;
            case 6:
              _context4.p = 6;
              _t3 = _context4.v;
              (_this$debugManager14 = this.debugManager) === null || _this$debugManager14 === void 0 || _this$debugManager14.error("\u274C Erro ao escanear ".concat(saveFolder.path, ":"), _t3);
            case 7:
              _context4.n = 3;
              break;
            case 8:
              _context4.n = 10;
              break;
            case 9:
              _context4.p = 9;
              _t4 = _context4.v;
              _iterator.e(_t4);
            case 10:
              _context4.p = 10;
              _iterator.f();
              return _context4.f(10);
            case 11:
              (_this$debugManager12 = this.debugManager) === null || _this$debugManager12 === void 0 || _this$debugManager12.log("\uD83C\uDFAF Total de jogos encontrados: ".concat(games.length));
              return _context4.a(2, games);
            case 12:
              _context4.p = 12;
              _t5 = _context4.v;
              (_this$debugManager15 = this.debugManager) === null || _this$debugManager15 === void 0 || _this$debugManager15.error('❌ Erro ao buscar jogos GSE Saves:', _t5);
              return _context4.a(2, []);
          }
        }, _callee4, this, [[4, 6], [2, 9, 10, 11], [0, 12]]);
      }));
      function getGSESavesGames() {
        return _getGSESavesGames.apply(this, arguments);
      }
      return getGSESavesGames;
    }())
  }, {
    key: "getGSESavesAchievements",
    value: (function () {
      var _getGSESavesAchievements = _asyncToGenerator(_regenerator().m(function _callee5(gameId) {
        var _this$debugManager16, _this$debugManager17, achievements, _iterator3, _step3, saveFolder, gamePath, exists, _this$debugManager18, files, _iterator4, _step4, file, filePath, _this$debugManager19, _t6, _t7;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              (_this$debugManager16 = this.debugManager) === null || _this$debugManager16 === void 0 || _this$debugManager16.log("\uD83C\uDFC6 Buscando achievements para: ".concat(gameId));
              achievements = [];
              _iterator3 = _createForOfIteratorHelper(this.gseSavesPaths);
              _context5.p = 1;
              _iterator3.s();
            case 2:
              if ((_step3 = _iterator3.n()).done) {
                _context5.n = 6;
                break;
              }
              saveFolder = _step3.value;
              gamePath = path.join(saveFolder.path, gameId);
              _context5.n = 3;
              return this.checkDirectoryExists(gamePath);
            case 3:
              exists = _context5.v;
              if (!exists) {
                _context5.n = 5;
                break;
              }
              (_this$debugManager18 = this.debugManager) === null || _this$debugManager18 === void 0 || _this$debugManager18.log("\uD83D\uDCC1 Jogo encontrado em: ".concat(gamePath));
              _context5.n = 4;
              return fs.readdir(gamePath);
            case 4:
              files = _context5.v;
              _iterator4 = _createForOfIteratorHelper(files);
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  file = _step4.value;
                  if (file.includes('achievement') || file.includes('stats') || file.endsWith('.dat')) {
                    filePath = path.join(gamePath, file);
                    achievements.push({
                      id: file,
                      name: file,
                      path: filePath,
                      source: saveFolder.type,
                      unlocked: true,
                      unlockedAt: null
                    });
                  }
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
            case 5:
              _context5.n = 2;
              break;
            case 6:
              _context5.n = 8;
              break;
            case 7:
              _context5.p = 7;
              _t6 = _context5.v;
              _iterator3.e(_t6);
            case 8:
              _context5.p = 8;
              _iterator3.f();
              return _context5.f(8);
            case 9:
              (_this$debugManager17 = this.debugManager) === null || _this$debugManager17 === void 0 || _this$debugManager17.log("\uD83C\uDFC6 Achievements encontrados para ".concat(gameId, ": ").concat(achievements.length));
              return _context5.a(2, achievements);
            case 10:
              _context5.p = 10;
              _t7 = _context5.v;
              (_this$debugManager19 = this.debugManager) === null || _this$debugManager19 === void 0 || _this$debugManager19.error("\u274C Erro ao buscar achievements para ".concat(gameId, ":"), _t7);
              return _context5.a(2, []);
          }
        }, _callee5, this, [[1, 7, 8, 9], [0, 10]]);
      }));
      function getGSESavesAchievements(_x2) {
        return _getGSESavesAchievements.apply(this, arguments);
      }
      return getGSESavesAchievements;
    }())
  }, {
    key: "setupIpcHandlers",
    value: function setupIpcHandlers() {
      var _this = this;
      ipcMain.handle('gse:detectPaths', _asyncToGenerator(_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return _this.detectGSESavesPaths();
            case 1:
              return _context6.a(2, _context6.v);
          }
        }, _callee6);
      })));
      ipcMain.handle('gse:getCurrentUser', function () {
        return _this.getCurrentUser();
      });
      ipcMain.handle('gse:getGames', _asyncToGenerator(_regenerator().m(function _callee7() {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              _context7.n = 1;
              return _this.getGSESavesGames();
            case 1:
              return _context7.a(2, _context7.v);
          }
        }, _callee7);
      })));
      ipcMain.handle('gse:getAchievements', function () {
        var _ref3 = _asyncToGenerator(_regenerator().m(function _callee8(event, gameId) {
          return _regenerator().w(function (_context8) {
            while (1) switch (_context8.n) {
              case 0:
                _context8.n = 1;
                return _this.getGSESavesAchievements(gameId);
              case 1:
                return _context8.a(2, _context8.v);
            }
          }, _callee8);
        }));
        return function (_x3, _x4) {
          return _ref3.apply(this, arguments);
        };
      }());
      ipcMain.handle('gse:getStatus', function () {
        return {
          initialized: _this.isInitialized,
          pathsFound: _this.gseSavesPaths.length,
          paths: _this.gseSavesPaths,
          currentUser: _this.getCurrentUser()
        };
      });
    }
  }]);
}();
module.exports = {
  GSESavesManager: GSESavesManager
};