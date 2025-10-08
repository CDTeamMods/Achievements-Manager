import { build } from 'esbuild'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

function sh(cmd) {
  return execSync(cmd, { stdio: 'pipe' }).toString().trim()
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

console.log(`Removendo comentários de ${staged.length} arquivo(s)...`)

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