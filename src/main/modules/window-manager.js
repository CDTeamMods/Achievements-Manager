const { BrowserWindow } = require('electron');

/**
 * Gerenciador de janelas otimizado
 */
class WindowManager {
  constructor(store) {
    this.store = store;
    this.windows = new Map();
  }

  /**
   * Configura handlers IPC para gerenciamento de janelas
   */
  setupIPC(ipcMain) {
    // Controles da janela
    ipcMain.handle('window:minimize', () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow) {
        focusedWindow.minimize();
      }
    });

    ipcMain.handle('window:maximize', () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow) {
        if (focusedWindow.isMaximized()) {
          focusedWindow.unmaximize();
        } else {
          focusedWindow.maximize();
        }
      }
    });

    ipcMain.handle('window:close', () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow) {
        focusedWindow.close();
      }
    });

    ipcMain.handle('window:isMaximized', () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      return focusedWindow ? focusedWindow.isMaximized() : false;
    });

    // Configurações da janela
    ipcMain.handle('window:setAlwaysOnTop', (event, flag) => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow) {
        focusedWindow.setAlwaysOnTop(flag);
        this.store.set('window.alwaysOnTop', flag);
      }
    });

    ipcMain.handle('window:setOpacity', (event, opacity) => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow) {
        focusedWindow.setOpacity(opacity);
        this.store.set('window.opacity', opacity);
      }
    });

    // Informações da janela
    ipcMain.handle('window:getBounds', () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      return focusedWindow ? focusedWindow.getBounds() : null;
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

    this.store.set(`windows.${id}`, {
      bounds,
      isMaximized,
      timestamp: Date.now(),
    });
  }

  /**
   * Restaura estado da janela
   */
  restoreWindowState(window, id) {
    const state = this.store.get(`windows.${id}`);

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
