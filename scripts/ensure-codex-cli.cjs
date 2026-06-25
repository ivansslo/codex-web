#!/usr/bin/env node
const { existsSync } = require('node:fs')
const { delimiter, join } = require('node:path')
const { homedir } = require('node:os')
const { spawnSync } = require('node:child_process')

function isTermuxRuntime() {
  return Boolean(process.env.TERMUX_VERSION || process.env.PREFIX?.includes('/com.termux/'))
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    stdio: options.stdio || 'inherit',
    env: options.env || process.env,
    windowsHide: true,
  })
}

function canRun(command, args = ['--version']) {
  const result = spawnSync(command, args, { stdio: 'ignore', windowsHide: true })
  return !result.error && result.status === 0
}

function unique(values) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))]
}

function getUserNpmPrefix() {
  return join(homedir(), '.npm-global')
}

function getNpmGlobalBinDir(prefix) {
  return process.platform === 'win32' ? prefix : join(prefix, 'bin')
}

function getPotentialNpmPrefixes() {
  return unique([
    process.env.npm_config_prefix,
    process.env.PREFIX,
    getUserNpmPrefix(),
    process.platform === 'win32' ? process.env.APPDATA && join(process.env.APPDATA, 'npm') : null,
  ])
}

function getPotentialCodexExecutables(prefix) {
  const dirs = [join(prefix, 'node_modules', '@openai', 'codex')]
  if (process.platform !== 'win32') {
    dirs.push(join(prefix, 'lib', 'node_modules', '@openai', 'codex'))
  }
  return dirs.map((packageDir) => (
    process.platform === 'win32'
      ? join(packageDir, 'node_modules', '@openai', 'codex-win32-x64', 'vendor', 'x86_64-pc-windows-msvc', 'codex', 'codex.exe')
      : join(packageDir, 'bin', 'codex')
  ))
}

function resolveCodexCommand() {
  const candidates = unique([
    process.env.CODEXUI_CODEX_COMMAND,
    'codex',
    ...getPotentialNpmPrefixes().flatMap(getPotentialCodexExecutables),
  ])

  for (const candidate of candidates) {
    if ((candidate.includes('/') || candidate.includes('\\')) && !existsSync(candidate)) continue
    if (canRun(candidate)) return candidate
  }
  return ''
}

function prependPath(entry) {
  const normalized = String(entry || '').trim()
  if (!normalized) return
  const parts = (process.env.PATH || '').split(delimiter)
  if (!parts.includes(normalized)) {
    process.env.PATH = `${normalized}${delimiter}${process.env.PATH || ''}`
  }
}

function installPackage(pkg, label) {
  console.log(`\n[setup] ${label}: npm install -g ${pkg}\n`)
  let result = run('npm', ['install', '-g', pkg])
  if (result.status === 0) return

  if (isTermuxRuntime()) {
    throw new Error(`${label} failed with exit code ${result.status ?? 1}`)
  }

  const userPrefix = getUserNpmPrefix()
  console.log(`\n[setup] Global install failed. Retrying without sudo using --prefix ${userPrefix}\n`)
  result = run('npm', ['install', '-g', '--prefix', userPrefix, pkg])
  if (result.status !== 0) {
    throw new Error(`${label} user-prefix install failed with exit code ${result.status ?? 1}`)
  }
  prependPath(getNpmGlobalBinDir(userPrefix))
}

function main() {
  const existing = resolveCodexCommand()
  if (existing) {
    console.log(`[setup] Codex CLI found: ${existing}`)
    return
  }

  if (isTermuxRuntime()) {
    installPackage('@mmmbuto/codex-cli-termux', 'Install Termux Codex CLI')
    if (!resolveCodexCommand()) {
      installPackage('@openai/codex', 'Install official Codex CLI fallback')
    }
  } else {
    installPackage('@openai/codex', 'Install Codex CLI')
  }

  const installed = resolveCodexCommand()
  if (!installed) {
    throw new Error('Codex CLI install completed but `codex --version` is still unavailable')
  }
  console.log(`[setup] Codex CLI ready: ${installed}`)
}

try {
  main()
} catch (error) {
  console.error(`\n[setup] ${error instanceof Error ? error.message : String(error)}\n`)
  console.error('[setup] Manual fix: npm install -g @openai/codex')
  process.exit(1)
}
