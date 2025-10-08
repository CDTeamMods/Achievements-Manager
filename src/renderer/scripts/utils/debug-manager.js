/**
 * Debug Manager para Renderer Process - Achievements Manager
 * Versão simplificada que se comunica com o main process via IPC
 */

class RendererDebugManager {
  constructor() {
    // Verificar se DEBUG_TOOLS está habilitado via variável global ou localStorage
    this.isDebugEnabled = this.checkDebugEnabled();
    this.debugLevel = 'info';

    this.init();
  }

  checkDebugEnabled() {
    // Verificar múltiplas fontes para determinar se debug está habilitado
    try {
      // 1. Verificar localStorage
      const localStorageDebug = localStorage.getItem('DEBUG_TOOLS');
      if (localStorageDebug === 'true') return true;

      // 2. Verificar URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('debug') === 'true') return true;

      // 3. Verificar se está em modo desenvolvimento (baseado na URL)
      if (window.location.protocol === 'file:' && window.location.href.includes('src')) {
        return true;
      }

      // 4. Padrão: desabilitado
      return false;
    } catch {
      return false;
    }
  }

  init() {
    // Debug manager inicializado silenciosamente
  }

  /**
   * Verifica se o debug está habilitado
   * @returns {boolean}
   */
  isEnabled() {
    return this.isDebugEnabled;
  }

  /**
   * Log de debug condicional
   * @param {string} level - Nível do log
   * @param {string} message - Mensagem
   * @param {any} data - Dados adicionais
   */
  log(level, message, data = null) {
    if (!this.isDebugEnabled) return;

    const timestamp = new Date().toISOString();
    const prefix = this.getLogPrefix(level);

    // Log interno do debug manager - removido para produção
  }

  /**
   * Log de informação
   * @param {string} message
   * @param {any} data
   */
  info(message, data = null) {
    this.log('info', message, data);
  }

  /**
   * Log de aviso
   * @param {string} message
   * @param {any} data
   */
  warn(message, data = null) {
    this.log('warn', message, data);
  }

  /**
   * Log de erro
   * @param {string} message
   * @param {any} data
   */
  error(message, data = null) {
    this.log('error', message, data);
  }

  /**
   * Log específico para crash reports
   * @param {string} message
   * @param {any} data
   */
  crash(message, data = null) {
    if (this.isDebugEnabled) {
      this.log('crash', `💥 CRASH: ${message}`, data);
    }
  }

  /**
   * Log específico para IPC
   * @param {string} message
   * @param {any} data
   */
  ipc(message, data = null) {
    if (this.isDebugEnabled) {
      this.log('ipc', `📡 IPC: ${message}`, data);
    }
  }

  /**
   * Log específico para sanitização
   * @param {string} message
   * @param {any} data
   */
  sanitize(message, data = null) {
    if (this.isDebugEnabled) {
      this.log('sanitize', `🧹 SANITIZE: ${message}`, data);
    }
  }

  /**
   * Obtém o prefixo do log baseado no nível
   * @param {string} level
   * @returns {string}
   */
  getLogPrefix(level) {
    const prefixes = {
      info: '📝',
      warn: '⚠️',
      error: '❌',
      crash: '💥',
      ipc: '📡',
      sanitize: '🧹',
    };

    return prefixes[level] || '📝';
  }

  /**
   * Ativa/desativa debug em tempo de execução
   * @param {boolean} enabled
   */
  setDebugEnabled(enabled) {
    this.isDebugEnabled = enabled;
    localStorage.setItem('DEBUG_TOOLS', enabled.toString());
    console.log(`🔧 Debug ${enabled ? 'ativado' : 'desativado'} em tempo de execução (renderer)`);
  }

  /**
   * Obtém estatísticas de debug
   * @returns {object}
   */
  getStats() {
    return {
      enabled: this.isDebugEnabled,
      level: this.debugLevel,
      location: window.location.href,
      userAgent: navigator.userAgent,
    };
  }
}

// Instância singleton
let debugManager = null;

/**
 * Obtém a instância do Debug Manager para renderer
 * @returns {RendererDebugManager}
 */
export function getDebugManager() {
  if (!debugManager) {
    debugManager = new RendererDebugManager();
  }
  return debugManager;
}

// Exportar a classe
export { RendererDebugManager };

// Disponibilizar globalmente para compatibilidade
window.DebugManager = RendererDebugManager;
window.getDebugManager = getDebugManager;
