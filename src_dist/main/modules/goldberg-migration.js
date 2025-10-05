"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
  ipcMain = _require.ipcMain,
  dialog = _require.dialog;
var fs = require('fs').promises;
var path = require('path');
var os = require('os');
var _require2 = require('./debug-manager'),
  getDebugManager = _require2.getDebugManager;
var GoldbergMigrationManager = function () {
  function GoldbergMigrationManager() {
    var crashReporter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var pathManager = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, GoldbergMigrationManager);
    this.currentUser = null;
    this.goldbergPath = null;
    this.gseSavesPath = null;
    this.isInitialized = false;
    this.crashReporter = crashReporter;
    this.pathManager = pathManager;
    this.debugManager = getDebugManager();
    this.migrationSettings = {
      autoMigration: false,
      showDialog: true,
      lastCheck: null
    };
  }
  return _createClass(GoldbergMigrationManager, [{
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(_regenerator().m(function _callee() {
        var _this = this;
        var goldbergInfo, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              this.currentUser = this.getCurrentUser();
              this.goldbergPath = path.join('C:', 'Users', this.currentUser, 'AppData', 'Roaming', 'Goldberg SteamEmu Saves');
              this.gseSavesPath = this.pathManager ? path.join(this.pathManager.getDataPath(), 'GSE Saves') : path.join(__dirname, '..', '..', 'data', 'GSE Saves');
              _context.n = 1;
              return this.loadMigrationSettings();
            case 1:
              this.setupIpcHandlers();
              this.isInitialized = true;
              _context.n = 2;
              return this.checkGoldbergFolder();
            case 2:
              goldbergInfo = _context.v;
              if (goldbergInfo.exists && this.migrationSettings.autoMigration) {
                this.debugManager.log('🔄 Executando verificação automática na inicialização...');
                setTimeout(function () {
                  _this.performAutoCheck();
                }, 3000);
              }
              return _context.a(2, true);
            case 3:
              _context.p = 3;
              _t = _context.v;
              this.debugManager.error('❌ Erro ao inicializar Goldberg Migration Manager:', _t);
              if (this.crashReporter && this.crashReporter.reportError) {
                this.crashReporter.reportError('GoldbergMigrationManager.initialize', _t);
              }
              return _context.a(2, false);
          }
        }, _callee, this, [[0, 3]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }())
  }, {
    key: "getCurrentUser",
    value: function getCurrentUser() {
      try {
        var _this$debugManager7;
        var username = process.env.USERNAME || process.env.USER;
        if (username && username.trim()) {
          var _this$debugManager;
          (_this$debugManager = this.debugManager) === null || _this$debugManager === void 0 || _this$debugManager.log("\uD83D\uDC64 Usu\xE1rio detectado via env: ".concat(username));
          return username.trim();
        }
        try {
          var userInfo = os.userInfo();
          if (userInfo && userInfo.username && userInfo.username.trim()) {
            var _this$debugManager2;
            username = userInfo.username.trim();
            (_this$debugManager2 = this.debugManager) === null || _this$debugManager2 === void 0 || _this$debugManager2.log("\uD83D\uDC64 Usu\xE1rio detectado via os.userInfo: ".concat(username));
            return username;
          }
        } catch (osError) {
          var _this$debugManager3;
          console.log('❌ [Goldberg] os.userInfo() falhou:', osError.message);
          (_this$debugManager3 = this.debugManager) === null || _this$debugManager3 === void 0 || _this$debugManager3.warn('⚠️ os.userInfo() falhou:', osError.message);
        }
        try {
          var homedir = os.homedir();
          if (homedir) {
            var pathParts = homedir.split(path.sep);
            var usernameFromPath = pathParts[pathParts.length - 1];
            if (usernameFromPath && usernameFromPath.trim() && usernameFromPath !== 'Users') {
              var _this$debugManager4;
              username = usernameFromPath.trim();
              (_this$debugManager4 = this.debugManager) === null || _this$debugManager4 === void 0 || _this$debugManager4.log("\uD83D\uDC64 Usu\xE1rio detectado via homedir: ".concat(username));
              return username;
            }
          }
        } catch (homedirError) {
          var _this$debugManager5;
          (_this$debugManager5 = this.debugManager) === null || _this$debugManager5 === void 0 || _this$debugManager5.warn('⚠️ Extração do homedir falhou:', homedirError.message);
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
              var _this$debugManager6;
              (_this$debugManager6 = this.debugManager) === null || _this$debugManager6 === void 0 || _this$debugManager6.log("\uD83D\uDC64 Usu\xE1rio detectado via ".concat(envVar, ": ").concat(username));
              return username.trim();
            }
          }
        }
        (_this$debugManager7 = this.debugManager) === null || _this$debugManager7 === void 0 || _this$debugManager7.warn('⚠️ Não foi possível detectar o usuário do sistema');
        return 'DefaultUser';
      } catch (error) {
        var _this$debugManager8;
        (_this$debugManager8 = this.debugManager) === null || _this$debugManager8 === void 0 || _this$debugManager8.error('❌ Erro ao detectar usuário:', error);
        return 'DefaultUser';
      }
    }
  }, {
    key: "checkGoldbergFolder",
    value: (function () {
      var _checkGoldbergFolder = _asyncToGenerator(_regenerator().m(function _callee2() {
        var currentUser, stats, exists, games, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              currentUser = this.getCurrentUser();
              _context2.n = 1;
              return fs.stat(this.goldbergPath);
            case 1:
              stats = _context2.v;
              exists = stats.isDirectory();
              if (!exists) {
                _context2.n = 3;
                break;
              }
              _context2.n = 2;
              return this.getGoldbergGames();
            case 2:
              games = _context2.v;
              return _context2.a(2, {
                exists: true,
                path: this.goldbergPath,
                gamesCount: games.length,
                games: games,
                currentUser: currentUser
              });
            case 3:
              return _context2.a(2, {
                exists: false,
                path: this.goldbergPath,
                gamesCount: 0,
                games: [],
                currentUser: currentUser
              });
            case 4:
              _context2.p = 4;
              _t2 = _context2.v;
              this.debugManager.log("\u274C Pasta Goldberg n\xE3o encontrada: ".concat(_t2.message));
              return _context2.a(2, {
                exists: false,
                path: this.goldbergPath,
                gamesCount: 0,
                games: [],
                currentUser: this.getCurrentUser(),
                error: _t2.message
              });
          }
        }, _callee2, this, [[0, 4]]);
      }));
      function checkGoldbergFolder() {
        return _checkGoldbergFolder.apply(this, arguments);
      }
      return checkGoldbergFolder;
    }())
  }, {
    key: "getGoldbergGames",
    value: (function () {
      var _getGoldbergGames = _asyncToGenerator(_regenerator().m(function _callee3() {
        var entries, games, _iterator, _step, entry, gamePath, gameInfo, _t3, _t4;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              _context3.n = 1;
              return fs.readdir(this.goldbergPath, {
                withFileTypes: true
              });
            case 1:
              entries = _context3.v;
              games = [];
              _iterator = _createForOfIteratorHelper(entries);
              _context3.p = 2;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context3.n = 6;
                break;
              }
              entry = _step.value;
              if (!(entry.isDirectory() && /^\d+$/.test(entry.name))) {
                _context3.n = 5;
                break;
              }
              gamePath = path.join(this.goldbergPath, entry.name);
              _context3.n = 4;
              return this.analyzeGoldbergGame(gamePath, entry.name);
            case 4:
              gameInfo = _context3.v;
              if (gameInfo) {
                games.push(gameInfo);
              }
            case 5:
              _context3.n = 3;
              break;
            case 6:
              _context3.n = 8;
              break;
            case 7:
              _context3.p = 7;
              _t3 = _context3.v;
              _iterator.e(_t3);
            case 8:
              _context3.p = 8;
              _iterator.f();
              return _context3.f(8);
            case 9:
              return _context3.a(2, games);
            case 10:
              _context3.p = 10;
              _t4 = _context3.v;
              this.debugManager.error('❌ Erro ao obter jogos Goldberg:', _t4);
              return _context3.a(2, []);
          }
        }, _callee3, this, [[2, 7, 8, 9], [0, 10]]);
      }));
      function getGoldbergGames() {
        return _getGoldbergGames.apply(this, arguments);
      }
      return getGoldbergGames;
    }())
  }, {
    key: "analyzeGoldbergGame",
    value: (function () {
      var _analyzeGoldbergGame = _asyncToGenerator(_regenerator().m(function _callee4(gamePath, gameId) {
        var files, achievementFiles, _t5, _t6, _t7, _t8, _t9, _t0, _t1;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              _context4.n = 1;
              return fs.readdir(gamePath);
            case 1:
              files = _context4.v;
              achievementFiles = files.filter(function (file) {
                return file.includes('achievement') || file.includes('stats') || file.endsWith('.dat') || file.endsWith('.json');
              });
              _t5 = gameId;
              _t6 = "Game ".concat(gameId);
              _t7 = gamePath;
              _t8 = achievementFiles;
              _t9 = achievementFiles.length > 0;
              _context4.n = 2;
              return this.getLastModified(gamePath);
            case 2:
              _t0 = _context4.v;
              return _context4.a(2, {
                id: _t5,
                name: _t6,
                path: _t7,
                achievementFiles: _t8,
                hasAchievements: _t9,
                lastModified: _t0
              });
            case 3:
              _context4.p = 3;
              _t1 = _context4.v;
              this.debugManager.error("\u274C Erro ao analisar jogo ".concat(gameId, ":"), _t1);
              return _context4.a(2, null);
          }
        }, _callee4, this, [[0, 3]]);
      }));
      function analyzeGoldbergGame(_x, _x2) {
        return _analyzeGoldbergGame.apply(this, arguments);
      }
      return analyzeGoldbergGame;
    }())
  }, {
    key: "getLastModified",
    value: (function () {
      var _getLastModified = _asyncToGenerator(_regenerator().m(function _callee5(dirPath) {
        var stats, _t10;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              _context5.n = 1;
              return fs.stat(dirPath);
            case 1:
              stats = _context5.v;
              return _context5.a(2, stats.mtime.toISOString());
            case 2:
              _context5.p = 2;
              _t10 = _context5.v;
              return _context5.a(2, new Date().toISOString());
          }
        }, _callee5, null, [[0, 2]]);
      }));
      function getLastModified(_x3) {
        return _getLastModified.apply(this, arguments);
      }
      return getLastModified;
    }())
  }, {
    key: "migrateGame",
    value: (function () {
      var _migrateGame = _asyncToGenerator(_regenerator().m(function _callee6(gameInfo) {
        var destPath, migratedFiles, _iterator2, _step2, file, sourcePath, destFilePath, _t11, _t12, _t13;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              this.debugManager.log("\uD83D\uDD04 Migrando jogo ".concat(gameInfo.id, "..."));
              destPath = path.join(this.gseSavesPath, gameInfo.id);
              _context6.n = 1;
              return fs.mkdir(destPath, {
                recursive: true
              });
            case 1:
              migratedFiles = [];
              _iterator2 = _createForOfIteratorHelper(gameInfo.achievementFiles);
              _context6.p = 2;
              _iterator2.s();
            case 3:
              if ((_step2 = _iterator2.n()).done) {
                _context6.n = 8;
                break;
              }
              file = _step2.value;
              sourcePath = path.join(gameInfo.path, file);
              destFilePath = path.join(destPath, file);
              _context6.p = 4;
              _context6.n = 5;
              return fs.copyFile(sourcePath, destFilePath);
            case 5:
              migratedFiles.push(file);
              this.debugManager.log("\u2705 Arquivo copiado: ".concat(file));
              _context6.n = 7;
              break;
            case 6:
              _context6.p = 6;
              _t11 = _context6.v;
              this.debugManager.error("\u274C Erro ao copiar ".concat(file, ":"), _t11);
            case 7:
              _context6.n = 3;
              break;
            case 8:
              _context6.n = 10;
              break;
            case 9:
              _context6.p = 9;
              _t12 = _context6.v;
              _iterator2.e(_t12);
            case 10:
              _context6.p = 10;
              _iterator2.f();
              return _context6.f(10);
            case 11:
              _context6.n = 12;
              return this.createGSEAchievementsFile(destPath, gameInfo, migratedFiles);
            case 12:
              this.debugManager.log("\u2705 Jogo ".concat(gameInfo.id, " migrado com sucesso"));
              return _context6.a(2, {
                success: true,
                gameId: gameInfo.id,
                migratedFiles: migratedFiles,
                destPath: destPath
              });
            case 13:
              _context6.p = 13;
              _t13 = _context6.v;
              this.debugManager.error("\u274C Erro ao migrar jogo ".concat(gameInfo.id, ":"), _t13);
              if (global.crashReporter) {
                global.crashReporter.reportError('GoldbergMigrationManager.migrateGame', _t13, {
                  gameId: gameInfo.id
                });
              }
              return _context6.a(2, {
                success: false,
                gameId: gameInfo.id,
                error: _t13.message
              });
          }
        }, _callee6, this, [[4, 6], [2, 9, 10, 11], [0, 13]]);
      }));
      function migrateGame(_x4) {
        return _migrateGame.apply(this, arguments);
      }
      return migrateGame;
    }())
  }, {
    key: "createGSEAchievementsFile",
    value: (function () {
      var _createGSEAchievementsFile = _asyncToGenerator(_regenerator().m(function _callee7(destPath, gameInfo, migratedFiles) {
        var achievementsData, _iterator3, _step3, file, filePath, content, data, achievementsPath, _t14, _t15, _t16;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              achievementsData = {
                gameId: gameInfo.id,
                gameName: gameInfo.name,
                achievements: [],
                totalAchievements: 0,
                unlockedCount: 0,
                completionPercentage: 0,
                lastModified: new Date().toISOString(),
                version: '1.0.0',
                source: 'Goldberg_Migration',
                originalFiles: migratedFiles,
                migrationDate: new Date().toISOString()
              };
              _iterator3 = _createForOfIteratorHelper(migratedFiles);
              _context7.p = 1;
              _iterator3.s();
            case 2:
              if ((_step3 = _iterator3.n()).done) {
                _context7.n = 8;
                break;
              }
              file = _step3.value;
              filePath = path.join(destPath, file);
              _context7.p = 3;
              if (!file.endsWith('.json')) {
                _context7.n = 5;
                break;
              }
              _context7.n = 4;
              return fs.readFile(filePath, 'utf8');
            case 4:
              content = _context7.v;
              data = JSON.parse(content);
              if (data.achievements) {
                achievementsData.achievements = data.achievements;
                achievementsData.totalAchievements = data.achievements.length;
                achievementsData.unlockedCount = data.achievements.filter(function (a) {
                  return a.unlocked;
                }).length;
              }
            case 5:
              _context7.n = 7;
              break;
            case 6:
              _context7.p = 6;
              _t14 = _context7.v;
              this.debugManager.log("\u26A0\uFE0F N\xE3o foi poss\xEDvel processar ".concat(file, ": ").concat(_t14.message));
            case 7:
              _context7.n = 2;
              break;
            case 8:
              _context7.n = 10;
              break;
            case 9:
              _context7.p = 9;
              _t15 = _context7.v;
              _iterator3.e(_t15);
            case 10:
              _context7.p = 10;
              _iterator3.f();
              return _context7.f(10);
            case 11:
              if (achievementsData.totalAchievements > 0) {
                achievementsData.completionPercentage = achievementsData.unlockedCount / achievementsData.totalAchievements * 100;
              }
              achievementsPath = path.join(destPath, 'achievements.json');
              _context7.n = 12;
              return fs.writeFile(achievementsPath, JSON.stringify(achievementsData, null, 2));
            case 12:
              this.debugManager.log("\u2705 Arquivo achievements.json criado para jogo ".concat(gameInfo.id));
              _context7.n = 14;
              break;
            case 13:
              _context7.p = 13;
              _t16 = _context7.v;
              this.debugManager.error("\u274C Erro ao criar achievements.json para ".concat(gameInfo.id, ":"), _t16);
            case 14:
              return _context7.a(2);
          }
        }, _callee7, this, [[3, 6], [1, 9, 10, 11], [0, 13]]);
      }));
      function createGSEAchievementsFile(_x5, _x6, _x7) {
        return _createGSEAchievementsFile.apply(this, arguments);
      }
      return createGSEAchievementsFile;
    }())
  }, {
    key: "migrateAllGames",
    value: (function () {
      var _migrateAllGames = _asyncToGenerator(_regenerator().m(function _callee8() {
        var goldbergInfo, results, _iterator4, _step4, game, result, successCount, _t17, _t18;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              this.debugManager.log('🔄 Iniciando migração completa...');
              _context8.n = 1;
              return this.checkGoldbergFolder();
            case 1:
              goldbergInfo = _context8.v;
              if (!(!goldbergInfo.exists || goldbergInfo.gamesCount === 0)) {
                _context8.n = 2;
                break;
              }
              return _context8.a(2, {
                success: false,
                message: 'Nenhum jogo encontrado na pasta Goldberg SteamEmu Saves'
              });
            case 2:
              results = [];
              _iterator4 = _createForOfIteratorHelper(goldbergInfo.games);
              _context8.p = 3;
              _iterator4.s();
            case 4:
              if ((_step4 = _iterator4.n()).done) {
                _context8.n = 7;
                break;
              }
              game = _step4.value;
              _context8.n = 5;
              return this.migrateGame(game);
            case 5:
              result = _context8.v;
              results.push(result);
            case 6:
              _context8.n = 4;
              break;
            case 7:
              _context8.n = 9;
              break;
            case 8:
              _context8.p = 8;
              _t17 = _context8.v;
              _iterator4.e(_t17);
            case 9:
              _context8.p = 9;
              _iterator4.f();
              return _context8.f(9);
            case 10:
              successCount = results.filter(function (r) {
                return r.success;
              }).length;
              this.debugManager.log("\u2705 Migra\xE7\xE3o completa: ".concat(successCount, "/").concat(results.length, " jogos migrados"));
              return _context8.a(2, {
                success: true,
                totalGames: results.length,
                successCount: successCount,
                results: results
              });
            case 11:
              _context8.p = 11;
              _t18 = _context8.v;
              this.debugManager.error('❌ Erro na migração completa:', _t18);
              if (this.crashReporter) {
                this.crashReporter.reportError('GoldbergMigrationManager.migrateAllGames', _t18);
              }
              return _context8.a(2, {
                success: false,
                error: _t18.message
              });
          }
        }, _callee8, this, [[3, 8, 9, 10], [0, 11]]);
      }));
      function migrateAllGames() {
        return _migrateAllGames.apply(this, arguments);
      }
      return migrateAllGames;
    }())
  }, {
    key: "loadMigrationSettings",
    value: (function () {
      var _loadMigrationSettings = _asyncToGenerator(_regenerator().m(function _callee9() {
        var settingsPath, content, _t19, _t20;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              settingsPath = this.pathManager ? path.join(this.pathManager.getDataPath(), 'settings', 'migration-settings.json') : path.join(__dirname, '..', '..', 'data', 'settings', 'migration-settings.json');
              _context9.p = 1;
              _context9.n = 2;
              return fs.readFile(settingsPath, 'utf8');
            case 2:
              content = _context9.v;
              this.migrationSettings = _objectSpread(_objectSpread({}, this.migrationSettings), JSON.parse(content));
              _context9.n = 4;
              break;
            case 3:
              _context9.p = 3;
              _t19 = _context9.v;
              _context9.n = 4;
              return this.saveMigrationSettings();
            case 4:
              this.debugManager.log('⚙️ Configurações de migração carregadas:', this.migrationSettings);
              _context9.n = 6;
              break;
            case 5:
              _context9.p = 5;
              _t20 = _context9.v;
              this.debugManager.error('❌ Erro ao carregar configurações de migração:', _t20);
            case 6:
              return _context9.a(2);
          }
        }, _callee9, this, [[1, 3], [0, 5]]);
      }));
      function loadMigrationSettings() {
        return _loadMigrationSettings.apply(this, arguments);
      }
      return loadMigrationSettings;
    }())
  }, {
    key: "saveMigrationSettings",
    value: (function () {
      var _saveMigrationSettings = _asyncToGenerator(_regenerator().m(function _callee0() {
        var settingsPath, settingsDir, _t21;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              _context0.p = 0;
              settingsPath = this.pathManager ? path.join(this.pathManager.getDataPath(), 'settings', 'migration-settings.json') : path.join(__dirname, '..', '..', 'data', 'settings', 'migration-settings.json');
              settingsDir = path.dirname(settingsPath);
              _context0.n = 1;
              return fs.mkdir(settingsDir, {
                recursive: true
              });
            case 1:
              _context0.n = 2;
              return fs.writeFile(settingsPath, JSON.stringify(this.migrationSettings, null, 2));
            case 2:
              this.debugManager.log('💾 Configurações de migração salvas');
              _context0.n = 4;
              break;
            case 3:
              _context0.p = 3;
              _t21 = _context0.v;
              this.debugManager.error('❌ Erro ao salvar configurações de migração:', _t21);
            case 4:
              return _context0.a(2);
          }
        }, _callee0, this, [[0, 3]]);
      }));
      function saveMigrationSettings() {
        return _saveMigrationSettings.apply(this, arguments);
      }
      return saveMigrationSettings;
    }())
  }, {
    key: "updateMigrationSettings",
    value: (function () {
      var _updateMigrationSettings = _asyncToGenerator(_regenerator().m(function _callee1(newSettings) {
        var _t22;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              _context1.p = 0;
              this.migrationSettings = _objectSpread(_objectSpread({}, this.migrationSettings), newSettings);
              _context1.n = 1;
              return this.saveMigrationSettings();
            case 1:
              this.debugManager.log('⚙️ Configurações de migração atualizadas:', this.migrationSettings);
              return _context1.a(2, {
                success: true
              });
            case 2:
              _context1.p = 2;
              _t22 = _context1.v;
              this.debugManager.error('❌ Erro ao atualizar configurações:', _t22);
              return _context1.a(2, {
                success: false,
                error: _t22.message
              });
          }
        }, _callee1, this, [[0, 2]]);
      }));
      function updateMigrationSettings(_x8) {
        return _updateMigrationSettings.apply(this, arguments);
      }
      return updateMigrationSettings;
    }())
  }, {
    key: "performAutoCheck",
    value: (function () {
      var _performAutoCheck = _asyncToGenerator(_regenerator().m(function _callee10() {
        var goldbergInfo, hasNewGames, serializedInfo, result, serializedResult, _t23;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.p = _context10.n) {
            case 0:
              _context10.p = 0;
              this.debugManager.log('🔍 Executando verificação automática...');
              _context10.n = 1;
              return this.checkGoldbergFolder();
            case 1:
              goldbergInfo = _context10.v;
              if (!(!goldbergInfo.exists || goldbergInfo.gamesCount === 0)) {
                _context10.n = 2;
                break;
              }
              this.debugManager.log('📭 Nenhum jogo encontrado na verificação automática');
              return _context10.a(2);
            case 2:
              _context10.n = 3;
              return this.hasNewOrModifiedGames(goldbergInfo.games);
            case 3:
              hasNewGames = _context10.v;
              if (hasNewGames) {
                _context10.n = 4;
                break;
              }
              this.debugManager.log('📋 Nenhum jogo novo ou modificado encontrado');
              return _context10.a(2);
            case 4:
              this.debugManager.log("\uD83C\uDFAE ".concat(goldbergInfo.gamesCount, " jogo(s) encontrado(s) para migra\xE7\xE3o autom\xE1tica"));
              if (!this.migrationSettings.showDialog) {
                _context10.n = 5;
                break;
              }
              if (global.mainWindow && !global.mainWindow.isDestroyed()) {
                try {
                  structuredClone(goldbergInfo);
                  global.mainWindow.webContents.send('goldberg-migration-dialog', goldbergInfo);
                  this.debugManager.log('📤 Evento goldberg-migration-dialog enviado com sucesso');
                } catch (cloneError) {
                  this.debugManager.error('❌ Erro de clonagem em goldberg-migration-dialog:', cloneError);
                  serializedInfo = JSON.parse(JSON.stringify(goldbergInfo));
                  global.mainWindow.webContents.send('goldberg-migration-dialog', serializedInfo);
                  this.debugManager.log('📤 Evento goldberg-migration-dialog enviado com dados serializados');
                }
              }
              _context10.n = 7;
              break;
            case 5:
              if (!this.migrationSettings.autoMigration) {
                _context10.n = 7;
                break;
              }
              _context10.n = 6;
              return this.migrateAllGames();
            case 6:
              result = _context10.v;
              if (result.success) {
                this.debugManager.log("\u2705 Migra\xE7\xE3o autom\xE1tica conclu\xEDda: ".concat(result.successCount, "/").concat(result.totalGames, " jogos"));
                if (global.mainWindow && !global.mainWindow.isDestroyed()) {
                  try {
                    structuredClone(result);
                    global.mainWindow.webContents.send('goldberg-migration-completed', result);
                    this.debugManager.log('📤 Evento goldberg-migration-completed enviado com sucesso');
                  } catch (cloneError) {
                    this.debugManager.error('❌ Erro de clonagem em goldberg-migration-completed:', cloneError);
                    serializedResult = JSON.parse(JSON.stringify(result));
                    global.mainWindow.webContents.send('goldberg-migration-completed', serializedResult);
                    this.debugManager.log('📤 Evento goldberg-migration-completed enviado com dados serializados');
                  }
                }
              } else {
                this.debugManager.error('❌ Erro na migração automática:', result.error);
              }
            case 7:
              this.migrationSettings.lastCheck = new Date().toISOString();
              _context10.n = 8;
              return this.saveMigrationSettings();
            case 8:
              _context10.n = 10;
              break;
            case 9:
              _context10.p = 9;
              _t23 = _context10.v;
              this.debugManager.error('❌ Erro na verificação automática:', _t23);
              if (this.crashReporter) {
                this.crashReporter.reportError('GoldbergMigrationManager.performAutoCheck', _t23);
              }
            case 10:
              return _context10.a(2);
          }
        }, _callee10, this, [[0, 9]]);
      }));
      function performAutoCheck() {
        return _performAutoCheck.apply(this, arguments);
      }
      return performAutoCheck;
    }())
  }, {
    key: "hasNewOrModifiedGames",
    value: (function () {
      var _hasNewOrModifiedGames = _asyncToGenerator(_regenerator().m(function _callee11(games) {
        var lastCheckDate, _iterator5, _step5, game, gameModified, gsePath, gseExists, _t24, _t25;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.p = _context11.n) {
            case 0:
              _context11.p = 0;
              if (this.migrationSettings.lastCheck) {
                _context11.n = 1;
                break;
              }
              return _context11.a(2, true);
            case 1:
              lastCheckDate = new Date(this.migrationSettings.lastCheck);
              _iterator5 = _createForOfIteratorHelper(games);
              _context11.p = 2;
              _iterator5.s();
            case 3:
              if ((_step5 = _iterator5.n()).done) {
                _context11.n = 7;
                break;
              }
              game = _step5.value;
              gameModified = new Date(game.lastModified);
              if (!(gameModified > lastCheckDate)) {
                _context11.n = 4;
                break;
              }
              this.debugManager.log("\uD83C\uDD95 Jogo modificado encontrado: ".concat(game.name, " (").concat(game.id, ")"));
              return _context11.a(2, true);
            case 4:
              gsePath = path.join(this.gseSavesPath, game.id);
              _context11.n = 5;
              return fs.access(gsePath).then(function () {
                return true;
              })["catch"](function () {
                return false;
              });
            case 5:
              gseExists = _context11.v;
              if (gseExists) {
                _context11.n = 6;
                break;
              }
              this.debugManager.log("\uD83C\uDD95 Jogo novo encontrado: ".concat(game.name, " (").concat(game.id, ")"));
              return _context11.a(2, true);
            case 6:
              _context11.n = 3;
              break;
            case 7:
              _context11.n = 9;
              break;
            case 8:
              _context11.p = 8;
              _t24 = _context11.v;
              _iterator5.e(_t24);
            case 9:
              _context11.p = 9;
              _iterator5.f();
              return _context11.f(9);
            case 10:
              return _context11.a(2, false);
            case 11:
              _context11.p = 11;
              _t25 = _context11.v;
              this.debugManager.error('❌ Erro ao verificar jogos novos/modificados:', _t25);
              return _context11.a(2, true);
          }
        }, _callee11, this, [[2, 8, 9, 10], [0, 11]]);
      }));
      function hasNewOrModifiedGames(_x9) {
        return _hasNewOrModifiedGames.apply(this, arguments);
      }
      return hasNewOrModifiedGames;
    }())
  }, {
    key: "setupIpcHandlers",
    value: function setupIpcHandlers() {
      var _this2 = this;
      ipcMain.handle('goldberg:checkFolder', _asyncToGenerator(_regenerator().m(function _callee12() {
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.n) {
            case 0:
              _context12.n = 1;
              return _this2.checkGoldbergFolder();
            case 1:
              return _context12.a(2, _context12.v);
          }
        }, _callee12);
      })));
      ipcMain.handle('goldberg:getCurrentUser', function () {
        return _this2.getCurrentUser();
      });
      ipcMain.handle('goldberg:migrateAll', _asyncToGenerator(_regenerator().m(function _callee13() {
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.n) {
            case 0:
              _context13.n = 1;
              return _this2.migrateAllGames();
            case 1:
              return _context13.a(2, _context13.v);
          }
        }, _callee13);
      })));
      ipcMain.handle('goldberg:migrateGame', function () {
        var _ref3 = _asyncToGenerator(_regenerator().m(function _callee14(event, gameInfo) {
          return _regenerator().w(function (_context14) {
            while (1) switch (_context14.n) {
              case 0:
                _context14.n = 1;
                return _this2.migrateGame(gameInfo);
              case 1:
                return _context14.a(2, _context14.v);
            }
          }, _callee14);
        }));
        return function (_x0, _x1) {
          return _ref3.apply(this, arguments);
        };
      }());
      ipcMain.handle('goldberg:getSettings', function () {
        return _this2.migrationSettings;
      });
      ipcMain.handle('goldberg:updateSettings', function () {
        var _ref4 = _asyncToGenerator(_regenerator().m(function _callee15(event, settings) {
          return _regenerator().w(function (_context15) {
            while (1) switch (_context15.n) {
              case 0:
                _context15.n = 1;
                return _this2.updateMigrationSettings(settings);
              case 1:
                return _context15.a(2, _context15.v);
            }
          }, _callee15);
        }));
        return function (_x10, _x11) {
          return _ref4.apply(this, arguments);
        };
      }());
      ipcMain.handle('goldberg:getStatus', _asyncToGenerator(_regenerator().m(function _callee16() {
        var goldbergInfo;
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.n) {
            case 0:
              _context16.n = 1;
              return _this2.checkGoldbergFolder();
            case 1:
              goldbergInfo = _context16.v;
              return _context16.a(2, {
                initialized: _this2.isInitialized,
                currentUser: _this2.currentUser,
                goldbergPath: _this2.goldbergPath,
                gseSavesPath: _this2.gseSavesPath,
                goldbergExists: goldbergInfo.exists,
                gamesCount: goldbergInfo.gamesCount,
                settings: _this2.migrationSettings
              });
          }
        }, _callee16);
      })));
      ipcMain.handle('goldberg:getGames', _asyncToGenerator(_regenerator().m(function _callee17() {
        return _regenerator().w(function (_context17) {
          while (1) switch (_context17.n) {
            case 0:
              _context17.n = 1;
              return _this2.getGoldbergGames();
            case 1:
              return _context17.a(2, _context17.v);
          }
        }, _callee17);
      })));
      ipcMain.handle('goldberg:setSetting', function () {
        var _ref7 = _asyncToGenerator(_regenerator().m(function _callee18(event, key, value) {
          var _t26;
          return _regenerator().w(function (_context18) {
            while (1) switch (_context18.p = _context18.n) {
              case 0:
                _context18.p = 0;
                _this2.debugManager.log("\uD83D\uDD27 Tentando salvar configura\xE7\xE3o: ".concat(key, " = ").concat(value));
                if (!(!key || key.trim() === '')) {
                  _context18.n = 1;
                  break;
                }
                throw new Error('Chave da configuração não pode estar vazia');
              case 1:
                if (!_this2.migrationSettings) {
                  _this2.debugManager.log('⚠️ migrationSettings não existe, inicializando...');
                  _this2.migrationSettings = {
                    autoMigration: false,
                    showDialog: true,
                    lastCheck: null
                  };
                }
                _this2.debugManager.log('📋 Estado atual das configurações:', _this2.migrationSettings);
                _this2.migrationSettings[key] = value;
                _this2.debugManager.log("\u2705 Configura\xE7\xE3o ".concat(key, " atualizada para: ").concat(value));
                _context18.n = 2;
                return _this2.saveMigrationSettings();
              case 2:
                _this2.debugManager.log('💾 Configurações salvas com sucesso');
                return _context18.a(2, {
                  success: true,
                  message: "Configura\xE7\xE3o ".concat(key, " salva com sucesso")
                });
              case 3:
                _context18.p = 3;
                _t26 = _context18.v;
                _this2.debugManager.error('❌ Erro ao salvar configuração:', _t26);
                _this2.debugManager.error('📊 Stack trace:', _t26.stack);
                return _context18.a(2, {
                  success: false,
                  error: _t26.message,
                  stack: _t26.stack
                });
            }
          }, _callee18, null, [[0, 3]]);
        }));
        return function (_x12, _x13, _x14) {
          return _ref7.apply(this, arguments);
        };
      }());
      ipcMain.handle('goldberg:getLastCheck', function () {
        return _this2.migrationSettings.lastCheck || null;
      });
      ipcMain.handle('goldberg:checkMigration', _asyncToGenerator(_regenerator().m(function _callee19() {
        var goldbergInfo, _t27;
        return _regenerator().w(function (_context19) {
          while (1) switch (_context19.p = _context19.n) {
            case 0:
              _context19.p = 0;
              _context19.n = 1;
              return _this2.checkGoldbergFolder();
            case 1:
              goldbergInfo = _context19.v;
              _this2.migrationSettings.lastCheck = new Date().toISOString();
              _context19.n = 2;
              return _this2.saveMigrationSettings();
            case 2:
              return _context19.a(2, {
                hasGames: goldbergInfo.exists && goldbergInfo.gamesCount > 0,
                gameCount: goldbergInfo.gamesCount,
                games: goldbergInfo.games || []
              });
            case 3:
              _context19.p = 3;
              _t27 = _context19.v;
              _this2.debugManager.error('❌ Erro na verificação de migração:', _t27);
              return _context19.a(2, {
                hasGames: false,
                gameCount: 0,
                games: [],
                error: _t27.message
              });
          }
        }, _callee19, null, [[0, 3]]);
      })));
    }
  }]);
}();
module.exports = {
  GoldbergMigrationManager: GoldbergMigrationManager
};