/**
 * Debug Manager - Módulo centralizado para controle de debug
 * Controla todos os sistemas de debug da aplicação através da variável DEBUG_TOOLS
 */

class DebugManager {
  constructor() {
    // Configuração padrão: DEBUG_TOOLS = false (desabilitado em produção)
    // Só ativar debug quando DEBUG_TOOLS for explicitamente 'true'
    this.isDebugEnabled = process.env.DEBUG_TOOLS === 'true';
    this.debugLevel = process.env.DEBUG_LEVEL || 'info'; // info, warn, error, verbose

    this.init();
  }

  init() {
    if (this.isDebugEnabled) {
      // Debug Manager inicializado
    }
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
   * @param {string} level - Nível do log (info, warn, error, verbose)
   * @param {string} message - Mensagem
   * @param {any} data - Dados adicionais
   */
  log(level, message, data = null) {
    if (!this.isDebugEnabled) return;

    // Log interno do debug manager
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
   * Log verboso (apenas quando DEBUG_LEVEL=verbose)
   * @param {string} message
   * @param {any} data
   */
  verbose(message, data = null) {
    if (this.debugLevel === 'verbose') {
      this.log('verbose', message, data);
    }
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
      verbose: '🔍',
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
    console.log(`🔧 Debug ${enabled ? 'ativado' : 'desativado'} em tempo de execução`);
  }

  /**
   * Define o nível de debug
   * @param {string} level
   */
  setDebugLevel(level) {
    this.debugLevel = level;
    this.info(`Nível de debug alterado para: ${level}`);
  }

  /**
   * Obtém estatísticas de debug
   * @returns {object}
   */
  getStats() {
    return {
      enabled: this.isDebugEnabled,
      level: this.debugLevel,
      environment: process.env.NODE_ENV,
      debugTools: process.env.DEBUG_TOOLS,
    };
  }
}

// Instância singleton
let debugManager = null;

/**
 * Obtém a instância do Debug Manager
 * @returns {DebugManager}
 */
function getDebugManager() {
  if (!debugManager) {
    debugManager = new DebugManager();
  }
  return debugManager;
}

module.exports = { DebugManager, getDebugManager };
