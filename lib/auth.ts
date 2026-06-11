import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

/**
 * Autenticazione minimale a singolo admin: credenziali in env
 * (ADMIN_EMAIL, ADMIN_PASSWORD), sessione in un cookie firmato HMAC
 * con AUTH_SECRET. Nessun utente a database.
 */

const SESSION_COOKIE = 'noxis_admin'
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 giorni

function getSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[auth] AUTH_SECRET is not set')
  }
  return 'dev-insecure-secret'
}

function sign(value: string): string {
  return createHmac('sha256', getSecret()).update(value).digest('hex')
}

/** Confronto a tempo costante su digest, così le lunghezze non trapelano. */
function safeEqual(a: string, b: string): boolean {
  const da = createHash('sha256').update(a).digest()
  const db = createHash('sha256').update(b).digest()
  return timingSafeEqual(da, db)
}

export function verifyCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    console.error('[auth] ADMIN_EMAIL / ADMIN_PASSWORD non configurate — login disabilitato.')
    return false
  }
  const emailOk = safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase())
  const passwordOk = safeEqual(password, adminPassword)
  return emailOk && passwordOk
}

export async function createAdminSession(): Promise<void> {
  const exp = Date.now() + SESSION_TTL_MS
  const token = `${exp}.${sign(String(exp))}`
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function hasAdminSession(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return false
  const [expStr, signature] = token.split('.')
  if (!expStr || !signature) return false
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp < Date.now()) return false
  return safeEqual(signature, sign(expStr))
}
