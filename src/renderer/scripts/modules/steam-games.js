// Steam Games Manager - Frontend
class SteamGamesManager {
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

      if (this.app.isElectronAPIAvailable('steam')) {
        // Carregar apenas jogos instalados
        const result = await this.app.safeElectronAPICall('steam.getUserGames', {
          installedOnly: true,
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
        await this.showErrorState(`${await this.app.modules.helpers.t('steam.errorApi')}`);
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
    const gamesContainer = document.getElementById('steam-games-container');
    if (!gamesContainer) return;

    // Aguardar a tradução
    const loadingTitle = await this.app.modules.helpers.t('steam.loading');
    const loadingInfo = await this.app.modules.helpers.t('steam.gettingLibrary');

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
    const gamesContainer = document.getElementById('steam-games-container');
    if (!gamesContainer) return;

    // Aguardar as traduções
    const notFoundText = await this.app.modules.helpers.t('common.notFound');
    const noGamesText = await this.app.modules.helpers.t('steam.noGames');
    const retryText = await this.app.modules.helpers.t('common.retry');

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
    const gamesContainer = document.getElementById('steam-games-container');
    if (!gamesContainer) return;

    // Aguardar as traduções
    const loadingGamesText = await this.app.modules.helpers.t('errors.loadingGames');
    const unknownErrorText = await this.app.modules.helpers.t('errors.unknownError');
    const retryText = await this.app.modules.helpers.t('common.retry');
    const settingsText = await this.app.modules.helpers.t('nav.settings');

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
    const gamesContainer = document.getElementById('steam-games-container');
    if (!gamesContainer || this.steamGames.length === 0) return;

    // Aguardar todas as traduções e criação dos cards
    const [titleText, gamesFoundText, updateText, ...gameCards] = await Promise.all([
      this.app.modules.helpers.t('steam.library.title'),
      this.app.modules.helpers.t('steam.library.gamesFound'),
      this.app.modules.helpers.t('common.reload'),
      ...this.steamGames.map(game => this.createGameCard(game)),
    ]);

    const gamesGrid = gameCards.join('');

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
    const [hoursText, notPlayedText, weeksText, convertText, viewAchievementsText] =
      await Promise.all([
        this.app.modules.helpers.t('steam.playtime.hours'),
        this.app.modules.helpers.t('steam.playtime.notPlayed'),
        this.app.modules.helpers.t('steam.playtime.weeks'),
        this.app.modules.helpers.t('steam.convertToGse'),
        this.app.modules.helpers.t('steam.viewAchievements'),
      ]);

    const playtimeText =
      game.playtimeForever > 0
        ? `${Math.round(game.playtimeForever / 60)} ${hoursText}`
        : notPlayedText;

    const recentPlaytime =
      game.playTime2Weeks > 0
        ? `<div class="recent-playtime">
        <i class="fas fa-clock"></i> 
        ${Math.round(game.playTime2Weeks / 60)}h (2 ${weeksText})
      </div>`
        : '';

    return `
      <div class="game-card" data-game-id="${game.id}">
        <div class="game-image">
          ${
            game.imgLogoUrl
              ? `<img src="${game.imgLogoUrl}" alt="${game.name}" loading="lazy">`
              : `<div class="game-placeholder">
              <i class="fas fa-gamepad"></i>
            </div>`
          }
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
    // Feature em desenvolvimento: mostrar um diálogo informativo e sair
    try {
      const featureName =
        (this.app && this.app.modules && this.app.modules.helpers && this.app.modules.helpers.t)
          ? await this.app.modules.helpers.t('steam.convertToGse')
          : await (this.app?.t?.('steam.convertToGse', 'Converter para GSE'));
      if (this.app && typeof this.app.showFeatureDialog === 'function') {
        this.app.showFeatureDialog(featureName);
        return; // sair cedo enquanto a funcionalidade não está pronta
      }
    } catch (e) {
      if (this.app && typeof this.app.showFeatureDialog === 'function') {
        const featureName = await (this.app?.t?.('steam.convertToGse', 'Converter para GSE'));
        this.app.showFeatureDialog(featureName);
        return;
      }
    }
    try {
      // Primeiro, verificar quantas conquistas o jogo tem
      const achievementsResult = await this.app.safeElectronAPICall(
        'steam.getUserGameAchievements',
        gameId
      );

      // Aguardar todas as traduções necessárias
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
        convertNowText,
      ] = await Promise.all([
        this.app.modules.helpers.t('steam.achievements.unlocked'),
        this.app.modules.helpers.t('steam.achievements.total'),
        this.app.modules.helpers.t('common.complete'),
        this.app.modules.helpers.t('steam.conversion.title'),
        this.app.modules.helpers.t('steam.conversion.whatWillHappen'),
        this.app.modules.helpers.t('steam.conversion.step1'),
        this.app.modules.helpers.t('steam.conversion.step2'),
        this.app.modules.helpers.t('steam.conversion.step3'),
        this.app.modules.helpers.t('steam.conversion.step4'),
        this.app.modules.helpers.t('steam.conversion.warning'),
        this.app.modules.helpers.t('common.cancel'),
        this.app.modules.helpers.t('steam.conversion.convertNow'),
      ]);

      let achievementsInfo = '';
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
        const loadErrorText = await this.app.modules.helpers.t('errors.gameInfoLoadError');
        this.app.showError(loadErrorText);
      }
  }

  /**
   * Converter jogo para GSE
   */
  async convertGameToGSE(gameId, gameName) {
    try {
      const confirmBtn = document.getElementById('confirmConvertBtn');

      // Aguardar traduções necessárias
      const [convertingText, convertNowText] = await Promise.all([
        this.app.modules.helpers.t('steam.conversion.converting'),
        this.app.modules.helpers.t('steam.conversion.convertNow'),
      ]);

      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${convertingText}`;
      }

      const result = await this.app.safeElectronAPICall('steam.convertToGSE', gameId);

      if (result.success) {
        // Aguardar traduções para mensagem de sucesso
        const [successText, ofText, achievementsTitleText, fileSavedText] = await Promise.all([
          this.app.modules.helpers.t('steam.conversion.success', { gameName }),
          this.app.modules.helpers.t('common.of'),
          this.app.modules.helpers.t('steam.achievements.title'),
          this.app.modules.helpers.t('steam.conversion.fileSaved'),
        ]);

        this.app.showSuccess(
          `🎉 ${successText}\n\n` +
            `📊 ${result.earnedAchievements} ${ofText} ${result.totalAchievements} ${achievementsTitleText} (${result.completionPercentage}%)\n` +
            `📁 ${fileSavedText}: ${result.filePath}`
        );

        this.closeDialog();
      } else {
        // Aguardar traduções para mensagem de erro
        const [conversionErrorText, unknownErrorText] = await Promise.all([
          this.app.modules.helpers.t('steam.conversion.error'),
          this.app.modules.helpers.t('errors.unknownError'),
        ]);

        this.app.showError(`${conversionErrorText}: ${result.error || unknownErrorText}`);

        if (confirmBtn) {
          confirmBtn.disabled = false;
          confirmBtn.innerHTML = `<i class="fas fa-download"></i> ${convertNowText}`;
        }
      }
    } catch (error) {

      // Aguardar traduções para erro
      const [conversionErrorText, convertNowText] = await Promise.all([
        this.app.modules.helpers.t('steam.conversion.error'),
        this.app.modules.helpers.t('steam.conversion.convertNow'),
      ]);

      this.app.showError(conversionErrorText);

      const confirmBtn = document.getElementById('confirmConvertBtn');
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
      // Aguardar traduções necessárias para o loading
      const [dialogTitleText, loadingText] = await Promise.all([
        this.app.modules.helpers.t('steam.achievements.dialogTitle'),
        this.app.modules.helpers.t('steam.achievements.loading'),
      ]);

      // Mostrar loading dialog
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

      const result = await this.app.safeElectronAPICall('steam.getUserGameAchievements', gameId);

      if (result.success) {
        await this.displayAchievementsDialog(gameId, gameName, result);
      } else if (result.hasAchievements && !result.hasUserProgress) {
        // Conseguimos buscar as conquistas mas não o progresso do usuário
        await this.displayAchievementsDialog(gameId, gameName, {
          ...result,
          showProgressWarning: true,
        });
      } else {
        // Aguardar traduções para o erro
        const [
          loadErrorText,
          noAchievementsText,
          gameNotOwnedText,
          unknownErrorText,
          suggestionText,
        ] = await Promise.all([
          this.app.modules.helpers.t('steam.achievements.loadError'),
          this.app.modules.helpers.t('steam.achievements.noAchievements'),
          this.app.modules.helpers.t('steam.achievements.gameNotOwned'),
          this.app.modules.helpers.t('steam.achievements.unknownError'),
          this.app.modules.helpers.t('steam.achievements.suggestion'),
        ]);

        // Determinar ícone e classe baseado no tipo de erro
        let errorIcon = 'fas fa-exclamation-triangle';
        let errorClass = 'error';
        let errorTitle = loadErrorText;

        if (result.errorType === 'NO_STATS') {
          errorIcon = 'fas fa-info-circle';
          errorClass = 'info';
          errorTitle = noAchievementsText;
        } else if (result.errorType === 'GAME_NOT_OWNED') {
          errorIcon = 'fas fa-lock';
          errorClass = 'warning';
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
                ${result.suggestion ? `<div class="error-suggestion"><i class="fas fa-lightbulb"></i> <strong>${suggestionText}</strong> ${result.suggestion}</div>` : ''}
              </div>
            </div>
          </div>
        `);
      }
    } catch (error) {
      const loadErrorText = await this.app.modules.helpers.t('steam.achievements.loadError');
      this.app.showError(loadErrorText);
    }
  }

  /**
   * Obter display de troféu baseado na porcentagem
   */
  async getTrophyDisplay(percentage) {
    const trophyData = this.getTrophyByPercentage(percentage);
    const [trophyName, trophyDescription] = await Promise.all([
      this.app.modules.helpers.t(`dashboard.trophies.${trophyData.type}.name`),
      this.app.modules.helpers.t(`dashboard.trophies.${trophyData.type}.description`),
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
        type: 'platinum',
        icon: 'fas fa-crown',
        class: 'trophy-platinum',
      };
    } else if (percentage >= 80) {
      return {
        type: 'gold',
        icon: 'fas fa-trophy',
        class: 'trophy-gold',
      };
    } else if (percentage >= 60) {
      return {
        type: 'silver',
        icon: 'fas fa-medal',
        class: 'trophy-silver',
      };
    } else if (percentage >= 30) {
      return {
        type: 'bronze',
        icon: 'fas fa-star',
        class: 'trophy-bronze',
      };
    } else {
      return {
        type: 'none',
        icon: 'fas fa-question',
        class: 'trophy-none',
      };
    }
  }

  /**
   * Exibir dialog de conquistas
   */
  async displayAchievementsDialog(gameId, gameName, achievementsData) {
    const achievements = achievementsData.achievements || [];
    const earnedCount = achievementsData.earnedAchievements || 0;
    const totalCount = achievementsData.totalAchievements || 0;
    const percentage = achievementsData.completionPercentage || 0;
    const hasWarning = achievementsData.warning || achievementsData.warningType;
    const strategy = achievementsData.strategy || 'unknown';
    const hasUserProgress = achievementsData.hasUserProgress !== false;

    // Aguardar traduções necessárias
    const [
      earnedOnText,
      achievementsTitleText,
      limitedDataWarningText,
      progressText,
      ofText,
      conversionTitleText,
      globalProgressWarningText,
      legendaryText,
      epicText,
      rareText,
      commonText,
    ] = await Promise.all([
      this.app.modules.helpers.t('steam.achievements.earnedOn'),
      this.app.modules.helpers.t('steam.achievements.title'),
      this.app.modules.helpers.t('steam.achievements.limitedDataWarning'),
      this.app.modules.helpers.t('steam.achievements.progress'),
      this.app.modules.helpers.t('common.of'),
      this.app.modules.helpers.t('steam.conversion.title'),
      this.app.modules.helpers.t('steam.achievements.globalProgressWarning', '⚠️ Progresso baseado em dados globais'),
      this.app.modules.helpers.t('dashboard.trophies.legendary.name'),
      this.app.modules.helpers.t('dashboard.trophies.epic.name'),
      this.app.modules.helpers.t('dashboard.trophies.rare.name'),
      this.app.modules.helpers.t('dashboard.trophies.common.name'),
    ]);

    const achievementsList = achievements
      .map((achievement, index) => {
        const earnedClass = achievement.earned ? 'earned' : 'unearned';
        const earnedIcon = achievement.earned ? 'fas fa-check-circle' : 'far fa-circle';

        // Melhorar a verificação de earnedTime - pode ser timestamp em segundos ou milissegundos
        let earnedDate = '';
        if (achievement.earned && achievement.earnedTime && achievement.earnedTime > 0) {
          // Se o timestamp for muito pequeno, provavelmente está em segundos
          const timestamp =
            achievement.earnedTime < 1000000000000
              ? achievement.earnedTime * 1000
              : achievement.earnedTime;
          earnedDate = new Date(timestamp).toLocaleDateString('pt-BR');
        }

        // Adicionar informação de raridade se disponível
        let rarityInfo = '';
        if (achievement.globalPercent !== null && achievement.globalPercent !== undefined) {
          const rarity = achievement.globalPercent;
          let rarityClass = 'common';
          let rarityText = commonText;

          if (rarity < 1) {
            rarityClass = 'legendary';
            rarityText = legendaryText;
          } else if (rarity < 5) {
            rarityClass = 'epic';
            rarityText = epicText;
          } else if (rarity < 15) {
            rarityClass = 'rare';
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
            ${earnedDate ? `<div class="earned-date"><i class="fas fa-calendar-check"></i> ${earnedOnText}: ${earnedDate}</div>` : ''}
            ${rarityInfo}
          </div>
        </div>
      `;
      })
      .join('');

    // Obter HTML de troféu com traduções
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
          ${
            hasWarning
              ? `
            <div class="warning-message">
              <i class="fas fa-exclamation-triangle"></i>
              <span>${achievementsData.warning || limitedDataWarningText}</span>
            </div>
          `
              : ''
          }
          
          <div class="achievements-summary">
            <div class="summary-stats">
              <div class="stat-circle">
                <div class="circle-progress" style="--progress: ${percentage}%">
                  <span>${percentage}%</span>
                </div>
              </div>
              <div class="stat-details">
                <h4 data-i18n="steam.achievements.progress">${progressText}</h4>
                <p>${earnedCount} ${ofText} ${totalCount} ${achievementsTitleText || 'conquistas'}</p>
                ${!hasUserProgress ? `<small style="color: var(--text-secondary);" data-i18n="steam.achievements.globalProgressWarning">${globalProgressWarningText}</small>` : ''}
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

    // Implementar Virtual Scrolling se estiver ativo nas configurações
    this.setupVirtualScrolling(achievements);
  }

  /**
   * Configurar Virtual Scrolling para conquistas
   */
  async setupVirtualScrolling(achievements) {
    try {
      // Verificar se Virtual Scrolling está ativo nas configurações
      const settings = this.app.modules.state?.getState('settings') || {};
      const isVirtualScrollingEnabled = settings.virtualScrolling !== false;

    if (!isVirtualScrollingEnabled || achievements.length < 10) {
        // Não usar Virtual Scrolling se desabilitado ou poucos itens
        return;
      }

      const achievementsList = document.getElementById('achievementsList');
      if (!achievementsList || !window.VirtualScroller) {
        return;
      }

      // Limpar conteúdo atual
      achievementsList.innerHTML = '';

      // Obter traduções necessárias para itens
      const [
        earnedOnTextVS,
        legendaryTextVS,
        epicTextVS,
        rareTextVS,
        commonTextVS,
      ] = await Promise.all([
        this.app.modules.helpers.t('steam.achievements.earnedOn'),
        this.app.modules.helpers.t('dashboard.trophies.legendary.name'),
        this.app.modules.helpers.t('dashboard.trophies.epic.name'),
        this.app.modules.helpers.t('dashboard.trophies.rare.name'),
        this.app.modules.helpers.t('dashboard.trophies.common.name'),
      ]);

      // Configurar Virtual Scroller
      const virtualScroller = new window.VirtualScroller(achievementsList, {
        itemHeight: 120, // Altura do item de conquista
        bufferSize: 3, // Itens extras para buffer
        threshold: 50, // Limite para ativar
        renderItem: (achievement, index) => {
          const earnedClass = achievement.earned ? 'earned' : 'unearned';
          const earnedIcon = achievement.earned ? 'fas fa-check-circle' : 'far fa-circle';
          const earnedDate =
            achievement.earned && achievement.earnedTime
              ? new Date(achievement.earnedTime * 1000).toLocaleDateString('pt-BR')
              : '';

          // Adicionar informação de raridade se disponível
          let rarityInfo = '';
          if (achievement.globalPercent !== null && achievement.globalPercent !== undefined) {
            const rarity = achievement.globalPercent;
            let rarityClass = 'common';
            let rarityText = commonTextVS;

            if (rarity < 1) {
              rarityClass = 'legendary';
              rarityText = legendaryTextVS;
            } else if (rarity < 5) {
              rarityClass = 'epic';
              rarityText = epicTextVS;
            } else if (rarity < 15) {
              rarityClass = 'rare';
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
                ${earnedDate ? `<div class="earned-date"><i class="fas fa-calendar-check"></i> ${earnedOnTextVS}: ${earnedDate}</div>` : ''}
                ${rarityInfo}
              </div>
            </div>
          `;
        },
      });

      // Definir dados e renderizar
      virtualScroller.setData(achievements);

      // Armazenar referência para limpeza posterior
      this.currentVirtualScroller = virtualScroller;
    } catch (error) {
      // Silently handle error
    }
  }

  /**
   * Mostrar dialog genérico
   */
  showDialog(content) {
    // Remover dialog existente se houver
    this.closeDialog();

    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.innerHTML = content;

    // Fechar ao clicar no overlay
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        this.closeDialog();
      }
    });

    // Adicionar event listener para tecla ESC
    const handleEscKey = e => {
      if (e.key === 'Escape') {
        this.closeDialog();
      }
    };

    // Armazenar referência do event listener para poder removê-lo depois
    overlay.escKeyHandler = handleEscKey;
    document.addEventListener('keydown', handleEscKey);

    document.body.appendChild(overlay);

    // Aplicar i18n em conteúdo recém-inserido
    try {
      if (this.app && typeof this.app.translatePage === 'function') {
        this.app.translatePage();
      }
    } catch (e) {
      // silencioso: não bloquear o diálogo caso a tradução falhe
    }

    // Adicionar classe para animação
    setTimeout(() => {
      overlay.classList.add('show');
    }, 10);

    // Tornar closeDialog global para os botões
    window.closeDialog = () => this.closeDialog();
  }

  /**
   * Fechar dialog
   */
  closeDialog() {
    // Limpar Virtual Scroller se existir
    if (this.currentVirtualScroller) {
      this.currentVirtualScroller.destroy();
      this.currentVirtualScroller = null;
    }

    const overlay = document.querySelector('.dialog-overlay');
    if (overlay) {
      // Remover event listener da tecla ESC se existir
      if (overlay.escKeyHandler) {
        document.removeEventListener('keydown', overlay.escKeyHandler);
      }

      overlay.remove();
    }

    // Limpar função global
    if (window.closeDialog) {
      delete window.closeDialog;
    }
  }
}

// Disponibilizar globalmente

// Exportar a classe SteamGamesManager
export { SteamGamesManager };

// Disponibilizar globalmente para compatibilidade
window.SteamGamesManager = SteamGamesManager;
