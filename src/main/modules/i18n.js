// Sistema de Internacionalização - Achievements Manager

const { ipcMain, app } = require('electron');
const fs = require('fs').promises;
const path = require('path');

class I18nManager {
  constructor(pathManager = null, debugManager = null) {
    this.pathManager = pathManager;
    this.debugManager = debugManager;
    this.currentLanguage = 'en';
    this.translations = new Map();
    this.fallbackLanguage = 'en';

    // Determine the correct path for locales based on whether app is packaged
    if (app.isPackaged) {
      this.translationsPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'locales');
    } else {
      this.translationsPath = path.join(__dirname, '..', '..', 'locales');
    }

    this.init();
  }

  async init() {
    try {
      // Load saved language from settings first
      let savedLanguage = null;
      try {
        const settingsPath = this.pathManager
          ? path.join(this.pathManager.getDataPath(), 'settings', 'app.json')
          : path.join(__dirname, '..', '..', 'data', 'settings', 'app.json');

        const settingsContent = await fs.readFile(settingsPath, 'utf8');
        const settings = JSON.parse(settingsContent);
        savedLanguage = settings.language;
        this.debugManager?.log(`📁 Idioma salvo encontrado: ${savedLanguage}`);
      } catch (error) {
        this.debugManager?.log('📁 Nenhuma configuração de idioma salva encontrada');
      }

      // Use saved language if available, otherwise use system language
      if (savedLanguage && ['pt-BR', 'en'].includes(savedLanguage)) {
        this.currentLanguage = savedLanguage;
        this.debugManager?.log(`🔄 Usando idioma salvo: ${savedLanguage}`);
      } else {
        const systemLanguage = Intl.DateTimeFormat().resolvedOptions().locale;
        this.currentLanguage = this.normalizeLanguageCode(systemLanguage);
        this.debugManager?.log(`🌍 Usando idioma do sistema: ${this.currentLanguage}`);
      }

      // Load translations
      await this.loadTranslations();

      // Setup IPC handlers
      this.setupIPC();

      // I18n initialized successfully
    } catch (error) {
      this.debugManager?.error('Error initializing I18n:', error);
    }
  }

  normalizeLanguageCode(locale) {
    // Mapear apenas para os idiomas suportados: Português (Brasil) e Inglês
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
      // Create translations directory if it doesn't exist
      await fs.mkdir(this.translationsPath, { recursive: true });

      // Load available translation files
      const files = await fs.readdir(this.translationsPath);
      const translationFiles = files.filter(file => file.endsWith('.json'));

      if (translationFiles.length === 0) {
        // Create default translations
        await this.createDefaultTranslations();
        return;
      }

      // Load each translation file
      for (const file of translationFiles) {
        const language = path.basename(file, '.json');
        const filePath = path.join(this.translationsPath, file);

        try {
          const content = await fs.readFile(filePath, 'utf8');
          const translations = JSON.parse(content);
          this.translations.set(language, translations);
          // Translation loaded successfully
        } catch (error) {
          this.debugManager?.error(`❌ Error loading translation file ${file}:`, error);
        }
      }

      // All translations loaded
    } catch (error) {
      this.debugManager?.error('❌ Error loading translations:', error);
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
        'app.info': 'Informação',

        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.games': 'Jogos',
        'nav.achievements': 'Conquistas',
        'nav.statistics': 'Estatísticas',
        'nav.settings': 'Configurações',
        'nav.backup': 'Backup',

        // Dashboard
        'dashboard.welcome': 'Bem-vindo ao Achievements Manager',
        'dashboard.totalGames': 'Total de Jogos',
        'dashboard.totalAchievements': 'Total de Conquistas',
        'dashboard.completionRate': 'Taxa de Conclusão',
        'dashboard.recentActivity': 'Atividade Recente',
        'dashboard.quickStats': 'Estatísticas Rápidas',

        // Games
        'games.title': 'Meus Jogos',
        'games.addGame': 'Adicionar Jogo',
        'games.searchPlaceholder': 'Buscar jogos...',
        'games.empty.title': 'Nenhum jogo encontrado',
        'games.achievements': 'conquistas',
        'games.completed': 'Concluído',
        'games.inProgress': 'Em Progresso',
        'games.notStarted': 'Não Iniciado',

        // Achievements
        'achievements.title': 'Conquistas',
        'achievements.unlocked': 'Desbloqueadas',
        'achievements.locked': 'Bloqueadas',
        'achievements.rare': 'Raras',
        'achievements.common': 'Comuns',
        'achievements.progress': 'Progresso',
        'achievements.description': 'Descrição',
        'achievements.unlockedOn': 'Desbloqueada em',

        // Settings
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
        'btn.no': 'Não',
        'btn.back': 'Voltar',
        'btn.next': 'Próximo',
        'btn.previous': 'Anterior',
        'btn.finish': 'Finalizar',

        // Messages
        'msg.confirmDelete': 'Tem certeza que deseja excluir?',
        'msg.saveSuccess': 'Salvo com sucesso!',
        'msg.saveError': 'Erro ao salvar',
        'msg.loadError': 'Erro ao carregar dados',
        'msg.networkError': 'Erro de conexão',
        'msg.invalidData': 'Dados inválidos',

        // Setup Wizard
        'setup.welcome': 'Bem-vindo!',
        'setup.language.title': 'Escolha seu idioma',
        'setup.language.description': 'Selecione o idioma de sua preferência',
        'setup.theme.title': 'Escolha o tema',
        'setup.theme.description': 'Selecione o tema visual',
        'setup.performance.title': 'Configurações de Performance',
        'setup.performance.description': 'Otimize a aplicação para seu sistema',
        'setup.complete': 'Configuração Concluída!',
        'setup.complete.description': 'Sua aplicação está pronta para uso',
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

    // Save default translations
    for (const [language, translations] of Object.entries(defaultTranslations)) {
      const filePath = path.join(this.translationsPath, `${language}.json`);
      await fs.writeFile(filePath, JSON.stringify(translations, null, 2), 'utf8');
      this.translations.set(language, translations);
    }
  }

  setupIPC() {
    // Get translation
    ipcMain.handle('i18n:get', (event, key, params = {}) => {
      try {
        const result = this.get(key, params);
        return this.sanitizeTranslationResult(result);
      } catch (error) {
        return typeof key === 'string' ? key : 'Translation Error';
      }
    });

    // Translate (alias for get)
    ipcMain.handle('i18n:translate', (event, key, params = {}) => {
      try {
        const result = this.get(key, params);
        const sanitizedResult = this.sanitizeTranslationResult(result);

        // Teste de clonagem
        try {
          structuredClone(sanitizedResult);
        } catch (cloneError) {
          // Fallback para string simples
          return typeof key === 'string' ? key : 'Translation Error';
        }

        return sanitizedResult;
      } catch (error) {
        return typeof key === 'string' ? key : 'Translation Error';
      }
    });

    // Get current language
    ipcMain.handle('i18n:getCurrentLanguage', () => {
      try {
        // Garantir que sempre retornamos uma string primitiva
        let language = this.currentLanguage;

        // Se for null, undefined ou não for string, usar fallback
        if (!language || typeof language !== 'string') {
          language = 'pt-BR';
        }

        // Criar uma nova string primitiva para garantir que não há referências
        const safeLanguage = '' + language;

        // Verificar se é clonável
        try {
          structuredClone(safeLanguage);
          return safeLanguage;
        } catch (cloneError) {
          // Último recurso: retornar string literal
          return 'pt-BR';
        }
      } catch (error) {
        return 'pt-BR';
      }
    });

    // Get language (alias for getCurrentLanguage)
    ipcMain.handle('i18n:getLanguage', () => {
      try {
        // Garantir que sempre retornamos uma string primitiva
        let language = this.currentLanguage;

        // Se for null, undefined ou não for string, usar fallback
        if (!language || typeof language !== 'string') {
          language = 'pt-BR';
        }

        // Criar uma nova string primitiva para garantir que não há referências
        const safeLanguage = '' + language;

        // Verificar se é clonável
        try {
          structuredClone(safeLanguage);
          return safeLanguage;
        } catch (cloneError) {
          // Último recurso: retornar string literal
          return 'pt-BR';
        }
      } catch (error) {
        return 'pt-BR';
      }
    });

    // Set language
    ipcMain.handle('i18n:setLanguage', async (event, language) => {
      return await this.setLanguage(language);
    });

    // Get available languages
    ipcMain.handle('i18n:getAvailableLanguages', () => {
      return this.getAvailableLanguages();
    });

    // Get all translations for current language
    ipcMain.handle('i18n:getAllTranslations', () => {
      return this.getAllTranslations();
    });

    // Get translations for specific language
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
    try {
      // Se for null ou undefined, retornar string vazia
      if (result == null) {
        return '';
      }

      // Se for string, garantir que é primitiva
      if (typeof result === 'string') {
        // Criar nova string primitiva
        const sanitized = '' + result;

        // Testar se é clonável
        try {
          structuredClone(sanitized);
          return sanitized;
        } catch (cloneError) {
          // Fallback: criar string literal
          return String(result);
        }
      }

      // Se for número, converter para string
      if (typeof result === 'number') {
        return String(result);
      }

      // Se for boolean, converter para string
      if (typeof result === 'boolean') {
        return String(result);
      }

      // Se for objeto, tentar serializar
      if (typeof result === 'object') {
        try {
          const serialized = JSON.stringify(result);
          return serialized;
        } catch (jsonError) {
          return '[Object]';
        }
      }

      // Para qualquer outro tipo, converter para string
      return String(result);
    } catch (error) {
      return 'Translation Error';
    }
  }

  get(key, params = {}) {
    const translation = this.getTranslation(key);
    return this.interpolate(translation, params);
  }

  getTranslation(key) {
    // Helper function to get nested value from object using dot notation
    const getNestedValue = (obj, path) => {
      return path.split('.').reduce((current, prop) => {
        return current && current[prop] !== undefined ? current[prop] : undefined;
      }, obj);
    };

    // Try current language
    const currentTranslations = this.translations.get(this.currentLanguage);
    if (currentTranslations) {
      // First try direct key lookup
      if (currentTranslations[key]) {
        return currentTranslations[key];
      }
      // Then try nested key lookup
      const nestedValue = getNestedValue(currentTranslations, key);
      if (nestedValue !== undefined) {
        return nestedValue;
      }
    }

    // Try fallback language
    const fallbackTranslations = this.translations.get(this.fallbackLanguage);
    if (fallbackTranslations) {
      // First try direct key lookup
      if (fallbackTranslations[key]) {
        return fallbackTranslations[key];
      }
      // Then try nested key lookup
      const nestedValue = getNestedValue(fallbackTranslations, key);
      if (nestedValue !== undefined) {
        return nestedValue;
      }
    }

    // Return key if no translation found
    return key;
  }

  interpolate(text, params) {
    if (!params || Object.keys(params).length === 0) {
      return text;
    }

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  async setLanguage(language) {
    if (!this.translations.has(language)) {
      console.warn(`Language ${language} not available`);
      return false;
    }

    this.currentLanguage = language;

    // Save to settings
    try {
      const settingsPath = this.pathManager
        ? path.join(this.pathManager.getDataPath(), 'settings', 'app.json')
        : path.join(__dirname, '..', '..', 'data', 'settings', 'app.json');
      let settings = {};

      try {
        const settingsContent = await fs.readFile(settingsPath, 'utf8');
        settings = JSON.parse(settingsContent);
      } catch (error) {
        // Settings file doesn't exist, create new
      }

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
    // Apenas Português (Brasil) e Inglês disponíveis
    const supportedLanguages = ['pt-BR', 'en'];
    const languages = [];

    for (const [code] of this.translations) {
      // Filtrar apenas os idiomas suportados
      if (!supportedLanguages.includes(code)) continue;

      const languageNames = {
        'pt-BR': '🇧🇷 Português (Brasil)',
        en: '🇺🇸 English (United States)',
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
      { unit: 'year', ms: 31536000000 },
      { unit: 'month', ms: 2628000000 },
      { unit: 'day', ms: 86400000 },
      { unit: 'hour', ms: 3600000 },
      { unit: 'minute', ms: 60000 },
      { unit: 'second', ms: 1000 },
    ];

    for (const { unit, ms } of units) {
      if (Math.abs(diff) >= ms) {
        return rtf.format(Math.round(diff / ms), unit);
      }
    }

    return rtf.format(0, 'second');
  }
}

// Instância global do gerenciador
let i18nManager = null;

/**
 * Configura o sistema de internacionalização
 */
function setupI18n(pathManager = null, debugManager = null) {
  if (!i18nManager) {
    i18nManager = new I18nManager(pathManager, debugManager);
  }
  return i18nManager;
}

module.exports = { I18nManager, setupI18n };
