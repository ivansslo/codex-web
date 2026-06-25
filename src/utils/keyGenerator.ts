// OpenRouter & OpenCode Zen Key Generator Utility
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const DECRYPT_KEY = 'er54s4'

function xorEncryptDecrypt(input: string, secret: string): Buffer {
  const inputBuf = Buffer.from(input, 'utf8')
  const keyBuf = Buffer.from(secret, 'utf8')
  const out = Buffer.alloc(inputBuf.length)
  for (let i = 0; i < inputBuf.length; i++) {
    out[i] = inputBuf[i]! ^ keyBuf[i % keyBuf.length]!
  }
  return out
}

export function generateOpenRouterKey(customPrefix = 'sk-or-v1-'): { rawKey: string; encryptedKey: string } {
  const hex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  const rawKey = `${customPrefix}${hex}`
  const encryptedKey = xorEncryptDecrypt(rawKey, DECRYPT_KEY).toString('base64')
  return { rawKey, encryptedKey }
}

export function generateZenKey(customPrefix = 'sk-zen-'): { rawKey: string; encryptedKey: string } {
  const hex = Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  const rawKey = `${customPrefix}${hex}`
  const encryptedKey = xorEncryptDecrypt(rawKey, DECRYPT_KEY).toString('base64')
  return { rawKey, encryptedKey }
}

export function buildAndRegisterKeys(options: { openRouterCount?: number; zenCount?: number; persistToHome?: boolean } = {}) {
  const orCount = options.openRouterCount ?? 5
  const zenCount = options.zenCount ?? 5

  const openRouterKeys = Array.from({ length: orCount }, () => generateOpenRouterKey())
  const zenKeys = Array.from({ length: zenCount }, () => generateZenKey())

  const config = {
    generatedAt: new Date().toISOString(),
    openRouter: openRouterKeys,
    openCodeZen: zenKeys
  }

  if (options.persistToHome !== false) {
    const configPath = join(homedir(), '.codex-web-generated-keys.json')
    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8')
  }

  return config
}

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  const res = buildAndRegisterKeys()
  console.log('Successfully built OpenRouter & Zen AI key pool:')
  console.log(JSON.stringify(res, null, 2))
}
