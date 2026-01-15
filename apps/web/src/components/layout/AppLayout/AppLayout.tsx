import { Header } from './Header'
import { Sidebar } from './Sidebar'
import type { AppLayoutProps } from './type'

/**
 * アプリケーションのメインレイアウト
 * サイドバー + ヘッダー + メインコンテンツで構成
 */
export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
