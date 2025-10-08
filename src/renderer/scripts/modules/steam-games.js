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
var __defProp222222 = Object.defineProperty;
var __name222222 = __name22222(
  (target, value) => __defProp222222(target, "name", { value, configurable: true }),
  "__name"
);
class SteamGamesManager {
  static {
    __name(this, "SteamGamesManager");
  }
  static {
    __name2(this, "SteamGamesManager");
  }
  static {
    __name22(this, "SteamGamesManager");
  }
  static {
    __name222(this, "SteamGamesManager");
  }
  static {
    __name2222(this, "SteamGamesManager");
  }
  static {
    __name22222(this, "SteamGamesManager");
  }
  static {
    __name222222(this, "SteamGamesManager");
  }
  constructor(app) {
    this.app = app;
    this.steamGames = [];
    this.isLoading = false;
    this.selectedGame = null;
    this.currentGamesVirtualScroller = null;
  }
  /**
   * Carregar jogos da Steam
   */
  async loadSteamGames() {
    try {
      if (this.isLoading) return;
      this.isLoading = true;
      await this.showLoadingState();
      if (this.app.isElectronAPIAvailable("steam")) {
        const result = await this.app.safeElectronAPICall("steam.getUserGames", {
          installedOnly: true
        });
        if (result.success) {
          this.steamGames = result.games || [];
          await this.displaySteamGames();
          if (this.steamGames.length === 0) {
            await this.showEmptyState();
          }
        } else {
          await this.showErrorState(result.error);
        }
      } else {
        await this.showErrorState(`${await this.app.modules.helpers.t("steam.errorApi")}`);
      }
    } catch (error) {
      await this.showErrorState(error.message);
    } finally {
      this.isLoading = false;
    }
  }
  /**
   * Exibir estado de carregamento
   */
  async showLoadingState() {
    const gamesContainer = document.getElementById("steam-games-container");
    if (!gamesContainer) return;
    const loadingTitle = await this.app.modules.helpers.t("steam.loading");
    const loadingInfo = await this.app.modules.helpers.t("steam.gettingLibrary");
    gamesContainer.innerHTML = `
      <div class="loading-state">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <h3 data-i18n="steam.loading">${loadingTitle}</h3>
        <p data-i18n="steam.gettingLibrary">${loadingInfo}</p>
      </div>
    `;
  }
  /**
   * Exibir estado vazio
   */
  async showEmptyState() {
    const gamesContainer = document.getElementById("steam-games-container");
    if (!gamesContainer) return;
    const notFoundText = await this.app.modules.helpers.t("common.notFound");
    const noGamesText = await this.app.modules.helpers.t("steam.noGames");
    const retryText = await this.app.modules.helpers.t("common.retry");
    gamesContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fab fa-steam"></i>
        </div>
        <h3 data-i18n="common.notFound">${notFoundText}</h3>
        <p data-i18n="steam.noGames">${noGamesText}</p>
        <div class="empty-actions">
          <button class="btn btn-primary" onclick="steamGamesManager.loadSteamGames()">
            <i class="fas fa-refresh"></i> ${retryText}
          </button>
        </div>
      </div>
    `;
  }
  /**
   * Exibir estado de erro
   */
  async showErrorState(error) {
    const gamesContainer = document.getElementById("steam-games-container");
    if (!gamesContainer) return;
    const loadingGamesText = await this.app.modules.helpers.t("errors.loadingGames");
    const unknownErrorText = await this.app.modules.helpers.t("errors.unknownError");
    const retryText = await this.app.modules.helpers.t("common.retry");
    const settingsText = await this.app.modules.helpers.t("nav.settings");
    gamesContainer.innerHTML = `
      <div class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 data-i18n="errors.loadingGames">${loadingGamesText}</h3>
        <p>${error || unknownErrorText}</p>
        <div class="error-actions">
          <button class="btn btn-primary" onclick="steamGamesManager.loadSteamGames()">
            <i class="fas fa-refresh"></i> ${retryText}
          </button>
          <button class="btn btn-secondary" onclick="navigationManager.showPage('settings')">
            <i class="fas fa-cog"></i> ${settingsText}
          </button>
        </div>
      </div>
    `;
  }
  /**
   * Exibir jogos da Steam
   */
  async displaySteamGames() {
    const gamesContainer = document.getElementById("steam-games-container");
    if (!gamesContainer || this.steamGames.length === 0) return;
    const [titleText, gamesFoundText, updateText, ...gameCards] = await Promise.all([
      this.app.modules.helpers.t("steam.library.title"),
      this.app.modules.helpers.t("steam.library.gamesFound"),
      this.app.modules.helpers.t("common.reload"),
      ...this.steamGames.map((game) => this.createGameCard(game))
    ]);
    const gamesGrid = gameCards.join("");
    gamesContainer.innerHTML = `
      <div class="games-header">
        <div class="games-info">
          <h2><i class="fab"></i> ${titleText}</h2>
          <p>${this.steamGames.length} ${gamesFoundText}</p>
        </div>
        <div class="games-actions">
          <button class="btn btn-secondary" onclick="steamGamesManager.loadSteamGames()">
            <i class="fas fa-refresh"></i> ${updateText}
          </button>
        </div>
      </div>
      <div class="games-grid">
        ${gamesGrid}
      </div>
    `;
  }
  /**
   * Criar card do jogo
   */
  async createGameCard(game) {
    const [hoursText, notPlayedText, weeksText, convertText, viewAchievementsText] = await Promise.all([
      this.app.modules.helpers.t("steam.playtime.hours"),
      this.app.modules.helpers.t("steam.playtime.notPlayed"),
      this.app.modules.helpers.t("steam.playtime.weeks"),
      this.app.modules.helpers.t("steam.convertToGse"),
      this.app.modules.helpers.t("steam.viewAchievements")
    ]);
    const playtimeText = game.playtimeForever > 0 ? `${Math.round(game.playtimeForever / 60)} ${hoursText}` : notPlayedText;
    const recentPlaytime = game.playTime2Weeks > 0 ? `<div class="recent-playtime">
        <i class="fas fa-clock"></i> 
        ${Math.round(game.playTime2Weeks / 60)}h (2 ${weeksText})
      </div>` : "";
    return `
      <div class="game-card" data-game-id="${game.id}">
        <div class="game-image">
          ${game.imgLogoUrl ? `<img src="${game.imgLogoUrl}" alt="${game.name}" loading="lazy">` : `<div class="game-placeholder">
              <i class="fas fa-gamepad"></i>
            </div>`}
          <div class="game-overlay">
            <button class="btn btn-convert" onclick="steamGamesManager.showConvertDialog('${game.id}', '${game.name.replace(/'/g, "\\'")}')" title="${convertText}">
              <i class="fas fa-download"></i>
              ${convertText}
            </button>
          </div>
        </div>
        <div class="game-info">
          <h3 class="game-title">${game.name}</h3>
          <div class="game-stats">
            <div class="playtime">
              <i class="fas fa-clock"></i> 
              ${playtimeText}
            </div>
            ${recentPlaytime}
          </div>
        </div>
        <div class="game-actions">
          <button class="btn btn-primary btn-sm" onclick="steamGamesManager.showGameAchievements('${game.id}', '${game.name.replace(/'/g, "\\'")}')" title="${viewAchievementsText}">
            <i class="fas fa-trophy"></i>
          </button>
        </div>
      </div>
    `;
  }
  /**
   * Mostrar dialog de conversão
   */
  async showConvertDialog(gameId, gameName) {
    const featureName = this.app && this.app.modules && this.app.modules.helpers && this.app.modules.helpers.t ? await this.app.modules.helpers.t("steam.convertToGse") : await this.app?.t?.("steam.convertToGse", "Converter para GSE");
    if (this.app && typeof this.app.showFeatureDialog === "function") {
      this.app.showFeatureDialog(featureName);
      return;
    }
    if (this.app && typeof this.app.showFeatureDialog === "function") {
      const featureName2 = await this.app?.t?.("steam.convertToGse", "Converter para GSE");
      this.app.showFeatureDialog(featureName2);
    }
    try {
      const achievementsResult = await this.app.safeElectronAPICall(
        "steam.getUserGameAchievements",
        gameId
      );
      const [
        unlockedText,
        totalText,
        completeText,
        titleText,
        whatWillHappenText,
        step1Text,
        step2Text,
        step3Text,
        step4Text,
        warningText,
        cancelText,
        convertNowText
      ] = await Promise.all([
        this.app.modules.helpers.t("steam.achievements.unlocked"),
        this.app.modules.helpers.t("steam.achievements.total"),
        this.app.modules.helpers.t("common.complete"),
        this.app.modules.helpers.t("steam.conversion.title"),
        this.app.modules.helpers.t("steam.conversion.whatWillHappen"),
        this.app.modules.helpers.t("steam.conversion.step1"),
        this.app.modules.helpers.t("steam.conversion.step2"),
        this.app.modules.helpers.t("steam.conversion.step3"),
        this.app.modules.helpers.t("steam.conversion.step4"),
        this.app.modules.helpers.t("steam.conversion.warning"),
        this.app.modules.helpers.t("common.cancel"),
        this.app.modules.helpers.t("steam.conversion.convertNow")
      ]);
      let achievementsInfo = "";
      if (achievementsResult.success) {
        const total = achievementsResult.totalAchievements || 0;
        const earned = achievementsResult.earnedAchievements || 0;
        const percentage = achievementsResult.completionPercentage || 0;
        achievementsInfo = `
          <div class="achievements-summary">
            <div class="achievement-stats">
              <div class="stat-item">
                <span class="stat-number">${earned}</span>
                <span class="stat-label" data-i18n="steam.achievements.unlocked">${unlockedText}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${total}</span>
                <span class="stat-label" data-i18n="steam.achievements.total">${totalText}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${percentage}%</span>
                <span class="stat-label" data-i18n="common.complete">${completeText}</span>
              </div>
            </div>
          </div>
        `;
      }
      const dialogHTML = `
        <div class="convert-dialog">
          <div class="dialog-header">
            <h3><i class="fas fa-download"></i> <span data-i18n="steam.conversion.title">${titleText}</span></h3>
            <button class="btn-close" onclick="closeDialog()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="dialog-content">
            <div class="game-preview">
              <i class="fas fa-gamepad"></i>
              <h4>${gameName}</h4>
            </div>
            
            ${achievementsInfo}
            
            <div class="convert-explanation">
              <h5><i class="fas fa-info-circle"></i> <span data-i18n="steam.conversion.whatWillHappen">${whatWillHappenText}</span></h5>
              <ul>
                <li><i class="fas fa-check"></i> <span data-i18n="steam.conversion.step1">${step1Text}</span></li>
                <li><i class="fas fa-check"></i> <span data-i18n="steam.conversion.step2">${step2Text}</span></li>
                <li><i class="fas fa-check"></i> <span data-i18n="steam.conversion.step3">${step3Text}</span> <code>GSE Saves/${gameId}/achievements.json</code></li>
                <li><i class="fas fa-check"></i> <span data-i18n="steam.conversion.step4">${step4Text}</span></li>
              </ul>
            </div>
            
            <div class="convert-warning">
              <i class="fas fa-exclamation-triangle"></i>
              <p data-i18n="steam.conversion.warning">${warningText}</p>
            </div>
          </div>
          
          <div class="dialog-actions">
            <button class="btn btn-secondary" onclick="closeDialog()">
              <i class="fas fa-times"></i> <span data-i18n="common.cancel">${cancelText}</span>
            </button>
            <button class="btn btn-success" onclick="steamGamesManager.convertGameToGSE('${gameId}', '${gameName.replace(/'/g, "\\'")}')" id="confirmConvertBtn">
              <i class="fas fa-download"></i> <span data-i18n="steam.conversion.convertNow">${convertNowText}</span>
            </button>
          </div>
        </div>
      `;
      this.showDialog(dialogHTML);
    } catch (error) {
      const loadErrorText = await this.app.modules.helpers.t("errors.gameInfoLoadError");
      this.app.showError(loadErrorText + "\n" + error);
    }
  }
  /**
   * Converter jogo para GSE
   */
  async convertGameToGSE(gameId, gameName) {
    const confirmBtn = document.getElementById("confirmConvertBtn");
    const [convertingText, convertNowText] = await Promise.all([
      this.app.modules.helpers.t("steam.conversion.converting"),
      this.app.modules.helpers.t("steam.conversion.convertNow")
    ]);
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${convertingText}`;
    }
    const result = await this.app.safeElectronAPICall("steam.convertToGSE", gameId);
    if (result.success) {
      const [successText, ofText, achievementsTitleText, fileSavedText] = await Promise.all([
        this.app.modules.helpers.t("steam.conversion.success", { gameName }),
        this.app.modules.helpers.t("common.of"),
        this.app.modules.helpers.t("steam.achievements.title"),
        this.app.modules.helpers.t("steam.conversion.fileSaved")
      ]);
      this.app.showSuccess(
        `\u{1F389} ${successText}

\u{1F4CA} ${result.earnedAchievements} ${ofText} ${result.totalAchievements} ${achievementsTitleText} (${result.completionPercentage}%)
\u{1F4C1} ${fileSavedText}: ${result.filePath}`
      );
      this.closeDialog();
    } else {
      const [conversionErrorText, unknownErrorText] = await Promise.all([
        this.app.modules.helpers.t("steam.conversion.error"),
        this.app.modules.helpers.t("errors.unknownError")
      ]);
      this.app.showError(`${conversionErrorText}: ${result.error || unknownErrorText}`);
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `<i class="fas fa-download"></i> ${convertNowText}`;
      }
    }
  }
  /**
   * Mostrar conquistas do jogo
   */
  async showGameAchievements(gameId, gameName) {
    try {
      const [dialogTitleText, loadingText] = await Promise.all([
        this.app.modules.helpers.t("steam.achievements.dialogTitle"),
        this.app.modules.helpers.t("steam.achievements.loading")
      ]);
      this.showDialog(`
        <div class="achievements-dialog loading">
          <div class="dialog-header">
            <h3><i class="fas fa-trophy"></i> ${dialogTitleText} - ${gameName}</h3>
          </div>
          <div class="dialog-content">
            <div class="loading-achievements">
              <i class="fas fa-spinner fa-spin"></i>
              <p>${loadingText}</p>
            </div>
          </div>
        </div>
      `);
      const result = await this.app.safeElectronAPICall("steam.getUserGameAchievements", gameId);
      if (result.success) {
        await this.displayAchievementsDialog(gameId, gameName, result);
      } else if (result.hasAchievements && !result.hasUserProgress) {
        await this.displayAchievementsDialog(gameId, gameName, {
          ...result,
          showProgressWarning: true
        });
      } else {
        const [
          loadErrorText,
          noAchievementsText,
          gameNotOwnedText,
          unknownErrorText,
          suggestionText
        ] = await Promise.all([
          this.app.modules.helpers.t("steam.achievements.loadError"),
          this.app.modules.helpers.t("steam.achievements.noAchievements"),
          this.app.modules.helpers.t("steam.achievements.gameNotOwned"),
          this.app.modules.helpers.t("steam.achievements.unknownError"),
          this.app.modules.helpers.t("steam.achievements.suggestion")
        ]);
        let errorIcon = "fas fa-exclamation-triangle";
        let errorClass = "error";
        let errorTitle = loadErrorText;
        if (result.errorType === "NO_STATS") {
          errorIcon = "fas fa-info-circle";
          errorClass = "info";
          errorTitle = noAchievementsText;
        } else if (result.errorType === "GAME_NOT_OWNED") {
          errorIcon = "fas fa-lock";
          errorClass = "warning";
          errorTitle = gameNotOwnedText;
        }
        this.showDialog(`
          <div class="achievements-dialog ${errorClass}">
            <div class="dialog-header">
              <h3><i class="fas fa-trophy"></i> ${dialogTitleText} - ${gameName}</h3>
              <button class="btn-close" onclick="closeDialog()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="dialog-content">
              <div class="error-achievements">
                <i class="${errorIcon}"></i>
                <h4>${errorTitle}</h4>
                <p>${result.error || unknownErrorText}</p>
                ${result.suggestion ? `<div class="error-suggestion"><i class="fas fa-lightbulb"></i> <strong>${suggestionText}</strong> ${result.suggestion}</div>` : ""}
              </div>
            </div>
          </div>
        `);
      }
    } catch (error) {
      const loadErrorText = await this.app.modules.helpers.t("steam.achievements.loadError");
      this.app.showError(loadErrorText + "\n" + error);
    }
  }
  /**
   * Obter display de troféu baseado na porcentagem
   */
  async getTrophyDisplay(percentage) {
    const trophyData = this.getTrophyByPercentage(percentage);
    const [trophyName, trophyDescription] = await Promise.all([
      this.app.modules.helpers.t(`dashboard.trophies.${trophyData.type}.name`),
      this.app.modules.helpers.t(`dashboard.trophies.${trophyData.type}.description`)
    ]);
    return `
      <div class="trophy-display">
        <div class="trophy-icon ${trophyData.class}">
          <i class="${trophyData.icon}"></i>
        </div>
        <div class="trophy-info">
          <h5 class="trophy-name" data-i18n="dashboard.trophies.${trophyData.type}.name">${trophyName}</h5>
          <p class="trophy-description" data-i18n="dashboard.trophies.${trophyData.type}.description">${trophyDescription}</p>
        </div>
      </div>
    `;
  }
  /**
   * Determinar troféu baseado na porcentagem
   */
  getTrophyByPercentage(percentage) {
    if (percentage >= 95) {
      return {
        type: "platinum",
        icon: "fas fa-crown",
        class: "trophy-platinum"
      };
    } else if (percentage >= 80) {
      return {
        type: "gold",
        icon: "fas fa-trophy",
        class: "trophy-gold"
      };
    } else if (percentage >= 60) {
      return {
        type: "silver",
        icon: "fas fa-medal",
        class: "trophy-silver"
      };
    } else if (percentage >= 30) {
      return {
        type: "bronze",
        icon: "fas fa-star",
        class: "trophy-bronze"
      };
    } else {
      return {
        type: "none",
        icon: "fas fa-question",
        class: "trophy-none"
      };
    }
  }
  /**
   * Exibir dialog de conquistas
   */
  async displayAchievementsDialog(gameId, gameName, achievementsData) {
    gameId = null;
    const achievements = achievementsData.achievements || [];
    const earnedCount = achievementsData.earnedAchievements || 0;
    const totalCount = achievementsData.totalAchievements || 0;
    const percentage = achievementsData.completionPercentage || 0;
    const hasWarning = achievementsData.warning || achievementsData.warningType;
    const hasUserProgress = achievementsData.hasUserProgress !== false;
    const [
      earnedOnText,
      achievementsTitleText,
      limitedDataWarningText,
      progressText,
      ofText,
      globalProgressWarningText,
      legendaryText,
      epicText,
      rareText,
      commonText
    ] = await Promise.all([
      this.app.modules.helpers.t("steam.achievements.earnedOn"),
      this.app.modules.helpers.t("steam.achievements.title"),
      this.app.modules.helpers.t("steam.achievements.limitedDataWarning"),
      this.app.modules.helpers.t("steam.achievements.progress"),
      this.app.modules.helpers.t("common.of"),
      this.app.modules.helpers.t("steam.conversion.title"),
      this.app.modules.helpers.t(
        "steam.achievements.globalProgressWarning",
        "\u26A0\uFE0F Progresso baseado em dados globais"
      ),
      this.app.modules.helpers.t("dashboard.trophies.legendary.name"),
      this.app.modules.helpers.t("dashboard.trophies.epic.name"),
      this.app.modules.helpers.t("dashboard.trophies.rare.name"),
      this.app.modules.helpers.t("dashboard.trophies.common.name")
    ]);
    const achievementsList = achievements.map((achievement) => {
      const earnedClass = achievement.earned ? "earned" : "unearned";
      const earnedIcon = achievement.earned ? "fas fa-check-circle" : "far fa-circle";
      let earnedDate = "";
      if (achievement.earned && achievement.earnedTime && achievement.earnedTime > 0) {
        const timestamp = achievement.earnedTime < 1e12 ? achievement.earnedTime * 1e3 : achievement.earnedTime;
        earnedDate = new Date(timestamp).toLocaleDateString("pt-BR");
      }
      let rarityInfo = "";
      if (achievement.globalPercent !== null && achievement.globalPercent !== void 0) {
        const rarity = achievement.globalPercent;
        let rarityClass = "common";
        let rarityText = commonText;
        if (rarity < 1) {
          rarityClass = "legendary";
          rarityText = legendaryText;
        } else if (rarity < 5) {
          rarityClass = "epic";
          rarityText = epicText;
        } else if (rarity < 15) {
          rarityClass = "rare";
          rarityText = rareText;
        }
        rarityInfo = `<div class="achievement-rarity ${rarityClass}">${rarityText} (${rarity.toFixed(1)}%)</div>`;
      }
      return `
        <div class="achievement-item ${earnedClass}">
          <div class="achievement-icon">
            <img src="${achievement.earned ? achievement.icon : achievement.icongray}" 
                 alt="${achievement.name}" 
                 loading="lazy">
            <div class="achievement-status">
              <i class="${earnedIcon}"></i>
            </div>
          </div>
          <div class="achievement-details">
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
            ${earnedDate ? `<div class="earned-date"><i class="fas fa-calendar-check"></i> ${earnedOnText}: ${earnedDate}</div>` : ""}
            ${rarityInfo}
          </div>
        </div>
      `;
    }).join("");
    const trophyDisplayHtml = await this.getTrophyDisplay(percentage);
    const dialogHTML = `
      <div class="achievements-dialog">
        <div class="dialog-header">
          <h3><i class="fas fa-trophy"></i> <span data-i18n="steam.achievements.title">${achievementsTitleText}</span> - ${gameName}</h3>
          <button class="btn-close" onclick="closeDialog()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="dialog-content">
          ${hasWarning ? `
            <div class="warning-message">
              <i class="fas fa-exclamation-triangle"></i>
              <span>${achievementsData.warning || limitedDataWarningText}</span>
            </div>
          ` : ""}
          
          <div class="achievements-summary">
            <div class="summary-stats">
              <div class="stat-circle">
                <div class="circle-progress" style="--progress: ${percentage}%">
                  <span>${percentage}%</span>
                </div>
              </div>
              <div class="stat-details">
                <h4 data-i18n="steam.achievements.progress">${progressText}</h4>
                <p>${earnedCount} ${ofText} ${totalCount} ${achievementsTitleText || "conquistas"}</p>
                ${!hasUserProgress ? `<small style="color: var(--text-secondary);" data-i18n="steam.achievements.globalProgressWarning">${globalProgressWarningText}</small>` : ""}
              </div>
            </div>
            ${trophyDisplayHtml}
          </div>
          
          <div class="achievements-list" id="achievementsList">
            ${achievementsList}
          </div>
        </div>
      </div>
    `;
    this.showDialog(dialogHTML);
    this.setupVirtualScrolling(achievements);
  }
  /**
   * Configurar Virtual Scrolling para conquistas
   */
  async setupVirtualScrolling(achievements) {
    const settings = this.app.modules.state?.getState("settings") || {};
    const isVirtualScrollingEnabled = settings.virtualScrolling !== false;
    if (!isVirtualScrollingEnabled || achievements.length < 10) {
      return;
    }
    const achievementsList = document.getElementById("achievementsList");
    if (!achievementsList || !window.VirtualScroller) {
      return;
    }
    achievementsList.innerHTML = "";
    const [earnedOnTextVS, legendaryTextVS, epicTextVS, rareTextVS, commonTextVS] = await Promise.all([
      this.app.modules.helpers.t("steam.achievements.earnedOn"),
      this.app.modules.helpers.t("dashboard.trophies.legendary.name"),
      this.app.modules.helpers.t("dashboard.trophies.epic.name"),
      this.app.modules.helpers.t("dashboard.trophies.rare.name"),
      this.app.modules.helpers.t("dashboard.trophies.common.name")
    ]);
    const virtualScroller = new window.VirtualScroller(achievementsList, {
      itemHeight: 120,
      // Altura do item de conquista
      bufferSize: 3,
      // Itens extras para buffer
      threshold: 50,
      // Limite para ativar
      renderItem: __name222222((achievement) => {
        const earnedClass = achievement.earned ? "earned" : "unearned";
        const earnedIcon = achievement.earned ? "fas fa-check-circle" : "far fa-circle";
        const earnedDate = achievement.earned && achievement.earnedTime ? new Date(achievement.earnedTime * 1e3).toLocaleDateString("pt-BR") : "";
        let rarityInfo = "";
        if (achievement.globalPercent !== null && achievement.globalPercent !== void 0) {
          const rarity = achievement.globalPercent;
          let rarityClass = "common";
          let rarityText = commonTextVS;
          if (rarity < 1) {
            rarityClass = "legendary";
            rarityText = legendaryTextVS;
          } else if (rarity < 5) {
            rarityClass = "epic";
            rarityText = epicTextVS;
          } else if (rarity < 15) {
            rarityClass = "rare";
            rarityText = rareTextVS;
          }
          rarityInfo = `<div class="achievement-rarity ${rarityClass}"><i class="fas fa-star"></i> ${rarityText} (${rarity.toFixed(1)}%)</div>`;
        }
        return `
            <div class="achievement-item ${earnedClass}">
              <div class="achievement-icon">
                <img src="${achievement.earned ? achievement.icon : achievement.icongray}" 
                     alt="${achievement.name}" 
                     loading="lazy">
                <div class="achievement-status">
                  <i class="${earnedIcon}"></i>
                </div>
              </div>
              <div class="achievement-details">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                ${earnedDate ? `<div class="earned-date"><i class="fas fa-calendar-check"></i> ${earnedOnTextVS}: ${earnedDate}</div>` : ""}
                ${rarityInfo}
              </div>
            </div>
          `;
      }, "renderItem")
    });
    virtualScroller.setData(achievements);
    this.currentVirtualScroller = virtualScroller;
  }
  /**
   * Mostrar dialog genérico
   */
  showDialog(content) {
    this.closeDialog();
    const overlay = document.createElement("div");
    overlay.className = "dialog-overlay";
    overlay.innerHTML = content;
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.closeDialog();
      }
    });
    const handleEscKey = __name222222((e) => {
      if (e.key === "Escape") {
        this.closeDialog();
      }
    }, "handleEscKey");
    overlay.escKeyHandler = handleEscKey;
    document.addEventListener("keydown", handleEscKey);
    document.body.appendChild(overlay);
    if (this.app && typeof this.app.translatePage === "function") {
      this.app.translatePage();
    }
    setTimeout(() => {
      overlay.classList.add("show");
    }, 10);
    window.closeDialog = () => this.closeDialog();
  }
  /**
   * Fechar dialog
   */
  closeDialog() {
    if (this.currentVirtualScroller) {
      this.currentVirtualScroller.destroy();
    }
    const overlay = document.querySelector(".dialog-overlay");
    if (overlay) {
      if (overlay.escKeyHandler) {
        document.removeEventListener("keydown", overlay.escKeyHandler);
      }
      overlay.remove();
    }
    if (window.closeDialog) {
      delete window.closeDialog;
    }
  }
}
window.SteamGamesManager = SteamGamesManager;
export {
  SteamGamesManager
};
