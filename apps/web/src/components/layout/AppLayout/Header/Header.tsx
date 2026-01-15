import { Typography } from '@/components/ui/Typography'

/**
 * アプリケーションヘッダー
 * 「reeluv」ロゴを表示
 */
export const Header = () => {
  return (
    <header className="flex h-14 items-center border-b border-neutral-200 px-6 dark:border-neutral-800">
      <Typography as="span" weight="bold" variant="fill" className="text-neutral-900 dark:text-white">
        reeluv
      </Typography>
    </header>
  )
}
