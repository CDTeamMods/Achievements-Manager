// Módulo de Navegação e Gerenciamento de Páginas
class NavigationManager {
  constructor(app) {
    this.app = app;
    this.currentPage = null; // Inicializar como null para permitir primeira navegação
    // Flag para ocultar o cartão de status da Steam nas Configurações (deixar somente o botão Connect)
    this.hideSteamStatus = false;
  }

  async navigateTo(page, tabName = null) {
    // Forçar carregamento se for a primeira navegação ou se a página for diferente
    const shouldLoad = this.currentPage !== page || this.currentPage === null || tabName;
    
    if (!shouldLoad) {
      return;
    }

    // Atualizar navegação ativa
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });

    const activeNavItem = document.querySelector(`.nav-item[href="#${page}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }

    // Atualizar título da página
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
      pageTitle.textContent = await this.getPageTitle(page);
    }

    // Carregar conteúdo da página
    const contentBody = document.getElementById('contentBody');
    if (contentBody) {
      // Mostrar loading apenas se não for a primeira carga da dashboard
      if (this.currentPage !== null) {
        contentBody.innerHTML = '<div class="loading" data-i18n="common.loading">Carregando...</div>';
      }

      try {
        await this.loadPageContent(page);
      } catch (error) {
        // Log removido para evitar dependência circular com DebugManager
        contentBody.innerHTML = `
          <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3 data-i18n="errors.pageLoad">Erro ao carregar página</h3>
            <p data-i18n="errors.pageLoadMessage">Não foi possível carregar o conteúdo da página.</p>
            <button class="btn btn-primary" onclick="app.modules.navigation.navigateTo('${page}')">
              <i class="fas fa-redo"></i> Tentar Novamente
            </button>
          </div>
        `;
        
        // Aplicar traduções mesmo no caso de erro
        if (window.translatePage && typeof window.translatePage === 'function') {
          await window.translatePage();
        } else if (this.app && this.app.translatePage) {
          await this.app.translatePage();
        }
      }
    }

    this.currentPage = page;

    // Se foi especificada uma tab, ativá-la após um pequeno delay para garantir que o DOM está pronto
    if (tabName && page === 'configuracoes') {
      setTimeout(() => {
        this.switchTab(tabName);
      }, 100);
    }
  }

  async getPageTitle(page) {
    const titles = {
      dashboard: 'nav.dashboard',
      statistics: 'nav.statistics',
      backup: 'nav.backup',
      settings: 'nav.settings',
    };
    const titleKey = titles[page] || 'nav.dashboard';

    // Usar o sistema de tradução se disponível
    if (window.t && typeof window.t === 'function') {
      return await window.t(titleKey);
    }

    // Fallback para valores padrão
    const fallbacks = {
      dashboard: 'Dashboard',
      statistics: 'Estatísticas',
      backup: 'Backup',
      configuracoes: 'Configurações',
    };
    return fallbacks[page] || 'Página';
  }

  async loadPageContent(page) {
    switch (page) {
      case 'dashboard':
        await this.loadDashboard();
        break;
      case 'statistics':
        await this.loadStatistics();
        break;
      case 'backup':
        await this.loadBackup();
        break;
      case 'configuracoes':
        await this.loadConfiguracoes();
        break;
      default:
        throw new Error(`Página não encontrada: ${page}`);
    }
  }

  async loadDashboard() {
    const contentBody = document.getElementById('contentBody');

    try {
      // Carregar dados do dashboard
      const [gamesData, achievementsData, statsData, steamConn] = await Promise.all([
        this.app.isElectronAPIAvailable('games')
          ? this.app.safeElectronAPICall('games.getAll')
          : [],
        this.app.isElectronAPIAvailable('achievements')
          ? this.app.safeElectronAPICall('achievements.getStats')
          : {},
        this.app.isElectronAPIAvailable('performance')
          ? this.app.safeElectronAPICall('performance.getMetrics')
          : {},
        this.app.isElectronAPIAvailable('steam')
          ? this.app.safeElectronAPICall('steam.checkConnection')
          : { success: false, connected: false },
      ]);

      // Renderizar dashboard
      const dashboardHTML = await this.renderDashboard(gamesData, achievementsData, statsData, steamConn);

      contentBody.innerHTML = dashboardHTML;

      // Aplicar traduções aos elementos da dashboard
      if (window.translatePage && typeof window.translatePage === 'function') {
        await window.translatePage();
      } else if (this.app && this.app.translatePage) {
        await this.app.translatePage();
      }

      // Configurar event listeners específicos do dashboard
      this.setupDashboardEvents();

      // Auto-carregar jogos da Steam se já houver credenciais válidas
      await this.autoLoadSteamGamesIfConfigured();
    } catch (error) {
      contentBody.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3 data-i18n="dashboard.error.title">Erro ao carregar dashboard</h3>
          <p data-i18n="dashboard.error.message">Não foi possível carregar os dados do dashboard.</p>
          <p>Erro: ${error.message}</p>
        </div>
      `;

      // Aplicar traduções mesmo no caso de erro
      if (window.translatePage && typeof window.translatePage === 'function') {
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
    try {
      // Garantir que estamos na Dashboard e que o container existe
      const gamesContainer = document.getElementById('steam-games-container');
      if (!gamesContainer) return;

      // Verificar disponibilidade do gerenciador de jogos
      const manager = window.steamGamesManager;
      if (!manager || typeof manager.loadSteamGames !== 'function') return;

      // Verificar credenciais e conexão com a Steam
      if (this.app.isElectronAPIAvailable('steam')) {
        const credentials = await this.app.safeElectronAPICall('steam.getCredentials');
        if (credentials?.success && credentials.apiKey) {
          const connection = await this.app.safeElectronAPICall('steam.checkConnection');
          if (connection?.success && connection.connected) {
            // Carregar jogos automaticamente (evitar duplicar se já carregando)
            await manager.loadSteamGames();
          }
        }
      }
    } catch (error) {
      // Silenciar erros para não interferir na experiência da Dashboard
    }
  }

  async renderDashboard(games, achievements, stats, steamConn = { connected: false }) {
    const totalGames = games?.length || 0;
    const totalAchievements = achievements?.total || 0;
    const unlockedAchievements = achievements?.unlocked || 0;
    const completionRate =
      totalAchievements > 0 ? ((unlockedAchievements / totalAchievements) * 100).toFixed(1) : 0;
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
          <!-- Seção Steam Games -->
          <div class="steam-section">
            <div class="section-header">
              <h3><i class="fab fa-steam"></i> <span data-i18n="dashboard.steamGames">Biblioteca Steam</span></h3>
              <div class="section-actions">
                ${
                  isSteamConnected
                    ? ''
                    : `<button class="btn btn-secondary btn-sm" onclick="window.steamGamesManager?.loadSteamGames()" title="Carregar jogos Steam">
                         <i class="fas fa-refresh"></i> <span data-i18n="dashboard.loadSteam">Carregar Jogos</span>
                       </button>`
                }
              </div>
            </div>
            <div id="steam-games-container">
              <div class="steam-placeholder">
                <div class="placeholder-icon">
                  <i class="fab fa-steam"></i>
                </div>
                <h4 data-i18n="dashboard.steam.connect">Conecte sua conta Steam</h4>
                <p data-i18n="dashboard.steam.description">Configure sua Steam API Key nas configurações para ver seus jogos automaticamente</p>
                <button class="btn btn-primary" onclick="navigationManager.showPage('settings', 'steam')">
                  <i class="fas fa-plug"></i> <span data-i18n="dashboard.steam.configureNow">Configurar Agora</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    // Aplicar traduções aos elementos da página de backup
    if (this.app.modules.helpers && this.app.modules.helpers.translatePage) {
      await this.app.modules.helpers.translatePage();
    }

    // Inicializar os event listeners e configurações específicas
    this.setupSettingEventListeners();
    this.setupSteamSettings();
    this.setupGoldbergSettings();
  }

  setupDashboardEvents() {
    // Event listeners específicos do dashboard
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
      card.addEventListener('click', () => {
        const gameId = card.dataset.gameId;
        this.openGameDetails(gameId);
      });
    });
  }

  async loadStatistics() {
    const contentBody = document.getElementById('contentBody');

    try {
      // Carregar dados de estatísticas
      const gamesData = this.app.isElectronAPIAvailable('games')
        ? await this.app.safeElectronAPICall('games.getAll')
        : [];
      const achievementsData = this.app.isElectronAPIAvailable('achievements')
        ? await this.app.safeElectronAPICall('achievements.getStats')
        : {};

      const totalGames = gamesData?.length || 0;
      const totalAchievements = achievementsData?.total || 0;
      const unlockedAchievements = achievementsData?.unlocked || 0;
      const completionRate =
        totalAchievements > 0 ? ((unlockedAchievements / totalAchievements) * 100).toFixed(1) : 0;

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
                <div class="stat-trend ${completionRate > 50 ? 'positive' : 'neutral'}">
                  <i class="fas fa-${completionRate > 50 ? 'arrow-up' : 'minus'}"></i>
                  <span data-i18n="statistics.trend.${completionRate > 50 ? 'excellent' : 'keepGoing'}">${completionRate > 50 ? 'Excellent!' : 'Keep going!'}</span>
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

      // Aplicar traduções aos elementos da página de estatísticas
      if (this.app.modules.helpers && this.app.modules.helpers.translatePage) {
        await this.app.modules.helpers.translatePage();
      }
    } catch (error) {
      // Log removido para evitar dependência circular com DebugManager
      contentBody.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3 data-i18n="statistics.error.title">Error loading statistics</h3>
          <p data-i18n="statistics.error.message">Could not load statistics data.</p>
          <button class="btn btn-primary" onclick="app.modules.navigation.navigateTo('statistics')">
            <span data-i18n="statistics.error.retry">Try again</span>
          </button>
        </div>
      `;

      // Aplicar traduções mesmo em caso de erro
      if (this.app.modules.helpers && this.app.modules.helpers.translatePage) {
        await this.app.modules.helpers.translatePage();
      }
    }
  }

  async loadBackup() {
    const contentBody = document.getElementById('contentBody');

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

        <!-- Grid de Ações Principais -->
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

    // Aplicar traduções aos elementos da página de backup
    if (this.app.modules.helpers && this.app.modules.helpers.translatePage) {
      await this.app.modules.helpers.translatePage();
    }
  }

  async loadConfiguracoes() {
    const contentBody = document.getElementById('contentBody');

    if (!contentBody) {
      return;
    }

    contentBody.innerHTML = `
      <div class="settings-page-container">
        <div class="page-header">
          <h2><i class="fas fa-cog"></i> <span data-i18n="settings.title">Settings</span></h2>
          <p data-i18n="settings.description">Customize your Achievements Manager experience</p>
        </div>
        
        <!-- Guias de Configurações -->
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
              <i class="fas fa-exchange-alt"></i> <span data-i18n="settings.goldberg">Conversão Goldberg</span>
            </button>
          </div>
          
          <div class="tab-content">
            <!-- Guia Personalização -->
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
                    <div class="form-text" data-i18n="settings.customization.liteModeDescription">Desativa animações para melhor performance</div>
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
                    <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                    <option value="en">🇺🇸 English (United States)</option>
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
                    <label data-i18n="settings.performance.autoSync">Sincronização Automática</label>
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
                <h3><i class="fas fa-cloud"></i> <span data-i18n="settings.api.title">Configurações de API</span></h3>
                
                <!-- Seleção da fonte de API -->
                <div class="form-group">
                  <label data-i18n="settings.api.source">Fonte da API</label>
                  <select class="form-control select" id="apiSourceSelect">
                    <option value="steam" data-i18n="settings.api.source.steam">Steam Web API</option>
                    <option value="hydra" data-i18n="settings.api.source.hydra">Hydra API (Em breve)</option>
                  </select>
                  <div class="form-text" data-i18n="settings.api.source.description">
                    Escolha a fonte de dados para obter informações dos jogos e conquistas
                  </div>
                </div>

                <!-- Configurações da Steam API -->
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



                  <!-- Botões de ação Steam -->
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

                  <!-- Informações sobre pastas padrão do Steam -->
                  <div class="steam-paths-info" id="steamPathsInfo" style="display: none;">
                    <h5><i class="fas fa-folder"></i> <span data-i18n="settings.api.steam.paths.title">Pastas de Localização Padrão</span></h5>
                    <div class="paths-list" id="steamPathsList">
                      <!-- Será preenchido dinamicamente -->
                    </div>
                    
                    <!-- Seletor de diretório personalizado -->
                    <div class="form-group mt-3">
                      <label data-i18n="settings.api.steam.customPath">Diretório Personalizado do Steam</label>
                      <div class="input-group">
                        <input type="text" class="form-control" id="steamCustomPathInput" 
                               placeholder="Selecione o diretório do Steam..." 
                               data-i18n-placeholder="settings.api.steam.customPath.placeholder" readonly>
                        <button type="button" class="btn btn-outline-primary" id="selectSteamDirBtn" onclick="window.app?.navigation?.selectSteamDirectory()">
                          <i class="fas fa-folder-open"></i>
                          <span data-i18n="settings.api.steam.selectDirectory">Selecionar</span>
                        </button>
                      </div>
                      <div class="form-text">
                        <span data-i18n="settings.api.steam.customPath.description">
                          Se o Steam estiver instalado em um local diferente, selecione o diretório manualmente
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Status da conexão -->
                  <div class="steam-status-card" id="steamStatusCard">
                    <div class="status-header">
                      <div class="status-icon" id="steamStatusIcon">
                        <i class="fas fa-question-circle"></i>
                      </div>
                      <div class="status-info">
                        <h4 id="steamStatusTitle" data-i18n="settings.api.steam.status.notTested">Não testado</h4>
                        <p id="steamStatusDescription" data-i18n="settings.api.steam.status.notTested.description">
                          Configure suas credenciais e teste a conexão
                        </p>
                      </div>
                    </div>
                    <div class="status-actions">
                      <button class="btn btn-primary" id="testSteamConnectionBtn" onclick="window.app?.navigation?.testSteamConnection()">
                        <i class="fas fa-plug"></i>
                        <span data-i18n="settings.api.steam.testConnection">Testar Conexão</span>
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

            <!-- Guia Conversão Goldberg -->
            <div class="tab-pane" id="goldberg">
              <div class="settings-section">
                <h3><i class="fas fa-exchange-alt"></i> <span data-i18n="settings.goldberg.title">Conversão Goldberg Emu</span></h3>
                <p class="section-description" data-i18n="settings.goldberg.description">
                  Converta conquistas da versão antiga do Goldberg SteamEmu Saves para o formato GSE Saves moderno
                </p>
                
                <!-- Status da conversão -->
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
                    <!-- Detalhes serão preenchidos dinamicamente -->
                  </div>
                </div>

                <!-- Configurações de migração -->
                <div class="goldberg-settings">
                  <div class="toggle-group">
                    <div>
                      <label data-i18n="settings.goldberg.autoMigration">Migração Automática</label>
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
                      <label data-i18n="settings.goldberg.showDialog">Mostrar Diálogo</label>
                      <div class="form-text" data-i18n="settings.goldberg.showDialog.description">
                        Exibir confirmação antes de converter
                      </div>
                    </div>
                    <label class="toggle-switch">
                      <input type="checkbox" id="goldbergShowDialogToggle" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- Ações de migração -->
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

                <!-- Informações adicionais -->
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
            <i class="fas fa-save"></i> <span data-i18n="common.save">Salvar Configurações</span>
          </button>
          <button class="btn btn-secondary" id="cancelSettingsBtn" onclick="app.modules.navigation.cancelSettingsChanges()" disabled>
            <i class="fas fa-times"></i> <span data-i18n="common.cancel">Cancelar</span>
          </button>
          <button class="btn btn-outline" onclick="app.modules.navigation.resetSettings()">
            <i class="fas fa-undo"></i> <span data-i18n="common.reset">Restaurar Padrões</span>
          </button>
        </div>
        
        <div class="settings-status" id="settingsStatus" style="display: none;">
          <i class="fas fa-exclamation-circle"></i>
          <span data-i18n="settings.status.unsaved">Você tem alterações não salvas</span>
        </div>
      </div>
    `;

    // Carregar valores atuais das configurações
    this.loadCurrentSettings();

    // Configurar event listeners para detectar mudanças
    this.setupSettingsChangeDetection();

    // Aplicar traduções aos elementos da página de configurações
    if (this.app.modules.helpers && this.app.modules.helpers.translatePage) {
      await this.app.modules.helpers.translatePage();
    }

    // Configurar navegação das guias com delay para garantir que o DOM esteja pronto
    setTimeout(() => {
      this.setupTabNavigation();
      this.setupGoldbergSettings();
      // Inicializar configurações da Steam (preencher API Key automaticamente quando disponível)
      this.setupSteamSettings();
    }, 100);
  }

  loadCurrentSettings() {
    try {
      // Verificar se o settings manager existe
      if (!this.app.modules.settings) {
        return;
      }

      // Carregar configurações do settings manager
      const settings = this.app.modules.settings.getAll();

      // Armazenar configurações originais para comparação
      this.originalSettings = { ...settings };
      this.pendingSettings = { ...settings };

      // Aplicar valores aos elementos - Guia Personalização
      const themeSelect = document.getElementById('themeSelect');
      const languageSelect = document.getElementById('languageSelect');
      const liteModeToggle = document.getElementById('liteModeToggle');
      const compactModeToggle = document.getElementById('compactModeToggle');

      // Aplicar valores aos elementos - Guia Performance
      const virtualScrollToggle = document.getElementById('virtualScrollToggle');
      const showTooltipsToggle = document.getElementById('showTooltipsToggle');
      const autoSyncToggle = document.getElementById('autoSyncToggle');
      const cacheSizeSelect = document.getElementById('cacheSizeSelect');

      // Aplicar valores aos elementos - Guia API
      const apiSourceSelect = document.getElementById('apiSourceSelect');
      const steamApiKeyInput = document.getElementById('steamApiKeyInput');
      // Personalização
      if (themeSelect) themeSelect.value = settings.theme || 'dark';
      if (languageSelect) languageSelect.value = settings.language || 'en';
      if (liteModeToggle) liteModeToggle.checked = settings.liteMode || false;
      if (compactModeToggle) compactModeToggle.checked = settings.compactMode || false;

      // Performance
      if (virtualScrollToggle) virtualScrollToggle.checked = settings.virtualScrolling !== false;
      if (showTooltipsToggle) showTooltipsToggle.checked = settings.showTooltips !== false;
      if (autoSyncToggle) autoSyncToggle.checked = settings.autoSync !== false;
      if (cacheSizeSelect) cacheSizeSelect.value = settings.cacheSize || '100';

      // API
      if (apiSourceSelect) apiSourceSelect.value = settings.apiSource || 'steam';

      // Configurar visibilidade dos campos de API
      this.handleApiSourceChange(settings.apiSource || 'steam');
    } catch (error) {
      // Silently handle error
    }
  }

  setupSettingsChangeDetection() {
    try {
      // Event listeners para detectar mudanças (sem aplicar)
      const elements = [
        // Personalização
        'themeSelect',
        'languageSelect',
        'liteModeToggle',
        'compactModeToggle',
        // Performance
        'virtualScrollToggle',
        'showTooltipsToggle',
        'autoSyncToggle',
        'cacheSizeSelect',
        // API
        'apiSourceSelect',
        'steamApiKeyInput',
      ];

      elements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
          const eventTypes =
            element.type === 'checkbox' ? ['change'] : ['change', 'input', 'keyup'];

          eventTypes.forEach(eventType => {
            element.addEventListener(eventType, () => {
              // Manipular mudança da fonte de API
              if (elementId === 'apiSourceSelect') {
                this.handleApiSourceChange(element.value);
              }

              this.updatePendingSettings();
              this.checkForChanges();
            });
          });
        }
      });

      // Event listener especial para o botão de toggle da Steam API Key
      const togglePasswordBtn = document.getElementById('toggleApiKeyBtn');
      if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
          this.toggleSteamApiKeyVisibility();
        });
      }
    } catch (error) {
      // Silently handle error
    }
  }

  updatePendingSettings() {
    try {
      // Atualizar configurações pendentes com valores atuais dos elementos

      // Personalização
      const themeSelect = document.getElementById('themeSelect');
      const languageSelect = document.getElementById('languageSelect');
      const liteModeToggle = document.getElementById('liteModeToggle');
      const compactModeToggle = document.getElementById('compactModeToggle');

      // Performance
      const virtualScrollToggle = document.getElementById('virtualScrollToggle');
      const showTooltipsToggle = document.getElementById('showTooltipsToggle');
      const autoSyncToggle = document.getElementById('autoSyncToggle');
      const cacheSizeSelect = document.getElementById('cacheSizeSelect');

      // API
      const apiSourceSelect = document.getElementById('apiSourceSelect');
      const steamApiKeyInput = document.getElementById('steamApiKeyInput');

      // Atualizar valores - Personalização
      if (themeSelect) this.pendingSettings.theme = themeSelect.value;
      if (languageSelect) {
        this.pendingSettings.language = languageSelect.value;
      }
      if (liteModeToggle) this.pendingSettings.liteMode = liteModeToggle.checked;
      if (compactModeToggle) this.pendingSettings.compactMode = compactModeToggle.checked;

      // Atualizar valores - Performance
      if (virtualScrollToggle) this.pendingSettings.virtualScrolling = virtualScrollToggle.checked;
      if (showTooltipsToggle) this.pendingSettings.showTooltips = showTooltipsToggle.checked;
      if (autoSyncToggle) this.pendingSettings.autoSync = autoSyncToggle.checked;
      if (cacheSizeSelect) this.pendingSettings.cacheSize = cacheSizeSelect.value;

      // Atualizar valores - API
      if (apiSourceSelect) this.pendingSettings.apiSource = apiSourceSelect.value;
    } catch (error) {
      // Silently handle error
    }
  }

  handleApiSourceChange(apiSource) {
    try {
      const steamApiSection = document.getElementById('steamApiSection');
      const steamPathsInfo = document.getElementById('steamPathsInfo');
      const hydraApiMessage = document.getElementById('hydraApiMessage');

      if (apiSource === 'steam') {
        if (steamApiSection) steamApiSection.style.display = 'block';
        if (steamPathsInfo) {
          steamPathsInfo.style.display = 'block';
          this.loadSteamPaths();
        }
        if (hydraApiMessage) hydraApiMessage.style.display = 'none';
      } else if (apiSource === 'hydra') {
        if (steamApiSection) steamApiSection.style.display = 'none';
        if (steamPathsInfo) steamPathsInfo.style.display = 'none';
        if (hydraApiMessage) hydraApiMessage.style.display = 'block';
      }
    } catch (error) {
      // Silently handle error
    }
  }

  async loadSteamPaths() {
    try {
      // Carregar pastas padrão do Steam
      const defaultPaths = await window.electronAPI.invoke('steam.getSteamDefaultPaths');
      const defaultPathsList = document.getElementById('steamDefaultPathsList');

      if (defaultPathsList && defaultPaths) {
        defaultPathsList.innerHTML = defaultPaths
          .map(path => `<li class="steam-path-item">📁 ${path}</li>`)
          .join('');
      }

      // Detectar diretório atual do Steam
      const currentDirectory = await window.electronAPI.invoke('steam.detectCurrentSteamDirectory');
      const steamPathInput = document.getElementById('steamPathInput');

      if (steamPathInput && currentDirectory) {
        steamPathInput.value = currentDirectory;
      }
    } catch (error) {
      
    }
  }

  async selectSteamDirectory() {
    try {
      const result = await window.electronAPI.invoke('fs:showOpenDialog', {
        properties: ['openDirectory'],
        title: 'Selecionar Diretório do Steam',
      });

      if (result && !result.canceled && result.filePaths.length > 0) {
        const steamPathInput = document.getElementById('steamPathInput');
        if (steamPathInput) {
          steamPathInput.value = result.filePaths[0];
          // Aqui você pode adicionar lógica para salvar o caminho personalizado
        }
      }
    } catch (error) {
      
    }
  }

  async testSteamConnection() {
    try {
      const testBtn = document.getElementById('testSteamConnectionBtn');
      const statusCard = document.getElementById('steamStatusCard');
      const statusIcon = document.getElementById('steamStatusIcon');
      const statusTitle = document.getElementById('steamStatusTitle');
      const statusDescription = document.getElementById('steamStatusDescription');
      const apiKeyInput = document.getElementById('steamApiKeyInput');

      if (!testBtn || !statusCard || !apiKeyInput) return;

      // Desabilitar botão e mostrar loading
      testBtn.disabled = true;
      const originalBtnContent = testBtn.innerHTML;
      testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Testando...</span>';

      // Atualizar status visual
      statusCard.className = 'steam-status-card status-testing';
      statusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      statusTitle.textContent = 'Testando...';
      statusDescription.textContent = 'Verificando conexão e descobrindo Steam ID...';

      const apiKey = apiKeyInput.value.trim();

      if (!apiKey) {
        statusCard.className = 'steam-status-card status-error';
        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        statusTitle.textContent = 'Erro';
        statusDescription.textContent = 'Por favor, preencha a API Key';
        return;
      }

      // Testar conexão via IPC (Steam ID será descoberto automaticamente)
      const result = await window.electronAPI.steam.setCredentials(apiKey);

      if (result.success) {
        statusCard.className = 'steam-status-card status-connected';
        statusIcon.innerHTML = '<i class="fab fa-steam"></i>';

        if (result.autoDiscovered) {
          // Steam ID descoberto automaticamente
          statusTitle.textContent = 'Conectado';
          statusDescription.textContent = `Steam ID descoberto automaticamente - ${result.data?.personaname || 'Usuário Steam'}`;
        } else {
          // Conexão bem-sucedida sem descoberta automática
          statusTitle.textContent = 'API Key Válida';
          statusDescription.textContent = `Usuário: ${result.data?.personaname || 'N/A'}`;
        }
      } else {
        statusCard.className = 'steam-status-card status-error';
        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';

        const isTimeout =
          typeof result.error === 'string' &&
          (result.error.toLowerCase().includes('timeout') || result.error.includes('ECONNABORTED'));

        if (isTimeout) {
          // i18n: timeout amigável
          statusTitle.setAttribute('data-i18n', 'settings.api.steam.status.timeout');
          statusTitle.textContent = await this.app.t(
            'settings.api.steam.status.timeout',
            'Tempo de conexão esgotado'
          );
          statusDescription.setAttribute(
            'data-i18n',
            'settings.api.steam.status.timeout.description'
          );
          statusDescription.textContent = await this.app.t(
            'settings.api.steam.status.timeout.description',
            'A Steam API não respondeu dentro do tempo esperado. Verifique sua rede e tente novamente.'
          );

          // Notificação de aviso
          this.app.modules.helpers.showNotification(
            await this.app.t(
              'settings.api.steam.status.timeout',
              'Tempo de conexão esgotado'
            ),
            'warning',
            5000
          );
        } else {
          // i18n: erro genérico de conexão
          statusTitle.setAttribute('data-i18n', 'settings.api.steam.status.error');
          statusTitle.textContent = await this.app.t(
            'settings.api.steam.status.error',
            'Erro na verificação'
          );
          statusDescription.setAttribute(
            'data-i18n',
            'settings.api.steam.status.error.description'
          );
          const looksLikeKey = (s) => typeof s === 'string' && s.includes('.') && !s.includes(' ');

          let errorMessage = result.error ||
            (await this.app.t(
              'settings.api.steam.status.error.description',
              'Ocorreu um erro ao verificar a conexão Steam'
            ));
          if (result.suggestion) {
            errorMessage += ` - ${result.suggestion}`;
          }

          // Se a mensagem parecer uma chave i18n literal, não mostrar descrição
          if (looksLikeKey(errorMessage)) {
            statusDescription.style.display = 'none';
            statusDescription.textContent = '';
          } else {
            statusDescription.style.display = 'block';
            statusDescription.textContent = errorMessage;
          }
        }
      }
    } catch (error) {

      const statusCard = document.getElementById('steamStatusCard');
      const statusIcon = document.getElementById('steamStatusIcon');
      const statusTitle = document.getElementById('steamStatusTitle');
      const statusDescription = document.getElementById('steamStatusDescription');

      if (statusCard) {
        statusCard.className = 'steam-status-card status-error';
        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';

        const isTimeout =
          (error?.code === 'ECONNABORTED') ||
          (typeof error?.message === 'string' && error.message.toLowerCase().includes('timeout'));

        if (isTimeout) {
          statusTitle.setAttribute('data-i18n', 'settings.api.steam.status.timeout');
          statusTitle.textContent = await this.app.t(
            'settings.api.steam.status.timeout',
            'Tempo de conexão esgotado'
          );
          statusDescription.setAttribute(
            'data-i18n',
            'settings.api.steam.status.timeout.description'
          );
          statusDescription.textContent = await this.app.t(
            'settings.api.steam.status.timeout.description',
            'A Steam API não respondeu dentro do tempo esperado. Verifique sua rede e tente novamente.'
          );

          this.app.modules.helpers.showNotification(
            await this.app.t(
              'settings.api.steam.status.timeout',
              'Tempo de conexão esgotado'
            ),
            'warning',
            5000
          );
        } else {
          statusTitle.setAttribute('data-i18n', 'settings.api.steam.status.error');
          statusTitle.textContent = await this.app.t(
            'settings.api.steam.status.error',
            'Erro na verificação'
          );
          statusDescription.setAttribute(
            'data-i18n',
            'settings.api.steam.status.error.description'
          );
          statusDescription.textContent = await this.app.t(
            'settings.api.steam.status.error.description',
            'Ocorreu um erro ao verificar a conexão Steam'
          );
        }
      }
    } finally {
      const testBtn = document.getElementById('testSteamConnectionBtn');
      if (testBtn) {
        testBtn.disabled = false;
        testBtn.innerHTML =
          '<i class="fas fa-plug"></i> <span data-i18n="settings.api.steam.testConnection">Testar Conexão</span>';
      }
    }
  }

  checkForChanges() {
    try {
      // Verificar se há mudanças não salvas
      const hasChanges =
        JSON.stringify(this.originalSettings) !== JSON.stringify(this.pendingSettings);

      // Atualizar interface
      const saveBtn = document.getElementById('saveSettingsBtn');
      const cancelBtn = document.getElementById('cancelSettingsBtn');
      const statusDiv = document.getElementById('settingsStatus');

      if (saveBtn) saveBtn.disabled = !hasChanges;
      if (cancelBtn) cancelBtn.disabled = !hasChanges;
      if (statusDiv) statusDiv.style.display = hasChanges ? 'flex' : 'none';
    } catch (error) {
      
    }
  }

  async saveCurrentSettings() {
    try {
      // Atualizar configurações pendentes antes de verificar mudanças
      this.updatePendingSettings();

      // Verificar se houve mudança de idioma
      const languageChanged =
        this.pendingSettings.language &&
        this.pendingSettings.language !== this.originalSettings.language;

      // Verificar se API Key da Steam mudou e salvar credenciais
      const steamApiKeyInput = document.getElementById('steamApiKeyInput');
      if (steamApiKeyInput) {
        const newApiKey = steamApiKeyInput.value.trim();
        const originalApiKey = this.originalSettings.steamApiKey || '';
        if (newApiKey && newApiKey !== originalApiKey && this.app.isElectronAPIAvailable('steam')) {
          // Chamar backend para salvar no cache (Steam ID será descoberto automaticamente)
          await this.app.safeElectronAPICall('steam.setCredentials', newApiKey);
          // Também manter no pendingSettings para que seja persistido em caso de uso futuro
          this.pendingSettings.steamApiKey = newApiKey;
        }
      }

      // Salvar todas as configurações pendentes
      for (const [key, value] of Object.entries(this.pendingSettings)) {
        await this.app.modules.settings.set(key, value);
      }

      // Atualizar configurações originais
      this.originalSettings = { ...this.pendingSettings };

      // Atualizar interface
      this.checkForChanges();

      // Se houve mudança de idioma, mostrar diálogo de reinicialização
      if (languageChanged) {
        await this.showRestartDialog();
      } else {
        // Mostrar notificação de sucesso normal
        this.app.modules.helpers.showNotification(
          this.app.t('settings.notifications.saved', 'Configurações salvas com sucesso!'),
          'success'
        );
      }
    } catch (error) {
      
      this.app.modules.helpers.showNotification(
        await this.app.t('settings.notifications.saveError', 'Erro ao salvar configurações'),
        'error'
      );
    }
  }

  async handleSteamApiKeyChange() {
    try {
      // Verificar se estamos na página steam-games
      const currentPage = document.querySelector('.page.active')?.id;

      if (currentPage === 'steam-games') {

        // Mostrar feedback visual
        this.app.modules.helpers.showNotification(
          await this.app.t('steam.notifications.loadingLibrary', 'Carregando biblioteca Steam...'),
          'info'
        );

        // Aguardar um momento para a configuração ser processada
        setTimeout(async () => {
          try {
            await this.loadSteamGames();

          } catch (error) {
            
            this.app.modules.helpers.showNotification(
              await this.app.t(
                'steam.notifications.loadError',
                'Erro ao carregar biblioteca Steam'
              ),
              'error'
            );
          }
        }, 1500);
      } else {

      }
    } catch (error) {
      
    }
  }

  cancelSettingsChanges() {
    try {
      // Restaurar valores originais
      this.pendingSettings = { ...this.originalSettings };

      // Atualizar elementos da interface
      const themeSelect = document.getElementById('themeSelect');
      const languageSelect = document.getElementById('languageSelect');
      const liteModeToggle = document.getElementById('liteModeToggle');
      const virtualScrollToggle = document.getElementById('virtualScrollToggle');
      const achievementNotificationsToggle = document.getElementById(
        'achievementNotificationsToggle'
      );
      const notificationSoundsToggle = document.getElementById('notificationSoundsToggle');

      if (themeSelect) themeSelect.value = this.originalSettings.theme || 'dark';
      if (languageSelect) languageSelect.value = this.originalSettings.language || 'en';
      if (liteModeToggle) liteModeToggle.checked = this.originalSettings.liteMode || false;
      if (virtualScrollToggle)
        virtualScrollToggle.checked = this.originalSettings.virtualScrolling !== false;
      if (achievementNotificationsToggle)
        achievementNotificationsToggle.checked =
          this.originalSettings.achievementNotifications !== false;
      if (notificationSoundsToggle)
        notificationSoundsToggle.checked = this.originalSettings.notificationSounds !== false;

      // Atualizar interface
      this.checkForChanges();

      // Mostrar notificação
      this.app.modules.helpers.showNotification('Alterações canceladas', 'info');
    } catch (error) {
      
    }
  }

  async resetSettings() {
    try {
      // Obter traduções
      const titleText = await this.app.t('settings.reset.dialog.title', 'Restaurar Configurações');
      const subtitleText = await this.app.t(
        'settings.reset.dialog.subtitle',
        'Esta ação irá redefinir todas as suas preferências'
      );
      const messageText = await this.app.t(
        'settings.reset.dialog.message',
        'Tem certeza que deseja restaurar todas as configurações para os valores padrão? Todas as suas personalizações serão perdidas.'
      );
      const cancelText = await this.app.t('settings.reset.dialog.cancel', 'Cancelar');
      const confirmText = await this.app.t('settings.reset.dialog.confirm', 'Restaurar');

      // Criar conteúdo do modal de confirmação
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

      // Criar ações do modal
      const modalActions = `
        <button type="button" class="btn btn-secondary" onclick="app.closeModal('resetSettingsDialog')">
          <i class="fas fa-times"></i> ${cancelText}
        </button>
        <button type="button" class="btn btn-danger" onclick="app.modules.navigation.confirmResetSettings()">
          <i class="fas fa-undo"></i> ${confirmText}
        </button>
      `;

      // Criar HTML do modal
      const modalHtml = this.app.createModal(
        'resetSettingsDialog',
        titleText,
        modalContent,
        modalActions
      );

      // Adicionar modal ao DOM se não existir
      if (!document.getElementById('resetSettingsDialog')) {
        document.body.insertAdjacentHTML('beforeend', modalHtml);
      }

      // Abrir modal
      this.app.openModal('resetSettingsDialog');
    } catch (error) {
      
      this.app.modules.helpers.showNotification(
        await this.app.t('settings.reset.dialog.error', 'Erro ao abrir diálogo de confirmação'),
        'error'
      );
    }
  }

  async confirmResetSettings() {
    try {
      // Fechar modal
      this.app.closeModal('resetSettingsDialog');

      // Resetar configurações
      await this.app.modules.settings.reset();

      // Recarregar página de configurações
      this.loadConfiguracoes();

      // Mostrar notificação
      this.app.modules.helpers.showNotification(
        await this.app.t(
          'settings.notifications.restored',
          'Configurações restauradas para os padrões'
        ),
        'success'
      );
    } catch (error) {
      
      this.app.modules.helpers.showNotification(
        await this.app.t('settings.notifications.restoreError', 'Erro ao resetar configurações'),
        'error'
      );
    }
  }

  openGameDetails(gameId) {
    // Implementar abertura dos detalhes do jogo
  }

  refreshCurrentPage() {
    this.navigateTo(this.currentPage);
  }

  // Configurar navegação das guias
  setupTabNavigation() {
    // Aguardar para garantir que o DOM esteja pronto
    setTimeout(() => {
      try {
        const tabButtons = document.querySelectorAll('.tab-btn');

        if (tabButtons.length === 0) {
          setTimeout(() => this.setupTabNavigation(), 200);
          return;
        }

        // Configurar event listeners
        tabButtons.forEach(button => {
          const dataTab = button.getAttribute('data-tab');

          // Remover listeners antigos
          button.replaceWith(button.cloneNode(true));
        });

        // Reselecionar após clonagem
        const newButtons = document.querySelectorAll('.tab-btn');
        newButtons.forEach(button => {
          const dataTab = button.getAttribute('data-tab');

          button.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            this.switchTab(dataTab);
          });
        });

        // Ativar primeira guia por padrão
        setTimeout(() => {
          this.switchTab('personalization');
        }, 50);
      } catch (error) {
        
      }
    }, 150);
  }

  // Alternar entre guias
  switchTab(tabId) {
    try {
      // Encontrar todos os elementos
      const allButtons = document.querySelectorAll('.tab-btn');
      const allPanes = document.querySelectorAll('.tab-pane');
      const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
      const activePane = document.getElementById(tabId);

      if (!activeButton || !activePane) {

        return;
      }

      // Remover classe active de todos
      allButtons.forEach(btn => btn.classList.remove('active'));
      allPanes.forEach(pane => {
        pane.classList.remove('active');
        pane.style.display = 'none';
      });

      // Adicionar classe active aos elementos corretos
      activeButton.classList.add('active');
      activePane.classList.add('active');
      activePane.style.display = 'block';

      // Forçar reflow para garantir que as mudanças sejam aplicadas
      activePane.offsetHeight;

      // Quando a guia API é ativada, inicializar as configurações da Steam
      if (tabId === 'api') {
        // Garante que o preenchimento automático da API Key e status sejam atualizados
        this.setupSteamSettings();
      }
    } catch (error) {
      
    }
  }

  // Manipular mudança da fonte de API
  handleApiSourceChange(source) {
    try {
      const steamApiSection = document.getElementById('steamApiSection');
      const hydraApiMessage = document.getElementById('hydraApiMessage');

      if (source === 'steam') {
        if (steamApiSection) steamApiSection.style.display = 'block';
        if (hydraApiMessage) hydraApiMessage.style.display = 'none';
      } else if (source === 'hydra') {
        if (steamApiSection) steamApiSection.style.display = 'none';
        if (hydraApiMessage) hydraApiMessage.style.display = 'block';
      }
    } catch (error) {
      
    }
  }

  // Alternar visibilidade da Steam API Key
  toggleSteamApiKeyVisibility() {
    try {
      const input = document.getElementById('steamApiKeyInput');
      const icon = document.querySelector('#toggleApiKeyBtn i');

      if (input && icon) {
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'fas fa-eye-slash';
        } else {
          input.type = 'password';
          icon.className = 'fas fa-eye';
        }
      }
    } catch (error) {
      
    }
  }

  // Configurar funcionalidades da Steam API
  async setupSteamSettings() {
    try {
      // Verificar se estamos na guia correta
      if (!document.getElementById('steamStatusCard')) {
        return; // Não está na página de configurações Steam
      }

      // Carregar configurações iniciais
      await this.loadSteamSettings();

      // Ocultar cartão de status e botões extras, deixando apenas o botão Connect
      this.hideSteamStatus = true;
      const statusCard = document.getElementById('steamStatusCard');
      const statusDetails = document.getElementById('steamStatusDetails');
      const syncSettings = document.getElementById('steamSyncSettings');
      const testBtn = document.getElementById('steamTestBtn');
      const disconnectBtn = document.getElementById('steamDisconnectBtn');
      const connectBtn = document.getElementById('steamConnectBtn');

      if (statusCard) statusCard.style.display = 'none';
      if (statusDetails) statusDetails.style.display = 'none';
      if (syncSettings) syncSettings.style.display = 'none';
      if (testBtn) testBtn.style.display = 'none';
      if (disconnectBtn) disconnectBtn.style.display = 'none';
      if (connectBtn) connectBtn.style.display = 'inline-block';

      // Configurar event listeners
      this.setupSteamEventListeners();
    } catch (error) {
      
    }
  }

  async loadSteamSettings() {
    try {
      if (this.app.isElectronAPIAvailable('steam')) {
        const credentials = await this.app.safeElectronAPICall('steam.getCredentials');

        if (credentials && credentials.success) {
          const apiKeyInput = document.getElementById('steamApiKeyInput');
          const steamIdInput = document.getElementById('steamIdInput');

          if (apiKeyInput && credentials.apiKey) {
            apiKeyInput.value = credentials.apiKey;
          }
          if (steamIdInput && credentials.steamId) {
            steamIdInput.value = credentials.steamId;
          }
        }
      }
    } catch (error) {
      
    }
  }

  async checkSteamConnection() {
    try {
      // Se a UI deve ocultar o status, garantir que elementos estejam escondidos e sair
      if (this.hideSteamStatus) {
        const statusCard = document.getElementById('steamStatusCard');
        const statusDetails = document.getElementById('steamStatusDetails');
        const syncSettings = document.getElementById('steamSyncSettings');
        const testBtn = document.getElementById('steamTestBtn');
        const disconnectBtn = document.getElementById('steamDisconnectBtn');

        if (statusCard) statusCard.style.display = 'none';
        if (statusDetails) statusDetails.style.display = 'none';
        if (syncSettings) syncSettings.style.display = 'none';
        if (testBtn) testBtn.style.display = 'none';
        if (disconnectBtn) disconnectBtn.style.display = 'none';
        return;
      }
      const statusCard = document.getElementById('steamStatusCard');
      const statusIcon = document.getElementById('steamStatusIcon');
      const statusTitle = document.getElementById('steamStatusTitle');
      const statusDescription = document.getElementById('steamStatusDescription');
      const statusDetails = document.getElementById('steamStatusDetails');
      const syncSettings = document.getElementById('steamSyncSettings');
      const testBtn = document.getElementById('steamTestBtn');
      const disconnectBtn = document.getElementById('steamDisconnectBtn');

      if (!statusCard) return;

      // Mostrar status de verificação
      statusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      statusTitle.textContent = 'Verificando...';
      statusDescription.textContent = 'Testando conexão com Steam';

      if (this.app.isElectronAPIAvailable('steam')) {
        const connection = await this.app.safeElectronAPICall('steam.checkConnection');

        if (connection.success && connection.connected) {
          // Conectado com sucesso
          statusCard.className = 'steam-status-card status-connected';
          statusIcon.innerHTML = '<i class="fab fa-steam"></i>';
          statusTitle.textContent = 'Conectado';
          statusDescription.textContent = `Conectado como ${connection.userInfo?.username || 'Usuário Steam'}`;

          // Mostrar detalhes
          if (connection.userInfo) {
            statusDetails.style.display = 'block';
            statusDetails.innerHTML = `
              <div class="detail-item">
                <span class="detail-label">Usuário:</span>
                <span class="detail-value">${connection.userInfo.username}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Perfil:</span>
                <span class="detail-value">
                  <a href="${connection.userInfo.profileUrl || '#'}" target="_blank" class="external-link">
                    Ver Perfil Steam
                  </a>
                </span>
              </div>
            `;
          }

          // Mostrar configurações de sincronização
          if (syncSettings) syncSettings.style.display = 'block';
          if (testBtn) testBtn.style.display = 'inline-block';
          if (disconnectBtn) disconnectBtn.style.display = 'inline-block';
        } else {
          // Não conectado ou erro
          const isTimeout =
            typeof connection.error === 'string' &&
            (connection.error.toLowerCase().includes('timeout') || connection.error.includes('ECONNABORTED'));

          if (isTimeout) {
            statusCard.className = 'steam-status-card status-error';
            statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';

            statusTitle.setAttribute('data-i18n', 'settings.api.steam.status.timeout');
            statusTitle.textContent = await this.app.t(
              'settings.api.steam.status.timeout',
              'Tempo de conexão esgotado'
            );
            statusDescription.setAttribute(
              'data-i18n',
              'settings.api.steam.status.timeout.description'
            );
            statusDescription.textContent = await this.app.t(
              'settings.api.steam.status.timeout.description',
              'A Steam API não respondeu dentro do tempo esperado. Verifique sua rede e tente novamente.'
            );
            statusDetails.style.display = 'none';

            // Permitir tentar novamente
            if (syncSettings) syncSettings.style.display = 'none';
            if (testBtn) testBtn.style.display = 'inline-block';
            if (disconnectBtn) disconnectBtn.style.display = 'none';

            // Notificação de aviso
            this.app.modules.helpers.showNotification(
              await this.app.t(
                'settings.api.steam.status.timeout',
                'Tempo de conexão esgotado'
              ),
              'warning',
              5000
            );
          } else {
            statusCard.className = 'steam-status-card status-disconnected';
            statusIcon.innerHTML = '<i class="fab fa-steam"></i>';
            // i18n: título e descrição de desconexão
            statusTitle.setAttribute('data-i18n', 'settings.api.steam.status.disconnected');
            statusTitle.textContent = await this.app.t(
              'settings.api.steam.status.disconnected',
              'Desconectado'
            );
            statusDescription.setAttribute(
              'data-i18n',
              'settings.api.steam.status.disconnected.description'
            );
            const looksLikeKey = (s) => typeof s === 'string' && s.includes('.') && !s.includes(' ');
            let descText = connection.error ||
              (await this.app.t(
                'settings.api.steam.status.disconnected.description',
                'Configure suas credenciais para conectar'
              ));

            // Se for uma chave i18n literal, tentar traduzir; se continuar literal, ocultar
            if (looksLikeKey(descText)) {
              const translated = await this.app.t(descText, '');
              if (!translated || translated === descText) {
                statusDescription.style.display = 'none';
                statusDescription.textContent = '';
              } else {
                statusDescription.style.display = 'block';
                statusDescription.textContent = translated;
              }
            } else {
              statusDescription.style.display = 'block';
              statusDescription.textContent = descText;
            }
            statusDetails.style.display = 'none';

            // Ocultar configurações avançadas
            if (syncSettings) syncSettings.style.display = 'none';
            if (testBtn) testBtn.style.display = 'none';
            if (disconnectBtn) disconnectBtn.style.display = 'none';
          }
        }
      } else {
        // API não disponível
        statusCard.className = 'steam-status-card status-error';
        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        // i18n: indisponível
        statusTitle.setAttribute('data-i18n', 'settings.api.steam.status.unavailable');
        statusTitle.textContent = await this.app.t(
          'settings.api.steam.status.unavailable',
          'Sistema não disponível'
        );
        statusDescription.setAttribute(
          'data-i18n',
          'settings.api.steam.status.unavailable.description'
        );
        statusDescription.textContent = await this.app.t(
          'settings.api.steam.status.unavailable.description',
          'Funcionalidade disponível apenas no aplicativo desktop'
        );
        statusDetails.style.display = 'none';
        if (syncSettings) syncSettings.style.display = 'none';
        if (testBtn) testBtn.style.display = 'none';
        if (disconnectBtn) disconnectBtn.style.display = 'none';
      }
    } catch (error) {

      const statusCard = document.getElementById('steamStatusCard');
      const statusIcon = document.getElementById('steamStatusIcon');
      const statusTitle = document.getElementById('steamStatusTitle');
      const statusDescription = document.getElementById('steamStatusDescription');

      if (statusCard) {
        statusCard.className = 'steam-status-card status-error';
        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        statusTitle.setAttribute('data-i18n', 'settings.api.steam.status.error');
        statusTitle.textContent = await this.app.t(
          'settings.api.steam.status.error',
          'Erro na verificação'
        );
        statusDescription.setAttribute(
          'data-i18n',
          'settings.api.steam.status.error.description'
        );
        statusDescription.textContent = await this.app.t(
          'settings.api.steam.status.error.description',
          'Ocorreu um erro ao verificar a conexão Steam'
        );
      }
    }
  }

  setupSteamEventListeners() {
    // Botão de conectar/salvar
    const connectBtn = document.getElementById('steamConnectBtn');
    if (connectBtn) {
      connectBtn.addEventListener('click', async () => {
        await this.connectToSteam();
      });
    }

    // Botão de testar conexão
    const testBtn = document.getElementById('steamTestBtn');
    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        await this.checkSteamConnection();
      });
    }

    // Botão de desconectar
    const disconnectBtn = document.getElementById('steamDisconnectBtn');
    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', async () => {
        await this.disconnectFromSteam();
      });
    }

    // Toggle para mostrar/ocultar API key
    const toggleApiKeyBtn = document.getElementById('toggleSteamApiKeyBtn');
    const apiKeyInput = document.getElementById('steamApiKeyInput');
    if (toggleApiKeyBtn && apiKeyInput) {
      toggleApiKeyBtn.addEventListener('click', () => {
        const isPassword = apiKeyInput.type === 'password';
        apiKeyInput.type = isPassword ? 'text' : 'password';
        toggleApiKeyBtn.innerHTML = isPassword
          ? '<i class="fas fa-eye-slash"></i>'
          : '<i class="fas fa-eye"></i>';
      });
    }

    // Botão de encontrar Steam ID
    const findSteamIdBtn = document.getElementById('findSteamIdBtn');
    if (findSteamIdBtn) {
      findSteamIdBtn.addEventListener('click', () => {
        window.open('https://steamid.io/', '_blank');
      });
    }

    // Botão de obter Steam ID automaticamente
    const getSteamIdBtn = document.getElementById('getSteamIdBtn');
    if (getSteamIdBtn) {
      getSteamIdBtn.addEventListener('click', async () => {
        await this.discoverSteamIdAutomatically();
      });
    }

    // Botão de selecionar diretório Steam
    const selectSteamDirBtn = document.getElementById('selectSteamDirBtn');
    if (selectSteamDirBtn) {
      selectSteamDirBtn.addEventListener('click', async () => {
        await this.selectSteamDirectory();
      });
    }
  }

  async connectToSteam() {
    try {
      const connectBtn = document.getElementById('steamConnectBtn');
      const apiKeyInput = document.getElementById('steamApiKeyInput');

      if (!apiKeyInput) {
        this.app.showError('Campo de API Key não encontrado');
        return;
      }

      const apiKey = apiKeyInput.value.trim();

      if (!apiKey) {
        this.app.showError('Por favor, preencha a API Key');
        return;
      }

      // Desabilitar botão e mostrar progresso
      if (connectBtn) {
        connectBtn.disabled = true;
        connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...';
      }

      if (this.app.isElectronAPIAvailable('steam')) {
        const result = await this.app.safeElectronAPICall('steam.setCredentials', apiKey);

        if (result.success) {
          this.app.showSuccess('Conexão Steam configurada com sucesso!');

          // Atualizar status
          await this.checkSteamConnection();

          // Carregar jogos automaticamente se habilitado
          setTimeout(() => {
            this.loadSteamGames();
          }, 1000);
        } else {
          this.app.showError(`Erro na conexão: ${result.error || 'Erro desconhecido'}`);
        }
      }
    } catch (error) {
      this.app.showError('Erro ao configurar conexão Steam');
    } finally {
      // Restaurar botão
      const connectBtn = document.getElementById('steamConnectBtn');
      if (connectBtn) {
        connectBtn.disabled = false;
        connectBtn.innerHTML =
          '<i class="fas fa-plug"></i> <span data-i18n="settings.steam.connect">Conectar</span>';
      }
    }
  }

  async discoverSteamIdAutomatically() {
    try {
      const apiKeyInput = document.getElementById('steamApiKeyInput');
      const steamIdInput = document.getElementById('steamIdInput');
      const getSteamIdBtn = document.getElementById('getSteamIdBtn');

      if (!apiKeyInput) {
        this.app.showError('Campo de API Key não encontrado');
        return;
      }

      const apiKey = apiKeyInput.value.trim();
      if (!apiKey) {
        this.app.showError('Por favor, preencha a API Key primeiro');
        return;
      }

      // Desabilitar botão e mostrar progresso
      if (getSteamIdBtn) {
        getSteamIdBtn.disabled = true;
        getSteamIdBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span data-i18n="settings.api.steam.authenticating">Descobrindo...</span>';
      }

      if (this.app.isElectronAPIAvailable('steam')) {
        const result = await this.app.safeElectronAPICall('steam.discoverSteamId', apiKey);

        if (result.success && result.steamId) {
          // Preencher o campo Steam ID
          if (steamIdInput) {
            steamIdInput.value = result.steamId;
          }
          
          this.app.showSuccess(`Steam ID descoberto com sucesso: ${result.steamId}`);
        } else {
          this.app.showError(`Não foi possível descobrir o Steam ID: ${result.error || 'Erro desconhecido'}`);
        }
      }
    } catch (error) {
      console.error('Erro ao descobrir Steam ID:', error);
      this.app.showError('Erro ao descobrir Steam ID automaticamente');
    } finally {
      // Restaurar botão
      const getSteamIdBtn = document.getElementById('getSteamIdBtn');
      if (getSteamIdBtn) {
        getSteamIdBtn.disabled = false;
        getSteamIdBtn.innerHTML = '<i class="fas fa-magic"></i> <span data-i18n="settings.api.steam.getSteamId">Obter Steam ID Automaticamente</span>';
      }
    }
  }

  async disconnectFromSteam() {
    try {
      // Limpar credenciais
      const apiKeyInput = document.getElementById('steamApiKeyInput');
      const steamIdInput = document.getElementById('steamIdInput');

      if (apiKeyInput) apiKeyInput.value = '';
      if (steamIdInput) steamIdInput.value = '';

      // Atualizar status
      await this.checkSteamConnection();

      this.app.showSuccess(
        await this.app.t(
          'settings.api.steam.status.disconnected.success',
          'Desconectado da Steam API'
        )
      );
    } catch (error) {
      
      this.app.showError(
        await this.app.t(
          'settings.api.steam.status.error.description',
          'Erro ao desconectar'
        )
      );
    }
  }

  async loadSteamGames() {
    try {
      if (this.app.isElectronAPIAvailable('steam')) {
        const gamesResult = await this.app.safeElectronAPICall('steam.getUserGames', {
          installedOnly: true,
        });

        if (gamesResult.success) {
          // Aqui podemos atualizar a dashboard com os jogos
          // Por enquanto, apenas notificar
          if (gamesResult.totalGames > 0) {
            this.app.showSuccess(
              `${gamesResult.totalGames} jogos instalados carregados da Steam! Vá para Dashboard para visualizá-los.`
            );
          } else {
            this.app.showInfo('Nenhum jogo Steam instalado encontrado');
          }
        } else {
          
        }
      }
    } catch (error) {
      
    }
  }

  async clearSteamCache() {
    try {
      if (this.app.isElectronAPIAvailable('steam')) {
        const result = await this.app.safeElectronAPICall('steam.clearCache');

        if (result.success) {
          // Mostrar notificação de sucesso
          this.app.showSuccess('Cache Steam limpo com sucesso! 🧹');

          // Recarregar jogos se estiver na página Steam
          if (window.app?.steamGames) {
            await window.app.steamGames.loadSteamGames();
          }
        } else {
          this.app.showError('Erro ao limpar cache Steam');
        }
      } else {
        this.app.showWarning('Funcionalidade de cache não disponível');
      }
    } catch (error) {
      
      this.app.showError('Erro ao limpar cache Steam');
    }
  }

  // Configurar funcionalidades do Goldberg
  async setupGoldbergSettings() {
    try {
      // Verificar se estamos na guia correta
      if (!document.getElementById('goldbergStatusCard')) {
        return; // Não está na página de configurações
      }

      // Carregar configurações iniciais
      await this.loadGoldbergSettings();

      // Verificar status inicial
      await this.checkGoldbergStatus();

      // Configurar event listeners
      this.setupGoldbergEventListeners();
    } catch (error) {
      
    }
  }

  async loadGoldbergSettings() {
    try {
      if (this.app.isElectronAPIAvailable('goldberg')) {
        const settings = await this.app.safeElectronAPICall('goldberg.getSettings');

        if (settings) {
          const autoMigrationToggle = document.getElementById('goldbergAutoMigrationToggle');
          const showDialogToggle = document.getElementById('goldbergShowDialogToggle');

          if (autoMigrationToggle) autoMigrationToggle.checked = settings.autoMigration || false;
          if (showDialogToggle) showDialogToggle.checked = settings.showDialog !== false;
        }
      }
    } catch (error) {
      
    }
  }

  async checkGoldbergStatus() {
    try {
      const statusCard = document.getElementById('goldbergStatusCard');
      const statusIcon = document.getElementById('goldbergStatusIcon');
      const statusTitle = document.getElementById('goldbergStatusTitle');
      const statusDescription = document.getElementById('goldbergStatusDescription');
      const statusDetails = document.getElementById('goldbergStatusDetails');
      const migrateBtn = document.getElementById('goldbergMigrateBtn');

      if (!statusCard) return;

      // Mostrar status de verificação
      statusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      statusTitle.textContent = 'Verificando...';
      statusDescription.textContent = 'Procurando por arquivos Goldberg';

      if (this.app.isElectronAPIAvailable('goldberg')) {
        const goldbergInfo = await this.app.safeElectronAPICall('goldberg.checkFolder');

        if (goldbergInfo.exists && goldbergInfo.gamesCount > 0) {
          // Jogos encontrados
          statusCard.className = 'goldberg-status-card status-found';
          statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
          statusTitle.textContent = `${goldbergInfo.gamesCount} jogo(s) encontrado(s)`;
          statusDescription.textContent = 'Jogos disponíveis para conversão';

          // Mostrar detalhes
          statusDetails.style.display = 'block';
          // Determinar status do usuário
          const userStatus = goldbergInfo.currentUser || 'Não detectado';
          const userClass = goldbergInfo.currentUser ? 'user-detected' : 'user-not-detected';

          // Determinar status da pasta
          const pathStatus = goldbergInfo.path || 'Não encontrada';
          const pathClass = goldbergInfo.path ? 'path-found' : 'path-not-found';

          statusDetails.innerHTML = `
            <div class="detail-item">
              <span class="detail-label">Usuário:</span>
              <span class="detail-value ${userClass}">${userStatus}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Pasta:</span>
              <span class="detail-value ${pathClass}">${pathStatus}</span>
            </div>
            ${
              !goldbergInfo.currentUser
                ? `
            <div class="detail-item warning-item">
              <span class="detail-label" data-i18n="goldberg.warning.userNotDetected.label">⚠️ Aviso:</span>
              <span class="detail-value" data-i18n="goldberg.warning.userNotDetected.description">Usuário não detectado automaticamente. Verifique as permissões do sistema.</span>
            </div>
            `
                : ''
            }
          `;

          // Mostrar botão de migração
          if (migrateBtn) migrateBtn.style.display = 'inline-block';
        } else if (goldbergInfo.exists) {
          // Pasta existe mas sem jogos
          statusCard.className = 'goldberg-status-card status-empty';
          statusIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
          statusTitle.setAttribute('data-i18n', 'goldberg.status.empty');
          statusTitle.textContent = await this.app.t('goldberg.status.empty', 'Pasta Goldberg vazia');
          statusDescription.setAttribute('data-i18n', 'goldberg.status.empty.description');
          statusDescription.textContent = await this.app.t(
            'goldberg.status.empty.description',
            'A pasta existe mas não contém jogos para converter'
          );
          statusDetails.style.display = 'none';
          if (migrateBtn) migrateBtn.style.display = 'none';
        } else {
          // Pasta não encontrada
          statusCard.className = 'goldberg-status-card status-not-found';
          statusIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
          statusTitle.setAttribute('data-i18n', 'goldberg.status.notFound');
          statusTitle.textContent = await this.app.t('goldberg.status.notFound', 'Goldberg não encontrado');
          statusDescription.setAttribute('data-i18n', 'goldberg.status.notFound.description');
          statusDescription.textContent = await this.app.t(
            'goldberg.status.notFound.description',
            'Nenhuma instalação Goldberg SteamEmu Saves detectada'
          );
          statusDetails.style.display = 'none';
          if (migrateBtn) migrateBtn.style.display = 'none';
        }
      } else {
        // API não disponível
        statusCard.className = 'goldberg-status-card status-error';
        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        statusTitle.setAttribute('data-i18n', 'goldberg.status.unavailable');
        statusTitle.textContent = await this.app.t('goldberg.status.unavailable', 'Sistema não disponível');
        statusDescription.setAttribute('data-i18n', 'goldberg.status.unavailable.description');
        statusDescription.textContent = await this.app.t(
          'goldberg.status.unavailable.description',
          'Funcionalidade disponível apenas no aplicativo desktop'
        );
        statusDetails.style.display = 'none';
        if (migrateBtn) migrateBtn.style.display = 'none';
      }
    } catch (error) {

      const statusCard = document.getElementById('goldbergStatusCard');
      const statusIcon = document.getElementById('goldbergStatusIcon');
      const statusTitle = document.getElementById('goldbergStatusTitle');
      const statusDescription = document.getElementById('goldbergStatusDescription');

      if (statusCard) {
        statusCard.className = 'goldberg-status-card status-error';
        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        statusTitle.setAttribute('data-i18n', 'goldberg.status.error');
        statusTitle.textContent = await this.app.t('goldberg.status.error', 'Erro na verificação');
        statusDescription.setAttribute('data-i18n', 'goldberg.status.error.description');
        statusDescription.textContent = await this.app.t(
          'goldberg.status.error.description',
          'Ocorreu um erro ao verificar os arquivos Goldberg'
        );
      }
    }
  }

  setupGoldbergEventListeners() {
    // Botão de verificação
    const checkBtn = document.getElementById('goldbergCheckBtn');
    if (checkBtn) {
      checkBtn.addEventListener('click', async () => {
        await this.checkGoldbergStatus();
      });
    }

    // Botão de migração
    const migrateBtn = document.getElementById('goldbergMigrateBtn');
    if (migrateBtn) {
      migrateBtn.addEventListener('click', async () => {
        await this.migrateAllGoldbergGames();
      });
    }

    // Configurações
    const autoMigrationToggle = document.getElementById('goldbergAutoMigrationToggle');
    const showDialogToggle = document.getElementById('goldbergShowDialogToggle');

    if (autoMigrationToggle) {
      autoMigrationToggle.addEventListener('change', async () => {
        await this.updateGoldbergSetting('autoMigration', autoMigrationToggle.checked);
      });
    }

    if (showDialogToggle) {
      showDialogToggle.addEventListener('change', async () => {
        await this.updateGoldbergSetting('showDialog', showDialogToggle.checked);
      });
    }
  }

  async updateGoldbergSetting(key, value) {
    try {
      if (this.app.isElectronAPIAvailable('goldberg')) {
        const result = await this.app.safeElectronAPICall('goldberg.setSetting', key, value);

        if (result.success) {
          // Configuração atualizada com sucesso
        } else {
          
          this.app.showError(`Erro ao salvar configuração: ${result.error}`);
        }
      }
    } catch (error) {
      
      this.app.showError('Erro ao salvar configuração');
    }
  }

  async migrateAllGoldbergGames() {
    try {
      const migrateBtn = document.getElementById('goldbergMigrateBtn');

      if (migrateBtn) {
        // Desabilitar botão e mostrar progresso
        migrateBtn.disabled = true;
        migrateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${await this.app.t('steam.conversion.converting', 'Convertendo...')}`;
      }

      if (this.app.isElectronAPIAvailable('goldberg')) {
        const result = await this.app.safeElectronAPICall('goldberg.migrateAll');

        if (result.success) {
          this.app.showSuccess(
            await this.app.t('goldberg.migration.completed', 'Migração concluída') +
              `: ${result.successCount} / ${result.totalGames}`
          );

          // Atualizar status
          await this.checkGoldbergStatus();
        } else {
          this.app.showError(
            await this.app.t('goldberg.migration.error', 'Erro na migração') +
              (result.error ? `: ${result.error}` : '')
          );
        }
      }
    } catch (error) {
      
      this.app.showError(await this.app.t('goldberg.migration.error', 'Erro na migração'));
    } finally {
      // Restaurar botão
      const migrateBtn = document.getElementById('goldbergMigrateBtn');
      if (migrateBtn) {
        migrateBtn.disabled = false;
        migrateBtn.innerHTML =
          '<i class="fas fa-play"></i> <span data-i18n="settings.goldberg.migrateAll">Converter Todos</span>';
      }
    }
  }

  // Método de navegação global
  async showPage(page, tabName = null) {
    await this.navigateTo(page, tabName);
  }

  // Mostrar dialog "Em breve"
  async restartApplication() {
    try {
      // Mostrar notificação de reinicialização
      this.app.modules.helpers.showNotification(
        await this.app.t('settings.restart.restarting', 'Reiniciando aplicativo...'),
        'info'
      );

      // Aguardar um momento para a notificação aparecer
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Chamar função de reinicialização do processo principal
      if (window.electronAPI && window.electronAPI.system) {
        await window.electronAPI.system.restart();
      } else {
        // Fallback para desenvolvimento web
        window.location.reload();
      }
    } catch (error) {
      
      this.app.modules.helpers.showNotification(
        await this.app.t('settings.restart.error', 'Erro ao reiniciar aplicativo'),
        'error'
      );
    }
  }

  async showRestartDialog() {
    try {
      // Detectar se está em modo desenvolvimento
      let isDevelopmentMode = false;
      try {
        if (window.electronAPI && typeof window.electronAPI.isDevelopmentMode === 'function') {
          isDevelopmentMode = await window.electronAPI.isDevelopmentMode();
        } else {

          isDevelopmentMode = window.env?.NODE_ENV === 'development';
        }
      } catch (error) {

        isDevelopmentMode = window.env?.NODE_ENV === 'development';
      }

      // Detectar se é versão portable ou instalada com fallback
      let isInstalled = false;
      try {
        if (window.electronAPI && typeof window.electronAPI.isInstalledVersion === 'function') {
          isInstalled = await window.electronAPI.isInstalledVersion();
        } else {

          isInstalled = false;
        }
      } catch (error) {

        isInstalled = false; // Fallback para portable
      }

      // Obter traduções baseadas no tipo de instalação
      const restartTitle = await this.app.t(
        'settings.restart.modal.title',
        'Reinicialização Necessária'
      );
      const restartMessage = isInstalled
        ? await this.app.t(
            'settings.restart.modal.messageInstalled',
            'Para aplicar as mudanças, o aplicativo será reiniciado automaticamente.'
          )
        : await this.app.t(
            'settings.restart.modal.message',
            'Para aplicar as mudanças, o aplicativo será finalizado. Você precisará abri-lo novamente manualmente.'
          );
      const restartConfirm = isInstalled
        ? await this.app.t('settings.restart.modal.confirmInstalled', 'Reiniciar Agora')
        : await this.app.t('settings.restart.modal.confirm', 'Finalizar Agora');
      const restartCancel = await this.app.t('settings.restart.modal.cancel', 'Cancelar');

      // Detectar tema atual
      const isDarkTheme =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.body.classList.contains('dark-theme') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Criar o overlay do modal
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay restart-modal-overlay';
      overlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(0, 0, 0, ${isDarkTheme ? '0.8' : '0.6'}) !important;
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

      // Criar o modal
      const modal = document.createElement('div');
      modal.className = 'restart-modal';

      // Estilos baseados no tema
      const modalStyles = isDarkTheme
        ? {
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)',
            border: '1px solid #404040',
            color: '#ffffff',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          }
        : {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid #e0e0e0',
            color: '#333333',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
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
          <i class="fas ${isInstalled ? 'fa-sync-alt' : 'fa-power-off'}"></i>
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
            <i class="fas ${isInstalled ? 'fa-sync-alt' : 'fa-power-off'}" style="margin-right: 0.5rem;"></i>
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

      // Adicionar estilos específicos para temas
      const style = document.createElement('style');
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
        
        /* Estilos específicos para tema escuro */
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
        
        /* Estilos específicos para tema claro */
        [data-theme="light"] .restart-modal,
        .light-theme .restart-modal,
        body:not([data-theme]) .restart-modal {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
          border: 1px solid #e0e0e0 !important;
          color: #333333 !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2) !important;
        }
        
        /* Animações */
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

      // Verificar se o modal está realmente visível na tela após um tempo
      setTimeout(async () => {
        const isInDOM = document.body.contains(overlay);
        const overlayRect = overlay.getBoundingClientRect();
        const modalRect = modal.getBoundingClientRect();
        const overlayStyle = window.getComputedStyle(overlay);
        const modalStyle = window.getComputedStyle(modal);

        // Verificação mais rigorosa de visibilidade
        const isOverlayVisible =
          overlayStyle.display !== 'none' &&
          overlayStyle.visibility !== 'hidden' &&
          overlayStyle.opacity !== '0' &&
          overlayRect.width > 0 &&
          overlayRect.height > 0;

        const isModalVisible =
          modalStyle.display !== 'none' &&
          modalStyle.visibility !== 'hidden' &&
          modalStyle.opacity !== '0' &&
          modalRect.width > 0 &&
          modalRect.height > 0;

        // Se qualquer verificação falhar, usar fallback
        if (!isInDOM || !isOverlayVisible || !isModalVisible) {
          try {
            overlay.remove();
          } catch (e) {
            // Erro silencioso ao remover overlay
          }

          // Usar fallback nativo
          const fallbackMessage = isInstalled
            ? await this.app.t(
                'settings.restart.modal.messageInstalled',
                'Para aplicar as mudanças, o aplicativo será reiniciado automaticamente.'
              )
            : await this.app.t(
                'settings.restart.modal.message',
                'Para aplicar as mudanças, o aplicativo será finalizado. Você precisará abri-lo novamente manualmente.'
              );
          const confirmText = isInstalled ? 'Deseja reiniciar agora?' : 'Deseja finalizar agora?';
          const shouldRestart = window.confirm(fallbackMessage + '\n\n' + confirmText);

          if (shouldRestart) {
            await this.restartApplication();
          }
          return;
        }
      }, 500);

      // Event listeners para os botões
      const confirmBtn = modal.querySelector('#restartConfirmBtn');
      const cancelBtn = modal.querySelector('#restartCancelBtn');

      confirmBtn.addEventListener('click', async () => {
        // Verificar se está em modo desenvolvimento antes de executar restart
        if (isDevelopmentMode) {
          // Fechar o modal primeiro
          overlay.remove();
          style.remove();

          // Mostrar alerta informando que não funciona no modo dev
          const devTitle = await this.app.t('settings.restart.dev.title', 'Modo Desenvolvimento');
          const devMessage = await this.app.t(
            'settings.restart.dev.message',
            'O restart não funciona no modo de desenvolvimento. Para aplicar as mudanças, pare o servidor (Ctrl+C) e execute "yarn dev" novamente.'
          );

          alert(`${devTitle}\n\n${devMessage}`);
          return;
        }

        // Se não estiver em modo dev, proceder normalmente
        overlay.remove();
        style.remove();
        await this.restartApplication();
      });

      cancelBtn.addEventListener('click', () => {
        overlay.remove();
        style.remove();
      });

      // Fechar ao clicar no overlay
      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          overlay.remove();
          style.remove();
        }
      });

      // Fechar com ESC
      const handleEsc = e => {
        if (e.key === 'Escape') {
          overlay.remove();
          style.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
    } catch (error) {
      
    }
  }

  async showComingSoonDialog(featureName) {
    try {
      // Obter traduções
      const comingSoonText = this.app.modules.helpers.t('feature.coming.soon');
      const featureText = this.app.modules.helpers.t('feature.dialog.default.name');
      const developmentText = this.app.modules.helpers.t('feature.will.be.launched');
      const workingText = this.app.modules.helpers.t('feature.working.hard');
      const understoodText = this.app.modules.helpers.t('feature.dialog.understood');

      // Criar o overlay do modal
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
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

      // Criar o modal
      const modal = document.createElement('div');
      modal.className = 'coming-soon-modal';
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

      // Adicionar estilos de animação
      const style = document.createElement('style');
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

      // Fechar ao clicar no overlay
      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          overlay.remove();
          style.remove();
        }
      });

      // Fechar com ESC
      const handleEsc = e => {
        if (e.key === 'Escape') {
          overlay.remove();
          style.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
    } catch (error) {
      
    }
  }
}

// Exportar para uso global

// Exportar a classe NavigationManager
export { NavigationManager };

// Disponibilizar globalmente para compatibilidade
window.NavigationManager = NavigationManager;
