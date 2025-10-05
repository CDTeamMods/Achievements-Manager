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
var AchievementsManager = function () {
  function AchievementsManager(configManager, crashReporter, debugManager) {
    _classCallCheck(this, AchievementsManager);
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
    this.cacheTimeout = 10 * 60 * 1000;
    this.initializeHandlers();
    this.initialize();
  }
  return _createClass(AchievementsManager, [{
    key: "initializeHandlers",
    value: function initializeHandlers() {
      var _this = this;
      ipcMain.handle('achievements:getStats', _asyncToGenerator(_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return _this.getStats();
            case 1:
              return _context.a(2, _context.v);
            case 2:
              _context.p = 2;
              _t = _context.v;
              _this.debugManager.error('❌ Erro em achievements:getStats:', _t.message);
              if (_this.crashReporter && _this.crashReporter.reportCrash) {
                _this.crashReporter.reportCrash('achievements:getStats', _t, {
                  timestamp: new Date().toISOString()
                });
              }
              return _context.a(2, {
                totalGames: 0,
                totalAchievements: 0,
                unlockedAchievements: 0,
                completionRate: 0,
                recentUnlocks: []
              });
          }
        }, _callee, null, [[0, 2]]);
      })));
      ipcMain.handle('achievements:getByGame', function () {
        var _ref2 = _asyncToGenerator(_regenerator().m(function _callee2(event, gameId) {
          return _regenerator().w(function (_context2) {
            while (1) switch (_context2.n) {
              case 0:
                _context2.n = 1;
                return _this.getAchievementsByGame(gameId);
              case 1:
                return _context2.a(2, _context2.v);
            }
          }, _callee2);
        }));
        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }());
      ipcMain.handle('achievements:unlock', function () {
        var _ref3 = _asyncToGenerator(_regenerator().m(function _callee3(event, gameId, achievementId) {
          return _regenerator().w(function (_context3) {
            while (1) switch (_context3.n) {
              case 0:
                _context3.n = 1;
                return _this.unlockAchievement(gameId, achievementId);
              case 1:
                return _context3.a(2, _context3.v);
            }
          }, _callee3);
        }));
        return function (_x3, _x4, _x5) {
          return _ref3.apply(this, arguments);
        };
      }());
      ipcMain.handle('achievements:configureSteamAPI', function () {
        var _ref4 = _asyncToGenerator(_regenerator().m(function _callee4(event, apiKey) {
          return _regenerator().w(function (_context4) {
            while (1) switch (_context4.n) {
              case 0:
                _context4.n = 1;
                return _this.configureSteamAPI(apiKey);
              case 1:
                return _context4.a(2, _context4.v);
            }
          }, _callee4);
        }));
        return function (_x6, _x7) {
          return _ref4.apply(this, arguments);
        };
      }());
      ipcMain.handle('achievements:getSteamAchievements', function () {
        var _ref5 = _asyncToGenerator(_regenerator().m(function _callee5(event, steamId, appId) {
          return _regenerator().w(function (_context5) {
            while (1) switch (_context5.n) {
              case 0:
                _context5.n = 1;
                return _this.getSteamAchievements(steamId, appId);
              case 1:
                return _context5.a(2, _context5.v);
            }
          }, _callee5);
        }));
        return function (_x8, _x9, _x0) {
          return _ref5.apply(this, arguments);
        };
      }());
      ipcMain.handle('achievements:clearCache', _asyncToGenerator(_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _this.clearCache();
              return _context6.a(2, {
                success: true,
                message: 'Cache limpo com sucesso'
              });
          }
        }, _callee6);
      })));
      ipcMain.handle('achievements:getProgress', function () {
        var _ref7 = _asyncToGenerator(_regenerator().m(function _callee7(event, gameId) {
          var _t2;
          return _regenerator().w(function (_context7) {
            while (1) switch (_context7.p = _context7.n) {
              case 0:
                _context7.p = 0;
                _context7.n = 1;
                return _this.getProgress(gameId);
              case 1:
                return _context7.a(2, _context7.v);
              case 2:
                _context7.p = 2;
                _t2 = _context7.v;
                if (_this.crashReporter && _this.crashReporter.captureException) {
                  _this.crashReporter.captureException(_t2, {
                    context: 'achievements:getProgress',
                    extra: {
                      gameId: gameId,
                      timestamp: new Date().toISOString()
                    }
                  });
                }
                throw _t2;
              case 3:
                return _context7.a(2);
            }
          }, _callee7, null, [[0, 2]]);
        }));
        return function (_x1, _x10) {
          return _ref7.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator(_regenerator().m(function _callee8() {
        var steamApiKey, _t3;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              _context8.n = 1;
              return this.configManager.get('steamApiKey');
            case 1:
              steamApiKey = _context8.v;
              if (steamApiKey) this.apiKey = steamApiKey;
              this.isInitialized = true;
              this.debugManager.log('✅ AchievementsManager inicializado com sucesso');
              _context8.n = 3;
              break;
            case 2:
              _context8.p = 2;
              _t3 = _context8.v;
              this.debugManager.error('❌ Erro ao inicializar AchievementsManager:', _t3);
              this.crashReporter.captureException(_t3, {
                context: 'initializeAchievements',
                extra: {
                  timestamp: new Date().toISOString()
                }
              });
            case 3:
              return _context8.a(2);
          }
        }, _callee8, this, [[0, 2]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
  }, {
    key: "getStats",
    value: function () {
      var _getStats = _asyncToGenerator(_regenerator().m(function _callee9() {
        var mockStats, _t4;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              mockStats = {
                totalGames: 15,
                totalAchievements: 342,
                unlockedAchievements: 187,
                completionRate: 54.7,
                recentUnlocks: [{
                  id: 'ach_001',
                  name: 'Primeira Vitória',
                  game: 'Counter-Strike 2',
                  unlockedAt: new Date(Date.now() - 86400000).toISOString(),
                  icon: '🏆'
                }, {
                  id: 'ach_002',
                  name: 'Explorador',
                  game: 'Grand Theft Auto V',
                  unlockedAt: new Date(Date.now() - 172800000).toISOString(),
                  icon: '🗺️'
                }, {
                  id: 'ach_003',
                  name: 'Colecionador',
                  game: 'Dota 2',
                  unlockedAt: new Date(Date.now() - 259200000).toISOString(),
                  icon: '💎'
                }],
                gameProgress: [{
                  gameId: '730',
                  gameName: 'Counter-Strike 2',
                  totalAchievements: 25,
                  unlockedAchievements: 18,
                  completionRate: 72
                }, {
                  gameId: '271590',
                  gameName: 'Grand Theft Auto V',
                  totalAchievements: 78,
                  unlockedAchievements: 45,
                  completionRate: 57.7
                }, {
                  gameId: '570',
                  gameName: 'Dota 2',
                  totalAchievements: 32,
                  unlockedAchievements: 28,
                  completionRate: 87.5
                }]
              };
              return _context9.a(2, mockStats);
            case 1:
              _context9.p = 1;
              _t4 = _context9.v;
              throw new Error("Erro ao buscar estat\xEDsticas: ".concat(_t4.message));
            case 2:
              return _context9.a(2);
          }
        }, _callee9, null, [[0, 1]]);
      }));
      function getStats() {
        return _getStats.apply(this, arguments);
      }
      return getStats;
    }()
  }, {
    key: "getAchievementsByGame",
    value: function () {
      var _getAchievementsByGame = _asyncToGenerator(_regenerator().m(function _callee0(gameId) {
        var mockAchievements, _t5;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              _context0.p = 0;
              mockAchievements = {
                730: [{
                  id: 'cs2_first_kill',
                  name: 'Primeira Eliminação',
                  description: 'Elimine um inimigo pela primeira vez',
                  icon: '🎯',
                  unlocked: true,
                  unlockedAt: '2024-01-15T10:30:00Z',
                  rarity: 'common'
                }, {
                  id: 'cs2_headshot',
                  name: 'Tiro na Cabeça',
                  description: 'Faça 100 headshots',
                  icon: '🎯',
                  unlocked: true,
                  unlockedAt: '2024-01-20T14:45:00Z',
                  rarity: 'uncommon'
                }, {
                  id: 'cs2_ace',
                  name: 'Ace',
                  description: 'Elimine todos os 5 inimigos em uma rodada',
                  icon: '👑',
                  unlocked: false,
                  unlockedAt: null,
                  rarity: 'rare'
                }],
                271590: [{
                  id: 'gta_first_mission',
                  name: 'Bem-vindo a Los Santos',
                  description: 'Complete a primeira missão',
                  icon: '🌴',
                  unlocked: true,
                  unlockedAt: '2024-01-10T09:15:00Z',
                  rarity: 'common'
                }, {
                  id: 'gta_stunt_jump',
                  name: 'Saltador',
                  description: 'Complete 25 saltos únicos',
                  icon: '🚗',
                  unlocked: false,
                  unlockedAt: null,
                  rarity: 'uncommon'
                }]
              };
              return _context0.a(2, mockAchievements[gameId] || []);
            case 1:
              _context0.p = 1;
              _t5 = _context0.v;
              throw new Error("Erro ao buscar conquistas do jogo: ".concat(_t5.message));
            case 2:
              return _context0.a(2);
          }
        }, _callee0, null, [[0, 1]]);
      }));
      function getAchievementsByGame(_x11) {
        return _getAchievementsByGame.apply(this, arguments);
      }
      return getAchievementsByGame;
    }()
  }, {
    key: "unlockAchievement",
    value: function () {
      var _unlockAchievement = _asyncToGenerator(_regenerator().m(function _callee1(gameId, achievementId) {
        var timestamp, _t6;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              _context1.p = 0;
              timestamp = new Date().toISOString();
              this.debugManager.log("\uD83C\uDFC6 Conquista desbloqueada: ".concat(achievementId, " no jogo ").concat(gameId));
              return _context1.a(2, {
                success: true,
                message: 'Conquista desbloqueada com sucesso!',
                unlockedAt: timestamp
              });
            case 1:
              _context1.p = 1;
              _t6 = _context1.v;
              throw new Error("Erro ao desbloquear conquista: ".concat(_t6.message));
            case 2:
              return _context1.a(2);
          }
        }, _callee1, this, [[0, 1]]);
      }));
      function unlockAchievement(_x12, _x13) {
        return _unlockAchievement.apply(this, arguments);
      }
      return unlockAchievement;
    }()
  }, {
    key: "getProgress",
    value: function () {
      var _getProgress = _asyncToGenerator(_regenerator().m(function _callee10(gameId) {
        var mockProgress, _t7;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.p = _context10.n) {
            case 0:
              _context10.p = 0;
              mockProgress = {
                730: {
                  gameId: '730',
                  gameName: 'Counter-Strike 2',
                  totalAchievements: 25,
                  unlockedAchievements: 18,
                  completionRate: 72,
                  lastUpdated: new Date().toISOString()
                },
                271590: {
                  gameId: '271590',
                  gameName: 'Grand Theft Auto V',
                  totalAchievements: 78,
                  unlockedAchievements: 45,
                  completionRate: 57.7,
                  lastUpdated: new Date().toISOString()
                }
              };
              return _context10.a(2, mockProgress[gameId] || {
                gameId: gameId,
                gameName: 'Jogo Desconhecido',
                totalAchievements: 0,
                unlockedAchievements: 0,
                completionRate: 0,
                lastUpdated: new Date().toISOString()
              });
            case 1:
              _context10.p = 1;
              _t7 = _context10.v;
              throw new Error("Erro ao buscar progresso: ".concat(_t7.message));
            case 2:
              return _context10.a(2);
          }
        }, _callee10, null, [[0, 1]]);
      }));
      function getProgress(_x14) {
        return _getProgress.apply(this, arguments);
      }
      return getProgress;
    }()
  }, {
    key: "configureSteamAPI",
    value: function () {
      var _configureSteamAPI = _asyncToGenerator(_regenerator().m(function _callee11(apiKey) {
        var testId, _t8;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.p = _context11.n) {
            case 0:
              _context11.p = 0;
              if (!(!apiKey || typeof apiKey !== 'string')) {
                _context11.n = 1;
                break;
              }
              throw new Error('API Key da Steam é obrigatória');
            case 1:
              testId = '76561198146931523';
              _context11.n = 2;
              return this.http.get('/ISteamUser/GetPlayerSummaries/v2/', {
                params: {
                  key: apiKey,
                  steamids: testId
                }
              });
            case 2:
              _context11.n = 3;
              return this.configManager.set('steamApiKey', apiKey);
            case 3:
              _context11.n = 4;
              return this.configManager.set('apiSource', 'steam');
            case 4:
              this.apiKey = apiKey;
              return _context11.a(2, {
                success: true,
                message: 'SteamAPI configurada com sucesso!'
              });
            case 5:
              _context11.p = 5;
              _t8 = _context11.v;
              this.apiKey = null;
              throw new Error("Erro ao configurar SteamAPI: ".concat(_t8.message));
            case 6:
              return _context11.a(2);
          }
        }, _callee11, this, [[0, 5]]);
      }));
      function configureSteamAPI(_x15) {
        return _configureSteamAPI.apply(this, arguments);
      }
      return configureSteamAPI;
    }()
  }, {
    key: "testSteamConnection",
    value: function () {
      var _testSteamConnection = _asyncToGenerator(_regenerator().m(function _callee12() {
        var testId, _t9;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.p = _context12.n) {
            case 0:
              if (this.apiKey) {
                _context12.n = 1;
                break;
              }
              throw new Error('Steam API não configurada');
            case 1:
              _context12.p = 1;
              testId = '76561198146931523';
              _context12.n = 2;
              return this.http.get('/ISteamUser/GetPlayerSummaries/v2/', {
                params: {
                  key: this.apiKey,
                  steamids: testId
                }
              });
            case 2:
              return _context12.a(2, {
                success: true,
                message: 'Conexão com Steam estabelecida'
              });
            case 3:
              _context12.p = 3;
              _t9 = _context12.v;
              throw new Error('API Key inválida ou erro de conexão com Steam');
            case 4:
              return _context12.a(2);
          }
        }, _callee12, this, [[1, 3]]);
      }));
      function testSteamConnection() {
        return _testSteamConnection.apply(this, arguments);
      }
      return testSteamConnection;
    }()
  }, {
    key: "getSteamAchievements",
    value: function () {
      var _getSteamAchievements = _asyncToGenerator(_regenerator().m(function _callee13(steamId, appId) {
        var _schemaResp$data, _userResp$data, cacheKey, cached, schemaResp, gameAchievements, userResp, userAchievements, achievements, result, _t0;
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.p = _context13.n) {
            case 0:
              if (this.apiKey) {
                _context13.n = 1;
                break;
              }
              throw new Error('Steam API não configurada');
            case 1:
              _context13.p = 1;
              cacheKey = "steam_achievements_".concat(steamId, "_").concat(appId);
              cached = this.getFromCache(cacheKey);
              if (!cached) {
                _context13.n = 2;
                break;
              }
              return _context13.a(2, cached);
            case 2:
              _context13.n = 3;
              return this.http.get('/ISteamUserStats/GetSchemaForGame/v2/', {
                params: {
                  key: this.apiKey,
                  appid: appId
                }
              });
            case 3:
              schemaResp = _context13.v;
              gameAchievements = (schemaResp === null || schemaResp === void 0 || (_schemaResp$data = schemaResp.data) === null || _schemaResp$data === void 0 || (_schemaResp$data = _schemaResp$data.game) === null || _schemaResp$data === void 0 || (_schemaResp$data = _schemaResp$data.availableGameStats) === null || _schemaResp$data === void 0 ? void 0 : _schemaResp$data.achievements) || [];
              _context13.n = 4;
              return this.http.get('/ISteamUserStats/GetPlayerAchievements/v1/', {
                params: {
                  key: this.apiKey,
                  steamid: steamId,
                  appid: appId
                }
              });
            case 4:
              userResp = _context13.v;
              userAchievements = (userResp === null || userResp === void 0 || (_userResp$data = userResp.data) === null || _userResp$data === void 0 || (_userResp$data = _userResp$data.playerstats) === null || _userResp$data === void 0 ? void 0 : _userResp$data.achievements) || [];
              achievements = gameAchievements.map(function (achievement) {
                var userAchievement = userAchievements.find(function (ua) {
                  return (ua.apiname || ua.name) === achievement.name;
                });
                return {
                  id: achievement.name,
                  name: achievement.displayName,
                  description: achievement.description,
                  icon: achievement.icon,
                  iconGray: achievement.icongray,
                  hidden: achievement.hidden === 1 || achievement.hidden === true,
                  unlocked: userAchievement ? Number(userAchievement.achieved) === 1 : false,
                  unlockTime: userAchievement && (userAchievement.unlocktime || userAchievement.unlockTime) ? new Date((userAchievement.unlocktime || userAchievement.unlockTime) * 1000).toISOString() : null,
                  globalPercent: achievement.percent || 0
                };
              });
              result = {
                appId: appId,
                steamId: steamId,
                achievements: achievements,
                totalAchievements: achievements.length,
                unlockedAchievements: achievements.filter(function (a) {
                  return a.unlocked;
                }).length,
                completionRate: achievements.length > 0 ? (achievements.filter(function (a) {
                  return a.unlocked;
                }).length / achievements.length * 100).toFixed(1) : 0,
                lastUpdated: new Date().toISOString()
              };
              this.setCache(cacheKey, result);
              return _context13.a(2, result);
            case 5:
              _context13.p = 5;
              _t0 = _context13.v;
              throw new Error("Erro ao buscar conquistas do Steam: ".concat(_t0.message));
            case 6:
              return _context13.a(2);
          }
        }, _callee13, this, [[1, 5]]);
      }));
      function getSteamAchievements(_x16, _x17) {
        return _getSteamAchievements.apply(this, arguments);
      }
      return getSteamAchievements;
    }()
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
    }
  }, {
    key: "cleanup",
    value: function cleanup() {
      this.clearCache();
      this.apiKey = null;
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return {
        isInitialized: this.isInitialized,
        steamAPIConfigured: !!this.apiKey,
        cacheSize: this.cache.size
      };
    }
  }]);
}();
function setupAchievements(configManager, crashReporter, debugManager) {
  var achievementsManager = new AchievementsManager(configManager, crashReporter, debugManager);
  return achievementsManager;
}
module.exports = {
  AchievementsManager: AchievementsManager,
  setupAchievements: setupAchievements
};