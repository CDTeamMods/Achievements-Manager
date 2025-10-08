const path = require('node:path');
const fs = require('node:fs').promises;

// Simular PathManager para teste
const mockPathManager = {
  getCachePath: () => path.join(__dirname, 'src', 'data', 'cache'),
  isInstalled: () => false,
  isDevelopment: () => true
};

async function testCacheStructure() {
  console.log('🧪 Testando nova estrutura de cache...\n');

  try {
    // Testar o caminho das credenciais manualmente
    const type = 'steam';
    const mode = mockPathManager.isDevelopment() ? 'development' : 'production';
    const credentialsPath = path.join(mockPathManager.getCachePath(), type, mode, 'steam_access.json');
    
    console.log('📁 Caminho das credenciais:', credentialsPath);

    // Testar salvamento de credenciais
    console.log('\n💾 Testando salvamento de credenciais...');
    
    const credentialsData = {
      apiKey: 'test-api-key',
      steamId: '76561198000000000',
      connected: true,
      lastUpdated: new Date().toISOString(),
      sessionId: Date.now().toString(),
    };

    // Garantir que o diretório existe
    const dir = path.dirname(credentialsPath);
    await fs.mkdir(dir, { recursive: true });

    // Salvar credenciais
    await fs.writeFile(credentialsPath, JSON.stringify(credentialsData, null, 2), 'utf8');
    console.log('✅ Credenciais salvas com sucesso');

    // Testar carregamento de credenciais
    console.log('\n📖 Testando carregamento de credenciais...');
    const data = await fs.readFile(credentialsPath, 'utf8');
    const loadedData = JSON.parse(data);
    
    console.log('Credenciais carregadas:', {
      apiKey: loadedData.apiKey ? 'Definida' : 'Não definida',
      steamId: loadedData.steamId || 'Não definido',
      connected: loadedData.connected
    });

    // Verificar estrutura de diretórios
    console.log('\n📂 Verificando estrutura de diretórios...');
    console.log('📄 Conteúdo do arquivo:', JSON.stringify(loadedData, null, 2));

    // Verificar se a estrutura está correta
    const expectedPath = path.join('src', 'data', 'cache', 'steam', 'development', 'steam_access.json');
    const relativePath = path.relative(__dirname, credentialsPath);
    
    console.log('\n🔍 Verificação da estrutura:');
    console.log('Caminho esperado:', expectedPath);
    console.log('Caminho criado:', relativePath);
    console.log('Estrutura correta:', relativePath === expectedPath ? '✅ Sim' : '❌ Não');

    // Testar limpeza
    console.log('\n🧹 Testando limpeza de credenciais...');
    await fs.unlink(credentialsPath);
    console.log('✅ Credenciais limpas com sucesso');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
testCacheStructure().then(() => {
  console.log('\n🎉 Teste concluído!');
}).catch(console.error);