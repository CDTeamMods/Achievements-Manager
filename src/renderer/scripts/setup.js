var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2(
  (target, value) => __defProp22(target, "name", { value, configurable: true }),
  "__name"
);
import { initI18n, changeLanguage, t, translatePage } from "./i18n-hot.js";
import { filterAllowedSettings } from "./config/allowed-settings-keys.js";
const isDebugEnabled = /* @__PURE__ */ __name22(() => {
  try {
    const localStorageDebug = localStorage.getItem("DEBUG_TOOLS");
    if (localStorageDebug === "true") return true;
    if (window.DEBUG_TOOLS === true) return true;
    if (typeof process !== "undefined" && process.env && process.env.DEBUG_TOOLS === "true")
      return true;
    return false;
  } catch (error) {
    return false;
  }
}, "isDebugEnabled");
let debugManagerPromise = null;
if (isDebugEnabled()) {
  debugManagerPromise = import("./utils/debug-manager.js").then((module) => {
    return window.getDebugManager();
  }).catch((error) => {
    return null;
  });
}
class SetupWizard {
  static {
    __name(this, "SetupWizard");
  }
  static {
    __name2(this, "SetupWizard");
  }
  static {
    __name22(this, "SetupWizard");
  }
  constructor() {
    this.currentStep = 0;
    this.steps = ["welcome", "language", "theme", "performance", "complete"];
    this.setupData = {};
    this.init();
  }
  async init() {
    try {
      await this.initI18nSystem();
      this.setupEventListeners();
      this.updateNavigationButtons();
      await this.translatePage();
      this.showStep(this.currentStep);
    } catch (error) {
    }
  }
  async initI18nSystem() {
    try {
      let currentLanguage = "pt-BR";
      if (window.electronAPI && window.electronAPI.i18n) {
        try {
          currentLanguage = await window.electronAPI.i18n.getCurrentLanguage() || "pt-BR";
        } catch (error) {
        }
      } else {
        const browserLanguage = navigator.language || navigator.userLanguage;
        if (browserLanguage.startsWith("pt")) {
          currentLanguage = "pt-BR";
        } else {
          currentLanguage = "en";
        }
      }
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
    document.addEventListener("click", (e) => {
      const nextBtn = e.target.closest(".setup-next");
      const prevBtn = e.target.closest(".setup-prev");
      const finishBtn = e.target.closest(".setup-finish");
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
    document.addEventListener("change", (e) => {
      if (e.target.matches(".setup-input")) {
        this.updateSetupData(e.target.name, e.target.value);
      }
      if (e.target.id === "setupLiteModeToggle") {
        this.setPerformanceMode(e.target.checked);
      }
      if (e.target.id === "setupVirtualScrollToggle") {
        this.updateSetupData("virtualScrolling", e.target.checked);
      }
      if (e.target.id === "setupLanguageSelect") {
        this.setLanguage(e.target.value).catch((error) => {
        });
        this.updateNavigationButtons();
      }
    });
    this.setupGlobeAnimations();
    document.addEventListener("click", (e) => {
      const themeOption = e.target.closest(".theme-option");
      if (themeOption) {
        document.querySelectorAll(".theme-option").forEach((option) => {
          option.classList.remove("selected");
        });
        themeOption.classList.add("selected");
        const theme = themeOption.dataset.theme;
        this.setTheme(theme);
      }
    });
  }
  showStep(stepIndex) {
    const steps = document.querySelectorAll(".setup-step");
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === stepIndex);
    });
    this.updateProgressIndicator(stepIndex);
    this.updateNavigationButtons();
  }
  updateProgressIndicator(stepIndex) {
    const progressSteps = document.querySelectorAll(".progress-step");
    const progressConnectors = document.querySelectorAll(".progress-connector");
    progressSteps.forEach((step, index) => {
      step.classList.remove("active", "completed");
      if (index < stepIndex) {
        step.classList.add("completed");
      } else if (index === stepIndex) {
        step.classList.add("active");
      }
    });
    progressConnectors.forEach((connector, index) => {
      connector.classList.remove("completed");
      if (index < stepIndex) {
        connector.classList.add("completed");
      }
    });
    const activeStep = progressSteps[stepIndex];
    if (activeStep) {
      activeStep.style.transform = "scale(1.1)";
      setTimeout(() => {
        activeStep.style.transform = "scale(1)";
      }, 300);
    }
  }
  nextStep() {
    const totalSteps = document.querySelectorAll(".setup-step").length || this.steps.length || 1;
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
    const prevBtn = document.querySelector(".setup-prev");
    const nextBtn = document.querySelector(".setup-next");
    const finishBtn = document.querySelector(".setup-finish");
    const totalSteps = (document.querySelectorAll(".setup-step") || []).length || this.steps.length || 1;
    const isLastStep = this.currentStep === totalSteps - 1;
    if (prevBtn) {
      prevBtn.style.display = this.currentStep === 0 ? "none" : "inline-flex";
    }
    if (nextBtn) {
      nextBtn.style.display = isLastStep ? "none" : "inline-flex";
      if (this.currentStep === 0) {
        const languageSelect = document.getElementById("setupLanguageSelect");
        const isLanguageSelected = languageSelect && languageSelect.value && languageSelect.value !== "";
        if (isLanguageSelected) {
          nextBtn.disabled = false;
          nextBtn.classList.remove("disabled");
        } else {
          nextBtn.disabled = true;
          nextBtn.classList.add("disabled");
        }
      } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove("disabled");
      }
    }
    if (finishBtn) {
      finishBtn.style.display = isLastStep ? "inline-flex" : "none";
    }
  }
  updateSetupData(key, value) {
    this.setupData[key] = value;
  }
  sanitizeSettingsManual(settings) {
    return filterAllowedSettings(settings);
  }
  async finishSetup() {
    try {
      const liteModeToggle = document.getElementById("setupLiteModeToggle");
      const virtualScrollToggle = document.getElementById("setupVirtualScrollToggle");
      const languageSelect = document.getElementById("setupLanguageSelect");
      if (liteModeToggle) {
        this.setupData.liteMode = liteModeToggle.checked;
        debugManagerPromise?.then(
          (debugManager) => debugManager?.log("\u{1F50B} Modo Lite capturado:", liteModeToggle.checked)
        );
      }
      if (virtualScrollToggle) {
        this.setupData.virtualScrolling = virtualScrollToggle.checked;
        debugManagerPromise?.then(
          (debugManager) => debugManager?.log("\u{1F4DC} Virtual Scrolling capturado:", virtualScrollToggle.checked)
        );
      }
      if (languageSelect) {
        this.setupData.language = languageSelect.value;
        debugManagerPromise?.then(
          (debugManager) => debugManager?.log("\u{1F30D} Idioma capturado:", languageSelect.value)
        );
      }
      const settings = {
        setupComplete: true,
        language: this.setupData.language || "en",
        theme: this.setupData.theme || "dark",
        liteMode: this.setupData.liteMode || false,
        virtualScrolling: this.setupData.virtualScrolling !== false,
        animations: this.setupData.liteMode ? "disabled" : "enabled",
        compactMode: false,
        showTooltips: true,
        notifications: {
          enabled: true,
          achievements: true
        },
        autoSync: true,
        syncInterval: 15,
        cacheSize: 100,
        ...this.setupData
      };
      debugManagerPromise?.then(
        (debugManager) => debugManager?.log("\u{1F4BE} Configura\xE7\xF5es finais a serem salvas:", settings)
      );
      if (window.electronAPI && window.electronAPI.fs) {
        const sanitizedSettings = window.IPCSanitizer ? window.IPCSanitizer.sanitizeSettings(settings) : this.sanitizeSettingsManual(settings);
        await window.electronAPI.fs.saveSettings(sanitizedSettings);
      } else {
        localStorage.setItem("achievements-settings", JSON.stringify(settings));
      }
      const setupWizard = document.getElementById("setupWizard");
      const mainApp = document.getElementById("mainApp");
      if (setupWizard) {
        setupWizard.classList.add("hidden");
      }
      if (mainApp) {
        mainApp.classList.remove("hidden");
      }
      if (window.app) {
        window.app.state.setState("settings", settings);
        window.app.isSetupComplete = true;
        window.app.applyTheme(settings.theme);
        window.app.applyLiteMode(settings.liteMode);
        window.app.loadDashboard();
      }
    } catch (error) {
    }
  }
  // Métodos para configurações específicas
  async setLanguage(language) {
    this.updateSetupData("language", language);
    try {
      await changeLanguage(language);
      await this.translatePage();
      this.updateLanguageSummary(language);
      this.showLanguageChangeEffect(language);
    } catch (error) {
    }
  }
  // Atualizar o resumo do idioma na tela final
  updateLanguageSummary(language) {
    const summaryElement = document.getElementById("summaryLanguage");
    if (summaryElement) {
      const languageNames = {
        "pt-BR": "Portugu\xEAs (Brasil)",
        en: "English (United States)"
      };
      summaryElement.textContent = languageNames[language] || language;
    }
  }
  setTheme(theme) {
    this.updateSetupData("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }
  setPerformanceMode(liteMode) {
    this.updateSetupData("liteMode", liteMode);
  }
  // 🌍 Configuração das animações sincronizadas do globo
  setupGlobeAnimations() {
    const languageDropdown = document.getElementById("setupLanguageSelect");
    const globeIcon = document.querySelector(".input-group .fa-globe");
    if (!languageDropdown || !globeIcon) return;
    languageDropdown.addEventListener("change", (e) => {
      languageDropdown.classList.add("changing");
      globeIcon.classList.add("changing");
      setTimeout(() => {
        languageDropdown.classList.remove("changing");
        globeIcon.classList.remove("changing");
      }, 800);
      this.showLanguageChangeEffect(e.target.value);
    });
    languageDropdown.addEventListener("focus", () => {
      globeIcon.classList.add("focused");
    });
    languageDropdown.addEventListener("blur", () => {
      globeIcon.classList.remove("focused");
    });
    const inputGroup = languageDropdown.closest(".input-group");
    if (inputGroup) {
      inputGroup.addEventListener("mouseenter", () => {
        globeIcon.classList.add("hovered");
      });
      inputGroup.addEventListener("mouseleave", () => {
        globeIcon.classList.remove("hovered");
      });
    }
  }
  // Efeito visual para mudança de idioma
  showLanguageChangeEffect(language) {
    const setupHeader = document.querySelector(".setup-header h2");
    if (!setupHeader) return;
    setupHeader.style.transition = "all 0.3s ease";
    setupHeader.style.transform = "scale(1.05)";
    setupHeader.style.color = language === "pt-BR" ? "#10b981" : "#3b82f6";
    setTimeout(() => {
      setupHeader.style.transform = "scale(1)";
      setupHeader.style.color = "";
    }, 300);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  window.setupWizard = new SetupWizard();
});
export {
  SetupWizard
};
