var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2(
  (target, value) => __defProp22(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp222 = Object.defineProperty;
var __name222 = /* @__PURE__ */ __name22(
  (target, value) => __defProp222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp2222 = Object.defineProperty;
var __name2222 = /* @__PURE__ */ __name222(
  (target, value) => __defProp2222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp22222 = Object.defineProperty;
var __name22222 = /* @__PURE__ */ __name2222(
  (target, value) => __defProp22222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp222222 = Object.defineProperty;
var __name222222 = /* @__PURE__ */ __name22222(
  (target, value) => __defProp222222(target, "name", { value, configurable: true }),
  "__name"
);
import ptBRTranslations from "../locales/pt-BR.json";
import enTranslations from "../locales/en.json";
let translations = ptBRTranslations;
let currentLanguage = "en";
const translationCache = /* @__PURE__ */ new Map();
const availableTranslations = {
  "pt-BR": ptBRTranslations,
  en: enTranslations
};
function loadTranslations(language) {
  if (availableTranslations[language]) {
    translations = availableTranslations[language];
    currentLanguage = language;
    return translations;
  }
  return {};
}
__name(loadTranslations, "loadTranslations");
__name2(loadTranslations, "loadTranslations");
__name22(loadTranslations, "loadTranslations");
__name222(loadTranslations, "loadTranslations");
__name2222(loadTranslations, "loadTranslations");
__name22222(loadTranslations, "loadTranslations");
__name222222(loadTranslations, "loadTranslations");
async function initI18n(language = "en") {
  currentLanguage = language;
  translations = await loadTranslations(language);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", translatePage);
  } else {
    translatePage();
  }
}
__name(initI18n, "initI18n");
__name2(initI18n, "initI18n");
__name22(initI18n, "initI18n");
__name222(initI18n, "initI18n");
__name2222(initI18n, "initI18n");
__name22222(initI18n, "initI18n");
__name222222(initI18n, "initI18n");
async function changeLanguage(language) {
  if (!language || typeof language !== "string") {
    return;
  }
  if (language === currentLanguage) return;
  currentLanguage = language;
  translations = await loadTranslations(language);
  translatePage();
}
__name(changeLanguage, "changeLanguage");
__name2(changeLanguage, "changeLanguage");
__name22(changeLanguage, "changeLanguage");
__name222(changeLanguage, "changeLanguage");
__name2222(changeLanguage, "changeLanguage");
__name22222(changeLanguage, "changeLanguage");
__name222222(changeLanguage, "changeLanguage");
async function syncLanguageWithBackend(language) {
  if (!language || typeof language !== "string") {
    return false;
  }
  await changeLanguage(language);
  if (window.electronAPI && window.electronAPI.i18n) {
    await window.electronAPI.i18n.setLanguage(language);
  }
  return true;
}
__name(syncLanguageWithBackend, "syncLanguageWithBackend");
__name2(syncLanguageWithBackend, "syncLanguageWithBackend");
__name22(syncLanguageWithBackend, "syncLanguageWithBackend");
__name222(syncLanguageWithBackend, "syncLanguageWithBackend");
__name2222(syncLanguageWithBackend, "syncLanguageWithBackend");
__name22222(syncLanguageWithBackend, "syncLanguageWithBackend");
__name222222(syncLanguageWithBackend, "syncLanguageWithBackend");
function t(key, params = {}) {
  const getNestedValue = /* @__PURE__ */ __name222222((obj, path) => {
    return path.split(".").reduce((current, prop) => {
      return current && current[prop] !== void 0 ? current[prop] : void 0;
    }, obj);
  }, "getNestedValue");
  if (key in translations) {
    const value = translations[key];
    if (typeof value !== "string") {
      return key;
    }
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  }
  const nestedValue = getNestedValue(translations, key);
  if (nestedValue !== void 0 && typeof nestedValue === "string") {
    return nestedValue.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  }
  return key;
}
__name(t, "t");
__name2(t, "t");
__name22(t, "t");
__name222(t, "t");
__name2222(t, "t");
__name22222(t, "t");
__name222222(t, "t");
function translatePage() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const translation = t(key);
    if (element.hasAttribute("data-i18n-placeholder")) {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
}
__name(translatePage, "translatePage");
__name2(translatePage, "translatePage");
__name22(translatePage, "translatePage");
__name222(translatePage, "translatePage");
__name2222(translatePage, "translatePage");
__name22222(translatePage, "translatePage");
__name222222(translatePage, "translatePage");
async function reloadTranslations() {
  translationCache.clear();
  translations = await loadTranslations(currentLanguage);
  translatePage();
}
__name(reloadTranslations, "reloadTranslations");
__name2(reloadTranslations, "reloadTranslations");
__name22(reloadTranslations, "reloadTranslations");
__name222(reloadTranslations, "reloadTranslations");
__name2222(reloadTranslations, "reloadTranslations");
__name22222(reloadTranslations, "reloadTranslations");
__name222222(reloadTranslations, "reloadTranslations");
async function reloadCurrentTranslations() {
  if (!import.meta.env?.DEV) return;
  translationCache.clear();
  await initI18n(currentLanguage);
  await translatePage();
}
__name(reloadCurrentTranslations, "reloadCurrentTranslations");
__name2(reloadCurrentTranslations, "reloadCurrentTranslations");
__name22(reloadCurrentTranslations, "reloadCurrentTranslations");
__name222(reloadCurrentTranslations, "reloadCurrentTranslations");
__name2222(reloadCurrentTranslations, "reloadCurrentTranslations");
__name22222(reloadCurrentTranslations, "reloadCurrentTranslations");
__name222222(reloadCurrentTranslations, "reloadCurrentTranslations");
if (import.meta.hot) {
  import.meta.hot.accept(["../locales/pt-BR.json", "../locales/en.json"], (newModules) => {
    if (newModules) {
      newModules.forEach((module, index) => {
        if (module) {
          const languages = ["pt-BR", "en"];
          const language = languages[index];
          if (language) {
            availableTranslations[language] = module.default || module;
          }
        }
      });
    }
    setTimeout(async () => {
      await reloadCurrentTranslations();
    }, 100);
  });
  import.meta.hot.accept();
  window.reloadTranslations = reloadCurrentTranslations;
}
window.i18nHot = {
  initI18n,
  changeLanguage,
  syncLanguageWithBackend,
  t,
  translatePage,
  reloadTranslations,
  get currentLanguage() {
    return currentLanguage;
  }
};
export {
  changeLanguage,
  currentLanguage,
  initI18n,
  reloadTranslations,
  syncLanguageWithBackend,
  t,
  translatePage
};
