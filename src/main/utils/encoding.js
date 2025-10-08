// Utilitário para configuração de encoding UTF-8
const { execSync } = require('node:child_process');

/**
 * Configura a codificação UTF-8 para o console no Windows
 */
function setupUTF8Encoding() {
  if (process.platform !== 'win32') {
    return; // Apenas necessário no Windows
  }

  try {
    // Configurar codepage para UTF-8 no Windows
    execSync('chcp 65001 >nul 2>&1', { stdio: 'ignore' });

    // Configurar variáveis de ambiente
    process.env.CHCP = '65001';
    process.env.LANG = 'pt_BR.UTF-8';
    process.env.LC_ALL = 'pt_BR.UTF-8';
    process.env.LC_CTYPE = 'pt_BR.UTF-8';

    // Configurar stdout e stderr se disponível
    if (process.stdout && typeof process.stdout.setEncoding === 'function') {
      process.stdout.setEncoding('utf8');
    }
    if (process.stderr && typeof process.stderr.setEncoding === 'function') {
      process.stderr.setEncoding('utf8');
    }

    // Usar caracteres ASCII para evitar problemas de codificação
    console.log('[OK] Codificacao UTF-8 configurada com sucesso');
    return true;
  } catch (error) {
    console.warn('[WARN] Erro ao configurar codificacao UTF-8:', error.message);
    return false;
  }
}

/**
 * Função para converter emojis para texto ASCII (sem interceptar console)
 */
function convertEmojisToText(message) {
  if (typeof message !== 'string') return message;

  return message
    .replace(/✅/g, '[OK]')
    .replace(/⚠️/g, '[WARN]')
    .replace(/❌/g, '[ERROR]')
    .replace(/🔧/g, '[CONFIG]')
    .replace(/🔄/g, '[RELOAD]')
    .replace(/🧹/g, '[CLEANUP]')
    .replace(/📁/g, '[FOLDER]')
    .replace(/🎯/g, '[TARGET]')
    .replace(/🚀/g, '[START]')
    .replace(/💾/g, '[SAVE]')
    .replace(/🔍/g, '[SEARCH]')
    .replace(/📊/g, '[STATS]')
    .replace(/🎮/g, '[GAME]')
    .replace(/🏆/g, '[ACHIEVEMENT]')
    .replace(/⭐/g, '[STAR]')
    .replace(/🔗/g, '[LINK]')
    .replace(/📝/g, '[NOTE]')
    .replace(/🎨/g, '[THEME]')
    .replace(/🌐/g, '[WEB]')
    .replace(/📱/g, '[MOBILE]')
    .replace(/💻/g, '[DESKTOP]')
    .replace(/🔒/g, '[SECURE]')
    .replace(/🔓/g, '[UNLOCK]')
    .replace(/⚡/g, '[FAST]')
    .replace(/🎪/g, '[EVENT]')
    .replace(/🎭/g, '[MASK]')
    .replace(/🎪/g, '[CIRCUS]');
}

/**
 * Configuração simplificada do console (sem interceptação)
 */
function setupConsoleUTF8() {
  // Não interceptar mais o console para evitar problemas de serialização IPC
  // Log removido para evitar dependência circular com DebugManager
}

module.exports = {
  setupUTF8Encoding,
  setupConsoleUTF8,
  convertEmojisToText,
};
