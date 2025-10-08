import { build } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

/**
 * Executa um comando do SO de forma segura (sem shell), mitigando riscos de injeção.
 * Aceita um comando em string e o separa em programa + argumentos, com validações.
 */
function sh(cmd) {
  if (typeof cmd !== 'string' || cmd.length === 0) {
    throw new TypeError('cmd deve ser uma string não vazia')
  }
  // Bloquear metacaracteres perigosos que habilitam encadeamento e redirecionamento
  const unsafePattern = /[;&|`$><]/
  if (unsafePattern.test(cmd)) {
    throw new Error('Comando contém metacaracteres perigosos')
  }
  // Quebra segura por espaços preservando conteúdo entre aspas simples/duplas
  const parts = cmd.match(/(?:"[^"]*"|'[^']*'|\S+)/g) || []
  const stripQuotes = (s) => s.replace(/^(["'])|(["'])$/g, '')
  const program = parts.shift()
  const args = parts.map(stripQuotes)
  // Whitelist básica de programas permitidos (ajuste conforme necessário)
  const allowedPrograms = new Set(['node', 'git', 'yarn', 'npm', 'pnpm'])
  const baseProgram = String(program).split(/\s+/)[0]
  if (!allowedPrograms.has(baseProgram)) {
    throw new Error(`Programa não permitido: ${baseProgram}`)
  }
  // Executa sem shell para evitar interpretação de metacaracteres pelo shell
  const output = execFileSync(baseProgram, args, { stdio: 'pipe' })
  return output.toString().trim()
}

async function stripFile(file) {
  const ext = path.extname(file).slice(1)
  const loader = ['js', 'jsx', 'ts', 'tsx'].includes(ext) ? ext : 'js'

  const result = await build({
    entryPoints: [file],
    bundle: false,
    write: false,
    format: 'esm',
    platform: 'neutral',
    keepNames: true,
    minify: false,
    legalComments: 'none',
    loader: { [`.${loader}`]: loader },
  })

  fs.writeFileSync(file, result.outputFiles[0].text, 'utf8')
}

// arquivos staged
const staged = sh('git diff --name-only')
  .split('\n')
  .filter(f => /\.(jsx?|tsx?)$/.test(f))

if (!staged.length) {
  console.log('Nenhum arquivo JS/TS para limpar.')
  process.exit(0)
}

Promise.all(staged.map(stripFile))
  .then(() => {
    // re-adiciona os arquivos modificados
    sh(`git add ${staged.join(' ')}`)
    console.log('✅ Comentários removidos e arquivos atualizados no commit.')
  })
  .catch(err => {
    console.error('❌ Erro ao limpar comentários:', err)
    process.exit(1)
  })