"use strict";

function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _require = require('electron'),
  contextBridge = _require.contextBridge,
  ipcRenderer = _require.ipcRenderer;
function debugLog(operation, channel) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var result = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var error = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  try {
    if (process.env.DEBUG_TOOLS !== 'true' && (typeof localStorage === 'undefined' || localStorage.getItem('DEBUG_TOOLS') !== 'true') && (typeof window === 'undefined' || window.DEBUG_TOOLS !== true)) {
      return;
    }
  } catch (e) {
    return;
  }
  var timestamp = new Date().toISOString();
  try {
    ipcRenderer.invoke('debug:log', "[DEBUG ".concat(timestamp, "] ").concat(operation, " - Channel: ").concat(channel));
    if (args !== null) {
      ipcRenderer.invoke('debug:log', "[DEBUG ARGS] Tipo: ".concat(_typeof(args), ", Valor:"), args);
    }
    if (result !== null) {
      ipcRenderer.invoke('debug:log', "[DEBUG RESULT] Tipo: ".concat(_typeof(result), ", Valor:"), result);
    }
    if (error) {
      ipcRenderer.invoke('debug:error', "[DEBUG ERROR] ".concat(error.message), error);
    }
  } catch (e) {
    console.log("[DEBUG ".concat(timestamp, "] ").concat(operation, " - Channel: ").concat(channel));
    if (args !== null) console.log("[DEBUG ARGS] Tipo: ".concat(_typeof(args), ", Valor:"), args);
    if (result !== null) console.log("[DEBUG RESULT] Tipo: ".concat(_typeof(result), ", Valor:"), result);
    if (error) console.error("[DEBUG ERROR] ".concat(error.message), error);
  }
}
function analyzeObject(obj) {
  var _obj$constructor;
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'root';
  var analysis = {
    path: path,
    type: _typeof(obj),
    constructor: (obj === null || obj === void 0 || (_obj$constructor = obj.constructor) === null || _obj$constructor === void 0 ? void 0 : _obj$constructor.name) || 'unknown',
    isCloneable: false,
    issues: []
  };
  try {
    structuredClone(obj);
    analysis.isCloneable = true;
  } catch (error) {
    analysis.issues.push("structuredClone failed: ".concat(error.message));
  }
  if (_typeof(obj) === 'object' && obj !== null) {
    for (var _i = 0, _Object$entries = Object.entries(obj); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];
      if (typeof value === 'function') {
        analysis.issues.push("Function property: ".concat(key));
      } else if (value instanceof Node) {
        analysis.issues.push("DOM Node property: ".concat(key));
      } else if (value instanceof Window) {
        analysis.issues.push("Window object property: ".concat(key));
      } else if (value && _typeof(value) === 'object' && value.constructor && ['HTMLElement', 'EventTarget', 'Navigator', 'Location'].includes(value.constructor.name)) {
        analysis.issues.push("Browser API object property: ".concat(key, " (").concat(value.constructor.name, ")"));
      }
    }
  }
  return analysis;
}
function sanitizeArgs(args) {
  if (!Array.isArray(args)) return args;
  return args.map(function (arg, index) {
    var argPath = "args[".concat(index, "]");
    if (arg === null || arg === undefined) {
      return arg;
    }
    if (_typeof(arg) !== 'object') {
      return arg;
    }
    if (Array.isArray(arg)) {
      try {
        return arg.map(function (item) {
          if (_typeof(item) === 'object' && item !== null) {
            try {
              return JSON.parse(JSON.stringify(item));
            } catch (_unused) {
              return {
                __sanitized: true,
                __type: _typeof(item)
              };
            }
          }
          return item;
        });
      } catch (_unused2) {
        return [];
      }
    }
    var analysis = analyzeObject(arg, argPath);
    if (analysis.isCloneable) {
      return arg;
    }
    try {
      var serialized = JSON.parse(JSON.stringify(arg, function (key, value) {
        if (typeof value === 'function') return undefined;
        if (value instanceof Node) return undefined;
        if (value instanceof Window) return undefined;
        if (value instanceof HTMLElement) return undefined;
        if (value instanceof EventTarget) return undefined;
        try {
          JSON.stringify(value);
          return value;
        } catch (_unused3) {
          return undefined;
        }
      }));
      try {
        structuredClone(serialized);
        return serialized;
      } catch (_unused4) {
        return {
          __sanitized: true,
          __type: analysis.type,
          __constructor: analysis.constructor,
          __keys: Object.keys(arg).slice(0, 10)
        };
      }
    } catch (jsonError) {
      return {
        __sanitized: true,
        __type: analysis.type,
        __constructor: analysis.constructor,
        __error: 'Object could not be serialized',
        __message: jsonError.message
      };
    }
  });
}
function isDebugToolsEnabled() {
  try {
    if (process.env.DEBUG_TOOLS === 'true') return true;
    if (process.env.DEBUG_TOOLS === 'false') return false;
    if (typeof localStorage !== 'undefined') {
      var localStorageDebug = localStorage.getItem('DEBUG_TOOLS');
      if (localStorageDebug === 'true') return true;
      if (localStorageDebug === 'false') return false;
    }
    if (typeof window !== 'undefined' && window.DEBUG_TOOLS === true) return true;
    return false;
  } catch (error) {
    return false;
  }
}
function simpleInvoke(channel) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return ipcRenderer.invoke.apply(ipcRenderer, [channel].concat(args))["catch"](function (error) {
    if (error.message && (error.message.includes('could not be cloned') || error.message.includes('IpcRendererInternal.send') || error.message.includes('An object could not be cloned'))) {
      return null;
    }
    throw error;
  });
}
function debugInvoke(channel) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  if (!isDebugToolsEnabled()) {
    return simpleInvoke.apply(void 0, [channel].concat(args));
  }
  return new Promise(function () {
    var _ref = _asyncToGenerator(_regenerator().m(function _callee(resolve, reject) {
      var sanitizedArgs, fallbackArgs, result, _result, _t, _t2, _t3, _t4;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            sanitizedArgs = sanitizeArgs(args);
            _context.p = 1;
            sanitizedArgs.forEach(function (arg, index) {
              structuredClone(arg);
            });
            _context.n = 6;
            break;
          case 2:
            _context.p = 2;
            _t = _context.v;
            try {
              ipcRenderer.invoke('debug:warn', "\u26A0\uFE0F Argumento ".concat(index, " falhou no teste de clonagem, aplicando sanitiza\xE7\xE3o agressiva"));
            } catch (e) {
              console.warn("\u26A0\uFE0F Argumento ".concat(index, " falhou no teste de clonagem, aplicando sanitiza\xE7\xE3o agressiva"));
            }
            fallbackArgs = args.map(function (arg) {
              if (arg === null || arg === undefined || _typeof(arg) !== 'object') {
                return arg;
              }
              try {
                return JSON.parse(JSON.stringify(arg));
              } catch (_unused5) {
                return {
                  __sanitized: true,
                  __type: _typeof(arg)
                };
              }
            });
            _context.p = 3;
            _context.n = 4;
            return ipcRenderer.invoke.apply(ipcRenderer, [channel].concat(_toConsumableArray(fallbackArgs)));
          case 4:
            result = _context.v;
            resolve(result);
            return _context.a(2);
          case 5:
            _context.p = 5;
            _t2 = _context.v;
            reject(new Error("IPC call failed even with fallback sanitization: ".concat(_t2.message)));
            return _context.a(2);
          case 6:
            _context.p = 6;
            _context.n = 7;
            return ipcRenderer.invoke.apply(ipcRenderer, [channel].concat(_toConsumableArray(sanitizedArgs)));
          case 7:
            _result = _context.v;
            resolve(_result);
            _context.n = 9;
            break;
          case 8:
            _context.p = 8;
            _t3 = _context.v;
            if (_t3.message && (_t3.message.includes('could not be cloned') || _t3.message.includes('IpcRendererInternal.send') || _t3.message.includes('An object could not be cloned'))) {
              try {
                ipcRenderer.invoke('debug:warn', "\u26A0\uFE0F Erro de clonagem IPC ignorado para canal ".concat(channel, ":"), _t3.message);
              } catch (e) {
                console.warn("\u26A0\uFE0F Erro de clonagem IPC ignorado para canal ".concat(channel, ":"), _t3.message);
              }
              resolve(null);
            } else {
              reject(_t3);
            }
          case 9:
            _context.n = 11;
            break;
          case 10:
            _context.p = 10;
            _t4 = _context.v;
            reject(_t4);
          case 11:
            return _context.a(2);
        }
      }, _callee, null, [[6, 8], [3, 5], [1, 2], [0, 10]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
}
var electronAPI = {
  config: {
    get: function get(key) {
      return debugInvoke('config:get', key);
    },
    set: function set(key, value) {
      return debugInvoke('config:set', key, value);
    },
    getAll: function getAll() {
      return debugInvoke('config:getAll');
    },
    reset: function reset() {
      return debugInvoke('config:reset');
    }
  },
  games: {
    getAll: function getAll() {
      return debugInvoke('games:getAll');
    },
    getById: function getById(id) {
      return debugInvoke('games:getById', id);
    },
    add: function add(game) {
      return debugInvoke('games:add', game);
    },
    update: function update(id, data) {
      return debugInvoke('games:update', id, data);
    },
    "delete": function _delete(id) {
      return debugInvoke('games:delete', id);
    },
    scan: function scan() {
      return debugInvoke('games:scan');
    },
    "import": function _import(filePath) {
      return debugInvoke('games:import', filePath);
    },
    "export": function _export(filePath, gameIds) {
      return debugInvoke('games:export', filePath, gameIds);
    }
  },
  achievements: {
    getAll: function getAll() {
      return debugInvoke('achievements:getAll');
    },
    getByGameId: function getByGameId(gameId) {
      return debugInvoke('achievements:getByGameId', gameId);
    },
    getById: function getById(id) {
      return debugInvoke('achievements:getById', id);
    },
    add: function add(achievement) {
      return debugInvoke('achievements:add', achievement);
    },
    update: function update(id, data) {
      return debugInvoke('achievements:update', id, data);
    },
    "delete": function _delete(id) {
      return debugInvoke('achievements:delete', id);
    },
    unlock: function unlock(id) {
      return debugInvoke('achievements:unlock', id);
    },
    lock: function lock(id) {
      return debugInvoke('achievements:lock', id);
    },
    getStats: function getStats() {
      return debugInvoke('achievements:getStats');
    },
    sync: function sync(gameId) {
      return debugInvoke('achievements:sync', gameId);
    }
  },
  api: {
    steam: {
      authenticate: function authenticate() {
        return debugInvoke('api:steam:authenticate');
      },
      getGames: function getGames() {
        return debugInvoke('api:steam:getGames');
      },
      getUserGames: function getUserGames() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return debugInvoke('steam.getUserGames', options);
      },
      getAchievements: function getAchievements(appId) {
        return debugInvoke('api:steam:getAchievements', appId);
      },
      getUserStats: function getUserStats(appId) {
        return debugInvoke('api:steam:getUserStats', appId);
      },
      setCredentials: function setCredentials(apiKey) {
        var steamId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        return debugInvoke('steam.setCredentials', apiKey, steamId);
      },
      clearCache: function clearCache() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        return debugInvoke('steam.clearCache', type);
      },
      getCacheStats: function getCacheStats() {
        return debugInvoke('steam.getCacheStats');
      }
    },
    gseSaves: {
      detectPaths: function detectPaths() {
        return debugInvoke('gse:detectPaths');
      },
      getCurrentUser: function getCurrentUser() {
        return debugInvoke('gse:getCurrentUser');
      },
      getStatus: function getStatus() {
        return debugInvoke('gse:getStatus');
      },
      getGames: function getGames() {
        return debugInvoke('gse:getGames');
      },
      getAchievements: function getAchievements(gameId) {
        return debugInvoke('gse:getAchievements', gameId);
      },
      syncAchievements: function syncAchievements(gameId) {
        return debugInvoke('api:gseSaves:syncAchievements', gameId);
      }
    },
    request: function request(options) {
      return debugInvoke('api:request', options);
    },
    clearCache: function clearCache() {
      return debugInvoke('api:clearCache');
    },
    getCacheStats: function getCacheStats() {
      return debugInvoke('api:getCacheStats');
    }
  },
  fs: {
    selectFile: function selectFile(options) {
      return debugInvoke('fs:selectFile', options);
    },
    selectDirectory: function selectDirectory(options) {
      return debugInvoke('fs:selectDirectory', options);
    },
    saveFile: function saveFile(options) {
      return debugInvoke('fs:saveFile', options);
    },
    readFile: function readFile(filePath) {
      return debugInvoke('fs:readFile', filePath);
    },
    writeFile: function writeFile(filePath, data) {
      return debugInvoke('fs:writeFile', filePath, data);
    },
    exists: function exists(path) {
      return debugInvoke('fs:exists', path);
    },
    createBackup: function createBackup(name) {
      return debugInvoke('fs:createBackup', name);
    },
    restoreBackup: function restoreBackup(backupId) {
      return debugInvoke('fs:restoreBackup', backupId);
    },
    listBackups: function listBackups() {
      return debugInvoke('fs:listBackups');
    },
    deleteBackup: function deleteBackup(backupId) {
      return debugInvoke('fs:deleteBackup', backupId);
    },
    saveSettings: function saveSettings(settings) {
      return debugInvoke('fs:saveSettings', settings);
    },
    loadSettings: function loadSettings() {
      return debugInvoke('fs:loadSettings');
    }
  },
  saveSettings: function saveSettings(settings) {
    return debugInvoke('fs:saveSettings', settings);
  },
  theme: {
    getSystemTheme: function getSystemTheme() {
      return debugInvoke('theme:getSystemTheme');
    },
    setTheme: function setTheme(theme) {
      return debugInvoke('set-theme', theme);
    },
    getTheme: function getTheme() {
      return debugInvoke('get-theme');
    }
  },
  i18n: {
    getLanguage: function getLanguage() {
      return debugInvoke('i18n:getLanguage');
    },
    getCurrentLanguage: function getCurrentLanguage() {
      return debugInvoke('i18n:getCurrentLanguage');
    },
    setLanguage: function setLanguage(lang) {
      return debugInvoke('i18n:setLanguage', lang);
    },
    getTranslations: function getTranslations(lang) {
      return debugInvoke('i18n:getTranslations', lang);
    },
    getAvailableLanguages: function getAvailableLanguages() {
      return debugInvoke('i18n:getAvailableLanguages');
    },
    translate: function translate(key, params) {
      return debugInvoke('i18n:translate', key, params);
    }
  },
  goldberg: {
    checkFolder: function checkFolder() {
      return debugInvoke('goldberg:checkFolder');
    },
    getGames: function getGames() {
      return debugInvoke('goldberg:getGames');
    },
    migrateGame: function migrateGame(gameData) {
      return debugInvoke('goldberg:migrateGame', gameData);
    },
    getSettings: function getSettings() {
      return debugInvoke('goldberg:getSettings');
    },
    setSetting: function setSetting(key, value) {
      return debugInvoke('goldberg:setSetting', key, value);
    },
    getLastCheck: function getLastCheck() {
      return debugInvoke('goldberg:getLastCheck');
    },
    checkMigration: function checkMigration() {
      return debugInvoke('goldberg:checkMigration');
    }
  },
  getGoldbergSettings: function getGoldbergSettings() {
    return debugInvoke('goldberg:getSettings');
  },
  setGoldbergSetting: function setGoldbergSetting(key, value) {
    return debugInvoke('goldberg:setSetting', key, value);
  },
  getGoldbergLastCheck: function getGoldbergLastCheck() {
    return debugInvoke('goldberg:getLastCheck');
  },
  checkGoldbergMigration: function checkGoldbergMigration() {
    return debugInvoke('goldberg:checkMigration');
  },
  performance: {
    getMetrics: function getMetrics() {
      return debugInvoke('performance:getMetrics');
    },
    clearCache: function clearCache() {
      return debugInvoke('performance:clearCache');
    },
    optimizeMemory: function optimizeMemory() {
      return debugInvoke('performance:optimizeMemory');
    },
    getSystemResources: function getSystemResources() {
      return debugInvoke('performance:getSystemResources');
    }
  },
  crashReporter: {
    reportError: function reportError(errorData) {
      return debugInvoke('crash-reporter:report-error', errorData);
    },
    getStats: function getStats() {
      return debugInvoke('crash-reporter:get-stats');
    },
    clearReports: function clearReports() {
      return debugInvoke('crash-reporter:clear-reports');
    },
    getCrashList: function getCrashList() {
      return debugInvoke('crash-reporter:get-crash-list');
    }
  },
  steam: {
    authenticate: function authenticate() {
      return debugInvoke('api:steam:authenticate');
    },
    getGames: function getGames() {
      return debugInvoke('api:steam:getGames');
    },
    getUserGames: function getUserGames() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return debugInvoke('steam.getUserGames', options);
    },
    getAchievements: function getAchievements(appId) {
      return debugInvoke('api:steam:getAchievements', appId);
    },
    getUserStats: function getUserStats(appId) {
      return debugInvoke('api:steam:getUserStats', appId);
    },
    getUserGameAchievements: function getUserGameAchievements(gameId) {
      return debugInvoke('steam.getUserGameAchievements', gameId);
    },
    setCredentials: function setCredentials(apiKey) {
      var steamId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return debugInvoke('steam.setCredentials', apiKey, steamId);
    },
    getCredentials: function getCredentials() {
      return debugInvoke('steam.getCredentials');
    },
    checkConnection: function checkConnection() {
      return debugInvoke('steam.checkConnection');
    },
    clearCache: function clearCache() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return debugInvoke('steam.clearCache', type);
    },
    getCacheStats: function getCacheStats() {
      return debugInvoke('steam.getCacheStats');
    }
  },
  system: {
    getVersion: function getVersion() {
      return debugInvoke('system:getVersion');
    },
    getPlatform: function getPlatform() {
      return debugInvoke('system:getPlatform');
    },
    getSystemInfo: function getSystemInfo() {
      return debugInvoke('system:getSystemInfo');
    },
    openExternal: function openExternal(url) {
      return debugInvoke('system:openExternal', url);
    },
    showInFolder: function showInFolder(path) {
      return debugInvoke('system:showInFolder', path);
    },
    quit: function quit() {
      return debugInvoke('system:quit');
    },
    minimize: function minimize() {
      return debugInvoke('system:minimize');
    },
    maximize: function maximize() {
      return debugInvoke('system:maximize');
    },
    unmaximize: function unmaximize() {
      return debugInvoke('system:unmaximize');
    },
    isMaximized: function isMaximized() {
      return debugInvoke('system:isMaximized');
    },
    close: function close() {
      return debugInvoke('system:close');
    },
    restart: function restart() {
      return debugInvoke('app:restart');
    }
  },
  isDevelopmentMode: function isDevelopmentMode() {
    return debugInvoke('system:isDevelopmentMode');
  },
  isInstalledVersion: function isInstalledVersion() {
    return debugInvoke('system:isInstalledVersion');
  },
  setAutoStart: function setAutoStart(enabled) {
    return debugInvoke('system:setAutoStart', enabled);
  },
  getAutoStart: function getAutoStart() {
    return debugInvoke('system:getAutoStart');
  },
  setMinimizeToTray: function setMinimizeToTray(enabled) {
    return debugInvoke('system:setMinimizeToTray', enabled);
  },
  getMinimizeToTray: function getMinimizeToTray() {
    return debugInvoke('system:getMinimizeToTray');
  },
  minimizeWindow: function minimizeWindow() {
    return debugInvoke('window:minimize');
  },
  maximizeWindow: function maximizeWindow() {
    return debugInvoke('window:maximize');
  },
  closeWindow: function closeWindow() {
    return debugInvoke('window:close');
  },
  isMaximized: function isMaximized() {
    return debugInvoke('window:isMaximized');
  },
  on: function on(channel, callback) {
    var validChannels = ['game-added', 'game-updated', 'game-deleted', 'achievement-unlocked', 'achievement-locked', 'sync-progress', 'sync-complete', 'backup-created', 'backup-restored', 'language-changed', 'theme-changed', 'theme:systemChanged', 'window-focus', 'window-blur', 'goldberg-migration-dialog', 'goldberg-migration-completed'];
    if (validChannels.includes(channel)) {
      var safeCallback = function safeCallback(event) {
        try {
          for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            args[_key3 - 1] = arguments[_key3];
          }
          var safeArgs = args.map(function (arg) {
            if (arg === null || arg === undefined || typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
              return arg;
            }
            if (_typeof(arg) === 'object') {
              try {
                var jsonTest = JSON.parse(JSON.stringify(arg));
                structuredClone(jsonTest);
                return jsonTest;
              } catch (e) {
                console.warn("[PRELOAD] Objeto n\xE3o serializ\xE1vel filtrado no canal '".concat(channel, "':"), e.message);
                if (Array.isArray(arg)) {
                  return [];
                }
                return {};
              }
            }
            return null;
          });
          callback.apply(void 0, [event].concat(_toConsumableArray(safeArgs)));
        } catch (error) {
          try {
            ipcRenderer.invoke('debug:error', "[PRELOAD] Erro no callback do canal '".concat(channel, "':"), error);
          } catch (e) {
            console.error("[PRELOAD] Erro no callback do canal '".concat(channel, "':"), error);
          }
          try {
            callback(event);
          } catch (fallbackError) {
            try {
              ipcRenderer.invoke('debug:error', "[PRELOAD] Erro no fallback do callback '".concat(channel, "':"), fallbackError);
            } catch (e) {
              console.error("[PRELOAD] Erro no fallback do callback '".concat(channel, "':"), fallbackError);
            }
          }
        }
      };
      ipcRenderer.on(channel, safeCallback);
    }
  },
  off: function off(channel, callback) {
    ipcRenderer.removeListener(channel, callback);
  },
  once: function once(channel, callback) {
    var validChannels = ['game-added', 'game-updated', 'game-deleted', 'achievement-unlocked', 'achievement-locked', 'sync-progress', 'sync-complete', 'backup-created', 'backup-restored', 'language-changed', 'theme-changed'];
    if (validChannels.includes(channel)) {
      var safeCallback = function safeCallback(event) {
        try {
          for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            args[_key4 - 1] = arguments[_key4];
          }
          var safeArgs = args.map(function (arg) {
            if (arg === null || arg === undefined || typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
              return arg;
            }
            if (_typeof(arg) === 'object') {
              try {
                var jsonTest = JSON.parse(JSON.stringify(arg));
                structuredClone(jsonTest);
                return jsonTest;
              } catch (e) {
                console.warn("[PRELOAD] Objeto n\xE3o serializ\xE1vel filtrado no canal '".concat(channel, "':"), e.message);
                if (Array.isArray(arg)) {
                  return [];
                }
                return {};
              }
            }
            return null;
          });
          callback.apply(void 0, [event].concat(_toConsumableArray(safeArgs)));
        } catch (error) {
          try {
            ipcRenderer.invoke('debug:error', "[PRELOAD] Erro no callback do canal '".concat(channel, "':"), error);
          } catch (e) {
            console.error("[PRELOAD] Erro no callback do canal '".concat(channel, "':"), error);
          }
          try {
            callback(event);
          } catch (fallbackError) {
            try {
              ipcRenderer.invoke('debug:error', "[PRELOAD] Erro no fallback do callback '".concat(channel, "':"), fallbackError);
            } catch (e) {
              console.error("[PRELOAD] Erro no fallback do callback '".concat(channel, "':"), fallbackError);
            }
          }
        }
      };
      ipcRenderer.once(channel, safeCallback);
    }
  }
};
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
var packageJson;
try {
  packageJson = require('../../package.json');
} catch (error) {
  packageJson = {
    version: '0.0.1-beta'
  };
}
contextBridge.exposeInMainWorld('env', {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PLATFORM: process.platform,
  ARCH: process.arch,
  APP_VERSION: packageJson.version
});
contextBridge.exposeInMainWorld('utils', {
  isElectron: true,
  versions: process.versions
});
if (process.env.NODE_ENV === 'development') {}
if (process.env.NODE_ENV === 'development') {
  var _electronAPI$goldberg;
  console.log('🔧 Preload script finalizado com sucesso');
  console.log('🔧 Testando setGoldbergSetting:', _typeof(electronAPI.setGoldbergSetting));
  console.log('🔧 Testando goldberg.setSetting:', _typeof((_electronAPI$goldberg = electronAPI.goldberg) === null || _electronAPI$goldberg === void 0 ? void 0 : _electronAPI$goldberg.setSetting));
}
window.preloadTest = 'Preload funcionando!';
window.testAPI = {
  test: function test() {
    return 'API funcionando!';
  }
};
process.on('unhandledRejection', function (reason, promise) {
  if (reason && reason.message && (reason.message.includes('could not be cloned') || reason.message.includes('IpcRendererInternal.send') || reason.message.includes('An object could not be cloned'))) {
    console.warn('⚠️ Promise rejeitada por erro de clonagem IPC (ignorado):', reason.message);
    return;
  }
  console.error('❌ Promise rejeitada não tratada:', reason);
});
process.on('uncaughtException', function (error) {
  if (error && error.message && (error.message.includes('could not be cloned') || error.message.includes('IpcRendererInternal.send') || error.message.includes('An object could not be cloned'))) {
    console.warn('⚠️ Exceção não capturada por erro de clonagem IPC (ignorado):', error.message);
    return;
  }
  console.error('❌ Exceção não capturada:', error);
});