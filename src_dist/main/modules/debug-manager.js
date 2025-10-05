"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DebugManager = function () {
  function DebugManager() {
    _classCallCheck(this, DebugManager);
    this.isDebugEnabled = process.env.DEBUG_TOOLS === 'true';
    this.debugLevel = process.env.DEBUG_LEVEL || 'info';
    this.init();
  }
  return _createClass(DebugManager, [{
    key: "init",
    value: function init() {
      if (this.isDebugEnabled) {}
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this.isDebugEnabled;
    }
  }, {
    key: "log",
    value: function log(level, message) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (!this.isDebugEnabled) return;
    }
  }, {
    key: "info",
    value: function info(message) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.log('info', message, data);
    }
  }, {
    key: "warn",
    value: function warn(message) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.log('warn', message, data);
    }
  }, {
    key: "error",
    value: function error(message) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.log('error', message, data);
    }
  }, {
    key: "verbose",
    value: function verbose(message) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (this.debugLevel === 'verbose') {
        this.log('verbose', message, data);
      }
    }
  }, {
    key: "crash",
    value: function crash(message) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (this.isDebugEnabled) {
        this.log('crash', "\uD83D\uDCA5 CRASH: ".concat(message), data);
      }
    }
  }, {
    key: "ipc",
    value: function ipc(message) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (this.isDebugEnabled) {
        this.log('ipc', "\uD83D\uDCE1 IPC: ".concat(message), data);
      }
    }
  }, {
    key: "sanitize",
    value: function sanitize(message) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (this.isDebugEnabled) {
        this.log('sanitize', "\uD83E\uDDF9 SANITIZE: ".concat(message), data);
      }
    }
  }, {
    key: "getLogPrefix",
    value: function getLogPrefix(level) {
      var prefixes = {
        info: '📝',
        warn: '⚠️',
        error: '❌',
        verbose: '🔍',
        crash: '💥',
        ipc: '📡',
        sanitize: '🧹'
      };
      return prefixes[level] || '📝';
    }
  }, {
    key: "setDebugEnabled",
    value: function setDebugEnabled(enabled) {
      this.isDebugEnabled = enabled;
      console.log("\uD83D\uDD27 Debug ".concat(enabled ? 'ativado' : 'desativado', " em tempo de execu\xE7\xE3o"));
    }
  }, {
    key: "setDebugLevel",
    value: function setDebugLevel(level) {
      this.debugLevel = level;
      this.info("N\xEDvel de debug alterado para: ".concat(level));
    }
  }, {
    key: "getStats",
    value: function getStats() {
      return {
        enabled: this.isDebugEnabled,
        level: this.debugLevel,
        environment: process.env.NODE_ENV,
        debugTools: process.env.DEBUG_TOOLS
      };
    }
  }]);
}();
var debugManager = null;
function getDebugManager() {
  if (!debugManager) {
    debugManager = new DebugManager();
  }
  return debugManager;
}
module.exports = {
  DebugManager: DebugManager,
  getDebugManager: getDebugManager
};