// Módulo de Eventos e Controles
class EventsManager {
  constructor(app) {
    this.app = app;
  }

  setupEventListeners() {
    // Navigation
    document.addEventListener('click', e => {
      const navItem = e.target.closest('.nav-item');
      if (navItem) {
        e.preventDefault();
        const page = navItem.getAttribute('href').substring(1);
        this.app.modules.navigation.navigateTo(page);
      }
    });

    // Window controls (se for Electron)
    if (this.app.isElectron) {
      this.setupWindowControls();
    }

    // Settings button (sidebar)
    const sidebarSettingsBtn = document.getElementById('sidebarSettingsBtn');
    if (sidebarSettingsBtn) {
      sidebarSettingsBtn.addEventListener('click', async e => {
        e.preventDefault();
        await this.app.openSettings();
      });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.app.modules.navigation.refreshCurrentPage();
      });
    }

    // Add game button
    const addGameBtn = document.getElementById('addGameBtn');
    if (addGameBtn) {
      addGameBtn.addEventListener('click', () => {
        this.app.openAddGameModal();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      this.handleKeyboardShortcuts(e);
    });

    // Theme change listener
    if (this.app.modules.state && this.app.modules.state.subscribe) {
      this.app.modules.state.subscribe('settings', settings => {
        if (this.app.modules.settings) {
          this.app.modules.settings.applyTheme && this.app.modules.settings.applyTheme(settings.theme);
          this.app.modules.settings.applyLiteMode && this.app.modules.settings.applyLiteMode(settings.liteMode);
          this.app.modules.settings.applyVirtualScrolling && this.app.modules.settings.applyVirtualScrolling(settings.virtualScrolling);
        }
      });
    }
  }

  setupWindowControls() {
    // Evitar registrar controles de janela mais de uma vez
    if (window.__amWindowControlsInitialized) {
      return;
    }

    window.__amWindowControlsInitialized = true;

    const minimizeBtn = document.getElementById('minimizeBtn');
    const maximizeBtn = document.getElementById('maximizeBtn');
    const closeBtn = document.getElementById('closeBtn');

    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        window.electronAPI.minimizeWindow();
      });
    }

    if (maximizeBtn) {
      // Atualizar ícone/título conforme estado e alternar maximizar/restaurar
      const updateMaximizeUI = async () => {
        try {
          const isMax = await window.electronAPI.isMaximized();
          const icon = maximizeBtn.querySelector('i');
          if (isMax) {
            maximizeBtn.title = 'Restaurar';
            maximizeBtn.setAttribute('data-i18n-title', 'window.restore');
            if (icon) {
              icon.className = 'far fa-clone'; // ícone de restaurar
            }
          } else {
            maximizeBtn.title = 'Maximizar';
            maximizeBtn.setAttribute('data-i18n-title', 'window.maximize');
            if (icon) {
              icon.className = 'fas fa-square';
            }
          }
        } catch (e) {
          // silencioso
        }
      };

      // Estado inicial
      updateMaximizeUI();

      // Alternar ao clicar com proteção contra duplas chamadas rápidas
      let maxToggleLock = false;
      maximizeBtn.addEventListener('click', async () => {
        if (maxToggleLock) return; // evitar alternância dupla
        maxToggleLock = true;

        try {
          await window.electronAPI.maximizeWindow();
          // Após alternar, refletir o estado no UI
          await updateMaximizeUI();
        } finally {
          // pequena janela de desbloqueio para múltiplos eventos acidentais
          setTimeout(() => {
            maxToggleLock = false;
          }, 150);
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.electronAPI.closeWindow();
      });
    }
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + R - Refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      this.app.modules.navigation.refreshCurrentPage();
    }

    // Ctrl/Cmd + , - Settings
    if ((e.ctrlKey || e.metaKey) && e.key === ',') {
      e.preventDefault();
      this.app.openSettings();
    }

    // Ctrl/Cmd + N - Add Game
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      this.app.openAddGameModal();
    }

    // F5 - Refresh
    if (e.key === 'F5') {
      e.preventDefault();
      this.app.modules.navigation.refreshCurrentPage();
    }

    // Escape - Close modals
    if (e.key === 'Escape') {
      this.closeActiveModals();
    }

    // Number keys for navigation
    if (e.key >= '1' && e.key <= '4' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const pages = ['dashboard', 'statistics', 'backup', 'configuracoes'];
      const pageIndex = parseInt(e.key) - 1;
      if (pages[pageIndex]) {
        this.app.modules.navigation.navigateTo(pages[pageIndex]);
      }
    }
  }

  closeActiveModals() {
    // Fechar modais ativos
    const activeModals = document.querySelectorAll('.modal.active, .modal.show');
    activeModals.forEach(modal => {
      modal.classList.remove('active', 'show');
    });

    // Fechar dropdowns ativos
    const activeDropdowns = document.querySelectorAll('.dropdown.active');
    activeDropdowns.forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }
}

// Exportar para uso global

// Exportar a classe EventsManager
export { EventsManager };

// Disponibilizar globalmente para compatibilidade
window.EventsManager = EventsManager;
