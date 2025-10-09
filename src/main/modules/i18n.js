const require_i18n = module => {
  const { ipcMain, app } = require('electron');
  const fs = require('node:fs').promises;
  const path = require('node:path');
  class I18nManager {
    constructor(pathManager = null, debugManager = null) {
      this.pathManager = pathManager;
      this.debugManager = debugManager;
      this.currentLanguage = 'en';
      this.translations = new Map();
      this.fallbackLanguage = 'en';
      if (app.isPackaged) {
        this.translationsPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'locales');
      } else {
        this.translationsPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'locales');
      }
      this.init();
    }
    async init() {
      try {
        let savedLanguage = null;
        const settingsPath = this.pathManager
          ? path.join(this.pathManager.getDataPath(), 'settings', 'app.json')
          : path.join(__dirname, '..', '..', 'data', 'settings', 'app.json');
        const settingsContent = await fs.readFile(settingsPath, 'utf8');
        const settings = JSON.parse(settingsContent);
        savedLanguage = settings.language;
        this.debugManager?.log(`\u{1F4C1} Idioma salvo encontrado: ${savedLanguage}`);
        if (savedLanguage && ['pt-BR', 'en'].includes(savedLanguage)) {
          this.currentLanguage = savedLanguage;
          this.debugManager?.log(`\u{1F504} Usando idioma salvo: ${savedLanguage}`);
        } else {
          const systemLanguage = Intl.DateTimeFormat().resolvedOptions().locale;
          this.currentLanguage = this.normalizeLanguageCode(systemLanguage);
          this.debugManager?.log(`\u{1F30D} Usando idioma do sistema: ${this.currentLanguage}`);
        }
        await this.loadTranslations();
        this.setupIPC();
      } catch (error) {
        this.debugManager?.error('Error initializing I18n:', error);
      }
    }
    normalizeLanguageCode(locale) {
      const languageMap = {
        pt: 'pt-BR',
        'pt-BR': 'pt-BR',
        'pt-PT': 'pt-BR',
        en: 'en',
        'en-US': 'en',
        'en-GB': 'en',
        // Qualquer outro idioma será mapeado para inglês como fallback
      };
      return languageMap[locale] || 'en';
    }
    async loadTranslations() {
      try {
        await fs.mkdir(this.translationsPath, { recursive: true });
        const files = await fs.readdir(this.translationsPath);
        const translationFiles = files.filter(file => file.endsWith('.json'));
        if (translationFiles.length === 0) {
          await this.createDefaultTranslations();
          return;
        }
        for (const file of translationFiles) {
          const language = path.basename(file, '.json');
          const filePath = path.join(this.translationsPath, file);
          try {
            const content = await fs.readFile(filePath, 'utf8');
            const translations = JSON.parse(content);
            this.translations.set(language, translations);
          } catch (error) {
            this.debugManager?.error(`\u274C Error loading translation file ${file}:`, error);
          }
        }
      } catch (error) {
        this.debugManager?.error('\u274C Error loading translations:', error);
        await this.createDefaultTranslations();
      }
    }
    async createDefaultTranslations() {
      const defaultTranslations = {
        'pt-BR': {
          // App
          'app.title': 'Achievements Manager',
          'app.description': 'Gerenciador de Conquistas para Jogos',
          'app.loading': 'Carregando...',
          'app.error': 'Erro',
          'app.success': 'Sucesso',
          'app.warning': 'Aviso',
          'app.info': 'Informa\xE7\xE3o',
          // Navigation
          'nav.dashboard': 'Dashboard',
          'nav.games': 'Jogos',
          'nav.achievements': 'Conquistas',
          'nav.statistics': 'Estat\xEDsticas',
          'nav.settings': 'Configura\xE7\xF5es',
          'nav.backup': 'Backup',
          // Dashboard
          'dashboard.welcome': 'Bem-vindo ao Achievements Manager',
          'dashboard.totalGames': 'Total de Jogos',
          'dashboard.totalAchievements': 'Total de Conquistas',
          'dashboard.completionRate': 'Taxa de Conclus\xE3o',
          'dashboard.recentActivity': 'Atividade Recente',
          'dashboard.quickStats': 'Estat\xEDsticas R\xE1pidas',
          // Games
          'games.title': 'Meus Jogos',
          'games.addGame': 'Adicionar Jogo',
          'games.searchPlaceholder': 'Buscar jogos...',
          'games.empty.title': 'Nenhum jogo encontrado',
          'games.achievements': 'conquistas',
          'games.completed': 'Conclu\xEDdo',
          'games.inProgress': 'Em Progresso',
          'games.notStarted': 'N\xE3o Iniciado',
          // Achievements
          'achievements.title': 'Conquistas',
          'achievements.unlocked': 'Desbloqueadas',
          'achievements.locked': 'Bloqueadas',
          'achievements.rare': 'Raras',
          'achievements.common': 'Comuns',
          'achievements.progress': 'Progresso',
          'achievements.description': 'Descri\xE7\xE3o',
          'achievements.unlockedOn': 'Desbloqueada em',
          // Settings
          'settings.title': 'Configura\xE7\xF5es',
          'settings.general': 'Geral',
          'settings.appearance': 'Apar\xEAncia',
          'settings.performance': 'Performance',
          'settings.backup': 'Backup',
          'settings.language': 'Idioma',
          'settings.theme': 'Tema',
          'settings.theme.light': 'Claro',
          'settings.theme.dark': 'Escuro',
          'settings.theme.auto': 'Autom\xE1tico',
          'settings.performance.mode': 'Modo de Performance',
          'settings.performance.normal': 'Normal',
          'settings.performance.lite': 'Lite',
          'settings.animations': 'Anima\xE7\xF5es',
          'settings.animations.enabled': 'Habilitadas',
          'settings.animations.disabled': 'Desabilitadas',
          'settings.animations.reduced': 'Reduzidas',
          // Buttons
          'btn.save': 'Salvar',
          'btn.cancel': 'Cancelar',
          'btn.delete': 'Excluir',
          'btn.edit': 'Editar',
          'btn.add': 'Adicionar',
          'btn.remove': 'Remover',
          'btn.close': 'Fechar',
          'btn.ok': 'OK',
          'btn.yes': 'Sim',
          'btn.no': 'N\xE3o',
          'btn.back': 'Voltar',
          'btn.next': 'Pr\xF3ximo',
          'btn.previous': 'Anterior',
          'btn.finish': 'Finalizar',
          // Messages
          'msg.confirmDelete': 'Tem certeza que deseja excluir?',
          'msg.saveSuccess': 'Salvo com sucesso!',
          'msg.saveError': 'Erro ao salvar',
          'msg.loadError': 'Erro ao carregar dados',
          'msg.networkError': 'Erro de conex\xE3o',
          'msg.invalidData': 'Dados inv\xE1lidos',
          // Setup Wizard
          'setup.welcome': 'Bem-vindo!',
          'setup.language.title': 'Escolha seu idioma',
          'setup.language.description': 'Selecione o idioma de sua prefer\xEAncia',
          'setup.theme.title': 'Escolha o tema',
          'setup.theme.description': 'Selecione o tema visual',
          'setup.performance.title': 'Configura\xE7\xF5es de Performance',
          'setup.performance.description': 'Otimize a aplica\xE7\xE3o para seu sistema',
          'setup.complete': 'Configura\xE7\xE3o Conclu\xEDda!',
          'setup.complete.description': 'Sua aplica\xE7\xE3o est\xE1 pronta para uso',
        },
        en: {
          // App
          'app.title': 'Achievements Manager',
          'app.description': 'Game Achievement Manager',
          'app.loading': 'Loading...',
          'app.error': 'Error',
          'app.success': 'Success',
          'app.warning': 'Warning',
          'app.info': 'Information',
          // Navigation
          'nav.dashboard': 'Dashboard',
          'nav.games': 'Games',
          'nav.achievements': 'Achievements',
          'nav.statistics': 'Statistics',
          'nav.settings': 'Settings',
          'nav.backup': 'Backup',
          // Dashboard
          'dashboard.welcome': 'Welcome to Achievements Manager',
          'dashboard.totalGames': 'Total Games',
          'dashboard.totalAchievements': 'Total Achievements',
          'dashboard.completionRate': 'Completion Rate',
          'dashboard.recentActivity': 'Recent Activity',
          'dashboard.quickStats': 'Quick Stats',
          // Games
          'games.title': 'My Games',
          'games.addGame': 'Add Game',
          'games.searchPlaceholder': 'Search games...',
          'games.empty.title': 'No games found',
          'games.achievements': 'achievements',
          'games.completed': 'Completed',
          'games.inProgress': 'In Progress',
          'games.notStarted': 'Not Started',
          // Achievements
          'achievements.title': 'Achievements',
          'achievements.unlocked': 'Unlocked',
          'achievements.locked': 'Locked',
          'achievements.rare': 'Rare',
          'achievements.common': 'Common',
          'achievements.progress': 'Progress',
          'achievements.description': 'Description',
          'achievements.unlockedOn': 'Unlocked on',
          // Settings
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
          // Buttons
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
          // Messages
          'msg.confirmDelete': 'Are you sure you want to delete?',
          'msg.saveSuccess': 'Saved successfully!',
          'msg.saveError': 'Error saving',
          'msg.loadError': 'Error loading data',
          'msg.networkError': 'Network error',
          'msg.invalidData': 'Invalid data',
          // Setup Wizard
          'setup.welcome': 'Welcome!',
          'setup.language.title': 'Choose your language',
          'setup.language.description': 'Select your preferred language',
          'setup.theme.title': 'Choose theme',
          'setup.theme.description': 'Select visual theme',
          'setup.performance.title': 'Performance Settings',
          'setup.performance.description': 'Optimize the app for your system',
          'setup.complete': 'Setup Complete!',
          'setup.complete.description': 'Your application is ready to use',
        },
      };
      for (const [language, translations] of Object.entries(defaultTranslations)) {
        const filePath = path.join(this.translationsPath, `${language}.json`);
        await fs.writeFile(filePath, JSON.stringify(translations, null, 2), 'utf8');
        this.translations.set(language, translations);
      }
    }
    setupIPC() {
      ipcMain.handle('i18n:get', (event, key, params = {}) => {
        const result = this.get(key, params);
        return this.sanitizeTranslationResult(result);
      });
      ipcMain.handle('i18n:translate', (event, key, params = {}) => {
        const result = this.get(key, params);
        const sanitizedResult = this.sanitizeTranslationResult(result);
        structuredClone(sanitizedResult);
        return sanitizedResult;
      });
      ipcMain.handle('i18n:getCurrentLanguage', () => {
        let language = this.currentLanguage;
        if (!language || typeof language !== 'string') {
          language = 'pt-BR';
        }
        const safeLanguage = '' + language;
        structuredClone(safeLanguage);
        return safeLanguage;
      });
      ipcMain.handle('i18n:getLanguage', () => {
        let language = this.currentLanguage;
        if (!language || typeof language !== 'string') {
          language = 'pt-BR';
        }
        const safeLanguage = '' + language;
        structuredClone(safeLanguage);
        return safeLanguage;
      });
      ipcMain.handle('i18n:setLanguage', async (event, language) => {
        return await this.setLanguage(language);
      });
      ipcMain.handle('i18n:getAvailableLanguages', () => {
        return this.getAvailableLanguages();
      });
      ipcMain.handle('i18n:getAllTranslations', () => {
        return this.getAllTranslations();
      });
      ipcMain.handle('i18n:getTranslations', (event, language) => {
        if (language) {
          return this.translations.get(language) || {};
        }
        return this.getAllTranslations();
      });
    }
    /**
     * Sanitiza o resultado de tradução para garantir que seja clonável
     * @param {any} result - O resultado da tradução
     * @returns {string} - Resultado sanitizado e clonável
     */
    sanitizeTranslationResult(result) {
      if (result == null) {
        return '';
      }
      if (typeof result === 'string') {
        const sanitized = '' + result;
        structuredClone(sanitized);
        return sanitized;
      }
      if (typeof result === 'number') {
        return String(result);
      }
      if (typeof result === 'boolean') {
        return String(result);
      }
      if (typeof result === 'object') {
        const serialized = JSON.stringify(result);
        return serialized;
      }
      return String(result);
    }
    get(key, params = {}) {
      const translation = this.getTranslation(key);
      return this.interpolate(translation, params);
    }
    getTranslation(key) {
      const getNestedValue = (obj, path2) => {
        return path2.split('.').reduce((current, prop) => {
          return current && current[prop] !== void 0 ? current[prop] : void 0;
        }, obj);
      };
      const currentTranslations = this.translations.get(this.currentLanguage);
      if (currentTranslations) {
        if (currentTranslations[key]) {
          return currentTranslations[key];
        }
        const nestedValue = getNestedValue(currentTranslations, key);
        if (nestedValue !== void 0) {
          return nestedValue;
        }
      }
      const fallbackTranslations = this.translations.get(this.fallbackLanguage);
      if (fallbackTranslations) {
        if (fallbackTranslations[key]) {
          return fallbackTranslations[key];
        }
        const nestedValue = getNestedValue(fallbackTranslations, key);
        if (nestedValue !== void 0) {
          return nestedValue;
        }
      }
      return key;
    }
    interpolate(text, params) {
      if (!params || Object.keys(params).length === 0) {
        return text;
      }
      return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return params[key] !== void 0 ? params[key] : match;
      });
    }
    async setLanguage(language) {
      if (!language || typeof language !== 'string') {
        return false;
      }
      if (!this.translations.has(language)) {
        return false;
      }
      this.currentLanguage = language;
      try {
        const settingsPath = this.pathManager
          ? path.join(this.pathManager.getDataPath(), 'settings', 'app.json')
          : path.join(__dirname, '..', '..', 'data', 'settings', 'app.json');
        let settings = {};
        const settingsContent = await fs.readFile(settingsPath, 'utf8');
        settings = JSON.parse(settingsContent);
        settings.language = language;
        await fs.mkdir(path.dirname(settingsPath), { recursive: true });
        await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
        return true;
      } catch (error) {
        this.debugManager?.error('Error saving language setting:', error);
        return false;
      }
    }
    getAvailableLanguages() {
      const supportedLanguages = ['pt-BR', 'en'];
      const languages = [];
      for (const [code] of this.translations) {
        if (!supportedLanguages.includes(code)) continue;
        const languageNames = {
          'pt-BR': '\u{1F1E7}\u{1F1F7} Portugu\xEAs (Brasil)',
          en: '\u{1F1FA}\u{1F1F8} English (United States)',
        };
        languages.push({
          code,
          name: languageNames[code] || code,
          native: languageNames[code] || code,
        });
      }
      return languages.sort((a, b) => a.name.localeCompare(b.name));
    }
    getAllTranslations() {
      return this.translations.get(this.currentLanguage) || {};
    }
    // Format numbers according to locale
    formatNumber(number, options = {}) {
      return new Intl.NumberFormat(this.currentLanguage, options).format(number);
    }
    // Format dates according to locale
    formatDate(date, options = {}) {
      return new Intl.DateTimeFormat(this.currentLanguage, options).format(date);
    }
    // Format relative time
    formatRelativeTime(date) {
      const rtf = new Intl.RelativeTimeFormat(this.currentLanguage, { numeric: 'auto' });
      const now = new Date();
      const diff = date.getTime() - now.getTime();
      const units = [
        { unit: 'year', ms: 31536e6 },
        { unit: 'month', ms: 2628e6 },
        { unit: 'day', ms: 864e5 },
        { unit: 'hour', ms: 36e5 },
        { unit: 'minute', ms: 6e4 },
        { unit: 'second', ms: 1e3 },
      ];
      for (const { unit, ms } of units) {
        if (Math.abs(diff) >= ms) {
          return rtf.format(Math.round(diff / ms), unit);
        }
      }
      return rtf.format(0, 'second');
    }
  }
  let i18nManager = null;
  function setupI18n(pathManager = null, debugManager = null) {
    if (!i18nManager) {
      i18nManager = new I18nManager(pathManager, debugManager);
    }
    return i18nManager;
  }
  module.exports = { I18nManager, setupI18n };
  module.exports.default = module.exports;
};
const i18n_default = require_i18n();
export { i18n_default as default };
