import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ToastProvider } from '@/components/Toast'

export const metadata: Metadata = {
  title: '🍄 Mario Characters API',
  description: 'Mario Universe Characters Dashboard — .NET 10 API + Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  )
}
