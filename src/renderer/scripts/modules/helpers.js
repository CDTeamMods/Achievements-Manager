// Módulo de Utilitários e Helpers
class HelpersManager {
  constructor(app) {
    this.app = app;
  }

  // Função de tradução principal usando o novo sistema i18n-hot
  t(key, params = {}) {
    // Usar a função global do i18n-hot se disponível
    if (window.i18nHot && window.i18nHot.t) {
      return window.i18nHot.t(key, params);
    }
    // Fallback para a chave se o sistema não estiver disponível
    return key;
  }

  // Função para traduzir toda a página processando elementos data-i18n
  translatePage() {
    try {
      // Buscar todos os elementos com data-i18n
      const elementsToTranslate = document.querySelectorAll('[data-i18n]');

      // Traduzir cada elemento
      for (const element of elementsToTranslate) {
        this.translateElement(element);
      }

      // Buscar todos os elementos com data-i18n-placeholder
      const elementsWithPlaceholder = document.querySelectorAll('[data-i18n-placeholder]');

      // Traduzir placeholders
      for (const element of elementsWithPlaceholder) {
        this.translatePlaceholder(element);
      }
    } catch (error) {
      // Log removido para evitar dependência circular com DebugManager
    }
  }

  // Função para traduzir placeholder de um elemento específico
  translatePlaceholder(element) {
    const key = element.getAttribute('data-i18n-placeholder');
    if (!key) return;

    try {
      // Obter tradução
      const translation = this.t(key);

      if (translation && translation !== key) {
        element.setAttribute('placeholder', translation);
      }
    } catch (error) {
      // Log removido para evitar dependência circular com DebugManager
    }
  }

  // Função para traduzir um elemento específico
  translateElement(element, key = null) {
    try {
      const translationKey = key || element.getAttribute('data-i18n');
      const translation = this.t(translationKey);

      if (translation && translation !== translationKey) {
        // Preservar nós filhos se existirem
        const childNodes = Array.from(element.childNodes).filter(
          node => node.nodeType !== Node.TEXT_NODE
        );
        element.textContent = translation;

        // Recriar nós filhos se existirem
        childNodes.forEach(child => element.appendChild(child));
      }
    } catch (error) {
      // Log removido para evitar dependência circular com DebugManager
    }
  }

  // Função utilitária para verificações da API do Electron
  isElectronAPIAvailable(methodName = null) {
    try {
      // Verificar se window.electronAPI existe
      if (!window.electronAPI) {
        return false;
      }

      // Se um método específico foi solicitado, verificar se existe
      if (methodName) {
        // Lidar com métodos aninhados (ex: 'api.steam')
        const parts = methodName.split('.');
        let current = window.electronAPI;

        for (const part of parts) {
          if (!current[part]) {
            return false;
          }
          current = current[part];
        }

        // Verificar se o objeto final existe e é um objeto
        return current && typeof current === 'object';
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Função para executar métodos da API com verificações de segurança
  async safeElectronAPICall(methodName, ...args) {
    try {
      if (!window.electronAPI) {
        throw new Error('ElectronAPI não está disponível');
      }

      // Lidar com métodos aninhados (ex: 'i18n.translate')
      const parts = methodName.split('.');
      let method = window.electronAPI;

      for (const part of parts) {
        if (!method[part]) {
          throw new Error(`Método ${methodName} não está disponível`);
        }
        method = method[part];
      }

      if (typeof method !== 'function') {
        throw new Error(`${methodName} não é uma função`);
      }

      return await method(...args);
    } catch (error) {
      throw error;
    }
  }

  async simulateLoading() {
    const progressBar = document.getElementById('loadingProgress');

    // Obter todas as traduções
    const settingsText = this.t('loading.settings');
    const componentsText = this.t('loading.components');
    const apisText = this.t('loading.apis');
    const interfaceText = this.t('loading.interface');
    const completeText = this.t('loading.complete');

    const steps = [
      { progress: 20, text: settingsText },
      { progress: 40, text: componentsText },
      { progress: 60, text: apisText },
      { progress: 80, text: interfaceText },
      { progress: 100, text: completeText },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 300));

      if (progressBar) {
        progressBar.style.width = `${step.progress}%`;
      }

      const loadingText = document.querySelector('.loading-text p');
      if (loadingText) {
        loadingText.textContent = step.text;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  showInterface() {
    // Verificar se o setup foi concluído
    if (!this.app.isSetupComplete) {
      this.showSetupWizard();
      return;
    }

    // Mostrar interface principal
    const setupWizard = document.getElementById('setupWizard');
    const mainApp = document.getElementById('mainApp');

    if (setupWizard) {
      setupWizard.classList.add('hidden');
    }

    if (mainApp) {
      mainApp.classList.remove('hidden');
    }

    // Garantir que a dashboard seja carregada corretamente
    setTimeout(async () => {
      try {
        // Forçar reset do currentPage para garantir carregamento
        if (this.app.modules.navigation) {
          this.app.modules.navigation.currentPage = null;
          await this.app.modules.navigation.navigateTo('dashboard');
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard inicial:', error);
        // Tentar novamente após um delay
        setTimeout(() => {
          if (this.app.modules.navigation) {
            this.app.modules.navigation.currentPage = null;
            this.app.modules.navigation.navigateTo('dashboard');
          }
        }, 500);
      }
    }, 150);
  }

  showSetupWizard() {
    // Mostrar o setup wizard
    const setupWizard = document.getElementById('setupWizard');
    const mainApp = document.getElementById('mainApp');

    if (setupWizard) {
      setupWizard.classList.remove('hidden');
    }

    if (mainApp) {
      mainApp.classList.add('hidden');
    }
  }

  showNotification(message, type = 'info', duration = 3000) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Adicionar ao container de notificações
    let container = document.getElementById('notificationsContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notificationsContainer';
      container.className = 'notifications-container';
      document.body.appendChild(container);
    }

    container.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Configurar fechamento automático
    const autoClose = setTimeout(() => {
      this.closeNotification(notification);
    }, duration);

    // Configurar fechamento manual
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      clearTimeout(autoClose);
      this.closeNotification(notification);
    });
  }

  closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle',
    };
    return icons[type] || 'info-circle';
  }

  showError(message) {
    this.showNotification(message, 'error', 5000);
  }

  showSuccess(message) {
    this.showNotification(message, 'success', 3000);
  }

  showWarning(message) {
    this.showNotification(message, 'warning', 4000);
  }

  showError(message, duration = 5000) {
    this.showNotification(message, 'error', duration);
  }

  // Utilitários de formatação
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date) {
    if (!date) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  formatPercentage(value, total) {
    if (!total || total === 0) return '0%';
    return ((value / total) * 100).toFixed(1) + '%';
  }

  // Utilitários de validação
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Utilitários de DOM
  createElement(tag, className = '', content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
  }

  querySelector(selector) {
    return document.querySelector(selector);
  }

  querySelectorAll(selector) {
    return document.querySelectorAll(selector);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// Exportar para uso global

// Exportar a classe HelpersManager
export { HelpersManager };

// Disponibilizar globalmente para compatibilidade
window.HelpersManager = HelpersManager;
