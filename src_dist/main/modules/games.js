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
  ipcMain = _require.ipcMain;
var axios = require('axios');
var GamesManager = function () {
  function GamesManager(configManager, crashReporter, debugManager) {
    _classCallCheck(this, GamesManager);
    this.configManager = configManager;
    this.crashReporter = crashReporter;
    this.debugManager = debugManager;
    this.apiKey = null;
    this.http = axios.create({
      baseURL: 'https://api.steampowered.com',
      timeout: 15000
    });
    this.isInitialized = false;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000;
    this.initializeHandlers();
    this.initializeSteamAPI();
  }
  return _createClass(GamesManager, [{
    key: "initializeHandlers",
    value: function initializeHandlers() {
      var _this = this;
      ipcMain.handle('games:getAll', _asyncToGenerator(_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return _this.getAllGames();
            case 1:
              return _context.a(2, _context.v);
            case 2:
              _context.p = 2;
              _t = _context.v;
              _this.debugManager.error('❌ Erro em games:getAll:', _t.message);
              if (_this.crashReporter && _this.crashReporter.reportCrash) {
                _this.crashReporter.reportCrash('games:getAll', _t, {
                  timestamp: new Date().toISOString()
                });
              }
              return _context.a(2, []);
          }
        }, _callee, null, [[0, 2]]);
      })));
      ipcMain.handle('games:getDetails', function () {
        var _ref2 = _asyncToGenerator(_regenerator().m(function _callee2(event, gameId) {
          var _t2;
          return _regenerator().w(function (_context2) {
            while (1) switch (_context2.p = _context2.n) {
              case 0:
                _context2.p = 0;
                _context2.n = 1;
                return _this.getGameDetails(gameId);
              case 1:
                return _context2.a(2, _context2.v);
              case 2:
                _context2.p = 2;
                _t2 = _context2.v;
                if (_this.crashReporter && _this.crashReporter.reportCrash) {
                  _this.crashReporter.reportCrash('games:getDetails', _t2, {
                    gameId: gameId,
                    timestamp: new Date().toISOString()
                  });
                }
                throw _t2;
              case 3:
                return _context2.a(2);
            }
          }, _callee2, null, [[0, 2]]);
        }));
        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }());
      ipcMain.handle('games:search', function () {
        var _ref3 = _asyncToGenerator(_regenerator().m(function _callee3(event, query) {
          return _regenerator().w(function (_context3) {
            while (1) switch (_context3.n) {
              case 0:
                _context3.n = 1;
                return _this.searchGames(query);
              case 1:
                return _context3.a(2, _context3.v);
            }
          }, _callee3);
        }));
        return function (_x3, _x4) {
          return _ref3.apply(this, arguments);
        };
      }());
      ipcMain.handle('games:setApiKey', function () {
        var _ref4 = _asyncToGenerator(_regenerator().m(function _callee4(event, apiKey) {
          return _regenerator().w(function (_context4) {
            while (1) switch (_context4.n) {
              case 0:
                _context4.n = 1;
                return _this.setSteamApiKey(apiKey);
              case 1:
                return _context4.a(2, _context4.v);
            }
          }, _callee4);
        }));
        return function (_x5, _x6) {
          return _ref4.apply(this, arguments);
        };
      }());
      ipcMain.handle('games:getStatus', _asyncToGenerator(_regenerator().m(function _callee5() {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              return _context5.a(2, _this.getStatus());
          }
        }, _callee5);
      })));
      ipcMain.handle('games:getUserGames', function () {
        var _ref6 = _asyncToGenerator(_regenerator().m(function _callee6(event, steamId) {
          return _regenerator().w(function (_context6) {
            while (1) switch (_context6.n) {
              case 0:
                _context6.n = 1;
                return _this.getUserGames(steamId);
              case 1:
                return _context6.a(2, _context6.v);
            }
          }, _callee6);
        }));
        return function (_x7, _x8) {
          return _ref6.apply(this, arguments);
        };
      }());
      ipcMain.handle('games:configureSteamAPI', function () {
        var _ref7 = _asyncToGenerator(_regenerator().m(function _callee7(event, apiKey) {
          return _regenerator().w(function (_context7) {
            while (1) switch (_context7.n) {
              case 0:
                _context7.n = 1;
                return _this.configureSteamAPI(apiKey);
              case 1:
                return _context7.a(2, _context7.v);
            }
          }, _callee7);
        }));
        return function (_x9, _x0) {
          return _ref7.apply(this, arguments);
        };
      }());
      ipcMain.handle('games:clearCache', _asyncToGenerator(_regenerator().m(function _callee8() {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              _this.clearCache();
              return _context8.a(2, {
                success: true
              });
          }
        }, _callee8);
      })));
    }
  }, {
    key: "initializeSteamAPI",
    value: function () {
      var _initializeSteamAPI = _asyncToGenerator(_regenerator().m(function _callee9() {
        var config, steamApiKey;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              config = this.configManager.get();
              steamApiKey = config.steamApiKey;
              if (steamApiKey) {
                this.apiKey = steamApiKey;
                this.isInitialized = true;
              }
            case 1:
              return _context9.a(2);
          }
        }, _callee9, this);
      }));
      function initializeSteamAPI() {
        return _initializeSteamAPI.apply(this, arguments);
      }
      return initializeSteamAPI;
    }()
  }, {
    key: "setSteamApiKey",
    value: function () {
      var _setSteamApiKey = _asyncToGenerator(_regenerator().m(function _callee0(apiKey) {
        var testId, _t3;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              _context0.p = 0;
              if (!(!apiKey || typeof apiKey !== 'string')) {
                _context0.n = 1;
                break;
              }
              throw new Error('API key inválida');
            case 1:
              testId = '76561198146931523';
              _context0.n = 2;
              return this.http.get('/ISteamUser/GetPlayerSummaries/v2/', {
                params: {
                  key: apiKey,
                  steamids: testId
                }
              });
            case 2:
              this.configManager.set('steamApiKey', apiKey);
              this.configManager.set('apiProvider', 'steam');
              this.apiKey = apiKey;
              this.isInitialized = true;
              return _context0.a(2, {
                success: true,
                message: 'API key configurada com sucesso!'
              });
            case 3:
              _context0.p = 3;
              _t3 = _context0.v;
              return _context0.a(2, {
                success: false,
                message: 'API key inválida ou erro de conexão'
              });
          }
        }, _callee0, this, [[0, 3]]);
      }));
      function setSteamApiKey(_x1) {
        return _setSteamApiKey.apply(this, arguments);
      }
      return setSteamApiKey;
    }()
  }, {
    key: "getAllGames",
    value: function () {
      var _getAllGames = _asyncToGenerator(_regenerator().m(function _callee1() {
        var _t4;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              if (!(!this.isInitialized || !this.apiKey)) {
                _context1.n = 1;
                break;
              }
              return _context1.a(2, []);
            case 1:
              _context1.p = 1;
              return _context1.a(2, []);
            case 2:
              _context1.p = 2;
              _t4 = _context1.v;
              this.debugManager.error('❌ Erro ao buscar jogos:', _t4);
              return _context1.a(2, []);
          }
        }, _callee1, this, [[1, 2]]);
      }));
      function getAllGames() {
        return _getAllGames.apply(this, arguments);
      }
      return getAllGames;
    }()
  }, {
    key: "getGameDetails",
    value: function () {
      var _getGameDetails = _asyncToGenerator(_regenerator().m(function _callee10(gameId) {
        var _details$price_overvi, _details$release_date, _yield$axios$get, data, raw, details, _t5;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.p = _context10.n) {
            case 0:
              if (this.isInitialized) {
                _context10.n = 1;
                break;
              }
              throw new Error('Steam API não configurada');
            case 1:
              _context10.p = 1;
              _context10.n = 2;
              return axios.get('https://store.steampowered.com/api/appdetails', {
                params: {
                  appids: gameId,
                  l: 'en'
                },
                timeout: 15000
              });
            case 2:
              _yield$axios$get = _context10.v;
              data = _yield$axios$get.data;
              raw = data === null || data === void 0 ? void 0 : data[gameId];
              details = raw && raw.success ? raw.data : null;
              return _context10.a(2, {
                id: gameId,
                name: details === null || details === void 0 ? void 0 : details.name,
                description: (details === null || details === void 0 ? void 0 : details.detailed_description) || (details === null || details === void 0 ? void 0 : details.short_description),
                image: details === null || details === void 0 ? void 0 : details.header_image,
                screenshots: (details === null || details === void 0 ? void 0 : details.screenshots) || [],
                price: (details === null || details === void 0 || (_details$price_overvi = details.price_overview) === null || _details$price_overvi === void 0 ? void 0 : _details$price_overvi.final_formatted) || 'Gratuito',
                developers: (details === null || details === void 0 ? void 0 : details.developers) || [],
                publishers: (details === null || details === void 0 ? void 0 : details.publishers) || [],
                release_date: (details === null || details === void 0 || (_details$release_date = details.release_date) === null || _details$release_date === void 0 ? void 0 : _details$release_date.date) || '',
                genres: (details === null || details === void 0 ? void 0 : details.genres) || [],
                categories: (details === null || details === void 0 ? void 0 : details.categories) || [],
                achievements: (details === null || details === void 0 ? void 0 : details.achievements) || null
              });
            case 3:
              _context10.p = 3;
              _t5 = _context10.v;
              throw new Error("Erro ao buscar detalhes do jogo: ".concat(_t5.message));
            case 4:
              return _context10.a(2);
          }
        }, _callee10, this, [[1, 3]]);
      }));
      function getGameDetails(_x10) {
        return _getGameDetails.apply(this, arguments);
      }
      return getGameDetails;
    }()
  }, {
    key: "searchGames",
    value: function () {
      var _searchGames = _asyncToGenerator(_regenerator().m(function _callee11(query) {
        var mockResults, filteredResults, _t6;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.p = _context11.n) {
            case 0:
              if (!(!this.isInitialized || !this.steamAPI)) {
                _context11.n = 1;
                break;
              }
              throw new Error('SteamAPI não configurada');
            case 1:
              _context11.p = 1;
              mockResults = [{
                id: '730',
                name: 'Counter-Strike 2',
                match: query.toLowerCase().includes('counter') || query.toLowerCase().includes('cs')
              }, {
                id: '440',
                name: 'Team Fortress 2',
                match: query.toLowerCase().includes('team') || query.toLowerCase().includes('tf')
              }, {
                id: '570',
                name: 'Dota 2',
                match: query.toLowerCase().includes('dota')
              }, {
                id: '1172470',
                name: 'Apex Legends',
                match: query.toLowerCase().includes('apex')
              }, {
                id: '271590',
                name: 'Grand Theft Auto V',
                match: query.toLowerCase().includes('gta') || query.toLowerCase().includes('grand')
              }];
              filteredResults = mockResults.filter(function (game) {
                return game.match || game.name.toLowerCase().includes(query.toLowerCase());
              }).map(function (game) {
                return {
                  id: game.id,
                  name: game.name
                };
              });
              return _context11.a(2, filteredResults);
            case 2:
              _context11.p = 2;
              _t6 = _context11.v;
              throw new Error("Erro ao buscar jogos: ".concat(_t6.message));
            case 3:
              return _context11.a(2);
          }
        }, _callee11, this, [[1, 2]]);
      }));
      function searchGames(_x11) {
        return _searchGames.apply(this, arguments);
      }
      return searchGames;
    }()
  }, {
    key: "getStatus",
    value: function getStatus() {
      return {
        isInitialized: this.isInitialized,
        hasApiKey: !!this.apiKey,
        connectionStatus: this.apiKey ? 'connected' : 'disconnected'
      };
    }
  }, {
    key: "getUserGames",
    value: (function () {
      var _getUserGames = _asyncToGenerator(_regenerator().m(function _callee12(steamId) {
        var _this2 = this;
        var _data$response, cacheKey, cached, _yield$this$http$get, data, games, enrichedGames, _t7;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.p = _context12.n) {
            case 0:
              if (!(!this.isInitialized || !this.apiKey)) {
                _context12.n = 1;
                break;
              }
              throw new Error('Steam API não configurada');
            case 1:
              _context12.p = 1;
              cacheKey = "user_games_".concat(steamId);
              cached = this.getFromCache(cacheKey);
              if (!cached) {
                _context12.n = 2;
                break;
              }
              return _context12.a(2, cached);
            case 2:
              _context12.n = 3;
              return this.http.get('/IPlayerService/GetOwnedGames/v1/', {
                params: {
                  key: this.apiKey,
                  steamid: steamId,
                  include_appinfo: true,
                  include_played_free_games: true
                }
              });
            case 3:
              _yield$this$http$get = _context12.v;
              data = _yield$this$http$get.data;
              games = (data === null || data === void 0 || (_data$response = data.response) === null || _data$response === void 0 ? void 0 : _data$response.games) || [];
              enrichedGames = games.map(function (game) {
                return {
                  appID: game.appid,
                  name: game.name,
                  playTime: game.playtime_forever || 0,
                  lastPlayed: null,
                  playtimeFormatted: _this2.formatPlaytime(game.playtime_forever || 0),
                  headerImage: "https://steamcdn-a.akamaihd.net/steam/apps/".concat(game.appid, "/header.jpg")
                };
              });
              this.setCache(cacheKey, enrichedGames);
              return _context12.a(2, enrichedGames);
            case 4:
              _context12.p = 4;
              _t7 = _context12.v;
              throw new Error("Erro ao buscar jogos do usu\xE1rio: ".concat(_t7.message));
            case 5:
              return _context12.a(2);
          }
        }, _callee12, this, [[1, 4]]);
      }));
      function getUserGames(_x12) {
        return _getUserGames.apply(this, arguments);
      }
      return getUserGames;
    }())
  }, {
    key: "configureSteamAPI",
    value: (function () {
      var _configureSteamAPI = _asyncToGenerator(_regenerator().m(function _callee13(apiKey) {
        var testId, _t8;
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.p = _context13.n) {
            case 0:
              _context13.p = 0;
              if (!(!apiKey || typeof apiKey !== 'string')) {
                _context13.n = 1;
                break;
              }
              throw new Error('Chave da API inválida');
            case 1:
              testId = '76561198146931523';
              _context13.n = 2;
              return this.http.get('/ISteamUser/GetPlayerSummaries/v2/', {
                params: {
                  key: apiKey,
                  steamids: testId
                }
              });
            case 2:
              this.apiKey = apiKey;
              this.isInitialized = true;
              _context13.n = 3;
              return this.configManager.set('steamApiKey', apiKey);
            case 3:
              _context13.n = 4;
              return this.configManager.set('api.source', 'steam');
            case 4:
              this.debugManager.log('✅ Steam API configurada com sucesso');
              return _context13.a(2, {
                success: true,
                message: 'Steam API configurada com sucesso'
              });
            case 5:
              _context13.p = 5;
              _t8 = _context13.v;
              this.debugManager.error('❌ Erro ao configurar Steam API:', _t8);
              return _context13.a(2, {
                success: false,
                message: _t8.message
              });
          }
        }, _callee13, this, [[0, 5]]);
      }));
      function configureSteamAPI(_x13) {
        return _configureSteamAPI.apply(this, arguments);
      }
      return configureSteamAPI;
    }())
  }, {
    key: "formatPlaytime",
    value: function formatPlaytime(minutes) {
      if (!minutes || minutes === 0) return '0 minutos';
      var hours = Math.floor(minutes / 60);
      var remainingMinutes = minutes % 60;
      if (hours === 0) {
        return "".concat(remainingMinutes, " minuto").concat(remainingMinutes !== 1 ? 's' : '');
      }
      if (remainingMinutes === 0) {
        return "".concat(hours, " hora").concat(hours !== 1 ? 's' : '');
      }
      return "".concat(hours, "h ").concat(remainingMinutes, "m");
    }
  }, {
    key: "getFromCache",
    value: function getFromCache(key) {
      var cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      this.cache["delete"](key);
      return null;
    }
  }, {
    key: "setCache",
    value: function setCache(key, data) {
      this.cache.set(key, {
        data: data,
        timestamp: Date.now()
      });
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      this.cache.clear();
      this.debugManager.log('🧹 Cache do GamesManager limpo');
    }
  }, {
    key: "cleanup",
    value: (function () {
      var _cleanup = _asyncToGenerator(_regenerator().m(function _callee14() {
        return _regenerator().w(function (_context14) {
          while (1) switch (_context14.n) {
            case 0:
              try {
                this.clearCache();
                this.apiKey = null;
                this.isInitialized = false;
                this.debugManager.log('🧹 GamesManager limpo com sucesso');
              } catch (error) {
                this.debugManager.error('❌ Erro ao limpar GamesManager:', error);
                if (this.crashReporter) {
                  this.crashReporter.captureException(error, {
                    context: 'GamesManager.cleanup'
                  });
                }
              }
            case 1:
              return _context14.a(2);
          }
        }, _callee14, this);
      }));
      function cleanup() {
        return _cleanup.apply(this, arguments);
      }
      return cleanup;
    }())
  }]);
}();
function setupGames(_x14, _x15, _x16) {
  return _setupGames.apply(this, arguments);
}
function _setupGames() {
  _setupGames = _asyncToGenerator(_regenerator().m(function _callee15(configManager, crashReporter, debugManager) {
    var gamesManager;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          gamesManager = new GamesManager(configManager, crashReporter, debugManager);
          return _context15.a(2, gamesManager);
      }
    }, _callee15);
  }));
  return _setupGames.apply(this, arguments);
}
module.exports = {
  GamesManager: GamesManager,
  setupGames: setupGames
};