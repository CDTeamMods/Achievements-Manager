var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2(
  (target, value) => __defProp22(target, "name", { value, configurable: true }),
  "__name"
);
import { ALLOWED_SETTINGS_KEYS, filterAllowedSettings } from "../config/allowed-settings-keys.js";
class SettingsManager {
  static {
    __name(this, "SettingsManager");
  }
  static {
    __name2(this, "SettingsManager");
  }
  static {
    __name22(this, "SettingsManager");
  }
  constructor(app) {
    this.app = app;
    this.currentConfiguredTheme = "auto";
    this.currentEffectiveTheme = "dark";
    this.syncInterval = null;
  }
  async loadSettings() {
    try {
      let settings = {};
      if (this.app.isElectron) {
        try {
          settings = await window.electronAPI.fs.loadSettings();
          try {
          } catch (cloneError) {
            if (settings && typeof settings === "object") {
              for (const [key, value] of Object.entries(settings)) {
                try {
                  structuredClone(value);
                } catch (propError) {
                  if (value && typeof value === "object") {
                    for (const [subKey, subValue] of Object.entries(value)) {
                      try {
                        structuredClone(subValue);
                      } catch (subError) {
                      }
                    }
                  }
                }
              }
            }
            for (const [key, value] of Object.entries(settings)) {
              try {
                structuredClone(value);
              } catch (propError) {
              }
            }
            settings = this.sanitizeSettingsManual(settings);
          }
        } catch (ipcError) {
          throw ipcError;
        }
      } else {
        const storedSettings = JSON.parse(localStorage.getItem("achievements-settings") || "{}");
        settings = {
          setupComplete: true,
          // No web sempre true
          language: "en",
          theme: "dark",
          liteMode: false,
          virtualScrolling: true,
          ...storedSettings
        };
      }
      if (settings.setupComplete === void 0) {
        const hasPriorConfig = settings.language !== void 0 || settings.theme !== void 0 || settings.liteMode !== void 0 || settings.virtualScrolling !== void 0 || settings.apiSource !== void 0 || settings.cacheSize !== void 0;
        settings.setupComplete = hasPriorConfig ? true : this.app.isElectron ? false : true;
        if (this.app.isElectron) {
          const settingsToSave = { ...settings, setupComplete: settings.setupComplete };
          const sanitizedSettings = window.IPCSanitizer ? window.IPCSanitizer.sanitizeSettings(settingsToSave) : this.sanitizeSettingsManual(settingsToSave);
          await window.electronAPI.fs.saveSettings(sanitizedSettings);
        } else {
          localStorage.setItem("achievements-settings", JSON.stringify(settings));
        }
      }
      if (this.app.isElectronAPIAvailable("i18n")) {
        try {
          const currentBackendLanguage = await this.app.safeElectronAPICall("i18n.getCurrentLanguage");
          if (currentBackendLanguage && currentBackendLanguage !== settings.language) {
            settings.language = currentBackendLanguage;
            if (this.app.isElectron) {
              await window.electronAPI.fs.saveSettings(settings);
            } else {
              localStorage.setItem("achievements-settings", JSON.stringify(settings));
            }
          }
        } catch (error) {
        }
      }
      if (this.app.modules.state && this.app.modules.state.setState) {
        this.app.modules.state.setState("settings", settings);
        const savedSettings = this.app.modules.state.getState("settings");
      }
      await this.applyAllSettings();
    } catch (error) {
      const defaultSettings = {
        setupComplete: true,
        language: "en",
        theme: "dark",
        liteMode: false,
        virtualScrolling: true
      };
      if (this.app.modules.state && this.app.modules.state.setState) {
        this.app.modules.state.setState("settings", defaultSettings);
      }
    }
  }
  // Métodos de gerenciamento de configurações
  get(key) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") || {} : {};
    return settings[key];
  }
  getAll() {
    return this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") || {} : {};
  }
  async set(key, value) {
    try {
      const currentSettings = this.getAll();
      const newSettings = { ...currentSettings, [key]: value };
      if (this.app.modules.state && this.app.modules.state.setState) {
        this.app.modules.state.setState("settings", newSettings);
      }
      if (this.app.isElectron) {
        const sanitizedSettings = window.IPCSanitizer ? window.IPCSanitizer.sanitizeSettings(newSettings) : this.sanitizeSettingsManual(newSettings);
        await window.electronAPI.fs.saveSettings(sanitizedSettings);
      } else {
        localStorage.setItem("achievements-settings", JSON.stringify(newSettings));
      }
      await this.applySingleSetting(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }
  // Método de fallback para sanitização manual
  sanitizeSettingsManual(settings) {
    return filterAllowedSettings(settings);
  }
  async reset() {
    try {
      const defaultSettings = {
        // Garantir que não volte para false ao resetar; manter como true
        setupComplete: true,
        language: "pt-BR",
        theme: "dark",
        liteMode: false,
        virtualScrolling: true
      };
      if (this.app.modules.state && this.app.modules.state.setState) {
        this.app.modules.state.setState("settings", defaultSettings);
      }
      if (this.app.isElectron) {
        await window.electronAPI.fs.saveSettings(defaultSettings);
      } else {
        localStorage.setItem("achievements-settings", JSON.stringify(defaultSettings));
      }
      await this.applyAllSettings();
      return true;
    } catch (error) {
      return false;
    }
  }
  async saveSettings(newSettings) {
    try {
      const currentSettings = this.getAll();
      const mergedSettings = { ...currentSettings, ...newSettings };
      if (this.app.modules.state && this.app.modules.state.setState) {
        this.app.modules.state.setState("settings", mergedSettings);
      }
      if (this.app.isElectron) {
        const sanitizedSettings = window.IPCSanitizer ? window.IPCSanitizer.sanitizeSettings(mergedSettings) : this.sanitizeSettingsManual(mergedSettings);
        await window.electronAPI.fs.saveSettings(sanitizedSettings);
      } else {
        localStorage.setItem("achievements-settings", JSON.stringify(mergedSettings));
      }
      await this.applyAllSettings();
      return true;
    } catch (error) {
      return false;
    }
  }
  sanitizeSettingsManual(settings) {
    const sanitized = {};
    for (const [key, value] of Object.entries(settings)) {
      if (value !== void 0 && value !== null) {
        if (typeof value === "function") {
          sanitized[key] = null;
        } else if (typeof value === "object") {
          try {
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
        case "theme":
          await this.applyTheme(value);
          break;
        case "liteMode":
          this.applyLiteMode(value);
          break;
        case "virtualScrolling":
          this.applyVirtualScrolling(value);
          break;
        case "language":
          await this.applyLanguage(value);
          break;
      }
    } catch (error) {
    }
  }
  async applyTheme(theme) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
    let themeToApply = theme || settings.theme || "auto";
    if (!["dark", "light", "auto"].includes(themeToApply)) {
      themeToApply = "auto";
    }
    document.documentElement.setAttribute("data-theme", themeToApply);
    let effectiveTheme = themeToApply;
    if (themeToApply === "auto") {
      try {
        if (this.app.isElectronAPIAvailable("theme")) {
          const systemTheme = await this.app.safeElectronAPICall("theme.getSystemTheme");
          effectiveTheme = systemTheme;
        } else {
          effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
      } catch (error) {
        effectiveTheme = "dark";
      }
    }
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = effectiveTheme === "dark" ? "#1a1a1a" : "#ffffff";
    this.currentConfiguredTheme = themeToApply;
    this.currentEffectiveTheme = effectiveTheme;
  }
  applyLiteMode(liteMode) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
    const isLiteMode = liteMode !== void 0 ? liteMode : settings.liteMode;
    document.documentElement.setAttribute("data-lite-mode", isLiteMode);
    if (isLiteMode) {
      document.documentElement.classList.add("lite-mode");
      document.body.classList.add("lite-mode");
    } else {
      document.documentElement.classList.remove("lite-mode");
      document.body.classList.remove("lite-mode");
    }
    window.dispatchEvent(
      new CustomEvent("liteModeChanged", {
        detail: { enabled: isLiteMode }
      })
    );
  }
  applyVirtualScrolling(virtualScrolling) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
    const isVirtualScrolling = virtualScrolling !== void 0 ? virtualScrolling : settings.virtualScrolling;
    document.documentElement.setAttribute("data-virtual-scrolling", isVirtualScrolling);
  }
  applyCompactMode(compactMode) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
    const isCompactMode = compactMode !== void 0 ? compactMode : settings.compactMode;
    document.documentElement.setAttribute("data-compact-mode", isCompactMode);
    document.body.classList.toggle("compact-mode", isCompactMode);
  }
  applyShowTooltips(showTooltips) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
    const isShowTooltips = showTooltips !== void 0 ? showTooltips : settings.showTooltips;
    document.documentElement.setAttribute("data-show-tooltips", isShowTooltips);
  }
  applyAutoSync(autoSync) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
    const isAutoSync = autoSync !== void 0 ? autoSync : settings.autoSync;
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    if (isAutoSync && settings.syncInterval > 0) {
      this.syncInterval = setInterval(() => {
        this.performAutoSync();
      }, settings.syncInterval * 6e4);
    }
  }
  async applyCacheSize(cacheSize) {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
    const newCacheSize = cacheSize !== void 0 ? cacheSize : settings.cacheSize;
    if (this.app.isElectronAPIAvailable("cache")) {
      await this.app.safeElectronAPICall("cache.setMaxSize", newCacheSize);
    }
  }
  async applyLanguage(language, showNotification = true) {
    try {
      const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
      let newLanguage = language !== void 0 ? language : settings.language;
      if (!newLanguage || typeof newLanguage !== "string") {
        newLanguage = "pt-BR";
      }
      let success = false;
      if (window.i18nHot && window.i18nHot.syncLanguageWithBackend) {
        success = await window.i18nHot.syncLanguageWithBackend(newLanguage);
      } else if (this.app.isElectronAPIAvailable("i18n")) {
        success = await this.app.safeElectronAPICall("i18n.setLanguage", newLanguage);
        if (success && this.app.modules.helpers && this.app.modules.helpers.translatePage) {
          await this.app.modules.helpers.translatePage();
        }
      }
      if (success) {
        if (this.app.modules.state && this.app.modules.state.getState && this.app.modules.state.setState) {
          const currentSettings = this.app.modules.state.getState("settings") || {};
          this.app.modules.state.setState("settings", {
            ...currentSettings,
            language: newLanguage
          });
        }
        if (showNotification && this.app.modules.helpers) {
          this.app.modules.helpers.showNotification(
            await this.app.t("msg.saveSuccess", "Idioma alterado com sucesso!"),
            "success"
          );
        }
      } else {
        if (this.app.modules.helpers) {
          this.app.modules.helpers.showError(
            await this.app.t("error.applyLanguage", "Erro ao aplicar idioma")
          );
        }
      }
    } catch (error) {
      if (this.app.modules.helpers) {
        this.app.modules.helpers.showError(
          await this.app.t("error.applyLanguage", "Erro ao aplicar idioma")
        );
      }
    }
  }
  async performAutoSync() {
    try {
      if (window.electronAPI && window.electronAPI.fs) {
        const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
        const sanitizedSettings = window.IPCSanitizer ? window.IPCSanitizer.sanitizeSettings(settings) : this.sanitizeSettingsManual(settings);
        await window.electronAPI.fs.saveSettings(sanitizedSettings);
      }
    } catch (error) {
    }
  }
  setupSystemThemeListener() {
    if (this.app.isElectronAPIAvailable("on")) {
      window.electronAPI.on("theme:systemChanged", async (systemTheme) => {
        try {
          const sanitizedTheme = typeof systemTheme === "string" ? systemTheme : "dark";
          const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
          if (settings.theme === "auto") {
            await this.applyTheme("auto");
          }
        } catch (error) {
          if (window.electronAPI?.crashReporter) {
            const sanitizedError = {
              message: error?.message || "Unknown error",
              stack: error?.stack || "No stack trace",
              name: error?.name || "Error"
            };
            window.electronAPI.crashReporter.reportError(
              "SettingsManager.setupSystemThemeListener.systemChanged",
              sanitizedError
            );
          }
        }
      });
      window.electronAPI.on("theme-changed", async (themeData) => {
        try {
          let sanitizedThemeData = {};
          if (themeData && typeof themeData === "object") {
            sanitizedThemeData = {
              systemTheme: typeof themeData.systemTheme === "string" ? themeData.systemTheme : "dark",
              currentTheme: typeof themeData.currentTheme === "string" ? themeData.currentTheme : "dark",
              timestamp: typeof themeData.timestamp === "number" ? themeData.timestamp : Date.now()
            };
          }
          const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
          if (settings.theme === "auto" && sanitizedThemeData.systemTheme) {
            await this.applyTheme("auto");
          }
        } catch (error) {
          if (window.electronAPI?.crashReporter) {
            const sanitizedError = {
              message: error?.message || "Unknown error",
              stack: error?.stack || "No stack trace",
              name: error?.name || "Error"
            };
            window.electronAPI.crashReporter.reportError(
              "SettingsManager.setupSystemThemeListener.themeChanged",
              sanitizedError
            );
          }
        }
      });
    }
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", async (e) => {
        const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
        if (settings.theme === "auto") {
          const newTheme = e.matches ? "dark" : "light";
          await this.applyTheme("auto");
        }
      });
    }
    setTimeout(async () => {
      const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
      if (settings.theme === "auto") {
        await this.applyTheme("auto");
      }
    }, 100);
  }
  checkSetupStatus() {
    const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
    return settings.setupComplete || false;
  }
  // Aplicar configuração de scroll virtual
  applyVirtualScrollSetting() {
    try {
      const settings = this.app.modules.state && this.app.modules.state.getState ? this.app.modules.state.getState("settings") : {};
      const enabled = settings.virtualScrolling || false;
      if (enabled) {
        document.body.classList.add("virtual-scroll-enabled");
      } else {
        document.body.classList.remove("virtual-scroll-enabled");
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
      theme: settings.theme || "dark",
      liteMode: settings.liteMode || false,
      language: settings.language || "en",
      virtualScrolling: settings.virtualScrolling || false,
      compactMode: settings.compactMode || false,
      showTooltips: settings.showTooltips !== false,
      autoSync: settings.autoSync !== false,
      cacheSize: settings.cacheSize || 100,
      apiSource: settings.apiSource || "steam"
    };
  }
  // Aplicar todas as configurações
  applyAllSettings() {
    try {
      this.applyTheme();
      this.applyLanguage(void 0, false);
      this.applyLiteMode();
      this.applyVirtualScrollSetting();
      this.applyShowTooltips();
      this.applyAutoSync();
      this.applyCacheSize();
    } catch (error) {
      return this.getDefaultSettings();
    }
  }
}
window.SettingsManager = SettingsManager;
export {
  SettingsManager
};
