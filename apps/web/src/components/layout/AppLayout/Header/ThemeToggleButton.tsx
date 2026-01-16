'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { MoonFill, SunFill } from '@/components/icon'
import { IconButton } from '@/components/ui/IconButton'

/**
 * テーマ切り替えボタン
 * ライトモードとダークモードを切り替える
 */
export const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // マウント時にのみ実行するため ignore
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // ハイドレーションエラーを防ぐため、マウント前は何も表示しない
  if (!mounted) {
    return <div className="size-8" />
  }

  return (
    <IconButton
      icon={theme === 'dark' ? SunFill : MoonFill}
      theme="secondary"
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
    />
  )
}
