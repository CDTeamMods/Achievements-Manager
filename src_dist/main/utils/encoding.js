"use strict";

var _require = require('child_process'),
  execSync = _require.execSync;
function setupUTF8Encoding() {
  if (process.platform !== 'win32') {
    return;
  }
  try {
    execSync('chcp 65001 >nul 2>&1', {
      stdio: 'ignore'
    });
    process.env.CHCP = '65001';
    process.env.LANG = 'pt_BR.UTF-8';
    process.env.LC_ALL = 'pt_BR.UTF-8';
    process.env.LC_CTYPE = 'pt_BR.UTF-8';
    if (process.stdout && typeof process.stdout.setEncoding === 'function') {
      process.stdout.setEncoding('utf8');
    }
    if (process.stderr && typeof process.stderr.setEncoding === 'function') {
      process.stderr.setEncoding('utf8');
    }
    console.log('[OK] Codificacao UTF-8 configurada com sucesso');
    return true;
  } catch (error) {
    console.warn('[WARN] Erro ao configurar codificacao UTF-8:', error.message);
    return false;
  }
}
function convertEmojisToText(message) {
  if (typeof message !== 'string') return message;
  return message.replace(/✅/g, '[OK]').replace(/⚠️/g, '[WARN]').replace(/❌/g, '[ERROR]').replace(/🔧/g, '[CONFIG]').replace(/🔄/g, '[RELOAD]').replace(/🧹/g, '[CLEANUP]').replace(/📁/g, '[FOLDER]').replace(/🎯/g, '[TARGET]').replace(/🚀/g, '[START]').replace(/💾/g, '[SAVE]').replace(/🔍/g, '[SEARCH]').replace(/📊/g, '[STATS]').replace(/🎮/g, '[GAME]').replace(/🏆/g, '[ACHIEVEMENT]').replace(/⭐/g, '[STAR]').replace(/🔗/g, '[LINK]').replace(/📝/g, '[NOTE]').replace(/🎨/g, '[THEME]').replace(/🌐/g, '[WEB]').replace(/📱/g, '[MOBILE]').replace(/💻/g, '[DESKTOP]').replace(/🔒/g, '[SECURE]').replace(/🔓/g, '[UNLOCK]').replace(/⚡/g, '[FAST]').replace(/🎪/g, '[EVENT]').replace(/🎭/g, '[MASK]').replace(/🎪/g, '[CIRCUS]');
}
function setupConsoleUTF8() {}
module.exports = {
  setupUTF8Encoding: setupUTF8Encoding,
  setupConsoleUTF8: setupConsoleUTF8,
  convertEmojisToText: convertEmojisToText
};