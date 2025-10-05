"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
  ipcMain = _require.ipcMain;
var path = require('path');
var fs = require('fs').promises;
var _require2 = require('./debug-manager'),
  getDebugManager = _require2.getDebugManager;
var _require3 = require('./path-manager'),
  getPathManager = _require3.getPathManager;
var ConfigManager = function () {
  function ConfigManager() {
    _classCallCheck(this, ConfigManager);
    this.configPath = null;
    this.config = {};
    this.debugManager = getDebugManager();
    this.defaultConfig = {
      setupComplete: false,
      language: 'pt-BR',
      theme: 'dark',
      liteMode: false,
      virtualScrolling: true,
      autoStartWindows: false,
      minimizeToTray: false,
      isInstalledVersion: false,
      apiSource: 'steam',
      steamApiKey: '',
      performance: {
        enableVirtualScrolling: true,
        showTooltips: true,
        autoSync: true,
        cacheSize: 100
      },
      windowBounds: {
        width: 1200,
        height: 800,
        x: undefined,
        y: undefined
      },
      showTooltips: true,
      autoSync: true,
      cacheSize: 100,
      crashReports: true
    };
  }
  return _createClass(ConfigManager, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(_regenerator().m(function _callee(userDataPath) {
        var pathManager, settingsPath;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              pathManager = getPathManager();
              if (pathManager.isInstalledVersion()) {
                this.configPath = path.join(userDataPath, 'config.json');
              } else {
                settingsPath = path.join(pathManager.getDataPath(), 'settings');
                this.configPath = path.join(settingsPath, 'app.json');
              }
              _context.n = 1;
              return this.loadConfig();
            case 1:
              this.setupIpcHandlers();
            case 2:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function init(_x) {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }, {
    key: "initializeDefaultConfigs",
    value: (function () {
      var _initializeDefaultConfigs = _asyncToGenerator(_regenerator().m(function _callee2() {
        var pathManager, dataPath, settingsPath, migrationConfigPath, defaultMigrationConfig, _t;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              pathManager = getPathManager();
              dataPath = pathManager.getDataPath();
              settingsPath = path.join(dataPath, 'settings');
              _context2.n = 1;
              return this.ensureConfigFile(this.configPath, this.defaultConfig);
            case 1:
              migrationConfigPath = path.join(settingsPath, 'migration-settings.json');
              defaultMigrationConfig = {
                version: '0.0.1-beta',
                lastMigration: null,
                autoMigration: true,
                backupBeforeMigration: true,
                migrationHistory: []
              };
              _context2.n = 2;
              return this.ensureConfigFile(migrationConfigPath, defaultMigrationConfig);
            case 2:
              this.debugManager.log('✅ Configurações padrão inicializadas com sucesso');
              return _context2.a(2, true);
            case 3:
              _context2.p = 3;
              _t = _context2.v;
              this.debugManager.error('❌ Erro ao inicializar configurações padrão:', _t);
              throw _t;
            case 4:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 3]]);
      }));
      function initializeDefaultConfigs() {
        return _initializeDefaultConfigs.apply(this, arguments);
      }
      return initializeDefaultConfigs;
    }())
  }, {
    key: "ensureConfigFile",
    value: (function () {
      var _ensureConfigFile = _asyncToGenerator(_regenerator().m(function _callee3(filePath, defaultConfig) {
        var configDir, _t2, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              configDir = path.dirname(filePath);
              _context3.n = 1;
              return fs.mkdir(configDir, {
                recursive: true
              });
            case 1:
              _context3.p = 1;
              _context3.n = 2;
              return fs.access(filePath);
            case 2:
              this.debugManager.log("\uD83D\uDCC4 Arquivo de configura\xE7\xE3o j\xE1 existe: ".concat(path.basename(filePath)));
              return _context3.a(2);
            case 3:
              _context3.p = 3;
              _t2 = _context3.v;
              _context3.n = 4;
              return fs.writeFile(filePath, JSON.stringify(defaultConfig, null, 2), 'utf8');
            case 4:
              this.debugManager.log("\uD83D\uDCC4 Arquivo de configura\xE7\xE3o criado: ".concat(path.basename(filePath)));
              _context3.n = 6;
              break;
            case 5:
              _context3.p = 5;
              _t3 = _context3.v;
              this.debugManager.error("\u274C Erro ao criar arquivo de configura\xE7\xE3o ".concat(filePath, ":"), _t3);
              throw _t3;
            case 6:
              return _context3.a(2);
          }
        }, _callee3, this, [[1, 3], [0, 5]]);
      }));
      function ensureConfigFile(_x2, _x3) {
        return _ensureConfigFile.apply(this, arguments);
      }
      return ensureConfigFile;
    }())
  }, {
    key: "loadConfig",
    value: function () {
      var _loadConfig = _asyncToGenerator(_regenerator().m(function _callee4() {
        var configData, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              _context4.n = 1;
              return fs.readFile(this.configPath, 'utf8');
            case 1:
              configData = _context4.v;
              this.config = _objectSpread(_objectSpread({}, this.defaultConfig), JSON.parse(configData));
              if (!(this.config.version !== this.defaultConfig.version)) {
                _context4.n = 2;
                break;
              }
              _context4.n = 2;
              return this.migrateConfig();
            case 2:
              _context4.n = 3;
              return this.protectCriticalSettings();
            case 3:
              _context4.n = 7;
              break;
            case 4:
              _context4.p = 4;
              _t4 = _context4.v;
              if (!(_t4.code === 'ENOENT')) {
                _context4.n = 6;
                break;
              }
              this.config = _objectSpread({}, this.defaultConfig);
              _context4.n = 5;
              return this.saveConfig();
            case 5:
              _context4.n = 7;
              break;
            case 6:
              this.config = _objectSpread({}, this.defaultConfig);
            case 7:
              return _context4.a(2);
          }
        }, _callee4, this, [[0, 4]]);
      }));
      function loadConfig() {
        return _loadConfig.apply(this, arguments);
      }
      return loadConfig;
    }()
  }, {
    key: "saveConfig",
    value: function () {
      var _saveConfig = _asyncToGenerator(_regenerator().m(function _callee5() {
        var _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              _context5.n = 1;
              return fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
            case 1:
              this.debugManager.log('✅ Configurações salvas com sucesso');
              _context5.n = 3;
              break;
            case 2:
              _context5.p = 2;
              _t5 = _context5.v;
              this.debugManager.error('❌ Erro ao salvar configurações:', _t5);
            case 3:
              return _context5.a(2);
          }
        }, _callee5, this, [[0, 2]]);
      }));
      function saveConfig() {
        return _saveConfig.apply(this, arguments);
      }
      return saveConfig;
    }()
  }, {
    key: "migrateConfig",
    value: (function () {
      var _migrateConfig = _asyncToGenerator(_regenerator().m(function _callee6() {
        var _t6;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              this.debugManager.log('🔄 Migrando configurações para nova versão...');
              this.config.version = this.defaultConfig.version;
              if (this.config.steamApiKey) {
                delete this.config.steamApiKey;
                this.debugManager.log('🗑️ Removida configuração obsoleta: steamApiKey');
              }
              if (this.config.steamUserId) {
                delete this.config.steamUserId;
                this.debugManager.log('🗑️ Removida configuração obsoleta: steamUserId');
              }
              _context6.n = 1;
              return this.saveConfig();
            case 1:
              this.debugManager.log('✅ Migração de configurações concluída');
              _context6.n = 3;
              break;
            case 2:
              _context6.p = 2;
              _t6 = _context6.v;
              this.debugManager.error('❌ Erro durante migração de configurações:', _t6);
            case 3:
              return _context6.a(2);
          }
        }, _callee6, this, [[0, 2]]);
      }));
      function migrateConfig() {
        return _migrateConfig.apply(this, arguments);
      }
      return migrateConfig;
    }())
  }, {
    key: "protectCriticalSettings",
    value: (function () {
      var _protectCriticalSettings = _asyncToGenerator(_regenerator().m(function _callee7() {
        var pathManager, needsSave, criticalSettings, _i, _Object$entries, _Object$entries$_i, key, safeValue, _t7;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              pathManager = getPathManager();
              if (!(!pathManager || pathManager.isInstalledVersion())) {
                _context7.n = 1;
                break;
              }
              return _context7.a(2);
            case 1:
              needsSave = false;
              criticalSettings = {
                isInstalledVersion: false,
                steamPath: this.defaultConfig.steamPath,
                userDataPath: this.defaultConfig.userDataPath
              };
              for (_i = 0, _Object$entries = Object.entries(criticalSettings); _i < _Object$entries.length; _i++) {
                _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], safeValue = _Object$entries$_i[1];
                if (this.config[key] !== safeValue) {
                  this.config[key] = safeValue;
                  needsSave = true;
                }
              }
              if (!needsSave) {
                _context7.n = 2;
                break;
              }
              _context7.n = 2;
              return this.saveConfig();
            case 2:
              _context7.n = 4;
              break;
            case 3:
              _context7.p = 3;
              _t7 = _context7.v;
            case 4:
              return _context7.a(2);
          }
        }, _callee7, this, [[0, 3]]);
      }));
      function protectCriticalSettings() {
        return _protectCriticalSettings.apply(this, arguments);
      }
      return protectCriticalSettings;
    }())
  }, {
    key: "get",
    value: function get(key) {
      return key ? this.config[key] : this.config;
    }
  }, {
    key: "set",
    value: function () {
      var _set = _asyncToGenerator(_regenerator().m(function _callee8(key, value) {
        var filteredConfig, validatedConfig;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              if (!(_typeof(key) === 'object')) {
                _context8.n = 1;
                break;
              }
              filteredConfig = this.filterCriticalSettings(key);
              validatedConfig = this.validateSettings(filteredConfig);
              this.config = _objectSpread(_objectSpread({}, this.config), validatedConfig);
              _context8.n = 4;
              break;
            case 1:
              if (!this.isCriticalSetting(key, value)) {
                _context8.n = 2;
                break;
              }
              return _context8.a(2, this.config);
            case 2:
              if (this.isValidSetting(key)) {
                _context8.n = 3;
                break;
              }
              this.debugManager.warn("\u26A0\uFE0F Configura\xE7\xE3o desconhecida ignorada: ".concat(key));
              return _context8.a(2, this.config);
            case 3:
              this.config[key] = value;
            case 4:
              _context8.n = 5;
              return this.saveConfig();
            case 5:
              return _context8.a(2, this.config);
          }
        }, _callee8, this);
      }));
      function set(_x4, _x5) {
        return _set.apply(this, arguments);
      }
      return set;
    }()
  }, {
    key: "isValidSetting",
    value: function isValidSetting(key) {
      return this.getAllowedSettingKeys().includes(key);
    }
  }, {
    key: "getAllowedSettingKeys",
    value: function getAllowedSettingKeys() {
      var _flattenKeys = function flattenKeys(obj) {
        var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var keys = [];
        for (var _i2 = 0, _Object$entries2 = Object.entries(obj); _i2 < _Object$entries2.length; _i2++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
            key = _Object$entries2$_i[0],
            value = _Object$entries2$_i[1];
          var fullKey = prefix ? "".concat(prefix, ".").concat(key) : key;
          keys.push(fullKey);
          if (_typeof(value) === 'object' && value !== null && !Array.isArray(value)) {
            keys.push.apply(keys, _toConsumableArray(_flattenKeys(value, fullKey)));
          }
        }
        return keys;
      };
      return _flattenKeys(this.defaultConfig);
    }
  }, {
    key: "validateSettings",
    value: function validateSettings(settings) {
      if (!settings || _typeof(settings) !== 'object') {
        return {};
      }
      var allowedKeys = this.getAllowedSettingKeys();
      var validated = {};
      for (var _i3 = 0, _Object$entries3 = Object.entries(settings); _i3 < _Object$entries3.length; _i3++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
          key = _Object$entries3$_i[0],
          value = _Object$entries3$_i[1];
        if (allowedKeys.includes(key)) {
          validated[key] = value;
        } else {
          this.debugManager.warn("\u26A0\uFE0F Configura\xE7\xE3o desconhecida ignorada: ".concat(key));
        }
      }
      return validated;
    }
  }, {
    key: "isCriticalSetting",
    value: function isCriticalSetting(key, value) {
      var pathManager = getPathManager();
      if (!pathManager || pathManager.isInstalledVersion()) {
        return false;
      }
      var criticalKeys = ['isInstalledVersion', 'steamPath', 'userDataPath'];
      if (criticalKeys.includes(key)) {
        if (key === 'isInstalledVersion' && value !== false) {
          return true;
        }
        if ((key === 'steamPath' || key === 'userDataPath') && value !== this.defaultConfig[key]) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: "filterCriticalSettings",
    value: function filterCriticalSettings(configObject) {
      var pathManager = getPathManager();
      if (!pathManager || pathManager.isInstalledVersion()) {
        return configObject;
      }
      var filtered = _objectSpread({}, configObject);
      var criticalKeys = ['isInstalledVersion', 'steamPath', 'userDataPath'];
      for (var _i4 = 0, _criticalKeys = criticalKeys; _i4 < _criticalKeys.length; _i4++) {
        var key = _criticalKeys[_i4];
        if (key in filtered) {
          if (this.isCriticalSetting(key, filtered[key])) {
            delete filtered[key];
          }
        }
      }
      return filtered;
    }
  }, {
    key: "reset",
    value: function () {
      var _reset = _asyncToGenerator(_regenerator().m(function _callee9() {
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              this.config = _objectSpread({}, this.defaultConfig);
              _context9.n = 1;
              return this.saveConfig();
            case 1:
              return _context9.a(2, this.config);
          }
        }, _callee9, this);
      }));
      function reset() {
        return _reset.apply(this, arguments);
      }
      return reset;
    }()
  }, {
    key: "setupIpcHandlers",
    value: function setupIpcHandlers() {
      var _this = this;
      ipcMain.handle('config:get', function (event, key) {
        return _this.get(key);
      });
      ipcMain.handle('config:getAll', function () {
        return _this.config;
      });
      ipcMain.handle('config:set', function () {
        var _ref = _asyncToGenerator(_regenerator().m(function _callee0(event, key, value) {
          return _regenerator().w(function (_context0) {
            while (1) switch (_context0.n) {
              case 0:
                _context0.n = 1;
                return _this.set(key, value);
              case 1:
                return _context0.a(2, _context0.v);
            }
          }, _callee0);
        }));
        return function (_x6, _x7, _x8) {
          return _ref.apply(this, arguments);
        };
      }());
      ipcMain.handle('config:reset', _asyncToGenerator(_regenerator().m(function _callee1() {
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              _context1.n = 1;
              return _this.reset();
            case 1:
              return _context1.a(2, _context1.v);
          }
        }, _callee1);
      })));
      ipcMain.handle('test-steam-connection', function () {
        var _ref4 = _asyncToGenerator(_regenerator().m(function _callee10(event, _ref3) {
          var apiKey, steamId, _require4, getSteamIntegrationManager, steamManager, result, _t8;
          return _regenerator().w(function (_context10) {
            while (1) switch (_context10.p = _context10.n) {
              case 0:
                apiKey = _ref3.apiKey, steamId = _ref3.steamId;
                _context10.p = 1;
                _require4 = require('./steam-integration'), getSteamIntegrationManager = _require4.getSteamIntegrationManager;
                steamManager = getSteamIntegrationManager();
                _context10.n = 2;
                return steamManager.testConnection(apiKey, steamId);
              case 2:
                result = _context10.v;
                return _context10.a(2, result);
              case 3:
                _context10.p = 3;
                _t8 = _context10.v;
                _this.debugManager.error('❌ Erro ao testar conexão Steam:', _t8);
                return _context10.a(2, {
                  success: false,
                  error: 'Erro interno ao testar conexão'
                });
            }
          }, _callee10, null, [[1, 3]]);
        }));
        return function (_x9, _x0) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
  }]);
}();
module.exports = ConfigManager;