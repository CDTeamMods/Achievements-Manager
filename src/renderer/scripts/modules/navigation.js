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
class NavigationManager {
  static {
    __name(this, "NavigationManager");
  }
  static {
    __name2(this, "NavigationManager");
  }
  static {
    __name22(this, "NavigationManager");
  }
  static {
    __name222(this, "NavigationManager");
  }
  static {
    __name2222(this, "NavigationManager");
  }
  static {
    __name22222(this, "NavigationManager");
  }
  constructor(app) {
    this.app = app;
    this.currentPage = null;
    this.hideSteamStatus = false;
  }
  async navigateTo(page, tabName = null) {
    const shouldLoad = this.currentPage !== page || this.currentPage === null || tabName;
    if (!shouldLoad) {
      return;
    }
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });
    const activeNavItem = document.querySelector(`.nav-item[href="#${page}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add("active");
    }
    const pageTitle = document.getElementById("pageTitle");
    if (pageTitle) {
      pageTitle.textContent = await this.getPageTitle(page);
    }
    const contentBody = document.getElementById("contentBody");
    if (contentBody) {
      if (this.currentPage !== null) {
        contentBody.innerHTML = '<div class="loading" data-i18n="common.loading">Carregando...</div>';
      }
      await this.loadPageContent(page).catch(async () => {
        contentBody.innerHTML = `
          <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3 data-i18n="errors.pageLoad">Erro ao carregar p\xE1gina</h3>
            <p data-i18n="errors.pageLoadMessage">N\xE3o foi poss\xEDvel carregar o conte\xFAdo da p\xE1gina.</p>
            <button class="btn btn-primary" onclick="app.modules.navigation.navigateTo('${page}')">
              <i class="fas fa-redo"></i> Tentar Novamente
            </button>
          </div>
        `;
        if (window.translatePage && typeof window.translatePage === "function") {
          await window.translatePage();
        } else if (this.app && this.app.translatePage) {
          await this.app.translatePage();
        }
      });
    }
    if (tabName && page === "configuracoes") {
      setTimeout(() => {
        this.switchTab(tabName);
      }, 100);
    }
  }
  async getPageTitle(page) {
    const titles = {
      dashboard: "nav.dashboard",
      statistics: "nav.statistics",
      backup: "nav.backup",
      settings: "nav.settings"
    };
    const titleKey = titles[page] || "nav.dashboard";
    if (window.t && typeof window.t === "function") {
      return await window.t(titleKey);
    }
    const fallbacks = {
      dashboard: "Dashboard",
      statistics: "Estat\xEDsticas",
      backup: "Backup",
      configuracoes: "Configura\xE7\xF5es"
    };
    return fallbacks[page] || "P\xE1gina";
  }
  async loadPageContent(page) {
    switch (page) {
      case "dashboard":
        await this.loadDashboard();
        break;
      case "statistics":
        await this.loadStatistics();
        break;
      case "backup":
        await this.loadBackup();
        break;
      case "configuracoes":
        await this.loadConfiguracoes();
        break;
      default:
        throw new Error(`P\xE1gina n\xE3o encontrada: ${page}`);
    }
  }
  async loadDashboard() {
    const contentBody = document.getElementById("contentBody");
    try {
      const [gamesData, achievementsData, statsData, steamConn] = await Promise.all([
        this.app.isElectronAPIAvailable("games") ? this.app.safeElectronAPICall("games.getAll") : [],
        this.app.isElectronAPIAvailable("achievements") ? this.app.safeElectronAPICall("achievements.getStats") : {},
        this.app.isElectronAPIAvailable("performance") ? this.app.safeElectronAPICall("performance.getMetrics") : {},
        this.app.isElectronAPIAvailable("steam") ? this.app.safeElectronAPICall("steam.checkConnection") : { success: false, connected: false }
      ]);
      const dashboardHTML = await this.renderDashboard(
        gamesData,
        achievementsData,
        statsData,
        steamConn
      );
      contentBody.innerHTML = dashboardHTML;
      if (window.translatePage && typeof window.translatePage === "function") {
        await window.translatePage();
      } else if (this.app && this.app.translatePage) {
        await this.app.translatePage();
      }
      this.setupDashboardEvents();
      await this.autoLoadSteamGamesIfConfigured();
    } catch (error) {
      contentBody.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3 data-i18n="dashboard.error.title">Erro ao carregar dashboard</h3>
          <p data-i18n="dashboard.error.message">N\xE3o foi poss\xEDvel carregar os dados do dashboard.</p>
          <p>Erro: ${error.message}</p>
        </div>
      `;
      if (window.translatePage && typeof window.translatePage === "function") {
        await window.translatePage();
      } else if (this.app && this.app.translatePage) {
        await this.app.translatePage();
      }
    }
  }
  /**
   * Carrega automaticamente os jogos da Steam ao abrir a Dashboard
   * quando a Steam API já está configurada e conectada
   */
  async autoLoadSteamGamesIfConfigured() {
    const gamesContainer = document.getElementById("steam-games-container");
    if (!gamesContainer) return;
    const manager = window.steamGamesManager;
    if (!manager || typeof manager.loadSteamGames !== "function") return;
    if (this.app.isElectronAPIAvailable("steam")) {
      const credentials = await this.app.safeElectronAPICall("steam.getCredentials");
      if (credentials?.success && credentials.apiKey) {
        const connection = await this.app.safeElectronAPICall("steam.checkConnection");
        if (connection?.success && connection.connected) {
          await manager.loadSteamGames();
        }
      }
    }
  }
  async renderDashboard(games, achievements, stats, steamConn = { connected: false }) {
    const totalGames = games?.length || 0;
    const totalAchievements = achievements?.total || 0;
    const unlockedAchievements = achievements?.unlocked || 0;
    const completionRate = totalAchievements > 0 ? (unlockedAchievements / totalAchievements * 100).toFixed(1) : 0;
    const isSteamConnected = !!(steamConn && steamConn.success && steamConn.connected);
    return `
      <div class="dashboard-container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-gamepad"></i>
            </div>
            <div class="stat-content">
              <h3>${totalGames}</h3>
              <p data-i18n="dashboard.games">Jogos</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="stat-content">
              <h3>${unlockedAchievements}/${totalAchievements}</h3>
              <p data-i18n="dashboard.achievements">Conquistas</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="stat-content">
              <h3>${completionRate}%</h3>
              <p data-i18n="dashboard.progress">Progresso</p>
            </div>
          </div>
        </div>

        <!-- Separador visual -->
        <div class="dashboard-separator"></div>

        <div class="dashboard-content">
          <!-- Se\xE7\xE3o Steam Games -->
          <div class="steam-section">
            <div class="section-header">
              <h3><i class="fab fa-steam"></i> <span data-i18n="dashboard.steamGames">Biblioteca Steam</span></h3>
              <div class="section-actions">
                ${isSteamConnected ? "" : `<button class="btn btn-secondary btn-sm" onclick="window.steamGamesManager?.loadSteamGames()" title="Carregar jogos Steam">
                         <i class="fas fa-refresh"></i> <span data-i18n="dashboard.loadSteam">Carregar Jogos</span>
                       </button>`}
              </div>
            </div>
            <div id="steam-games-container">
              <div class="steam-placeholder">
                <div class="placeholder-icon">
                  <i class="fab fa-steam"></i>
                </div>
                <h4 data-i18n="dashboard.steam.connect">Conecte sua conta Steam</h4>
                <p data-i18n="dashboard.steam.description">Configure sua Steam API Key nas configura\xE7\xF5es para ver seus jogos automaticamente</p>
                <button class="btn btn-primary" onclick="navigationManager.showPage('settings', 'steam')">
                  <i class="fas fa-plug"></i> <span data-i18n="dashboard.steam.configureNow">Configurar Agora</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }
  setupDashboardEvents() {
    const gameCards = document.querySelectorAll(".game-card");
    gameCards.forEach((card) => {
      card.addEventListener("click", () => {
        const gameId = card.dataset.gameId;
        this.openGameDetails(gameId);
      });
    });
  }
  async loadStatistics() {
    const contentBody = document.getElementById("contentBody");
    try {
      const gamesData = this.app.isElectronAPIAvailable("games") ? await this.app.safeElectronAPICall("games.getAll") : [];
      const achievementsData = this.app.isElectronAPIAvailable("achievements") ? await this.app.safeElectronAPICall("achievements.getStats") : {};
      const totalGames = gamesData?.length || 0;
      const totalAchievements = achievementsData?.total || 0;
      const unlockedAchievements = achievementsData?.unlocked || 0;
      const completionRate = totalAchievements > 0 ? (unlockedAchievements / totalAchievements * 100).toFixed(1) : 0;
      contentBody.innerHTML = `
        <div class="statistics-container">
          <div class="page-header">
            <h2><i class="fas fa-chart-bar"></i> <span data-i18n="statistics.title">Detailed Statistics</span></h2>
            <p data-i18n="statistics.description">Complete analysis of your progress in games and achievements</p>
          </div>
          
          <div class="stats-overview">
            <div class="stat-card large">
              <div class="stat-icon">
                <i class="fas fa-gamepad"></i>
              </div>
              <div class="stat-content">
                <h3>${totalGames}</h3>
                <p data-i18n="statistics.totalGames">Total Games</p>
                <div class="stat-trend positive">
                  <i class="fas fa-arrow-up"></i>
                  <span data-i18n="statistics.trend.thisMonth">+2 this month</span>
                </div>
              </div>
            </div>
            
            <div class="stat-card large">
              <div class="stat-icon">
                <i class="fas fa-trophy"></i>
              </div>
              <div class="stat-content">
                <h3>${unlockedAchievements}</h3>
                <p data-i18n="statistics.unlockedAchievements">Unlocked Achievements</p>
                <div class="stat-trend positive">
                  <i class="fas fa-arrow-up"></i>
                  <span data-i18n="statistics.trend.thisWeek">+15 this week</span>
                </div>
              </div>
            </div>
            
            <div class="stat-card large">
              <div class="stat-icon">
                <i class="fas fa-percentage"></i>
              </div>
              <div class="stat-content">
                <h3>${completionRate}%</h3>
                <p data-i18n="statistics.completionRate">Completion Rate</p>
                <div class="stat-trend ${completionRate > 50 ? "positive" : "neutral"}">
                  <i class="fas fa-${completionRate > 50 ? "arrow-up" : "minus"}"></i>
                  <span data-i18n="statistics.trend.${completionRate > 50 ? "excellent" : "keepGoing"}">${completionRate > 50 ? "Excellent!" : "Keep going!"}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="charts-section">
            <div class="chart-card">
              <h3><i class="fas fa-calendar-alt"></i> <span data-i18n="statistics.monthlyProgress">Monthly Progress</span></h3>
              <div class="chart-placeholder">
                <i class="fas fa-chart-line"></i>
                <p data-i18n="statistics.monthlyProgress.comingSoon">Monthly progress chart will be implemented soon</p>
              </div>
            </div>
            
            <div class="chart-card">
              <h3><i class="fas fa-star"></i> <span data-i18n="statistics.achievementsByCategory">Achievements by Category</span></h3>
              <div class="chart-placeholder">
                <i class="fas fa-chart-pie"></i>
                <p data-i18n="statistics.achievementsByCategory.comingSoon">Category chart will be implemented soon</p>
              </div>
            </div>
          </div>
        </div>
      `;
      if (this.app.modules.helpers && this.app.modules.helpers.translatePage) {
        await this.app.modules.helpers.translatePage();
      }
    } catch (error) {
      contentBody.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3 data-i18n="statistics.error.title">Error loading statistics</h3>
          <p data-i18n="statistics.error.message">Could not load statistics data.</p>
          <p>${error}</p>
          <button class="btn btn-primary" onclick="app.modules.navigation.navigateTo('statistics')">
            <span data-i18n="statistics.error.retry">Try again</span>
          </button>
        </div>
      `;
      if (this.app.modules.helpers && this.app.modules.helpers.translatePage) {
        await this.app.modules.helpers.translatePage();
      }
    }
  }
  async loadBackup() {
    const contentBody = document.getElementById("contentBody");
    contentBody.innerHTML = `
      <div class="backup-container">
        <!-- Header Principal -->
        <div class="backup-header">
          <div class="header-content">
            <div class="header-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <div class="header-text">
              <h1 data-i18n="backup.title">Backup & Restore</h1>
              <p data-i18n="backup.description">Protect your game and achievement data with total security</p>
            </div>
          </div>
          <div class="header-stats">
            <div class="stat-item">
              <i class="fas fa-database"></i>
              <span data-i18n="backup.secureData">Secure Data</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-clock"></i>
              <span data-i18n="backup.autoBackup">Auto Backup</span>
            </div>
          </div>
        </div>

        <!-- Grid de A\xE7\xF5es Principais -->
        <div class="backup-grid">
          <!-- Card Criar Backup -->
          <div class="backup-card create-backup">
            <div class="card-background"></div>
            <div class="card-content">
              <div class="card-icon">
                <i class="fas fa-cloud-upload-alt"></i>
              </div>
              <div class="card-info">
                <h3 data-i18n="backup.create.title">Create Backup</h3>
                <p data-i18n="backup.create.description">Make a complete backup of all your game data, achievements and settings</p>
                <div class="card-features">
                  <span class="feature"><i class="fas fa-check"></i> <span data-i18n="backup.create.gameData">Game Data</span></span>
                  <span class="feature"><i class="fas fa-check"></i> <span data-i18n="backup.create.achievements">Achievements</span></span>
                  <span class="feature"><i class="fas fa-check"></i> <span data-i18n="backup.create.settings">Settings</span></span>
                </div>
              </div>
              <div class="card-actions">
                <button class="btn btn-primary backup-btn" onclick="app.showFeatureDialog('Criar Backup')">
                  <i class="fas fa-save"></i>
                  <span data-i18n="backup.create.button">Create Backup</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Card Restaurar Backup -->
          <div class="backup-card restore-backup">
            <div class="card-background"></div>
            <div class="card-content">
              <div class="card-icon">
                <i class="fas fa-cloud-download-alt"></i>
              </div>
              <div class="card-info">
                <h3 data-i18n="backup.restore.title">Restore Backup</h3>
                <p data-i18n="backup.restore.description">Restore your data from a previous backup file</p>
                <div class="card-features">
                  <span class="feature"><i class="fas fa-history"></i> <span data-i18n="backup.restore.fullHistory">Full History</span></span>
                  <span class="feature"><i class="fas fa-shield-check"></i> <span data-i18n="backup.restore.secureVerification">Secure Verification</span></span>
                  <span class="feature"><i class="fas fa-sync-alt"></i> <span data-i18n="backup.restore.synchronization">Synchronization</span></span>
                </div>
              </div>
              <div class="card-actions">
                <button class="btn btn-secondary backup-btn" onclick="app.showFeatureDialog('Restaurar Backup')">
                  <i class="fas fa-upload"></i>
                  <span data-i18n="backup.restore.button">Restore Backup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    if (this.app.modules.helpers && this.app.modules.helpers.translatePage) {
      await this.app.modules.helpers.translatePage();
    }
  }
  async loadConfiguracoes() {
    const contentBody = document.getElementById("contentBody");
    if (!contentBody) {
      return;
    }
    contentBody.innerHTML = `
      <div class="settings-page-container">
        <div class="page-header">
          <h2><i class="fas fa-cog"></i> <span data-i18n="settings.title">Settings</span></h2>
          <p data-i18n="settings.description">Customize your Achievements Manager experience</p>
        </div>
        
        <!-- Guias de Configura\xE7\xF5es -->
        <div class="settings-tabs">
          <div class="tab-nav">
            <button class="tab-btn active" data-tab="personalization">
              <i class="fas fa-palette"></i> <span data-i18n="settings.personalization">Personalization</span>
            </button>
            <button class="tab-btn" data-tab="performance">
              <i class="fas fa-tachometer-alt"></i> <span data-i18n="settings.performance">Performance</span>
            </button>
            <button class="tab-btn" data-tab="api">
              <i class="fas fa-cloud"></i> API
            </button>
            <button class="tab-btn" data-tab="goldberg">
              <i class="fas fa-exchange-alt"></i> <span data-i18n="settings.goldberg">Convers\xE3o Goldberg</span>
            </button>
          </div>
          
          <div class="tab-content">
            <!-- Guia Personaliza\xE7\xE3o -->
            <div class="tab-pane active" id="personalization">
              <div class="settings-section">
                <h3><i class="fas fa-palette"></i> <span data-i18n="settings.appearance">Appearance</span></h3>
                <div class="form-group">
                  <label data-i18n="settings.theme">Theme</label>
                  <select class="form-control theme-dropdown" id="themeSelect">
                    <option value="dark" data-i18n="settings.theme.dark">Dark</option>
                    <option value="light" data-i18n="settings.theme.light">Light</option>
                    <option value="auto" data-i18n="settings.theme.auto">Auto</option>
                  </select>
                </div>
                <div class="toggle-group">
                  <div>
                    <label data-i18n="settings.customization.liteMode">Modo Lite</label>
                    <div class="form-text" data-i18n="settings.customization.liteModeDescription">Desativa anima\xE7\xF5es para melhor performance</div>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" id="liteModeToggle">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-group">
                  <div>
                    <label data-i18n="settings.customization.compactMode">Modo Compacto</label>
                    <div class="form-text" data-i18n="settings.customization.compactModeDescription">Interface mais compacta</div>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" id="compactModeToggle">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="settings-section">
                <h3><i class="fas fa-globe"></i> <span data-i18n="settings.language.title">Idioma</span></h3>
                <div class="form-group">
                  <label data-i18n="settings.language.interface">Idioma da Interface</label>
                  <select class="form-control language-dropdown" id="languageSelect">
                    <option value="pt-BR">\u{1F1E7}\u{1F1F7} Portugu\xEAs (Brasil)</option>
                    <option value="en">\u{1F1FA}\u{1F1F8} English (United States)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Guia Performance -->
            <div class="tab-pane" id="performance">
              <div class="settings-section">
                <h3><i class="fas fa-tachometer-alt"></i> <span data-i18n="settings.performance">Performance</span></h3>
                <div class="toggle-group">
                  <div>
                    <label data-i18n="settings.virtualScrolling">Virtual Scrolling</label>
                    <div class="form-text" data-i18n="settings.virtualScrolling.description">Improves performance with large lists</div>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" id="virtualScrollToggle">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-group">
                  <div>
                    <label data-i18n="settings.showTooltips">Show Tooltips</label>
                    <div class="form-text" data-i18n="settings.showTooltips.description">Display tips on mouse hover</div>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" id="showTooltipsToggle">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-group">
                  <div>
                    <label data-i18n="settings.performance.autoSync">Sincroniza\xE7\xE3o Autom\xE1tica</label>
                    <div class="form-text" data-i18n="settings.performance.autoSync.description">Sincroniza dados automaticamente</div>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" id="autoSyncToggle">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="form-group">
                  <label data-i18n="settings.performance.cacheSize">Tamanho do Cache</label>
                  <select class="form-control select" id="cacheSizeSelect">
                    <option value="50">50 MB</option>
                    <option value="100">100 MB</option>
                    <option value="200">200 MB</option>
                    <option value="500">500 MB</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Guia API -->
            <div class="tab-pane" id="api">
              <div class="settings-section">
                <h3><i class="fas fa-cloud"></i> <span data-i18n="settings.api.title">Configura\xE7\xF5es de API</span></h3>
                
                <!-- Sele\xE7\xE3o da fonte de API -->
                <div class="form-group">
                  <label data-i18n="settings.api.source">Fonte da API</label>
                  <select class="form-control select" id="apiSourceSelect">
                    <option value="steam" data-i18n="settings.api.source.steam">Steam Web API</option>
                    <option value="hydra" data-i18n="settings.api.source.hydra">Hydra API (Em breve)</option>
                  </select>
                  <div class="form-text" data-i18n="settings.api.source.description">
                    Escolha a fonte de dados para obter informa\xE7\xF5es dos jogos e conquistas
                  </div>
                </div>

                <!-- Configura\xE7\xF5es da Steam API -->
                <div class="steam-api-section" id="steamApiSection">
                  <h4><i class="fab fa-steam"></i> <span data-i18n="settings.api.steam.title">Steam Web API</span></h4>
                  
                  <!-- Steam API Key -->
                  <div class="form-group">
                    <label data-i18n="settings.api.steam.apiKey">Steam API Key</label>
                    <div class="input-with-icon">
                      <i class="fas fa-key"></i>
                      <input type="password" class="form-control" id="steamApiKeyInput" 
                             placeholder="Insira sua Steam API Key" 
                             data-i18n-placeholder="settings.api.steam.apiKey.placeholder">
                      <button type="button" class="btn btn-icon toggle-password" onclick="this.parentElement.querySelector('input').type = this.parentElement.querySelector('input').type === 'password' ? 'text' : 'password'; this.querySelector('i').className = this.parentElement.querySelector('input').type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';">
                        <i class="fas fa-eye"></i>
                      </button>
                    </div>
                    <div class="form-text">
                      <span data-i18n="settings.api.steam.apiKey.description">
                        Obtenha sua API Key gratuita em:
                      </span>
                      <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i> steamcommunity.com/dev/apikey
                      </a>
                    </div>
                  </div>



                  <!-- Bot\xF5es de a\xE7\xE3o Steam -->
                  <div class="form-group">
                    <div class="d-flex gap-2">
                      <button type="button" class="btn btn-primary" id="steamConnectBtn">
                        <i class="fas fa-plug"></i> <span data-i18n="settings.steam.connect">Conectar</span>
                      </button>
                      <button type="button" class="btn btn-outline-danger" id="steamDisconnectBtn" style="display: none;">
                        <i class="fas fa-unlink"></i> <span data-i18n="settings.steam.disconnect">Desconectar</span>
                      </button>
                    </div>
                  </div>

                  <!-- Informa\xE7\xF5es sobre pastas padr\xE3o do Steam -->
                  <div class="steam-paths-info" id="steamPathsInfo" style="display: none;">
                    <h5><i class="fas fa-folder"></i> <span data-i18n="settings.api.steam.paths.title">Pastas de Localiza\xE7\xE3o Padr\xE3o</span></h5>
                    <div class="paths-list" id="steamPathsList">
                      <!-- Ser\xE1 preenchido dinamicamente -->
                    </div>
                    
                    <!-- Seletor de diret\xF3rio personalizado -->
                    <div class="form-group mt-3">
                      <label data-i18n="settings.api.steam.customPath">Diret\xF3rio Personalizado do Steam</label>
                      <div class="input-group">
                        <input type="text" class="form-control" id="steamCustomPathInput" 
                               placeholder="Selecione o diret\xF3rio do Steam..." 
                               data-i18n-placeholder="settings.api.steam.customPath.placeholder" readonly>
                        <button type="button" class="btn btn-outline-primary" id="selectSteamDirBtn" onclick="window.app?.navigation?.selectSteamDirectory()">
                          <i class="fas fa-folder-open"></i>
                          <span data-i18n="settings.api.steam.selectDirectory">Selecionar</span>
                        </button>
                      </div>
                      <div class="form-text">
                        <span data-i18n="settings.api.steam.customPath.description">
                          Se o Steam estiver instalado em um local diferente, selecione o diret\xF3rio manualmente
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Status da conex\xE3o -->
                  <div class="steam-status-card" id="steamStatusCard">
                    <div class="status-header">
                      <div class="status-icon" id="steamStatusIcon">
                        <i class="fas fa-question-circle"></i>
                      </div>
                      <div class="status-info">
                        <h4 id="steamStatusTitle" data-i18n="settings.api.steam.status.notTested">N\xE3o testado</h4>
                        <p id="steamStatusDescription" data-i18n="settings.api.steam.status.notTested.description">
                          Configure suas credenciais e teste a conex\xE3o
                        </p>
                      </div>
                    </div>
                    <div class="status-actions">
                      <button class="btn btn-primary" id="testSteamConnectionBtn" onclick="window.app?.navigation?.testSteamConnection()">
                        <i class="fas fa-plug"></i>
                        <span data-i18n="settings.api.steam.testConnection">Testar Conex\xE3o</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Mensagem Hydra API -->
                <div class="alert alert-info" id="hydraApiMessage" style="display: none;">
                  <div class="text-center py-4">
                    <i class="fas fa-clock fa-3x mb-3 text-info"></i>
                    <h4>Hydra API</h4>
                    <p class="mb-0" data-i18n="feature.will.be.launched"></p>
                    <small class="text-muted" data-i18n="feature.working.hard"></small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Guia Convers\xE3o Goldberg -->
            <div class="tab-pane" id="goldberg">
              <div class="settings-section">
                <h3><i class="fas fa-exchange-alt"></i> <span data-i18n="settings.goldberg.title">Convers\xE3o Goldberg Emu</span></h3>
                <p class="section-description" data-i18n="settings.goldberg.description">
                  Converta conquistas da vers\xE3o antiga do Goldberg SteamEmu Saves para o formato GSE Saves moderno
                </p>
                
                <!-- Status da convers\xE3o -->
                <div class="goldberg-status-card" id="goldbergStatusCard">
                  <div class="status-header">
                    <div class="status-icon" id="goldbergStatusIcon">
                      <i class="fas fa-search"></i>
                    </div>
                    <div class="status-info">
                      <h4 id="goldbergStatusTitle" data-i18n="settings.goldberg.checking">Verificando...</h4>
                      <p id="goldbergStatusDescription" data-i18n="settings.goldberg.checking.description">Procurando por arquivos Goldberg</p>
                    </div>
                  </div>
                  <div class="status-details" id="goldbergStatusDetails" style="display: none;">
                    <!-- Detalhes ser\xE3o preenchidos dinamicamente -->
                  </div>
                </div>

                <!-- Configura\xE7\xF5es de migra\xE7\xE3o -->
                <div class="goldberg-settings">
                  <div class="toggle-group">
                    <div>
                      <label data-i18n="settings.goldberg.autoMigration">Migra\xE7\xE3o Autom\xE1tica</label>
                      <div class="form-text" data-i18n="settings.goldberg.autoMigration.description">
                        Converta automaticamente quando novos jogos forem detectados
                      </div>
                    </div>
                    <label class="toggle-switch">
                      <input type="checkbox" id="goldbergAutoMigrationToggle">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div class="toggle-group">
                    <div>
                      <label data-i18n="settings.goldberg.showDialog">Mostrar Di\xE1logo</label>
                      <div class="form-text" data-i18n="settings.goldberg.showDialog.description">
                        Exibir confirma\xE7\xE3o antes de converter
                      </div>
                    </div>
                    <label class="toggle-switch">
                      <input type="checkbox" id="goldbergShowDialogToggle" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- A\xE7\xF5es de migra\xE7\xE3o -->
                <div class="goldberg-actions">
                  <button class="btn btn-primary" id="goldbergCheckBtn">
                    <i class="fas fa-search"></i> 
                    <span data-i18n="settings.goldberg.checkNow">Verificar Agora</span>
                  </button>
                  <button class="btn btn-success" id="goldbergMigrateBtn" style="display: none;">
                    <i class="fas fa-play"></i> 
                    <span data-i18n="settings.goldberg.migrateAll">Converter Todos</span>
                  </button>
                </div>

                <!-- Informa\xE7\xF5es adicionais -->
                <div class="goldberg-info">
                  <div class="info-item">
                    <i class="fas fa-info-circle"></i>
                    <span data-i18n="settings.goldberg.info.oldPath">
                      Pasta antiga: C:\\Users\\[Usuario]\\AppData\\Roaming\\Goldberg SteamEmu Saves
                    </span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-arrow-right"></i>
                    <span data-i18n="settings.goldberg.info.newPath">
                      Pasta nova: [Dados do App]\\GSE Saves
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="settings-actions">
          <button class="btn btn-primary" id="saveSettingsBtn" onclick="app.modules.navigation.saveCurrentSettings()" disabled>
            <i class="fas fa-save"></i> <span data-i18n="common.save">Salvar Configura\xE7\xF5es</span>
          </button>
          <button class="btn btn-secondary" id="cancelSettingsBtn" onclick="app.modules.navigation.cancelSettingsChanges()" disabled>
            <i class="fas fa-times"></i> <span data-i18n="common.cancel">Cancelar</span>
          </button>
          <button class="btn btn-outline" onclick="app.modules.navigation.resetSettings()">
            <i class="fas fa-undo"></i> <span data-i18n="common.reset">Restaurar Padr\xF5es</span>
          </button>
        </div>
        
        <div class="settings-status" id="settingsStatus" style="display: none;">
          <i class="fas fa-exclamation-circle"></i>
          <span data-i18n="settings.status.unsaved">Voc\xEA tem altera\xE7\xF5es n\xE3o salvas</span>
        </div>
      </div>
    `;
    this.loadCurrentSettings();
    this.setupSettingsChangeDetection();
    if (this.app.modules.helpers && this.app.modules.helpers.translatePage) {
      await this.app.modules.helpers.translatePage();
    }
    setTimeout(() => {
      this.setupTabNavigation();
      this.setupGoldbergSettings();
      this.setupSteamSettings();
    }, 100);
  }
  loadCurrentSettings() {
    if (!this.app.modules.settings) {
      return;
    }
    const settings = this.app.modules.settings.getAll();
    this.originalSettings = { ...settings };
    this.pendingSettings = { ...settings };
    const themeSelect = document.getElementById("themeSelect");
    const languageSelect = document.getElementById("languageSelect");
    const liteModeToggle = document.getElementById("liteModeToggle");
    const compactModeToggle = document.getElementById("compactModeToggle");
    const virtualScrollToggle = document.getElementById("virtualScrollToggle");
    const showTooltipsToggle = document.getElementById("showTooltipsToggle");
    const autoSyncToggle = document.getElementById("autoSyncToggle");
    const cacheSizeSelect = document.getElementById("cacheSizeSelect");
    const apiSourceSelect = document.getElementById("apiSourceSelect");
    if (themeSelect) themeSelect.value = settings.theme || "dark";
    if (languageSelect) languageSelect.value = settings.language || "en";
    if (liteModeToggle) liteModeToggle.checked = settings.liteMode || false;
    if (compactModeToggle) compactModeToggle.checked = settings.compactMode || false;
    if (virtualScrollToggle) virtualScrollToggle.checked = settings.virtualScrolling !== false;
    if (showTooltipsToggle) showTooltipsToggle.checked = settings.showTooltips !== false;
    if (autoSyncToggle) autoSyncToggle.checked = settings.autoSync !== false;
    if (cacheSizeSelect) cacheSizeSelect.value = settings.cacheSize || "100";
    if (apiSourceSelect) apiSourceSelect.value = settings.apiSource || "steam";
    this.handleApiSourceChange(settings.apiSource || "steam");
  }
  setupSettingsChangeDetection() {
    const elements = [
      // Personalização
      "themeSelect",
      "languageSelect",
      "liteModeToggle",
      "compactModeToggle",
      // Performance
      "virtualScrollToggle",
      "showTooltipsToggle",
      "autoSyncToggle",
      "cacheSizeSelect",
      // API
      "apiSourceSelect",
      "steamApiKeyInput"
    ];
    elements.forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        const eventTypes = element.type === "checkbox" ? ["change"] : ["change", "input", "keyup"];
        eventTypes.forEach((eventType) => {
          element.addEventListener(eventType, () => {
            if (elementId === "apiSourceSelect") {
              this.handleApiSourceChange(element.value);
            }
            this.updatePendingSettings();
            this.checkForChanges();
          });
        });
      }
    });
    const togglePasswordBtn = document.getElementById("toggleApiKeyBtn");
    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener("click", () => {
        this.toggleSteamApiKeyVisibility();
      });
    }
  }
  updatePendingSettings() {
    const themeSelect = document.getElementById("themeSelect");
    const languageSelect = document.getElementById("languageSelect");
    const liteModeToggle = document.getElementById("liteModeToggle");
    const compactModeToggle = document.getElementById("compactModeToggle");
    const virtualScrollToggle = document.getElementById("virtualScrollToggle");
    const showTooltipsToggle = document.getElementById("showTooltipsToggle");
    const autoSyncToggle = document.getElementById("autoSyncToggle");
    const cacheSizeSelect = document.getElementById("cacheSizeSelect");
    const apiSourceSelect = document.getElementById("apiSourceSelect");
    if (themeSelect) this.pendingSettings.theme = themeSelect.value;
    if (languageSelect) {
      this.pendingSettings.language = languageSelect.value;
    }
    if (liteModeToggle) this.pendingSettings.liteMode = liteModeToggle.checked;
    if (compactModeToggle) this.pendingSettings.compactMode = compactModeToggle.checked;
    if (virtualScrollToggle) this.pendingSettings.virtualScrolling = virtualScrollToggle.checked;
    if (showTooltipsToggle) this.pendingSettings.showTooltips = showTooltipsToggle.checked;
    if (autoSyncToggle) this.pendingSettings.autoSync = autoSyncToggle.checked;
    if (cacheSizeSelect) this.pendingSettings.cacheSize = cacheSizeSelect.value;
    if (apiSourceSelect) this.pendingSettings.apiSource = apiSourceSelect.value;
  }
  async loadSteamPaths() {
    const defaultPaths = await window.electronAPI.invoke("steam.getSteamDefaultPaths");
    const defaultPathsList = document.getElementById("steamDefaultPathsList");
    if (defaultPathsList && defaultPaths) {
      defaultPathsList.innerHTML = defaultPaths.map((path) => `<li class="steam-path-item">\u{1F4C1} ${path}</li>`).join("");
    }
    const currentDirectory = await window.electronAPI.invoke("steam.detectCurrentSteamDirectory");
    const steamPathInput = document.getElementById("steamPathInput");
    if (steamPathInput && currentDirectory) {
      steamPathInput.value = currentDirectory;
    }
  }
  async selectSteamDirectory() {
    const result = await window.electronAPI.invoke("fs:showOpenDialog", {
      properties: ["openDirectory"],
      title: "Selecionar Diret\xF3rio do Steam"
    });
    if (result && !result.canceled && result.filePaths.length > 0) {
      const steamPathInput = document.getElementById("steamPathInput");
      if (steamPathInput) {
        steamPathInput.value = result.filePaths[0];
      }
    }
  }
  async testSteamConnection() {
    try {
      const testBtn = document.getElementById("testSteamConnectionBtn");
      const statusCard = document.getElementById("steamStatusCard");
      const statusIcon = document.getElementById("steamStatusIcon");
      const statusTitle = document.getElementById("steamStatusTitle");
      const statusDescription = document.getElementById("steamStatusDescription");
      const apiKeyInput = document.getElementById("steamApiKeyInput");
      if (!testBtn || !statusCard || !apiKeyInput) return;
      testBtn.disabled = true;
      testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Testando...</span>';
      statusCard.className = "steam-status-card status-testing";
      statusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      statusTitle.textContent = "Testando...";
      statusDescription.textContent = "Verificando conex\xE3o e descobrindo Steam ID...";
      const apiKey = apiKeyInput.value.trim();
      if (!apiKey) {
        statusCard.className = "steam-status-card status-error";
        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        statusTitle.textContent = "Erro";
        statusDescription.textContent = "Por favor, preencha a API Key";
        return;
      }
      const result = await window.electronAPI.steam.setCredentials(apiKey);
      if (result.success) {
        statusCard.className = "steam-status-card status-connected";
        statusIcon.innerHTML = '<i class="fab fa-steam"></i>';
        if (result.autoDiscovered) {
          statusTitle.textContent = "Conectado";
          statusDescription.textContent = `Steam ID descoberto automaticamente - ${result.data?.personaname || "Usu\xE1rio Steam"}`;
        } else {
          statusTitle.textContent = "API Key V\xE1lida";
          statusDescription.textContent = `Usu\xE1rio: ${result.data?.personaname || "N/A"}`;
        }
      } else {
        statusCard.className = "steam-status-card status-error";
        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        const isTimeout = typeof result.error === "string" && (result.error.toLowerCase().includes("timeout") || result.error.includes("ECONNABORTED"));
        if (isTimeout) {
          statusTitle.setAttribute("data-i18n", "settings.api.steam.status.timeout");
          statusTitle.textContent = await this.app.t(
            "settings.api.steam.status.timeout",
            "Tempo de conex\xE3o esgotado"
          );
          statusDescription.setAttribute(
            "data-i18n",
            "settings.api.steam.status.timeout.description"
          );
          statusDescription.textContent = await this.app.t(
            "settings.api.steam.status.timeout.description",
            "A Steam API n\xE3o respondeu dentro do tempo esperado. Verifique sua rede e tente novamente."
          );
          this.app.modules.helpers.showNotification(
            await this.app.t("settings.api.steam.status.timeout", "Tempo de conex\xE3o esgotado"),
            "warning",
            5e3
          );
        } else {
          statusTitle.setAttribute("data-i18n", "settings.api.steam.status.error");
          statusTitle.textContent = await this.app.t(
            "settings.api.steam.status.error",
            "Erro na verifica\xE7\xE3o"
          );
          statusDescription.setAttribute(
            "data-i18n",
            "settings.api.steam.status.error.description"
          );
          const looksLikeKey = /* @__PURE__ */ __name22222(
            (s) => typeof s === "string" && s.includes(".") && !s.includes(" "),
            "looksLikeKey"
          );
          let errorMessage = result.error || await this.app.t(
            "settings.api.steam.status.error.description",
            "Ocorreu um erro ao verificar a conex\xE3o Steam"
          );
          if (result.suggestion) {
            errorMessage += ` - ${result.suggestion}`;
          }
          if (looksLikeKey(errorMessage)) {
            statusDescription.style.display = "none";
            statusDescription.textContent = "";
          } else {
            statusDescription.style.display = "block";
            statusDescription.textContent = errorMessage;
          }
        }
      }
    } catch (error) {
      const statusCard = document.getElementById("steamStatusCard");
      const statusIcon = document.getElementById("steamStatusIcon");
      const statusTitle = document.getElementById("steamStatusTitle");
      const statusDescription = document.getElementById("steamStatusDescription");
      if (statusCard) {
        statusCard.className = "steam-status-card status-error";
        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        const isTimeout = error?.code === "ECONNABORTED" || typeof error?.message === "string" && error.message.toLowerCase().includes("timeout");
        if (isTimeout) {
          statusTitle.setAttribute("data-i18n", "settings.api.steam.status.timeout");
          statusTitle.textContent = await this.app.t(
            "settings.api.steam.status.timeout",
            "Tempo de conex\xE3o esgotado"
          );
          statusDescription.setAttribute(
            "data-i18n",
            "settings.api.steam.status.timeout.description"
          );
          statusDescription.textContent = await this.app.t(
            "settings.api.steam.status.timeout.description",
            "A Steam API n\xE3o respondeu dentro do tempo esperado. Verifique sua rede e tente novamente."
          );
          this.app.modules.helpers.showNotification(
            await this.app.t("settings.api.steam.status.timeout", "Tempo de conex\xE3o esgotado"),
            "warning",
            5e3
          );
        } else {
          statusTitle.setAttribute("data-i18n", "settings.api.steam.status.error");
          statusTitle.textContent = await this.app.t(
            "settings.api.steam.status.error",
            "Erro na verifica\xE7\xE3o"
          );
          statusDescription.setAttribute(
            "data-i18n",
            "settings.api.steam.status.error.description"
          );
          statusDescription.textContent = await this.app.t(
            "settings.api.steam.status.error.description",
            "Ocorreu um erro ao verificar a conex\xE3o Steam"
          );
        }
      }
    } finally {
      const testBtn = document.getElementById("testSteamConnectionBtn");
      if (testBtn) {
        testBtn.disabled = false;
        testBtn.innerHTML = '<i class="fas fa-plug"></i> <span data-i18n="settings.api.steam.testConnection">Testar Conex\xE3o</span>';
      }
    }
  }
  checkForChanges() {
    const hasChanges = JSON.stringify(this.originalSettings) !== JSON.stringify(this.pendingSettings);
    const saveBtn = document.getElementById("saveSettingsBtn");
    const cancelBtn = document.getElementById("cancelSettingsBtn");
    const statusDiv = document.getElementById("settingsStatus");
    if (saveBtn) saveBtn.disabled = !hasChanges;
    if (cancelBtn) cancelBtn.disabled = !hasChanges;
    if (statusDiv) statusDiv.style.display = hasChanges ? "flex" : "none";
  }
  async saveCurrentSettings() {
    this.updatePendingSettings();
    const languageChanged = this.pendingSettings.language && this.pendingSettings.language !== this.originalSettings.language;
    const steamApiKeyInput = document.getElementById("steamApiKeyInput");
    if (steamApiKeyInput) {
      const newApiKey = steamApiKeyInput.value.trim();
      const originalApiKey = this.originalSettings.steamApiKey || "";
      if (newApiKey && newApiKey !== originalApiKey && this.app.isElectronAPIAvailable("steam")) {
        await this.app.safeElectronAPICall("steam.setCredentials", newApiKey);
        this.pendingSettings.steamApiKey = newApiKey;
      }
    }
    for (const [key, value] of Object.entries(this.pendingSettings)) {
      await this.app.modules.settings.set(key, value);
    }
    this.originalSettings = { ...this.pendingSettings };
    this.checkForChanges();
    if (languageChanged) {
      await this.showRestartDialog();
    } else {
      this.app.modules.helpers.showNotification(
        this.app.t("settings.notifications.saved", "Configura\xE7\xF5es salvas com sucesso!"),
        "success"
      );
    }
  }
  async handleSteamApiKeyChange() {
    const currentPage = document.querySelector(".page.active")?.id;
    if (currentPage === "steam-games") {
      this.app.modules.helpers.showNotification(
        await this.app.t("steam.notifications.loadingLibrary", "Carregando biblioteca Steam..."),
        "info"
      );
      setTimeout(async () => {
        await this.loadSteamGames().catch(async () => {
          this.app.modules.helpers.showNotification(
            await this.app.t("steam.notifications.loadError", "Erro ao carregar biblioteca Steam"),
            "error"
          );
        });
      }, 1500);
    }
  }
  cancelSettingsChanges() {
    this.pendingSettings = { ...this.originalSettings };
    const themeSelect = document.getElementById("themeSelect");
    const languageSelect = document.getElementById("languageSelect");
    const liteModeToggle = document.getElementById("liteModeToggle");
    const virtualScrollToggle = document.getElementById("virtualScrollToggle");
    const achievementNotificationsToggle = document.getElementById(
      "achievementNotificationsToggle"
    );
    const notificationSoundsToggle = document.getElementById("notificationSoundsToggle");
    if (themeSelect) themeSelect.value = this.originalSettings.theme || "dark";
    if (languageSelect) languageSelect.value = this.originalSettings.language || "en";
    if (liteModeToggle) liteModeToggle.checked = this.originalSettings.liteMode || false;
    if (virtualScrollToggle)
      virtualScrollToggle.checked = this.originalSettings.virtualScrolling !== false;
    if (achievementNotificationsToggle)
      achievementNotificationsToggle.checked = this.originalSettings.achievementNotifications !== false;
    if (notificationSoundsToggle)
      notificationSoundsToggle.checked = this.originalSettings.notificationSounds !== false;
    this.checkForChanges();
    this.app.modules.helpers.showNotification("Altera\xE7\xF5es canceladas", "info");
  }
  async resetSettings() {
    const titleText = await this.app.t(
      "settings.reset.dialog.title",
      "Restaurar Configura\xE7\xF5es"
    );
    const subtitleText = await this.app.t(
      "settings.reset.dialog.subtitle",
      "Esta a\xE7\xE3o ir\xE1 redefinir todas as suas prefer\xEAncias"
    );
    const messageText = await this.app.t(
      "settings.reset.dialog.message",
      "Tem certeza que deseja restaurar todas as configura\xE7\xF5es para os valores padr\xE3o? Todas as suas personaliza\xE7\xF5es ser\xE3o perdidas."
    );
    const cancelText = await this.app.t("settings.reset.dialog.cancel", "Cancelar");
    const confirmText = await this.app.t("settings.reset.dialog.confirm", "Restaurar");
    const modalContent = `
        <div class="text-center">
          <div class="mb-4">
            <i class="fas fa-exclamation-triangle fa-3x text-warning"></i>
          </div>
          <h4 class="mb-3">${titleText}</h4>
          <p class="text-muted mb-3">
            ${subtitleText}
          </p>
          <div class="alert alert-warning">
            <i class="fas fa-info-circle"></i>
            ${messageText}
          </div>
        </div>
      `;
    const modalActions = `
        <button type="button" class="btn btn-secondary" onclick="app.closeModal('resetSettingsDialog')">
          <i class="fas fa-times"></i> ${cancelText}
        </button>
        <button type="button" class="btn btn-danger" onclick="app.modules.navigation.confirmResetSettings()">
          <i class="fas fa-undo"></i> ${confirmText}
        </button>
      `;
    const modalHtml = this.app.createModal(
      "resetSettingsDialog",
      titleText,
      modalContent,
      modalActions
    );
    if (!document.getElementById("resetSettingsDialog")) {
      document.body.insertAdjacentHTML("beforeend", modalHtml);
    }
    this.app.openModal("resetSettingsDialog");
  }
  async confirmResetSettings() {
    this.app.closeModal("resetSettingsDialog");
    await this.app.modules.settings.reset();
    this.loadConfiguracoes();
    this.app.modules.helpers.showNotification(
      await this.app.t(
        "settings.notifications.restored",
        "Configura\xE7\xF5es restauradas para os padr\xF5es"
      ),
      "success"
    );
  }
  refreshCurrentPage() {
    this.navigateTo(this.currentPage);
  }
  // Configurar navegação das guias
  setupTabNavigation() {
    setTimeout(() => {
      const tabButtons = document.querySelectorAll(".tab-btn");
      if (tabButtons.length === 0) {
        setTimeout(() => this.setupTabNavigation(), 200);
        return;
      }
      tabButtons.forEach((button) => {
        button.replaceWith(button.cloneNode(true));
      });
      const newButtons = document.querySelectorAll(".tab-btn");
      newButtons.forEach((button) => {
        const dataTab = button.getAttribute("data-tab");
        button.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.switchTab(dataTab);
        });
      });
      setTimeout(() => {
        this.switchTab("personalization");
      }, 50);
    }, 150);
  }
  // Alternar entre guias
  switchTab(tabId) {
    const allButtons = document.querySelectorAll(".tab-btn");
    const allPanes = document.querySelectorAll(".tab-pane");
    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    const activePane = document.getElementById(tabId);
    if (!activeButton || !activePane) {
      return;
    }
    allButtons.forEach((btn) => btn.classList.remove("active"));
    allPanes.forEach((pane) => {
      pane.classList.remove("active");
      pane.style.display = "none";
    });
    activeButton.classList.add("active");
    activePane.classList.add("active");
    activePane.style.display = "block";
    activePane.offsetHeight;
    if (tabId === "api") {
      this.setupSteamSettings();
    }
  }
  // Manipular mudança da fonte de API
  handleApiSourceChange(source) {
    const steamApiSection = document.getElementById("steamApiSection");
    const hydraApiMessage = document.getElementById("hydraApiMessage");
    if (source === "steam") {
      if (steamApiSection) steamApiSection.style.display = "block";
      if (hydraApiMessage) hydraApiMessage.style.display = "none";
    } else if (source === "hydra") {
      if (steamApiSection) steamApiSection.style.display = "none";
      if (hydraApiMessage) hydraApiMessage.style.display = "block";
    }
  }
  // Alternar visibilidade da Steam API Key
  toggleSteamApiKeyVisibility() {
    const input = document.getElementById("steamApiKeyInput");
    const icon = document.querySelector("#toggleApiKeyBtn i");
    if (input && icon) {
      if (input.type === "password") {
        input.type = "text";
        icon.className = "fas fa-eye-slash";
      } else {
        input.type = "password";
        icon.className = "fas fa-eye";
      }
    }
  }
  // Configurar funcionalidades da Steam API
  async setupSteamSettings() {
    if (!document.getElementById("steamStatusCard")) {
      return;
    }
    await this.loadSteamSettings();
    this.hideSteamStatus = true;
    const statusCard = document.getElementById("steamStatusCard");
    const statusDetails = document.getElementById("steamStatusDetails");
    const syncSettings = document.getElementById("steamSyncSettings");
    const testBtn = document.getElementById("steamTestBtn");
    const disconnectBtn = document.getElementById("steamDisconnectBtn");
    const connectBtn = document.getElementById("steamConnectBtn");
    if (statusCard) statusCard.style.display = "none";
    if (statusDetails) statusDetails.style.display = "none";
    if (syncSettings) syncSettings.style.display = "none";
    if (testBtn) testBtn.style.display = "none";
    if (disconnectBtn) disconnectBtn.style.display = "none";
    if (connectBtn) connectBtn.style.display = "inline-block";
    this.setupSteamEventListeners();
  }
  async loadSteamSettings() {
    if (this.app.isElectronAPIAvailable("steam")) {
      const credentials = await this.app.safeElectronAPICall("steam.getCredentials");
      if (credentials && credentials.success) {
        const apiKeyInput = document.getElementById("steamApiKeyInput");
        const steamIdInput = document.getElementById("steamIdInput");
        if (apiKeyInput && credentials.apiKey) {
          apiKeyInput.value = credentials.apiKey;
        }
        if (steamIdInput && credentials.steamId) {
          steamIdInput.value = credentials.steamId;
        }
      }
    }
  }
  async checkSteamConnection() {
    if (this.hideSteamStatus) {
      const statusCard2 = document.getElementById("steamStatusCard");
      const statusDetails2 = document.getElementById("steamStatusDetails");
      const syncSettings2 = document.getElementById("steamSyncSettings");
      const testBtn2 = document.getElementById("steamTestBtn");
      const disconnectBtn2 = document.getElementById("steamDisconnectBtn");
      if (statusCard2) statusCard2.style.display = "none";
      if (statusDetails2) statusDetails2.style.display = "none";
      if (syncSettings2) syncSettings2.style.display = "none";
      if (testBtn2) testBtn2.style.display = "none";
      if (disconnectBtn2) disconnectBtn2.style.display = "none";
      return;
    }
    const statusCard = document.getElementById("steamStatusCard");
    const statusIcon = document.getElementById("steamStatusIcon");
    const statusTitle = document.getElementById("steamStatusTitle");
    const statusDescription = document.getElementById("steamStatusDescription");
    const statusDetails = document.getElementById("steamStatusDetails");
    const syncSettings = document.getElementById("steamSyncSettings");
    const testBtn = document.getElementById("steamTestBtn");
    const disconnectBtn = document.getElementById("steamDisconnectBtn");
    if (!statusCard) return;
    statusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    statusTitle.textContent = "Verificando...";
    statusDescription.textContent = "Testando conex\xE3o com Steam";
    if (this.app.isElectronAPIAvailable("steam")) {
      const connection = await this.app.safeElectronAPICall("steam.checkConnection");
      if (connection.success && connection.connected) {
        statusCard.className = "steam-status-card status-connected";
        statusIcon.innerHTML = '<i class="fab fa-steam"></i>';
        statusTitle.textContent = "Conectado";
        statusDescription.textContent = `Conectado como ${connection.userInfo?.username || "Usu\xE1rio Steam"}`;
        if (connection.userInfo) {
          statusDetails.style.display = "block";
          statusDetails.innerHTML = `
              <div class="detail-item">
                <span class="detail-label">Usu\xE1rio:</span>
                <span class="detail-value">${connection.userInfo.username}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Perfil:</span>
                <span class="detail-value">
                  <a href="${connection.userInfo.profileUrl || "#"}" target="_blank" class="external-link">
                    Ver Perfil Steam
                  </a>
                </span>
              </div>
            `;
        }
        if (syncSettings) syncSettings.style.display = "block";
        if (testBtn) testBtn.style.display = "inline-block";
        if (disconnectBtn) disconnectBtn.style.display = "inline-block";
      } else {
        const isTimeout = typeof connection.error === "string" && (connection.error.toLowerCase().includes("timeout") || connection.error.includes("ECONNABORTED"));
        if (isTimeout) {
          statusCard.className = "steam-status-card status-error";
          statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
          statusTitle.setAttribute("data-i18n", "settings.api.steam.status.timeout");
          statusTitle.textContent = await this.app.t(
            "settings.api.steam.status.timeout",
            "Tempo de conex\xE3o esgotado"
          );
          statusDescription.setAttribute(
            "data-i18n",
            "settings.api.steam.status.timeout.description"
          );
          statusDescription.textContent = await this.app.t(
            "settings.api.steam.status.timeout.description",
            "A Steam API n\xE3o respondeu dentro do tempo esperado. Verifique sua rede e tente novamente."
          );
          statusDetails.style.display = "none";
          if (syncSettings) syncSettings.style.display = "none";
          if (testBtn) testBtn.style.display = "inline-block";
          if (disconnectBtn) disconnectBtn.style.display = "none";
          this.app.modules.helpers.showNotification(
            await this.app.t("settings.api.steam.status.timeout", "Tempo de conex\xE3o esgotado"),
            "warning",
            5e3
          );
        } else {
          statusCard.className = "steam-status-card status-disconnected";
          statusIcon.innerHTML = '<i class="fab fa-steam"></i>';
          statusTitle.setAttribute("data-i18n", "settings.api.steam.status.disconnected");
          statusTitle.textContent = await this.app.t(
            "settings.api.steam.status.disconnected",
            "Desconectado"
          );
          statusDescription.setAttribute(
            "data-i18n",
            "settings.api.steam.status.disconnected.description"
          );
          const looksLikeKey = /* @__PURE__ */ __name22222(
            (s) => typeof s === "string" && s.includes(".") && !s.includes(" "),
            "looksLikeKey"
          );
          const descText = connection.error || await this.app.t(
            "settings.api.steam.status.disconnected.description",
            "Configure suas credenciais para conectar"
          );
          if (looksLikeKey(descText)) {
            const translated = await this.app.t(descText, "");
            if (!translated || translated === descText) {
              statusDescription.style.display = "none";
              statusDescription.textContent = "";
            } else {
              statusDescription.style.display = "block";
              statusDescription.textContent = translated;
            }
          } else {
            statusDescription.style.display = "block";
            statusDescription.textContent = descText;
          }
          statusDetails.style.display = "none";
          if (syncSettings) syncSettings.style.display = "none";
          if (testBtn) testBtn.style.display = "none";
          if (disconnectBtn) disconnectBtn.style.display = "none";
        }
      }
    } else {
      statusCard.className = "steam-status-card status-error";
      statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      statusTitle.setAttribute("data-i18n", "settings.api.steam.status.unavailable");
      statusTitle.textContent = await this.app.t(
        "settings.api.steam.status.unavailable",
        "Sistema n\xE3o dispon\xEDvel"
      );
      statusDescription.setAttribute(
        "data-i18n",
        "settings.api.steam.status.unavailable.description"
      );
      statusDescription.textContent = await this.app.t(
        "settings.api.steam.status.unavailable.description",
        "Funcionalidade dispon\xEDvel apenas no aplicativo desktop"
      );
      statusDetails.style.display = "none";
      if (syncSettings) syncSettings.style.display = "none";
      if (testBtn) testBtn.style.display = "none";
      if (disconnectBtn) disconnectBtn.style.display = "none";
    }
  }
  setupSteamEventListeners() {
    const connectBtn = document.getElementById("steamConnectBtn");
    if (connectBtn) {
      connectBtn.addEventListener("click", async () => {
        await this.connectToSteam();
      });
    }
    const testBtn = document.getElementById("steamTestBtn");
    if (testBtn) {
      testBtn.addEventListener("click", async () => {
        await this.checkSteamConnection();
      });
    }
    const disconnectBtn = document.getElementById("steamDisconnectBtn");
    if (disconnectBtn) {
      disconnectBtn.addEventListener("click", async () => {
        await this.disconnectFromSteam();
      });
    }
    const toggleApiKeyBtn = document.getElementById("toggleSteamApiKeyBtn");
    const apiKeyInput = document.getElementById("steamApiKeyInput");
    if (toggleApiKeyBtn && apiKeyInput) {
      toggleApiKeyBtn.addEventListener("click", () => {
        const isPassword = apiKeyInput.type === "password";
        apiKeyInput.type = isPassword ? "text" : "password";
        toggleApiKeyBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
      });
    }
    const findSteamIdBtn = document.getElementById("findSteamIdBtn");
    if (findSteamIdBtn) {
      findSteamIdBtn.addEventListener("click", () => {
        window.open("https://steamid.io/", "_blank");
      });
    }
    const getSteamIdBtn = document.getElementById("getSteamIdBtn");
    if (getSteamIdBtn) {
      getSteamIdBtn.addEventListener("click", async () => {
        await this.discoverSteamIdAutomatically();
      });
    }
    const selectSteamDirBtn = document.getElementById("selectSteamDirBtn");
    if (selectSteamDirBtn) {
      selectSteamDirBtn.addEventListener("click", async () => {
        await this.selectSteamDirectory();
      });
    }
  }
  async connectToSteam() {
    try {
      const connectBtn = document.getElementById("steamConnectBtn");
      const apiKeyInput = document.getElementById("steamApiKeyInput");
      if (!apiKeyInput) {
        this.app.showError("Campo de API Key n\xE3o encontrado");
        return;
      }
      const apiKey = apiKeyInput.value.trim();
      if (!apiKey) {
        this.app.showError("Por favor, preencha a API Key");
        return;
      }
      if (connectBtn) {
        connectBtn.disabled = true;
        connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...';
      }
      if (this.app.isElectronAPIAvailable("steam")) {
        const result = await this.app.safeElectronAPICall("steam.setCredentials", apiKey);
        if (result.success) {
          this.app.showSuccess("Conex\xE3o Steam configurada com sucesso!");
          await this.checkSteamConnection();
          setTimeout(() => {
            this.loadSteamGames();
          }, 1e3);
        } else {
          this.app.showError(`Erro na conex\xE3o: ${result.error || "Erro desconhecido"}`);
        }
      }
    } catch (error) {
      this.app.showError("Erro ao configurar conex\xE3o Steam\n" + error);
    } finally {
      const connectBtn = document.getElementById("steamConnectBtn");
      if (connectBtn) {
        connectBtn.disabled = false;
        connectBtn.innerHTML = '<i class="fas fa-plug"></i> <span data-i18n="settings.steam.connect">Conectar</span>';
      }
    }
  }
  async discoverSteamIdAutomatically() {
    try {
      const apiKeyInput = document.getElementById("steamApiKeyInput");
      const steamIdInput = document.getElementById("steamIdInput");
      const getSteamIdBtn = document.getElementById("getSteamIdBtn");
      if (!apiKeyInput) {
        this.app.showError("Campo de API Key n\xE3o encontrado");
        return;
      }
      const apiKey = apiKeyInput.value.trim();
      if (!apiKey) {
        this.app.showError("Por favor, preencha a API Key primeiro");
        return;
      }
      if (getSteamIdBtn) {
        getSteamIdBtn.disabled = true;
        getSteamIdBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span data-i18n="settings.api.steam.authenticating">Descobrindo...</span>';
      }
      if (this.app.isElectronAPIAvailable("steam")) {
        const result = await this.app.safeElectronAPICall("steam.discoverSteamId", apiKey);
        if (result.success && result.steamId) {
          if (steamIdInput) {
            steamIdInput.value = result.steamId;
          }
          this.app.showSuccess(`Steam ID descoberto com sucesso: ${result.steamId}`);
        } else {
          this.app.showError(
            `N\xE3o foi poss\xEDvel descobrir o Steam ID: ${result.error || "Erro desconhecido"}`
          );
        }
      }
    } catch (error) {
      this.app.showError("Erro ao descobrir Steam ID automaticamente", +"\n" + error);
    } finally {
      const getSteamIdBtn = document.getElementById("getSteamIdBtn");
      if (getSteamIdBtn) {
        getSteamIdBtn.disabled = false;
        getSteamIdBtn.innerHTML = '<i class="fas fa-magic"></i> <span data-i18n="settings.api.steam.getSteamId">Obter Steam ID Automaticamente</span>';
      }
    }
  }
  async disconnectFromSteam() {
    const apiKeyInput = document.getElementById("steamApiKeyInput");
    const steamIdInput = document.getElementById("steamIdInput");
    if (apiKeyInput) apiKeyInput.value = "";
    if (steamIdInput) steamIdInput.value = "";
    await this.checkSteamConnection();
    this.app.showSuccess(
      await this.app.t(
        "settings.api.steam.status.disconnected.success",
        "Desconectado da Steam API"
      )
    );
  }
  async loadSteamGames() {
    if (this.app.isElectronAPIAvailable("steam")) {
      const gamesResult = await this.app.safeElectronAPICall("steam.getUserGames", {
        installedOnly: true
      });
      if (gamesResult.success) {
        if (gamesResult.totalGames > 0) {
          this.app.showSuccess(
            `${gamesResult.totalGames} jogos instalados carregados da Steam! V\xE1 para Dashboard para visualiz\xE1-los.`
          );
        } else {
          this.app.showInfo("Nenhum jogo Steam instalado encontrado");
        }
      }
    }
  }
  async clearSteamCache() {
    if (this.app.isElectronAPIAvailable("steam")) {
      const result = await this.app.safeElectronAPICall("steam.clearCache");
      if (result.success) {
        this.app.showSuccess("Cache Steam limpo com sucesso! \u{1F9F9}");
        if (window.app?.steamGames) {
          await window.app.steamGames.loadSteamGames();
        }
      } else {
        this.app.showError("Erro ao limpar cache Steam");
      }
    } else {
      this.app.showWarning("Funcionalidade de cache n\xE3o dispon\xEDvel");
    }
  }
  // Configurar funcionalidades do Goldberg
  async setupGoldbergSettings() {
    if (!document.getElementById("goldbergStatusCard")) {
      return;
    }
    await this.loadGoldbergSettings();
    await this.checkGoldbergStatus();
    this.setupGoldbergEventListeners();
  }
  async loadGoldbergSettings() {
    if (this.app.isElectronAPIAvailable("goldberg")) {
      const settings = await this.app.safeElectronAPICall("goldberg.getSettings");
      if (settings) {
        const autoMigrationToggle = document.getElementById("goldbergAutoMigrationToggle");
        const showDialogToggle = document.getElementById("goldbergShowDialogToggle");
        if (autoMigrationToggle) autoMigrationToggle.checked = settings.autoMigration || false;
        if (showDialogToggle) showDialogToggle.checked = settings.showDialog !== false;
      }
    }
  }
  async checkGoldbergStatus() {
    const statusCard = document.getElementById("goldbergStatusCard");
    const statusIcon = document.getElementById("goldbergStatusIcon");
    const statusTitle = document.getElementById("goldbergStatusTitle");
    const statusDescription = document.getElementById("goldbergStatusDescription");
    const statusDetails = document.getElementById("goldbergStatusDetails");
    const migrateBtn = document.getElementById("goldbergMigrateBtn");
    if (!statusCard) return;
    statusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    statusTitle.textContent = "Verificando...";
    statusDescription.textContent = "Procurando por arquivos Goldberg";
    if (this.app.isElectronAPIAvailable("goldberg")) {
      const goldbergInfo = await this.app.safeElectronAPICall("goldberg.checkFolder");
      if (goldbergInfo.exists && goldbergInfo.gamesCount > 0) {
        statusCard.className = "goldberg-status-card status-found";
        statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        statusTitle.textContent = `${goldbergInfo.gamesCount} jogo(s) encontrado(s)`;
        statusDescription.textContent = "Jogos dispon\xEDveis para convers\xE3o";
        statusDetails.style.display = "block";
        const userStatus = goldbergInfo.currentUser || "N\xE3o detectado";
        const userClass = goldbergInfo.currentUser ? "user-detected" : "user-not-detected";
        const pathStatus = goldbergInfo.path || "N\xE3o encontrada";
        const pathClass = goldbergInfo.path ? "path-found" : "path-not-found";
        statusDetails.innerHTML = `
            <div class="detail-item">
              <span class="detail-label">Usu\xE1rio:</span>
              <span class="detail-value ${userClass}">${userStatus}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Pasta:</span>
              <span class="detail-value ${pathClass}">${pathStatus}</span>
            </div>
            ${!goldbergInfo.currentUser ? `
            <div class="detail-item warning-item">
              <span class="detail-label" data-i18n="goldberg.warning.userNotDetected.label">\u26A0\uFE0F Aviso:</span>
              <span class="detail-value" data-i18n="goldberg.warning.userNotDetected.description">Usu\xE1rio n\xE3o detectado automaticamente. Verifique as permiss\xF5es do sistema.</span>
            </div>
            ` : ""}
          `;
        if (migrateBtn) migrateBtn.style.display = "inline-block";
      } else if (goldbergInfo.exists) {
        statusCard.className = "goldberg-status-card status-empty";
        statusIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        statusTitle.setAttribute("data-i18n", "goldberg.status.empty");
        statusTitle.textContent = await this.app.t("goldberg.status.empty", "Pasta Goldberg vazia");
        statusDescription.setAttribute("data-i18n", "goldberg.status.empty.description");
        statusDescription.textContent = await this.app.t(
          "goldberg.status.empty.description",
          "A pasta existe mas n\xE3o cont\xE9m jogos para converter"
        );
        statusDetails.style.display = "none";
        if (migrateBtn) migrateBtn.style.display = "none";
      } else {
        statusCard.className = "goldberg-status-card status-not-found";
        statusIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
        statusTitle.setAttribute("data-i18n", "goldberg.status.notFound");
        statusTitle.textContent = await this.app.t(
          "goldberg.status.notFound",
          "Goldberg n\xE3o encontrado"
        );
        statusDescription.setAttribute("data-i18n", "goldberg.status.notFound.description");
        statusDescription.textContent = await this.app.t(
          "goldberg.status.notFound.description",
          "Nenhuma instala\xE7\xE3o Goldberg SteamEmu Saves detectada"
        );
        statusDetails.style.display = "none";
        if (migrateBtn) migrateBtn.style.display = "none";
      }
    } else {
      statusCard.className = "goldberg-status-card status-error";
      statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      statusTitle.setAttribute("data-i18n", "goldberg.status.unavailable");
      statusTitle.textContent = await this.app.t(
        "goldberg.status.unavailable",
        "Sistema n\xE3o dispon\xEDvel"
      );
      statusDescription.setAttribute("data-i18n", "goldberg.status.unavailable.description");
      statusDescription.textContent = await this.app.t(
        "goldberg.status.unavailable.description",
        "Funcionalidade dispon\xEDvel apenas no aplicativo desktop"
      );
      statusDetails.style.display = "none";
      if (migrateBtn) migrateBtn.style.display = "none";
    }
  }
  setupGoldbergEventListeners() {
    const checkBtn = document.getElementById("goldbergCheckBtn");
    if (checkBtn) {
      checkBtn.addEventListener("click", async () => {
        await this.checkGoldbergStatus();
      });
    }
    const migrateBtn = document.getElementById("goldbergMigrateBtn");
    if (migrateBtn) {
      migrateBtn.addEventListener("click", async () => {
        await this.migrateAllGoldbergGames();
      });
    }
    const autoMigrationToggle = document.getElementById("goldbergAutoMigrationToggle");
    const showDialogToggle = document.getElementById("goldbergShowDialogToggle");
    if (autoMigrationToggle) {
      autoMigrationToggle.addEventListener("change", async () => {
        await this.updateGoldbergSetting("autoMigration", autoMigrationToggle.checked);
      });
    }
    if (showDialogToggle) {
      showDialogToggle.addEventListener("change", async () => {
        await this.updateGoldbergSetting("showDialog", showDialogToggle.checked);
      });
    }
  }
  async updateGoldbergSetting(key, value) {
    if (this.app.isElectronAPIAvailable("goldberg")) {
      const result = await this.app.safeElectronAPICall("goldberg.setSetting", key, value);
      if (!result.success) {
        this.app.showError(`Erro ao salvar configura\xE7\xE3o: ${result.error}`);
      }
    }
  }
  async migrateAllGoldbergGames() {
    try {
      const migrateBtn = document.getElementById("goldbergMigrateBtn");
      if (migrateBtn) {
        migrateBtn.disabled = true;
        migrateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${await this.app.t("steam.conversion.converting", "Convertendo...")}`;
      }
      if (this.app.isElectronAPIAvailable("goldberg")) {
        const result = await this.app.safeElectronAPICall("goldberg.migrateAll");
        if (result.success) {
          this.app.showSuccess(
            await this.app.t("goldberg.migration.completed", "Migra\xE7\xE3o conclu\xEDda") + `: ${result.successCount} / ${result.totalGames}`
          );
          await this.checkGoldbergStatus();
        } else {
          this.app.showError(
            await this.app.t("goldberg.migration.error", "Erro na migra\xE7\xE3o") + (result.error ? `: ${result.error}` : "")
          );
        }
      }
    } catch (error) {
      this.app.showError(
        await this.app.t("goldberg.migration.error", "Erro na migra\xE7\xE3o") + "\n" + error
      );
    } finally {
      const migrateBtn = document.getElementById("goldbergMigrateBtn");
      if (migrateBtn) {
        migrateBtn.disabled = false;
        migrateBtn.innerHTML = '<i class="fas fa-play"></i> <span data-i18n="settings.goldberg.migrateAll">Converter Todos</span>';
      }
    }
  }
  // Método de navegação global
  async showPage(page, tabName = null) {
    await this.navigateTo(page, tabName);
  }
  // Mostrar dialog "Em breve"
  async restartApplication() {
    this.app.modules.helpers.showNotification(
      await this.app.t("settings.restart.restarting", "Reiniciando aplicativo..."),
      "info"
    );
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    if (window.electronAPI && window.electronAPI.system) {
      await window.electronAPI.system.restart();
    } else {
      window.location.reload();
    }
  }
  async showRestartDialog() {
    let isDevelopmentMode = false;
    if (window.electronAPI && typeof window.electronAPI.isDevelopmentMode === "function") {
      try {
        isDevelopmentMode = await window.electronAPI.isDevelopmentMode();
      } catch {
        isDevelopmentMode = window.env?.NODE_ENV === "development";
      }
    } else {
      isDevelopmentMode = window.env?.NODE_ENV === "development";
    }
    let isInstalled = false;
    if (window.electronAPI && typeof window.electronAPI.isInstalledVersion === "function") {
      try {
        isInstalled = await window.electronAPI.isInstalledVersion();
      } catch {
        isInstalled = false;
      }
    } else {
      isInstalled = false;
    }
    const restartTitle = await this.app.t(
      "settings.restart.modal.title",
      "Reinicializa\xE7\xE3o Necess\xE1ria"
    );
    const restartMessage = isInstalled ? await this.app.t(
      "settings.restart.modal.messageInstalled",
      "Para aplicar as mudan\xE7as, o aplicativo ser\xE1 reiniciado automaticamente."
    ) : await this.app.t(
      "settings.restart.modal.message",
      "Para aplicar as mudan\xE7as, o aplicativo ser\xE1 finalizado. Voc\xEA precisar\xE1 abri-lo novamente manualmente."
    );
    const restartConfirm = isInstalled ? await this.app.t("settings.restart.modal.confirmInstalled", "Reiniciar Agora") : await this.app.t("settings.restart.modal.confirm", "Finalizar Agora");
    const restartCancel = await this.app.t("settings.restart.modal.cancel", "Cancelar");
    const isDarkTheme = document.documentElement.getAttribute("data-theme") === "dark" || document.body.classList.contains("dark-theme") || window.matchMedia("(prefers-color-scheme: dark)").matches;
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay restart-modal-overlay";
    overlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(0, 0, 0, ${isDarkTheme ? "0.8" : "0.6"}) !important;
        backdrop-filter: blur(10px) !important;
        z-index: 2500 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        animation: fadeIn 0.3s ease !important;
        pointer-events: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
      `;
    const modal = document.createElement("div");
    modal.className = "restart-modal";
    const modalStyles = isDarkTheme ? {
      background: "linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)",
      border: "1px solid #404040",
      color: "#ffffff",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)"
    } : {
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      border: "1px solid #e0e0e0",
      color: "#333333",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)"
    };
    modal.style.cssText = `
        background: ${modalStyles.background} !important;
        border: ${modalStyles.border} !important;
        color: ${modalStyles.color} !important;
        border-radius: 20px !important;
        padding: 3rem !important;
        max-width: 500px !important;
        width: 90% !important;
        text-align: center !important;
        box-shadow: ${modalStyles.boxShadow} !important;
        backdrop-filter: blur(20px) !important;
        animation: slideIn 0.3s ease !important;
        position: relative !important;
        z-index: 2501 !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      `;
    modal.innerHTML = `
        <div class="modal-icon" style="font-size: 4rem; color: var(--accent-color); margin-bottom: 1.5rem;">
          <i class="fas ${isInstalled ? "fa-sync-alt" : "fa-power-off"}"></i>
        </div>
        <h2 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.8rem; font-weight: 600;">
          ${restartTitle}
        </h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 1.1rem; line-height: 1.6;">
          ${restartMessage}
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button id="restartConfirmBtn" class="btn btn-primary restart-confirm-btn" style="
            padding: 0.8rem 2rem;
            border-radius: 12px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: #ffffff;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
            box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
          ">
            <i class="fas ${isInstalled ? "fa-sync-alt" : "fa-power-off"}" style="margin-right: 0.5rem;"></i>
            ${restartConfirm}
          </button>
          <button id="restartCancelBtn" class="btn btn-secondary restart-cancel-btn" style="
            padding: 0.8rem 2rem;
            border-radius: 12px;
            background: var(--card-bg);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          ">
            <i class="fas fa-times" style="margin-right: 0.5rem;"></i>
            ${restartCancel}
          </button>
        </div>
      `;
    const style = document.createElement("style");
    style.textContent = `
        .restart-modal button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        
        .restart-confirm-btn:hover {
          background: linear-gradient(135deg, #0056b3, #004085) !important;
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4) !important;
        }
        
        .restart-cancel-btn:hover {
          background: var(--hover-bg) !important;
          border-color: var(--accent-color) !important;
        }
        
        /* Estilos espec\xEDficos para tema escuro */
        [data-theme="dark"] .restart-modal,
        .dark-theme .restart-modal {
          background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%) !important;
          border: 1px solid #404040 !important;
          color: #ffffff !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6) !important;
        }
        
        [data-theme="dark"] .restart-confirm-btn,
        .dark-theme .restart-confirm-btn {
          background: linear-gradient(135deg, #0d6efd, #0a58ca) !important;
          box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4) !important;
        }
        
        [data-theme="dark"] .restart-confirm-btn:hover,
        .dark-theme .restart-confirm-btn:hover {
          background: linear-gradient(135deg, #0a58ca, #084298) !important;
          box-shadow: 0 6px 20px rgba(13, 110, 253, 0.5) !important;
        }
        
        /* Estilos espec\xEDficos para tema claro */
        [data-theme="light"] .restart-modal,
        .light-theme .restart-modal,
        body:not([data-theme]) .restart-modal {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
          border: 1px solid #e0e0e0 !important;
          color: #333333 !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2) !important;
        }
        
        /* Anima\xE7\xF5es */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
      `;
    document.head.appendChild(style);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    setTimeout(async () => {
      const isInDOM = document.body.contains(overlay);
      const overlayRect = overlay.getBoundingClientRect();
      const modalRect = modal.getBoundingClientRect();
      const overlayStyle = window.getComputedStyle(overlay);
      const modalStyle = window.getComputedStyle(modal);
      const isOverlayVisible = overlayStyle.display !== "none" && overlayStyle.visibility !== "hidden" && overlayStyle.opacity !== "0" && overlayRect.width > 0 && overlayRect.height > 0;
      const isModalVisible = modalStyle.display !== "none" && modalStyle.visibility !== "hidden" && modalStyle.opacity !== "0" && modalRect.width > 0 && modalRect.height > 0;
      if (!isInDOM || !isOverlayVisible || !isModalVisible) {
        if (document.body.contains(overlay)) {
          overlay.remove();
        }
        const fallbackMessage = isInstalled ? await this.app.t(
          "settings.restart.modal.messageInstalled",
          "Para aplicar as mudan\xE7as, o aplicativo ser\xE1 reiniciado automaticamente."
        ) : await this.app.t(
          "settings.restart.modal.message",
          "Para aplicar as mudan\xE7as, o aplicativo ser\xE1 finalizado. Voc\xEA precisar\xE1 abri-lo novamente manualmente."
        );
        const confirmText = isInstalled ? "Deseja reiniciar agora?" : "Deseja finalizar agora?";
        const shouldRestart = window.confirm(fallbackMessage + "\n\n" + confirmText);
        if (shouldRestart) {
          await this.restartApplication();
        }
        return;
      }
    }, 500);
    const confirmBtn = modal.querySelector("#restartConfirmBtn");
    const cancelBtn = modal.querySelector("#restartCancelBtn");
    confirmBtn.addEventListener("click", async () => {
      if (isDevelopmentMode) {
        overlay.remove();
        style.remove();
        const devTitle = await this.app.t("settings.restart.dev.title", "Modo Desenvolvimento");
        const devMessage = await this.app.t(
          "settings.restart.dev.message",
          'O restart n\xE3o funciona no modo de desenvolvimento. Para aplicar as mudan\xE7as, pare o servidor (Ctrl+C) e execute "yarn dev" novamente.'
        );
        alert(`${devTitle}

${devMessage}`);
        return;
      }
      overlay.remove();
      style.remove();
      await this.restartApplication();
    });
    cancelBtn.addEventListener("click", () => {
      overlay.remove();
      style.remove();
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        style.remove();
      }
    });
    const handleEsc = /* @__PURE__ */ __name22222((e) => {
      if (e.key === "Escape") {
        overlay.remove();
        style.remove();
        document.removeEventListener("keydown", handleEsc);
      }
    }, "handleEsc");
    document.addEventListener("keydown", handleEsc);
  }
  async showComingSoonDialog(featureName) {
    const comingSoonText = this.app.modules.helpers.t("feature.coming.soon");
    const featureText = this.app.modules.helpers.t("feature.dialog.default.name");
    const developmentText = this.app.modules.helpers.t("feature.will.be.launched");
    const workingText = this.app.modules.helpers.t("feature.working.hard");
    const understoodText = this.app.modules.helpers.t("feature.dialog.understood");
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
      `;
    const modal = document.createElement("div");
    modal.className = "coming-soon-modal";
    modal.style.cssText = `
        background: linear-gradient(135deg, var(--card-bg) 0%, rgba(255, 255, 255, 0.05) 100%);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: 3rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(20px);
        animation: slideIn 0.3s ease;
        position: relative;
      `;
    modal.innerHTML = `
        <div class="modal-icon" style="font-size: 4rem; color: var(--accent-color); margin-bottom: 1.5rem;">
          <i class="fas fa-rocket"></i>
        </div>
        <h2 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.8rem;">
          ${comingSoonText}
        </h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 1.1rem; line-height: 1.6;">
          ${featureText} <strong style="color: var(--accent-color);">${featureName}</strong> ${developmentText}
        </p>
        <div style="margin-bottom: 2rem;">
          <div style="background: rgba(var(--accent-color-rgb), 0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem;">
            <p style="color: var(--text-primary); margin: 0; font-weight: 500;">
              <i class="fas fa-info-circle" style="color: var(--accent-color); margin-right: 0.5rem;"></i>
              ${workingText}
            </p>
          </div>
        </div>
        <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()" style="
          padding: 0.8rem 2rem;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
          color: white;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        ">
          <i class="fas fa-check" style="margin-right: 0.5rem;"></i>
          ${understoodText}
        </button>
      `;
    const style = document.createElement("style");
    style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-50px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .coming-soon-modal .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(var(--accent-color-rgb), 0.4);
        }
      `;
    document.head.appendChild(style);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        style.remove();
      }
    });
    const handleEsc = /* @__PURE__ */ __name22222((e) => {
      if (e.key === "Escape") {
        overlay.remove();
        style.remove();
        document.removeEventListener("keydown", handleEsc);
      }
    }, "handleEsc");
    document.addEventListener("keydown", handleEsc);
  }
}
window.NavigationManager = NavigationManager;
export {
  NavigationManager
};
