import clsx from 'clsx'
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
    <html lang="ja" suppressHydrationWarning>
      <body
        className={clsx(`antialiased`, 'bg-neutral-100 dark:bg-neutral-950 min-w-screen min-h-dvh')}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
