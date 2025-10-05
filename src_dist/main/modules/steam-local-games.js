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
var fs = require('fs').promises;
var path = require('path');
var _require = require('electron'),
  ipcMain = _require.ipcMain;
var SteamLocalGamesManager = function () {
  function SteamLocalGamesManager(debugManager, crashReporter) {
    _classCallCheck(this, SteamLocalGamesManager);
    this.debugManager = debugManager;
    this.crashReporter = crashReporter;
    this.installedGames = new Set();
    this.steamPaths = [];
    this.lastScan = null;
    this.setupIpcHandlers();
  }
  return _createClass(SteamLocalGamesManager, [{
    key: "setupIpcHandlers",
    value: function setupIpcHandlers() {
      var _this = this;
      ipcMain.handle('steam.getInstalledGames', _asyncToGenerator(_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return _this.getInstalledGames();
            case 1:
              return _context.a(2, _context.v);
          }
        }, _callee);
      })));
      ipcMain.handle('steam.scanInstalledGames', _asyncToGenerator(_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return _this.scanInstalledGames();
            case 1:
              return _context2.a(2, _context2.v);
          }
        }, _callee2);
      })));
      ipcMain.handle('steam.isGameInstalled', function () {
        var _ref3 = _asyncToGenerator(_regenerator().m(function _callee3(event, appId) {
          return _regenerator().w(function (_context3) {
            while (1) switch (_context3.n) {
              case 0:
                return _context3.a(2, _this.isGameInstalled(appId));
            }
          }, _callee3);
        }));
        return function (_x, _x2) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "detectSteamPaths",
    value: (function () {
      var _detectSteamPaths = _asyncToGenerator(_regenerator().m(function _callee4() {
        var possiblePaths, validPaths, _i, _possiblePaths, steamPath, steamAppsPath, _i2, _validPaths, _steamAppsPath, libraryFoldersPath, libraryContent, pathMatches, _iterator, _step, match, pathMatch, additionalPath, _t, _t2, _t3, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              possiblePaths = ['C:\\Program Files (x86)\\Steam', 'C:\\Program Files\\Steam', 'D:\\Steam', 'E:\\Steam', 'F:\\Steam'];
              validPaths = [];
              _i = 0, _possiblePaths = possiblePaths;
            case 1:
              if (!(_i < _possiblePaths.length)) {
                _context4.n = 6;
                break;
              }
              steamPath = _possiblePaths[_i];
              _context4.p = 2;
              steamAppsPath = path.join(steamPath, 'steamapps');
              _context4.n = 3;
              return fs.access(steamAppsPath);
            case 3:
              validPaths.push(steamAppsPath);
              _context4.n = 5;
              break;
            case 4:
              _context4.p = 4;
              _t = _context4.v;
            case 5:
              _i++;
              _context4.n = 1;
              break;
            case 6:
              _i2 = 0, _validPaths = validPaths;
            case 7:
              if (!(_i2 < _validPaths.length)) {
                _context4.n = 22;
                break;
              }
              _steamAppsPath = _validPaths[_i2];
              _context4.p = 8;
              libraryFoldersPath = path.join(_steamAppsPath, 'libraryfolders.vdf');
              _context4.n = 9;
              return fs.readFile(libraryFoldersPath, 'utf8');
            case 9:
              libraryContent = _context4.v;
              pathMatches = libraryContent.match(/"path"\s+"([^"]+)"/g);
              if (!pathMatches) {
                _context4.n = 19;
                break;
              }
              _iterator = _createForOfIteratorHelper(pathMatches);
              _context4.p = 10;
              _iterator.s();
            case 11:
              if ((_step = _iterator.n()).done) {
                _context4.n = 16;
                break;
              }
              match = _step.value;
              pathMatch = match.match(/"path"\s+"([^"]+)"/);
              if (!pathMatch) {
                _context4.n = 15;
                break;
              }
              additionalPath = path.join(pathMatch[1].replace(/\\\\/g, '\\'), 'steamapps');
              if (validPaths.includes(additionalPath)) {
                _context4.n = 15;
                break;
              }
              _context4.p = 12;
              _context4.n = 13;
              return fs.access(additionalPath);
            case 13:
              validPaths.push(additionalPath);
              _context4.n = 15;
              break;
            case 14:
              _context4.p = 14;
              _t2 = _context4.v;
            case 15:
              _context4.n = 11;
              break;
            case 16:
              _context4.n = 18;
              break;
            case 17:
              _context4.p = 17;
              _t3 = _context4.v;
              _iterator.e(_t3);
            case 18:
              _context4.p = 18;
              _iterator.f();
              return _context4.f(18);
            case 19:
              _context4.n = 21;
              break;
            case 20:
              _context4.p = 20;
              _t4 = _context4.v;
            case 21:
              _i2++;
              _context4.n = 7;
              break;
            case 22:
              this.steamPaths = validPaths;
              return _context4.a(2, validPaths);
          }
        }, _callee4, this, [[12, 14], [10, 17, 18, 19], [8, 20], [2, 4]]);
      }));
      function detectSteamPaths() {
        return _detectSteamPaths.apply(this, arguments);
      }
      return detectSteamPaths;
    }())
  }, {
    key: "scanInstalledGames",
    value: (function () {
      var _scanInstalledGames = _asyncToGenerator(_regenerator().m(function _callee5() {
        var installedGames, _iterator2, _step2, steamAppsPath, files, _iterator3, _step3, file, appId, gameAppId, manifestPath, manifestContent, stateFlagsMatch, stateFlags, _this$debugManager, _this$debugManager2, _t5, _t6, _t7, _t8, _t9;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              console.log('🔍 Escaneando jogos Steam instalados...');
              if (!(this.steamPaths.length === 0)) {
                _context5.n = 1;
                break;
              }
              _context5.n = 1;
              return this.detectSteamPaths();
            case 1:
              if (!(this.steamPaths.length === 0)) {
                _context5.n = 2;
                break;
              }
              return _context5.a(2, {
                success: false,
                error: 'Nenhuma instalação do Steam encontrada',
                installedGames: []
              });
            case 2:
              installedGames = new Set();
              _iterator2 = _createForOfIteratorHelper(this.steamPaths);
              _context5.p = 3;
              _iterator2.s();
            case 4:
              if ((_step2 = _iterator2.n()).done) {
                _context5.n = 19;
                break;
              }
              steamAppsPath = _step2.value;
              _context5.p = 5;
              _context5.n = 6;
              return fs.readdir(steamAppsPath);
            case 6:
              files = _context5.v;
              _iterator3 = _createForOfIteratorHelper(files);
              _context5.p = 7;
              _iterator3.s();
            case 8:
              if ((_step3 = _iterator3.n()).done) {
                _context5.n = 13;
                break;
              }
              file = _step3.value;
              if (!(file.startsWith('appmanifest_') && file.endsWith('.acf'))) {
                _context5.n = 12;
                break;
              }
              appId = file.match(/appmanifest_(\d+)\.acf/);
              if (!appId) {
                _context5.n = 12;
                break;
              }
              gameAppId = appId[1];
              _context5.p = 9;
              manifestPath = path.join(steamAppsPath, file);
              _context5.n = 10;
              return fs.readFile(manifestPath, 'utf8');
            case 10:
              manifestContent = _context5.v;
              stateFlagsMatch = manifestContent.match(/"StateFlags"\s+"(\d+)"/);
              if (stateFlagsMatch) {
                stateFlags = parseInt(stateFlagsMatch[1]);
                if (stateFlags === 4) {
                  installedGames.add(gameAppId);
                }
              }
              _context5.n = 12;
              break;
            case 11:
              _context5.p = 11;
              _t5 = _context5.v;
              (_this$debugManager = this.debugManager) === null || _this$debugManager === void 0 || _this$debugManager.warn("\u26A0\uFE0F Erro ao ler manifest ".concat(file, ":"), _t5.message);
            case 12:
              _context5.n = 8;
              break;
            case 13:
              _context5.n = 15;
              break;
            case 14:
              _context5.p = 14;
              _t6 = _context5.v;
              _iterator3.e(_t6);
            case 15:
              _context5.p = 15;
              _iterator3.f();
              return _context5.f(15);
            case 16:
              _context5.n = 18;
              break;
            case 17:
              _context5.p = 17;
              _t7 = _context5.v;
              (_this$debugManager2 = this.debugManager) === null || _this$debugManager2 === void 0 || _this$debugManager2.warn("\u26A0\uFE0F Erro ao escanear ".concat(steamAppsPath, ":"), _t7.message);
            case 18:
              _context5.n = 4;
              break;
            case 19:
              _context5.n = 21;
              break;
            case 20:
              _context5.p = 20;
              _t8 = _context5.v;
              _iterator2.e(_t8);
            case 21:
              _context5.p = 21;
              _iterator2.f();
              return _context5.f(21);
            case 22:
              this.installedGames = installedGames;
              this.lastScan = new Date();
              return _context5.a(2, {
                success: true,
                installedGames: Array.from(installedGames),
                totalInstalled: installedGames.size,
                steamPaths: this.steamPaths,
                lastScan: this.lastScan
              });
            case 23:
              _context5.p = 23;
              _t9 = _context5.v;
              this.crashReporter.logError('SteamLocalGamesManager.scanInstalledGames', _t9);
              return _context5.a(2, {
                success: false,
                error: "Erro ao escanear jogos: ".concat(_t9.message),
                installedGames: []
              });
          }
        }, _callee5, this, [[9, 11], [7, 14, 15, 16], [5, 17], [3, 20, 21, 22], [0, 23]]);
      }));
      function scanInstalledGames() {
        return _scanInstalledGames.apply(this, arguments);
      }
      return scanInstalledGames;
    }())
  }, {
    key: "getInstalledGames",
    value: (function () {
      var _getInstalledGames = _asyncToGenerator(_regenerator().m(function _callee6() {
        var oneHourAgo;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
              if (!(!this.lastScan || this.lastScan < oneHourAgo)) {
                _context6.n = 2;
                break;
              }
              _context6.n = 1;
              return this.scanInstalledGames();
            case 1:
              return _context6.a(2, _context6.v);
            case 2:
              return _context6.a(2, {
                success: true,
                installedGames: Array.from(this.installedGames),
                totalInstalled: this.installedGames.size,
                steamPaths: this.steamPaths,
                lastScan: this.lastScan,
                fromCache: true
              });
          }
        }, _callee6, this);
      }));
      function getInstalledGames() {
        return _getInstalledGames.apply(this, arguments);
      }
      return getInstalledGames;
    }())
  }, {
    key: "isGameInstalled",
    value: function isGameInstalled(appId) {
      return this.installedGames.has(String(appId));
    }
  }, {
    key: "filterInstalledGames",
    value: function filterInstalledGames(allGames) {
      var _this2 = this;
      if (!Array.isArray(allGames)) {
        return [];
      }
      return allGames.filter(function (game) {
        var gameId = String(game.id || game.appid || game.appID);
        return _this2.installedGames.has(gameId);
      });
    }
  }, {
    key: "getStats",
    value: function getStats() {
      return {
        totalInstalled: this.installedGames.size,
        steamPaths: this.steamPaths.length,
        lastScan: this.lastScan,
        isInitialized: this.steamPaths.length > 0
      };
    }
  }]);
}();
module.exports = SteamLocalGamesManager;