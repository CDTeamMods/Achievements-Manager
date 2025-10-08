// Módulo de Configurações e Temas
import { ALLOWED_SETTINGS_KEYS, filterAllowedSettings } from '../config/allowed-settings-keys.js';

class SettingsManager {
  constructor(app) {
    this.app = app;
    this.currentConfiguredTheme = 'auto';
    this.currentEffectiveTheme = 'dark';
    this.syncInterval = null;
  }

  async loadSettings() {
    try {
      let settings = {};

      if (this.app.isElectron) {
        // Usar o mesmo sistema que o setup.js (FilesystemManager)

        try {
          settings = await window.electronAPI.fs.loadSettings();

          // Verificar se o objeto é clonável
          try {
            // nada
          } catch (cloneError) {

            // Verificar cada propriedade individualmente
            if (settings && typeof settings === 'object') {
                for (const [key, value] of Object.entries(settings)) {
                  try {
                    structuredClone(value);
                  } catch (propError) {
                    // Se for um objeto, verificar suas sub-propriedades
                    if (value && typeof value === 'object') {
                      for (const [subKey, subValue] of Object.entries(value)) {
                        try {
                          structuredClone(subValue);
                        } catch (subError) {
                          // Silent error handling
                        }
                      }
                    }
                  }
                }
              }

            // Tentar identificar propriedades não clonáveis
            for (const [key, value] of Object.entries(settings)) {
              try {
                structuredClone(value);
              } catch (propError) {
                // Silent error handling
              }
            }

            // Criar versão sanitizada
            settings = this.sanitizeSettingsManual(settings);
          }
        } catch (ipcError) {
          throw ipcError;
        }
      } else {
        // Fallback para desenvolvimento (web sempre true)
        const storedSettings = JSON.parse(localStorage.getItem('achievements-settings') || '{}');
        settings = {
          setupComplete: true, // No web sempre true
          language: 'en',
          theme: 'dark',
          liteMode: false,
          virtualScrolling: true,
          ...storedSettings,
        };
      }

      // Garantir que setupComplete sempre esteja definido, evitando regressão indevida para false
      if (settings.setupComplete === undefined) {
        const hasPriorConfig =
          settings.language !== undefined ||
          settings.theme !== undefined ||
          settings.liteMode !== undefined ||
          settings.virtualScrolling !== undefined ||
          settings.apiSource !== undefined ||
          settings.cacheSize !== undefined;

        // Se já existem sinais de configuração anterior, manter como true
        settings.setupComplete = hasPriorConfig ? true : (this.app.isElectron ? false : true);

        // Persistir a correção usando o mesmo sistema
        if (this.app.isElectron) {
          const settingsToSave = { ...settings, setupComplete: settings.setupComplete };
          const sanitizedSettings = window.IPCSanitizer
            ? window.IPCSanitizer.sanitizeSettings(settingsToSave)
            : this.sanitizeSettingsManual(settingsToSave);

          await window.electronAPI.fs.saveSettings(sanitizedSettings);
        } else {
          localStorage.setItem('achievements-settings', JSON.stringify(settings));
        }
      }

      // Sincronizar idioma com o backend se disponível
      if (this.app.isElectronAPIAvailable('i18n')) {
        try {
          const currentBackendLanguage =
            await this.app.safeElectronAPICall('i18n.getCurrentLanguage');
          if (currentBackendLanguage && currentBackendLanguage !== settings.language) {
            settings.language = currentBackendLanguage;

            // Salvar a sincronização
            if (this.app.isElectron) {
              await window.electronAPI.fs.saveSettings(settings);
            } else {
              localStorage.setItem('achievements-settings', JSON.stringify(settings));
            }
          }
        } catch (error) {
          // Silent error handling
        }
      }

      // Verificar se o state está disponível antes de usar
      if (this.app.modules.state && this.app.modules.state.setState) {
        this.app.modules.state.setState('settings', settings);
        
        // Verificar se foi salvo corretamente
        const savedSettings = this.app.modules.state.getState('settings');
      }
      await this.applyAllSettings();
    } catch (error) {
      // Usar configurações padrão (não regredir setupComplete para false)
      const defaultSettings = {
        setupComplete: true,
        language: 'en',
        theme: 'dark',
        liteMode: false,
        virtualScrolling: true,
      };
      // Verificar se o state está disponível antes de usar
      if (this.app.modules.state && this.app.modules.state.setState) {
        this.app.modules.state.setState('settings', defaultSettings);
      }
    }
  }

  // Métodos de gerenciamento de configurações
  get(key) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') || {} : {};
    return settings[key];
  }

  getAll() {
    return this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') || {} : {};
  }

  async set(key, value) {
    try {
      const currentSettings = this.getAll();
      const newSettings = { ...currentSettings, [key]: value };

      // Salvar no estado
      if (this.app.modules.state && this.app.modules.state.setState) {
        this.app.modules.state.setState('settings', newSettings);
      }

      // Persistir
      if (this.app.isElectron) {
        // Sanitizar configurações antes de enviar via IPC
        const sanitizedSettings = window.IPCSanitizer
          ? window.IPCSanitizer.sanitizeSettings(newSettings)
          : this.sanitizeSettingsManual(newSettings);

        await window.electronAPI.fs.saveSettings(sanitizedSettings);
      } else {
        localStorage.setItem('achievements-settings', JSON.stringify(newSettings));
      }

      // Aplicar configuração específica se necessário
      await this.applySingleSetting(key, value);

      return true;
    } catch (error) {
      return false;
    }
  }

  // Método de fallback para sanitização manual
  sanitizeSettingsManual(settings) {
    // Usar a função centralizada
    return filterAllowedSettings(settings);
  }

  async reset() {
    try {
      const defaultSettings = {
        // Garantir que não volte para false ao resetar; manter como true
        setupComplete: true,
        language: 'pt-BR',
        theme: 'dark',
        liteMode: false,
        virtualScrolling: true,
      };

      // Salvar configurações padrão
      if (this.app.modules.state && this.app.modules.state.setState) {
        this.app.modules.state.setState('settings', defaultSettings);
      }

      if (this.app.isElectron) {
        await window.electronAPI.fs.saveSettings(defaultSettings);
      } else {
        localStorage.setItem('achievements-settings', JSON.stringify(defaultSettings));
      }

      // Aplicar todas as configurações
      await this.applyAllSettings();

      return true;
    } catch (error) {
      
      return false;
    }
  }

  async saveSettings(newSettings) {
    try {
      // Obter configurações atuais
      const currentSettings = this.getAll();

      // Mesclar com as novas configurações
      const mergedSettings = { ...currentSettings, ...newSettings };

      // Salvar no estado
      if (this.app.modules.state && this.app.modules.state.setState) {
        this.app.modules.state.setState('settings', mergedSettings);
      }

      // Persistir
      if (this.app.isElectron) {
        // Sanitizar configurações antes de enviar via IPC
        const sanitizedSettings = window.IPCSanitizer
          ? window.IPCSanitizer.sanitizeSettings(mergedSettings)
          : this.sanitizeSettingsManual(mergedSettings);

        await window.electronAPI.fs.saveSettings(sanitizedSettings);
      } else {
        localStorage.setItem('achievements-settings', JSON.stringify(mergedSettings));
      }

      // Aplicar todas as configurações
      await this.applyAllSettings();

      return true;
    } catch (error) {
      
      return false;
    }
  }

  sanitizeSettingsManual(settings) {
    // Sanitização manual básica para configurações
    const sanitized = {};

    for (const [key, value] of Object.entries(settings)) {
      // Filtrar valores que podem causar problemas no IPC
      if (value !== undefined && value !== null) {
        // Converter funções para null
        if (typeof value === 'function') {
          sanitized[key] = null;
        }
        // Manter valores primitivos e objetos simples
        else if (typeof value === 'object') {
          try {
            // Tentar serializar para verificar se é seguro
            JSON.stringify(value);
            sanitized[key] = value;
          } catch (error) {
            
          }
        } else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized;
  }

  async applySingleSetting(key, value) {
    try {
      switch (key) {
        case 'theme':
          await this.applyTheme(value);
          break;
        case 'liteMode':
          this.applyLiteMode(value);
          break;
        case 'virtualScrolling':
          this.applyVirtualScrolling(value);
          break;
        case 'language':
          await this.applyLanguage(value);
          break;
        // Outras configurações podem ser adicionadas aqui
      }
    } catch (error) {
      
    }
  }

  async applyTheme(theme) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
    let themeToApply = theme || settings.theme || 'auto';

    // Validar tema
    if (!['dark', 'light', 'auto'].includes(themeToApply)) {
      
      themeToApply = 'auto';
    }

    // Aplicar o tema diretamente (incluindo 'auto')
    document.documentElement.setAttribute('data-theme', themeToApply);

    // Para o meta theme-color, detectar o tema efetivo
    let effectiveTheme = themeToApply;
    if (themeToApply === 'auto') {
      try {
        if (this.app.isElectronAPIAvailable('theme')) {
          const systemTheme = await this.app.safeElectronAPICall('theme.getSystemTheme');
          effectiveTheme = systemTheme;
        } else {
          // Fallback para detecção via CSS media query
          effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        }
      } catch (error) {
        
        effectiveTheme = 'dark';
      }
    }

    // Atualizar meta theme-color baseado no tema efetivo
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.content = effectiveTheme === 'dark' ? '#1a1a1a' : '#ffffff';

    // Armazenar o tema configurado e o tema efetivo
    this.currentConfiguredTheme = themeToApply;
    this.currentEffectiveTheme = effectiveTheme;
  }

  applyLiteMode(liteMode) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
    const isLiteMode = liteMode !== undefined ? liteMode : settings.liteMode;

    // Aplicar atributo data-lite-mode
    document.documentElement.setAttribute('data-lite-mode', isLiteMode);

    // Aplicar/remover classe lite-mode para compatibilidade
    if (isLiteMode) {
      document.documentElement.classList.add('lite-mode');
      document.body.classList.add('lite-mode');
    } else {
      document.documentElement.classList.remove('lite-mode');
      document.body.classList.remove('lite-mode');
    }

    // Notificar outros componentes sobre a mudança
    window.dispatchEvent(
      new CustomEvent('liteModeChanged', {
        detail: { enabled: isLiteMode },
      })
    );
  }

  applyVirtualScrolling(virtualScrolling) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
    const isVirtualScrolling =
      virtualScrolling !== undefined ? virtualScrolling : settings.virtualScrolling;

    document.documentElement.setAttribute('data-virtual-scrolling', isVirtualScrolling);
  }

  applyCompactMode(compactMode) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
    const isCompactMode = compactMode !== undefined ? compactMode : settings.compactMode;

    document.documentElement.setAttribute('data-compact-mode', isCompactMode);
    document.body.classList.toggle('compact-mode', isCompactMode);
  }

  applyShowTooltips(showTooltips) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
    const isShowTooltips = showTooltips !== undefined ? showTooltips : settings.showTooltips;

    document.documentElement.setAttribute('data-show-tooltips', isShowTooltips);
  }

  applyAutoSync(autoSync) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
    const isAutoSync = autoSync !== undefined ? autoSync : settings.autoSync;

    // Limpar intervalo anterior se existir
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    if (isAutoSync && settings.syncInterval > 0) {
      // Configurar novo intervalo de sincronização
      this.syncInterval = setInterval(() => {
        this.performAutoSync();
      }, settings.syncInterval * 60000); // Converter minutos para milissegundos
    }
  }

  async applyCacheSize(cacheSize) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
    const newCacheSize = cacheSize !== undefined ? cacheSize : settings.cacheSize;

    // Aplicar configuração de cache se houver sistema de cache
    if (this.app.isElectronAPIAvailable('cache')) {
      await this.app.safeElectronAPICall('cache.setMaxSize', newCacheSize);
    }
  }

  async applyLanguage(language, showNotification = true) {
    try {
      const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
      let newLanguage = language !== undefined ? language : settings.language;
      
      // Se ainda for undefined, usar idioma padrão
      if (!newLanguage || typeof newLanguage !== 'string') {
        newLanguage = 'pt-BR'; // Idioma padrão
      }

      // Usar o novo sistema de sincronização que aplica traduções imediatamente
      let success = false;

      if (window.i18nHot && window.i18nHot.syncLanguageWithBackend) {
        // Usar o sistema i18n-hot para aplicação imediata
        success = await window.i18nHot.syncLanguageWithBackend(newLanguage);
      } else if (this.app.isElectronAPIAvailable('i18n')) {
        // Fallback para o sistema antigo
        success = await this.app.safeElectronAPICall('i18n.setLanguage', newLanguage);

        if (success && this.app.modules.helpers && this.app.modules.helpers.translatePage) {
          await this.app.modules.helpers.translatePage();
        }
      }

      if (success) {
        // Atualizar configurações locais
        if (this.app.modules.state && this.app.modules.state.getState && this.app.modules.state.setState) {
          const currentSettings = this.app.modules.state.getState('settings') || {};
          this.app.modules.state.setState('settings', { ...currentSettings, language: newLanguage });
        }

        // Mostrar notificação de sucesso apenas se solicitado
        if (showNotification && this.app.modules.helpers) {
          this.app.modules.helpers.showNotification(
            await this.app.t('msg.saveSuccess', 'Idioma alterado com sucesso!'),
            'success'
          );
        }
      } else {
        
        if (this.app.modules.helpers) {
          this.app.modules.helpers.showError(
            await this.app.t('error.applyLanguage', 'Erro ao aplicar idioma')
          );
        }
      }
    } catch (error) {
      
      if (this.app.modules.helpers) {
        this.app.modules.helpers.showError(
          await this.app.t('error.applyLanguage', 'Erro ao aplicar idioma')
        );
      }
    }
  }

  async performAutoSync() {
    try {
      if (window.electronAPI && window.electronAPI.fs) {
        const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
        // Sanitizar configurações antes de enviar via IPC
        const sanitizedSettings = window.IPCSanitizer
          ? window.IPCSanitizer.sanitizeSettings(settings)
          : this.sanitizeSettingsManual(settings);
        await window.electronAPI.fs.saveSettings(sanitizedSettings);
      }
    } catch (error) {
      
    }
  }

  setupSystemThemeListener() {
    // Listener para mudanças no tema do sistema via IPC
    if (this.app.isElectronAPIAvailable('on')) {
      window.electronAPI.on('theme:systemChanged', async systemTheme => {
        try {
          // Sanitizar dados recebidos para evitar erros de clonagem
          const sanitizedTheme = typeof systemTheme === 'string' ? systemTheme : 'dark';

          const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};

          // Só aplicar se o tema estiver configurado como 'auto'
          if (settings.theme === 'auto') {
            await this.applyTheme('auto');
          }
        } catch (error) {
          
          if (window.electronAPI?.crashReporter) {
            // Sanitizar o erro para evitar problemas de clonagem
            const sanitizedError = {
              message: error?.message || 'Unknown error',
              stack: error?.stack || 'No stack trace',
              name: error?.name || 'Error',
            };
            window.electronAPI.crashReporter.reportError(
              'SettingsManager.setupSystemThemeListener.systemChanged',
              sanitizedError
            );
          }
        }
      });

      // Listener adicional para o evento theme-changed (compatibilidade)
      window.electronAPI.on('theme-changed', async themeData => {
        try {
          // Sanitizar dados recebidos para evitar erros de clonagem
          let sanitizedThemeData = {};

          if (themeData && typeof themeData === 'object') {
            // Extrair apenas propriedades serializáveis
            sanitizedThemeData = {
              systemTheme:
                typeof themeData.systemTheme === 'string' ? themeData.systemTheme : 'dark',
              currentTheme:
                typeof themeData.currentTheme === 'string' ? themeData.currentTheme : 'dark',
              timestamp: typeof themeData.timestamp === 'number' ? themeData.timestamp : Date.now(),
            };
          }

          const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};

          // Só aplicar se o tema estiver configurado como 'auto'
          if (settings.theme === 'auto' && sanitizedThemeData.systemTheme) {
            await this.applyTheme('auto');
          }
        } catch (error) {
          
          if (window.electronAPI?.crashReporter) {
            // Sanitizar o erro para evitar problemas de clonagem
            const sanitizedError = {
              message: error?.message || 'Unknown error',
              stack: error?.stack || 'No stack trace',
              name: error?.name || 'Error',
            };
            window.electronAPI.crashReporter.reportError(
              'SettingsManager.setupSystemThemeListener.themeChanged',
              sanitizedError
            );
          }
        }
      });
    }

    // Fallback: listener para mudanças via CSS media query
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', async e => {
        const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};

        // Só aplicar se o tema estiver configurado como 'auto'
        if (settings.theme === 'auto') {
          const newTheme = e.matches ? 'dark' : 'light';

          await this.applyTheme('auto');
        }
      });
    }

    // Aplicar tema inicial se for automático
    setTimeout(async () => {
      const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
      if (settings.theme === 'auto') {
        await this.applyTheme('auto');
      }
    }, 100);
  }

  checkSetupStatus() {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
    return settings.setupComplete || false;
  }

  // Aplicar configuração de scroll virtual
  applyVirtualScrollSetting() {
    try {
      const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState('settings') : {};
      const enabled = settings.virtualScrolling || false;
      if (enabled) {
        document.body.classList.add('virtual-scroll-enabled');
      } else {
        document.body.classList.remove('virtual-scroll-enabled');
      }
    } catch (error) {
      
    }
  }

  // Função para obter configurações formatadas para a página
  getSettingsForPage() {
    return this.getAll();
  }

  // Método para obter configurações formatadas para a página
  getSettingsForPage() {
    const settings = this.getAll();
    return {
      theme: settings.theme || 'dark',
      liteMode: settings.liteMode || false,
      language: settings.language || 'en',
      virtualScrolling: settings.virtualScrolling || false,
      compactMode: settings.compactMode || false,
      showTooltips: settings.showTooltips !== false,
      autoSync: settings.autoSync !== false,
      cacheSize: settings.cacheSize || 100,
      apiSource: settings.apiSource || 'steam',
    };
  }

  // Aplicar todas as configurações
  applyAllSettings() {
    try {
      this.applyTheme();
      this.applyLanguage(undefined, false); // Não exibir notificação durante inicialização
      this.applyLiteMode();
      this.applyVirtualScrollSetting();
      // Novas configurações de Performance
      this.applyShowTooltips();
      this.applyAutoSync();
      this.applyCacheSize();
    } catch (error) {
      // 
      // Evita dependência circular com DebugManager
      return this.getDefaultSettings();
    }
  }
}

// Exportar para uso global

// Exportar a classe SettingsManager
export { SettingsManager };

// Disponibilizar globalmente para compatibilidade
window.SettingsManager = SettingsManager;
