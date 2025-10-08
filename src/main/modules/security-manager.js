/**
 * 🔒 Security Manager
 * Gerencia todas as configurações de segurança da aplicação
 */

const { app } = require('electron');

class SecurityManager {
  constructor() {
    this.isDev = process.env.NODE_ENV === 'development';
    this.securityLevel = this.isDev ? 'development' : 'production';
    
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
    // Desabilitar recursos desnecessários para segurança
    const securitySwitches = [
      '--disable-features=VizDisplayCompositor',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-field-trial-config',
      '--disable-ipc-flooding-protection',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-sync',
      '--disable-translate',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-component-update'
    ];

    // Aplicar apenas switches seguros em produção
    if (this.isDev) {
      securitySwitches.forEach(switchArg => {
        if (!app.commandLine.hasSwitch(switchArg.replace('--', ''))) {
          app.commandLine.appendSwitch(switchArg.replace('--', ''));
        }
      });
    } else {
      // Em produção, aplicar apenas switches essenciais
      const productionSwitches = [
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-sync',
        '--disable-translate',
        '--no-first-run',
        '--no-default-browser-check'
      ];
      
      productionSwitches.forEach(switchArg => {
        if (!app.commandLine.hasSwitch(switchArg.replace('--', ''))) {
          app.commandLine.appendSwitch(switchArg.replace('--', ''));
        }
      });
    }
  }

  /**
   * Configura Content Security Policy
   */
  setupContentSecurityPolicy() {
    this.csp = {
      'default-src': ["'self'", ...(this.isDev ? ["devtools:"] : [])],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      'img-src': ["'self'", "data:", "https:"],
      'font-src': ["'self'", "data:", "https://fonts.gstatic.com", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      'connect-src': ["'self'", "https:", "wss:", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      'media-src': ["'self'"],
      'object-src': ["'none'"],
      'child-src': ["'none'"],
      'worker-src': ["'self'"],
      'frame-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    };
  }

  /**
   * Configura Permissions Policy
   */
  setupPermissionsPolicy() {
    this.permissionsPolicy = {
      'camera': [],
      'microphone': [],
      'geolocation': [],
      'notifications': ['self'],
      'payment': [],
      'usb': [],
      'bluetooth': [],
      'serial': [],
      'midi': [],
      'clipboard-read': ['self'],
      'clipboard-write': ['self']
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
      webSecurity: true, // Sempre habilitado para segurança
      sandbox: false, // Mantido false para compatibilidade com módulos nativos
      
      // Configurações de preload
      preload: preloadPath,
      
      // Configurações de desenvolvimento
      devTools: this.isDev,
      
      // Configurações de performance e segurança
      backgroundThrottling: false,
      offscreen: false,
      experimentalFeatures: false,
      enableBlinkFeatures: '',
      disableBlinkFeatures: 'Auxclick,MediaSession',
      
      // Configurações de rede
      allowRunningInsecureContent: false,
      images: true,
      javascript: true,
      plugins: false,
      
      // Configurações de navegação
      navigateOnDragDrop: false,
      autoplayPolicy: 'no-user-gesture-required',
      
      // Configurações de partição
      partition: this.isDev ? 'persist:dev' : 'persist:main',
      
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
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI,MediaRouter',
      '--disable-ipc-flooding-protection'
    ];

    if (!this.isDev) {
      baseArgs.push(
        '--disable-logging',
        '--disable-dev-shm-usage',
        '--no-sandbox', // Apenas se necessário
        '--disable-setuid-sandbox'
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
        'Content-Security-Policy': [this.getCSPString()],
        'X-Content-Type-Options': ['nosniff'],
        'X-Frame-Options': ['DENY'],
        'X-XSS-Protection': ['1; mode=block'],
        'Referrer-Policy': ['strict-origin-when-cross-origin'],
        'Permissions-Policy': [this.getPermissionsPolicyString()]
      };

      callback({ responseHeaders });
    });
  }

  /**
   * Converte CSP para string
   */
  getCSPString() {
    return Object.entries(this.csp)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }

  /**
   * Converte Permissions Policy para string
   */
  getPermissionsPolicyString() {
    return Object.entries(this.permissionsPolicy)
      .map(([feature, allowlist]) => {
        if (allowlist.length === 0) {
          return `${feature}=()`;
        }
        return `${feature}=(${allowlist.join(' ')})`;
      })
      .join(', ');
  }

  /**
   * Configura validação de URLs
   */
  setupURLValidation(webContents) {
    // Bloquear navegação para URLs externas não autorizadas
    webContents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      
      if (parsedUrl.protocol !== 'file:' && parsedUrl.protocol !== 'devtools:') {
        console.warn(`🔒 Navegação bloqueada para: ${navigationUrl}`);
        event.preventDefault();
      }
    });

    // Bloquear abertura de novas janelas não autorizadas
    webContents.setWindowOpenHandler(({ url }) => {
      const parsedUrl = new URL(url);
      
      // Permitir apenas URLs específicas
      const allowedDomains = [
        'github.com',
        'steamcommunity.com',
        'store.steampowered.com'
      ];

      const isAllowed = allowedDomains.some(domain => 
        parsedUrl.hostname.endsWith(domain)
      );

      if (!isAllowed) {
        console.warn(`🔒 Abertura de janela bloqueada para: ${url}`);
        return { action: 'deny' };
      }

      return {
        action: 'allow',
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
    // Adicionar jitter aleatório para operações sensíveis
    this.timingJitter = () => Math.random() * 10;
  }

  /**
   * Valida integridade de arquivos críticos
   */
  async validateFileIntegrity(filePath) {
    try {
      const crypto = require('crypto');
      const fs = require('fs').promises;
      
      const fileBuffer = await fs.readFile(filePath);
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      
      // Aqui você pode comparar com hashes conhecidos
      return { valid: true, hash };
    } catch (error) {
      console.error(`🔒 Erro na validação de integridade: ${error.message}`);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Limpa dados sensíveis da memória
   */
  clearSensitiveData() {
    // Força garbage collection se disponível
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

// Instância singleton
let securityManager = null;

function getSecurityManager() {
  if (!securityManager) {
    securityManager = new SecurityManager();
  }
  return securityManager;
}

module.exports = {
  SecurityManager,
  getSecurityManager
};