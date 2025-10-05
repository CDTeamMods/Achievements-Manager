"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
var axios = require('axios');
var path = require('path');
var fs = require('fs').promises;
var SteamIntegrationManager = function () {
  function SteamIntegrationManager() {
    var pathManager = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var configManager = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var debugManager = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    _classCallCheck(this, SteamIntegrationManager);
    this.pathManager = pathManager;
    this.configManager = configManager;
    this.debugManager = debugManager;
    this.http = axios.create({
      baseURL: 'https://api.steampowered.com',
      timeout: 15000
    });
    this.apiKey = null;
    this.steamId = null;
    this.isConnected = false;
    this.cache = new Map();
    this.cacheConfig = {
      userGames: {
        ttl: 5 * 60 * 1000
      },
      gameAchievements: {
        ttl: 30 * 60 * 1000
      },
      userAchievements: {
        ttl: 2 * 60 * 1000
      },
      gameDetails: {
        ttl: 60 * 60 * 1000
      }
    };
    this.setupIpcHandlers();
    this.loadSavedCredentials()["catch"](function () {});
  }
  return _createClass(SteamIntegrationManager, [{
    key: "loadSavedCredentials",
    value: (function () {
      var _loadSavedCredentials = _asyncToGenerator(_regenerator().m(function _callee() {
        var credentials, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return this.getCredentials();
            case 1:
              credentials = _context.v;
              if (credentials.success && credentials.apiKey) {
                this.apiKey = credentials.apiKey;
                if (credentials.steamId) {
                  this.steamId = credentials.steamId;
                }
                this.isConnected = credentials.connected;
                if (this.debugManager) {
                  this.debugManager.log('steam', "Credenciais carregadas do cache - API Key: ".concat(credentials.apiKey ? 'Definida' : 'Não definida', ", Steam ID: ").concat(credentials.steamId || 'Não definido', ", Connected: ").concat(credentials.connected));
                }
              }
              _context.n = 3;
              break;
            case 2:
              _context.p = 2;
              _t = _context.v;
              console.error('Erro ao carregar credenciais do cache:', _t);
            case 3:
              return _context.a(2);
          }
        }, _callee, this, [[0, 2]]);
      }));
      function loadSavedCredentials() {
        return _loadSavedCredentials.apply(this, arguments);
      }
      return loadSavedCredentials;
    }())
  }, {
    key: "getCacheKey",
    value: function getCacheKey(type) {
      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }
      return "".concat(type, ":").concat(this.steamId, ":").concat(params.join(':'));
    }
  }, {
    key: "setCache",
    value: function setCache(type, data) {
      var _this$cacheConfig$typ;
      for (var _len2 = arguments.length, params = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        params[_key2 - 2] = arguments[_key2];
      }
      var key = this.getCacheKey.apply(this, [type].concat(params));
      var ttl = ((_this$cacheConfig$typ = this.cacheConfig[type]) === null || _this$cacheConfig$typ === void 0 ? void 0 : _this$cacheConfig$typ.ttl) || 5 * 60 * 1000;
      var expiresAt = Date.now() + ttl;
      this.cache.set(key, {
        data: data,
        expiresAt: expiresAt,
        createdAt: Date.now()
      });
    }
  }, {
    key: "getCache",
    value: function getCache(type) {
      for (var _len3 = arguments.length, params = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        params[_key3 - 1] = arguments[_key3];
      }
      var key = this.getCacheKey.apply(this, [type].concat(params));
      var cached = this.cache.get(key);
      if (!cached) {
        return null;
      }
      if (Date.now() > cached.expiresAt) {
        this.cache["delete"](key);
        return null;
      }
      return cached.data;
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (type) {
        var prefix = "".concat(type, ":").concat(this.steamId, ":");
        var _iterator = _createForOfIteratorHelper(this.cache.keys()),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var key = _step.value;
            if (key.startsWith(prefix)) {
              this.cache["delete"](key);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else {
        this.cache.clear();
      }
    }
  }, {
    key: "getCacheStats",
    value: function getCacheStats() {
      var stats = {
        totalEntries: this.cache.size,
        byType: {},
        memoryUsage: 0
      };
      var _iterator2 = _createForOfIteratorHelper(this.cache.entries()),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
            key = _step2$value[0],
            value = _step2$value[1];
          var type = key.split(':')[0];
          if (!stats.byType[type]) {
            stats.byType[type] = {
              count: 0,
              expired: 0
            };
          }
          stats.byType[type].count++;
          if (Date.now() > value.expiresAt) {
            stats.byType[type].expired++;
          }
          stats.memoryUsage += JSON.stringify(value).length;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return stats;
    }
  }, {
    key: "getConnectionCachePath",
    value: function () {
      var _getConnectionCachePath = _asyncToGenerator(_regenerator().m(function _callee2() {
        var cachePath;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (this.pathManager) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2, path.join(process.cwd(), 'src', 'data', 'cache', 'steam-connection.json'));
            case 1:
              cachePath = this.pathManager.getCachePath();
              return _context2.a(2, path.join(cachePath, 'steam-connection.json'));
          }
        }, _callee2, this);
      }));
      function getConnectionCachePath() {
        return _getConnectionCachePath.apply(this, arguments);
      }
      return getConnectionCachePath;
    }()
  }, {
    key: "setConnectionStatus",
    value: function () {
      var _setConnectionStatus = _asyncToGenerator(_regenerator().m(function _callee3(connected) {
        var apiKey,
          steamId,
          cachePath,
          existingData,
          existingContent,
          cacheData,
          _args3 = arguments,
          _t2,
          _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              apiKey = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : null;
              steamId = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : null;
              _context3.p = 1;
              _context3.n = 2;
              return this.getConnectionCachePath();
            case 2:
              cachePath = _context3.v;
              existingData = {};
              _context3.p = 3;
              _context3.n = 4;
              return fs.access(cachePath);
            case 4:
              _context3.n = 5;
              return fs.readFile(cachePath, 'utf8');
            case 5:
              existingContent = _context3.v;
              existingData = JSON.parse(existingContent);
              _context3.n = 7;
              break;
            case 6:
              _context3.p = 6;
              _t2 = _context3.v;
            case 7:
              cacheData = {
                connected: connected,
                lastUpdated: new Date().toISOString(),
                sessionId: connected ? Date.now().toString() : null,
                apiKey: apiKey !== null ? apiKey : existingData.apiKey || '',
                steamId: steamId !== null ? steamId : existingData.steamId || ''
              };
              _context3.n = 8;
              return fs.mkdir(path.dirname(cachePath), {
                recursive: true
              });
            case 8:
              _context3.n = 9;
              return fs.writeFile(cachePath, JSON.stringify(cacheData, null, 2), 'utf8');
            case 9:
              this.isConnected = connected;
              if (apiKey) this.apiKey = apiKey;
              if (steamId) this.steamId = steamId;
              if (this.debugManager) {
                this.debugManager.log('steam', "Cache Steam atualizado - Connected: ".concat(connected, ", API Key: ").concat(apiKey ? 'Definida' : 'Não alterada', ", Steam ID: ").concat(steamId || 'Não alterado'));
              }
              _context3.n = 11;
              break;
            case 10:
              _context3.p = 10;
              _t3 = _context3.v;
              if (this.debugManager) {
                this.debugManager.error('steam', "Erro ao salvar cache Steam: ".concat(_t3.message));
              }
            case 11:
              return _context3.a(2);
          }
        }, _callee3, this, [[3, 6], [1, 10]]);
      }));
      function setConnectionStatus(_x) {
        return _setConnectionStatus.apply(this, arguments);
      }
      return setConnectionStatus;
    }()
  }, {
    key: "getConnectionStatus",
    value: function () {
      var _getConnectionStatus = _asyncToGenerator(_regenerator().m(function _callee4() {
        var cachePath, cacheContent, cacheData, _t4, _t5;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              _context4.n = 1;
              return this.getConnectionCachePath();
            case 1:
              cachePath = _context4.v;
              _context4.p = 2;
              _context4.n = 3;
              return fs.access(cachePath);
            case 3:
              _context4.n = 5;
              break;
            case 4:
              _context4.p = 4;
              _t4 = _context4.v;
              return _context4.a(2, {
                connected: false,
                apiKey: '',
                steamId: ''
              });
            case 5:
              _context4.n = 6;
              return fs.readFile(cachePath, 'utf8');
            case 6:
              cacheContent = _context4.v;
              cacheData = JSON.parse(cacheContent);
              return _context4.a(2, {
                connected: cacheData.connected || false,
                apiKey: cacheData.apiKey || '',
                steamId: cacheData.steamId || '',
                lastUpdated: cacheData.lastUpdated,
                sessionId: cacheData.sessionId
              });
            case 7:
              _context4.p = 7;
              _t5 = _context4.v;
              if (this.debugManager) {
                this.debugManager.error('steam', "Erro ao ler cache Steam: ".concat(_t5.message));
              }
              return _context4.a(2, {
                connected: false,
                apiKey: '',
                steamId: ''
              });
          }
        }, _callee4, this, [[2, 4], [0, 7]]);
      }));
      function getConnectionStatus() {
        return _getConnectionStatus.apply(this, arguments);
      }
      return getConnectionStatus;
    }()
  }, {
    key: "clearConnectionCache",
    value: function () {
      var _clearConnectionCache = _asyncToGenerator(_regenerator().m(function _callee5() {
        var cachePath, _t6;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              _context5.n = 1;
              return this.getConnectionCachePath();
            case 1:
              cachePath = _context5.v;
              _context5.n = 2;
              return fs.unlink(cachePath);
            case 2:
              this.isConnected = false;
              if (this.debugManager) {
                this.debugManager.log('steam', 'Cache de conexão Steam limpo');
              }
              _context5.n = 4;
              break;
            case 3:
              _context5.p = 3;
              _t6 = _context5.v;
              if (_t6.code !== 'ENOENT' && this.debugManager) {
                this.debugManager.error('steam', "Erro ao limpar cache de conex\xE3o: ".concat(_t6.message));
              }
            case 4:
              return _context5.a(2);
          }
        }, _callee5, this, [[0, 3]]);
      }));
      function clearConnectionCache() {
        return _clearConnectionCache.apply(this, arguments);
      }
      return clearConnectionCache;
    }()
  }, {
    key: "setupIpcHandlers",
    value: function setupIpcHandlers() {
      var _this = this;
      ipcMain.handle('steam.setCredentials', function () {
        var _ref = _asyncToGenerator(_regenerator().m(function _callee6(event, apiKey) {
          var steamId,
            _args6 = arguments;
          return _regenerator().w(function (_context6) {
            while (1) switch (_context6.n) {
              case 0:
                steamId = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : null;
                _context6.n = 1;
                return _this.setCredentials(apiKey, steamId);
              case 1:
                return _context6.a(2, _context6.v);
            }
          }, _callee6);
        }));
        return function (_x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
      ipcMain.handle('steam.getCredentials', _asyncToGenerator(_regenerator().m(function _callee7() {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              _context7.n = 1;
              return _this.getCredentials();
            case 1:
              return _context7.a(2, _context7.v);
          }
        }, _callee7);
      })));
      ipcMain.handle('steam.checkConnection', _asyncToGenerator(_regenerator().m(function _callee8() {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              _context8.n = 1;
              return _this.checkConnection();
            case 1:
              return _context8.a(2, _context8.v);
          }
        }, _callee8);
      })));
      ipcMain.handle('steam.getUserGames', function () {
        var _ref4 = _asyncToGenerator(_regenerator().m(function _callee9(event) {
          var options,
            _options$installedOnl,
            installedOnly,
            _args9 = arguments;
          return _regenerator().w(function (_context9) {
            while (1) switch (_context9.n) {
              case 0:
                options = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : {};
                _options$installedOnl = options.installedOnly, installedOnly = _options$installedOnl === void 0 ? false : _options$installedOnl;
                _context9.n = 1;
                return _this.getUserGames(0, options);
              case 1:
                return _context9.a(2, _context9.v);
            }
          }, _callee9);
        }));
        return function (_x4) {
          return _ref4.apply(this, arguments);
        };
      }());
      ipcMain.handle('steam.getGameAchievements', function () {
        var _ref5 = _asyncToGenerator(_regenerator().m(function _callee0(event, gameId) {
          var language,
            _args0 = arguments;
          return _regenerator().w(function (_context0) {
            while (1) switch (_context0.n) {
              case 0:
                language = _args0.length > 2 && _args0[2] !== undefined ? _args0[2] : null;
                _context0.n = 1;
                return _this.getGameAchievements(gameId, language);
              case 1:
                return _context0.a(2, _context0.v);
            }
          }, _callee0);
        }));
        return function (_x5, _x6) {
          return _ref5.apply(this, arguments);
        };
      }());
      ipcMain.handle('steam.getUserGameAchievements', function () {
        var _ref6 = _asyncToGenerator(_regenerator().m(function _callee1(event, gameId) {
          var language,
            _args1 = arguments;
          return _regenerator().w(function (_context1) {
            while (1) switch (_context1.n) {
              case 0:
                language = _args1.length > 2 && _args1[2] !== undefined ? _args1[2] : null;
                _context1.n = 1;
                return _this.getUserGameAchievements(gameId, language);
              case 1:
                return _context1.a(2, _context1.v);
            }
          }, _callee1);
        }));
        return function (_x7, _x8) {
          return _ref6.apply(this, arguments);
        };
      }());
      ipcMain.handle('steam.convertToGSE', function () {
        var _ref7 = _asyncToGenerator(_regenerator().m(function _callee10(event, gameId) {
          return _regenerator().w(function (_context10) {
            while (1) switch (_context10.n) {
              case 0:
                _context10.n = 1;
                return _this.convertToGSE(gameId);
              case 1:
                return _context10.a(2, _context10.v);
            }
          }, _callee10);
        }));
        return function (_x9, _x0) {
          return _ref7.apply(this, arguments);
        };
      }());
      ipcMain.handle('steam.getGameDetails', function () {
        var _ref8 = _asyncToGenerator(_regenerator().m(function _callee11(event, gameId) {
          return _regenerator().w(function (_context11) {
            while (1) switch (_context11.n) {
              case 0:
                _context11.n = 1;
                return _this.getGameDetails(gameId);
              case 1:
                return _context11.a(2, _context11.v);
            }
          }, _callee11);
        }));
        return function (_x1, _x10) {
          return _ref8.apply(this, arguments);
        };
      }());
      ipcMain.handle('steam.discoverSteamId', function () {
        var _ref9 = _asyncToGenerator(_regenerator().m(function _callee12(event, apiKey) {
          return _regenerator().w(function (_context12) {
            while (1) switch (_context12.n) {
              case 0:
                _context12.n = 1;
                return _this.discoverSteamId(apiKey);
              case 1:
                return _context12.a(2, _context12.v);
            }
          }, _callee12);
        }));
        return function (_x11, _x12) {
          return _ref9.apply(this, arguments);
        };
      }());
      ipcMain.handle('steam.clearCache', function () {
        var _ref0 = _asyncToGenerator(_regenerator().m(function _callee13(event) {
          var type,
            _args13 = arguments;
          return _regenerator().w(function (_context13) {
            while (1) switch (_context13.n) {
              case 0:
                type = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : null;
                _this.clearCache(type);
                return _context13.a(2, {
                  success: true,
                  message: type ? "Cache ".concat(type, " limpo") : 'Todo o cache foi limpo'
                });
            }
          }, _callee13);
        }));
        return function (_x13) {
          return _ref0.apply(this, arguments);
        };
      }());
      ipcMain.handle('steam.getCacheStats', _asyncToGenerator(_regenerator().m(function _callee14() {
        return _regenerator().w(function (_context14) {
          while (1) switch (_context14.n) {
            case 0:
              return _context14.a(2, _this.getCacheStats());
          }
        }, _callee14);
      })));
      ipcMain.handle('steam.testGameAchievements', function () {
        var _ref10 = _asyncToGenerator(_regenerator().m(function _callee15(event, gameId) {
          return _regenerator().w(function (_context15) {
            while (1) switch (_context15.n) {
              case 0:
                _context15.n = 1;
                return _this.getGameAchievements(gameId);
              case 1:
                return _context15.a(2, _context15.v);
            }
          }, _callee15);
        }));
        return function (_x14, _x15) {
          return _ref10.apply(this, arguments);
        };
      }());
      ipcMain.handle('steam.getSteamDefaultPaths', _asyncToGenerator(_regenerator().m(function _callee16() {
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.n) {
            case 0:
              return _context16.a(2, _this.getSteamDefaultPaths());
          }
        }, _callee16);
      })));
      ipcMain.handle('steam.detectCurrentSteamDirectory', _asyncToGenerator(_regenerator().m(function _callee17() {
        return _regenerator().w(function (_context17) {
          while (1) switch (_context17.n) {
            case 0:
              _context17.n = 1;
              return _this.detectCurrentSteamDirectory();
            case 1:
              return _context17.a(2, _context17.v);
          }
        }, _callee17);
      })));
    }
  }, {
    key: "setCredentials",
    value: (function () {
      var _setCredentials = _asyncToGenerator(_regenerator().m(function _callee18(apiKey) {
        var steamId,
          connectionTest,
          finalSteamId,
          _args18 = arguments,
          _t7;
        return _regenerator().w(function (_context18) {
          while (1) switch (_context18.p = _context18.n) {
            case 0:
              steamId = _args18.length > 1 && _args18[1] !== undefined ? _args18[1] : null;
              _context18.p = 1;
              this.apiKey = apiKey;
              _context18.n = 2;
              return this.testConnection(apiKey, steamId);
            case 2:
              connectionTest = _context18.v;
              if (!connectionTest.success) {
                _context18.n = 4;
                break;
              }
              finalSteamId = connectionTest.autoDiscovered ? connectionTest.data.steamid : steamId;
              _context18.n = 3;
              return this.setConnectionStatus(true, apiKey, finalSteamId);
            case 3:
              this.steamId = finalSteamId;
              this.isConnected = true;
              if (this.debugManager) {
                this.debugManager.log('steam', "Credenciais Steam salvas no cache - API Key: Definida, Steam ID: ".concat(finalSteamId || 'Não definido'));
              }
              return _context18.a(2, {
                success: true,
                message: connectionTest.autoDiscovered ? "Credenciais configuradas com sucesso! Steam ID descoberto automaticamente: ".concat(connectionTest.data.personaname) : 'Credenciais configuradas com sucesso!',
                data: connectionTest.data,
                autoDiscovered: connectionTest.autoDiscovered
              });
            case 4:
              _context18.n = 5;
              return this.setConnectionStatus(false);
            case 5:
              this.isConnected = false;
              return _context18.a(2, {
                success: false,
                error: connectionTest.error,
                suggestion: connectionTest.suggestion
              });
            case 6:
              _context18.n = 9;
              break;
            case 7:
              _context18.p = 7;
              _t7 = _context18.v;
              console.error('❌ Erro ao definir credenciais Steam:', _t7);
              _context18.n = 8;
              return this.setConnectionStatus(false);
            case 8:
              this.isConnected = false;
              return _context18.a(2, {
                success: false,
                error: "Erro ao configurar credenciais: ".concat(_t7.message)
              });
            case 9:
              return _context18.a(2);
          }
        }, _callee18, this, [[1, 7]]);
      }));
      function setCredentials(_x16) {
        return _setCredentials.apply(this, arguments);
      }
      return setCredentials;
    }())
  }, {
    key: "getCredentials",
    value: (function () {
      var _getCredentials = _asyncToGenerator(_regenerator().m(function _callee19() {
        var cacheData, _t8;
        return _regenerator().w(function (_context19) {
          while (1) switch (_context19.p = _context19.n) {
            case 0:
              _context19.p = 0;
              _context19.n = 1;
              return this.getConnectionStatus();
            case 1:
              cacheData = _context19.v;
              return _context19.a(2, {
                success: true,
                apiKey: cacheData.apiKey || '',
                steamId: cacheData.steamId || '',
                connected: cacheData.connected || false,
                lastUpdated: cacheData.lastUpdated,
                sessionId: cacheData.sessionId
              });
            case 2:
              _context19.p = 2;
              _t8 = _context19.v;
              return _context19.a(2, {
                success: false,
                error: _t8.message,
                apiKey: '',
                steamId: '',
                connected: false
              });
          }
        }, _callee19, this, [[0, 2]]);
      }));
      function getCredentials() {
        return _getCredentials.apply(this, arguments);
      }
      return getCredentials;
    }())
  }, {
    key: "testConnection",
    value: (function () {
      var _testConnection = _asyncToGenerator(_regenerator().m(function _callee20(apiKey, steamId) {
        var _data$response, testApiKey, testSteamId, discoveryResult, _yield$this$http$get, _data, _apiError$response, _apiError$response2, _apiError$response3, _yield$this$http$get2, data, player, status, _t9, _t0;
        return _regenerator().w(function (_context20) {
          while (1) switch (_context20.p = _context20.n) {
            case 0:
              _context20.p = 0;
              testApiKey = apiKey || this.apiKey;
              if (testApiKey) {
                _context20.n = 1;
                break;
              }
              return _context20.a(2, {
                success: false,
                error: 'API Key é obrigatória'
              });
            case 1:
              testSteamId = steamId || this.steamId;
              if (testSteamId) {
                _context20.n = 9;
                break;
              }
              _context20.n = 2;
              return this.discoverSteamId(testApiKey);
            case 2:
              discoveryResult = _context20.v;
              if (!discoveryResult.success) {
                _context20.n = 3;
                break;
              }
              testSteamId = discoveryResult.steamId;
              return _context20.a(2, {
                success: true,
                data: {
                  personaname: discoveryResult.profile.personaname,
                  avatar: discoveryResult.profile.avatar,
                  profileurl: discoveryResult.profile.profileurl,
                  steamid: discoveryResult.steamId
                },
                autoDiscovered: true,
                gamesCount: discoveryResult.gamesCount,
                message: "Conex\xE3o bem-sucedida! ".concat(discoveryResult.message)
              });
            case 3:
              _context20.p = 3;
              _context20.n = 4;
              return this.http.get('/ISteamUser/GetPlayerSummaries/v2/', {
                params: {
                  key: testApiKey,
                  steamids: '76561197960265728'
                }
              });
            case 4:
              _yield$this$http$get = _context20.v;
              _data = _yield$this$http$get.data;
              return _context20.a(2, {
                success: true,
                apiKeyValid: true,
                needsSteamId: false,
                message: 'API Key válida! Não foi possível descobrir seu Steam ID automaticamente. Verifique se sua biblioteca de jogos está pública.',
                suggestion: 'Para descoberta automática, certifique-se de que sua biblioteca de jogos Steam está pública.',
                discoveryError: discoveryResult.error
              });
            case 5:
              _context20.p = 5;
              _t9 = _context20.v;
              console.error('❌ Erro na validação da API Key:', _t9);
              if (!(((_apiError$response = _t9.response) === null || _apiError$response === void 0 ? void 0 : _apiError$response.status) === 403)) {
                _context20.n = 6;
                break;
              }
              return _context20.a(2, {
                success: false,
                error: 'API Key inválida ou sem permissões'
              });
            case 6:
              if (!(((_apiError$response2 = _t9.response) === null || _apiError$response2 === void 0 ? void 0 : _apiError$response2.status) === 401)) {
                _context20.n = 7;
                break;
              }
              return _context20.a(2, {
                success: false,
                error: 'API Key não autorizada'
              });
            case 7:
              if (!(((_apiError$response3 = _t9.response) === null || _apiError$response3 === void 0 ? void 0 : _apiError$response3.status) === 429)) {
                _context20.n = 8;
                break;
              }
              return _context20.a(2, {
                success: false,
                error: 'Muitas requisições. Tente novamente em alguns minutos'
              });
            case 8:
              throw _t9;
            case 9:
              _context20.n = 10;
              return this.http.get('/ISteamUser/GetPlayerSummaries/v2/', {
                params: {
                  key: testApiKey,
                  steamids: testSteamId
                }
              });
            case 10:
              _yield$this$http$get2 = _context20.v;
              data = _yield$this$http$get2.data;
              player = data === null || data === void 0 || (_data$response = data.response) === null || _data$response === void 0 || (_data$response = _data$response.players) === null || _data$response === void 0 ? void 0 : _data$response[0];
              if (!(player && player.steamid)) {
                _context20.n = 11;
                break;
              }
              return _context20.a(2, {
                success: true,
                data: {
                  personaname: player.personaname || 'Usuário Steam',
                  avatar: player.avatarfull || player.avatar || '',
                  profileurl: player.profileurl || '',
                  steamid: player.steamid
                }
              });
            case 11:
              return _context20.a(2, {
                success: false,
                error: 'Steam ID não encontrado ou inválido'
              });
            case 12:
              _context20.n = 17;
              break;
            case 13:
              _context20.p = 13;
              _t0 = _context20.v;
              console.error('❌ Erro no teste de conexão Steam:', _t0);
              if (!_t0.response) {
                _context20.n = 16;
                break;
              }
              status = _t0.response.status;
              if (!(status === 403)) {
                _context20.n = 14;
                break;
              }
              return _context20.a(2, {
                success: false,
                error: 'API Key inválida ou sem permissões'
              });
            case 14:
              if (!(status === 401)) {
                _context20.n = 15;
                break;
              }
              return _context20.a(2, {
                success: false,
                error: 'API Key não autorizada'
              });
            case 15:
              if (!(status === 429)) {
                _context20.n = 16;
                break;
              }
              return _context20.a(2, {
                success: false,
                error: 'Muitas requisições. Tente novamente em alguns minutos'
              });
            case 16:
              return _context20.a(2, {
                success: false,
                error: "Erro na conex\xE3o: ".concat(_t0.message)
              });
            case 17:
              return _context20.a(2);
          }
        }, _callee20, this, [[3, 5], [0, 13]]);
      }));
      function testConnection(_x17, _x18) {
        return _testConnection.apply(this, arguments);
      }
      return testConnection;
    }())
  }, {
    key: "checkConnection",
    value: (function () {
      var _checkConnection = _asyncToGenerator(_regenerator().m(function _callee21() {
        var credentials, connectionTest, _t1;
        return _regenerator().w(function (_context21) {
          while (1) switch (_context21.p = _context21.n) {
            case 0:
              _context21.p = 0;
              if (!(!this.isConnected || !this.apiKey || !this.steamId)) {
                _context21.n = 4;
                break;
              }
              _context21.n = 1;
              return this.getCredentials();
            case 1:
              credentials = _context21.v;
              if (!(credentials.success && credentials.apiKey && credentials.steamId)) {
                _context21.n = 3;
                break;
              }
              _context21.n = 2;
              return this.setCredentials(credentials.apiKey, credentials.steamId);
            case 2:
              return _context21.a(2, _context21.v);
            case 3:
              return _context21.a(2, {
                success: false,
                connected: false,
                error: 'Não conectado'
              });
            case 4:
              _context21.n = 5;
              return this.testConnection();
            case 5:
              connectionTest = _context21.v;
              return _context21.a(2, {
                success: connectionTest.success,
                connected: connectionTest.success,
                userInfo: connectionTest.success ? {
                  username: connectionTest.username,
                  avatar: connectionTest.avatar,
                  profileUrl: connectionTest.profileUrl
                } : null,
                error: connectionTest.error || null
              });
            case 6:
              _context21.p = 6;
              _t1 = _context21.v;
              return _context21.a(2, {
                success: false,
                connected: false,
                error: _t1.message
              });
          }
        }, _callee21, this, [[0, 6]]);
      }));
      function checkConnection() {
        return _checkConnection.apply(this, arguments);
      }
      return checkConnection;
    }())
  }, {
    key: "getUserGames",
    value: (function () {
      var _getUserGames = _asyncToGenerator(_regenerator().m(function _callee22() {
        var retryCount,
          options,
          maxRetries,
          retryDelay,
          cachedGames,
          _yield$this$http$get3,
          data,
          games,
          gameCount,
          validGames,
          sortedGames,
          mappedGames,
          finalGames,
          steamLocalGames,
          installedGames,
          installedAppIds,
          apiGameIds,
          matchingGames,
          result,
          isPrivateProfile,
          _result,
          status,
          statusText,
          _args22 = arguments,
          _t10,
          _t11,
          _t12;
        return _regenerator().w(function (_context22) {
          while (1) switch (_context22.p = _context22.n) {
            case 0:
              retryCount = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : 0;
              options = _args22.length > 1 && _args22[1] !== undefined ? _args22[1] : {};
              maxRetries = 3;
              retryDelay = 1000;
              _context22.p = 1;
              if (!(!this.apiKey || !this.steamId)) {
                _context22.n = 2;
                break;
              }
              return _context22.a(2, {
                success: false,
                error: 'Steam API não configurada',
                errorCode: 'CREDENTIALS_MISSING',
                suggestion: 'Configure sua API Key e Steam ID nas configurações'
              });
            case 2:
              if (!(options && options.installedOnly && global.steamLocalGamesManager)) {
                _context22.n = 4;
                break;
              }
              _context22.n = 3;
              return this.getInstalledGamesOptimized(retryCount);
            case 3:
              return _context22.a(2, _context22.v);
            case 4:
              cachedGames = this.getCache('userGames');
              if (!cachedGames) {
                _context22.n = 5;
                break;
              }
              return _context22.a(2, cachedGames);
            case 5:
              _context22.n = 6;
              return this.http.get('/IPlayerService/GetOwnedGames/v1/', {
                params: {
                  key: this.apiKey,
                  steamid: this.steamId,
                  include_appinfo: true,
                  include_played_free_games: true,
                  include_extended_appinfo: true,
                  skip_unvetted_apps: false,
                  language: 'portuguese',
                  format: 'json'
                },
                timeout: 30000
              });
            case 6:
              _yield$this$http$get3 = _context22.v;
              data = _yield$this$http$get3.data;
              if (!(!data || !data.response)) {
                _context22.n = 7;
                break;
              }
              throw new Error('Resposta inválida da Steam API');
            case 7:
              games = data.response.games || [];
              gameCount = data.response.game_count || 0;
              if (!(games.length > 0)) {
                _context22.n = 13;
                break;
              }
              validGames = games.filter(function (game) {
                return game.appid && game.name && game.name.trim() !== '' && game.appid > 0;
              });
              sortedGames = validGames.sort(function (a, b) {
                if (b.playtime_2weeks !== a.playtime_2weeks) {
                  return (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0);
                }
                if (b.playtime_forever !== a.playtime_forever) {
                  return (b.playtime_forever || 0) - (a.playtime_forever || 0);
                }
                return (a.name || '').localeCompare(b.name || '');
              });
              mappedGames = sortedGames.map(function (game) {
                var baseImageUrl = "https://media.steampowered.com/steamcommunity/public/images/apps/".concat(game.appid);
                return {
                  id: String(game.appid),
                  name: game.name.trim(),
                  playtimeForever: Math.max(0, game.playtime_forever || 0),
                  playTime2Weeks: Math.max(0, game.playtime_2weeks || 0),
                  imgIconUrl: game.img_icon_url ? "".concat(baseImageUrl, "/").concat(game.img_icon_url, ".jpg") : null,
                  imgLogoUrl: game.img_logo_url ? "".concat(baseImageUrl, "/").concat(game.img_logo_url, ".jpg") : null,
                  hasAchievements: true,
                  lastPlayed: game.rtime_last_played ? new Date(game.rtime_last_played * 1000) : null
                };
              });
              finalGames = mappedGames;
              if (!(options && options.installedOnly)) {
                _context22.n = 12;
                break;
              }
              _context22.p = 8;
              steamLocalGames = global.steamLocalGamesManager;
              if (!steamLocalGames) {
                _context22.n = 10;
                break;
              }
              _context22.n = 9;
              return steamLocalGames.getInstalledGames();
            case 9:
              installedGames = _context22.v;
              if (installedGames && installedGames.success && installedGames.installedGames && installedGames.installedGames.length > 0) {
                installedAppIds = new Set(installedGames.installedGames.map(function (appId) {
                  return String(appId);
                }));
                apiGameIds = new Set(mappedGames.map(function (game) {
                  return game.id;
                }));
                matchingGames = Array.from(installedAppIds).filter(function (id) {
                  return apiGameIds.has(id);
                });
                finalGames = mappedGames.filter(function (game) {
                  return installedAppIds.has(game.id);
                });
              } else {}
              _context22.n = 10;
              break;
            case 10:
              _context22.n = 12;
              break;
            case 11:
              _context22.p = 11;
              _t10 = _context22.v;
            case 12:
              result = {
                success: true,
                games: finalGames,
                totalGames: finalGames.length,
                reportedTotal: gameCount,
                installedOnly: options && options.installedOnly,
                metadata: {
                  fetchedAt: new Date().toISOString(),
                  steamId: this.steamId,
                  hasPrivateProfile: gameCount === 0 && games.length === 0
                }
              };
              if (!options || !options.installedOnly) {
                this.setCache('userGames', result);
              }
              return _context22.a(2, result);
            case 13:
              isPrivateProfile = gameCount === 0;
              _result = {
                success: true,
                games: [],
                totalGames: 0,
                reportedTotal: gameCount,
                metadata: {
                  fetchedAt: new Date().toISOString(),
                  steamId: this.steamId,
                  hasPrivateProfile: isPrivateProfile
                },
                warning: isPrivateProfile ? 'Biblioteca vazia ou perfil privado. Verifique se sua biblioteca de jogos está pública.' : null
              };
              this.setCache('userGames', _result);
              return _context22.a(2, _result);
            case 14:
              _context22.n = 30;
              break;
            case 15:
              _context22.p = 15;
              _t11 = _context22.v;
              if (!_t11.response) {
                _context22.n = 25;
                break;
              }
              status = _t11.response.status;
              statusText = _t11.response.statusText;
              _t12 = status;
              _context22.n = _t12 === 401 ? 16 : _t12 === 403 ? 17 : _t12 === 429 ? 18 : _t12 === 500 ? 21 : _t12 === 502 ? 21 : _t12 === 503 ? 21 : 24;
              break;
            case 16:
              return _context22.a(2, {
                success: false,
                error: 'API Key inválida ou não autorizada',
                errorCode: 'UNAUTHORIZED',
                suggestion: 'Verifique se sua API Key está correta e ativa'
              });
            case 17:
              return _context22.a(2, {
                success: false,
                error: 'Acesso negado. Perfil pode estar privado',
                errorCode: 'FORBIDDEN',
                suggestion: 'Verifique se sua biblioteca de jogos está pública no Steam'
              });
            case 18:
              if (!(retryCount < maxRetries)) {
                _context22.n = 20;
                break;
              }
              _context22.n = 19;
              return new Promise(function (resolve) {
                return setTimeout(resolve, retryDelay * (retryCount + 1));
              });
            case 19:
              return _context22.a(2, this.getUserGames(retryCount + 1));
            case 20:
              return _context22.a(2, {
                success: false,
                error: 'Muitas requisições. Tente novamente em alguns minutos',
                errorCode: 'RATE_LIMITED',
                suggestion: 'Aguarde alguns minutos antes de tentar novamente'
              });
            case 21:
              if (!(retryCount < maxRetries)) {
                _context22.n = 23;
                break;
              }
              _context22.n = 22;
              return new Promise(function (resolve) {
                return setTimeout(resolve, retryDelay);
              });
            case 22:
              return _context22.a(2, this.getUserGames(retryCount + 1));
            case 23:
              return _context22.a(2, {
                success: false,
                error: 'Servidores Steam temporariamente indisponíveis',
                errorCode: 'SERVER_ERROR',
                suggestion: 'Tente novamente em alguns minutos'
              });
            case 24:
              return _context22.a(2, {
                success: false,
                error: "Erro HTTP ".concat(status, ": ").concat(statusText),
                errorCode: 'HTTP_ERROR',
                suggestion: 'Verifique sua conexão com a internet'
              });
            case 25:
              if (!(_t11.code === 'ECONNABORTED' || _t11.message.includes('timeout'))) {
                _context22.n = 28;
                break;
              }
              if (!(retryCount < maxRetries)) {
                _context22.n = 27;
                break;
              }
              _context22.n = 26;
              return new Promise(function (resolve) {
                return setTimeout(resolve, retryDelay);
              });
            case 26:
              return _context22.a(2, this.getUserGames(retryCount + 1));
            case 27:
              return _context22.a(2, {
                success: false,
                error: 'Timeout na conexão com Steam API',
                errorCode: 'TIMEOUT',
                suggestion: 'Verifique sua conexão com a internet e tente novamente'
              });
            case 28:
              if (!(_t11.code === 'ENOTFOUND' || _t11.code === 'ECONNREFUSED')) {
                _context22.n = 29;
                break;
              }
              return _context22.a(2, {
                success: false,
                error: 'Não foi possível conectar com a Steam API',
                errorCode: 'NETWORK_ERROR',
                suggestion: 'Verifique sua conexão com a internet'
              });
            case 29:
              return _context22.a(2, {
                success: false,
                error: "Erro inesperado: ".concat(_t11.message),
                errorCode: 'UNKNOWN_ERROR',
                suggestion: 'Tente novamente ou verifique os logs para mais detalhes'
              });
            case 30:
              return _context22.a(2);
          }
        }, _callee22, this, [[8, 11], [1, 15]]);
      }));
      function getUserGames() {
        return _getUserGames.apply(this, arguments);
      }
      return getUserGames;
    }())
  }, {
    key: "getInstalledGamesOptimized",
    value: (function () {
      var _getInstalledGamesOptimized = _asyncToGenerator(_regenerator().m(function _callee23() {
        var retryCount,
          maxRetries,
          retryDelay,
          steamLocalGames,
          installedGamesResult,
          installedAppIds,
          installedAppIdsNumbers,
          directSearchResult,
          _yield$this$http$get4,
          data,
          allGames,
          installedAppIdsSet,
          installedGames,
          mappedGames,
          sortedGames,
          result,
          _args23 = arguments,
          _t13;
        return _regenerator().w(function (_context23) {
          while (1) switch (_context23.p = _context23.n) {
            case 0:
              retryCount = _args23.length > 0 && _args23[0] !== undefined ? _args23[0] : 0;
              maxRetries = 3;
              retryDelay = 1000;
              _context23.p = 1;
              steamLocalGames = global.steamLocalGamesManager;
              if (steamLocalGames) {
                _context23.n = 2;
                break;
              }
              return _context23.a(2, {
                success: false,
                error: 'Gerenciador de jogos locais não disponível',
                games: []
              });
            case 2:
              _context23.n = 3;
              return steamLocalGames.getInstalledGames();
            case 3:
              installedGamesResult = _context23.v;
              if (!(!installedGamesResult.success || !installedGamesResult.installedGames || installedGamesResult.installedGames.length === 0)) {
                _context23.n = 4;
                break;
              }
              return _context23.a(2, {
                success: true,
                games: [],
                totalGames: 0,
                installedOnly: true,
                metadata: {
                  fetchedAt: new Date().toISOString(),
                  steamId: this.steamId,
                  optimizedSearch: true
                }
              });
            case 4:
              installedAppIds = installedGamesResult.installedGames;
              installedAppIdsNumbers = installedAppIds.map(function (id) {
                return parseInt(id, 10);
              });
              _context23.n = 5;
              return this.getInstalledGamesDirectSearch(installedAppIdsNumbers);
            case 5:
              directSearchResult = _context23.v;
              if (!(directSearchResult.success && directSearchResult.games.length > 0)) {
                _context23.n = 6;
                break;
              }
              return _context23.a(2, directSearchResult);
            case 6:
              _context23.n = 7;
              return this.http.get('/IPlayerService/GetOwnedGames/v1/', {
                params: {
                  key: this.apiKey,
                  steamid: this.steamId,
                  include_appinfo: true,
                  include_played_free_games: true,
                  include_extended_appinfo: true,
                  skip_unvetted_apps: false,
                  language: 'portuguese',
                  format: 'json'
                },
                timeout: 30000
              });
            case 7:
              _yield$this$http$get4 = _context23.v;
              data = _yield$this$http$get4.data;
              if (!(!data || !data.response)) {
                _context23.n = 8;
                break;
              }
              throw new Error('Resposta inválida da Steam API');
            case 8:
              allGames = data.response.games || [];
              installedAppIdsSet = new Set(installedAppIdsNumbers);
              installedGames = allGames.filter(function (game) {
                return game.appid && game.name && game.name.trim() !== '' && installedAppIdsSet.has(game.appid);
              });
              if (!(installedGames.length === 0 && installedAppIdsNumbers.length > 0)) {
                _context23.n = 10;
                break;
              }
              _context23.n = 9;
              return this.getInstalledGamesByIndividualSearch(installedAppIdsNumbers);
            case 9:
              return _context23.a(2, _context23.v);
            case 10:
              mappedGames = installedGames.map(function (game) {
                var baseImageUrl = "https://media.steampowered.com/steamcommunity/public/images/apps/".concat(game.appid);
                return {
                  id: String(game.appid),
                  name: game.name.trim(),
                  playtimeForever: Math.max(0, game.playtime_forever || 0),
                  playTime2Weeks: Math.max(0, game.playtime_2weeks || 0),
                  imgIconUrl: game.img_icon_url ? "".concat(baseImageUrl, "/").concat(game.img_icon_url, ".jpg") : null,
                  imgLogoUrl: game.img_logo_url ? "".concat(baseImageUrl, "/").concat(game.img_logo_url, ".jpg") : null,
                  hasAchievements: true,
                  lastPlayed: game.rtime_last_played ? new Date(game.rtime_last_played * 1000) : null
                };
              });
              sortedGames = mappedGames.sort(function (a, b) {
                if (b.playTime2Weeks !== a.playTime2Weeks) {
                  return (b.playTime2Weeks || 0) - (a.playTime2Weeks || 0);
                }
                if (b.playtimeForever !== a.playtimeForever) {
                  return (b.playtimeForever || 0) - (a.playtimeForever || 0);
                }
                return (a.name || '').localeCompare(b.name || '');
              });
              result = {
                success: true,
                games: sortedGames,
                totalGames: sortedGames.length,
                installedOnly: true,
                metadata: {
                  fetchedAt: new Date().toISOString(),
                  steamId: this.steamId,
                  optimizedSearch: true,
                  totalInstalledFound: installedAppIds.length,
                  matchedInLibrary: sortedGames.length
                }
              };
              return _context23.a(2, result);
            case 11:
              _context23.p = 11;
              _t13 = _context23.v;
              if (!(_t13.response && _t13.response.status === 429 && retryCount < maxRetries)) {
                _context23.n = 13;
                break;
              }
              _context23.n = 12;
              return new Promise(function (resolve) {
                return setTimeout(resolve, retryDelay * 2);
              });
            case 12:
              return _context23.a(2, this.getInstalledGamesOptimized(retryCount + 1));
            case 13:
              if (!(retryCount < maxRetries && (_t13.code === 'ECONNABORTED' || _t13.message.includes('timeout')))) {
                _context23.n = 15;
                break;
              }
              _context23.n = 14;
              return new Promise(function (resolve) {
                return setTimeout(resolve, retryDelay);
              });
            case 14:
              return _context23.a(2, this.getInstalledGamesOptimized(retryCount + 1));
            case 15:
              return _context23.a(2, {
                success: false,
                error: "Erro na busca otimizada: ".concat(_t13.message),
                games: [],
                installedOnly: true
              });
          }
        }, _callee23, this, [[1, 11]]);
      }));
      function getInstalledGamesOptimized() {
        return _getInstalledGamesOptimized.apply(this, arguments);
      }
      return getInstalledGamesOptimized;
    }())
  }, {
    key: "getInstalledGamesDirectSearch",
    value: (function () {
      var _getInstalledGamesDirectSearch = _asyncToGenerator(_regenerator().m(function _callee25() {
        var _this2 = this;
        var installedAppIds,
          steamLocalGames,
          installedGamesResult,
          foundGames,
          batchSize,
          maxConcurrent,
          i,
          megaBatch,
          j,
          startIdx,
          batch,
          megaBatchPromises,
          megaBatchResults,
          validGames,
          sortedGames,
          _args25 = arguments,
          _t17;
        return _regenerator().w(function (_context25) {
          while (1) switch (_context25.p = _context25.n) {
            case 0:
              installedAppIds = _args25.length > 0 && _args25[0] !== undefined ? _args25[0] : null;
              _context25.p = 1;
              if (installedAppIds) {
                _context25.n = 5;
                break;
              }
              steamLocalGames = global.steamLocalGamesManager;
              if (steamLocalGames) {
                _context25.n = 2;
                break;
              }
              return _context25.a(2, {
                success: false,
                error: 'Gerenciador de jogos locais não disponível',
                games: []
              });
            case 2:
              _context25.n = 3;
              return steamLocalGames.getInstalledGames();
            case 3:
              installedGamesResult = _context25.v;
              if (!(!installedGamesResult.success || !installedGamesResult.installedGames || installedGamesResult.installedGames.length === 0)) {
                _context25.n = 4;
                break;
              }
              return _context25.a(2, {
                success: true,
                games: [],
                totalGames: 0,
                installedOnly: true,
                metadata: {
                  fetchedAt: new Date().toISOString(),
                  steamId: this.steamId,
                  directSearch: true
                }
              });
            case 4:
              installedAppIds = installedGamesResult.installedGames.map(function (id) {
                return parseInt(id, 10);
              });
            case 5:
              foundGames = [];
              batchSize = 10;
              maxConcurrent = 3;
              i = 0;
            case 6:
              if (!(i < installedAppIds.length)) {
                _context25.n = 9;
                break;
              }
              megaBatch = [];
              for (j = 0; j < maxConcurrent && i + j * batchSize < installedAppIds.length; j++) {
                startIdx = i + j * batchSize;
                batch = installedAppIds.slice(startIdx, startIdx + batchSize);
                if (batch.length > 0) {
                  megaBatch.push(batch);
                }
              }
              megaBatchPromises = megaBatch.map(function () {
                var _ref13 = _asyncToGenerator(_regenerator().m(function _callee24(batch, batchIndex) {
                  var batchResults, _iterator3, _step3, appId, storeResponse, _playtimeData, _playtimeData2, _playtimeData3, _gameData$price_overv, _gameData$developers, _gameData$publishers, gameData, playtimeData, _playtimeResponse$dat, playtimeResponse, baseImageUrl, gameInfo, _t14, _t15, _t16;
                  return _regenerator().w(function (_context24) {
                    while (1) switch (_context24.p = _context24.n) {
                      case 0:
                        batchResults = [];
                        _iterator3 = _createForOfIteratorHelper(batch);
                        _context24.p = 1;
                        _iterator3.s();
                      case 2:
                        if ((_step3 = _iterator3.n()).done) {
                          _context24.n = 13;
                          break;
                        }
                        appId = _step3.value;
                        _context24.p = 3;
                        _context24.n = 4;
                        return _this2.http.get("https://store.steampowered.com/api/appdetails", {
                          params: {
                            appids: appId,
                            l: 'portuguese',
                            cc: 'BR',
                            filters: 'basic,price_overview'
                          },
                          timeout: 8000
                        });
                      case 4:
                        storeResponse = _context24.v;
                        if (!(storeResponse.data && storeResponse.data[appId] && storeResponse.data[appId].success)) {
                          _context24.n = 9;
                          break;
                        }
                        gameData = storeResponse.data[appId].data;
                        playtimeData = null;
                        _context24.p = 5;
                        _context24.n = 6;
                        return _this2.http.get('/IPlayerService/GetOwnedGames/v1/', {
                          params: {
                            key: _this2.apiKey,
                            steamid: _this2.steamId,
                            appids_filter: [appId],
                            include_appinfo: false,
                            format: 'json'
                          },
                          timeout: 5000
                        });
                      case 6:
                        playtimeResponse = _context24.v;
                        if (((_playtimeResponse$dat = playtimeResponse.data) === null || _playtimeResponse$dat === void 0 || (_playtimeResponse$dat = _playtimeResponse$dat.response) === null || _playtimeResponse$dat === void 0 || (_playtimeResponse$dat = _playtimeResponse$dat.games) === null || _playtimeResponse$dat === void 0 ? void 0 : _playtimeResponse$dat.length) > 0) {
                          playtimeData = playtimeResponse.data.response.games[0];
                        }
                        _context24.n = 8;
                        break;
                      case 7:
                        _context24.p = 7;
                        _t14 = _context24.v;
                      case 8:
                        baseImageUrl = "https://media.steampowered.com/steamcommunity/public/images/apps/".concat(appId);
                        gameInfo = {
                          id: String(appId),
                          name: gameData.name || "Jogo ".concat(appId),
                          playtimeForever: ((_playtimeData = playtimeData) === null || _playtimeData === void 0 ? void 0 : _playtimeData.playtime_forever) || 0,
                          playTime2Weeks: ((_playtimeData2 = playtimeData) === null || _playtimeData2 === void 0 ? void 0 : _playtimeData2.playtime_2weeks) || 0,
                          imgIconUrl: gameData.header_image ? gameData.header_image.replace('header', 'icon') : "".concat(baseImageUrl, "/icon.jpg"),
                          imgLogoUrl: gameData.header_image || "".concat(baseImageUrl, "/logo.jpg"),
                          hasAchievements: true,
                          lastPlayed: (_playtimeData3 = playtimeData) !== null && _playtimeData3 !== void 0 && _playtimeData3.rtime_last_played ? new Date(playtimeData.rtime_last_played * 1000) : null,
                          price: ((_gameData$price_overv = gameData.price_overview) === null || _gameData$price_overv === void 0 ? void 0 : _gameData$price_overv.final_formatted) || 'Gratuito',
                          developer: ((_gameData$developers = gameData.developers) === null || _gameData$developers === void 0 ? void 0 : _gameData$developers[0]) || 'Desconhecido',
                          publisher: ((_gameData$publishers = gameData.publishers) === null || _gameData$publishers === void 0 ? void 0 : _gameData$publishers[0]) || 'Desconhecido'
                        };
                        batchResults.push(gameInfo);
                        _context24.n = 9;
                        break;
                      case 9:
                        _context24.n = 11;
                        break;
                      case 10:
                        _context24.p = 10;
                        _t15 = _context24.v;
                      case 11:
                        _context24.n = 12;
                        return new Promise(function (resolve) {
                          return setTimeout(resolve, 200);
                        });
                      case 12:
                        _context24.n = 2;
                        break;
                      case 13:
                        _context24.n = 15;
                        break;
                      case 14:
                        _context24.p = 14;
                        _t16 = _context24.v;
                        _iterator3.e(_t16);
                      case 15:
                        _context24.p = 15;
                        _iterator3.f();
                        return _context24.f(15);
                      case 16:
                        return _context24.a(2, batchResults);
                    }
                  }, _callee24, null, [[5, 7], [3, 10], [1, 14, 15, 16]]);
                }));
                return function (_x19, _x20) {
                  return _ref13.apply(this, arguments);
                };
              }());
              _context25.n = 7;
              return Promise.all(megaBatchPromises);
            case 7:
              megaBatchResults = _context25.v;
              validGames = megaBatchResults.flat();
              foundGames.push.apply(foundGames, _toConsumableArray(validGames));
              if (!(i + batchSize * maxConcurrent < installedAppIds.length)) {
                _context25.n = 8;
                break;
              }
              _context25.n = 8;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 1500);
              });
            case 8:
              i += batchSize * maxConcurrent;
              _context25.n = 6;
              break;
            case 9:
              sortedGames = foundGames.sort(function (a, b) {
                if (b.playTime2Weeks !== a.playTime2Weeks) {
                  return (b.playTime2Weeks || 0) - (a.playTime2Weeks || 0);
                }
                if (b.playtimeForever !== a.playtimeForever) {
                  return (b.playtimeForever || 0) - (a.playtimeForever || 0);
                }
                return (a.name || '').localeCompare(b.name || '');
              });
              return _context25.a(2, {
                success: true,
                games: sortedGames,
                totalGames: sortedGames.length,
                installedOnly: true,
                metadata: {
                  fetchedAt: new Date().toISOString(),
                  steamId: this.steamId,
                  directSearch: true,
                  libraryDownloadAvoided: true,
                  totalRequested: installedAppIds.length,
                  totalFound: sortedGames.length,
                  efficiencyGain: "Evitou baixar ".concat(1127 - installedAppIds.length, " jogos desnecess\xE1rios")
                }
              });
            case 10:
              _context25.p = 10;
              _t17 = _context25.v;
              return _context25.a(2, {
                success: false,
                error: "Erro na busca direta: ".concat(_t17.message),
                games: [],
                installedOnly: true
              });
          }
        }, _callee25, this, [[1, 10]]);
      }));
      function getInstalledGamesDirectSearch() {
        return _getInstalledGamesDirectSearch.apply(this, arguments);
      }
      return getInstalledGamesDirectSearch;
    }())
  }, {
    key: "getInstalledGamesByIndividualSearch",
    value: (function () {
      var _getInstalledGamesByIndividualSearch = _asyncToGenerator(_regenerator().m(function _callee27(installedAppIds) {
        var _this3 = this;
        var foundGames, batchSize, i, batch, batchPromises, batchResults, validGames, sortedGames, _t20;
        return _regenerator().w(function (_context27) {
          while (1) switch (_context27.p = _context27.n) {
            case 0:
              _context27.p = 0;
              foundGames = [];
              batchSize = 5;
              i = 0;
            case 1:
              if (!(i < installedAppIds.length)) {
                _context27.n = 4;
                break;
              }
              batch = installedAppIds.slice(i, i + batchSize);
              batchPromises = batch.map(function () {
                var _ref14 = _asyncToGenerator(_regenerator().m(function _callee26(appId) {
                  var response, _playtimeData4, _playtimeData5, _gameData$achievement, _playtimeData6, _gameData$price_overv2, _gameData$developers2, _gameData$publishers2, gameData, playtimeData, _playtimeResponse$dat2, playtimeResponse, baseImageUrl, _t18, _t19;
                  return _regenerator().w(function (_context26) {
                    while (1) switch (_context26.p = _context26.n) {
                      case 0:
                        _context26.p = 0;
                        _context26.n = 1;
                        return _this3.http.get("https://store.steampowered.com/api/appdetails", {
                          params: {
                            appids: appId,
                            l: 'portuguese',
                            cc: 'BR'
                          },
                          timeout: 10000
                        });
                      case 1:
                        response = _context26.v;
                        if (!(response.data && response.data[appId] && response.data[appId].success)) {
                          _context26.n = 6;
                          break;
                        }
                        gameData = response.data[appId].data;
                        playtimeData = null;
                        _context26.p = 2;
                        _context26.n = 3;
                        return _this3.http.get('/IPlayerService/GetOwnedGames/v1/', {
                          params: {
                            key: _this3.apiKey,
                            steamid: _this3.steamId,
                            appids_filter: [appId],
                            include_appinfo: true,
                            format: 'json'
                          },
                          timeout: 5000
                        });
                      case 3:
                        playtimeResponse = _context26.v;
                        if (((_playtimeResponse$dat2 = playtimeResponse.data) === null || _playtimeResponse$dat2 === void 0 || (_playtimeResponse$dat2 = _playtimeResponse$dat2.response) === null || _playtimeResponse$dat2 === void 0 || (_playtimeResponse$dat2 = _playtimeResponse$dat2.games) === null || _playtimeResponse$dat2 === void 0 ? void 0 : _playtimeResponse$dat2.length) > 0) {
                          playtimeData = playtimeResponse.data.response.games[0];
                        }
                        _context26.n = 5;
                        break;
                      case 4:
                        _context26.p = 4;
                        _t18 = _context26.v;
                      case 5:
                        baseImageUrl = "https://media.steampowered.com/steamcommunity/public/images/apps/".concat(appId);
                        return _context26.a(2, {
                          id: String(appId),
                          name: gameData.name || "Jogo ".concat(appId),
                          playtimeForever: ((_playtimeData4 = playtimeData) === null || _playtimeData4 === void 0 ? void 0 : _playtimeData4.playtime_forever) || 0,
                          playTime2Weeks: ((_playtimeData5 = playtimeData) === null || _playtimeData5 === void 0 ? void 0 : _playtimeData5.playtime_2weeks) || 0,
                          imgIconUrl: gameData.header_image ? gameData.header_image.replace('header', 'icon') : "".concat(baseImageUrl, "/icon.jpg"),
                          imgLogoUrl: gameData.header_image || "".concat(baseImageUrl, "/logo.jpg"),
                          hasAchievements: ((_gameData$achievement = gameData.achievements) === null || _gameData$achievement === void 0 ? void 0 : _gameData$achievement.total) > 0 || true,
                          lastPlayed: (_playtimeData6 = playtimeData) !== null && _playtimeData6 !== void 0 && _playtimeData6.rtime_last_played ? new Date(playtimeData.rtime_last_played * 1000) : null,
                          price: ((_gameData$price_overv2 = gameData.price_overview) === null || _gameData$price_overv2 === void 0 ? void 0 : _gameData$price_overv2.final_formatted) || 'Gratuito',
                          developer: ((_gameData$developers2 = gameData.developers) === null || _gameData$developers2 === void 0 ? void 0 : _gameData$developers2[0]) || 'Desconhecido',
                          publisher: ((_gameData$publishers2 = gameData.publishers) === null || _gameData$publishers2 === void 0 ? void 0 : _gameData$publishers2[0]) || 'Desconhecido'
                        });
                      case 6:
                        return _context26.a(2, null);
                      case 7:
                        _context26.p = 7;
                        _t19 = _context26.v;
                        return _context26.a(2, null);
                    }
                  }, _callee26, null, [[2, 4], [0, 7]]);
                }));
                return function (_x22) {
                  return _ref14.apply(this, arguments);
                };
              }());
              _context27.n = 2;
              return Promise.all(batchPromises);
            case 2:
              batchResults = _context27.v;
              validGames = batchResults.filter(function (game) {
                return game !== null;
              });
              foundGames.push.apply(foundGames, _toConsumableArray(validGames));
              if (!(i + batchSize < installedAppIds.length)) {
                _context27.n = 3;
                break;
              }
              _context27.n = 3;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 1000);
              });
            case 3:
              i += batchSize;
              _context27.n = 1;
              break;
            case 4:
              sortedGames = foundGames.sort(function (a, b) {
                if (b.playTime2Weeks !== a.playTime2Weeks) {
                  return (b.playTime2Weeks || 0) - (a.playTime2Weeks || 0);
                }
                if (b.playtimeForever !== a.playtimeForever) {
                  return (b.playtimeForever || 0) - (a.playtimeForever || 0);
                }
                return (a.name || '').localeCompare(b.name || '');
              });
              return _context27.a(2, {
                success: true,
                games: sortedGames,
                totalGames: sortedGames.length,
                installedOnly: true,
                metadata: {
                  fetchedAt: new Date().toISOString(),
                  steamId: this.steamId,
                  optimizedSearch: true,
                  individualSearch: true,
                  totalRequested: installedAppIds.length,
                  totalFound: sortedGames.length
                }
              });
            case 5:
              _context27.p = 5;
              _t20 = _context27.v;
              return _context27.a(2, {
                success: false,
                error: "Erro na busca individual: ".concat(_t20.message),
                games: [],
                installedOnly: true
              });
          }
        }, _callee27, this, [[0, 5]]);
      }));
      function getInstalledGamesByIndividualSearch(_x21) {
        return _getInstalledGamesByIndividualSearch.apply(this, arguments);
      }
      return getInstalledGamesByIndividualSearch;
    }())
  }, {
    key: "getGameAchievements",
    value: (function () {
      var _getGameAchievements = _asyncToGenerator(_regenerator().m(function _callee28(gameId) {
        var language,
          cachedAchievements,
          result,
          _error$response,
          _error$response2,
          _error$response3,
          _error$config,
          _error$config2,
          errorMessage,
          _args28 = arguments,
          _t21;
        return _regenerator().w(function (_context28) {
          while (1) switch (_context28.p = _context28.n) {
            case 0:
              language = _args28.length > 1 && _args28[1] !== undefined ? _args28[1] : null;
              _context28.p = 1;
              if (this.apiKey) {
                _context28.n = 2;
                break;
              }
              return _context28.a(2, {
                success: false,
                error: 'Steam API não configurada'
              });
            case 2:
              if (language) {
                _context28.n = 4;
                break;
              }
              _context28.n = 3;
              return this.detectUserLanguage();
            case 3:
              language = _context28.v;
            case 4:
              cachedAchievements = this.getCache('gameAchievements', gameId, language);
              if (!cachedAchievements) {
                _context28.n = 5;
                break;
              }
              return _context28.a(2, cachedAchievements);
            case 5:
              _context28.n = 6;
              return this.fetchGameAchievements(gameId, language);
            case 6:
              result = _context28.v;
              if (!(!result.success && language !== 'en')) {
                _context28.n = 8;
                break;
              }
              _context28.n = 7;
              return this.fetchGameAchievements(gameId, 'en');
            case 7:
              result = _context28.v;
              if (result.success) {
                result.fallbackLanguage = 'en';
                result.requestedLanguage = language;
              }
            case 8:
              if (result.success) {
                this.setCache('gameAchievements', result, gameId, language);
              }
              return _context28.a(2, result);
            case 9:
              _context28.p = 9;
              _t21 = _context28.v;
              if (this.debugManager) {
                this.debugManager.error('Erro detalhado ao buscar conquistas do jogo:', {
                  gameId: gameId,
                  language: language,
                  message: _t21.message,
                  status: (_error$response = _t21.response) === null || _error$response === void 0 ? void 0 : _error$response.status,
                  statusText: (_error$response2 = _t21.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.statusText,
                  data: (_error$response3 = _t21.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.data,
                  config: {
                    url: (_error$config = _t21.config) === null || _error$config === void 0 ? void 0 : _error$config.url,
                    params: (_error$config2 = _t21.config) === null || _error$config2 === void 0 ? void 0 : _error$config2.params
                  }
                });
              }
              errorMessage = "Erro ao buscar conquistas: ".concat(_t21.message);
              if (_t21.response) {
                errorMessage += " (Status: ".concat(_t21.response.status, ")");
                if (_t21.response.data) {
                  errorMessage += " - ".concat(JSON.stringify(_t21.response.data));
                }
              }
              return _context28.a(2, {
                success: false,
                error: errorMessage
              });
          }
        }, _callee28, this, [[1, 9]]);
      }));
      function getGameAchievements(_x23) {
        return _getGameAchievements.apply(this, arguments);
      }
      return getGameAchievements;
    }())
  }, {
    key: "fetchGameAchievements",
    value: (function () {
      var _fetchGameAchievements = _asyncToGenerator(_regenerator().m(function _callee29(gameId, language) {
        var _data$game, params, _yield$this$http$get5, data, achievements, _t22;
        return _regenerator().w(function (_context29) {
          while (1) switch (_context29.p = _context29.n) {
            case 0:
              _context29.p = 0;
              params = {
                key: this.apiKey,
                appid: gameId
              };
              if (language) {
                params.l = language;
              }
              _context29.n = 1;
              return this.http.get('/ISteamUserStats/GetSchemaForGame/v2/', {
                params: params
              });
            case 1:
              _yield$this$http$get5 = _context29.v;
              data = _yield$this$http$get5.data;
              achievements = (data === null || data === void 0 || (_data$game = data.game) === null || _data$game === void 0 || (_data$game = _data$game.availableGameStats) === null || _data$game === void 0 ? void 0 : _data$game.achievements) || [];
              if (!(achievements && achievements.length > 0)) {
                _context29.n = 2;
                break;
              }
              return _context29.a(2, {
                success: true,
                achievements: achievements.map(function (a) {
                  return {
                    id: a.name,
                    name: a.displayName,
                    description: a.description,
                    icon: a.icon,
                    icongray: a.icongray,
                    hidden: a.hidden || false
                  };
                }),
                totalAchievements: achievements.length,
                language: language
              });
            case 2:
              return _context29.a(2, {
                success: true,
                achievements: [],
                totalAchievements: 0,
                language: language
              });
            case 3:
              _context29.n = 5;
              break;
            case 4:
              _context29.p = 4;
              _t22 = _context29.v;
              return _context29.a(2, {
                success: false,
                error: "Erro ao buscar conquistas: ".concat(_t22.message),
                language: language
              });
            case 5:
              return _context29.a(2);
          }
        }, _callee29, this, [[0, 4]]);
      }));
      function fetchGameAchievements(_x24, _x25) {
        return _fetchGameAchievements.apply(this, arguments);
      }
      return fetchGameAchievements;
    }())
  }, {
    key: "detectUserLanguage",
    value: (function () {
      var _detectUserLanguage = _asyncToGenerator(_regenerator().m(function _callee30() {
        var settingsPath, settingsContent, settings, _mappedLanguage, systemLanguage, mappedLanguage, _t23, _t24;
        return _regenerator().w(function (_context30) {
          while (1) switch (_context30.p = _context30.n) {
            case 0:
              _context30.p = 0;
              if (!this.pathManager) {
                _context30.n = 5;
                break;
              }
              settingsPath = path.join(this.pathManager.getDataPath(), 'settings', 'app.json');
              _context30.p = 1;
              _context30.n = 2;
              return fs.readFile(settingsPath, 'utf8');
            case 2:
              settingsContent = _context30.v;
              settings = JSON.parse(settingsContent);
              if (!settings.language) {
                _context30.n = 3;
                break;
              }
              _mappedLanguage = this.mapLanguageToSteamCode(settings.language);
              return _context30.a(2, _mappedLanguage);
            case 3:
              _context30.n = 5;
              break;
            case 4:
              _context30.p = 4;
              _t23 = _context30.v;
            case 5:
              systemLanguage = Intl.DateTimeFormat().resolvedOptions().locale;
              mappedLanguage = this.mapLanguageToSteamCode(systemLanguage);
              return _context30.a(2, mappedLanguage);
            case 6:
              _context30.p = 6;
              _t24 = _context30.v;
              return _context30.a(2, 'en');
          }
        }, _callee30, this, [[1, 4], [0, 6]]);
      }));
      function detectUserLanguage() {
        return _detectUserLanguage.apply(this, arguments);
      }
      return detectUserLanguage;
    }())
  }, {
    key: "mapLanguageToSteamCode",
    value: function mapLanguageToSteamCode(languageCode) {
      var languageMap = {
        'pt-BR': 'brazilian',
        pt: 'brazilian',
        'pt-PT': 'pt',
        en: 'en',
        'en-US': 'en',
        'en-GB': 'en'
      };
      return languageMap[languageCode] || 'en';
    }
  }, {
    key: "getUserGameAchievements",
    value: (function () {
      var _getUserGameAchievements = _asyncToGenerator(_regenerator().m(function _callee31(gameId) {
        var language,
          userAchievementsResult,
          fallbackResult,
          schemaResult,
          _args31 = arguments,
          _t25;
        return _regenerator().w(function (_context31) {
          while (1) switch (_context31.p = _context31.n) {
            case 0:
              language = _args31.length > 1 && _args31[1] !== undefined ? _args31[1] : null;
              _context31.p = 1;
              if (this.debugManager) {
                this.debugManager.log("\uD83D\uDD0D Buscando conquistas do usu\xE1rio para o jogo ".concat(gameId, " (vers\xE3o simplificada)"));
              }
              if (!(!this.apiKey || !this.steamId)) {
                _context31.n = 2;
                break;
              }
              return _context31.a(2, {
                success: false,
                error: 'Steam API não configurada',
                errorType: 'MISSING_CREDENTIALS'
              });
            case 2:
              if (language) {
                _context31.n = 4;
                break;
              }
              _context31.n = 3;
              return this.detectUserLanguage();
            case 3:
              language = _context31.v;
            case 4:
              _context31.n = 5;
              return this.tryGetPlayerAchievements(gameId, language);
            case 5:
              userAchievementsResult = _context31.v;
              if (!userAchievementsResult.success) {
                _context31.n = 6;
                break;
              }
              return _context31.a(2, _objectSpread(_objectSpread({}, userAchievementsResult), {}, {
                strategy: 'GetPlayerAchievements',
                language: language
              }));
            case 6:
              if (!(language !== 'en')) {
                _context31.n = 8;
                break;
              }
              _context31.n = 7;
              return this.tryGetPlayerAchievements(gameId, 'en');
            case 7:
              fallbackResult = _context31.v;
              if (!fallbackResult.success) {
                _context31.n = 8;
                break;
              }
              return _context31.a(2, _objectSpread(_objectSpread({}, fallbackResult), {}, {
                strategy: 'GetPlayerAchievements',
                language: 'en',
                fallbackUsed: true
              }));
            case 8:
              _context31.n = 9;
              return this.tryGetSchemaOnly(gameId, language);
            case 9:
              schemaResult = _context31.v;
              return _context31.a(2, _objectSpread(_objectSpread({}, schemaResult), {}, {
                strategy: 'SchemaOnly',
                language: language
              }));
            case 10:
              _context31.p = 10;
              _t25 = _context31.v;
              console.error('Erro geral no getUserGameAchievements:', _t25);
              if (this.debugManager) {
                this.debugManager.error('Erro geral ao buscar conquistas do usuário:', _t25);
              }
              return _context31.a(2, {
                success: false,
                error: 'Erro interno ao buscar conquistas',
                errorType: 'INTERNAL_ERROR',
                details: _t25.message
              });
          }
        }, _callee31, this, [[1, 10]]);
      }));
      function getUserGameAchievements(_x26) {
        return _getUserGameAchievements.apply(this, arguments);
      }
      return getUserGameAchievements;
    }())
  }, {
    key: "tryGetPlayerAchievements",
    value: function () {
      var _tryGetPlayerAchievements = _asyncToGenerator(_regenerator().m(function _callee32(gameId) {
        var language,
          _data$playerstats,
          _data$playerstats2,
          _data$playerstats3,
          params,
          response,
          data,
          gameSchema,
          combinedAchievements,
          earnedCount,
          _error$response4,
          _args32 = arguments,
          _t26;
        return _regenerator().w(function (_context32) {
          while (1) switch (_context32.p = _context32.n) {
            case 0:
              language = _args32.length > 1 && _args32[1] !== undefined ? _args32[1] : null;
              _context32.p = 1;
              params = {
                key: this.apiKey,
                steamid: this.steamId,
                appid: gameId
              };
              if (language) {
                params.l = language;
              }
              _context32.n = 2;
              return this.http.get('/ISteamUserStats/GetPlayerAchievements/v1/', {
                params: params,
                timeout: 15000
              });
            case 2:
              response = _context32.v;
              data = response.data;
              if (!(data !== null && data !== void 0 && (_data$playerstats = data.playerstats) !== null && _data$playerstats !== void 0 && _data$playerstats.success && data !== null && data !== void 0 && (_data$playerstats2 = data.playerstats) !== null && _data$playerstats2 !== void 0 && _data$playerstats2.achievements)) {
                _context32.n = 4;
                break;
              }
              _context32.n = 3;
              return this.getGameAchievements(gameId, language);
            case 3:
              gameSchema = _context32.v;
              if (!gameSchema.success) {
                _context32.n = 4;
                break;
              }
              combinedAchievements = this.combineUserAndSchemaData(data.playerstats.achievements, gameSchema.achievements);
              earnedCount = combinedAchievements.filter(function (a) {
                return a.earned;
              }).length;
              return _context32.a(2, {
                success: true,
                achievements: combinedAchievements,
                totalAchievements: combinedAchievements.length,
                earnedAchievements: earnedCount,
                completionPercentage: Math.round(earnedCount / combinedAchievements.length * 100),
                source: 'GetPlayerAchievements',
                hasUserProgress: true,
                language: language
              });
            case 4:
              return _context32.a(2, {
                success: false,
                error: (data === null || data === void 0 || (_data$playerstats3 = data.playerstats) === null || _data$playerstats3 === void 0 ? void 0 : _data$playerstats3.error) || 'Dados inválidos na resposta',
                errorType: 'API_ERROR',
                language: language
              });
            case 5:
              _context32.p = 5;
              _t26 = _context32.v;
              console.error('Erro em GetPlayerAchievements:', _t26.message);
              return _context32.a(2, {
                success: false,
                error: _t26.message,
                errorType: 'HTTP_ERROR',
                statusCode: (_error$response4 = _t26.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.status
              });
          }
        }, _callee32, this, [[1, 5]]);
      }));
      function tryGetPlayerAchievements(_x27) {
        return _tryGetPlayerAchievements.apply(this, arguments);
      }
      return tryGetPlayerAchievements;
    }()
  }, {
    key: "tryGetSchemaOnly",
    value: function () {
      var _tryGetSchemaOnly = _asyncToGenerator(_regenerator().m(function _callee33(gameId) {
        var language,
          _gameSchema$achieveme,
          gameSchema,
          achievementsFromSchema,
          _args33 = arguments,
          _t27;
        return _regenerator().w(function (_context33) {
          while (1) switch (_context33.p = _context33.n) {
            case 0:
              language = _args33.length > 1 && _args33[1] !== undefined ? _args33[1] : null;
              _context33.p = 1;
              _context33.n = 2;
              return this.getGameAchievements(gameId, language);
            case 2:
              gameSchema = _context33.v;
              if (!(gameSchema.success && ((_gameSchema$achieveme = gameSchema.achievements) === null || _gameSchema$achieveme === void 0 ? void 0 : _gameSchema$achieveme.length) > 0)) {
                _context33.n = 3;
                break;
              }
              achievementsFromSchema = gameSchema.achievements.map(function (achievement) {
                return _objectSpread(_objectSpread({}, achievement), {}, {
                  earned: false,
                  earnedTime: 0,
                  globalPercent: null,
                  hasUserProgress: false
                });
              });
              return _context33.a(2, {
                success: true,
                achievements: achievementsFromSchema,
                totalAchievements: achievementsFromSchema.length,
                earnedAchievements: 0,
                completionPercentage: 0,
                source: 'Schema Fallback',
                hasUserProgress: false,
                message: 'Mostrando apenas lista de conquistas disponíveis.',
                language: language
              });
            case 3:
              return _context33.a(2, {
                success: false,
                error: 'Nenhuma conquista encontrada para este jogo',
                errorType: 'NO_ACHIEVEMENTS',
                language: language
              });
            case 4:
              _context33.p = 4;
              _t27 = _context33.v;
              return _context33.a(2, {
                success: false,
                error: 'Falha ao obter schema do jogo',
                errorType: 'SCHEMA_FALLBACK_ERROR'
              });
          }
        }, _callee33, this, [[1, 4]]);
      }));
      function tryGetSchemaOnly(_x28) {
        return _tryGetSchemaOnly.apply(this, arguments);
      }
      return tryGetSchemaOnly;
    }()
  }, {
    key: "combineUserAndSchemaData",
    value: function combineUserAndSchemaData(userAchievements, schemaAchievements) {
      return schemaAchievements.map(function (schemaAchievement) {
        var userAchievement = userAchievements.find(function (ua) {
          return (ua.apiname || ua.name) === (schemaAchievement.id || schemaAchievement.name);
        });
        return {
          id: schemaAchievement.name || schemaAchievement.id,
          name: schemaAchievement.displayName || schemaAchievement.name,
          description: schemaAchievement.description || 'Sem descrição',
          icon: schemaAchievement.icon,
          icongray: schemaAchievement.icongray,
          hidden: schemaAchievement.hidden || 0,
          earned: userAchievement ? Number(userAchievement.achieved) === 1 : false,
          earnedTime: (userAchievement === null || userAchievement === void 0 ? void 0 : userAchievement.unlocktime) || 0,
          globalPercent: null,
          hasUserProgress: true
        };
      });
    }
  }, {
    key: "convertToGSE",
    value: (function () {
      var _convertToGSE = _asyncToGenerator(_regenerator().m(function _callee34(gameId) {
        var userAchievements, gseAchievements, gseSavesPath, achievementsFilePath, _t28;
        return _regenerator().w(function (_context34) {
          while (1) switch (_context34.p = _context34.n) {
            case 0:
              _context34.p = 0;
              if (this.pathManager) {
                _context34.n = 1;
                break;
              }
              return _context34.a(2, {
                success: false,
                error: 'PathManager não disponível'
              });
            case 1:
              _context34.n = 2;
              return this.getUserGameAchievements(gameId);
            case 2:
              userAchievements = _context34.v;
              if (userAchievements.success) {
                _context34.n = 3;
                break;
              }
              return _context34.a(2, userAchievements);
            case 3:
              gseAchievements = {};
              userAchievements.achievements.forEach(function (achievement, index) {
                var achievementKey = "ACHIEV_".concat(index + 1);
                gseAchievements[achievementKey] = {
                  earned: achievement.earned,
                  earned_time: achievement.earnedTime || 0
                };
              });
              gseSavesPath = path.join(this.pathManager.getDataPath(), 'GSE Saves', gameId);
              achievementsFilePath = path.join(gseSavesPath, 'achievements.json');
              _context34.n = 4;
              return fs.mkdir(gseSavesPath, {
                recursive: true
              });
            case 4:
              _context34.n = 5;
              return fs.writeFile(achievementsFilePath, JSON.stringify(gseAchievements, null, 2), 'utf8');
            case 5:
              return _context34.a(2, {
                success: true,
                message: 'Conquistas convertidas com sucesso!',
                filePath: achievementsFilePath,
                totalAchievements: userAchievements.totalAchievements,
                earnedAchievements: userAchievements.earnedAchievements,
                completionPercentage: userAchievements.completionPercentage
              });
            case 6:
              _context34.p = 6;
              _t28 = _context34.v;
              return _context34.a(2, {
                success: false,
                error: "Erro na convers\xE3o: ".concat(_t28.message)
              });
          }
        }, _callee34, this, [[0, 6]]);
      }));
      function convertToGSE(_x29) {
        return _convertToGSE.apply(this, arguments);
      }
      return convertToGSE;
    }())
  }, {
    key: "discoverSteamId",
    value: (function () {
      var _discoverSteamId = _asyncToGenerator(_regenerator().m(function _callee35(apiKey) {
        var localResult, _t29;
        return _regenerator().w(function (_context35) {
          while (1) switch (_context35.p = _context35.n) {
            case 0:
              _context35.p = 0;
              if (apiKey) {
                _context35.n = 1;
                break;
              }
              throw new Error('API Key é obrigatória');
            case 1:
              _context35.n = 2;
              return this.discoverSteamIdFromLocalFiles();
            case 2:
              localResult = _context35.v;
              if (!localResult.success) {
                _context35.n = 3;
                break;
              }
              return _context35.a(2, localResult);
            case 3:
              throw new Error('Não foi possível descobrir o Steam ID automaticamente. Tente configurar manualmente.');
            case 4:
              _context35.p = 4;
              _t29 = _context35.v;
              console.error('Erro na descoberta do Steam ID:', _t29.message);
              return _context35.a(2, {
                success: false,
                error: _t29.message
              });
            case 5:
              return _context35.a(2);
          }
        }, _callee35, this, [[0, 4]]);
      }));
      function discoverSteamId(_x30) {
        return _discoverSteamId.apply(this, arguments);
      }
      return discoverSteamId;
    }())
  }, {
    key: "discoverSteamIdFromLocalFiles",
    value: (function () {
      var _discoverSteamIdFromLocalFiles = _asyncToGenerator(_regenerator().m(function _callee36() {
        var os, _path, steamPaths, _i, _steamPaths, steamPath, loginUsersPath, configPath, loginData, steamIdMatch, steamId, configData, _steamIdMatch, _steamId, _t30, _t31, _t32, _t33;
        return _regenerator().w(function (_context36) {
          while (1) switch (_context36.p = _context36.n) {
            case 0:
              _context36.p = 0;
              os = require('os');
              _path = require('path');
              steamPaths = [_path.join('C:', 'Program Files (x86)', 'Steam'), _path.join('C:', 'Program Files', 'Steam'), _path.join(os.homedir(), 'AppData', 'Local', 'Steam'), _path.join('D:', 'Steam'), _path.join('E:', 'Steam')];
              _i = 0, _steamPaths = steamPaths;
            case 1:
              if (!(_i < _steamPaths.length)) {
                _context36.n = 14;
                break;
              }
              steamPath = _steamPaths[_i];
              _context36.p = 2;
              loginUsersPath = _path.join(steamPath, 'config', 'loginusers.vdf');
              configPath = _path.join(steamPath, 'config', 'config.vdf');
              _context36.p = 3;
              _context36.n = 4;
              return fs.readFile(loginUsersPath, 'utf8');
            case 4:
              loginData = _context36.v;
              steamIdMatch = loginData.match(/"76561\d{12}"/g);
              if (!(steamIdMatch && steamIdMatch.length > 0)) {
                _context36.n = 5;
                break;
              }
              steamId = steamIdMatch[0].replace(/"/g, '');
              return _context36.a(2, {
                success: true,
                steamId: steamId,
                method: 'local_files',
                source: 'loginusers.vdf',
                message: "Steam ID encontrado nos arquivos locais: ".concat(steamId)
              });
            case 5:
              _context36.n = 7;
              break;
            case 6:
              _context36.p = 6;
              _t30 = _context36.v;
            case 7:
              _context36.p = 7;
              _context36.n = 8;
              return fs.readFile(configPath, 'utf8');
            case 8:
              configData = _context36.v;
              _steamIdMatch = configData.match(/"76561\d{12}"/g);
              if (!(_steamIdMatch && _steamIdMatch.length > 0)) {
                _context36.n = 9;
                break;
              }
              _steamId = _steamIdMatch[0].replace(/"/g, '');
              return _context36.a(2, {
                success: true,
                steamId: _steamId,
                method: 'local_files',
                source: 'config.vdf',
                message: "Steam ID encontrado nos arquivos locais: ".concat(_steamId)
              });
            case 9:
              _context36.n = 11;
              break;
            case 10:
              _context36.p = 10;
              _t31 = _context36.v;
            case 11:
              _context36.n = 13;
              break;
            case 12:
              _context36.p = 12;
              _t32 = _context36.v;
              return _context36.a(3, 13);
            case 13:
              _i++;
              _context36.n = 1;
              break;
            case 14:
              return _context36.a(2, {
                success: false,
                error: 'Steam ID não encontrado nos arquivos locais'
              });
            case 15:
              _context36.p = 15;
              _t33 = _context36.v;
              return _context36.a(2, {
                success: false,
                error: "Erro ao ler arquivos locais: ".concat(_t33.message)
              });
          }
        }, _callee36, null, [[7, 10], [3, 6], [2, 12], [0, 15]]);
      }));
      function discoverSteamIdFromLocalFiles() {
        return _discoverSteamIdFromLocalFiles.apply(this, arguments);
      }
      return discoverSteamIdFromLocalFiles;
    }())
  }, {
    key: "getSteamDefaultPaths",
    value: function getSteamDefaultPaths() {
      var os = require('os');
      var path = require('path');
      return [{
        path: path.join('C:', 'Program Files (x86)', 'Steam'),
        description: 'Instalação padrão (Program Files x86)'
      }, {
        path: path.join('C:', 'Program Files', 'Steam'),
        description: 'Instalação padrão (Program Files)'
      }, {
        path: path.join(os.homedir(), 'AppData', 'Local', 'Steam'),
        description: 'Instalação local do usuário'
      }, {
        path: path.join('D:', 'Steam'),
        description: 'Drive D:'
      }, {
        path: path.join('E:', 'Steam'),
        description: 'Drive E:'
      }];
    }
  }, {
    key: "detectCurrentSteamDirectory",
    value: (function () {
      var _detectCurrentSteamDirectory = _asyncToGenerator(_regenerator().m(function _callee37() {
        var defaultPaths, _iterator4, _step4, steamPath, configPath, loginUsersPath, _t34, _t35, _t36;
        return _regenerator().w(function (_context37) {
          while (1) switch (_context37.p = _context37.n) {
            case 0:
              _context37.p = 0;
              defaultPaths = this.getSteamDefaultPaths();
              _iterator4 = _createForOfIteratorHelper(defaultPaths);
              _context37.p = 1;
              _iterator4.s();
            case 2:
              if ((_step4 = _iterator4.n()).done) {
                _context37.n = 8;
                break;
              }
              steamPath = _step4.value;
              _context37.p = 3;
              configPath = path.join(steamPath.path, 'config');
              loginUsersPath = path.join(configPath, 'loginusers.vdf');
              _context37.n = 4;
              return fs.access(configPath);
            case 4:
              _context37.n = 5;
              return fs.access(loginUsersPath);
            case 5:
              return _context37.a(2, {
                success: true,
                path: steamPath.path,
                description: steamPath.description,
                message: "Diret\xF3rio Steam detectado: ".concat(steamPath.path)
              });
            case 6:
              _context37.p = 6;
              _t34 = _context37.v;
              return _context37.a(3, 7);
            case 7:
              _context37.n = 2;
              break;
            case 8:
              _context37.n = 10;
              break;
            case 9:
              _context37.p = 9;
              _t35 = _context37.v;
              _iterator4.e(_t35);
            case 10:
              _context37.p = 10;
              _iterator4.f();
              return _context37.f(10);
            case 11:
              return _context37.a(2, {
                success: false,
                error: 'Diretório Steam não encontrado nos locais padrão'
              });
            case 12:
              _context37.p = 12;
              _t36 = _context37.v;
              return _context37.a(2, {
                success: false,
                error: "Erro ao detectar diret\xF3rio Steam: ".concat(_t36.message)
              });
          }
        }, _callee37, this, [[3, 6], [1, 9, 10, 11], [0, 12]]);
      }));
      function detectCurrentSteamDirectory() {
        return _detectCurrentSteamDirectory.apply(this, arguments);
      }
      return detectCurrentSteamDirectory;
    }())
  }, {
    key: "getGameDetails",
    value: (function () {
      var _getGameDetails = _asyncToGenerator(_regenerator().m(function _callee38(gameId) {
        var _yield$axios$get, data, raw, gameDetails, _t37;
        return _regenerator().w(function (_context38) {
          while (1) switch (_context38.p = _context38.n) {
            case 0:
              _context38.p = 0;
              _context38.n = 1;
              return axios.get('https://store.steampowered.com/api/appdetails', {
                params: {
                  appids: gameId,
                  l: 'en'
                },
                timeout: 15000
              });
            case 1:
              _yield$axios$get = _context38.v;
              data = _yield$axios$get.data;
              raw = data === null || data === void 0 ? void 0 : data[gameId];
              gameDetails = raw && raw.success ? raw.data : null;
              if (!gameDetails) {
                _context38.n = 2;
                break;
              }
              return _context38.a(2, {
                success: true,
                details: {
                  id: gameDetails.steam_appid,
                  name: gameDetails.name,
                  description: gameDetails.short_description,
                  headerImage: gameDetails.header_image,
                  website: gameDetails.website,
                  developers: gameDetails.developers || [],
                  publishers: gameDetails.publishers || [],
                  releaseDate: gameDetails.release_date ? gameDetails.release_date.date : null,
                  genres: gameDetails.genres ? gameDetails.genres.map(function (g) {
                    return g.description;
                  }) : [],
                  screenshots: gameDetails.screenshots ? gameDetails.screenshots.map(function (s) {
                    return s.path_thumbnail;
                  }) : []
                }
              });
            case 2:
              return _context38.a(2, {
                success: false,
                error: 'Detalhes do jogo não encontrados'
              });
            case 3:
              _context38.n = 5;
              break;
            case 4:
              _context38.p = 4;
              _t37 = _context38.v;
              console.error('❌ Erro ao obter detalhes do jogo:', _t37);
              return _context38.a(2, {
                success: false,
                error: "Erro ao buscar detalhes: ".concat(_t37.message)
              });
            case 5:
              return _context38.a(2);
          }
        }, _callee38, null, [[0, 4]]);
      }));
      function getGameDetails(_x31) {
        return _getGameDetails.apply(this, arguments);
      }
      return getGameDetails;
    }())
  }]);
}();
module.exports = {
  SteamIntegrationManager: SteamIntegrationManager
};