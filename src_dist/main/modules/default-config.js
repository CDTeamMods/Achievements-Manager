"use strict";

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
var fs = require('fs').promises;
var path = require('path');
var _require = require('./debug-manager'),
  getDebugManager = _require.getDebugManager;
var DefaultConfigManager = function () {
  function DefaultConfigManager() {
    var pathManager = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var crashReporter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, DefaultConfigManager);
    this.pathManager = pathManager;
    this.crashReporter = crashReporter;
    this.debugManager = getDebugManager();
  }
  return _createClass(DefaultConfigManager, [{
    key: "getDefaultAppConfig",
    value: function getDefaultAppConfig() {
      return {
        setupComplete: false,
        language: 'en',
        theme: 'auto',
        liteMode: true,
        virtualScrolling: true,
        showTooltips: true,
        notifications: {
          enabled: true,
          sound: true,
          position: 'bottom-right'
        },
        autoUpdate: true,
        crashReports: true
      };
    }
  }, {
    key: "getDefaultMigrationConfig",
    value: function getDefaultMigrationConfig() {
      return {
        autoMigration: false,
        showDialog: true,
        lastCheck: null
      };
    }
  }, {
    key: "getDefaultSettings",
    value: function getDefaultSettings() {
      return {
        language: 'en',
        theme: 'auto',
        lastSync: null
      };
    }
  }, {
    key: "ensureConfigFile",
    value: (function () {
      var _ensureConfigFile = _asyncToGenerator(_regenerator().m(function _callee(filePath, defaultConfig) {
        var _t, _t2;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return fs.access(filePath);
            case 1:
              _context.n = 7;
              break;
            case 2:
              _context.p = 2;
              _t = _context.v;
              _context.p = 3;
              _context.n = 4;
              return fs.mkdir(path.dirname(filePath), {
                recursive: true
              });
            case 4:
              _context.n = 5;
              return fs.writeFile(filePath, JSON.stringify(defaultConfig, null, 2), 'utf8');
            case 5:
              _context.n = 7;
              break;
            case 6:
              _context.p = 6;
              _t2 = _context.v;
              this.debugManager.error("\u274C Erro ao criar arquivo de configura\xE7\xE3o ".concat(path.basename(filePath), ":"), _t2);
              if (this.crashReporter && this.crashReporter.logError) {
                this.crashReporter.logError('DefaultConfigManager', _t2, {
                  action: 'ensureConfigFile',
                  filePath: filePath
                });
              }
              throw _t2;
            case 7:
              return _context.a(2);
          }
        }, _callee, this, [[3, 6], [0, 2]]);
      }));
      function ensureConfigFile(_x, _x2) {
        return _ensureConfigFile.apply(this, arguments);
      }
      return ensureConfigFile;
    }())
  }, {
    key: "initializeDefaultConfigs",
    value: (function () {
      var _initializeDefaultConfigs = _asyncToGenerator(_regenerator().m(function _callee2() {
        var dataPath, settingsPath, _t3;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              dataPath = this.pathManager ? this.pathManager.getDataPath() : path.join(__dirname, '..', '..', 'data');
              settingsPath = path.join(dataPath, 'settings');
              _context2.n = 1;
              return this.migrateOldSettings();
            case 1:
              _context2.n = 2;
              return this.ensureConfigFile(path.join(settingsPath, 'app.json'), this.getDefaultAppConfig());
            case 2:
              _context2.n = 3;
              return this.ensureConfigFile(path.join(settingsPath, 'migration-settings.json'), this.getDefaultMigrationConfig());
            case 3:
              this.debugManager.log('✅ Configurações padrão inicializadas com sucesso');
              _context2.n = 5;
              break;
            case 4:
              _context2.p = 4;
              _t3 = _context2.v;
              this.debugManager.error('❌ Erro ao inicializar configurações padrão:', _t3);
              if (this.crashReporter && typeof this.crashReporter.logError === 'function') {
                this.crashReporter.logError('DefaultConfigManager', _t3, {
                  action: 'initializeDefaultConfigs'
                });
              }
              throw _t3;
            case 5:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 4]]);
      }));
      function initializeDefaultConfigs() {
        return _initializeDefaultConfigs.apply(this, arguments);
      }
      return initializeDefaultConfigs;
    }())
  }, {
    key: "updateConfigIfNeeded",
    value: (function () {
      var _updateConfigIfNeeded = _asyncToGenerator(_regenerator().m(function _callee3(filePath, defaultConfig) {
        var content, currentConfig, hasNewFields, updatedConfig, _i, _Object$entries, _Object$entries$_i, key, value, _t4;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              _context3.n = 1;
              return fs.readFile(filePath, 'utf8');
            case 1:
              content = _context3.v;
              currentConfig = JSON.parse(content);
              hasNewFields = false;
              updatedConfig = _objectSpread({}, currentConfig);
              for (_i = 0, _Object$entries = Object.entries(defaultConfig); _i < _Object$entries.length; _i++) {
                _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];
                if (!(key in currentConfig)) {
                  updatedConfig[key] = value;
                  hasNewFields = true;
                }
              }
              if (!hasNewFields) {
                _context3.n = 2;
                break;
              }
              _context3.n = 2;
              return fs.writeFile(filePath, JSON.stringify(updatedConfig, null, 2), 'utf8');
            case 2:
              _context3.n = 4;
              break;
            case 3:
              _context3.p = 3;
              _t4 = _context3.v;
            case 4:
              return _context3.a(2);
          }
        }, _callee3, null, [[0, 3]]);
      }));
      function updateConfigIfNeeded(_x3, _x4) {
        return _updateConfigIfNeeded.apply(this, arguments);
      }
      return updateConfigIfNeeded;
    }())
  }, {
    key: "migrateOldSettings",
    value: (function () {
      var _migrateOldSettings = _asyncToGenerator(_regenerator().m(function _callee4() {
        var dataPath, settingsPath, oldSettingsPath, newSettingsPath, oldSettingsContent, oldSettings, migratedSettings, _t5, _t6, _t7;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              if (this.pathManager) {
                _context4.n = 1;
                break;
              }
              return _context4.a(2);
            case 1:
              dataPath = this.pathManager.getDataPath();
              settingsPath = this.pathManager.getPaths().settings;
              oldSettingsPath = path.join(dataPath, 'settings.json');
              newSettingsPath = path.join(settingsPath, 'app.json');
              _context4.p = 2;
              _context4.n = 3;
              return fs.access(oldSettingsPath);
            case 3:
              _context4.n = 5;
              break;
            case 4:
              _context4.p = 4;
              _t5 = _context4.v;
              return _context4.a(2);
            case 5:
              _context4.p = 5;
              _context4.n = 6;
              return fs.access(newSettingsPath);
            case 6:
              _context4.n = 7;
              return fs.unlink(oldSettingsPath);
            case 7:
              return _context4.a(2);
            case 8:
              _context4.p = 8;
              _t6 = _context4.v;
              _context4.n = 9;
              return fs.readFile(oldSettingsPath, 'utf8');
            case 9:
              oldSettingsContent = _context4.v;
              oldSettings = JSON.parse(oldSettingsContent);
              migratedSettings = _objectSpread({}, oldSettings);
              _context4.n = 10;
              return fs.mkdir(settingsPath, {
                recursive: true
              });
            case 10:
              _context4.n = 11;
              return fs.writeFile(newSettingsPath, JSON.stringify(migratedSettings, null, 2), 'utf8');
            case 11:
              _context4.n = 12;
              return fs.unlink(oldSettingsPath);
            case 12:
              _context4.n = 14;
              break;
            case 13:
              _context4.p = 13;
              _t7 = _context4.v;
              this.debugManager.error('❌ Erro ao migrar configurações antigas:', _t7);
              if (this.crashReporter && typeof this.crashReporter.logError === 'function') {
                this.crashReporter.logError('DefaultConfigManager', _t7, {
                  action: 'migrateOldSettings'
                });
              }
            case 14:
              return _context4.a(2);
          }
        }, _callee4, this, [[5, 8], [2, 4], [0, 13]]);
      }));
      function migrateOldSettings() {
        return _migrateOldSettings.apply(this, arguments);
      }
      return migrateOldSettings;
    }())
  }]);
}();
var defaultConfigManager = null;
function setupDefaultConfig() {
  var pathManager = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var crashReporter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!defaultConfigManager) {
    defaultConfigManager = new DefaultConfigManager(pathManager, crashReporter);
  }
  return defaultConfigManager;
}
function getDefaultConfigManager() {
  return defaultConfigManager;
}
module.exports = {
  DefaultConfigManager: DefaultConfigManager,
  setupDefaultConfig: setupDefaultConfig,
  getDefaultConfigManager: getDefaultConfigManager
};