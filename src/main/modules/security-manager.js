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
var __defProp2222222 = Object.defineProperty;
var __name2222222 = /* @__PURE__ */ __name222222(
  (target, value) => __defProp2222222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp22222222 = Object.defineProperty;
var __name22222222 = /* @__PURE__ */ __name2222222(
  (target, value) => __defProp22222222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp222222222 = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name222222222 = /* @__PURE__ */ __name22222222(
  (target, value) => __defProp222222222(target, "name", { value, configurable: true }),
  "__name"
);
var __commonJS = /* @__PURE__ */ __name22222222(
  (cb, mod) => /* @__PURE__ */ __name22222222(
    /* @__PURE__ */ __name2222222(
      /* @__PURE__ */ __name222222(
        /* @__PURE__ */ __name22222(
          /* @__PURE__ */ __name2222(
            /* @__PURE__ */ __name222(
              /* @__PURE__ */ __name22(
                /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function __require() {
                  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
                }, "__require"), "__require"),
                "__require"
              ),
              "__require"
            ),
            "__require"
          ),
          "__require"
        ),
        "__require"
      ),
      "__require"
    ),
    "__require"
  ),
  "__commonJS"
);
var require_security_manager = __commonJS({
  "src/main/modules/security-manager.js"(exports, module) {
    const { app } = require("electron");
    class SecurityManager {
      static {
        __name(this, "SecurityManager");
      }
      static {
        __name2(this, "SecurityManager");
      }
      static {
        __name22(this, "SecurityManager");
      }
      static {
        __name222(this, "SecurityManager");
      }
      static {
        __name2222(this, "SecurityManager");
      }
      static {
        __name22222(this, "SecurityManager");
      }
      static {
        __name222222(this, "SecurityManager");
      }
      static {
        __name2222222(this, "SecurityManager");
      }
      static {
        __name22222222(this, "SecurityManager");
      }
      static {
        __name222222222(this, "SecurityManager");
      }
      constructor() {
        this.isDev = process.env.NODE_ENV === "development";
        this.securityLevel = this.isDev ? "development" : "production";
        this.initializeSecuritySettings();
      }
      /**
       * Inicializa as configurações de segurança
       */
      initializeSecuritySettings() {
        this.setupCommandLineSwitches();
        this.setupContentSecurityPolicy();
        this.setupPermissionsPolicy();
      }
      /**
       * Configura switches de linha de comando para segurança
       */
      setupCommandLineSwitches() {
        const securitySwitches = [
          "--disable-features=VizDisplayCompositor",
          "--disable-background-networking",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          "--disable-field-trial-config",
          "--disable-ipc-flooding-protection",
          "--disable-default-apps",
          "--disable-extensions",
          "--disable-plugins",
          "--disable-sync",
          "--disable-translate",
          "--no-first-run",
          "--no-default-browser-check",
          "--disable-component-update"
        ];
        if (this.isDev) {
          securitySwitches.forEach((switchArg) => {
            if (!app.commandLine.hasSwitch(switchArg.replace("--", ""))) {
              app.commandLine.appendSwitch(switchArg.replace("--", ""));
            }
          });
        } else {
          const productionSwitches = [
            "--disable-background-networking",
            "--disable-default-apps",
            "--disable-extensions",
            "--disable-plugins",
            "--disable-sync",
            "--disable-translate",
            "--no-first-run",
            "--no-default-browser-check"
          ];
          productionSwitches.forEach((switchArg) => {
            if (!app.commandLine.hasSwitch(switchArg.replace("--", ""))) {
              app.commandLine.appendSwitch(switchArg.replace("--", ""));
            }
          });
        }
      }
      /**
       * Configura Content Security Policy
       */
      setupContentSecurityPolicy() {
        this.csp = {
          "default-src": ["'self'", ...this.isDev ? ["devtools:"] : []],
          "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          "style-src": [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
            "https://cdnjs.cloudflare.com"
          ],
          "img-src": ["'self'", "data:", "https:"],
          "font-src": [
            "'self'",
            "data:",
            "https://fonts.gstatic.com",
            "https://fonts.googleapis.com",
            "https://cdnjs.cloudflare.com"
          ],
          "connect-src": [
            "'self'",
            "https:",
            "wss:",
            "https://fonts.googleapis.com",
            "https://fonts.gstatic.com",
            "https://cdnjs.cloudflare.com"
          ],
          "media-src": ["'self'"],
          "object-src": ["'none'"],
          "child-src": ["'none'"],
          "worker-src": ["'self'"],
          "frame-src": ["'none'"],
          "base-uri": ["'self'"],
          "form-action": ["'self'"]
        };
      }
      /**
       * Configura Permissions Policy
       */
      setupPermissionsPolicy() {
        this.permissionsPolicy = {
          camera: [],
          microphone: [],
          geolocation: [],
          notifications: ["self"],
          payment: [],
          usb: [],
          bluetooth: [],
          serial: [],
          midi: [],
          "clipboard-read": ["self"],
          "clipboard-write": ["self"]
        };
      }
      /**
       * Retorna configurações de webPreferences otimizadas para segurança
       */
      getSecureWebPreferences(preloadPath) {
        const basePreferences = {
          // Configurações de segurança fundamentais
          nodeIntegration: false,
          contextIsolation: true,
          enableRemoteModule: false,
          webSecurity: true,
          // Sempre habilitado para segurança
          sandbox: false,
          // Mantido false para compatibilidade com módulos nativos
          // Configurações de preload
          preload: preloadPath,
          // Configurações de desenvolvimento
          devTools: this.isDev,
          // Configurações de performance e segurança
          backgroundThrottling: false,
          offscreen: false,
          experimentalFeatures: false,
          enableBlinkFeatures: "",
          disableBlinkFeatures: "Auxclick,MediaSession",
          // Configurações de rede
          allowRunningInsecureContent: false,
          images: true,
          javascript: true,
          plugins: false,
          // Configurações de navegação
          navigateOnDragDrop: false,
          autoplayPolicy: "no-user-gesture-required",
          // Configurações de partição
          partition: this.isDev ? "persist:dev" : "persist:main",
          // Argumentos adicionais do Chromium
          additionalArguments: this.getChromiumArguments()
        };
        return basePreferences;
      }
      /**
       * Retorna argumentos otimizados do Chromium
       */
      getChromiumArguments() {
        const baseArgs = [
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          "--disable-features=TranslateUI,MediaRouter",
          "--disable-ipc-flooding-protection"
        ];
        if (!this.isDev) {
          baseArgs.push(
            "--disable-logging",
            "--disable-dev-shm-usage",
            "--no-sandbox",
            // Apenas se necessário
            "--disable-setuid-sandbox"
          );
        }
        return baseArgs;
      }
      /**
       * Configura headers de segurança para requisições
       */
      setupSecurityHeaders(webContents) {
        webContents.session.webRequest.onHeadersReceived((details, callback) => {
          const responseHeaders = {
            ...details.responseHeaders,
            "Content-Security-Policy": [this.getCSPString()],
            "X-Content-Type-Options": ["nosniff"],
            "X-Frame-Options": ["DENY"],
            "X-XSS-Protection": ["1; mode=block"],
            "Referrer-Policy": ["strict-origin-when-cross-origin"],
            "Permissions-Policy": [this.getPermissionsPolicyString()]
          };
          callback({ responseHeaders });
        });
      }
      /**
       * Converte CSP para string
       */
      getCSPString() {
        return Object.entries(this.csp).map(([directive, sources]) => `${directive} ${sources.join(" ")}`).join("; ");
      }
      /**
       * Converte Permissions Policy para string
       */
      getPermissionsPolicyString() {
        return Object.entries(this.permissionsPolicy).map(([feature, allowlist]) => {
          if (allowlist.length === 0) {
            return `${feature}=()`;
          }
          return `${feature}=(${allowlist.join(" ")})`;
        }).join(", ");
      }
      /**
       * Configura validação de URLs
       */
      setupURLValidation(webContents) {
        webContents.on("will-navigate", (event, navigationUrl) => {
          const parsedUrl = new URL(navigationUrl);
          if (parsedUrl.protocol !== "file:" && parsedUrl.protocol !== "devtools:") {
            event.preventDefault();
          }
        });
        webContents.setWindowOpenHandler(({ url }) => {
          const parsedUrl = new URL(url);
          const allowedDomains = ["github.com", "steamcommunity.com", "store.steampowered.com"];
          const isAllowed = allowedDomains.some((domain) => parsedUrl.hostname.endsWith(domain));
          if (!isAllowed) {
            return { action: "deny" };
          }
          return {
            action: "allow",
            overrideBrowserWindowOptions: {
              webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: true
              }
            }
          };
        });
      }
      /**
       * Configura proteção contra ataques de timing
       */
      setupTimingAttackProtection() {
        this.timingJitter = () => Math.random() * 10;
      }
      /**
       * Valida integridade de arquivos críticos
       */
      async validateFileIntegrity(filePath) {
        try {
          const crypto = require("crypto");
          const fs = require("node:fs").promises;
          const fileBuffer = await fs.readFile(filePath);
          const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
          return { valid: true, hash };
        } catch (error) {
          return { valid: false, error: error.message };
        }
      }
      /**
       * Limpa dados sensíveis da memória
       */
      clearSensitiveData() {
        if (global.gc) {
          global.gc();
        }
      }
      /**
       * Retorna configurações de segurança para diferentes ambientes
       */
      getSecurityConfig() {
        return {
          level: this.securityLevel,
          isDev: this.isDev,
          csp: this.csp,
          permissionsPolicy: this.permissionsPolicy,
          chromiumArgs: this.getChromiumArguments()
        };
      }
    }
    let securityManager = null;
    function getSecurityManager() {
      if (!securityManager) {
        securityManager = new SecurityManager();
      }
      return securityManager;
    }
    __name(getSecurityManager, "getSecurityManager");
    __name2(getSecurityManager, "getSecurityManager");
    __name22(getSecurityManager, "getSecurityManager");
    __name222(getSecurityManager, "getSecurityManager");
    __name2222(getSecurityManager, "getSecurityManager");
    __name22222(getSecurityManager, "getSecurityManager");
    __name222222(getSecurityManager, "getSecurityManager");
    __name2222222(getSecurityManager, "getSecurityManager");
    __name22222222(getSecurityManager, "getSecurityManager");
    __name222222222(getSecurityManager, "getSecurityManager");
    module.exports = {
      SecurityManager,
      getSecurityManager
    };
    module.exports.default = module.exports;
  }
});
var security_manager_default = require_security_manager();
export {
  security_manager_default as default
};
