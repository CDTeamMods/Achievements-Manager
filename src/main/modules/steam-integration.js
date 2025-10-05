// Steam Integration Manager - Achievements Manager (Axios + Steam Web API)
const { ipcMain } = require('electron');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;

class SteamIntegrationManager {
  constructor(pathManager = null, configManager = null, debugManager = null) {
    this.pathManager = pathManager;
    this.configManager = configManager;
    this.debugManager = debugManager;
    this.http = axios.create({
      baseURL: 'https://api.steampowered.com',
      timeout: 15000,
    });
    this.apiKey = null;
    this.steamId = null;
    this.isConnected = false;

    // Sistema de cache
    this.cache = new Map();
    this.cacheConfig = {
      userGames: { ttl: 5 * 60 * 1000 }, // 5 minutos
      gameAchievements: { ttl: 30 * 60 * 1000 }, // 30 minutos
      userAchievements: { ttl: 2 * 60 * 1000 }, // 2 minutos
      gameDetails: { ttl: 60 * 60 * 1000 }, // 1 hora
    };

    this.setupIpcHandlers();

    // Carregar credenciais salvas automaticamente (sem await para não bloquear o construtor)
    this.loadSavedCredentials().catch(() => {
      // Ignorar erros na inicialização das credenciais
    });
  }

  /**
   * Carregar credenciais salvas automaticamente
   */
  async loadSavedCredentials() {
    try {
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
            `Credenciais carregadas do cache - API Key: ${credentials.apiKey ? 'Definida' : 'Não definida'}, Steam ID: ${credentials.steamId || 'Não definido'}, Connected: ${credentials.connected}`
          );
        }
      }
    } catch (error) {
      console.error('Erro ao carregar credenciais do cache:', error);
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
    const ttl = this.cacheConfig[type]?.ttl || 5 * 60 * 1000; // 5 minutos padrão
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
      // Limpar cache específico
      const prefix = `${type}:${this.steamId}:`;
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Limpar todo o cache
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

      // Estimativa aproximada do uso de memória
      stats.memoryUsage += JSON.stringify(value).length;
    }

    return stats;
  }

  // Métodos para cache de conexão Steam
  async getConnectionCachePath() {
    if (!this.pathManager) {
      return path.join(process.cwd(), 'src', 'data', 'cache', 'steam-connection.json');
    }

    // Usar o novo sistema de cache dinâmico
    const cachePath = this.pathManager.getCachePath();
    return path.join(cachePath, 'steam-connection.json');
  }

  async setConnectionStatus(connected, apiKey = null, steamId = null) {
    try {
      const cachePath = await this.getConnectionCachePath();

      // Ler dados existentes se o arquivo existir
      let existingData = {};
      try {
        await fs.access(cachePath);
        const existingContent = await fs.readFile(cachePath, 'utf8');
        existingData = JSON.parse(existingContent);
      } catch {
        // Arquivo não existe, usar dados vazios
      }

      const cacheData = {
        connected: connected,
        lastUpdated: new Date().toISOString(),
        sessionId: connected ? Date.now().toString() : null,
        apiKey: apiKey !== null ? apiKey : existingData.apiKey || '',
        steamId: steamId !== null ? steamId : existingData.steamId || '',
      };

      // Garantir que o diretório existe
      await fs.mkdir(path.dirname(cachePath), { recursive: true });

      // Salvar no arquivo
      await fs.writeFile(cachePath, JSON.stringify(cacheData, null, 2), 'utf8');

      // Atualizar estado interno
      this.isConnected = connected;
      if (apiKey) this.apiKey = apiKey;
      if (steamId) this.steamId = steamId;

      if (this.debugManager) {
        this.debugManager.log(
          'steam',
          `Cache Steam atualizado - Connected: ${connected}, API Key: ${apiKey ? 'Definida' : 'Não alterada'}, Steam ID: ${steamId || 'Não alterado'}`
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
      const cachePath = await this.getConnectionCachePath();

      // Verificar se o arquivo existe
      try {
        await fs.access(cachePath);
      } catch {
        // Arquivo não existe, retornar dados padrão
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
      const cachePath = await this.getConnectionCachePath();
      await fs.unlink(cachePath);
      this.isConnected = false;

      if (this.debugManager) {
        this.debugManager.log('steam', 'Cache de conexão Steam limpo');
      }
    } catch (error) {
      // Ignorar erro se o arquivo não existir
      if (error.code !== 'ENOENT' && this.debugManager) {
        this.debugManager.error('steam', `Erro ao limpar cache de conexão: ${error.message}`);
      }
    }
  }

  /**
   * Configurar handlers IPC para comunicação com o renderer
   */
  setupIpcHandlers() {
    // Definir API Key (Steam ID será descoberto automaticamente)
    ipcMain.handle('steam.setCredentials', async (event, apiKey, steamId = null) => {
      return await this.setCredentials(apiKey, steamId);
    });

    // Obter credenciais salvas
    ipcMain.handle('steam.getCredentials', async () => {
      return await this.getCredentials();
    });

    // Verificar conexão
    ipcMain.handle('steam.checkConnection', async () => {
      return await this.checkConnection();
    });

    // Obter jogos do usuário
    ipcMain.handle('steam.getUserGames', async (event, options = {}) => {
      const { installedOnly = false } = options;
      return await this.getUserGames(0, options);
    });

    // Obter conquistas de um jogo específico
    ipcMain.handle('steam.getGameAchievements', async (event, gameId, language = null) => {
      return await this.getGameAchievements(gameId, language);
    });

    // Obter conquistas do usuário para um jogo
    ipcMain.handle('steam.getUserGameAchievements', async (event, gameId, language = null) => {
      return await this.getUserGameAchievements(gameId, language);
    });

    // Converter conquistas para GSE
    ipcMain.handle('steam.convertToGSE', async (event, gameId) => {
      return await this.convertToGSE(gameId);
    });

    // Obter informações detalhadas do jogo
    ipcMain.handle('steam.getGameDetails', async (event, gameId) => {
      return await this.getGameDetails(gameId);
    });

    // Descobrir Steam ID automaticamente
    ipcMain.handle('steam.discoverSteamId', async (event, apiKey) => {
      return await this.discoverSteamId(apiKey);
    });

    // Gerenciamento de cache
    ipcMain.handle('steam.clearCache', async (event, type = null) => {
      this.clearCache(type);
      return { success: true, message: type ? `Cache ${type} limpo` : 'Todo o cache foi limpo' };
    });

    ipcMain.handle('steam.getCacheStats', async () => {
      return this.getCacheStats();
    });

    // Handler para testar apenas conquistas do jogo (sem usuário) - para debug
    ipcMain.handle('steam.testGameAchievements', async (event, gameId) => {
      return await this.getGameAchievements(gameId);
    });

    // Obter pastas padrão do Steam
    ipcMain.handle('steam.getSteamDefaultPaths', async () => {
      return this.getSteamDefaultPaths();
    });

    // Detectar diretório atual do Steam
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

      // Testar conexão (que agora inclui descoberta automática)
      const connectionTest = await this.testConnection(apiKey, steamId);

      if (connectionTest.success) {
        // Se Steam ID foi descoberto automaticamente, usar o descoberto
        const finalSteamId = connectionTest.autoDiscovered ? connectionTest.data.steamid : steamId;

        // Salvar credenciais apenas no cache
        await this.setConnectionStatus(true, apiKey, finalSteamId);

        // Atualizar estado interno
        this.steamId = finalSteamId;
        this.isConnected = true;

        if (this.debugManager) {
          this.debugManager.log(
            'steam',
            `Credenciais Steam salvas no cache - API Key: Definida, Steam ID: ${finalSteamId || 'Não definido'}`
          );
        }

        return {
          success: true,
          message: connectionTest.autoDiscovered
            ? `Credenciais configuradas com sucesso! Steam ID descoberto automaticamente: ${connectionTest.data.personaname}`
            : 'Credenciais configuradas com sucesso!',
          data: connectionTest.data,
          autoDiscovered: connectionTest.autoDiscovered,
        };
      } else {
        // Limpar cache de conexão em caso de falha
        await this.setConnectionStatus(false);
        this.isConnected = false;

        return {
          success: false,
          error: connectionTest.error,
          suggestion: connectionTest.suggestion,
        };
      }
    } catch (error) {
      console.error('❌ Erro ao definir credenciais Steam:', error);

      // Limpar cache de conexão em caso de erro
      await this.setConnectionStatus(false);
      this.isConnected = false;

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
          error: 'API Key e SteamID não configurados',
        };
      }

      // Testar obtendo informações básicas do usuário via Web API
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
          username: player.personaname || 'Usuário Steam',
          avatar: player.avatarfull || player.avatar || '',
          profileUrl: player.profileurl || '',
        };
      } else {
        return {
          success: false,
          error: 'Não foi possível obter informações do usuário',
        };
      }
    } catch (error) {
      console.error('❌ Erro no teste de conexão:', error);
      return {
        success: false,
        error: `Erro na conexão: ${error.message}`,
      };
    }
  }

  /**
   * Verificar status da conexão atual
   */
  async checkConnection() {
    try {
      if (!this.isConnected || !this.apiKey || !this.steamId) {
        // Tentar carregar credenciais salvas
        const credentials = await this.getCredentials();
        if (credentials.success && credentials.apiKey && credentials.steamId) {
          return await this.setCredentials(credentials.apiKey, credentials.steamId);
        }

        return {
          success: false,
          connected: false,
          error: 'Não conectado',
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
   * Testar conexão com credenciais específicas (sem salvar)
   */
  async testConnection(apiKey, steamId) {
    try {
      // Se não foram fornecidos parâmetros, usar as credenciais atuais
      const testApiKey = apiKey || this.apiKey;

      if (!testApiKey) {
        return {
          success: false,
          error: 'API Key é obrigatória',
        };
      }

      // Se Steam ID não foi fornecido, tentar descobrir automaticamente
      let testSteamId = steamId || this.steamId;

      if (!testSteamId) {
        // Tentar descobrir Steam ID automaticamente
        const discoveryResult = await this.discoverSteamId(testApiKey);

        if (discoveryResult.success) {
          testSteamId = discoveryResult.steamId;

          return {
            success: true,
            data: {
              personaname: discoveryResult.profile.personaname,
              avatar: discoveryResult.profile.avatar,
              profileurl: discoveryResult.profile.profileurl,
              steamid: discoveryResult.steamId,
            },
            autoDiscovered: true,
            gamesCount: discoveryResult.gamesCount,
            message: `Conexão bem-sucedida! ${discoveryResult.message}`,
          };
        } else {
          // Se não conseguiu descobrir, apenas validar a API Key
          try {
            const { data } = await this.http.get('/ISteamUser/GetPlayerSummaries/v2/', {
              params: {
                key: testApiKey,
                steamids: '76561197960265728', // Steam ID público para teste
              },
            });

            // Se chegou até aqui, a API Key é válida
            return {
              success: true,
              apiKeyValid: true,
              needsSteamId: false, // Mudamos para false pois tentamos descobrir automaticamente
              message:
                'API Key válida! Não foi possível descobrir seu Steam ID automaticamente. Verifique se sua biblioteca de jogos está pública.',
              suggestion:
                'Para descoberta automática, certifique-se de que sua biblioteca de jogos Steam está pública.',
              discoveryError: discoveryResult.error,
            };
          } catch (apiError) {
            console.error('❌ Erro na validação da API Key:', apiError);
            if (apiError.response?.status === 403) {
              return {
                success: false,
                error: 'API Key inválida ou sem permissões',
              };
            } else if (apiError.response?.status === 401) {
              return {
                success: false,
                error: 'API Key não autorizada',
              };
            } else if (apiError.response?.status === 429) {
              return {
                success: false,
                error: 'Muitas requisições. Tente novamente em alguns minutos',
              };
            }
            throw apiError;
          }
        }
      }

      // Testar obtendo informações básicas do usuário via Web API
      const { data } = await this.http.get('/ISteamUser/GetPlayerSummaries/v2/', {
        params: {
          key: testApiKey,
          steamids: testSteamId,
        },
      });

      const player = data?.response?.players?.[0];
      if (player && player.steamid) {
        return {
          success: true,
          data: {
            personaname: player.personaname || 'Usuário Steam',
            avatar: player.avatarfull || player.avatar || '',
            profileurl: player.profileurl || '',
            steamid: player.steamid,
          },
        };
      } else {
        return {
          success: false,
          error: 'Steam ID não encontrado ou inválido',
        };
      }
    } catch (error) {
      console.error('❌ Erro no teste de conexão Steam:', error);

      // Tratar erros específicos da API Steam
      if (error.response) {
        const status = error.response.status;
        if (status === 403) {
          return {
            success: false,
            error: 'API Key inválida ou sem permissões',
          };
        } else if (status === 401) {
          return {
            success: false,
            error: 'API Key não autorizada',
          };
        } else if (status === 429) {
          return {
            success: false,
            error: 'Muitas requisições. Tente novamente em alguns minutos',
          };
        }
      }

      return {
        success: false,
        error: `Erro na conexão: ${error.message}`,
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
    const retryDelay = 1000; // 1 segundo

    try {
      // Validação de credenciais
      if (!this.apiKey || !this.steamId) {
        return {
          success: false,
          error: 'Steam API não configurada',
          errorCode: 'CREDENTIALS_MISSING',
          suggestion: 'Configure sua API Key e Steam ID nas configurações',
        };
      }

      // Se apenas jogos instalados são solicitados, usar otimização
      if (options && options.installedOnly && global.steamLocalGamesManager) {
        return await this.getInstalledGamesOptimized(retryCount);
      }

      // Verificar cache primeiro (apenas para busca completa)
      const cachedGames = this.getCache('userGames');
      if (cachedGames) {
        return cachedGames;
      }

      // Fazer requisição com timeout personalizado e parâmetros otimizados
      const { data } = await this.http.get('/IPlayerService/GetOwnedGames/v1/', {
        params: {
          key: this.apiKey,
          steamid: this.steamId,
          include_appinfo: true,
          include_played_free_games: true,
          include_extended_appinfo: true, // Informações estendidas dos jogos
          skip_unvetted_apps: false, // Incluir jogos não verificados
          language: 'portuguese', // Idioma para nomes dos jogos
          format: 'json',
        },
        timeout: 30000, // 30 segundos para biblioteca completa
      });

      // Validação da resposta
      if (!data || !data.response) {
        throw new Error('Resposta inválida da Steam API');
      }

      const games = data.response.games || [];
      const gameCount = data.response.game_count || 0;

      if (games.length > 0) {
        // Filtrar jogos válidos (com nome e appid)
        const validGames = games.filter(
          game => game.appid && game.name && game.name.trim() !== '' && game.appid > 0
        );

        // Ordenar por tempo jogado (decrescente) e então por nome
        const sortedGames = validGames.sort((a, b) => {
          // Priorizar jogos jogados recentemente
          if (b.playtime_2weeks !== a.playtime_2weeks) {
            return (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0);
          }
          // Depois por tempo total
          if (b.playtime_forever !== a.playtime_forever) {
            return (b.playtime_forever || 0) - (a.playtime_forever || 0);
          }
          // Por último, ordem alfabética
          return (a.name || '').localeCompare(b.name || '');
        });

        // Mapear jogos com validação de URLs de imagem
        const mappedGames = sortedGames.map(game => {
          const baseImageUrl = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}`;

          return {
            id: String(game.appid),
            name: game.name.trim(),
            playtimeForever: Math.max(0, game.playtime_forever || 0),
            playTime2Weeks: Math.max(0, game.playtime_2weeks || 0),
            imgIconUrl: game.img_icon_url ? `${baseImageUrl}/${game.img_icon_url}.jpg` : null,
            imgLogoUrl: game.img_logo_url ? `${baseImageUrl}/${game.img_logo_url}.jpg` : null,
            hasAchievements: true, // Será verificado posteriormente se necessário
            lastPlayed: game.rtime_last_played ? new Date(game.rtime_last_played * 1000) : null,
          };
        });

        let finalGames = mappedGames;

        // Filtrar apenas jogos instalados se solicitado
        if (options && options.installedOnly) {
          try {
            // Obter referência ao SteamLocalGamesManager do processo principal
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

                // Verificar se algum jogo instalado está na lista da API
                const apiGameIds = new Set(mappedGames.map(game => game.id));
                const matchingGames = Array.from(installedAppIds).filter(id => apiGameIds.has(id));

                finalGames = mappedGames.filter(game => installedAppIds.has(game.id));
              } else {
              }
            } else {
            }
          } catch (error) {
            // Continua com todos os jogos se houver erro
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

        // Armazenar no cache (apenas se não for filtro de instalados)
        if (!options || !options.installedOnly) {
          this.setCache('userGames', result);
        }

        return result;
      } else {
        // Biblioteca vazia ou perfil privado
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
            ? 'Biblioteca vazia ou perfil privado. Verifique se sua biblioteca de jogos está pública.'
            : null,
        };

        // Armazenar no cache
        this.setCache('userGames', result);

        return result;
      }
    } catch (error) {
      // Erro ao obter jogos

      // Tratamento específico de erros HTTP
      if (error.response) {
        const status = error.response.status;
        const statusText = error.response.statusText;

        switch (status) {
          case 401:
            return {
              success: false,
              error: 'API Key inválida ou não autorizada',
              errorCode: 'UNAUTHORIZED',
              suggestion: 'Verifique se sua API Key está correta e ativa',
            };

          case 403:
            return {
              success: false,
              error: 'Acesso negado. Perfil pode estar privado',
              errorCode: 'FORBIDDEN',
              suggestion: 'Verifique se sua biblioteca de jogos está pública no Steam',
            };

          case 429:
            // Rate limiting - tentar novamente após delay
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, retryDelay * (retryCount + 1)));
              return this.getUserGames(retryCount + 1);
            }
            return {
              success: false,
              error: 'Muitas requisições. Tente novamente em alguns minutos',
              errorCode: 'RATE_LIMITED',
              suggestion: 'Aguarde alguns minutos antes de tentar novamente',
            };

          case 500:
          case 502:
          case 503:
            // Erro do servidor Steam - tentar novamente
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              return this.getUserGames(retryCount + 1);
            }
            return {
              success: false,
              error: 'Servidores Steam temporariamente indisponíveis',
              errorCode: 'SERVER_ERROR',
              suggestion: 'Tente novamente em alguns minutos',
            };

          default:
            return {
              success: false,
              error: `Erro HTTP ${status}: ${statusText}`,
              errorCode: 'HTTP_ERROR',
              suggestion: 'Verifique sua conexão com a internet',
            };
        }
      }

      // Erro de timeout ou conexão
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return this.getUserGames(retryCount + 1);
        }
        return {
          success: false,
          error: 'Timeout na conexão com Steam API',
          errorCode: 'TIMEOUT',
          suggestion: 'Verifique sua conexão com a internet e tente novamente',
        };
      }

      // Erro de rede
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return {
          success: false,
          error: 'Não foi possível conectar com a Steam API',
          errorCode: 'NETWORK_ERROR',
          suggestion: 'Verifique sua conexão com a internet',
        };
      }

      // Erro genérico
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
    const retryDelay = 1000;

    try {
      // Obter lista de jogos instalados
      const steamLocalGames = global.steamLocalGamesManager;
      if (!steamLocalGames) {
        return {
          success: false,
          error: 'Gerenciador de jogos locais não disponível',
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

      // 🚀 NOVA ESTRATÉGIA: Busca DIRETA primeiro (mais eficiente)
      const installedAppIdsNumbers = installedAppIds.map(id => parseInt(id, 10));
      const directSearchResult = await this.getInstalledGamesDirectSearch(installedAppIdsNumbers);

      if (directSearchResult.success && directSearchResult.games.length > 0) {
        return directSearchResult;
      }

      // 📚 FALLBACK: Se busca direta falhar, usar método antigo (biblioteca completa)

      // Buscar detalhes de todos os jogos do usuário (necessário para obter nomes e informações)
      const { data } = await this.http.get('/IPlayerService/GetOwnedGames/v1/', {
        params: {
          key: this.apiKey,
          steamid: this.steamId,
          include_appinfo: true,
          include_played_free_games: true,
          include_extended_appinfo: true, // Informações estendidas dos jogos
          skip_unvetted_apps: false, // Incluir jogos não verificados
          language: 'portuguese', // Idioma para nomes dos jogos
          format: 'json',
        },
        timeout: 30000,
      });

      if (!data || !data.response) {
        throw new Error('Resposta inválida da Steam API');
      }

      const allGames = data.response.games || [];

      // Usar a variável já declarada anteriormente
      const installedAppIdsSet = new Set(installedAppIdsNumbers);

      // Filtrar apenas jogos instalados usando comparação numérica
      const installedGames = allGames.filter(
        game =>
          game.appid && game.name && game.name.trim() !== '' && installedAppIdsSet.has(game.appid)
      );

      // Se não encontrou nenhum jogo, vamos tentar uma busca individual por cada ID
      if (installedGames.length === 0 && installedAppIdsNumbers.length > 0) {
        return await this.getInstalledGamesByIndividualSearch(installedAppIdsNumbers);
      }

      // Mapear jogos com informações completas
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
          lastPlayed: game.rtime_last_played ? new Date(game.rtime_last_played * 1000) : null,
        };
      });

      // Ordenar por tempo jogado
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
      // Erro na busca otimizada

      // Retry logic similar ao getUserGames
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
      // Obter lista de jogos instalados se não fornecida
      if (!installedAppIds) {
        const steamLocalGames = global.steamLocalGamesManager;
        if (!steamLocalGames) {
          return {
            success: false,
            error: 'Gerenciador de jogos locais não disponível',
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
      const batchSize = 10; // Aumentar batch size para melhor performance
      const maxConcurrent = 3; // Máximo de lotes simultâneos

      // Processar em lotes com controle de concorrência
      for (let i = 0; i < installedAppIds.length; i += batchSize * maxConcurrent) {
        const megaBatch = [];

        // Criar até 3 lotes simultâneos
        for (let j = 0; j < maxConcurrent && i + j * batchSize < installedAppIds.length; j++) {
          const startIdx = i + j * batchSize;
          const batch = installedAppIds.slice(startIdx, startIdx + batchSize);
          if (batch.length > 0) {
            megaBatch.push(batch);
          }
        }

        // Processar lotes em paralelo
        const megaBatchPromises = megaBatch.map(async (batch, batchIndex) => {
          const batchResults = [];

          for (const appId of batch) {
            try {
              // Buscar informações básicas do jogo via Steam Store API
              const storeResponse = await this.http.get(
                `https://store.steampowered.com/api/appdetails`,
                {
                  params: {
                    appids: appId,
                    l: 'portuguese',
                    cc: 'BR',
                    filters: 'basic,price_overview',
                  },
                  timeout: 8000,
                }
              );

              if (
                storeResponse.data &&
                storeResponse.data[appId] &&
                storeResponse.data[appId].success
              ) {
                const gameData = storeResponse.data[appId].data;

                // Buscar tempo de jogo do usuário (apenas para este jogo específico)
                let playtimeData = null;
                try {
                  const playtimeResponse = await this.http.get(
                    '/IPlayerService/GetOwnedGames/v1/',
                    {
                      params: {
                        key: this.apiKey,
                        steamid: this.steamId,
                        appids_filter: [appId],
                        include_appinfo: false, // Não precisamos de info extra
                        format: 'json',
                      },
                      timeout: 5000,
                    }
                  );

                  if (playtimeResponse.data?.response?.games?.length > 0) {
                    playtimeData = playtimeResponse.data.response.games[0];
                  }
                } catch (playtimeError) {}

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
                  hasAchievements: true, // Assumir que tem conquistas
                  lastPlayed: playtimeData?.rtime_last_played
                    ? new Date(playtimeData.rtime_last_played * 1000)
                    : null,
                  price: gameData.price_overview?.final_formatted || 'Gratuito',
                  developer: gameData.developers?.[0] || 'Desconhecido',
                  publisher: gameData.publishers?.[0] || 'Desconhecido',
                };

                batchResults.push(gameInfo);
              } else {
              }
            } catch (error) {}

            // Pequena pausa entre requests para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
          }

          return batchResults;
        });

        const megaBatchResults = await Promise.all(megaBatchPromises);
        const validGames = megaBatchResults.flat();
        foundGames.push(...validGames);

        // Pausa entre mega-lotes
        if (i + batchSize * maxConcurrent < installedAppIds.length) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      // Ordenar por tempo jogado
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
          efficiencyGain: `Evitou baixar ${1127 - installedAppIds.length} jogos desnecessários`,
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
      const batchSize = 5; // Processar em lotes para evitar rate limiting

      for (let i = 0; i < installedAppIds.length; i += batchSize) {
        const batch = installedAppIds.slice(i, i + batchSize);

        const batchPromises = batch.map(async appId => {
          try {
            // Usar Steam Store API para obter informações do jogo
            const response = await this.http.get(`https://store.steampowered.com/api/appdetails`, {
              params: {
                appids: appId,
                l: 'portuguese',
                cc: 'BR',
              },
              timeout: 10000,
            });

            if (response.data && response.data[appId] && response.data[appId].success) {
              const gameData = response.data[appId].data;

              // Buscar tempo de jogo na biblioteca do usuário
              let playtimeData = null;
              try {
                const playtimeResponse = await this.http.get('/IPlayerService/GetOwnedGames/v1/', {
                  params: {
                    key: this.apiKey,
                    steamid: this.steamId,
                    appids_filter: [appId],
                    include_appinfo: true,
                    format: 'json',
                  },
                  timeout: 5000,
                });

                if (playtimeResponse.data?.response?.games?.length > 0) {
                  playtimeData = playtimeResponse.data.response.games[0];
                }
              } catch (playtimeError) {}

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
                  ? new Date(playtimeData.rtime_last_played * 1000)
                  : null,
                price: gameData.price_overview?.final_formatted || 'Gratuito',
                developer: gameData.developers?.[0] || 'Desconhecido',
                publisher: gameData.publishers?.[0] || 'Desconhecido',
              };
            }

            return null;
          } catch (error) {
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        const validGames = batchResults.filter(game => game !== null);
        foundGames.push(...validGames);

        // Pequena pausa entre lotes para evitar rate limiting
        if (i + batchSize < installedAppIds.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Ordenar por tempo jogado
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
          error: 'Steam API não configurada',
        };
      }

      // Detectar idioma do usuário se não fornecido
      if (!language) {
        language = await this.detectUserLanguage();
      }

      // Verificar cache primeiro (incluindo idioma na chave)
      const cachedAchievements = this.getCache('gameAchievements', gameId, language);
      if (cachedAchievements) {
        return cachedAchievements;
      }

      // Tentar primeiro com o idioma solicitado
      let result = await this.fetchGameAchievements(gameId, language);

      // Se falhou e não é inglês, tentar fallback para inglês
      if (!result.success && language !== 'en') {
        result = await this.fetchGameAchievements(gameId, 'en');
        if (result.success) {
          result.fallbackLanguage = 'en';
          result.requestedLanguage = language;
        }
      }

      // Armazenar no cache se bem-sucedido
      if (result.success) {
        this.setCache('gameAchievements', result, gameId, language);
      }

      return result;
    } catch (error) {
      // Log detalhado do erro para debug
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

      // Adicionar informações específicas do erro HTTP
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

      // Adicionar parâmetro de idioma se especificado
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
          language: language,
        };
      } else {
        return {
          success: true,
          achievements: [],
          totalAchievements: 0,
          language: language,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Erro ao buscar conquistas: ${error.message}`,
        language: language,
      };
    }
  }

  /**
   * Detectar idioma do usuário a partir das configurações
   */
  async detectUserLanguage() {
    try {
      // Tentar obter idioma das configurações salvas
      if (this.pathManager) {
        const settingsPath = path.join(this.pathManager.getDataPath(), 'settings', 'app.json');
        try {
          const settingsContent = await fs.readFile(settingsPath, 'utf8');
          const settings = JSON.parse(settingsContent);
          if (settings.language) {
            const mappedLanguage = this.mapLanguageToSteamCode(settings.language);

            return mappedLanguage;
          }
        } catch (error) {
          // Arquivo de configurações não existe ou é inválido
        }
      }

      // Fallback para idioma do sistema
      const systemLanguage = Intl.DateTimeFormat().resolvedOptions().locale;
      const mappedLanguage = this.mapLanguageToSteamCode(systemLanguage);

      return mappedLanguage;
    } catch (error) {
      // Fallback final para inglês

      return 'en';
    }
  }

  /**
   * Mapear código de idioma para código da Steam API
   */
  mapLanguageToSteamCode(languageCode) {
    const languageMap = {
      'pt-BR': 'brazilian', // Testando código alternativo da Steam
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
          `🔍 Buscando conquistas do usuário para o jogo ${gameId} (versão simplificada)`
        );
      }

      // Validar credenciais
      if (!this.apiKey || !this.steamId) {
        return {
          success: false,
          error: 'Steam API não configurada',
          errorType: 'MISSING_CREDENTIALS',
        };
      }

      // Detectar idioma se não fornecido
      if (!language) {
        language = await this.detectUserLanguage();
      }

      // Estratégia 1: Tentar GetPlayerAchievements (método principal)
      const userAchievementsResult = await this.tryGetPlayerAchievements(gameId, language);

      if (userAchievementsResult.success) {
        return {
          ...userAchievementsResult,
          strategy: 'GetPlayerAchievements',
          language: language,
        };
      }

      // Fallback para inglês se o idioma original falhou
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

      // Fallback: Schema global sem progresso do usuário
      const schemaResult = await this.tryGetSchemaOnly(gameId, language);

      return {
        ...schemaResult,
        strategy: 'SchemaOnly',
        language: language,
      };
    } catch (error) {
      console.error('Erro geral no getUserGameAchievements:', error);

      if (this.debugManager) {
        this.debugManager.error('Erro geral ao buscar conquistas do usuário:', error);
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

      // Adicionar parâmetro de idioma se especificado
      if (language) {
        params.l = language;
      }

      const response = await this.http.get('/ISteamUserStats/GetPlayerAchievements/v1/', {
        params,
        timeout: 15000,
      });

      const data = response.data;

      if (data?.playerstats?.success && data?.playerstats?.achievements) {
        // Obter schema para combinar com dados do usuário
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
            language: language,
          };
        }
      }

      return {
        success: false,
        error: data?.playerstats?.error || 'Dados inválidos na resposta',
        errorType: 'API_ERROR',
        language: language,
      };
    } catch (error) {
      console.error('Erro em GetPlayerAchievements:', error.message);
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
    try {
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
          message: 'Mostrando apenas lista de conquistas disponíveis.',
          language: language,
        };
      }

      return {
        success: false,
        error: 'Nenhuma conquista encontrada para este jogo',
        errorType: 'NO_ACHIEVEMENTS',
        language: language,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Falha ao obter schema do jogo',
        errorType: 'SCHEMA_FALLBACK_ERROR',
      };
    }
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
        description: schemaAchievement.description || 'Sem descrição',
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
          error: 'PathManager não disponível',
        };
      }

      // Obter conquistas do usuário
      const userAchievements = await this.getUserGameAchievements(gameId);
      if (!userAchievements.success) {
        return userAchievements;
      }

      // Converter para formato GSE
      const gseAchievements = {};

      userAchievements.achievements.forEach((achievement, index) => {
        // Usar formato similar ao exemplo fornecido
        const achievementKey = `ACHIEV_${index + 1}`;
        gseAchievements[achievementKey] = {
          earned: achievement.earned,
          earned_time: achievement.earnedTime || 0,
        };
      });

      // Definir pasta de destino
      const gseSavesPath = path.join(this.pathManager.getDataPath(), 'GSE Saves', gameId);
      const achievementsFilePath = path.join(gseSavesPath, 'achievements.json');

      // Criar diretório se não existir
      await fs.mkdir(gseSavesPath, { recursive: true });

      // Salvar arquivo achievements.json
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
        error: `Erro na conversão: ${error.message}`,
      };
    }
  }

  /**
   * Descobrir Steam ID automaticamente usando múltiplas estratégias
   */
  async discoverSteamId(apiKey) {
    try {
      if (!apiKey) {
        throw new Error('API Key é obrigatória');
      }

      // ESTRATÉGIA ÚNICA: Descobrir via arquivos locais do Steam
      const localResult = await this.discoverSteamIdFromLocalFiles();
      if (localResult.success) {
        return localResult;
      }

      throw new Error(
        'Não foi possível descobrir o Steam ID automaticamente. Tente configurar manualmente.'
      );
    } catch (error) {
      console.error('Erro na descoberta do Steam ID:', error.message);
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
      const os = require('os');
      const path = require('path');

      // Possíveis localizações do Steam no Windows
      const steamPaths = [
        path.join('C:', 'Program Files (x86)', 'Steam'),
        path.join('C:', 'Program Files', 'Steam'),
        path.join(os.homedir(), 'AppData', 'Local', 'Steam'),
        path.join('D:', 'Steam'),
        path.join('E:', 'Steam'),
      ];

      for (const steamPath of steamPaths) {
        try {
          const loginUsersPath = path.join(steamPath, 'config', 'loginusers.vdf');
          const configPath = path.join(steamPath, 'config', 'config.vdf');

          // Tentar ler loginusers.vdf
          try {
            const loginData = await fs.readFile(loginUsersPath, 'utf8');
            const steamIdMatch = loginData.match(/"76561\d{12}"/g);

            if (steamIdMatch && steamIdMatch.length > 0) {
              const steamId = steamIdMatch[0].replace(/"/g, '');

              // Steam ID encontrado
              return {
                success: true,
                steamId: steamId,
                method: 'local_files',
                source: 'loginusers.vdf',
                message: `Steam ID encontrado nos arquivos locais: ${steamId}`,
              };
            }
          } catch (error) {
            // Continua para o próximo arquivo
          }

          // Tentar ler config.vdf
          try {
            const configData = await fs.readFile(configPath, 'utf8');
            const steamIdMatch = configData.match(/"76561\d{12}"/g);

            if (steamIdMatch && steamIdMatch.length > 0) {
              const steamId = steamIdMatch[0].replace(/"/g, '');

              return {
                success: true,
                steamId: steamId,
                method: 'local_files',
                source: 'config.vdf',
                message: `Steam ID encontrado nos arquivos locais: ${steamId}`,
              };
            }
          } catch (error) {
            // Continua para o próximo caminho
          }
        } catch (error) {
          // Continua para o próximo caminho do Steam
          continue;
        }
      }

      return { success: false, error: 'Steam ID não encontrado nos arquivos locais' };
    } catch (error) {
      return { success: false, error: `Erro ao ler arquivos locais: ${error.message}` };
    }
  }

  /**
   * Obter pastas padrão do Steam
   */
  getSteamDefaultPaths() {
    const os = require('os');
    const path = require('path');

    return [
      {
        path: path.join('C:', 'Program Files (x86)', 'Steam'),
        description: 'Instalação padrão (Program Files x86)',
      },
      {
        path: path.join('C:', 'Program Files', 'Steam'),
        description: 'Instalação padrão (Program Files)',
      },
      {
        path: path.join(os.homedir(), 'AppData', 'Local', 'Steam'),
        description: 'Instalação local do usuário',
      },
      {
        path: path.join('D:', 'Steam'),
        description: 'Drive D:',
      },
      {
        path: path.join('E:', 'Steam'),
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
        try {
          const configPath = path.join(steamPath.path, 'config');
          const loginUsersPath = path.join(configPath, 'loginusers.vdf');

          // Verificar se o diretório existe e contém arquivos do Steam
          await fs.access(configPath);
          await fs.access(loginUsersPath);

          return {
            success: true,
            path: steamPath.path,
            description: steamPath.description,
            message: `Diretório Steam detectado: ${steamPath.path}`,
          };
        } catch (error) {
          // Continua para o próximo caminho
          continue;
        }
      }

      return {
        success: false,
        error: 'Diretório Steam não encontrado nos locais padrão',
      };
    } catch (error) {
      return {
        success: false,
        error: `Erro ao detectar diretório Steam: ${error.message}`,
      };
    }
  }

  /**
   * Obter detalhes do jogo
   */
  async getGameDetails(gameId) {
    try {
      // Detalhes do jogo via Store API (não requer token)
      const { data } = await axios.get('https://store.steampowered.com/api/appdetails', {
        params: { appids: gameId, l: 'en' },
        timeout: 15000,
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
          error: 'Detalhes do jogo não encontrados',
        };
      }
    } catch (error) {
      console.error('❌ Erro ao obter detalhes do jogo:', error);
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
