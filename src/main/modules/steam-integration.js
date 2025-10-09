const require_steam_integration = module => {
  const { ipcMain } = require('electron');
  const axios = require('axios');
  const path = require('node:path');
  const fs = require('node:fs').promises;
  class SteamIntegrationManager {
    constructor(pathManager = null, configManager = null, debugManager = null) {
      this.pathManager = pathManager;
      this.configManager = configManager;
      this.debugManager = debugManager;
      this.http = axios.create({
        baseURL: 'https://api.steampowered.com',
        timeout: 15e3,
      });
      this.apiKey = null;
      this.steamId = null;
      this.cache = new Map();
      this.cacheConfig = {
        userGames: { ttl: 5 * 60 * 1e3 },
        // 5 minutos
        gameAchievements: { ttl: 30 * 60 * 1e3 },
        // 30 minutos
        userAchievements: { ttl: 2 * 60 * 1e3 },
        // 2 minutos
        gameDetails: { ttl: 60 * 60 * 1e3 },
        // 1 hora
      };
      this.setupIpcHandlers();
      this.loadSavedCredentials().catch(() => {});
    }
    /**
     * Carregar credenciais salvas automaticamente
     */
    async loadSavedCredentials() {
      const credentials = await this.getCredentials();
      if (credentials.success && credentials.apiKey) {
        this.apiKey = credentials.apiKey;
        if (credentials.steamId) {
          this.steamId = credentials.steamId;
        }
        this.isConnected = credentials.connected;
        if (this.debugManager) {
          this.debugManager.log(
            'steam',
            `Credenciais carregadas do cache - API Key: ${credentials.apiKey ? 'Definida' : 'N\xE3o definida'}, Steam ID: ${credentials.steamId || 'N\xE3o definido'}, Connected: ${credentials.connected}`
          );
        }
      }
    }
    /**
     * Métodos de gerenciamento de cache
     */
    getCacheKey(type, ...params) {
      return `${type}:${this.steamId}:${params.join(':')}`;
    }
    setCache(type, data, ...params) {
      const key = this.getCacheKey(type, ...params);
      const ttl = this.cacheConfig[type]?.ttl || 5 * 60 * 1e3;
      const expiresAt = Date.now() + ttl;
      this.cache.set(key, {
        data,
        expiresAt,
        createdAt: Date.now(),
      });
    }
    getCache(type, ...params) {
      const key = this.getCacheKey(type, ...params);
      const cached = this.cache.get(key);
      if (!cached) {
        return null;
      }
      if (Date.now() > cached.expiresAt) {
        this.cache.delete(key);
        return null;
      }
      return cached.data;
    }
    clearCache(type = null) {
      if (type) {
        const prefix = `${type}:${this.steamId}:`;
        for (const key of this.cache.keys()) {
          if (key.startsWith(prefix)) {
            this.cache.delete(key);
          }
        }
      } else {
        this.cache.clear();
      }
    }
    getCacheStats() {
      const stats = {
        totalEntries: this.cache.size,
        byType: {},
        memoryUsage: 0,
      };
      for (const [key, value] of this.cache.entries()) {
        const type = key.split(':')[0];
        if (!stats.byType[type]) {
          stats.byType[type] = { count: 0, expired: 0 };
        }
        stats.byType[type].count++;
        if (Date.now() > value.expiresAt) {
          stats.byType[type].expired++;
        }
        stats.memoryUsage += JSON.stringify(value).length;
      }
      return stats;
    }
    // Métodos para cache de conexão Steam
    /**
     * Obtém o caminho do arquivo de cache de credenciais Steam
     */
    async getCredentialsCachePath() {
      if (!this.pathManager) {
        return path.join(process.cwd(), '..', '..', 'data', 'cache', 'steam_access.json');
      }
      const cachePath = this.pathManager.getCachePath();
      return path.join(cachePath, 'steam_access.json');
    }
    async setConnectionStatus(apiKey = null, steamId = null, connected = true) {
      try {
        const cachePath = await this.getCredentialsCachePath();
        let existingData = {};
        await fs.access(cachePath);
        const existingContent = await fs.readFile(cachePath, 'utf8');
        existingData = JSON.parse(existingContent);
        const cacheData = {
          apiKey: apiKey !== null ? apiKey : existingData.apiKey || '',
          steamId: steamId !== null ? steamId : existingData.steamId || '',
        };
        await fs.mkdir(path.dirname(cachePath), { recursive: true });
        await fs.writeFile(cachePath, JSON.stringify(cacheData, null, 2), 'utf8');
        this.isConnected = connected;
        if (apiKey) this.apiKey = apiKey;
        if (steamId) this.steamId = steamId;
        if (this.debugManager) {
          this.debugManager.log(
            'steam',
            `Cache Steam atualizado - Connected: ${connected}, API Key: ${apiKey ? 'Definida' : 'N\xE3o alterada'}, Steam ID: ${steamId || 'N\xE3o alterado'}`
          );
        }
      } catch (error) {
        if (this.debugManager) {
          this.debugManager.error('steam', `Erro ao salvar cache Steam: ${error.message}`);
        }
      }
    }
    async getConnectionStatus() {
      try {
        const cachePath = await this.getCredentialsCachePath();
        try {
          await fs.access(cachePath);
        } catch {
          return {
            connected: false,
            apiKey: '',
            steamId: '',
          };
        }
        const cacheContent = await fs.readFile(cachePath, 'utf8');
        const cacheData = JSON.parse(cacheContent);
        return {
          connected: cacheData.connected || false,
          apiKey: cacheData.apiKey || '',
          steamId: cacheData.steamId || '',
          lastUpdated: cacheData.lastUpdated,
          sessionId: cacheData.sessionId,
        };
      } catch (error) {
        if (this.debugManager) {
          this.debugManager.error('steam', `Erro ao ler cache Steam: ${error.message}`);
        }
        return {
          connected: false,
          apiKey: '',
          steamId: '',
        };
      }
    }
    async clearConnectionCache() {
      try {
        const cachePath = await this.getCredentialsCachePath();
        await fs.unlink(cachePath);
        this.isConnected = false;
        if (this.debugManager) {
          this.debugManager.log('steam', 'Cache de conex\xE3o Steam limpo');
        }
      } catch (error) {
        if (error.code !== 'ENOENT' && this.debugManager) {
          this.debugManager.error('steam', `Erro ao limpar cache de conex\xE3o: ${error.message}`);
        }
      }
    }
    /**
     * Salvar credenciais Steam na nova estrutura organizada por tipo/modo
     */
    async saveCredentials(apiKey, steamId = null) {
      try {
        const credentialsPath = await this.getCredentialsCachePath();
        const credentialsData = {
          apiKey: apiKey || '',
          steamId: steamId || '',
          connected: true,
          lastUpdated: new Date().toISOString(),
          sessionId: Date.now().toString(),
        };
        const dir = path.dirname(credentialsPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(credentialsPath, JSON.stringify(credentialsData, null, 2), 'utf8');
        if (this.debugManager) {
          this.debugManager.log('steam', `\u2705 Credenciais salvas em: ${credentialsPath}`);
        }
        return true;
      } catch (error) {
        if (this.debugManager) {
          this.debugManager.error(
            'steam',
            `\u274C Erro ao salvar credenciais Steam: ${error.message}`
          );
        }
        return false;
      }
    }
    /**
     * Carregar credenciais Steam da nova estrutura organizada por tipo/modo
     */
    async loadCredentials() {
      try {
        const credentialsPath = await this.getCredentialsCachePath();
        const data = await fs.readFile(credentialsPath, 'utf8');
        const credentialsData = JSON.parse(data);
        return {
          success: true,
          apiKey: credentialsData.apiKey || '',
          steamId: credentialsData.steamId || '',
          connected: credentialsData.connected || false,
          lastUpdated: credentialsData.lastUpdated,
          sessionId: credentialsData.sessionId,
        };
      } catch (error) {
        if (error.code === 'ENOENT') {
          return {
            success: true,
            apiKey: '',
            steamId: '',
            connected: false,
            lastUpdated: null,
            sessionId: null,
          };
        }
        if (this.debugManager) {
          this.debugManager.error(
            'steam',
            `\u274C Erro ao carregar credenciais Steam: ${error.message}`
          );
        }
        return {
          success: false,
          error: error.message,
          apiKey: '',
          steamId: '',
          connected: false,
        };
      }
    }
    /**
     * Limpar credenciais Steam da nova estrutura
     */
    async clearCredentials() {
      try {
        const credentialsPath = await this.getCredentialsCachePath();
        await fs.unlink(credentialsPath);
        if (this.debugManager) {
          this.debugManager.log('steam', '\u2705 Credenciais Steam limpas');
        }
        return true;
      } catch (error) {
        if (error.code !== 'ENOENT') {
          if (this.debugManager) {
            this.debugManager.error(
              'steam',
              `\u274C Erro ao limpar credenciais Steam: ${error.message}`
            );
          }
          return false;
        }
        return true;
      }
    }
    /**
     * Configurar handlers IPC para comunicação com o renderer
     */
    setupIpcHandlers() {
      ipcMain.handle('steam.setCredentials', async (event, apiKey, steamId = null) => {
        return await this.setCredentials(apiKey, steamId);
      });
      ipcMain.handle('steam.getCredentials', async () => {
        return await this.getCredentials();
      });
      ipcMain.handle('steam.checkConnection', async () => {
        return await this.checkConnection();
      });
      ipcMain.handle('steam.getUserGames', async (options = {}) => {
        return await this.getUserGames(0, options);
      });
      ipcMain.handle('steam.getGameAchievements', async (gameId, language = null) => {
        return await this.getGameAchievements(gameId, language);
      });
      ipcMain.handle('steam.getUserGameAchievements', async (gameId, language = null) => {
        return await this.getUserGameAchievements(gameId, language);
      });
      ipcMain.handle('steam.convertToGSE', async gameId => {
        return await this.convertToGSE(gameId);
      });
      ipcMain.handle('steam.getGameDetails', async gameId => {
        return await this.getGameDetails(gameId);
      });
      ipcMain.handle('steam.discoverSteamId', async apiKey => {
        return await this.discoverSteamId(apiKey);
      });
      ipcMain.handle('steam.clearCache', async (type = null) => {
        this.clearCache(type);
        return {
          success: true,
          message: type ? `Cache ${type} limpo` : 'Todo o cache foi limpo',
        };
      });
      ipcMain.handle('steam.getCacheStats', async () => {
        return this.getCacheStats();
      });
      ipcMain.handle('steam.testGameAchievements', async gameId => {
        return await this.getGameAchievements(gameId);
      });
      ipcMain.handle('steam.getSteamDefaultPaths', async () => {
        return this.getSteamDefaultPaths();
      });
      ipcMain.handle('steam.detectCurrentSteamDirectory', async () => {
        return await this.detectCurrentSteamDirectory();
      });
    }
    /**
     * Definir credenciais da Steam API
     */
    async setCredentials(apiKey, steamId = null) {
      try {
        this.apiKey = apiKey;
        if (steamId) {
          this.steamId = steamId;
        }
        let finalSteamId = steamId;
        if (!finalSteamId) {
          const discovery = await this.discoverSteamId(apiKey);
          if (discovery.success) {
            finalSteamId = discovery.steamId;
          }
        }
        await this.saveCredentials(apiKey, finalSteamId);
        this.isConnected = true;
        if (this.debugManager) {
          this.debugManager.log(
            'steam',
            `Credenciais Steam salvas no cache - API Key: Definida, Steam ID: ${steamId || 'N\xE3o fornecido'}`
          );
        }
        return {
          success: true,
          message: 'Credenciais configuradas com sucesso!',
        };
      } catch (error) {
        return {
          success: false,
          error: `Erro ao configurar credenciais: ${error.message}`,
        };
      }
    }
    /**
     * Obter credenciais salvas do cache
     */
    async getCredentials() {
      try {
        const newCredentials = await this.loadCredentials();
        if (newCredentials.success && newCredentials.apiKey) {
          return newCredentials;
        }
        const cacheData = await this.getConnectionStatus();
        return {
          success: true,
          apiKey: cacheData.apiKey || '',
          steamId: cacheData.steamId || '',
          connected: cacheData.connected || false,
          lastUpdated: cacheData.lastUpdated,
          sessionId: cacheData.sessionId,
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          apiKey: '',
          steamId: '',
          connected: false,
        };
      }
    }
    /**
     * Testar conexão com Steam API
     */
    async testConnection() {
      try {
        if (!this.apiKey || !this.steamId) {
          return {
            success: false,
            error: 'API Key e SteamID n\xE3o configurados',
          };
        }
        const { data } = await this.http.get('/ISteamUser/GetPlayerSummaries/v2/', {
          params: {
            key: this.apiKey,
            steamids: this.steamId,
          },
        });
        const player = data?.response?.players?.[0];
        if (player && player.steamid) {
          return {
            success: true,
            username: player.personaname || 'Usu\xE1rio Steam',
            avatar: player.avatarfull || player.avatar || '',
            profileUrl: player.profileurl || '',
          };
        } else {
          return {
            success: false,
            error: 'N\xE3o foi poss\xEDvel obter informa\xE7\xF5es do usu\xE1rio',
          };
        }
      } catch (error) {
        return {
          success: false,
          error: `Erro na conex\xE3o: ${error.message}`,
        };
      }
    }
    /**
     * Verificar status da conexão atual
     */
    async checkConnection() {
      try {
        if (!this.isConnected || !this.apiKey || !this.steamId) {
          const credentials = await this.getCredentials();
          if (credentials.success && credentials.apiKey && credentials.steamId) {
            return await this.setCredentials(credentials.apiKey, credentials.steamId);
          }
          return {
            success: false,
            connected: false,
            error: 'N\xE3o conectado',
          };
        }
        const connectionTest = await this.testConnection();
        return {
          success: connectionTest.success,
          connected: connectionTest.success,
          userInfo: connectionTest.success
            ? {
                username: connectionTest.username,
                avatar: connectionTest.avatar,
                profileUrl: connectionTest.profileUrl,
              }
            : null,
          error: connectionTest.error || null,
        };
      } catch (error) {
        return {
          success: false,
          connected: false,
          error: error.message,
        };
      }
    }
    /**
     * Obter jogos do usuário com retry logic e tratamento robusto de erros
     * @param {number} retryCount - Contador de tentativas
     * @param {Object} options - Opções de filtro
     * @param {boolean} options.installedOnly - Se true, retorna apenas jogos instalados localmente
     */
    async getUserGames(retryCount = 0, options = {}) {
      const maxRetries = 3;
      const retryDelay = 1e3;
      try {
        if (!this.apiKey || !this.steamId) {
          return {
            success: false,
            error: 'Steam API n\xE3o configurada',
            errorCode: 'CREDENTIALS_MISSING',
            suggestion: 'Configure sua API Key e Steam ID nas configura\xE7\xF5es',
          };
        }
        if (options && options.installedOnly && global.steamLocalGamesManager) {
          return await this.getInstalledGamesOptimized(retryCount);
        }
        const cachedGames = this.getCache('userGames');
        if (cachedGames) {
          return cachedGames;
        }
        const { data } = await this.http.get('/IPlayerService/GetOwnedGames/v1/', {
          params: {
            key: this.apiKey,
            steamid: this.steamId,
            include_appinfo: true,
            include_played_free_games: true,
            include_extended_appinfo: true,
            // Informações estendidas dos jogos
            skip_unvetted_apps: false,
            // Incluir jogos não verificados
            language: 'portuguese',
            // Idioma para nomes dos jogos
            format: 'json',
          },
          timeout: 3e4,
          // 30 segundos para biblioteca completa
        });
        if (!data || !data.response) {
          throw new Error('Resposta inv\xE1lida da Steam API');
        }
        const games = data.response.games || [];
        const gameCount = data.response.game_count || 0;
        if (games.length > 0) {
          const validGames = games.filter(
            game => game.appid && game.name && game.name.trim() !== '' && game.appid > 0
          );
          const sortedGames = validGames.sort((a, b) => {
            if (b.playtime_2weeks !== a.playtime_2weeks) {
              return (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0);
            }
            if (b.playtime_forever !== a.playtime_forever) {
              return (b.playtime_forever || 0) - (a.playtime_forever || 0);
            }
            return (a.name || '').localeCompare(b.name || '');
          });
          const mappedGames = sortedGames.map(game => {
            const baseImageUrl = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}`;
            return {
              id: String(game.appid),
              name: game.name.trim(),
              playtimeForever: Math.max(0, game.playtime_forever || 0),
              playTime2Weeks: Math.max(0, game.playtime_2weeks || 0),
              imgIconUrl: game.img_icon_url ? `${baseImageUrl}/${game.img_icon_url}.jpg` : null,
              imgLogoUrl: game.img_logo_url ? `${baseImageUrl}/${game.img_logo_url}.jpg` : null,
              hasAchievements: true,
              // Será verificado posteriormente se necessário
              lastPlayed: game.rtime_last_played ? new Date(game.rtime_last_played * 1e3) : null,
            };
          });
          let finalGames = mappedGames;
          if (options && options.installedOnly) {
            const steamLocalGames = global.steamLocalGamesManager;
            if (steamLocalGames) {
              const installedGames = await steamLocalGames.getInstalledGames();
              if (
                installedGames &&
                installedGames.success &&
                installedGames.installedGames &&
                installedGames.installedGames.length > 0
              ) {
                const installedAppIds = new Set(
                  installedGames.installedGames.map(appId => String(appId))
                );
                finalGames = mappedGames.filter(game => installedAppIds.has(game.id));
              }
            }
          }
          const result = {
            success: true,
            games: finalGames,
            totalGames: finalGames.length,
            reportedTotal: gameCount,
            installedOnly: options && options.installedOnly,
            metadata: {
              fetchedAt: new Date().toISOString(),
              steamId: this.steamId,
              hasPrivateProfile: gameCount === 0 && games.length === 0,
            },
          };
          if (!options || !options.installedOnly) {
            this.setCache('userGames', result);
          }
          return result;
        } else {
          const isPrivateProfile = gameCount === 0;
          const result = {
            success: true,
            games: [],
            totalGames: 0,
            reportedTotal: gameCount,
            metadata: {
              fetchedAt: new Date().toISOString(),
              steamId: this.steamId,
              hasPrivateProfile: isPrivateProfile,
            },
            warning: isPrivateProfile
              ? 'Biblioteca vazia ou perfil privado. Verifique se sua biblioteca de jogos est\xE1 p\xFAblica.'
              : null,
          };
          this.setCache('userGames', result);
          return result;
        }
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          const statusText = error.response.statusText;
          switch (status) {
            case 401:
              return {
                success: false,
                error: 'API Key inv\xE1lida ou n\xE3o autorizada',
                errorCode: 'UNAUTHORIZED',
                suggestion: 'Verifique se sua API Key est\xE1 correta e ativa',
              };
            case 403:
              return {
                success: false,
                error: 'Acesso negado. Perfil pode estar privado',
                errorCode: 'FORBIDDEN',
                suggestion: 'Verifique se sua biblioteca de jogos est\xE1 p\xFAblica no Steam',
              };
            case 429:
              if (retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay * (retryCount + 1)));
                return this.getUserGames(retryCount + 1);
              }
              return {
                success: false,
                error: 'Muitas requisi\xE7\xF5es. Tente novamente em alguns minutos',
                errorCode: 'RATE_LIMITED',
                suggestion: 'Aguarde alguns minutos antes de tentar novamente',
              };
            case 500:
            case 502:
            case 503:
              if (retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return this.getUserGames(retryCount + 1);
              }
              return {
                success: false,
                error: 'Servidores Steam temporariamente indispon\xEDveis',
                errorCode: 'SERVER_ERROR',
                suggestion: 'Tente novamente em alguns minutos',
              };
            default:
              return {
                success: false,
                error: `Erro HTTP ${status}: ${statusText}`,
                errorCode: 'HTTP_ERROR',
                suggestion: 'Verifique sua conex\xE3o com a internet',
              };
          }
        }
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return this.getUserGames(retryCount + 1);
          }
          return {
            success: false,
            error: 'Timeout na conex\xE3o com Steam API',
            errorCode: 'TIMEOUT',
            suggestion: 'Verifique sua conex\xE3o com a internet e tente novamente',
          };
        }
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          return {
            success: false,
            error: 'N\xE3o foi poss\xEDvel conectar com a Steam API',
            errorCode: 'NETWORK_ERROR',
            suggestion: 'Verifique sua conex\xE3o com a internet',
          };
        }
        return {
          success: false,
          error: `Erro inesperado: ${error.message}`,
          errorCode: 'UNKNOWN_ERROR',
          suggestion: 'Tente novamente ou verifique os logs para mais detalhes',
        };
      }
    }
    /**
     * Método otimizado para buscar apenas jogos instalados
     * @param {number} retryCount - Contador de tentativas
     */
    async getInstalledGamesOptimized(retryCount = 0) {
      const maxRetries = 3;
      const retryDelay = 1e3;
      try {
        const steamLocalGames = global.steamLocalGamesManager;
        if (!steamLocalGames) {
          return {
            success: false,
            error: 'Gerenciador de jogos locais n\xE3o dispon\xEDvel',
            games: [],
          };
        }
        const installedGamesResult = await steamLocalGames.getInstalledGames();
        if (
          !installedGamesResult.success ||
          !installedGamesResult.installedGames ||
          installedGamesResult.installedGames.length === 0
        ) {
          return {
            success: true,
            games: [],
            totalGames: 0,
            installedOnly: true,
            metadata: {
              fetchedAt: new Date().toISOString(),
              steamId: this.steamId,
              optimizedSearch: true,
            },
          };
        }
        const installedAppIds = installedGamesResult.installedGames;
        const installedAppIdsNumbers = installedAppIds.map(id => parseInt(id, 10));
        const directSearchResult = await this.getInstalledGamesDirectSearch(installedAppIdsNumbers);
        if (directSearchResult.success && directSearchResult.games.length > 0) {
          return directSearchResult;
        }
        const { data } = await this.http.get('/IPlayerService/GetOwnedGames/v1/', {
          params: {
            key: this.apiKey,
            steamid: this.steamId,
            include_appinfo: true,
            include_played_free_games: true,
            include_extended_appinfo: true,
            // Informações estendidas dos jogos
            skip_unvetted_apps: false,
            // Incluir jogos não verificados
            language: 'portuguese',
            // Idioma para nomes dos jogos
            format: 'json',
          },
          timeout: 3e4,
        });
        if (!data || !data.response) {
          throw new Error('Resposta inv\xE1lida da Steam API');
        }
        const allGames = data.response.games || [];
        const installedAppIdsSet = new Set(installedAppIdsNumbers);
        const installedGames = allGames.filter(
          game =>
            game.appid && game.name && game.name.trim() !== '' && installedAppIdsSet.has(game.appid)
        );
        if (installedGames.length === 0 && installedAppIdsNumbers.length > 0) {
          return await this.getInstalledGamesByIndividualSearch(installedAppIdsNumbers);
        }
        const mappedGames = installedGames.map(game => {
          const baseImageUrl = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}`;
          return {
            id: String(game.appid),
            name: game.name.trim(),
            playtimeForever: Math.max(0, game.playtime_forever || 0),
            playTime2Weeks: Math.max(0, game.playtime_2weeks || 0),
            imgIconUrl: game.img_icon_url ? `${baseImageUrl}/${game.img_icon_url}.jpg` : null,
            imgLogoUrl: game.img_logo_url ? `${baseImageUrl}/${game.img_logo_url}.jpg` : null,
            hasAchievements: true,
            lastPlayed: game.rtime_last_played ? new Date(game.rtime_last_played * 1e3) : null,
          };
        });
        const sortedGames = mappedGames.sort((a, b) => {
          if (b.playTime2Weeks !== a.playTime2Weeks) {
            return (b.playTime2Weeks || 0) - (a.playTime2Weeks || 0);
          }
          if (b.playtimeForever !== a.playtimeForever) {
            return (b.playtimeForever || 0) - (a.playtimeForever || 0);
          }
          return (a.name || '').localeCompare(b.name || '');
        });
        const result = {
          success: true,
          games: sortedGames,
          totalGames: sortedGames.length,
          installedOnly: true,
          metadata: {
            fetchedAt: new Date().toISOString(),
            steamId: this.steamId,
            optimizedSearch: true,
            totalInstalledFound: installedAppIds.length,
            matchedInLibrary: sortedGames.length,
          },
        };
        return result;
      } catch (error) {
        if (error.response && error.response.status === 429 && retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * 2));
          return this.getInstalledGamesOptimized(retryCount + 1);
        }
        if (
          retryCount < maxRetries &&
          (error.code === 'ECONNABORTED' || error.message.includes('timeout'))
        ) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return this.getInstalledGamesOptimized(retryCount + 1);
        }
        return {
          success: false,
          error: `Erro na busca otimizada: ${error.message}`,
          games: [],
          installedOnly: true,
        };
      }
    }
    /**
     * Busca DIRETA de jogos instalados sem baixar biblioteca completa
     * Usa apenas Steam Store API para buscar informações dos jogos instalados
     * @param {number[]} installedAppIds - Array de IDs dos jogos instalados
     */
    async getInstalledGamesDirectSearch(installedAppIds = null) {
      try {
        if (!installedAppIds) {
          const steamLocalGames = global.steamLocalGamesManager;
          if (!steamLocalGames) {
            return {
              success: false,
              error: 'Gerenciador de jogos locais n\xE3o dispon\xEDvel',
              games: [],
            };
          }
          const installedGamesResult = await steamLocalGames.getInstalledGames();
          if (
            !installedGamesResult.success ||
            !installedGamesResult.installedGames ||
            installedGamesResult.installedGames.length === 0
          ) {
            return {
              success: true,
              games: [],
              totalGames: 0,
              installedOnly: true,
              metadata: {
                fetchedAt: new Date().toISOString(),
                steamId: this.steamId,
                directSearch: true,
              },
            };
          }
          installedAppIds = installedGamesResult.installedGames.map(id => parseInt(id, 10));
        }
        const foundGames = [];
        const batchSize = 10;
        const maxConcurrent = 3;
        for (let i = 0; i < installedAppIds.length; i += batchSize * maxConcurrent) {
          const megaBatch = [];
          for (let j = 0; j < maxConcurrent && i + j * batchSize < installedAppIds.length; j++) {
            const startIdx = i + j * batchSize;
            const batch = installedAppIds.slice(startIdx, startIdx + batchSize);
            if (batch.length > 0) {
              megaBatch.push(batch);
            }
          }
          const megaBatchPromises = megaBatch.map(async batch => {
            const batchResults = [];
            for (const appId of batch) {
              const storeResponse = await this.http.get(
                `https://store.steampowered.com/api/appdetails`,
                {
                  params: {
                    appids: appId,
                    l: 'portuguese',
                    cc: 'BR',
                    filters: 'basic,price_overview',
                  },
                  timeout: 8e3,
                }
              );
              if (
                storeResponse.data &&
                storeResponse.data[appId] &&
                storeResponse.data[appId].success
              ) {
                const gameData = storeResponse.data[appId].data;
                let playtimeData = null;
                const playtimeResponse = await this.http.get('/IPlayerService/GetOwnedGames/v1/', {
                  params: {
                    key: this.apiKey,
                    steamid: this.steamId,
                    appids_filter: [appId],
                    include_appinfo: false,
                    // Não precisamos de info extra
                    format: 'json',
                  },
                  timeout: 5e3,
                });
                if (playtimeResponse.data?.response?.games?.length > 0) {
                  playtimeData = playtimeResponse.data.response.games[0];
                }
                const baseImageUrl = `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}`;
                const gameInfo = {
                  id: String(appId),
                  name: gameData.name || `Jogo ${appId}`,
                  playtimeForever: playtimeData?.playtime_forever || 0,
                  playTime2Weeks: playtimeData?.playtime_2weeks || 0,
                  imgIconUrl: gameData.header_image
                    ? gameData.header_image.replace('header', 'icon')
                    : `${baseImageUrl}/icon.jpg`,
                  imgLogoUrl: gameData.header_image || `${baseImageUrl}/logo.jpg`,
                  hasAchievements: true,
                  // Assumir que tem conquistas
                  lastPlayed: playtimeData?.rtime_last_played
                    ? new Date(playtimeData.rtime_last_played * 1e3)
                    : null,
                  price: gameData.price_overview?.final_formatted || 'Gratuito',
                  developer: gameData.developers?.[0] || 'Desconhecido',
                  publisher: gameData.publishers?.[0] || 'Desconhecido',
                };
                batchResults.push(gameInfo);
              }
              await new Promise(resolve => setTimeout(resolve, 200));
            }
            return batchResults;
          });
          const megaBatchResults = await Promise.all(megaBatchPromises);
          const validGames = megaBatchResults.flat();
          foundGames.push(...validGames);
          if (i + batchSize * maxConcurrent < installedAppIds.length) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        }
        const sortedGames = foundGames.sort((a, b) => {
          if (b.playTime2Weeks !== a.playTime2Weeks) {
            return (b.playTime2Weeks || 0) - (a.playTime2Weeks || 0);
          }
          if (b.playtimeForever !== a.playtimeForever) {
            return (b.playtimeForever || 0) - (a.playtimeForever || 0);
          }
          return (a.name || '').localeCompare(b.name || '');
        });
        return {
          success: true,
          games: sortedGames,
          totalGames: sortedGames.length,
          installedOnly: true,
          metadata: {
            fetchedAt: new Date().toISOString(),
            steamId: this.steamId,
            directSearch: true,
            libraryDownloadAvoided: true,
            totalRequested: installedAppIds.length,
            totalFound: sortedGames.length,
            efficiencyGain: `Evitou baixar ${1127 - installedAppIds.length} jogos desnecess\xE1rios`,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: `Erro na busca direta: ${error.message}`,
          games: [],
          installedOnly: true,
        };
      }
    }
    /**
     * Busca individual de jogos instalados por ID usando Steam Store API
     * @param {number[]} installedAppIds - Array de IDs dos jogos instalados
     */
    async getInstalledGamesByIndividualSearch(installedAppIds) {
      try {
        const foundGames = [];
        const batchSize = 5;
        for (let i = 0; i < installedAppIds.length; i += batchSize) {
          const batch = installedAppIds.slice(i, i + batchSize);
          const batchPromises = batch.map(async appId => {
            const response = await this.http.get(`https://store.steampowered.com/api/appdetails`, {
              params: {
                appids: appId,
                l: 'portuguese',
                cc: 'BR',
              },
              timeout: 1e4,
            });
            if (response.data && response.data[appId] && response.data[appId].success) {
              const gameData = response.data[appId].data;
              let playtimeData = null;
              const playtimeResponse = await this.http.get('/IPlayerService/GetOwnedGames/v1/', {
                params: {
                  key: this.apiKey,
                  steamid: this.steamId,
                  appids_filter: [appId],
                  include_appinfo: true,
                  format: 'json',
                },
                timeout: 5e3,
              });
              if (playtimeResponse.data?.response?.games?.length > 0) {
                playtimeData = playtimeResponse.data.response.games[0];
              }
              const baseImageUrl = `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}`;
              return {
                id: String(appId),
                name: gameData.name || `Jogo ${appId}`,
                playtimeForever: playtimeData?.playtime_forever || 0,
                playTime2Weeks: playtimeData?.playtime_2weeks || 0,
                imgIconUrl: gameData.header_image
                  ? gameData.header_image.replace('header', 'icon')
                  : `${baseImageUrl}/icon.jpg`,
                imgLogoUrl: gameData.header_image || `${baseImageUrl}/logo.jpg`,
                hasAchievements: gameData.achievements?.total > 0 || true,
                lastPlayed: playtimeData?.rtime_last_played
                  ? new Date(playtimeData.rtime_last_played * 1e3)
                  : null,
                price: gameData.price_overview?.final_formatted || 'Gratuito',
                developer: gameData.developers?.[0] || 'Desconhecido',
                publisher: gameData.publishers?.[0] || 'Desconhecido',
              };
            }
            return null;
          });
          const batchResults = await Promise.all(batchPromises);
          const validGames = batchResults.filter(game => game !== null);
          foundGames.push(...validGames);
          if (i + batchSize < installedAppIds.length) {
            await new Promise(resolve => setTimeout(resolve, 1e3));
          }
        }
        const sortedGames = foundGames.sort((a, b) => {
          if (b.playTime2Weeks !== a.playTime2Weeks) {
            return (b.playTime2Weeks || 0) - (a.playTime2Weeks || 0);
          }
          if (b.playtimeForever !== a.playtimeForever) {
            return (b.playtimeForever || 0) - (a.playtimeForever || 0);
          }
          return (a.name || '').localeCompare(b.name || '');
        });
        return {
          success: true,
          games: sortedGames,
          totalGames: sortedGames.length,
          installedOnly: true,
          metadata: {
            fetchedAt: new Date().toISOString(),
            steamId: this.steamId,
            optimizedSearch: true,
            individualSearch: true,
            totalRequested: installedAppIds.length,
            totalFound: sortedGames.length,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: `Erro na busca individual: ${error.message}`,
          games: [],
          installedOnly: true,
        };
      }
    }
    /**
     * Obter conquistas de um jogo
     */
    async getGameAchievements(gameId, language = null) {
      try {
        if (!this.apiKey) {
          return {
            success: false,
            error: 'Steam API n\xE3o configurada',
          };
        }
        if (!language) {
          language = await this.detectUserLanguage();
        }
        const cachedAchievements = this.getCache('gameAchievements', gameId, language);
        if (cachedAchievements) {
          return cachedAchievements;
        }
        let result = await this.fetchGameAchievements(gameId, language);
        if (!result.success && language !== 'en') {
          result = await this.fetchGameAchievements(gameId, 'en');
          if (result.success) {
            result.fallbackLanguage = 'en';
            result.requestedLanguage = language;
          }
        }
        if (result.success) {
          this.setCache('gameAchievements', result, gameId, language);
        }
        return result;
      } catch (error) {
        if (this.debugManager) {
          this.debugManager.error('Erro detalhado ao buscar conquistas do jogo:', {
            gameId,
            language,
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
              url: error.config?.url,
              params: error.config?.params,
            },
          });
        }
        let errorMessage = `Erro ao buscar conquistas: ${error.message}`;
        if (error.response) {
          errorMessage += ` (Status: ${error.response.status})`;
          if (error.response.data) {
            errorMessage += ` - ${JSON.stringify(error.response.data)}`;
          }
        }
        return {
          success: false,
          error: errorMessage,
        };
      }
    }
    /**
     * Buscar conquistas da Steam API com idioma específico
     */
    async fetchGameAchievements(gameId, language) {
      try {
        const params = {
          key: this.apiKey,
          appid: gameId,
        };
        if (language) {
          params.l = language;
        }
        const { data } = await this.http.get('/ISteamUserStats/GetSchemaForGame/v2/', {
          params,
        });
        const achievements = data?.game?.availableGameStats?.achievements || [];
        if (achievements && achievements.length > 0) {
          return {
            success: true,
            achievements: achievements.map(a => ({
              id: a.name,
              name: a.displayName,
              description: a.description,
              icon: a.icon,
              icongray: a.icongray,
              hidden: a.hidden || false,
            })),
            totalAchievements: achievements.length,
            language,
          };
        } else {
          return {
            success: true,
            achievements: [],
            totalAchievements: 0,
            language,
          };
        }
      } catch (error) {
        return {
          success: false,
          error: `Erro ao buscar conquistas: ${error.message}`,
          language,
        };
      }
    }
    /**
     * Mapear código de idioma para código da Steam API
     */
    mapLanguageToSteamCode(languageCode) {
      const languageMap = {
        'pt-BR': 'brazilian',
        // Testando código alternativo da Steam
        pt: 'brazilian',
        'pt-PT': 'pt',
        en: 'en',
        'en-US': 'en',
        'en-GB': 'en',
      };
      return languageMap[languageCode] || 'en';
    }
    /**
     * Obter conquistas do usuário para um jogo específico
     */
    async getUserGameAchievements(gameId, language = null) {
      try {
        if (this.debugManager) {
          this.debugManager.log(
            `\u{1F50D} Buscando conquistas do usu\xE1rio para o jogo ${gameId} (vers\xE3o simplificada)`
          );
        }
        if (!this.apiKey || !this.steamId) {
          return {
            success: false,
            error: 'Steam API n\xE3o configurada',
            errorType: 'MISSING_CREDENTIALS',
          };
        }
        if (!language) {
          language = await this.detectUserLanguage();
        }
        const userAchievementsResult = await this.tryGetPlayerAchievements(gameId, language);
        if (userAchievementsResult.success) {
          return {
            ...userAchievementsResult,
            strategy: 'GetPlayerAchievements',
            language,
          };
        }
        if (language !== 'en') {
          const fallbackResult = await this.tryGetPlayerAchievements(gameId, 'en');
          if (fallbackResult.success) {
            return {
              ...fallbackResult,
              strategy: 'GetPlayerAchievements',
              language: 'en',
              fallbackUsed: true,
            };
          }
        }
        const schemaResult = await this.tryGetSchemaOnly(gameId, language);
        return {
          ...schemaResult,
          strategy: 'SchemaOnly',
          language,
        };
      } catch (error) {
        if (this.debugManager) {
          this.debugManager.error('Erro geral ao buscar conquistas do usu\xE1rio:', error);
        }
        return {
          success: false,
          error: 'Erro interno ao buscar conquistas',
          errorType: 'INTERNAL_ERROR',
          details: error.message,
        };
      }
    }
    // ESTRATÉGIA 1: GetPlayerAchievements (método principal)
    async tryGetPlayerAchievements(gameId, language = null) {
      try {
        const params = {
          key: this.apiKey,
          steamid: this.steamId,
          appid: gameId,
        };
        if (language) {
          params.l = language;
        }
        const response = await this.http.get('/ISteamUserStats/GetPlayerAchievements/v1/', {
          params,
          timeout: 15e3,
        });
        const data = response.data;
        if (data?.playerstats?.success && data?.playerstats?.achievements) {
          const gameSchema = await this.getGameAchievements(gameId, language);
          if (gameSchema.success) {
            const combinedAchievements = this.combineUserAndSchemaData(
              data.playerstats.achievements,
              gameSchema.achievements
            );
            const earnedCount = combinedAchievements.filter(a => a.earned).length;
            return {
              success: true,
              achievements: combinedAchievements,
              totalAchievements: combinedAchievements.length,
              earnedAchievements: earnedCount,
              completionPercentage: Math.round((earnedCount / combinedAchievements.length) * 100),
              source: 'GetPlayerAchievements',
              hasUserProgress: true,
              language,
            };
          }
        }
        return {
          success: false,
          error: data?.playerstats?.error || 'Dados inv\xE1lidos na resposta',
          errorType: 'API_ERROR',
          language,
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          errorType: 'HTTP_ERROR',
          statusCode: error.response?.status,
        };
      }
    }
    // ESTRATÉGIA 2: GetUserStatsForGame (estatísticas gerais)
    // FALLBACK GLOBAL: Schema sem progresso do usuário
    async tryGetSchemaOnly(gameId, language = null) {
      const gameSchema = await this.getGameAchievements(gameId, language);
      if (gameSchema.success && gameSchema.achievements?.length > 0) {
        const achievementsFromSchema = gameSchema.achievements.map(achievement => ({
          ...achievement,
          earned: false,
          earnedTime: 0,
          globalPercent: null,
          hasUserProgress: false,
        }));
        return {
          success: true,
          achievements: achievementsFromSchema,
          totalAchievements: achievementsFromSchema.length,
          earnedAchievements: 0,
          completionPercentage: 0,
          source: 'Schema Fallback',
          hasUserProgress: false,
          message: 'Mostrando apenas lista de conquistas dispon\xEDveis.',
          language,
        };
      }
      return {
        success: false,
        error: 'Nenhuma conquista encontrada para este jogo',
        errorType: 'NO_ACHIEVEMENTS',
        language,
      };
    }
    // Método auxiliar para combinar dados do usuário com schema
    combineUserAndSchemaData(userAchievements, schemaAchievements) {
      return schemaAchievements.map(schemaAchievement => {
        const userAchievement = userAchievements.find(
          ua => (ua.apiname || ua.name) === (schemaAchievement.id || schemaAchievement.name)
        );
        return {
          id: schemaAchievement.name || schemaAchievement.id,
          name: schemaAchievement.displayName || schemaAchievement.name,
          description: schemaAchievement.description || 'Sem descri\xE7\xE3o',
          icon: schemaAchievement.icon,
          icongray: schemaAchievement.icongray,
          hidden: schemaAchievement.hidden || 0,
          earned: userAchievement ? Number(userAchievement.achieved) === 1 : false,
          earnedTime: userAchievement?.unlocktime || 0,
          globalPercent: null,
          hasUserProgress: true,
        };
      });
    }
    /**
     * Converter conquistas de um jogo para formato GSE
     */
    async convertToGSE(gameId) {
      try {
        if (!this.pathManager) {
          return {
            success: false,
            error: 'PathManager n\xE3o dispon\xEDvel',
          };
        }
        const userAchievements = await this.getUserGameAchievements(gameId);
        if (!userAchievements.success) {
          return userAchievements;
        }
        const gseAchievements = {};
        userAchievements.achievements.forEach((achievement, index) => {
          const achievementKey = `ACHIEV_${index + 1}`;
          gseAchievements[achievementKey] = {
            earned: achievement.earned,
            earned_time: achievement.earnedTime || 0,
          };
        });
        const gseSavesPath = path.join(this.pathManager.getDataPath(), 'GSE Saves', gameId);
        const achievementsFilePath = path.join(gseSavesPath, 'achievements.json');
        await fs.mkdir(gseSavesPath, { recursive: true });
        await fs.writeFile(achievementsFilePath, JSON.stringify(gseAchievements, null, 2), 'utf8');
        return {
          success: true,
          message: 'Conquistas convertidas com sucesso!',
          filePath: achievementsFilePath,
          totalAchievements: userAchievements.totalAchievements,
          earnedAchievements: userAchievements.earnedAchievements,
          completionPercentage: userAchievements.completionPercentage,
        };
      } catch (error) {
        return {
          success: false,
          error: `Erro na convers\xE3o: ${error.message}`,
        };
      }
    }
    /**
     * Descobrir Steam ID automaticamente usando múltiplas estratégias
     */
    async discoverSteamId(apiKey) {
      try {
        if (!apiKey) {
          throw new Error('API Key \xE9 obrigat\xF3ria');
        }
        const localResult = await this.discoverSteamIdFromLocalFiles();
        if (localResult.success) {
          return localResult;
        }
        throw new Error(
          'N\xE3o foi poss\xEDvel descobrir o Steam ID automaticamente. Tente configurar manualmente.'
        );
      } catch (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    }
    /**
     * ESTRATÉGIA 1: Descobrir Steam ID via arquivos locais do Steam
     */
    async discoverSteamIdFromLocalFiles() {
      try {
        const os = require('node:os');
        const path2 = require('node:path');
        const steamPaths = [
          path2.join('C:', 'Program Files (x86)', 'Steam'),
          path2.join('C:', 'Program Files', 'Steam'),
          path2.join(os.homedir(), 'AppData', 'Local', 'Steam'),
          path2.join('D:', 'Steam'),
          path2.join('E:', 'Steam'),
        ];
        for (const steamPath of steamPaths) {
          const loginUsersPath = path2.join(steamPath, 'config', 'loginusers.vdf');
          const loginData = await fs.readFile(loginUsersPath, 'utf8');
          const steamIdMatch = loginData.match(/"76561\d{12}"/g);
          if (steamIdMatch && steamIdMatch.length > 0) {
            const steamId = steamIdMatch[0].replace(/"/g, '');
            return {
              success: true,
              steamId,
              method: 'local_files',
              source: 'loginusers.vdf',
              message: `Steam ID encontrado nos arquivos locais: ${steamId}`,
            };
          }
        }
        return { success: false, error: 'Steam ID n\xE3o encontrado nos arquivos locais' };
      } catch (error) {
        return { success: false, error: `Erro ao ler arquivos locais: ${error.message}` };
      }
    }
    /**
     * Obter pastas padrão do Steam
     */
    getSteamDefaultPaths() {
      const os = require('node:os');
      const path2 = require('node:path');
      return [
        {
          path: path2.join('C:', 'Program Files (x86)', 'Steam'),
          description: 'Instala\xE7\xE3o padr\xE3o (Program Files x86)',
        },
        {
          path: path2.join('C:', 'Program Files', 'Steam'),
          description: 'Instala\xE7\xE3o padr\xE3o (Program Files)',
        },
        {
          path: path2.join(os.homedir(), 'AppData', 'Local', 'Steam'),
          description: 'Instala\xE7\xE3o local do usu\xE1rio',
        },
        {
          path: path2.join('D:', 'Steam'),
          description: 'Drive D:',
        },
        {
          path: path2.join('E:', 'Steam'),
          description: 'Drive E:',
        },
      ];
    }
    /**
     * Detectar diretório atual do Steam
     */
    async detectCurrentSteamDirectory() {
      try {
        const defaultPaths = this.getSteamDefaultPaths();
        for (const steamPath of defaultPaths) {
          const configPath = path.join(steamPath.path, 'config');
          const loginUsersPath = path.join(configPath, 'loginusers.vdf');
          await fs.access(configPath);
          await fs.access(loginUsersPath);
          return {
            success: true,
            path: steamPath.path,
            description: steamPath.description,
            message: `Diret\xF3rio Steam detectado: ${steamPath.path}`,
          };
        }
        return {
          success: false,
          error: 'Diret\xF3rio Steam n\xE3o encontrado nos locais padr\xE3o',
        };
      } catch (error) {
        return {
          success: false,
          error: `Erro ao detectar diret\xF3rio Steam: ${error.message}`,
        };
      }
    }
    /**
     * Obter detalhes do jogo
     */
    async getGameDetails(gameId) {
      try {
        const { data } = await axios.get('https://store.steampowered.com/api/appdetails', {
          params: { appids: gameId, l: 'en' },
          timeout: 15e3,
        });
        const raw = data?.[gameId];
        const gameDetails = raw && raw.success ? raw.data : null;
        if (gameDetails) {
          return {
            success: true,
            details: {
              id: gameDetails.steam_appid,
              name: gameDetails.name,
              description: gameDetails.short_description,
              headerImage: gameDetails.header_image,
              website: gameDetails.website,
              developers: gameDetails.developers || [],
              publishers: gameDetails.publishers || [],
              releaseDate: gameDetails.release_date ? gameDetails.release_date.date : null,
              genres: gameDetails.genres ? gameDetails.genres.map(g => g.description) : [],
              screenshots: gameDetails.screenshots
                ? gameDetails.screenshots.map(s => s.path_thumbnail)
                : [],
            },
          };
        } else {
          return {
            success: false,
            error: 'Detalhes do jogo n\xE3o encontrados',
          };
        }
      } catch (error) {
        return {
          success: false,
          error: `Erro ao buscar detalhes: ${error.message}`,
        };
      }
    }
  }
  module.exports = {
    SteamIntegrationManager,
  };
};
const steam_integration_default = require_steam_integration();
export { steam_integration_default as default };
