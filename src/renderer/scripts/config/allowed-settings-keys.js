/**
 * Configuração centralizada das chaves permitidas para configurações
 * Este arquivo centraliza todas as chaves que podem ser salvas nas configurações
 * para evitar duplicação e facilitar manutenção
 */

// Lista completa de chaves permitidas para configurações
export const ALLOWED_SETTINGS_KEYS = [
  // Configurações básicas
  'setupComplete',
  'language',
  'theme',

  // Configurações de interface
  'liteMode',
  'virtualScrolling',

  // Configurações de funcionalidade
  'autoSync',
  'cacheSize',
  'crashReports',
  'performanceMode',

  // Configurações de API e integração
  'apiSource',
  'steamApiKey',
];

/**
 * Verifica se uma chave é permitida
 * @param {string} key - Chave a ser verificada
 * @returns {boolean} - True se a chave é permitida
 */
export function isAllowedSettingsKey(key) {
  return ALLOWED_SETTINGS_KEYS.includes(key);
}

/**
 * Filtra um objeto mantendo apenas as chaves permitidas
 * @param {object} settings - Objeto de configurações
 * @returns {object} - Objeto filtrado com apenas chaves permitidas
 */
export function filterAllowedSettings(settings) {
  if (!settings || typeof settings !== 'object') {
    return {};
  }

  const filtered = {};
  for (const key of ALLOWED_SETTINGS_KEYS) {
    if (Object.prototype.hasOwnProperty.call(settings, key)) {
      filtered[key] = settings[key];
    }
  }

  return filtered;
}
