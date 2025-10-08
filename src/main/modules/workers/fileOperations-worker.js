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
var __name222222 = /* @__PURE__ */ __name22222(
  (target, value) => __defProp222222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp2222222 = Object.defineProperty;
var __name2222222 = /* @__PURE__ */ __name222222(
  (target, value) => __defProp2222222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp22222222 = Object.defineProperty;
var __name22222222 = /* @__PURE__ */ __name2222222(
  (target, value) => __defProp22222222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp222222222 = Object.defineProperty;
var __name222222222 = /* @__PURE__ */ __name22222222(
  (target, value) => __defProp222222222(target, "name", { value, configurable: true }),
  "__name"
);
var __defProp2222222222 = Object.defineProperty;
var __name2222222222 = /* @__PURE__ */ __name222222222(
  (target, value) => __defProp2222222222(target, "name", { value, configurable: true }),
  "__name"
);
const fs = require("node:fs").promises;
const path = require("node:path");
const crypto = require("crypto");
class FileOperationsWorker {
  static {
    __name(this, "FileOperationsWorker");
  }
  static {
    __name2(this, "FileOperationsWorker");
  }
  static {
    __name22(this, "FileOperationsWorker");
  }
  static {
    __name222(this, "FileOperationsWorker");
  }
  static {
    __name2222(this, "FileOperationsWorker");
  }
  static {
    __name22222(this, "FileOperationsWorker");
  }
  static {
    __name222222(this, "FileOperationsWorker");
  }
  static {
    __name2222222(this, "FileOperationsWorker");
  }
  static {
    __name22222222(this, "FileOperationsWorker");
  }
  static {
    __name222222222(this, "FileOperationsWorker");
  }
  static {
    __name2222222222(this, "FileOperationsWorker");
  }
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
    process.on("message", (message) => {
      this.handleMessage(message);
    });
    this.sendMessage({
      type: "ready",
      data: { processId: process.pid }
    });
    setInterval(() => {
      this.reportResourceUsage();
    }, 5e3);
  }
  /**
   * Manipula mensagens recebidas
   */
  async handleMessage(message) {
    try {
      const { type, data, id } = message;
      switch (type) {
        case "init":
          await this.initialize(data);
          this.sendResponse(id, { success: true });
          break;
        case "readFile": {
          const content = await this.readFile(data.filePath);
          this.sendResponse(id, { content });
          break;
        }
        case "writeFile":
          await this.writeFile(data.filePath, data.content);
          this.sendResponse(id, { success: true });
          break;
        case "deleteFile":
          await this.deleteFile(data.filePath);
          this.sendResponse(id, { success: true });
          break;
        case "listDirectory": {
          const files = await this.listDirectory(data.dirPath);
          this.sendResponse(id, { files });
          break;
        }
        case "createDirectory":
          await this.createDirectory(data.dirPath);
          this.sendResponse(id, { success: true });
          break;
        case "copyFile":
          await this.copyFile(data.sourcePath, data.destPath);
          this.sendResponse(id, { success: true });
          break;
        case "moveFile":
          await this.moveFile(data.sourcePath, data.destPath);
          this.sendResponse(id, { success: true });
          break;
        case "getFileStats": {
          const stats = await this.getFileStats(data.filePath);
          this.sendResponse(id, { stats });
          break;
        }
        case "validateFileIntegrity": {
          const integrity = await this.validateFileIntegrity(data.filePath);
          this.sendResponse(id, { integrity });
          break;
        }
        default:
          throw new Error(`Tipo de mensagem n\xE3o suportado: ${type}`);
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
  }
  /**
   * Valida se um caminho é permitido
   */
  validatePath(filePath) {
    const normalizedPath = path.normalize(filePath);
    const isAllowed = this.allowedPaths.some((allowedPath) => {
      const normalizedAllowed = path.normalize(allowedPath);
      return normalizedPath.startsWith(normalizedAllowed);
    });
    if (!isAllowed) {
      throw new Error(`Caminho n\xE3o permitido: ${filePath}`);
    }
    return normalizedPath;
  }
  /**
   * Lê um arquivo
   */
  async readFile(filePath) {
    const validPath = this.validatePath(filePath);
    try {
      const content = await fs.readFile(validPath, "utf8");
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
      const dir = path.dirname(validPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(validPath, content, "utf8");
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
      return entries.map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        isFile: entry.isFile(),
        path: path.join(validPath, entry.name)
      }));
    } catch (error) {
      throw new Error(`Erro ao listar diret\xF3rio: ${error.message}`);
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
      throw new Error(`Erro ao criar diret\xF3rio: ${error.message}`);
    }
  }
  /**
   * Copia um arquivo
   */
  async copyFile(sourcePath, destPath) {
    const validSourcePath = this.validatePath(sourcePath);
    const validDestPath = this.validatePath(destPath);
    try {
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
      throw new Error(`Erro ao obter estat\xEDsticas: ${error.message}`);
    }
  }
  /**
   * Valida integridade de um arquivo
   */
  async validateFileIntegrity(filePath) {
    const validPath = this.validatePath(filePath);
    try {
      const content = await fs.readFile(validPath);
      const hash = crypto.createHash("sha256").update(content).digest("hex");
      return {
        valid: true,
        hash,
        size: content.length
      };
    } catch (error) {
      throw new Error(`Erro na valida\xE7\xE3o de integridade: ${error.message}`);
    }
  }
  /**
   * Reporta uso de recursos
   */
  reportResourceUsage() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    this.sendMessage({
      type: "resource-usage",
      data: {
        memory: memoryUsage.heapUsed,
        cpu: (cpuUsage.user + cpuUsage.system) / 1e6,
        // Converter para ms
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
      type: "response",
      id: messageId,
      data
    });
  }
  /**
   * Envia erro para uma mensagem específica
   */
  sendError(messageId, errorMessage) {
    this.sendMessage({
      type: "error",
      id: messageId,
      data: errorMessage
    });
  }
}
new FileOperationsWorker();
process.on("SIGTERM", () => {
  process.exit(0);
});
process.on("SIGINT", () => {
  process.exit(0);
});
