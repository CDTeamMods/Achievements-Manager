var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
class EventsManager {
  static {
    __name(this, "EventsManager");
  }
  constructor(app) {
    this.app = app;
  }
  setupEventListeners() {
    document.addEventListener("click", (e) => {
      const navItem = e.target.closest(".nav-item");
      if (navItem) {
        e.preventDefault();
        const page = navItem.getAttribute("href").substring(1);
        this.app.modules.navigation.navigateTo(page);
      }
    });
    if (this.app.isElectron) {
      this.setupWindowControls();
    }
    const sidebarSettingsBtn = document.getElementById("sidebarSettingsBtn");
    if (sidebarSettingsBtn) {
      sidebarSettingsBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await this.app.openSettings();
      });
    }
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.app.modules.navigation.refreshCurrentPage();
      });
    }
    const addGameBtn = document.getElementById("addGameBtn");
    if (addGameBtn) {
      addGameBtn.addEventListener("click", () => {
        this.app.openAddGameModal();
      });
    }
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });
    if (this.app.modules.state && this.app.modules.state.subscribe) {
      this.app.modules.state.subscribe("settings", (settings) => {
        if (this.app.modules.settings) {
          this.app.modules.settings.applyTheme && this.app.modules.settings.applyTheme(settings.theme);
          this.app.modules.settings.applyLiteMode && this.app.modules.settings.applyLiteMode(settings.liteMode);
          this.app.modules.settings.applyVirtualScrolling && this.app.modules.settings.applyVirtualScrolling(settings.virtualScrolling);
        }
      });
    }
  }
  setupWindowControls() {
    if (window.__amWindowControlsInitialized) {
      return;
    }
    window.__amWindowControlsInitialized = true;
    const minimizeBtn = document.getElementById("minimizeBtn");
    const maximizeBtn = document.getElementById("maximizeBtn");
    const closeBtn = document.getElementById("closeBtn");
    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", () => {
        window.electronAPI.minimizeWindow();
      });
    }
    if (maximizeBtn) {
      const updateMaximizeUI = /* @__PURE__ */ __name(async () => {
        try {
          const isMax = await window.electronAPI.isMaximized();
          const icon = maximizeBtn.querySelector("i");
          if (isMax) {
            maximizeBtn.title = "Restaurar";
            maximizeBtn.setAttribute("data-i18n-title", "window.restore");
            if (icon) {
              icon.className = "far fa-clone";
            }
          } else {
            maximizeBtn.title = "Maximizar";
            maximizeBtn.setAttribute("data-i18n-title", "window.maximize");
            if (icon) {
              icon.className = "fas fa-square";
            }
          }
        } catch (e) {
        }
      }, "updateMaximizeUI");
      updateMaximizeUI();
      let maxToggleLock = false;
      maximizeBtn.addEventListener("click", async () => {
        if (maxToggleLock) return;
        maxToggleLock = true;
        try {
          await window.electronAPI.maximizeWindow();
          await updateMaximizeUI();
        } finally {
          setTimeout(() => {
            maxToggleLock = false;
          }, 150);
        }
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        window.electronAPI.closeWindow();
      });
    }
  }
  handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "r") {
      e.preventDefault();
      this.app.modules.navigation.refreshCurrentPage();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === ",") {
      e.preventDefault();
      this.app.openSettings();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault();
      this.app.openAddGameModal();
    }
    if (e.key === "F5") {
      e.preventDefault();
      this.app.modules.navigation.refreshCurrentPage();
    }
    if (e.key === "Escape") {
      this.closeActiveModals();
    }
    if (e.key >= "1" && e.key <= "4" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const pages = ["dashboard", "statistics", "backup", "configuracoes"];
      const pageIndex = parseInt(e.key) - 1;
      if (pages[pageIndex]) {
        this.app.modules.navigation.navigateTo(pages[pageIndex]);
      }
    }
  }
  closeActiveModals() {
    const activeModals = document.querySelectorAll(".modal.active, .modal.show");
    activeModals.forEach((modal) => {
      modal.classList.remove("active", "show");
    });
    const activeDropdowns = document.querySelectorAll(".dropdown.active");
    activeDropdowns.forEach((dropdown) => {
      dropdown.classList.remove("active");
    });
  }
}
window.EventsManager = EventsManager;
export {
  EventsManager
};
