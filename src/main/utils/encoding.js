const require_encoding = module => {
  const { execSync } = require('node:child_process');
  function setupUTF8Encoding() {
    if (process.platform !== 'win32') {
      return;
    }
    execSync('chcp 65001 >nul 2>&1', { stdio: 'ignore' });
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
    return true;
  }
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
  module.exports = {
    setupUTF8Encoding,
    convertEmojisToText,
  };
};
const encoding_default = require_encoding();
export { encoding_default as default };
