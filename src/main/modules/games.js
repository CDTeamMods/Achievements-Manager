var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __commonJS = /* @__PURE__ */ __name((cb, mod) => /* @__PURE__ */ __name(function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
}, "__require"), "__commonJS");
var require_games = __commonJS({
  "src/main/modules/games.js"(exports, module) {
    const { ipcMain } = require("electron");
    const axios = require("axios");
    class GamesManager {
      static {
        __name(this, "GamesManager");
      }
      static {
        __name2(this, "GamesManager");
      }
      constructor(configManager, crashReporter, debugManager) {
        this.configManager = configManager;
        this.crashReporter = crashReporter;
        this.debugManager = debugManager;
        this.apiKey = null;
        this.http = axios.create({
          baseURL: "https://api.steampowered.com",
          timeout: 15e3
        });
        this.isInitialized = false;
        this.cache = /* @__PURE__ */ new Map();
        this.cacheTimeout = 5 * 60 * 1e3;
        this.initializeHandlers();
        this.initializeSteamAPI();
      }
      initializeHandlers() {
        ipcMain.handle("games:getAll", async () => {
          try {
            return await this.getAllGames();
          } catch (error) {
            this.debugManager.error("\u274C Erro em games:getAll:", error.message);
            if (this.crashReporter && this.crashReporter.reportCrash) {
              this.crashReporter.reportCrash("games:getAll", error, {
                timestamp: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
              });
            }
            return [];
          }
        });
        ipcMain.handle("games:getDetails", async (event, gameId) => {
          try {
            return await this.getGameDetails(gameId);
          } catch (error) {
            if (this.crashReporter && this.crashReporter.reportCrash) {
              this.crashReporter.reportCrash("games:getDetails", error, {
                gameId,
                timestamp: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
              });
            }
            throw error;
          }
        });
        ipcMain.handle("games:search", async (event, query) => {
          return await this.searchGames(query);
        });
        ipcMain.handle("games:setApiKey", async (event, apiKey) => {
          return await this.setSteamApiKey(apiKey);
        });
        ipcMain.handle("games:getStatus", async () => {
          return this.getStatus();
        });
        ipcMain.handle("games:getUserGames", async (event, steamId) => {
          return await this.getUserGames(steamId);
        });
        ipcMain.handle("games:configureSteamAPI", async (event, apiKey) => {
          return await this.configureSteamAPI(apiKey);
        });
        ipcMain.handle("games:clearCache", async () => {
          this.clearCache();
          return { success: true };
        });
      }
      async initializeSteamAPI() {
      }
      async setSteamApiKey(apiKey) {
        if (!apiKey || typeof apiKey !== "string") {
          throw new Error("API key inv\xE1lida");
        }
        const testId = "76561198146931523";
        await this.http.get("/ISteamUser/GetPlayerSummaries/v2/", {
          params: { key: apiKey, steamids: testId }
        });
        this.configManager.set("apiProvider", "steam");
        this.apiKey = apiKey;
        this.isInitialized = true;
        return {
          success: true,
          message: "API key configurada com sucesso!"
        };
      }
      // Método testConnection removido por não estar sendo utilizado
      async getAllGames() {
        if (!this.isInitialized || !this.apiKey) {
          return [];
        }
      }
      async getGameDetails(gameId) {
        if (!this.isInitialized) {
          throw new Error("Steam API n\xE3o configurada");
        }
        try {
          const { data } = await axios.get("https://store.steampowered.com/api/appdetails", {
            params: { appids: gameId, l: "en" },
            timeout: 15e3
          });
          const raw = data?.[gameId];
          const details = raw && raw.success ? raw.data : null;
          return {
            id: gameId,
            name: details?.name,
            description: details?.detailed_description || details?.short_description,
            image: details?.header_image,
            screenshots: details?.screenshots || [],
            price: details?.price_overview?.final_formatted || "Gratuito",
            developers: details?.developers || [],
            publishers: details?.publishers || [],
            release_date: details?.release_date?.date || "",
            genres: details?.genres || [],
            categories: details?.categories || [],
            achievements: details?.achievements || null
          };
        } catch (error) {
          throw new Error(`Erro ao buscar detalhes do jogo: ${error.message}`);
        }
      }
      async searchGames(query) {
        if (!this.isInitialized || !this.steamAPI) {
          throw new Error("SteamAPI n\xE3o configurada");
        }
        try {
          const mockResults = [
            {
              id: "730",
              name: "Counter-Strike 2",
              match: query.toLowerCase().includes("counter") || query.toLowerCase().includes("cs")
            },
            {
              id: "440",
              name: "Team Fortress 2",
              match: query.toLowerCase().includes("team") || query.toLowerCase().includes("tf")
            },
            { id: "570", name: "Dota 2", match: query.toLowerCase().includes("dota") },
            { id: "1172470", name: "Apex Legends", match: query.toLowerCase().includes("apex") },
            {
              id: "271590",
              name: "Grand Theft Auto V",
              match: query.toLowerCase().includes("gta") || query.toLowerCase().includes("grand")
            }
          ];
          const filteredResults = mockResults.filter((game) => game.match || game.name.toLowerCase().includes(query.toLowerCase())).map((game) => ({ id: game.id, name: game.name }));
          return filteredResults;
        } catch (error) {
          throw new Error(`Erro ao buscar jogos: ${error.message}`);
        }
      }
      getStatus() {
        return {
          isInitialized: this.isInitialized,
          hasApiKey: !!this.apiKey,
          connectionStatus: this.apiKey ? "connected" : "disconnected"
        };
      }
      /**
       * Busca todos os jogos de um usuário Steam
       * @param {string} steamId - ID do usuário Steam
       * @returns {Array} Lista de jogos do usuário
       */
      async getUserGames(steamId) {
        if (!this.isInitialized || !this.apiKey) {
          throw new Error("Steam API n\xE3o configurada");
        }
        try {
          const cacheKey = `user_games_${steamId}`;
          const cached = this.getFromCache(cacheKey);
          if (cached) {
            return cached;
          }
          const { data } = await this.http.get("/IPlayerService/GetOwnedGames/v1/", {
            params: {
              key: this.apiKey,
              steamid: steamId,
              include_appinfo: true,
              include_played_free_games: true
            }
          });
          const games = data?.response?.games || [];
          const enrichedGames = games.map((game) => ({
            appID: game.appid,
            name: game.name,
            playTime: game.playtime_forever || 0,
            lastPlayed: null,
            playtimeFormatted: this.formatPlaytime(game.playtime_forever || 0),
            headerImage: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`
          }));
          this.setCache(cacheKey, enrichedGames);
          return enrichedGames;
        } catch (error) {
          throw new Error(`Erro ao buscar jogos do usu\xE1rio: ${error.message}`);
        }
      }
      /**
       * Configura a Steam API com nova chave
       * @param {string} apiKey - Chave da Steam API
       */
      async configureSteamAPI(apiKey) {
        try {
          if (!apiKey || typeof apiKey !== "string") {
            throw new Error("Chave da API inv\xE1lida");
          }
          const testId = "76561198146931523";
          await this.http.get("/ISteamUser/GetPlayerSummaries/v2/", {
            params: { key: apiKey, steamids: testId }
          });
          this.apiKey = apiKey;
          this.isInitialized = true;
          await this.configManager.set("api.source", "steam");
          this.debugManager.log("\u2705 Steam API configurada com sucesso");
          return { success: true, message: "Steam API configurada com sucesso" };
        } catch (error) {
          this.debugManager.error("\u274C Erro ao configurar Steam API:", error);
          return { success: false, message: error.message };
        }
      }
      /**
       * Formata tempo de jogo em formato legível
       * @param {number} minutes - Minutos jogados
       * @returns {string} Tempo formatado
       */
      formatPlaytime(minutes) {
        if (!minutes || minutes === 0) return "0 minutos";
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours === 0) {
          return `${remainingMinutes} minuto${remainingMinutes !== 1 ? "s" : ""}`;
        }
        if (remainingMinutes === 0) {
          return `${hours} hora${hours !== 1 ? "s" : ""}`;
        }
        return `${hours}h ${remainingMinutes}m`;
      }
      /**
       * Gerenciamento de cache
       */
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
          timestamp: Date.now()
        });
      }
      clearCache() {
        this.cache.clear();
        this.debugManager.log("\u{1F9F9} Cache do GamesManager limpo");
      }
      /**
       * Limpeza de recursos
       */
      async cleanup() {
        try {
          this.clearCache();
          this.apiKey = null;
          this.isInitialized = false;
          this.debugManager.log("\u{1F9F9} GamesManager limpo com sucesso");
        } catch (error) {
          this.debugManager.error("\u274C Erro ao limpar GamesManager:", error);
          if (this.crashReporter) {
            this.crashReporter.captureException(error, {
              context: "GamesManager.cleanup"
            });
          }
        }
      }
    }
    async function setupGames(configManager, crashReporter, debugManager) {
      const gamesManager = new GamesManager(configManager, crashReporter, debugManager);
      return gamesManager;
    }
    __name(setupGames, "setupGames");
    __name2(setupGames, "setupGames");
    module.exports = { GamesManager, setupGames };
  }
});
var games_default = require_games();
export {
  games_default as default
};
