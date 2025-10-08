const fs = require('node:fs').promises;
const path = require('node:path');
const { ipcMain } = require('electron');

/**
 * Gerenciador de jogos Steam instalados localmente
 * Detecta jogos através dos arquivos appmanifest_*.acf
 */
class SteamLocalGamesManager {
  constructor(debugManager, crashReporter) {
    this.debugManager = debugManager;
    this.crashReporter = crashReporter;
    this.installedGames = new Set();
    this.steamPaths = [];
    this.lastScan = null;

    this.setupIpcHandlers();
  }

  /**
   * Configurar handlers IPC
   */
  setupIpcHandlers() {
    ipcMain.handle('steam.getInstalledGames', async () => {
      return await this.getInstalledGames();
    });

    ipcMain.handle('steam.scanInstalledGames', async () => {
      return await this.scanInstalledGames();
    });

    ipcMain.handle('steam.isGameInstalled', async (event, appId) => {
      return this.isGameInstalled(appId);
    });
  }

  /**
   * Detectar caminhos do Steam automaticamente
   */
  async detectSteamPaths() {
    const possiblePaths = [
      'C:\\Program Files (x86)\\Steam',
      'C:\\Program Files\\Steam',
      'D:\\Steam',
      'E:\\Steam',
      'F:\\Steam',
    ];

    const validPaths = [];

    for (const steamPath of possiblePaths) {
      try {
        const steamAppsPath = path.join(steamPath, 'steamapps');
        await fs.access(steamAppsPath);
        validPaths.push(steamAppsPath);
      } catch (error) {
        // Caminho não existe, continuar
      }
    }

    // Verificar bibliotecas adicionais através do libraryfolders.vdf
    for (const steamAppsPath of validPaths) {
      try {
        const libraryFoldersPath = path.join(steamAppsPath, 'libraryfolders.vdf');
        const libraryContent = await fs.readFile(libraryFoldersPath, 'utf8');

        // Parse simples do VDF para encontrar caminhos adicionais
        const pathMatches = libraryContent.match(/"path"\s+"([^"]+)"/g);
        if (pathMatches) {
          for (const match of pathMatches) {
            const pathMatch = match.match(/"path"\s+"([^"]+)"/);
            if (pathMatch) {
              const additionalPath = path.join(pathMatch[1].replace(/\\\\/g, '\\'), 'steamapps');
              if (!validPaths.includes(additionalPath)) {
                try {
                  await fs.access(additionalPath);
                  validPaths.push(additionalPath);
                } catch (error) {
                  // Caminho não existe
                }
              }
            }
          }
        }
      } catch (error) {
        // Arquivo libraryfolders.vdf não existe ou erro de leitura
      }
    }

    this.steamPaths = validPaths;
    return validPaths;
  }

  /**
   * Escanear jogos instalados em todos os caminhos Steam
   */
  async scanInstalledGames() {
    try {
      console.log('🔍 Escaneando jogos Steam instalados...');

      if (this.steamPaths.length === 0) {
        await this.detectSteamPaths();
      }

      if (this.steamPaths.length === 0) {
        return {
          success: false,
          error: 'Nenhuma instalação do Steam encontrada',
          installedGames: [],
        };
      }

      const installedGames = new Set();

      for (const steamAppsPath of this.steamPaths) {
        try {
          const files = await fs.readdir(steamAppsPath);

          for (const file of files) {
            if (file.startsWith('appmanifest_') && file.endsWith('.acf')) {
              const appId = file.match(/appmanifest_(\d+)\.acf/);
              if (appId) {
                const gameAppId = appId[1];

                // Verificar se o jogo está realmente instalado (StateFlags = 4)
                try {
                  const manifestPath = path.join(steamAppsPath, file);
                  const manifestContent = await fs.readFile(manifestPath, 'utf8');

                  // Parse simples do ACF para verificar StateFlags
                  const stateFlagsMatch = manifestContent.match(/"StateFlags"\s+"(\d+)"/);
                  if (stateFlagsMatch) {
                    const stateFlags = parseInt(stateFlagsMatch[1]);
                    // StateFlags 4 = Fully Installed
                    if (stateFlags === 4) {
                      installedGames.add(gameAppId);
                    }
                  }
                } catch (error) {
                  this.debugManager?.warn(`⚠️ Erro ao ler manifest ${file}:`, error.message);
                }
              }
            }
          }
        } catch (error) {
          this.debugManager?.warn(`⚠️ Erro ao escanear ${steamAppsPath}:`, error.message);
        }
      }

      this.installedGames = installedGames;
      this.lastScan = new Date();

      return {
        success: true,
        installedGames: Array.from(installedGames),
        totalInstalled: installedGames.size,
        steamPaths: this.steamPaths,
        lastScan: this.lastScan,
      };
    } catch (error) {
      this.crashReporter.logError('SteamLocalGamesManager.scanInstalledGames', error);

      return {
        success: false,
        error: `Erro ao escanear jogos: ${error.message}`,
        installedGames: [],
      };
    }
  }

  /**
   * Obter lista de jogos instalados (com cache)
   */
  async getInstalledGames() {
    // Se não escaneou ainda ou escaneamento é muito antigo (>1 hora), escanear novamente
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    if (!this.lastScan || this.lastScan < oneHourAgo) {
      return await this.scanInstalledGames();
    }

    return {
      success: true,
      installedGames: Array.from(this.installedGames),
      totalInstalled: this.installedGames.size,
      steamPaths: this.steamPaths,
      lastScan: this.lastScan,
      fromCache: true,
    };
  }

  /**
   * Verificar se um jogo específico está instalado
   */
  isGameInstalled(appId) {
    return this.installedGames.has(String(appId));
  }

  /**
   * Filtrar lista de jogos para mostrar apenas os instalados
   */
  filterInstalledGames(allGames) {
    if (!Array.isArray(allGames)) {
      return [];
    }

    return allGames.filter(game => {
      const gameId = String(game.id || game.appid || game.appID);
      return this.installedGames.has(gameId);
    });
  }

  /**
   * Obter estatísticas
   */
  getStats() {
    return {
      totalInstalled: this.installedGames.size,
      steamPaths: this.steamPaths.length,
      lastScan: this.lastScan,
      isInitialized: this.steamPaths.length > 0,
    };
  }
}

module.exports = SteamLocalGamesManager;
