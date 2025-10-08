var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2(
  (target, value) => __defProp22(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp222 = Object.defineProperty;
var __name222 = /* @__PURE__ */ __name22(
  (target, value) => __defProp222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp2222 = Object.defineProperty;
var __name2222 = /* @__PURE__ */ __name222(
  (target, value) => __defProp2222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp22222 = Object.defineProperty;
var __name22222 = /* @__PURE__ */ __name2222(
  (target, value) => __defProp22222(target, "name", { value, configurable: true }),
  "__name"
);
import { initI18n } from "./i18n-hot.js";
import { lazyLoader } from "./lazy-loader.js";
import { codeSplitter } from "./code-splitter.js";
class AchievementsApp {
  static {
    __name(this, "AchievementsApp");
  }
  static {
    __name2(this, "AchievementsApp");
  }
  static {
    __name22(this, "AchievementsApp");
  }
  static {
    __name222(this, "AchievementsApp");
  }
  static {
    __name2222(this, "AchievementsApp");
  }
  static {
    __name22222(this, "AchievementsApp");
  }
  constructor() {
    this.isElectron = typeof window !== "undefined" && window.electronAPI;
    this.lazyLoader = lazyLoader;
    this.codeSplitter = codeSplitter;
    this.modules = {};
    this.loadedChunks = /* @__PURE__ */ new Set();
    this.currentPage = "dashboard";
    this.isSetupComplete = false;
    this.isLoading = true;
    this.init();
  }
  /**
   * Carrega chunks críticos necessários para inicialização
   */
  async loadCriticalChunks() {
    const coreChunk = await this.codeSplitter.loadChunk("core");
    this.loadedChunks.add("core");
    this.modules.state = new coreChunk.StateManager();
    this.modules.navigation = new coreChunk.NavigationManager(this);
    this.modules.components = new coreChunk.ComponentManager();
  }
  /**
   * Carrega módulos essenciais para funcionamento básico
   */
  async loadEssentialModules() {
    const [settingsChunk, gamesChunk] = await Promise.all([
      this.codeSplitter.loadChunk("settings"),
      this.codeSplitter.loadChunk("games")
    ]);
    this.modules.settings = new settingsChunk.SettingsManager(this);
    this.modules.events = new gamesChunk.EventsManager(this);
    this.modules.helpers = new gamesChunk.HelpersManager(this);
    this.loadedChunks.add("settings");
    this.loadedChunks.add("games");
  }
  /**
   * Carrega módulos não críticos em background
   */
  async loadNonCriticalModules() {
    setTimeout(async () => {
      const [performanceChunk, steamChunk] = await Promise.allSettled([
        this.codeSplitter.loadChunk("performance"),
        this.codeSplitter.loadChunk("steam")
      ]);
      if (performanceChunk.status === "fulfilled" && performanceChunk.value.PerformanceMonitor) {
        this.modules.performance = new performanceChunk.value.PerformanceMonitor();
        this.loadedChunks.add("performance");
        if (typeof this.modules.performance.start === "function") {
          this.modules.performance.start();
        }
      }
      if (steamChunk.status === "fulfilled" && steamChunk.value.SteamGamesManager) {
        this.modules.steamGames = new steamChunk.value.SteamGamesManager(this);
        this.loadedChunks.add("steam");
      }
    }, 100);
  }
  /**
   * Fallback para carregamento tradicional se lazy loading falhar
   */
  async fallbackInit() {
    const [
      { StateManager: StateManager2 },
      { NavigationManager: NavigationManager2 },
      { ComponentManager: ComponentManager2 },
      { SettingsManager: SettingsManager2 },
      { EventsManager: EventsManager2 },
      { HelpersManager: HelpersManager2 },
      { PerformanceMonitor: PerformanceMonitor2 }
    ] = await Promise.all([
      import("./modules/state.js"),
      import("./modules/navigation.js"),
      import("./components.js"),
      import("./modules/settings.js"),
      import("./modules/events.js"),
      import("./modules/helpers.js"),
      import("./performance.js")
    ]);
    this.modules.state = new StateManager2();
    this.modules.navigation = new NavigationManager2(this);
    this.modules.components = new ComponentManager2();
    this.modules.settings = new SettingsManager2(this);
    this.modules.events = new EventsManager2(this);
    this.modules.helpers = new HelpersManager2(this);
    this.modules.performance = new PerformanceMonitor2();
    const { SteamGamesManager: SteamGamesManager2 } = await import("./modules/steam-games.js");
    this.modules.steamGames = new SteamGamesManager2(this);
    window.steamGamesManager = this.modules.steamGames;
    if (this.modules.navigation && this.modules.navigation.navigateTo) {
      setTimeout(() => {
        this.modules.navigation.navigateTo("dashboard", true);
      }, 100);
    }
  }
  // Delegação para o HelpersManager
  async t(key, fallback = key) {
    if (this.modules.helpers) {
      return await this.modules.helpers.t(key, fallback);
    }
    return fallback;
  }
  isElectronAPIAvailable(methodName = null) {
    if (this.modules.helpers) {
      return this.modules.helpers.isElectronAPIAvailable(methodName);
    }
    return false;
  }
  async safeElectronAPICall(methodName, ...args) {
    if (this.modules.helpers) {
      return await this.modules.helpers.safeElectronAPICall(methodName, ...args);
    }
    return null;
  }
  showError(message) {
    if (this.modules.helpers) {
      this.modules.helpers.showError(message);
    }
  }
  showSuccess(message) {
    if (this.modules.helpers) {
      this.modules.helpers.showSuccess(message);
    }
  }
  showWarning(message) {
    if (this.modules.helpers) {
      this.modules.helpers.showWarning(message);
    }
  }
  // Métodos de Backup
  async createBackup() {
    try {
      if (this.modules.helpers) {
        this.modules.helpers.showNotification(await this.t("backup.creating"), "info");
      }
      if (this.isElectronAPIAvailable("backup")) {
        const result = await this.safeElectronAPICall("backup.create");
        if (result.success) {
          if (this.modules.helpers) {
            this.modules.helpers.showNotification(
              await this.t("backup.create.success", "Backup criado com sucesso!"),
              "success"
            );
          }
        } else {
          throw new Error(result.error || "Erro ao criar backup");
        }
      } else {
        const data = {
          games: this.modules.state?.get("games") || [],
          achievements: this.modules.state?.get("achievements") || [],
          settings: this.modules.settings?.getAll() || {},
          timestamp: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `achievements_backup_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        if (this.modules.helpers) {
          this.modules.helpers.showNotification(
            await this.t("backup.download.success", "Backup baixado com sucesso!"),
            "success"
          );
        }
      }
    } catch (error) {
      if (this.modules.helpers) {
        this.modules.helpers.showNotification(
          await this.t("backup.error") + ": " + error.message,
          "error"
        );
      }
    }
  }
  async restoreBackup() {
    try {
      if (this.isElectronAPIAvailable("backup")) {
        const result = await this.safeElectronAPICall("backup.restore");
        if (result.success) {
          if (this.modules.helpers) {
            this.modules.helpers.showNotification(
              await this.t("backup.restore.success", "Backup restaurado com sucesso!"),
              "success"
            );
          }
          await this.loadData();
        } else {
          throw new Error(result.error || "Erro ao restaurar backup");
        }
      } else {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
          const fileList = e.target.files;
          if (fileList && fileList.length > 0) {
            const file = fileList[0];
            try {
              const text = await file.text();
              const data = JSON.parse(text);
              if (data.games && this.modules.state) {
                this.modules.state.set("games", data.games);
              }
              if (data.achievements && this.modules.state) {
                this.modules.state.set("achievements", data.achievements);
              }
              if (data.settings && this.modules.settings) {
                Object.entries(data.settings).forEach(([key, value]) => {
                  this.modules.settings.set(key, value);
                });
              }
              if (this.modules.helpers) {
                this.modules.helpers.showNotification(
                  await this.t("backup.restore.success", "Backup restaurado com sucesso!"),
                  "success"
                );
              }
              if (this.modules.navigation) {
                this.modules.navigation.refreshCurrentPage();
              }
            } catch (error) {
              if (this.modules.helpers) {
                this.modules.helpers.showNotification(
                  await this.t("backup.processError") + ": " + error.message,
                  "error"
                );
              }
            }
          }
        };
        input.click();
      }
    } catch (error) {
      if (this.modules.helpers) {
        this.modules.helpers.showNotification(
          await this.t("backup.restoreError") + ": " + error.message,
          "error"
        );
      }
    }
  }
  // Métodos de Configurações
  async savePageSettings() {
    try {
      const themeSelect = document.getElementById("themeSelect");
      const languageSelect = document.getElementById("languageSelect");
      const liteModeToggle = document.getElementById("liteModeToggle");
      const virtualScrollToggle = document.getElementById("virtualScrollToggle");
      const achievementNotificationsToggle = document.getElementById(
        "achievementNotificationsToggle"
      );
      const notificationSoundsToggle = document.getElementById("notificationSoundsToggle");
      if (themeSelect) this.modules.settings.set("theme", themeSelect.value);
      if (languageSelect) this.modules.settings.set("language", languageSelect.value);
      if (liteModeToggle) this.modules.settings.set("liteMode", liteModeToggle.checked);
      if (virtualScrollToggle)
        this.modules.settings.set("virtualScroll", virtualScrollToggle.checked);
      if (achievementNotificationsToggle)
        this.modules.settings.set(
          "achievementNotifications",
          achievementNotificationsToggle.checked
        );
      if (notificationSoundsToggle)
        this.modules.settings.set("notificationSounds", notificationSoundsToggle.checked);
      this.modules.helpers.showNotification(
        await this.t("settings.save.success", "Configura\xE7\xF5es salvas com sucesso!"),
        "success"
      );
    } catch (error) {
      this.modules.helpers.showNotification(
        await this.t("settings.save.error", "Erro ao salvar configura\xE7\xF5es") + ": " + error.message,
        "error"
      );
    }
  }
  async resetSettings() {
    try {
      this.modules.settings.reset();
      this.modules.helpers.showNotification(
        await this.t(
          "settings.reset.success",
          "Configura\xE7\xF5es restauradas para os padr\xF5es!"
        ),
        "success"
      );
      this.modules.navigation.navigateTo("configuracoes");
    } catch (error) {
      this.modules.helpers.showNotification(
        await this.t("settings.reset.error", "Erro ao resetar configura\xE7\xF5es") + ": " + error.message,
        "error"
      );
    }
  }
  async loadData() {
    if (this.isElectronAPIAvailable("games")) {
      const games = await this.safeElectronAPICall("games.getAll");
      this.modules.state.set("games", games || []);
    }
    if (this.isElectronAPIAvailable("achievements")) {
      const achievements = await this.safeElectronAPICall("achievements.getAll");
      this.modules.state.set("achievements", achievements || []);
    }
  }
  async init() {
    const isProduction = !window.location.href.includes("localhost") || window.electronAPI;
    if (isProduction) {
      await this.fallbackInit();
    } else {
      await this.loadCriticalChunks();
      await this.loadEssentialModules();
    }
    await this.initI18nSystem();
    if (window.i18nHot && window.i18nHot.reloadTranslations) {
      await window.i18nHot.reloadTranslations();
    }
    if (this.modules.settings && this.modules.settings.loadSettings) {
      await this.modules.settings.loadSettings();
    }
    this.checkSetupStatus();
    this.initializeComponents();
    if (this.modules.events && this.modules.events.setupEventListeners) {
      this.modules.events.setupEventListeners();
    }
    const settings = this.modules.state && this.modules.state.getState ? this.modules.state.getState("settings") : {};
    if (this.modules.settings && this.modules.settings.applyAllSettings) {
      await this.modules.settings.applyAllSettings(settings);
    }
    if (window.i18nHot && window.i18nHot.translatePage) {
      window.i18nHot.translatePage();
    }
    await this.translatePage();
    if (this.modules.helpers && this.modules.helpers.simulateLoading) {
      await this.modules.helpers.simulateLoading();
    }
    if (this.modules.helpers && this.modules.helpers.showInterface) {
      this.modules.helpers.showInterface();
    }
    await this.translatePage();
    if (!isProduction) {
      this.loadNonCriticalModules();
    }
  }
  async initI18nSystem() {
    let currentLanguage = "en";
    if (this.isElectronAPIAvailable("i18n")) {
      currentLanguage = await this.safeElectronAPICall("i18n.getCurrentLanguage") || "en";
    }
    await initI18n(currentLanguage);
  }
  checkSetupStatus() {
    const settings = this.modules.state && this.modules.state.getState ? this.modules.state.getState("settings") : {};
    if (settings && typeof settings === "object") {
      this.isSetupComplete = settings.setupComplete || false;
    } else {
      this.isSetupComplete = false;
    }
  }
  initializeComponents() {
    if (this.modules.components && this.modules.components.init) {
      this.modules.components.init();
    }
    this.registerComponents();
  }
  registerComponents() {
    if (this.modules.components && this.modules.components.register) {
      this.modules.components.register("game-card", this.createGameCard.bind(this));
      this.modules.components.register("achievement-card", this.createAchievementCard.bind(this));
      this.modules.components.register("stats-card", this.createStatsCard.bind(this));
      this.modules.components.register("loading-spinner", this.createLoadingSpinner.bind(this));
      this.modules.components.register("progress-bar", this.createProgressBar.bind(this));
      this.modules.components.register("modal", this.createModal.bind(this));
    }
  }
  // Métodos de criação de componentes
  async createGameCard(game) {
    const achievementsLabel = await this.t("achievements.label", "conquistas");
    const detailsButtonText = await this.t("game.details.button", "Ver Detalhes");
    return `
      <div class="game-card" data-game-id="${game.id}">
        <div class="game-icon">
          <img src="${game.icon || "assets/icons/default-game.svg"}" alt="${game.name}" loading="lazy">
        </div>
        <div class="game-info">
          <h3 class="game-name">${game.name}</h3>
          <p class="game-achievements">${game.achievementsUnlocked || 0}/${game.totalAchievements || 0} ${achievementsLabel}</p>
          <div class="game-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${this.modules.helpers.formatPercentage(game.achievementsUnlocked, game.totalAchievements)}"></div>
            </div>
            <span class="progress-text">${this.modules.helpers.formatPercentage(game.achievementsUnlocked, game.totalAchievements)}</span>
          </div>
        </div>
        <div class="game-actions">
          <button class="btn btn-primary btn-sm" onclick="app.openGameDetails('${game.id}')">
            <i class="fas fa-eye"></i> ${detailsButtonText}
          </button>
        </div>
      </div>
    `;
  }
  async createAchievementCard(achievement) {
    const isUnlocked = achievement.unlocked;
    const unlockedDateText = await this.t("achievement.unlocked.date", "Desbloqueada em");
    return `
      <div class="achievement-card ${isUnlocked ? "unlocked" : "locked"}">
        <div class="achievement-icon">
          <img src="${achievement.icon || "assets/icons/default-achievement.svg"}" alt="${achievement.name}" loading="lazy">
          ${isUnlocked ? '<div class="unlock-badge"><i class="fas fa-check"></i></div>' : ""}
        </div>
        <div class="achievement-info">
          <h4 class="achievement-name">${achievement.name}</h4>
          <p class="achievement-description">${achievement.description}</p>
          ${isUnlocked ? `<p class="achievement-date">${unlockedDateText}: ${this.modules.helpers.formatDate(achievement.unlockedAt)}</p>` : ""}
        </div>
      </div>
    `;
  }
  createStatsCard(title, value, icon, color = "primary") {
    return `
      <div class="stats-card stats-card-${color}">
        <div class="stats-icon">
          <i class="fas fa-${icon}"></i>
        </div>
        <div class="stats-content">
          <h3 class="stats-value">${value}</h3>
          <p class="stats-title">${title}</p>
        </div>
      </div>
    `;
  }
  createLoadingSpinner(size = "medium") {
    return `
      <div class="loading-spinner loading-spinner-${size}">
        <div class="spinner"></div>
      </div>
    `;
  }
  createProgressBar(progress = 0, showText = true) {
    return `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
        ${showText ? `<span class="progress-text">${progress}%</span>` : ""}
      </div>
    `;
  }
  createModal(id, title, content, actions = "") {
    return `
      <div class="modal" id="${id}">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close" onclick="app.closeModal('${id}')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          ${actions ? `<div class="modal-footer">${actions}</div>` : ""}
        </div>
      </div>
    `;
  }
  // Métodos de modal
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("show");
      document.body.classList.add("modal-open");
    }
  }
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("show");
      document.body.classList.remove("modal-open");
    }
  }
  // Mostrar dialog de feature em desenvolvimento
  async showFeatureDialog(featureName = null) {
    const dialogId = "featureDialog";
    const existingDialog = document.getElementById(dialogId);
    if (existingDialog) {
      existingDialog.remove();
    }
    const defaultFeatureName = await this.t("feature.dialog.default.name", "Esta funcionalidade");
    const actualFeatureName = featureName || defaultFeatureName;
    const comingSoonTitle = await this.t("feature.coming.soon", "\u{1F680} Em Breve!");
    const willBeLaunched = await this.t(
      "feature.will.be.launched",
      "est\xE1 sendo desenvolvida e estar\xE1 dispon\xEDvel em breve!"
    );
    const workingHard = await this.t(
      "feature.working.hard",
      "Estamos trabalhando para trazer esta funcionalidade o mais r\xE1pido poss\xEDvel!"
    );
    const understoodButton = await this.t("feature.dialog.understood", "Entendi");
    const dialogContent = `
      <div class="feature-dialog-overlay" id="${dialogId}">
        <div class="feature-dialog">
          <div class="feature-dialog-header">
            <div class="feature-dialog-icon">
              <i class="fas fa-rocket"></i>
            </div>
            <h3 class="feature-dialog-title">${comingSoonTitle}</h3>
          </div>
          <div class="feature-dialog-content">
            <p class="feature-dialog-message">
              <strong>${actualFeatureName}</strong> ${willBeLaunched}
            </p>
            <p class="feature-dialog-submessage">${workingHard}</p>
          </div>
          <div class="feature-dialog-actions">
            <button class="btn btn-primary" onclick="app.closeFeatureDialog()">
              <i class="fas fa-check"></i> ${understoodButton}
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", dialogContent);
    setTimeout(() => {
      const dialog = document.getElementById(dialogId);
      if (dialog) {
        dialog.classList.add("active");
      }
    }, 10);
    const overlay = document.getElementById(dialogId);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.closeFeatureDialog();
      }
    });
  }
  closeFeatureDialog() {
    const dialog = document.getElementById("featureDialog");
    if (dialog) {
      dialog.classList.remove("active");
      setTimeout(() => {
        dialog.remove();
      }, 300);
    }
  }
  // Métodos de configurações (delegação)
  async openSettings() {
    this.modules.navigation.navigateTo("configuracoes");
  }
  async saveSettings(newSettings) {
    await this.modules.settings.saveSettings(newSettings);
  }
  async saveSettingsFromModal() {
    const settingsData = {
      theme: document.getElementById("settingsTheme")?.value || "dark",
      language: document.getElementById("settingsLanguage")?.value || "en",
      liteMode: document.getElementById("settingsLiteMode")?.checked || false,
      virtualScrolling: document.getElementById("settingsVirtualScrolling")?.checked || true,
      apiSource: document.getElementById("settingsApiSource")?.value || "steam",
      notifications: {
        enabled: document.getElementById("settingsNotifications")?.checked || true
      }
    };
    await this.modules.settings.saveSettings(settingsData);
    this.modules.settings.applyAllSettings();
    this.closeModal("settingsModal");
    this.modules.helpers.showSuccess(
      await this.t("settings.saved", "Configura\xE7\xF5es salvas com sucesso!")
    );
  }
  // Métodos de jogos
  async openGameDetails(gameId) {
    const game = await this.safeElectronAPICall("games.getGameById", gameId);
    if (game) {
      this.modules.navigation.navigateTo("game-details", { gameId });
    }
  }
  async openAddGameModal() {
    const gameNameText = await this.t("game.name", "Nome do Jogo");
    const gamePathText = await this.t("game.path", "Caminho do Jogo");
    const browseText = await this.t("common.browse", "Procurar");
    const cancelText = await this.t("common.cancel", "Cancelar");
    const addGameText = await this.t("game.add", "Adicionar Jogo");
    const addNewGameText = await this.t("game.addNew", "Adicionar Novo Jogo");
    const modalContent = `
      <form id="addGameForm">
        <div class="form-group">
          <label for="gameName">${gameNameText}</label>
          <input type="text" id="gameName" name="name" required>
        </div>
        <div class="form-group">
          <label for="gamePath">${gamePathText}</label>
          <div class="input-group">
            <input type="text" id="gamePath" name="path" required>
            <button type="button" class="btn btn-secondary" onclick="app.selectGamePath()">
              <i class="fas fa-folder-open"></i> ${browseText}
            </button>
          </div>
        </div>
      </form>
    `;
    const modalActions = `
      <button type="button" class="btn btn-secondary" onclick="app.closeModal('addGameModal')">
        ${cancelText}
      </button>
      <button type="button" class="btn btn-primary" onclick="app.addGame()">
        <i class="fas fa-plus"></i> ${addGameText}
      </button>
    `;
    const modalHtml = this.createModal("addGameModal", addNewGameText, modalContent, modalActions);
    if (!document.getElementById("addGameModal")) {
      document.body.insertAdjacentHTML("beforeend", modalHtml);
    }
    this.openModal("addGameModal");
  }
  async selectGamePath() {
    const path = await this.safeElectronAPICall("fs.selectDirectory");
    if (path) {
      document.getElementById("gamePath").value = path;
    }
  }
  async addGame() {
    const form = document.getElementById("addGameForm");
    const formData = new FormData(form);
    const gameData = Object.fromEntries(formData);
    await this.safeElectronAPICall("games.addGame", gameData);
    this.showSuccess(await this.t("game.addSuccess", "Jogo adicionado com sucesso!"));
    this.closeModal("addGameModal");
    this.modules.navigation.refreshCurrentPage();
  }
  // Método para atualizar dados
  async refreshData() {
    if (this.currentPage === "dashboard") {
      await this.modules.navigation.renderDashboard();
    } else if (this.currentPage === "statistics") {
      await this.modules.navigation.renderStatistics();
    }
    this.showSuccess(await this.t("common.refreshSuccess", "Dados atualizados!"));
  }
  // Método de limpeza
  destroy() {
    this.modules.state.clearState();
    if (this.modules.performance) {
      this.modules.performance.stop();
    }
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (typeof StateManager === "undefined" || typeof NavigationManager === "undefined" || typeof SettingsManager === "undefined" || typeof EventsManager === "undefined" || typeof HelpersManager === "undefined" || typeof ComponentManager === "undefined" || typeof PerformanceMonitor === "undefined" || typeof SteamGamesManager === "undefined" || typeof DebugManager === "undefined") {
    const modulePromises = [];
    if (typeof StateManager === "undefined") {
      modulePromises.push(import("./modules/state.js"));
    }
    if (typeof NavigationManager === "undefined") {
      modulePromises.push(import("./modules/navigation.js"));
    }
    if (typeof SettingsManager === "undefined") {
      modulePromises.push(import("./modules/settings.js"));
    }
    if (typeof EventsManager === "undefined") {
      modulePromises.push(import("./modules/events.js"));
    }
    if (typeof HelpersManager === "undefined") {
      modulePromises.push(import("./modules/helpers.js"));
    }
    if (typeof ComponentManager === "undefined") {
      modulePromises.push(import("./components.js"));
    }
    if (typeof PerformanceMonitor === "undefined") {
      modulePromises.push(import("./performance.js"));
    }
    if (typeof SteamGamesManager === "undefined") {
      modulePromises.push(import("./modules/steam-games.js"));
    }
    if (typeof DebugManager === "undefined") {
      modulePromises.push(import("./utils/debug-manager.js"));
    }
    await Promise.all(modulePromises);
  }
  window.app = new AchievementsApp();
  await window.app.init();
  window.navigationManager = window.app.modules?.navigation || window.app.navigation;
  window.steamGamesManager = window.app.modules?.steamGames || window.app.steamGames;
});
window.AchievementsApp = AchievementsApp;
export {
  AchievementsApp
};
