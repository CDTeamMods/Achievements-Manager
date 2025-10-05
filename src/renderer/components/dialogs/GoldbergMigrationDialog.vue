<template>
  <div v-if="showDialog" class="goldberg-migration-overlay">
    <div class="goldberg-migration-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <div class="header-icon">
          <i class="fas fa-exchange-alt"></i>
        </div>
        <h2 class="dialog-title">{{ $t('goldberg.migration.title') }}</h2>
      </div>

      <!-- Content -->
      <div class="dialog-content">
        <div class="migration-info">
          <div class="info-icon">
            <i class="fas fa-info-circle"></i>
          </div>
          <div class="info-text">
            <p class="main-message">
              {{ $t('goldberg.migration.mainMessage') }}
            </p>
            <p class="sub-message">
              {{ $t('goldberg.migration.subMessage') }}
            </p>
          </div>
        </div>

        <!-- Games Found Info -->
        <div v-if="goldbergInfo && goldbergInfo.gamesCount > 0" class="games-info">
          <div class="games-count">
            <i class="fas fa-gamepad"></i>
            <span>{{ $t('goldberg.migration.gamesFound', { count: goldbergInfo.gamesCount }) }}</span>
          </div>
          
          <div class="games-list" v-if="showGamesList">
            <div v-for="game in goldbergInfo.games" :key="game.id" class="game-item">
              <div class="game-id">{{ game.id }}</div>
              <div class="game-files">
                <i class="fas fa-file"></i>
                {{ game.achievementFiles.length }} {{ $t('goldberg.migration.files') }}
              </div>
            </div>
          </div>
          
          <button 
            v-if="goldbergInfo.gamesCount > 3"
            @click="toggleGamesList" 
            class="toggle-games-btn"
          >
            {{ showGamesList ? $t('goldberg.migration.hideGames') : $t('goldberg.migration.showGames') }}
          </button>
        </div>

        <!-- Migration Benefits -->
        <div class="migration-benefits">
          <h3>{{ $t('goldberg.migration.benefits.title') }}</h3>
          <ul class="benefits-list">
            <li>
              <i class="fas fa-check"></i>
              {{ $t('goldberg.migration.benefits.compatibility') }}
            </li>
            <li>
              <i class="fas fa-check"></i>
              {{ $t('goldberg.migration.benefits.organization') }}
            </li>

            <li>
              <i class="fas fa-check"></i>
              {{ $t('goldberg.migration.benefits.sync') }}
            </li>
          </ul>
        </div>

        <!-- Warning -->
        <div class="migration-warning">
          <div class="warning-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <p>{{ $t('goldberg.migration.warning') }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="dialog-actions">
        <div class="action-buttons">
          <button 
            @click="handleReject" 
            class="btn btn-secondary"
            :disabled="isProcessing"
          >
            <i class="fas fa-times"></i>
            {{ $t('goldberg.migration.reject') }}
          </button>
          
          <button 
            @click="handleAccept" 
            class="btn btn-primary"
            :disabled="isProcessing"
          >
            <i v-if="!isProcessing" class="fas fa-check"></i>
            <i v-else class="fas fa-spinner fa-spin"></i>
            {{ isProcessing ? $t('goldberg.migration.processing') : $t('goldberg.migration.accept') }}
          </button>
        </div>
        
        <div class="remember-choice">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="rememberChoice"
              :disabled="isProcessing"
            >
            <span class="checkmark"></span>
            {{ $t('goldberg.migration.rememberChoice') }}
          </label>
        </div>
      </div>

      <!-- Progress -->
      <div v-if="isProcessing" class="migration-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="progress-text">{{ progressMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoldbergMigrationDialog',
  
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    goldbergInfo: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      showDialog: false,
      showGamesList: false,
      rememberChoice: true,
      isProcessing: false,
      progressPercentage: 0,
      progressMessage: ''
    };
  },

  watch: {
    visible: {
      immediate: true,
      handler(newVal) {
        this.showDialog = newVal;
      }
    }
  },

  methods: {
    /**
     * Aceita a migração
     */
    async handleAccept() {
      try {
        this.isProcessing = true;
        this.progressPercentage = 0;
        this.progressMessage = this.$t('goldberg.migration.progress.starting');

        // Atualizar configurações se necessário
        if (this.rememberChoice) {
          await this.updateMigrationSettings({
            autoMigration: true,
            showDialog: false
          });
          this.progressPercentage = 20;
          this.progressMessage = this.$t('goldberg.migration.progress.settings');
        }

        // Iniciar migração
        this.progressPercentage = 40;
        this.progressMessage = this.$t('goldberg.migration.progress.migrating');

        const result = await window.electronAPI.goldberg.migrateAll();

        if (result.success) {
          this.progressPercentage = 80;
          this.progressMessage = this.$t('goldberg.migration.progress.finalizing');

          // Aguardar um pouco para mostrar o progresso
          await new Promise(resolve => setTimeout(resolve, 1000));

          this.progressPercentage = 100;
          this.progressMessage = this.$t('goldberg.migration.progress.completed');

          // Emitir evento de sucesso
          this.$emit('migration-completed', {
            success: true,
            result: result,
            autoMigration: this.rememberChoice
          });

          // Fechar diálogo após um tempo
          setTimeout(() => {
            this.closeDialog();
          }, 2000);

          // Mostrar notificação de sucesso
          this.$toast.success(
            this.$t('goldberg.migration.success.message', { 
              count: result.successCount,
              total: result.totalGames 
            })
          );

        } else {
          throw new Error(result.error || 'Migration failed');
        }

      } catch (error) {
        // console.error('❌ Erro na migração:', error); // Removido para evitar dependência circular com DebugManager
        
        this.progressMessage = this.$t('goldberg.migration.progress.error');
        
        // Reportar erro
        if (window.electronAPI.crashReport) {
          // Sanitizar o erro para evitar problemas de clonagem
          const sanitizedError = {
            message: error?.message || 'Unknown error',
            stack: error?.stack || 'No stack trace',
            name: error?.name || 'Error'
          };
          window.electronAPI.crashReport.reportError('GoldbergMigrationDialog.handleAccept', sanitizedError);
        }

        // Emitir evento de erro
        this.$emit('migration-error', {
          error: error.message,
          autoMigration: false
        });

        // Mostrar notificação de erro
        this.$toast.error(this.$t('goldberg.migration.error.message'));

        // Fechar diálogo
        setTimeout(() => {
          this.closeDialog();
        }, 3000);

      } finally {
        this.isProcessing = false;
      }
    },

    /**
     * Rejeita a migração
     */
    async handleReject() {
      try {
        // Atualizar configurações se necessário
        if (this.rememberChoice) {
          await this.updateMigrationSettings({
            autoMigration: false,
            showDialog: false
          });
        }

        // Emitir evento de rejeição
        this.$emit('migration-rejected', {
          rememberChoice: this.rememberChoice
        });

        // Mostrar notificação
        this.$toast.info(this.$t('goldberg.migration.rejected.message'));

        this.closeDialog();

      } catch (error) {
        // console.error('❌ Erro ao rejeitar migração:', error); // Removido para evitar dependência circular com DebugManager
        
        if (window.electronAPI.crashReport) {
          // Sanitizar o erro para evitar problemas de clonagem
          const sanitizedError = {
            message: error?.message || 'Unknown error',
            stack: error?.stack || 'No stack trace',
            name: error?.name || 'Error'
          };
          window.electronAPI.crashReport.reportError('GoldbergMigrationDialog.handleReject', sanitizedError);
        }
      }
    },

    /**
     * Atualiza configurações de migração
     */
    async updateMigrationSettings(settings) {
      try {
        const result = await window.electronAPI.goldberg.updateSettings(settings);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        console.log('⚙️ Configurações de migração atualizadas:', settings);
        
      } catch (error) {
        // console.error('❌ Erro ao atualizar configurações:', error); // Removido para evitar dependência circular com DebugManager
        throw error;
      }
    },

    /**
     * Alterna exibição da lista de jogos
     */
    toggleGamesList() {
      this.showGamesList = !this.showGamesList;
    },

    /**
     * Fecha o diálogo
     */
    closeDialog() {
      this.showDialog = false;
      this.$emit('close');
    },

    /**
     * Manipula tecla ESC
     */
    handleKeydown(event) {
      if (event.key === 'Escape' && !this.isProcessing) {
        this.closeDialog();
      }
    }
  },

  mounted() {
    // Adicionar listener para ESC
    document.addEventListener('keydown', this.handleKeydown);
  },

  beforeUnmount() {
    // Remover listener
    document.removeEventListener('keydown', this.handleKeydown);
  }
};
</script>

<style scoped>
.goldberg-migration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.goldberg-migration-dialog {
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border-color);
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-color);
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.dialog-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 600;
}

.dialog-content {
  padding: 24px;
}

.migration-info {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.info-icon {
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 18px;
  flex-shrink: 0;
}

.info-text {
  flex: 1;
}

.main-message {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
}

.sub-message {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
}

.games-info {
  background: var(--bg-tertiary);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid var(--border-color);
}

.games-count {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 12px;
}

.games-count i {
  color: #10b981;
}

.games-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 12px;
}

.game-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
  margin-bottom: 4px;
  border: 1px solid var(--border-color);
}

.game-id {
  font-family: 'Courier New', monospace;
  color: var(--text-primary);
  font-weight: 500;
}

.game-files {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.toggle-games-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.toggle-games-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.migration-benefits {
  margin-bottom: 24px;
}

.migration-benefits h3 {
  margin: 0 0 12px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefits-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.benefits-list i {
  color: #10b981;
  font-size: 12px;
}

.migration-warning {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(245, 158, 11, 0.2);
  margin-bottom: 24px;
}

.warning-icon {
  color: #f59e0b;
  font-size: 18px;
  flex-shrink: 0;
}

.migration-warning p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
}

.dialog-actions {
  padding: 0 24px 24px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.btn {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.remember-choice {
  display: flex;
  justify-content: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.migration-progress {
  padding: 0 24px 24px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.progress-text {
  margin: 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

/* Scrollbar customization */
.goldberg-migration-dialog::-webkit-scrollbar,
.games-list::-webkit-scrollbar {
  width: 6px;
}

.goldberg-migration-dialog::-webkit-scrollbar-track,
.games-list::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

.goldberg-migration-dialog::-webkit-scrollbar-thumb,
.games-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.goldberg-migration-dialog::-webkit-scrollbar-thumb:hover,
.games-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* Animations */
.goldberg-migration-overlay {
  animation: fadeIn 0.3s ease;
}

.goldberg-migration-dialog {
  animation: slideIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .goldberg-migration-dialog {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  }
}
</style>