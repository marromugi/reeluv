'use client'

import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'

type ProvidersProps = {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SWRConfig value={{}}>{children}</SWRConfig>
    </ThemeProvider>
  )
}
