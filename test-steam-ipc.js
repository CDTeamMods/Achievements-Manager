const path = require('path');
const fs = require('fs');

// Simular ambiente Electron
process.env.NODE_ENV = 'development';

// Mock do app Electron
const mockApp = {
  isPackaged: false,
  getPath: (name) => {
    if (name === 'userData') {
      return 'D:\\Projetos\\Achievements-Manager';
    }
    return '';
  }
};

// Mock do ipcMain
const mockIpcMain = {
  handle: (channel, handler) => {
    console.log(`📡 IPC handler registrado: ${channel}`);
  }
};

// Mock do electron module
const electronMock = {
  app: mockApp,
  ipcMain: mockIpcMain
};

// Substituir require do electron
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === 'electron') {
    return electronMock;
  }
  return originalRequire.apply(this, arguments);
};

// Importar módulos necessários
const { PathManager } = require('./src/main/modules/path-manager');
const { SteamIntegrationManager } = require('./src/main/modules/steam-integration');

// Mock do DebugManager
class MockDebugManager {
  log(message) { console.log(`[DEBUG] ${message}`); }
  error(message) { console.error(`[ERROR] ${message}`); }
  warn(message) { console.warn(`[WARN] ${message}`); }
}

async function testSteamIPC() {
  try {
    console.log('🧪 Testando SteamIntegrationManager diretamente...\n');

    // Configurar PathManager
    const pathManager = new PathManager();
    await pathManager.initialize();
    console.log('✅ PathManager configurado');
    console.log(`   Cache Path: ${pathManager.getCachePath()}`);

    // Configurar DebugManager mock
    const debugManager = new MockDebugManager();
    console.log('✅ DebugManager mock configurado');

    // Criar SteamIntegrationManager
    const steamManager = new SteamIntegrationManager(pathManager, null, debugManager);
    console.log('✅ SteamIntegrationManager criado');

    // Testar setCredentials
    console.log('\n🔧 Testando setCredentials...');
    const testApiKey = '1A851BBB7A00BB38F75A16B8CD10B059';
    const testSteamId = '76561198000000000';

    // Simular chamada IPC
    const result = await steamManager.setCredentials(testApiKey, testSteamId);
    
    if (result.success) {
      console.log('✅ Credenciais configuradas com sucesso!');
      console.log(`   API Key: ${testApiKey}`);
      console.log(`   Steam ID: ${testSteamId}`);
    } else {
      console.log('❌ Erro ao configurar credenciais:', result.error);
    }

    // Verificar se o arquivo foi criado
    const cacheFile = path.join(pathManager.getCachePath(), 'steam-connection.json');
    
    console.log(`\n📁 Verificando arquivo: ${cacheFile}`);
    
    if (fs.existsSync(cacheFile)) {
      console.log('✅ steam-connection.json criado com sucesso!');
      const content = fs.readFileSync(cacheFile, 'utf8');
      console.log('📄 Conteúdo do arquivo:');
      console.log(JSON.stringify(JSON.parse(content), null, 2));
    } else {
      console.log('❌ steam-connection.json NÃO foi criado');
    }

    // Testar getCredentials
    console.log('\n🔍 Testando getCredentials...');
    const credentials = await steamManager.getCredentials();
    
    if (credentials.success) {
      console.log('✅ Credenciais recuperadas com sucesso!');
      console.log(`   API Key: ${credentials.apiKey}`);
      console.log(`   Steam ID: ${credentials.steamId}`);
    } else {
      console.log('❌ Erro ao recuperar credenciais:', credentials.error);
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar teste
testSteamIPC();