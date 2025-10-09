const require_achievements = async module => {
  const { ipcMain } = require('electron');
  const axios = require('axios');
  class AchievementsManager {
    constructor(configManager, crashReporter, debugManager) {
      this.configManager = configManager;
      this.crashReporter = crashReporter;
      this.debugManager = debugManager;
      this.apiKey = null;
      this.http = axios.create({
        baseURL: 'https://api.steampowered.com',
        timeout: 15e3,
      });
      this.isInitialized = false;
      this.cache = new Map();
      this.cacheTimeout = 10 * 60 * 1e3;
      this.initializeHandlers();
      this.initialize();
    }
    initializeHandlers() {
      ipcMain.handle('achievements:getStats', async () => {
        try {
          return await this.getStats();
        } catch (error) {
          this.debugManager.error('\u274C Erro em achievements:getStats:', error.message);
          if (this.crashReporter && this.crashReporter.reportCrash) {
            this.crashReporter.reportCrash('achievements:getStats', error, {
              timestamp: new Date().toISOString(),
            });
          }
          return {
            totalGames: 0,
            totalAchievements: 0,
            unlockedAchievements: 0,
            completionRate: 0,
            recentUnlocks: [],
          };
        }
      });
      ipcMain.handle('achievements:getByGame', async (_event, gameId) => {
        return await this.getAchievementsByGame(gameId);
      });
      ipcMain.handle('achievements:unlock', async (_event, gameId, achievementId) => {
        return await this.unlockAchievement(gameId, achievementId);
      });
      ipcMain.handle('achievements:configureSteamAPI', async (_event, apiKey) => {
        return await this.configureSteamAPI(apiKey);
      });
      ipcMain.handle('achievements:getSteamAchievements', async (_event, steamId, appId) => {
        return await this.getSteamAchievements(steamId, appId);
      });
      ipcMain.handle('achievements:clearCache', async () => {
        this.clearCache();
        return { success: true, message: 'Cache limpo com sucesso' };
      });
      ipcMain.handle('achievements:getProgress', async (_event, gameId) => {
        try {
          return await this.getProgress(gameId);
        } catch (error) {
          if (this.crashReporter && this.crashReporter.captureException) {
            this.crashReporter.captureException(error, {
              context: 'achievements:getProgress',
              extra: {
                gameId,
                timestamp: new Date().toISOString(),
              },
            });
          }
          throw error;
        }
      });
    }
    async initialize() {
      try {
        this.isInitialized = true;
        this.debugManager.log('\u2705 AchievementsManager inicializado com sucesso');
      } catch (error) {
        this.debugManager.error('\u274C Erro ao inicializar AchievementsManager:', error);
        this.crashReporter.captureException(error, {
          context: 'initializeAchievements',
          extra: { timestamp: new Date().toISOString().toISOString() },
        });
      }
    }
    async getStats() {
      try {
        const mockStats = {
          totalGames: 15,
          totalAchievements: 342,
          unlockedAchievements: 187,
          completionRate: 54.7,
          recentUnlocks: [
            {
              id: 'ach_001',
              name: 'Primeira Vit\xF3ria',
              game: 'Counter-Strike 2',
              unlockedAt: new Date(Date.now() - 864e5).toISOString(),
              // 1 dia atrás
              icon: '\u{1F3C6}',
            },
            {
              id: 'ach_002',
              name: 'Explorador',
              game: 'Grand Theft Auto V',
              unlockedAt: new Date(Date.now() - 1728e5).toISOString(),
              // 2 dias atrás
              icon: '\u{1F5FA}\uFE0F',
            },
            {
              id: 'ach_003',
              name: 'Colecionador',
              game: 'Dota 2',
              unlockedAt: new Date(Date.now() - 2592e5).toISOString(),
              // 3 dias atrás
              icon: '\u{1F48E}',
            },
          ],
          gameProgress: [
            {
              gameId: '730',
              gameName: 'Counter-Strike 2',
              totalAchievements: 25,
              unlockedAchievements: 18,
              completionRate: 72,
            },
            {
              gameId: '271590',
              gameName: 'Grand Theft Auto V',
              totalAchievements: 78,
              unlockedAchievements: 45,
              completionRate: 57.7,
            },
            {
              gameId: '570',
              gameName: 'Dota 2',
              totalAchievements: 32,
              unlockedAchievements: 28,
              completionRate: 87.5,
            },
          ],
        };
        return mockStats;
      } catch (error) {
        throw new Error(`Erro ao buscar estat\xEDsticas: ${error.message}`);
      }
    }
    async getAchievementsByGame(gameId) {
      try {
        const mockAchievements = {
          730: [
            // Counter-Strike 2
            {
              id: 'cs2_first_kill',
              name: 'Primeira Elimina\xE7\xE3o',
              description: 'Elimine um inimigo pela primeira vez',
              icon: '\u{1F3AF}',
              unlocked: true,
              unlockedAt: '2024-01-15T10:30:00Z',
              rarity: 'common',
            },
            {
              id: 'cs2_headshot',
              name: 'Tiro na Cabe\xE7a',
              description: 'Fa\xE7a 100 headshots',
              icon: '\u{1F3AF}',
              unlocked: true,
              unlockedAt: '2024-01-20T14:45:00Z',
              rarity: 'uncommon',
            },
            {
              id: 'cs2_ace',
              name: 'Ace',
              description: 'Elimine todos os 5 inimigos em uma rodada',
              icon: '\u{1F451}',
              unlocked: false,
              unlockedAt: null,
              rarity: 'rare',
            },
          ],
          271590: [
            // GTA V
            {
              id: 'gta_first_mission',
              name: 'Bem-vindo a Los Santos',
              description: 'Complete a primeira miss\xE3o',
              icon: '\u{1F334}',
              unlocked: true,
              unlockedAt: '2024-01-10T09:15:00Z',
              rarity: 'common',
            },
            {
              id: 'gta_stunt_jump',
              name: 'Saltador',
              description: 'Complete 25 saltos \xFAnicos',
              icon: '\u{1F697}',
              unlocked: false,
              unlockedAt: null,
              rarity: 'uncommon',
            },
          ],
        };
        return mockAchievements[gameId] || [];
      } catch (error) {
        throw new Error(`Erro ao buscar conquistas do jogo: ${error.message}`);
      }
    }
    async unlockAchievement(gameId, achievementId) {
      try {
        const timestamp = new Date().toISOString().toISOString();
        this.debugManager.log(
          `\u{1F3C6} Conquista desbloqueada: ${achievementId} no jogo ${gameId}`
        );
        return {
          success: true,
          message: 'Conquista desbloqueada com sucesso!',
          unlockedAt: timestamp,
        };
      } catch (error) {
        throw new Error(`Erro ao desbloquear conquista: ${error.message}`);
      }
    }
    async getProgress(gameId) {
      try {
        const mockProgress = {
          730: {
            gameId: '730',
            gameName: 'Counter-Strike 2',
            totalAchievements: 25,
            unlockedAchievements: 18,
            completionRate: 72,
            lastUpdated: new Date().toISOString().toISOString(),
          },
          271590: {
            gameId: '271590',
            gameName: 'Grand Theft Auto V',
            totalAchievements: 78,
            unlockedAchievements: 45,
            completionRate: 57.7,
            lastUpdated: new Date().toISOString().toISOString(),
          },
        };
        return (
          mockProgress[gameId] || {
            gameId,
            gameName: 'Jogo Desconhecido',
            totalAchievements: 0,
            unlockedAchievements: 0,
            completionRate: 0,
            lastUpdated: new Date().toISOString().toISOString(),
          }
        );
      } catch (error) {
        throw new Error(`Erro ao buscar progresso: ${error.message}`);
      }
    }
    async configureSteamAPI(apiKey) {
      try {
        if (!apiKey || typeof apiKey !== 'string') {
          throw new Error('API Key da Steam \xE9 obrigat\xF3ria');
        }
        const testId = '76561198146931523';
        await this.http.get('/ISteamUser/GetPlayerSummaries/v2/', {
          params: { key: apiKey, steamids: testId },
        });
        await this.configManager.set('apiSource', 'steam');
        this.apiKey = apiKey;
        return {
          success: true,
          message: 'SteamAPI configurada com sucesso!',
        };
      } catch (error) {
        this.apiKey = null;
        throw new Error(`Erro ao configurar SteamAPI: ${error.message}`);
      }
    }
    async testSteamConnection() {
      if (!this.apiKey) {
        throw new Error('Steam API n\xE3o configurada');
      }
      const testId = '76561198146931523';
      await this.http.get('/ISteamUser/GetPlayerSummaries/v2/', {
        params: { key: this.apiKey, steamids: testId },
      });
      return { success: true, message: 'Conex\xE3o com Steam estabelecida' };
    }
    async getSteamAchievements(steamId, appId) {
      if (!this.apiKey) {
        throw new Error('Steam API n\xE3o configurada');
      }
      try {
        const cacheKey = `steam_achievements_${steamId}_${appId}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
          return cached;
        }
        const schemaResp = await this.http.get('/ISteamUserStats/GetSchemaForGame/v2/', {
          params: { key: this.apiKey, appid: appId },
        });
        const gameAchievements = schemaResp?.data?.game?.availableGameStats?.achievements || [];
        const userResp = await this.http.get('/ISteamUserStats/GetPlayerAchievements/v1/', {
          params: { key: this.apiKey, steamid: steamId, appid: appId },
        });
        const userAchievements = userResp?.data?.playerstats?.achievements || [];
        const achievements = gameAchievements.map(achievement => {
          const userAchievement = userAchievements.find(
            ua => (ua.apiname || ua.name) === achievement.name
          );
          return {
            id: achievement.name,
            name: achievement.displayName,
            description: achievement.description,
            icon: achievement.icon,
            iconGray: achievement.icongray,
            hidden: achievement.hidden === 1 || achievement.hidden === true,
            unlocked: userAchievement ? Number(userAchievement.achieved) === 1 : false,
            unlockTime:
              userAchievement && (userAchievement.unlocktime || userAchievement.unlockTime)
                ? new Date(
                    (userAchievement.unlocktime || userAchievement.unlockTime) * 1e3
                  ).toISOString()
                : null,
            globalPercent: achievement.percent || 0,
          };
        });
        const result = {
          appId,
          steamId,
          achievements,
          totalAchievements: achievements.length,
          unlockedAchievements: achievements.filter(a => a.unlocked).length,
          completionRate:
            achievements.length > 0
              ? ((achievements.filter(a => a.unlocked).length / achievements.length) * 100).toFixed(
                  1
                )
              : 0,
          lastUpdated: new Date().toISOString(),
        };
        this.setCache(cacheKey, result);
        return result;
      } catch (error) {
        throw new Error(`Erro ao buscar conquistas do Steam: ${error.message}`);
      }
    }
    getFromCache(key) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      this.cache.delete(key);
      return null;
    }
    setCache(key, data) {
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
      });
    }
    clearCache() {
      this.cache.clear();
    }
    cleanup() {
      this.clearCache();
      this.apiKey = null;
    }
    getStatus() {
      return {
        isInitialized: this.isInitialized,
        steamAPIConfigured: !!this.apiKey,
        cacheSize: this.cache.size,
      };
    }
  }
  function setupAchievements(configManager, crashReporter, debugManager) {
    const achievementsManager = new AchievementsManager(configManager, crashReporter, debugManager);
    return achievementsManager;
  }
  module.exports = { AchievementsManager, setupAchievements };
};
const achievements_default = require_achievements();
export { achievements_default as default };
