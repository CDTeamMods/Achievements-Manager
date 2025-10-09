const require_window_manager = module => {
  const { BrowserWindow } = require('electron');
  class WindowManager {
    constructor(store) {
      this.store = store;
      this.windows = new Map();
      this.windowStates = new Map();
    }
    /**
     * Configura handlers IPC para gerenciamento de janelas
     */
    setupIPC(ipcMain) {
      const getEventWindow = _event => {
        const winFromSender = BrowserWindow.fromWebContents(_event.sender);
        if (winFromSender) return winFromSender;
        const focused = BrowserWindow.getFocusedWindow();
        if (focused) return focused;
        const all = BrowserWindow.getAllWindows();
        return all && all.length ? all[0] : null;
      };
      ipcMain.handle('window:minimize', _event => {
        const win = getEventWindow(_event);
        if (win) {
          win.minimize();
        }
      });
      ipcMain.handle('window:maximize', _event => {
        const win = getEventWindow(_event);
        if (win) {
          if (win.isMaximized()) {
            win.unmaximize();
          } else {
            win.maximize();
          }
        }
      });
      ipcMain.handle('window:close', _event => {
        const win = getEventWindow(_event);
        if (win) {
          win.close();
        }
      });
      ipcMain.handle('window:isMaximized', _event => {
        const win = getEventWindow(_event);
        return win ? win.isMaximized() : false;
      });
      ipcMain.handle('window:setAlwaysOnTop', (_event, flag) => {
        const win = getEventWindow(_event);
        if (win) {
          win.setAlwaysOnTop(flag);
          this.store.set('window.alwaysOnTop', flag);
        }
      });
      ipcMain.handle('window:setOpacity', (_event, opacity) => {
        const win = getEventWindow(_event);
        if (win) {
          win.setOpacity(opacity);
          this.store.set('window.opacity', opacity);
        }
      });
      ipcMain.handle('window:getBounds', _event => {
        const win = getEventWindow(_event);
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
        parent,
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
      window.webContents.setBackgroundThrottling(false);
      window.webContents.session.setCache({
        maxSize: 100 * 1024 * 1024,
        // 100MB
      });
      window.webContents.on('dom-ready', () => {
        window.webContents.executeJavaScript(`
        // Preload de fontes cr\xEDticas
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
      const state = this.windowStates.get(id);
      if (state) {
        window.setBounds(state.bounds);
        if (state.isMaximized) {
          window.maximize();
        }
      }
    }
  }
  async function setupWindowManager(ipcMain, store) {
    const windowManager = new WindowManager(store);
    windowManager.setupIPC(ipcMain);
    return windowManager;
  }
  module.exports = { WindowManager, setupWindowManager };
};
const window_manager_default = require_window_manager();
export { window_manager_default as default };
