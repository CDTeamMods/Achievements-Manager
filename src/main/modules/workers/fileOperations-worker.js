/**
 * 📁 File Operations Worker
 * Worker sandboxed para operações de arquivo seguras
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class FileOperationsWorker {
  constructor() {
    this.allowedPaths = [];
    this.config = null;
    this.processId = null;
    
    this.setupWorker();
  }

  /**
   * Configura o worker
   */
  setupWorker() {
    // Escutar mensagens do processo principal
    process.on('message', (message) => {
      this.handleMessage(message);
    });

    // Reportar que o worker está pronto
    this.sendMessage({
      type: 'ready',
      data: { processId: process.pid }
    });

    // Monitorar recursos
    setInterval(() => {
      this.reportResourceUsage();
    }, 5000);
  }

  /**
   * Manipula mensagens recebidas
   */
  async handleMessage(message) {
    try {
      const { type, data, id } = message;

      switch (type) {
        case 'init':
          await this.initialize(data);
          this.sendResponse(id, { success: true });
          break;

        case 'readFile':
          const content = await this.readFile(data.filePath);
          this.sendResponse(id, { content });
          break;

        case 'writeFile':
          await this.writeFile(data.filePath, data.content);
          this.sendResponse(id, { success: true });
          break;

        case 'deleteFile':
          await this.deleteFile(data.filePath);
          this.sendResponse(id, { success: true });
          break;

        case 'listDirectory':
          const files = await this.listDirectory(data.dirPath);
          this.sendResponse(id, { files });
          break;

        case 'createDirectory':
          await this.createDirectory(data.dirPath);
          this.sendResponse(id, { success: true });
          break;

        case 'copyFile':
          await this.copyFile(data.sourcePath, data.destPath);
          this.sendResponse(id, { success: true });
          break;

        case 'moveFile':
          await this.moveFile(data.sourcePath, data.destPath);
          this.sendResponse(id, { success: true });
          break;

        case 'getFileStats':
          const stats = await this.getFileStats(data.filePath);
          this.sendResponse(id, { stats });
          break;

        case 'validateFileIntegrity':
          const integrity = await this.validateFileIntegrity(data.filePath);
          this.sendResponse(id, { integrity });
          break;

        default:
          throw new Error(`Tipo de mensagem não suportado: ${type}`);
      }
    } catch (error) {
      this.sendError(message.id, error.message);
    }
  }

  /**
   * Inicializa o worker com configurações
   */
  async initialize(config) {
    this.config = config.config;
    this.processId = config.processId;
    this.allowedPaths = this.config.allowedPaths || [];

    console.log(`📁 Worker de arquivos inicializado: ${this.processId}`);
  }

  /**
   * Valida se um caminho é permitido
   */
  validatePath(filePath) {
    const normalizedPath = path.normalize(filePath);
    
    const isAllowed = this.allowedPaths.some(allowedPath => {
      const normalizedAllowed = path.normalize(allowedPath);
      return normalizedPath.startsWith(normalizedAllowed);
    });

    if (!isAllowed) {
      throw new Error(`Caminho não permitido: ${filePath}`);
    }

    return normalizedPath;
  }

  /**
   * Lê um arquivo
   */
  async readFile(filePath) {
    const validPath = this.validatePath(filePath);
    
    try {
      const content = await fs.readFile(validPath, 'utf8');
      return content;
    } catch (error) {
      throw new Error(`Erro ao ler arquivo: ${error.message}`);
    }
  }

  /**
   * Escreve um arquivo
   */
  async writeFile(filePath, content) {
    const validPath = this.validatePath(filePath);
    
    try {
      // Criar diretório se não existir
      const dir = path.dirname(validPath);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(validPath, content, 'utf8');
    } catch (error) {
      throw new Error(`Erro ao escrever arquivo: ${error.message}`);
    }
  }

  /**
   * Deleta um arquivo
   */
  async deleteFile(filePath) {
    const validPath = this.validatePath(filePath);
    
    try {
      await fs.unlink(validPath);
    } catch (error) {
      throw new Error(`Erro ao deletar arquivo: ${error.message}`);
    }
  }

  /**
   * Lista arquivos de um diretório
   */
  async listDirectory(dirPath) {
    const validPath = this.validatePath(dirPath);
    
    try {
      const entries = await fs.readdir(validPath, { withFileTypes: true });
      
      return entries.map(entry => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        isFile: entry.isFile(),
        path: path.join(validPath, entry.name)
      }));
    } catch (error) {
      throw new Error(`Erro ao listar diretório: ${error.message}`);
    }
  }

  /**
   * Cria um diretório
   */
  async createDirectory(dirPath) {
    const validPath = this.validatePath(dirPath);
    
    try {
      await fs.mkdir(validPath, { recursive: true });
    } catch (error) {
      throw new Error(`Erro ao criar diretório: ${error.message}`);
    }
  }

  /**
   * Copia um arquivo
   */
  async copyFile(sourcePath, destPath) {
    const validSourcePath = this.validatePath(sourcePath);
    const validDestPath = this.validatePath(destPath);
    
    try {
      // Criar diretório de destino se não existir
      const destDir = path.dirname(validDestPath);
      await fs.mkdir(destDir, { recursive: true });
      
      await fs.copyFile(validSourcePath, validDestPath);
    } catch (error) {
      throw new Error(`Erro ao copiar arquivo: ${error.message}`);
    }
  }

  /**
   * Move um arquivo
   */
  async moveFile(sourcePath, destPath) {
    const validSourcePath = this.validatePath(sourcePath);
    const validDestPath = this.validatePath(destPath);
    
    try {
      // Criar diretório de destino se não existir
      const destDir = path.dirname(validDestPath);
      await fs.mkdir(destDir, { recursive: true });
      
      await fs.rename(validSourcePath, validDestPath);
    } catch (error) {
      throw new Error(`Erro ao mover arquivo: ${error.message}`);
    }
  }

  /**
   * Obtém estatísticas de um arquivo
   */
  async getFileStats(filePath) {
    const validPath = this.validatePath(filePath);
    
    try {
      const stats = await fs.stat(validPath);
      
      return {
        size: stats.size,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        accessedAt: stats.atime
      };
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
  }

  /**
   * Valida integridade de um arquivo
   */
  async validateFileIntegrity(filePath) {
    const validPath = this.validatePath(filePath);
    
    try {
      const content = await fs.readFile(validPath);
      const hash = crypto.createHash('sha256').update(content).digest('hex');
      
      return {
        valid: true,
        hash,
        size: content.length
      };
    } catch (error) {
      throw new Error(`Erro na validação de integridade: ${error.message}`);
    }
  }

  /**
   * Reporta uso de recursos
   */
  reportResourceUsage() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    this.sendMessage({
      type: 'resource-usage',
      data: {
        memory: memoryUsage.heapUsed,
        cpu: (cpuUsage.user + cpuUsage.system) / 1000000, // Converter para ms
        pid: process.pid
      }
    });
  }

  /**
   * Envia mensagem para o processo principal
   */
  sendMessage(message) {
    process.send({
      ...message,
      timestamp: Date.now(),
      workerId: this.processId
    });
  }

  /**
   * Envia resposta para uma mensagem específica
   */
  sendResponse(messageId, data) {
    this.sendMessage({
      type: 'response',
      id: messageId,
      data
    });
  }

  /**
   * Envia erro para uma mensagem específica
   */
  sendError(messageId, errorMessage) {
    this.sendMessage({
      type: 'error',
      id: messageId,
      data: errorMessage
    });
  }
}

// Inicializar worker
new FileOperationsWorker();

// Manipular finalização graceful
process.on('SIGTERM', () => {
  console.log('📁 Worker de arquivos finalizando...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📁 Worker de arquivos interrompido...');
  process.exit(0);
});