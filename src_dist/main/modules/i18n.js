"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
  ipcMain = _require.ipcMain,
  app = _require.app;
var fs = require('fs').promises;
var path = require('path');
var I18nManager = function () {
  function I18nManager() {
    var pathManager = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var debugManager = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, I18nManager);
    this.pathManager = pathManager;
    this.debugManager = debugManager;
    this.currentLanguage = 'en';
    this.translations = new Map();
    this.fallbackLanguage = 'en';
    if (app.isPackaged) {
      this.translationsPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'locales');
    } else {
      this.translationsPath = path.join(__dirname, '..', '..', 'locales');
    }
    this.init();
  }
  return _createClass(I18nManager, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(_regenerator().m(function _callee() {
        var savedLanguage, _this$debugManager, settingsPath, settingsContent, settings, _this$debugManager2, _this$debugManager3, _this$debugManager4, systemLanguage, _this$debugManager5, _t, _t2;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              savedLanguage = null;
              _context.p = 1;
              settingsPath = this.pathManager ? path.join(this.pathManager.getDataPath(), 'settings', 'app.json') : path.join(__dirname, '..', '..', 'data', 'settings', 'app.json');
              _context.n = 2;
              return fs.readFile(settingsPath, 'utf8');
            case 2:
              settingsContent = _context.v;
              settings = JSON.parse(settingsContent);
              savedLanguage = settings.language;
              (_this$debugManager = this.debugManager) === null || _this$debugManager === void 0 || _this$debugManager.log("\uD83D\uDCC1 Idioma salvo encontrado: ".concat(savedLanguage));
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              (_this$debugManager2 = this.debugManager) === null || _this$debugManager2 === void 0 || _this$debugManager2.log('📁 Nenhuma configuração de idioma salva encontrada');
            case 4:
              if (savedLanguage && ['pt-BR', 'en'].includes(savedLanguage)) {
                this.currentLanguage = savedLanguage;
                (_this$debugManager3 = this.debugManager) === null || _this$debugManager3 === void 0 || _this$debugManager3.log("\uD83D\uDD04 Usando idioma salvo: ".concat(savedLanguage));
              } else {
                systemLanguage = Intl.DateTimeFormat().resolvedOptions().locale;
                this.currentLanguage = this.normalizeLanguageCode(systemLanguage);
                (_this$debugManager4 = this.debugManager) === null || _this$debugManager4 === void 0 || _this$debugManager4.log("\uD83C\uDF0D Usando idioma do sistema: ".concat(this.currentLanguage));
              }
              _context.n = 5;
              return this.loadTranslations();
            case 5:
              this.setupIPC();
              _context.n = 7;
              break;
            case 6:
              _context.p = 6;
              _t2 = _context.v;
              (_this$debugManager5 = this.debugManager) === null || _this$debugManager5 === void 0 || _this$debugManager5.error('Error initializing I18n:', _t2);
            case 7:
              return _context.a(2);
          }
        }, _callee, this, [[1, 3], [0, 6]]);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }, {
    key: "normalizeLanguageCode",
    value: function normalizeLanguageCode(locale) {
      var languageMap = {
        pt: 'pt-BR',
        'pt-BR': 'pt-BR',
        'pt-PT': 'pt-BR',
        en: 'en',
        'en-US': 'en',
        'en-GB': 'en'
      };
      return languageMap[locale] || 'en';
    }
  }, {
    key: "loadTranslations",
    value: function () {
      var _loadTranslations = _asyncToGenerator(_regenerator().m(function _callee2() {
        var files, translationFiles, _iterator, _step, file, language, filePath, content, translations, _this$debugManager6, _this$debugManager7, _t3, _t4, _t5;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return fs.mkdir(this.translationsPath, {
                recursive: true
              });
            case 1:
              _context2.n = 2;
              return fs.readdir(this.translationsPath);
            case 2:
              files = _context2.v;
              translationFiles = files.filter(function (file) {
                return file.endsWith('.json');
              });
              if (!(translationFiles.length === 0)) {
                _context2.n = 4;
                break;
              }
              _context2.n = 3;
              return this.createDefaultTranslations();
            case 3:
              return _context2.a(2);
            case 4:
              _iterator = _createForOfIteratorHelper(translationFiles);
              _context2.p = 5;
              _iterator.s();
            case 6:
              if ((_step = _iterator.n()).done) {
                _context2.n = 11;
                break;
              }
              file = _step.value;
              language = path.basename(file, '.json');
              filePath = path.join(this.translationsPath, file);
              _context2.p = 7;
              _context2.n = 8;
              return fs.readFile(filePath, 'utf8');
            case 8:
              content = _context2.v;
              translations = JSON.parse(content);
              this.translations.set(language, translations);
              _context2.n = 10;
              break;
            case 9:
              _context2.p = 9;
              _t3 = _context2.v;
              (_this$debugManager6 = this.debugManager) === null || _this$debugManager6 === void 0 || _this$debugManager6.error("\u274C Error loading translation file ".concat(file, ":"), _t3);
            case 10:
              _context2.n = 6;
              break;
            case 11:
              _context2.n = 13;
              break;
            case 12:
              _context2.p = 12;
              _t4 = _context2.v;
              _iterator.e(_t4);
            case 13:
              _context2.p = 13;
              _iterator.f();
              return _context2.f(13);
            case 14:
              _context2.n = 16;
              break;
            case 15:
              _context2.p = 15;
              _t5 = _context2.v;
              (_this$debugManager7 = this.debugManager) === null || _this$debugManager7 === void 0 || _this$debugManager7.error('❌ Error loading translations:', _t5);
              _context2.n = 16;
              return this.createDefaultTranslations();
            case 16:
              return _context2.a(2);
          }
        }, _callee2, this, [[7, 9], [5, 12, 13, 14], [0, 15]]);
      }));
      function loadTranslations() {
        return _loadTranslations.apply(this, arguments);
      }
      return loadTranslations;
    }()
  }, {
    key: "createDefaultTranslations",
    value: function () {
      var _createDefaultTranslations = _asyncToGenerator(_regenerator().m(function _callee3() {
        var defaultTranslations, _i, _Object$entries, _Object$entries$_i, language, translations, filePath;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              defaultTranslations = {
                'pt-BR': {
                  'app.title': 'Achievements Manager',
                  'app.description': 'Gerenciador de Conquistas para Jogos',
                  'app.loading': 'Carregando...',
                  'app.error': 'Erro',
                  'app.success': 'Sucesso',
                  'app.warning': 'Aviso',
                  'app.info': 'Informação',
                  'nav.dashboard': 'Dashboard',
                  'nav.games': 'Jogos',
                  'nav.achievements': 'Conquistas',
                  'nav.statistics': 'Estatísticas',
                  'nav.settings': 'Configurações',
                  'nav.backup': 'Backup',
                  'dashboard.welcome': 'Bem-vindo ao Achievements Manager',
                  'dashboard.totalGames': 'Total de Jogos',
                  'dashboard.totalAchievements': 'Total de Conquistas',
                  'dashboard.completionRate': 'Taxa de Conclusão',
                  'dashboard.recentActivity': 'Atividade Recente',
                  'dashboard.quickStats': 'Estatísticas Rápidas',
                  'games.title': 'Meus Jogos',
                  'games.addGame': 'Adicionar Jogo',
                  'games.searchPlaceholder': 'Buscar jogos...',
                  'games.empty.title': 'Nenhum jogo encontrado',
                  'games.achievements': 'conquistas',
                  'games.completed': 'Concluído',
                  'games.inProgress': 'Em Progresso',
                  'games.notStarted': 'Não Iniciado',
                  'achievements.title': 'Conquistas',
                  'achievements.unlocked': 'Desbloqueadas',
                  'achievements.locked': 'Bloqueadas',
                  'achievements.rare': 'Raras',
                  'achievements.common': 'Comuns',
                  'achievements.progress': 'Progresso',
                  'achievements.description': 'Descrição',
                  'achievements.unlockedOn': 'Desbloqueada em',
                  'settings.title': 'Configurações',
                  'settings.general': 'Geral',
                  'settings.appearance': 'Aparência',
                  'settings.performance': 'Performance',
                  'settings.backup': 'Backup',
                  'settings.language': 'Idioma',
                  'settings.theme': 'Tema',
                  'settings.theme.light': 'Claro',
                  'settings.theme.dark': 'Escuro',
                  'settings.theme.auto': 'Automático',
                  'settings.performance.mode': 'Modo de Performance',
                  'settings.performance.normal': 'Normal',
                  'settings.performance.lite': 'Lite',
                  'settings.animations': 'Animações',
                  'settings.animations.enabled': 'Habilitadas',
                  'settings.animations.disabled': 'Desabilitadas',
                  'settings.animations.reduced': 'Reduzidas',
                  'btn.save': 'Salvar',
                  'btn.cancel': 'Cancelar',
                  'btn.delete': 'Excluir',
                  'btn.edit': 'Editar',
                  'btn.add': 'Adicionar',
                  'btn.remove': 'Remover',
                  'btn.close': 'Fechar',
                  'btn.ok': 'OK',
                  'btn.yes': 'Sim',
                  'btn.no': 'Não',
                  'btn.back': 'Voltar',
                  'btn.next': 'Próximo',
                  'btn.previous': 'Anterior',
                  'btn.finish': 'Finalizar',
                  'msg.confirmDelete': 'Tem certeza que deseja excluir?',
                  'msg.saveSuccess': 'Salvo com sucesso!',
                  'msg.saveError': 'Erro ao salvar',
                  'msg.loadError': 'Erro ao carregar dados',
                  'msg.networkError': 'Erro de conexão',
                  'msg.invalidData': 'Dados inválidos',
                  'setup.welcome': 'Bem-vindo!',
                  'setup.language.title': 'Escolha seu idioma',
                  'setup.language.description': 'Selecione o idioma de sua preferência',
                  'setup.theme.title': 'Escolha o tema',
                  'setup.theme.description': 'Selecione o tema visual',
                  'setup.performance.title': 'Configurações de Performance',
                  'setup.performance.description': 'Otimize a aplicação para seu sistema',
                  'setup.complete': 'Configuração Concluída!',
                  'setup.complete.description': 'Sua aplicação está pronta para uso'
                },
                en: {
                  'app.title': 'Achievements Manager',
                  'app.description': 'Game Achievement Manager',
                  'app.loading': 'Loading...',
                  'app.error': 'Error',
                  'app.success': 'Success',
                  'app.warning': 'Warning',
                  'app.info': 'Information',
                  'nav.dashboard': 'Dashboard',
                  'nav.games': 'Games',
                  'nav.achievements': 'Achievements',
                  'nav.statistics': 'Statistics',
                  'nav.settings': 'Settings',
                  'nav.backup': 'Backup',
                  'dashboard.welcome': 'Welcome to Achievements Manager',
                  'dashboard.totalGames': 'Total Games',
                  'dashboard.totalAchievements': 'Total Achievements',
                  'dashboard.completionRate': 'Completion Rate',
                  'dashboard.recentActivity': 'Recent Activity',
                  'dashboard.quickStats': 'Quick Stats',
                  'games.title': 'My Games',
                  'games.addGame': 'Add Game',
                  'games.searchPlaceholder': 'Search games...',
                  'games.empty.title': 'No games found',
                  'games.achievements': 'achievements',
                  'games.completed': 'Completed',
                  'games.inProgress': 'In Progress',
                  'games.notStarted': 'Not Started',
                  'achievements.title': 'Achievements',
                  'achievements.unlocked': 'Unlocked',
                  'achievements.locked': 'Locked',
                  'achievements.rare': 'Rare',
                  'achievements.common': 'Common',
                  'achievements.progress': 'Progress',
                  'achievements.description': 'Description',
                  'achievements.unlockedOn': 'Unlocked on',
                  'settings.title': 'Settings',
                  'settings.general': 'General',
                  'settings.appearance': 'Appearance',
                  'settings.performance': 'Performance',
                  'settings.backup': 'Backup',
                  'settings.language': 'Language',
                  'settings.theme': 'Theme',
                  'settings.theme.light': 'Light',
                  'settings.theme.dark': 'Dark',
                  'settings.theme.auto': 'Auto',
                  'settings.performance.mode': 'Performance Mode',
                  'settings.performance.normal': 'Normal',
                  'settings.performance.lite': 'Lite',
                  'settings.animations': 'Animations',
                  'settings.animations.enabled': 'Enabled',
                  'settings.animations.disabled': 'Disabled',
                  'settings.animations.reduced': 'Reduced',
                  'btn.save': 'Save',
                  'btn.cancel': 'Cancel',
                  'btn.delete': 'Delete',
                  'btn.edit': 'Edit',
                  'btn.add': 'Add',
                  'btn.remove': 'Remove',
                  'btn.close': 'Close',
                  'btn.ok': 'OK',
                  'btn.yes': 'Yes',
                  'btn.no': 'No',
                  'btn.back': 'Back',
                  'btn.next': 'Next',
                  'btn.previous': 'Previous',
                  'btn.finish': 'Finish',
                  'msg.confirmDelete': 'Are you sure you want to delete?',
                  'msg.saveSuccess': 'Saved successfully!',
                  'msg.saveError': 'Error saving',
                  'msg.loadError': 'Error loading data',
                  'msg.networkError': 'Network error',
                  'msg.invalidData': 'Invalid data',
                  'setup.welcome': 'Welcome!',
                  'setup.language.title': 'Choose your language',
                  'setup.language.description': 'Select your preferred language',
                  'setup.theme.title': 'Choose theme',
                  'setup.theme.description': 'Select visual theme',
                  'setup.performance.title': 'Performance Settings',
                  'setup.performance.description': 'Optimize the app for your system',
                  'setup.complete': 'Setup Complete!',
                  'setup.complete.description': 'Your application is ready to use'
                }
              };
              _i = 0, _Object$entries = Object.entries(defaultTranslations);
            case 1:
              if (!(_i < _Object$entries.length)) {
                _context3.n = 4;
                break;
              }
              _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), language = _Object$entries$_i[0], translations = _Object$entries$_i[1];
              filePath = path.join(this.translationsPath, "".concat(language, ".json"));
              _context3.n = 2;
              return fs.writeFile(filePath, JSON.stringify(translations, null, 2), 'utf8');
            case 2:
              this.translations.set(language, translations);
            case 3:
              _i++;
              _context3.n = 1;
              break;
            case 4:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function createDefaultTranslations() {
        return _createDefaultTranslations.apply(this, arguments);
      }
      return createDefaultTranslations;
    }()
  }, {
    key: "setupIPC",
    value: function setupIPC() {
      var _this = this;
      ipcMain.handle('i18n:get', function (event, key) {
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        try {
          var result = _this.get(key, params);
          return _this.sanitizeTranslationResult(result);
        } catch (error) {
          return typeof key === 'string' ? key : 'Translation Error';
        }
      });
      ipcMain.handle('i18n:translate', function (event, key) {
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        try {
          var result = _this.get(key, params);
          var sanitizedResult = _this.sanitizeTranslationResult(result);
          try {
            structuredClone(sanitizedResult);
          } catch (cloneError) {
            return typeof key === 'string' ? key : 'Translation Error';
          }
          return sanitizedResult;
        } catch (error) {
          return typeof key === 'string' ? key : 'Translation Error';
        }
      });
      ipcMain.handle('i18n:getCurrentLanguage', function () {
        try {
          var language = _this.currentLanguage;
          if (!language || typeof language !== 'string') {
            language = 'pt-BR';
          }
          var safeLanguage = '' + language;
          try {
            structuredClone(safeLanguage);
            return safeLanguage;
          } catch (cloneError) {
            return 'pt-BR';
          }
        } catch (error) {
          return 'pt-BR';
        }
      });
      ipcMain.handle('i18n:getLanguage', function () {
        try {
          var language = _this.currentLanguage;
          if (!language || typeof language !== 'string') {
            language = 'pt-BR';
          }
          var safeLanguage = '' + language;
          try {
            structuredClone(safeLanguage);
            return safeLanguage;
          } catch (cloneError) {
            return 'pt-BR';
          }
        } catch (error) {
          return 'pt-BR';
        }
      });
      ipcMain.handle('i18n:setLanguage', function () {
        var _ref = _asyncToGenerator(_regenerator().m(function _callee4(event, language) {
          return _regenerator().w(function (_context4) {
            while (1) switch (_context4.n) {
              case 0:
                _context4.n = 1;
                return _this.setLanguage(language);
              case 1:
                return _context4.a(2, _context4.v);
            }
          }, _callee4);
        }));
        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
      ipcMain.handle('i18n:getAvailableLanguages', function () {
        return _this.getAvailableLanguages();
      });
      ipcMain.handle('i18n:getAllTranslations', function () {
        return _this.getAllTranslations();
      });
      ipcMain.handle('i18n:getTranslations', function (event, language) {
        if (language) {
          return _this.translations.get(language) || {};
        }
        return _this.getAllTranslations();
      });
    }
  }, {
    key: "sanitizeTranslationResult",
    value: function sanitizeTranslationResult(result) {
      try {
        if (result == null) {
          return '';
        }
        if (typeof result === 'string') {
          var sanitized = '' + result;
          try {
            structuredClone(sanitized);
            return sanitized;
          } catch (cloneError) {
            return String(result);
          }
        }
        if (typeof result === 'number') {
          return String(result);
        }
        if (typeof result === 'boolean') {
          return String(result);
        }
        if (_typeof(result) === 'object') {
          try {
            var serialized = JSON.stringify(result);
            return serialized;
          } catch (jsonError) {
            return '[Object]';
          }
        }
        return String(result);
      } catch (error) {
        return 'Translation Error';
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var translation = this.getTranslation(key);
      return this.interpolate(translation, params);
    }
  }, {
    key: "getTranslation",
    value: function getTranslation(key) {
      var getNestedValue = function getNestedValue(obj, path) {
        return path.split('.').reduce(function (current, prop) {
          return current && current[prop] !== undefined ? current[prop] : undefined;
        }, obj);
      };
      var currentTranslations = this.translations.get(this.currentLanguage);
      if (currentTranslations) {
        if (currentTranslations[key]) {
          return currentTranslations[key];
        }
        var nestedValue = getNestedValue(currentTranslations, key);
        if (nestedValue !== undefined) {
          return nestedValue;
        }
      }
      var fallbackTranslations = this.translations.get(this.fallbackLanguage);
      if (fallbackTranslations) {
        if (fallbackTranslations[key]) {
          return fallbackTranslations[key];
        }
        var _nestedValue = getNestedValue(fallbackTranslations, key);
        if (_nestedValue !== undefined) {
          return _nestedValue;
        }
      }
      return key;
    }
  }, {
    key: "interpolate",
    value: function interpolate(text, params) {
      if (!params || Object.keys(params).length === 0) {
        return text;
      }
      return text.replace(/\{\{(\w+)\}\}/g, function (match, key) {
        return params[key] !== undefined ? params[key] : match;
      });
    }
  }, {
    key: "setLanguage",
    value: function () {
      var _setLanguage = _asyncToGenerator(_regenerator().m(function _callee5(language) {
        var settingsPath, settings, settingsContent, _this$debugManager8, _t6, _t7;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              if (this.translations.has(language)) {
                _context5.n = 1;
                break;
              }
              console.warn("Language ".concat(language, " not available"));
              return _context5.a(2, false);
            case 1:
              this.currentLanguage = language;
              _context5.p = 2;
              settingsPath = this.pathManager ? path.join(this.pathManager.getDataPath(), 'settings', 'app.json') : path.join(__dirname, '..', '..', 'data', 'settings', 'app.json');
              settings = {};
              _context5.p = 3;
              _context5.n = 4;
              return fs.readFile(settingsPath, 'utf8');
            case 4:
              settingsContent = _context5.v;
              settings = JSON.parse(settingsContent);
              _context5.n = 6;
              break;
            case 5:
              _context5.p = 5;
              _t6 = _context5.v;
            case 6:
              settings.language = language;
              _context5.n = 7;
              return fs.mkdir(path.dirname(settingsPath), {
                recursive: true
              });
            case 7:
              _context5.n = 8;
              return fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
            case 8:
              return _context5.a(2, true);
            case 9:
              _context5.p = 9;
              _t7 = _context5.v;
              (_this$debugManager8 = this.debugManager) === null || _this$debugManager8 === void 0 || _this$debugManager8.error('Error saving language setting:', _t7);
              return _context5.a(2, false);
          }
        }, _callee5, this, [[3, 5], [2, 9]]);
      }));
      function setLanguage(_x3) {
        return _setLanguage.apply(this, arguments);
      }
      return setLanguage;
    }()
  }, {
    key: "getAvailableLanguages",
    value: function getAvailableLanguages() {
      var supportedLanguages = ['pt-BR', 'en'];
      var languages = [];
      var _iterator2 = _createForOfIteratorHelper(this.translations),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 1),
            code = _step2$value[0];
          if (!supportedLanguages.includes(code)) continue;
          var languageNames = {
            'pt-BR': '🇧🇷 Português (Brasil)',
            en: '🇺🇸 English (United States)'
          };
          languages.push({
            code: code,
            name: languageNames[code] || code,
            "native": languageNames[code] || code
          });
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return languages.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }
  }, {
    key: "getAllTranslations",
    value: function getAllTranslations() {
      return this.translations.get(this.currentLanguage) || {};
    }
  }, {
    key: "formatNumber",
    value: function formatNumber(number) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new Intl.NumberFormat(this.currentLanguage, options).format(number);
    }
  }, {
    key: "formatDate",
    value: function formatDate(date) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new Intl.DateTimeFormat(this.currentLanguage, options).format(date);
    }
  }, {
    key: "formatRelativeTime",
    value: function formatRelativeTime(date) {
      var rtf = new Intl.RelativeTimeFormat(this.currentLanguage, {
        numeric: 'auto'
      });
      var now = new Date();
      var diff = date.getTime() - now.getTime();
      var units = [{
        unit: 'year',
        ms: 31536000000
      }, {
        unit: 'month',
        ms: 2628000000
      }, {
        unit: 'day',
        ms: 86400000
      }, {
        unit: 'hour',
        ms: 3600000
      }, {
        unit: 'minute',
        ms: 60000
      }, {
        unit: 'second',
        ms: 1000
      }];
      for (var _i2 = 0, _units = units; _i2 < _units.length; _i2++) {
        var _units$_i = _units[_i2],
          unit = _units$_i.unit,
          ms = _units$_i.ms;
        if (Math.abs(diff) >= ms) {
          return rtf.format(Math.round(diff / ms), unit);
        }
      }
      return rtf.format(0, 'second');
    }
  }]);
}();
var i18nManager = null;
function setupI18n() {
  var pathManager = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var debugManager = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!i18nManager) {
    i18nManager = new I18nManager(pathManager, debugManager);
  }
  return i18nManager;
}
module.exports = {
  I18nManager: I18nManager,
  setupI18n: setupI18n
};