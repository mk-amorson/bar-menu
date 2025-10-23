import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🔧 MIDDLEWARE: Processing request to', request.nextUrl.pathname)
  
  const response = NextResponse.next()
  
  // Полностью отключаем CSP для всех HTML страниц
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/chat') || request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/profile')) {
    console.log('🔧 MIDDLEWARE: Completely disabling CSP for HTML page')
    
    // Удаляем все возможные CSP заголовки
    response.headers.delete('Content-Security-Policy')
    response.headers.delete('X-Content-Security-Policy')
    response.headers.delete('X-WebKit-CSP')
    response.headers.delete('X-Frame-Options')
    response.headers.delete('X-Content-Type-Options')
    
    // НЕ добавляем никаких CSP заголовков - полностью отключаем
    console.log('🔧 MIDDLEWARE: CSP completely disabled')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
