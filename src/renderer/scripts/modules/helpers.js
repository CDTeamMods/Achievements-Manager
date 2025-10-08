var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
class HelpersManager {
  static {
    __name(this, "HelpersManager");
  }
  static {
    __name2(this, "HelpersManager");
  }
  constructor(app) {
    this.app = app;
  }
  // Função de tradução principal usando o novo sistema i18n-hot
  t(key, params = {}) {
    if (window.i18nHot && window.i18nHot.t) {
      return window.i18nHot.t(key, params);
    }
    return key;
  }
  // Função para traduzir toda a página processando elementos data-i18n
  translatePage() {
    const elementsToTranslate = document.querySelectorAll("[data-i18n]");
    for (const element of elementsToTranslate) {
      this.translateElement(element);
    }
    const elementsWithPlaceholder = document.querySelectorAll("[data-i18n-placeholder]");
    for (const element of elementsWithPlaceholder) {
      this.translatePlaceholder(element);
    }
  }
  // Função para traduzir placeholder de um elemento específico
  translatePlaceholder(element) {
    const key = element.getAttribute("data-i18n-placeholder");
    if (!key) return;
    const translation = this.t(key);
    if (translation && translation !== key) {
      element.setAttribute("placeholder", translation);
    }
  }
  // Função para traduzir um elemento específico
  translateElement(element, key = null) {
    const translationKey = key || element.getAttribute("data-i18n");
    const translation = this.t(translationKey);
    if (translation && translation !== translationKey) {
      const childNodes = Array.from(element.childNodes).filter(
        (node) => node.nodeType !== Node.TEXT_NODE
      );
      element.textContent = translation;
      childNodes.forEach((child) => element.appendChild(child));
    }
  }
  // Função utilitária para verificações da API do Electron
  isElectronAPIAvailable(methodName = null) {
    if (!window.electronAPI) {
      return false;
    }
    if (methodName) {
      const parts = methodName.split(".");
      let current = window.electronAPI;
      for (const part of parts) {
        if (!current[part]) {
          return false;
        }
        current = current[part];
      }
      return current && typeof current === "object";
    }
    return true;
  }
  // Função para executar métodos da API com verificações de segurança
  async safeElectronAPICall(methodName, ...args) {
    if (!window.electronAPI) {
      throw new Error("ElectronAPI n\xE3o est\xE1 dispon\xEDvel");
    }
    const parts = methodName.split(".");
    let method = window.electronAPI;
    for (const part of parts) {
      if (!method[part]) {
        throw new Error(`M\xE9todo ${methodName} n\xE3o est\xE1 dispon\xEDvel`);
      }
      method = method[part];
    }
    if (typeof method !== "function") {
      throw new Error(`${methodName} n\xE3o \xE9 uma fun\xE7\xE3o`);
    }
    return await method(...args);
  }
  async simulateLoading() {
    const progressBar = document.getElementById("loadingProgress");
    const settingsText = this.t("loading.settings");
    const componentsText = this.t("loading.components");
    const apisText = this.t("loading.apis");
    const interfaceText = this.t("loading.interface");
    const completeText = this.t("loading.complete");
    const steps = [
      { progress: 20, text: settingsText },
      { progress: 40, text: componentsText },
      { progress: 60, text: apisText },
      { progress: 80, text: interfaceText },
      { progress: 100, text: completeText }
    ];
    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (progressBar) {
        progressBar.style.width = `${step.progress}%`;
      }
      const loadingText = document.querySelector(".loading-text p");
      if (loadingText) {
        loadingText.textContent = step.text;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  showInterface() {
    if (!this.app.isSetupComplete) {
      this.showSetupWizard();
      return;
    }
    const setupWizard = document.getElementById("setupWizard");
    const mainApp = document.getElementById("mainApp");
    if (setupWizard) {
      setupWizard.classList.add("hidden");
    }
    if (mainApp) {
      mainApp.classList.remove("hidden");
    }
    setTimeout(async () => {
      if (this.app.modules.navigation) {
        this.app.modules.navigation.currentPage = null;
        await this.app.modules.navigation.navigateTo("dashboard");
      }
    }, 150);
  }
  showSetupWizard() {
    const setupWizard = document.getElementById("setupWizard");
    const mainApp = document.getElementById("mainApp");
    if (setupWizard) {
      setupWizard.classList.remove("hidden");
    }
    if (mainApp) {
      mainApp.classList.add("hidden");
    }
  }
  showNotification(message, type = "info", duration = 3e3) {
    const notification = document.createElement("div");
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
    let container = document.getElementById("notificationsContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "notificationsContainer";
      container.className = "notifications-container";
      document.body.appendChild(container);
    }
    container.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);
    const autoClose = setTimeout(() => {
      this.closeNotification(notification);
    }, duration);
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
      clearTimeout(autoClose);
      this.closeNotification(notification);
    });
  }
  closeNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
  getNotificationIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle"
    };
    return icons[type] || "info-circle";
  }
  showSuccess(message) {
    this.showNotification(message, "success", 3e3);
  }
  showWarning(message) {
    this.showNotification(message, "warning", 4e3);
  }
  showError(message, duration = 5e3) {
    this.showNotification(message, "error", duration);
  }
  // Utilitários de formatação
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
  formatDate(date) {
    if (!date) return "-";
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(date));
  }
  formatPercentage(value, total) {
    if (!total || total === 0) return "0%";
    return (value / total * 100).toFixed(1) + "%";
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
  createElement(tag, className = "", content = "") {
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
    return /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function executedFunction(...args) {
      const later = /* @__PURE__ */ __name2(() => {
        clearTimeout(timeout);
        func(...args);
      }, "later");
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }, "executedFunction"), "executedFunction");
  }
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}
window.HelpersManager = HelpersManager;
export {
  HelpersManager
};
