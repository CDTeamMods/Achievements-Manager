/**
 * Sistema de i18n com suporte a Hot Module Replacement (HMR)
 * Este módulo permite que as traduções sejam atualizadas em tempo real durante o desenvolvimento
 */

// Imports estáticos das traduções
import ptBRTranslations from '../locales/pt-BR.json';
import enTranslations from '../locales/en.json';

// Traduções atuais - inicializar com pt-BR por padrão
let translations = ptBRTranslations;
let currentLanguage = 'en';

// Cache das traduções carregadas
const translationCache = new Map();

// Mapa de traduções disponíveis
const availableTranslations = {
  'pt-BR': ptBRTranslations,
  en: enTranslations,
};
/**
 * Carrega as traduções de um idioma específico
 * @param {string} language - Código do idioma (ex: 'pt-BR', 'en')
 */
function loadTranslations(language) {
  if (availableTranslations[language]) {
    translations = availableTranslations[language];
    currentLanguage = language;
    return translations;
  }
  return {};
}

/**
 * Inicializa o sistema de i18n
 * @param {string} language - Idioma inicial
 */
async function initI18n(language = 'en') {
  try {
    currentLanguage = language;
    translations = await loadTranslations(language);

    // Aplicar traduções na página atual
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', translatePage);
    } else {
      translatePage();
    }
  } catch (error) {

  }
}

/**
 * Muda o idioma atual
 * @param {string} language - Novo idioma
 */
async function changeLanguage(language) {
  // Validar se o language é válido
  if (!language || typeof language !== 'string') {

    return;
  }

  if (language === currentLanguage) return;

  currentLanguage = language;
  translations = await loadTranslations(language);

  // Aplica as traduções na página
  translatePage();
}

/**
 * Sincroniza idioma com o backend e aplica traduções imediatamente
 * @param {string} language - Novo idioma
 */
async function syncLanguageWithBackend(language) {
  try {
    // Validar se o language é válido antes de sincronizar
    if (!language || typeof language !== 'string') {

      return false;
    }

    // Primeiro, aplicar no frontend imediatamente
    await changeLanguage(language);

    // Depois, sincronizar com o backend se disponível
    if (window.electronAPI && window.electronAPI.i18n) {
      await window.electronAPI.i18n.setLanguage(language);
    }

    return true;
  } catch (error) {

    return false;
  }
}

/**
 * Obtém uma tradução
 * @param {string} key - Chave da tradução
 * @param {Object} params - Parâmetros para interpolação
 * @returns {string} - Texto traduzido
 */
function t(key, params = {}) {
  // Helper function to get nested value from object using dot notation
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, prop) => {
      return current && current[prop] !== undefined ? current[prop] : undefined;
    }, obj);
  };

  // Primeiro tenta busca direta (para compatibilidade com chaves flat)
  if (key in translations) {
    const value = translations[key];

    if (typeof value !== 'string') {
      return key;
    }

    // Interpolação de parâmetros
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  }

  // Depois tenta busca aninhada usando dot notation
  const nestedValue = getNestedValue(translations, key);
  if (nestedValue !== undefined && typeof nestedValue === 'string') {
    // Interpolação de parâmetros
    return nestedValue.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  }

  // Se não encontrou, retorna a chave
  return key;
}

/**
 * Aplica traduções em todos os elementos com data-i18n
 */
function translatePage() {
  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach((element, index) => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);

    if (element.hasAttribute('data-i18n-placeholder')) {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
}

/**
 * Recarrega as traduções (útil para desenvolvimento)
 */
async function reloadTranslations() {
  // Limpa o cache
  translationCache.clear();

  // Recarrega as traduções do idioma atual
  translations = await loadTranslations(currentLanguage);
  translatePage();
}

// Sistema simplificado para recarregar traduções em desenvolvimento
async function reloadCurrentTranslations() {
  if (!import.meta.env?.DEV) return;

  try {
    // Limpar cache para forçar recarregamento
    translationCache.clear();

    // Recarregar traduções do idioma atual
    await initI18n(currentLanguage);

    // Aplicar traduções na página
    await translatePage();
  } catch (error) {

  }
}

// Configuração do Hot Module Replacement (HMR) para desenvolvimento
if (import.meta.hot) {
  // Aceitar atualizações dos arquivos de tradução
  import.meta.hot.accept(['../locales/pt-BR.json', '../locales/en.json'], newModules => {
    // Atualizar as traduções disponíveis com os novos módulos
    if (newModules) {
      newModules.forEach((module, index) => {
        if (module) {
          const languages = ['pt-BR', 'en'];
          const language = languages[index];
          if (language) {
            availableTranslations[language] = module.default || module;
          }
        }
      });
    }

    // Recarregar traduções após um pequeno delay
    setTimeout(async () => {
      await reloadCurrentTranslations();
    }, 100);
  });

  // Aceitar atualizações deste módulo
  import.meta.hot.accept();

  // Expor função global para recarregar traduções manualmente
  window.reloadTranslations = reloadCurrentTranslations;
}

// Exporta as funções públicas
export {
  initI18n,
  changeLanguage,
  syncLanguageWithBackend,
  t,
  translatePage,
  reloadTranslations,
  currentLanguage,
};

// Compatibilidade com o sistema existente
window.i18nHot = {
  initI18n,
  changeLanguage,
  syncLanguageWithBackend,
  t,
  translatePage,
  reloadTranslations,
  get currentLanguage() {
    return currentLanguage;
  },
};
