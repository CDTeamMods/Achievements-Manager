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
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name222 = /* @__PURE__ */ __name22(
  (target, value) => __defProp222(target, "name", { value, configurable: true }),
  "__name"
);
var __commonJS = /* @__PURE__ */ __name22(
  (cb, mod) => /* @__PURE__ */ __name22(
    /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function __require() {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    }, "__require"), "__require"),
    "__require"
  ),
  "__commonJS"
);
var require_encoding = __commonJS({
  "src/main/utils/encoding.js"(exports, module) {
    const { execSync } = require("node:child_process");
    function setupUTF8Encoding() {
      if (process.platform !== "win32") {
        return;
      }
      execSync("chcp 65001 >nul 2>&1", { stdio: "ignore" });
      process.env.CHCP = "65001";
      process.env.LANG = "pt_BR.UTF-8";
      process.env.LC_ALL = "pt_BR.UTF-8";
      process.env.LC_CTYPE = "pt_BR.UTF-8";
      if (process.stdout && typeof process.stdout.setEncoding === "function") {
        process.stdout.setEncoding("utf8");
      }
      if (process.stderr && typeof process.stderr.setEncoding === "function") {
        process.stderr.setEncoding("utf8");
      }
      return true;
    }
    __name(setupUTF8Encoding, "setupUTF8Encoding");
    __name2(setupUTF8Encoding, "setupUTF8Encoding");
    __name22(setupUTF8Encoding, "setupUTF8Encoding");
    __name222(setupUTF8Encoding, "setupUTF8Encoding");
    function convertEmojisToText(message) {
      if (typeof message !== "string") return message;
      return message.replace(/✅/g, "[OK]").replace(/⚠️/g, "[WARN]").replace(/❌/g, "[ERROR]").replace(/🔧/g, "[CONFIG]").replace(/🔄/g, "[RELOAD]").replace(/🧹/g, "[CLEANUP]").replace(/📁/g, "[FOLDER]").replace(/🎯/g, "[TARGET]").replace(/🚀/g, "[START]").replace(/💾/g, "[SAVE]").replace(/🔍/g, "[SEARCH]").replace(/📊/g, "[STATS]").replace(/🎮/g, "[GAME]").replace(/🏆/g, "[ACHIEVEMENT]").replace(/⭐/g, "[STAR]").replace(/🔗/g, "[LINK]").replace(/📝/g, "[NOTE]").replace(/🎨/g, "[THEME]").replace(/🌐/g, "[WEB]").replace(/📱/g, "[MOBILE]").replace(/💻/g, "[DESKTOP]").replace(/🔒/g, "[SECURE]").replace(/🔓/g, "[UNLOCK]").replace(/⚡/g, "[FAST]").replace(/🎪/g, "[EVENT]").replace(/🎭/g, "[MASK]").replace(/🎪/g, "[CIRCUS]");
    }
    __name(convertEmojisToText, "convertEmojisToText");
    __name2(convertEmojisToText, "convertEmojisToText");
    __name22(convertEmojisToText, "convertEmojisToText");
    __name222(convertEmojisToText, "convertEmojisToText");
    function setupConsoleUTF8() {
    }
    __name(setupConsoleUTF8, "setupConsoleUTF8");
    __name2(setupConsoleUTF8, "setupConsoleUTF8");
    __name22(setupConsoleUTF8, "setupConsoleUTF8");
    __name222(setupConsoleUTF8, "setupConsoleUTF8");
    module.exports = {
      setupUTF8Encoding,
      setupConsoleUTF8,
      convertEmojisToText
    };
  }
});
var encoding_default = require_encoding();
export {
  encoding_default as default
};
