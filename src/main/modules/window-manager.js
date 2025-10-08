const { BrowserWindow } = require('electron');

/**
 * Gerenciador de janelas otimizado
 */
class WindowManager {
  constructor(store) {
    this.store = store;
    this.windows = new Map();
    // Cache interno para estado das janelas (não persiste em arquivo)
    this.windowStates = new Map();
  }

  /**
   * Configura handlers IPC para gerenciamento de janelas
   */
  setupIPC(ipcMain) {
    // Utilitário robusto para obter a janela a partir do evento
    const getEventWindow = event => {
      const winFromSender = BrowserWindow.fromWebContents(event.sender);
      if (winFromSender) return winFromSender;
      const focused = BrowserWindow.getFocusedWindow();
      if (focused) return focused;
      const all = BrowserWindow.getAllWindows();
      return all && all.length ? all[0] : null;
    };

    // Controles da janela
    ipcMain.handle('window:minimize', event => {
      const win = getEventWindow(event);
      if (win) {
        win.minimize();
      }
    });

    ipcMain.handle('window:maximize', event => {
      const win = getEventWindow(event);
      if (win) {
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    });

    ipcMain.handle('window:close', event => {
      const win = getEventWindow(event);
      if (win) {
        win.close();
      }
    });

    ipcMain.handle('window:isMaximized', event => {
      const win = getEventWindow(event);
      return win ? win.isMaximized() : false;
    });

    // Configurações da janela
    ipcMain.handle('window:setAlwaysOnTop', (event, flag) => {
      const win = getEventWindow(event);
      if (win) {
        win.setAlwaysOnTop(flag);
        this.store.set('window.alwaysOnTop', flag);
      }
    });

    ipcMain.handle('window:setOpacity', (event, opacity) => {
      const win = getEventWindow(event);
      if (win) {
        win.setOpacity(opacity);
        this.store.set('window.opacity', opacity);
      }
    });

    // Informações da janela
    ipcMain.handle('window:getBounds', event => {
      const win = getEventWindow(event);
      return win ? win.getBounds() : null;
    });

    ipcMain.handle('window:getDisplays', () => {
      const { screen } = require('electron');
      return screen.getAllDisplays();
    });
  }

  /**
   * Cria uma janela modal otimizada
   */
  createModal(options = {}) {
    const parent = BrowserWindow.getFocusedWindow();

    const modal = new BrowserWindow({
      width: options.width || 600,
      height: options.height || 400,
      parent: parent,
      modal: true,
      frame: false,
      resizable: options.resizable || false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: options.preload,
      },
      ...options,
    });

    // Centralizar na janela pai
    if (parent) {
      const parentBounds = parent.getBounds();
      const modalBounds = modal.getBounds();

      modal.setPosition(
        Math.round(parentBounds.x + (parentBounds.width - modalBounds.width) / 2),
        Math.round(parentBounds.y + (parentBounds.height - modalBounds.height) / 2)
      );
    }

    return modal;
  }

  /**
   * Otimiza performance da janela
   */
  optimizeWindow(window) {
    // Desabilitar throttling em background
    window.webContents.setBackgroundThrottling(false);

    // Configurar cache
    window.webContents.session.setCache({
      maxSize: 100 * 1024 * 1024, // 100MB
    });

    // Preload de recursos críticos
    window.webContents.on('dom-ready', () => {
      window.webContents.executeJavaScript(`
        // Preload de fontes críticas
        const fontPreloads = [
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];
        
        fontPreloads.forEach(font => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'style';
          link.href = font;
          document.head.appendChild(link);
        });
      `);
    });
  }

  /**
   * Gerencia estado das janelas
   */
  saveWindowState(window, id) {
    const bounds = window.getBounds();
    const isMaximized = window.isMaximized();
    // Armazenar apenas em memória
    this.windowStates.set(id, {
      bounds,
      isMaximized,
      timestamp: Date.now(),
    });
  }

  /**
   * Restaura estado da janela
   */
  restoreWindowState(window, id) {
    // Restaurar somente a partir do cache interno em memória
    const state = this.windowStates.get(id);

    if (state) {
      window.setBounds(state.bounds);

      if (state.isMaximized) {
        window.maximize();
      }
    }
  }
}

/**
 * Configura o gerenciador de janelas
 */
async function setupWindowManager(ipcMain, store) {
  const windowManager = new WindowManager(store);
  windowManager.setupIPC(ipcMain);

  return windowManager;
}

module.exports = { WindowManager, setupWindowManager };
