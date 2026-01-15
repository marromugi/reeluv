import { ThemeToggleButton } from './ThemeToggleButton'

import { Typography } from '@/components/ui/Typography'

/**
 * アプリケーションヘッダー
 * 「reeluv」ロゴとテーマ切り替えボタンを表示
 */
export const Header = () => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 px-6 dark:border-neutral-800">
      <Typography as="span" weight="bold" variant="fill" className="text-neutral-900 dark:text-white">
        reeluv
      </Typography>
      <ThemeToggleButton />
    </header>
  )
}
