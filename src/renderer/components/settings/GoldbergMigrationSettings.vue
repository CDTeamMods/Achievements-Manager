<template>
  <div class="goldberg-migration-settings">
    <!-- Header -->
    <div class="settings-header">
      <div class="header-icon">
        <i class="fas fa-exchange-alt"></i>
      </div>
      <div class="header-content">
        <h3 class="settings-title">{{ $t('goldberg.migration.settings.title') }}</h3>
        <p class="settings-description">{{ $t('goldberg.migration.settings.description') }}</p>
      </div>
    </div>

    <!-- Status Card -->
    <div class="status-card">
      <div class="status-header">
        <div class="status-icon" :class="statusIconClass">
          <i :class="statusIcon"></i>
        </div>
        <div class="status-info">
          <h4 class="status-title">{{ statusTitle }}</h4>
          <p class="status-description">{{ statusDescription }}</p>
        </div>
      </div>
      
      <div v-if="goldbergStatus.goldbergExists" class="status-details">
        <div class="detail-item">
          <span class="detail-label">{{ $t('goldberg.migration.gamesFound') }}</span>
          <span class="detail-value">{{ goldbergStatus.gamesCount }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ $t('goldberg.migration.user') }}:</span>
          <span class="detail-value">{{ goldbergStatus.currentUser }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ $t('goldberg.migration.path') }}:</span>
          <span class="detail-value path-value">{{ goldbergStatus.goldbergPath }}</span>
        </div>
      </div>
    </div>

    <!-- Settings Options -->
    <div class="settings-options">
      <!-- Auto Migration -->
      <div class="setting-item">
        <div class="setting-header">
          <div class="setting-icon">
            <i class="fas fa-sync-alt"></i>
          </div>
          <div class="setting-content">
            <h4 class="setting-title">{{ $t('goldberg.migration.settings.autoMigration') }}</h4>
            <p class="setting-description">{{ $t('goldberg.migration.settings.autoMigration.description') }}</p>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settings.autoMigration"
                @change="updateSettings"
                :disabled="isLoading"
              >
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Show Dialog -->
      <div class="setting-item">
        <div class="setting-header">
          <div class="setting-icon">
            <i class="fas fa-comment-dots"></i>
          </div>
          <div class="setting-content">
            <h4 class="setting-title">{{ $t('goldberg.migration.settings.showDialog') }}</h4>
            <p class="setting-description">{{ $t('goldberg.migration.settings.showDialog.description') }}</p>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settings.showDialog"
                @change="updateSettings"
                :disabled="isLoading"
              >
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Last Check -->
      <div v-if="settings.lastCheck" class="setting-item info-item">
        <div class="setting-header">
          <div class="setting-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="setting-content">
            <h4 class="setting-title">{{ $t('goldberg.migration.settings.lastCheck') }}</h4>
            <p class="setting-description">{{ formatLastCheck }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="settings-actions">
      <!-- Manual Migration -->
      <div class="action-card">
        <div class="action-header">
          <div class="action-icon">
            <i class="fas fa-play"></i>
          </div>
          <div class="action-content">
            <h4 class="action-title">{{ $t('goldberg.migration.settings.manualMigration') }}</h4>
            <p class="action-description">{{ $t('goldberg.migration.settings.manualMigration.description') }}</p>
          </div>
        </div>
        <div class="action-buttons">
          <button 
            @click="checkNow" 
            class="btn btn-primary"
            :disabled="isLoading || isChecking"
          >
            <i v-if="!isChecking" class="fas fa-search"></i>
            <i v-else class="fas fa-spinner fa-spin"></i>
            {{ $t('goldberg.migration.settings.checkNow') }}
          </button>
        </div>
      </div>

      <!-- Reset Settings -->
      <div class="action-card">
        <div class="action-header">
          <div class="action-icon warning">
            <i class="fas fa-undo"></i>
          </div>
          <div class="action-content">
            <h4 class="action-title">{{ $t('goldberg.migration.settings.resetSettings') }}</h4>
            <p class="action-description">{{ $t('goldberg.migration.settings.resetSettings.description') }}</p>
          </div>
        </div>
        <div class="action-buttons">
          <button 
            @click="resetSettings" 
            class="btn btn-warning"
            :disabled="isLoading"
          >
            <i class="fas fa-undo"></i>
            {{ $t('goldberg.migration.settings.resetSettings') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Migration Dialog -->
    <GoldbergMigrationDialog
      :visible="showMigrationDialog"
      :goldberg-info="migrationDialogData"
      @close="showMigrationDialog = false"
      @migration-completed="handleMigrationCompleted"
      @migration-rejected="handleMigrationRejected"
      @migration-error="handleMigrationError"
    />
  </div>
</template>

<script>
import GoldbergMigrationDialog from '../dialogs/GoldbergMigrationDialog.vue';

export default {
  name: 'GoldbergMigrationSettings',
  
  components: {
    GoldbergMigrationDialog
  },

  data() {
    return {
      isLoading: false,
      isChecking: false,
      showMigrationDialog: false,
      migrationDialogData: null,
      settings: {
        autoMigration: false,
        showDialog: true,
        lastCheck: null
      },
      goldbergStatus: {
        initialized: false,
        currentUser: '',
        goldbergPath: '',
        gseSavesPath: '',
        goldbergExists: false,
        gamesCount: 0
      }
    };
  },

  computed: {
    /**
     * Classe do ícone de status
     */
    statusIconClass() {
      if (!this.goldbergStatus.goldbergExists) {
        return 'status-not-found';
      }
      
      if (this.goldbergStatus.gamesCount === 0) {
        return 'status-empty';
      }
      
      return 'status-found';
    },

    /**
     * Ícone de status
     */
    statusIcon() {
      if (!this.goldbergStatus.goldbergExists) {
        return 'fas fa-times-circle';
      }
      
      if (this.goldbergStatus.gamesCount === 0) {
        return 'fas fa-exclamation-circle';
      }
      
      return 'fas fa-check-circle';
    },

    /**
     * Título do status
     */
    statusTitle() {
      if (!this.goldbergStatus.goldbergExists) {
        return 'Pasta Goldberg não encontrada';
      }
      
      if (this.goldbergStatus.gamesCount === 0) {
        return 'Pasta Goldberg vazia';
      }
      
      return `${this.goldbergStatus.gamesCount} jogo(s) encontrado(s)`;
    },

    /**
     * Descrição do status
     */
    statusDescription() {
      if (!this.goldbergStatus.goldbergExists) {
        return 'A pasta Goldberg SteamEmu Saves não foi encontrada no sistema.';
      }
      
      if (this.goldbergStatus.gamesCount === 0) {
        return 'A pasta Goldberg existe mas não contém jogos para migrar.';
      }
      
      return 'Jogos disponíveis para migração encontrados.';
    },

    /**
     * Formatação da última verificação
     */
    formatLastCheck() {
      if (!this.settings.lastCheck) {
        return 'Nunca';
      }
      
      try {
        const date = new Date(this.settings.lastCheck);
        return date.toLocaleString('pt-BR');
      } catch (error) {
        return 'Data inválida';
      }
    }
  },

  async mounted() {
    await this.loadData();
  },

  methods: {
    /**
     * Carrega dados iniciais
     */
    async loadData() {
      try {
        this.isLoading = true;
        
        // Carregar configurações
        await this.loadSettings();
        
        // Carregar status do Goldberg
        await this.loadGoldbergStatus();
        
      } catch (error) {
        // console.error('❌ Erro ao carregar dados:', error); // Removido para evitar dependência circular com DebugManager
        
        if (window.electronAPI.crashReport) {
          // Sanitizar o erro para evitar problemas de clonagem
          const sanitizedError = {
            message: error?.message || 'Unknown error',
            stack: error?.stack || 'No stack trace',
            name: error?.name || 'Error'
          };
          window.electronAPI.crashReport.reportError('GoldbergMigrationSettings.loadData', sanitizedError);
        }
        
        this.$toast.error('Erro ao carregar configurações de migração');
        
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Carrega configurações de migração
     */
    async loadSettings() {
      try {
        const result = await window.electronAPI.goldberg.getSettings();
        
        if (result) {
          this.settings = { ...this.settings, ...result };
        }
        
        console.log('⚙️ Configurações carregadas:', this.settings);
        
      } catch (error) {
        // console.error('❌ Erro ao carregar configurações:', error); // Removido para evitar dependência circular com DebugManager
        throw error;
      }
    },

    /**
     * Carrega status do Goldberg
     */
    async loadGoldbergStatus() {
      try {
        const status = await window.electronAPI.goldberg.getStatus();
        
        if (status) {
          this.goldbergStatus = { ...this.goldbergStatus, ...status };
        }
        
        console.log('📊 Status do Goldberg:', this.goldbergStatus);
        
      } catch (error) {
        // console.error('❌ Erro ao carregar status do Goldberg:', error); // Removido para evitar dependência circular com DebugManager
        throw error;
      }
    },

    /**
     * Atualiza configurações
     */
    async updateSettings() {
      try {
        this.isLoading = true;
        
        // Sanitizar configurações antes de enviar via IPC
        const sanitizedSettings = window.IPCSanitizer 
          ? window.IPCSanitizer.sanitize(this.settings) 
          : (() => { try { return structuredClone(this.settings); } catch { return { ...this.settings }; } })();
        const result = await window.electronAPI.goldberg.updateSettings(sanitizedSettings);
        
        if (result.success) {
          this.$toast.success('Configurações salvas com sucesso!');
          console.log('✅ Configurações atualizadas:', this.settings);
        } else {
          throw new Error(result.error);
        }
        
      } catch (error) {
        // console.error('❌ Erro ao atualizar configurações:', error); // Removido para evitar dependência circular com DebugManager
        
        if (window.electronAPI.crashReport) {
          // Sanitizar o erro para evitar problemas de clonagem
          const sanitizedError = {
            message: error?.message || 'Unknown error',
            stack: error?.stack || 'No stack trace',
            name: error?.name || 'Error'
          };
          window.electronAPI.crashReport.reportError('GoldbergMigrationSettings.updateSettings', sanitizedError);
        }
        
        this.$toast.error('Erro ao salvar configurações');
        
        // Recarregar configurações
        await this.loadSettings();
        
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Verifica agora por jogos do Goldberg
     */
    async checkNow() {
      try {
        this.isChecking = true;
        
        // Verificar pasta Goldberg
        const goldbergInfo = await window.electronAPI.goldberg.checkFolder();
        
        console.log('🔍 Verificação manual:', goldbergInfo);
        
        // Atualizar última verificação
        this.settings.lastCheck = new Date().toISOString();
        await this.updateSettings();
        
        // Atualizar status
        await this.loadGoldbergStatus();
        
        if (goldbergInfo.exists && goldbergInfo.gamesCount > 0) {
          // Mostrar diálogo de migração se necessário
          if (this.settings.showDialog) {
            this.migrationDialogData = goldbergInfo;
            this.showMigrationDialog = true;
          } else if (this.settings.autoMigration) {
            // Migrar automaticamente
            await this.performMigration();
          } else {
            this.$toast.info(`${goldbergInfo.gamesCount} jogo(s) encontrado(s). Configure a migração automática para processar.`);
          }
        } else {
          this.$toast.info('Nenhum jogo encontrado na pasta Goldberg SteamEmu Saves');
        }
        
      } catch (error) {
        // console.error('❌ Erro na verificação manual:', error); // Removido para evitar dependência circular com DebugManager
        
        if (window.electronAPI.crashReport) {
          // Sanitizar o erro para evitar problemas de clonagem
          const sanitizedError = {
            message: error?.message || 'Unknown error',
            stack: error?.stack || 'No stack trace',
            name: error?.name || 'Error'
          };
          window.electronAPI.crashReport.reportError('GoldbergMigrationSettings.checkNow', sanitizedError);
        }
        
        this.$toast.error('Erro durante a verificação');
        
      } finally {
        this.isChecking = false;
      }
    },

    /**
     * Executa migração automática
     */
    async performMigration() {
      try {
        const result = await window.electronAPI.goldberg.migrateAll();
        
        if (result.success) {
          this.$toast.success(`${result.successCount} de ${result.totalGames} jogos migrados com sucesso!`);
          
          // Atualizar status
          await this.loadGoldbergStatus();
        } else {
          throw new Error(result.error);
        }
        
      } catch (error) {
        console.error('❌ Erro na migração automática:', error);
        this.$toast.error('Erro durante a migração automática');
      }
    },

    /**
     * Reseta configurações para padrão
     */
    async resetSettings() {
      try {
        const confirmed = await this.$confirm(
          'Tem certeza que deseja restaurar as configurações padrão?',
          'Confirmar Reset',
          {
            confirmButtonText: 'Sim, Restaurar',
            cancelButtonText: 'Cancelar',
            type: 'warning'
          }
        );
        
        if (confirmed) {
          this.settings = {
            autoMigration: false,
            showDialog: true,
            lastCheck: null
          };
          
          await this.updateSettings();
          
          this.$toast.success('Configurações restauradas para o padrão');
        }
        
      } catch (error) {
        if (error !== 'cancel') {
          // console.error('❌ Erro ao resetar configurações:', error); // Removido para evitar dependência circular com DebugManager
          this.$toast.error('Erro ao restaurar configurações');
        }
      }
    },

    /**
     * Manipula conclusão da migração
     */
    async handleMigrationCompleted(data) {
      console.log('✅ Migração concluída:', data);
      
      this.showMigrationDialog = false;
      
      // Atualizar configurações se necessário
      if (data.autoMigration !== undefined) {
        this.settings.autoMigration = data.autoMigration;
        this.settings.showDialog = false;
        await this.updateSettings();
      }
      
      // Atualizar status
      await this.loadGoldbergStatus();
    },

    /**
     * Manipula rejeição da migração
     */
    async handleMigrationRejected(data) {
      console.log('❌ Migração rejeitada:', data);
      
      this.showMigrationDialog = false;
      
      // Atualizar configurações se necessário
      if (data.rememberChoice) {
        this.settings.autoMigration = false;
        this.settings.showDialog = false;
        await this.updateSettings();
      }
    },

    /**
     * Manipula erro na migração
     */
    handleMigrationError(data) {
      console.error('❌ Erro na migração:', data);
      this.showMigrationDialog = false;
    }
  }
};
</script>

<style scoped>
.goldberg-migration-settings {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 16px;
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

.header-content {
  flex: 1;
}

.settings-title {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 600;
}

.settings-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
}

.status-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid var(--border-color);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.status-icon.status-found {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-icon.status-not-found {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-icon.status-empty {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-info {
  flex: 1;
}

.status-title {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.status-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.status-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border-radius: 6px;
}

.detail-label {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
}

.detail-value {
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 600;
}

.path-value {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-options {
  margin-bottom: 32px;
}

.setting-item {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
}

.setting-item.info-item {
  background: var(--bg-tertiary);
}

.setting-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.setting-icon {
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 16px;
  flex-shrink: 0;
}

.setting-content {
  flex: 1;
}

.setting-title {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.setting-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
}

.setting-control {
  flex-shrink: 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-tertiary);
  transition: 0.3s;
  border-radius: 24px;
  border: 1px solid var(--border-color);
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.settings-actions {
  display: grid;
  gap: 16px;
}

.action-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-header {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.action-icon {
  width: 40px;
  height: 40px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  font-size: 16px;
  flex-shrink: 0;
}

.action-icon.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.action-content {
  flex: 1;
}

.action-title {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.action-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
}

.action-buttons {
  flex-shrink: 0;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .goldberg-migration-settings {
    padding: 16px;
  }
  
  .settings-header {
    flex-direction: column;
    align-items: flex-start;
    text-align: center;
  }
  
  .status-details {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-header {
    margin-bottom: 16px;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .toggle-slider:before {
    background-color: #f3f4f6;
  }
}
</style>