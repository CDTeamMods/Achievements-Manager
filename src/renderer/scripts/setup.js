// Setup Wizard - Configuração inicial da aplicação

// Importar sistema i18n
import { initI18n, changeLanguage, t, translatePage } from './i18n-hot.js';
import { filterAllowedSettings } from './config/allowed-settings-keys.js';

// Verificar se DEBUG_TOOLS está habilitado
const isDebugEnabled = () => {
  try {
    // Verificar localStorage
    const localStorageDebug = localStorage.getItem('DEBUG_TOOLS');
    if (localStorageDebug === 'true') return true;

    // Verificar variável global
    if (window.DEBUG_TOOLS === true) return true;

    // Verificar process.env se disponível
    if (typeof process !== 'undefined' && process.env && process.env.DEBUG_TOOLS === 'true')
      return true;

    return false;
  } catch (error) {
    return false;
  }
};

// Importar debugManager apenas se necessário
let debugManagerPromise = null;
if (isDebugEnabled()) {
  debugManagerPromise = import('./utils/debug-manager.js')
    .then(module => {
      return window.getDebugManager();
    })
    .catch(error => {
      // Log removido para evitar dependência circular com DebugManager
      return null;
    });
}

class SetupWizard {
  constructor() {
    this.currentStep = 0;
    this.steps = ['welcome', 'language', 'theme', 'performance', 'complete'];
    this.setupData = {};
    this.init();
  }

  async init() {
    try {
      // Inicializar sistema i18n primeiro
      await this.initI18nSystem();

      this.setupEventListeners();
      // Configurar estado inicial dos botões
      this.updateNavigationButtons();

      // Aplicar traduções na página
      await this.translatePage();

      // Garantir que uma etapa esteja visível ao iniciar o wizard
      // Sem esta chamada, todas as `.setup-step` permanecem com display: none,
      // resultando em tela preta mesmo com o wizard visível.
      this.showStep(this.currentStep);
    } catch (error) {

    }
  }

  async initI18nSystem() {
    try {
      // Detectar idioma do sistema ou usar padrão
      let currentLanguage = 'pt-BR';

      // Tentar obter idioma salvo das configurações
      if (window.electronAPI && window.electronAPI.i18n) {
        try {
          currentLanguage = (await window.electronAPI.i18n.getCurrentLanguage()) || 'pt-BR';
        } catch (error) {

        }
      } else {
        // Detectar idioma do navegador
        const browserLanguage = navigator.language || navigator.userLanguage;
        if (browserLanguage.startsWith('pt')) {
          currentLanguage = 'pt-BR';
        } else {
          currentLanguage = 'en';
        }
      }

      // Inicializar sistema i18n
      await initI18n(currentLanguage);
    } catch (error) {

    }
  }

  async translatePage() {
    try {
      await translatePage();
    } catch (error) {

    }
  }

  setupEventListeners() {
    // Botões de navegação
    document.addEventListener('click', e => {
      // Usar closest para capturar cliques em elementos filhos (ícones, spans)
      const nextBtn = e.target.closest('.setup-next');
      const prevBtn = e.target.closest('.setup-prev');
      const finishBtn = e.target.closest('.setup-finish');

      if (nextBtn) {
        this.nextStep();
        return;
      }
      if (prevBtn) {
        this.prevStep();
        return;
      }
      if (finishBtn) {
        this.finishSetup();
        return;
      }
    });

    // Inputs de configuração
    document.addEventListener('change', e => {
      if (e.target.matches('.setup-input')) {
        this.updateSetupData(e.target.name, e.target.value);
      }

      // Capturar mudanças no toggle do modo lite
      if (e.target.id === 'setupLiteModeToggle') {
        this.setPerformanceMode(e.target.checked);
      }

      // Capturar mudanças no toggle do virtual scrolling
      if (e.target.id === 'setupVirtualScrollToggle') {
        this.updateSetupData('virtualScrolling', e.target.checked);
      }

      // Capturar mudanças no dropdown de idioma
      if (e.target.id === 'setupLanguageSelect') {
        this.setLanguage(e.target.value).catch(error => {

        });
        // Atualizar botões de navegação após mudança de idioma
        this.updateNavigationButtons();
      }
    });

    // 🌍 Sincronização das animações do globo com dropdown de idiomas
    this.setupGlobeAnimations();

    // Seleção de tema
    document.addEventListener('click', e => {
      const themeOption = e.target.closest('.theme-option');
      if (themeOption) {
        // Remove seleção anterior
        document.querySelectorAll('.theme-option').forEach(option => {
          option.classList.remove('selected');
        });

        // Adiciona seleção atual
        themeOption.classList.add('selected');

        // Aplica o tema
        const theme = themeOption.dataset.theme;
        this.setTheme(theme);
      }
    });
  }

  showStep(stepIndex) {
    const steps = document.querySelectorAll('.setup-step');
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === stepIndex);
    });

    // Atualizar indicador de progresso visual
    this.updateProgressIndicator(stepIndex);

    // Atualizar botões
    this.updateNavigationButtons();
  }

  updateProgressIndicator(stepIndex) {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressConnectors = document.querySelectorAll('.progress-connector');

    // Atualizar steps do progresso
    progressSteps.forEach((step, index) => {
      step.classList.remove('active', 'completed');

      if (index < stepIndex) {
        step.classList.add('completed');
      } else if (index === stepIndex) {
        step.classList.add('active');
      }
    });

    // Atualizar conectores
    progressConnectors.forEach((connector, index) => {
      connector.classList.remove('completed');

      if (index < stepIndex) {
        connector.classList.add('completed');
      }
    });

    // Adicionar animação suave ao step ativo
    const activeStep = progressSteps[stepIndex];
    if (activeStep) {
      activeStep.style.transform = 'scale(1.1)';
      setTimeout(() => {
        activeStep.style.transform = 'scale(1)';
      }, 300);
    }
  }

  nextStep() {
    const totalSteps = document.querySelectorAll('.setup-step').length || this.steps.length || 1;
    if (this.currentStep < totalSteps - 1) {
      this.currentStep++;
      this.showStep(this.currentStep);
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  updateNavigationButtons() {
    const prevBtn = document.querySelector('.setup-prev');
    const nextBtn = document.querySelector('.setup-next');
    const finishBtn = document.querySelector('.setup-finish');

    // Usar a contagem real de passos no DOM para evitar inconsistências
    const totalSteps =
      (document.querySelectorAll('.setup-step') || []).length || this.steps.length || 1;
    const isLastStep = this.currentStep === totalSteps - 1;

    if (prevBtn) {
      prevBtn.style.display = this.currentStep === 0 ? 'none' : 'inline-flex';
    }

    if (nextBtn) {
      nextBtn.style.display = isLastStep ? 'none' : 'inline-flex';

      // Validação específica para o primeiro step (seleção de idioma)
      if (this.currentStep === 0) {
        const languageSelect = document.getElementById('setupLanguageSelect');
        const isLanguageSelected =
          languageSelect && languageSelect.value && languageSelect.value !== '';

        if (isLanguageSelected) {
          nextBtn.disabled = false;
          nextBtn.classList.remove('disabled');
        } else {
          nextBtn.disabled = true;
          nextBtn.classList.add('disabled');
        }
      } else {
        // Para outros steps, manter o comportamento normal
        nextBtn.disabled = false;
        nextBtn.classList.remove('disabled');
      }
    }

    if (finishBtn) {
      finishBtn.style.display = isLastStep ? 'inline-flex' : 'none';
    }
  }

  updateSetupData(key, value) {
    this.setupData[key] = value;
  }

  sanitizeSettingsManual(settings) {
    // Usa a configuração centralizada
    return filterAllowedSettings(settings);
  }

  async finishSetup() {
    try {
      // Capturar valores atuais dos toggles diretamente do DOM
      const liteModeToggle = document.getElementById('setupLiteModeToggle');
      const virtualScrollToggle = document.getElementById('setupVirtualScrollToggle');
      const languageSelect = document.getElementById('setupLanguageSelect');

      // Atualizar setupData com valores atuais
      if (liteModeToggle) {
        this.setupData.liteMode = liteModeToggle.checked;
        debugManagerPromise?.then(debugManager =>
          debugManager?.log('🔋 Modo Lite capturado:', liteModeToggle.checked)
        );
      }

      if (virtualScrollToggle) {
        this.setupData.virtualScrolling = virtualScrollToggle.checked;
        debugManagerPromise?.then(debugManager =>
          debugManager?.log('📜 Virtual Scrolling capturado:', virtualScrollToggle.checked)
        );
      }

      if (languageSelect) {
        this.setupData.language = languageSelect.value;
        debugManagerPromise?.then(debugManager =>
          debugManager?.log('🌍 Idioma capturado:', languageSelect.value)
        );
      }

      // Configurações finais
      const settings = {
        setupComplete: true,
        language: this.setupData.language || 'en',
        theme: this.setupData.theme || 'dark',
        liteMode: this.setupData.liteMode || false,
        virtualScrolling: this.setupData.virtualScrolling !== false,
        animations: this.setupData.liteMode ? 'disabled' : 'enabled',
        compactMode: false,
        showTooltips: true,
        notifications: {
          enabled: true,
          achievements: true,
        },
        autoSync: true,
        syncInterval: 15,
        cacheSize: 100,
        ...this.setupData,
      };

      debugManagerPromise?.then(debugManager =>
        debugManager?.log('💾 Configurações finais a serem salvas:', settings)
      );

      // Salvar configurações
      if (window.electronAPI && window.electronAPI.fs) {
        // Sanitizar configurações antes de enviar via IPC
        const sanitizedSettings = window.IPCSanitizer
          ? window.IPCSanitizer.sanitizeSettings(settings)
          : this.sanitizeSettingsManual(settings);
        await window.electronAPI.fs.saveSettings(sanitizedSettings);
      } else {
        localStorage.setItem('achievements-settings', JSON.stringify(settings));
      }

      // Esconder wizard e mostrar app principal
      const setupWizard = document.getElementById('setupWizard');
      const mainApp = document.getElementById('mainApp');

      if (setupWizard) {
        setupWizard.classList.add('hidden');
      }

      if (mainApp) {
        mainApp.classList.remove('hidden');
      }

      // Reinicializar app com novas configurações
      if (window.app) {
        window.app.state.setState('settings', settings);
        window.app.isSetupComplete = true;
        window.app.applyTheme(settings.theme);
        window.app.applyLiteMode(settings.liteMode);
        window.app.loadDashboard();
      }
    } catch (error) {
      // Log removido para evitar dependência circular com DebugManager
    }
  }

  // Métodos para configurações específicas
  async setLanguage(language) {
    this.updateSetupData('language', language);

    // Aplicar traduções na interface do setup
    try {
      // Usar o sistema i18n já importado
      await changeLanguage(language);

      // Aplicar traduções imediatamente
      await this.translatePage();

      // Atualizar o resumo na tela final
      this.updateLanguageSummary(language);

      // Efeito visual para mudança de idioma
      this.showLanguageChangeEffect(language);

    } catch (error) {

    }
  }

  // Atualizar o resumo do idioma na tela final
  updateLanguageSummary(language) {
    const summaryElement = document.getElementById('summaryLanguage');
    if (summaryElement) {
      const languageNames = {
        'pt-BR': 'Português (Brasil)',
        en: 'English (United States)',
      };
      summaryElement.textContent = languageNames[language] || language;
    }
  }

  setTheme(theme) {
    this.updateSetupData('theme', theme);
    // Aplicar tema imediatamente para preview
    document.documentElement.setAttribute('data-theme', theme);
  }

  setPerformanceMode(liteMode) {
    this.updateSetupData('liteMode', liteMode);
  }

  // 🌍 Configuração das animações sincronizadas do globo
  setupGlobeAnimations() {
    const languageDropdown = document.getElementById('setupLanguageSelect');
    const globeIcon = document.querySelector('.input-group .fa-globe');

    if (!languageDropdown || !globeIcon) return;

    // Animação quando o dropdown muda de valor
    languageDropdown.addEventListener('change', e => {
      // Adiciona classe de mudança para trigger da animação
      languageDropdown.classList.add('changing');
      globeIcon.classList.add('changing');

      // Remove a classe após a animação
      setTimeout(() => {
        languageDropdown.classList.remove('changing');
        globeIcon.classList.remove('changing');
      }, 800);

      // Feedback visual adicional
      this.showLanguageChangeEffect(e.target.value);
    });

    // Animação quando o dropdown recebe foco
    languageDropdown.addEventListener('focus', () => {
      globeIcon.classList.add('focused');
    });

    // Remove animação quando perde o foco
    languageDropdown.addEventListener('blur', () => {
      globeIcon.classList.remove('focused');
    });

    // Efeito hover sincronizado
    const inputGroup = languageDropdown.closest('.input-group');
    if (inputGroup) {
      inputGroup.addEventListener('mouseenter', () => {
        globeIcon.classList.add('hovered');
      });

      inputGroup.addEventListener('mouseleave', () => {
        globeIcon.classList.remove('hovered');
      });
    }
  }

  // Efeito visual para mudança de idioma
  showLanguageChangeEffect(language) {
    const setupHeader = document.querySelector('.setup-header h2');
    if (!setupHeader) return;

    // Efeito de "piscar" no título
    setupHeader.style.transition = 'all 0.3s ease';
    setupHeader.style.transform = 'scale(1.05)';
    setupHeader.style.color = language === 'pt-BR' ? '#10b981' : '#3b82f6';

    setTimeout(() => {
      setupHeader.style.transform = 'scale(1)';
      setupHeader.style.color = '';
    }, 300);

    // Pequena vibração no globo (se suportado)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.setupWizard = new SetupWizard();
});

// Export ES6
export { SetupWizard };
