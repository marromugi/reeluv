'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NAV_ITEMS } from './const'

import { Icon } from '@/components/ui/Icon'

/**
 * サイドバーコンポーネント
 * ナビゲーションメニュー（ショーリール/クリップ）を表示
 */
export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="flex w-16 flex-col items-center border-r border-neutral-200 py-4 dark:border-neutral-800">
      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-white'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon icon={item.icon} size="md" />
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
