import './globals.css'
import type { Metadata } from 'next'
import { Comfortaa } from 'next/font/google'
import { NavbarProvider } from '@/lib/navbar-context'
import { UserProvider } from '@/lib/user-context'
import Navbar from '@/components/Navbar'
import PageTransition from '@/components/PageTransition'

const comfortaa = Comfortaa({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TAP22',
  description: 'Авторизация через Telegram виджет',
  icons: {
    icon: '/tap_logo_website.jpg',
    shortcut: '/tap_logo_website.jpg',
    apple: '/tap_logo_website.jpg',
  },
  // Временно отключаем CSP для разработки с Telegram виджетом
  // other: {
  //   'Content-Security-Policy': "frame-ancestors 'self' https://oauth.telegram.org https://telegram.org; frame-src 'self' https://oauth.telegram.org https://telegram.org; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org; connect-src 'self' https://oauth.telegram.org https://telegram.org;"
  // }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={comfortaa.className}>
        <UserProvider>
          <NavbarProvider>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 overflow-hidden">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
            </div>
          </NavbarProvider>
        </UserProvider>
      </body>
    </html>
  )
}
