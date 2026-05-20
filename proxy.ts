import { NextResponse, type NextRequest } from 'next/server'

const SUBDOMAIN_TO_PATH: Record<string, string> = {
  development: '/development',
  talent: '/talent',
}

const PATH_TO_SUBDOMAIN: Record<string, string> = Object.fromEntries(
  Object.entries(SUBDOMAIN_TO_PATH).map(([sub, path]) => [path, sub]),
)

function getSubdomain(host: string): string | null {
  const hostname = host.split(':')[0].toLowerCase()

  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null
  }

  if (hostname.endsWith('.localhost')) {
    const sub = hostname.replace(/\.localhost$/, '')
    return sub || null
  }

  const parts = hostname.split('.')
  if (parts.length < 3) return null

  const sub = parts[0]
  if (sub === 'www') return null
  return sub
}

function getRootHost(host: string): string {
  const [hostname, port] = host.split(':')
  const lower = hostname.toLowerCase()

  if (lower.endsWith('.localhost')) {
    const root = 'localhost'
    return port ? `${root}:${port}` : root
  }

  const parts = lower.split('.')
  if (parts.length < 3) return host
  const root = parts.slice(1).join('.')
  return port ? `${root}:${port}` : root
}

function matchedBuPath(pathname: string): string | null {
  for (const buPath of Object.keys(PATH_TO_SUBDOMAIN)) {
    if (pathname === buPath || pathname.startsWith(`${buPath}/`)) {
      return buPath
    }
  }
  return null
}

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const sub = getSubdomain(host)
  const { pathname } = request.nextUrl
  const protocol = request.nextUrl.protocol

  const buPath = matchedBuPath(pathname)

  if (!sub) {
    return NextResponse.next()
  }

  const basePath = SUBDOMAIN_TO_PATH[sub]
  if (!basePath) return NextResponse.next()

  if (buPath && buPath !== basePath) {
    const targetSub = PATH_TO_SUBDOMAIN[buPath]
    const root = getRootHost(host)
    const remainder = pathname.slice(buPath.length) || '/'
    const targetUrl = `${protocol}//${targetSub}.${root}${remainder}${request.nextUrl.search}`
    return NextResponse.redirect(targetUrl)
  }

  if (pathname === basePath || pathname.startsWith(`${basePath}/`)) {
    return NextResponse.next()
  }

  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = basePath
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|manifest.json|apple-touch-icon.png|og-image.jpg).*)',
  ],
}
