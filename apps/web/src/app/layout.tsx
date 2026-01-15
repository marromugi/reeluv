import type { Metadata } from 'next'

import './globals.css'
import { Providers } from './providers'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'reeluv',
  description: 'showreel management app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
