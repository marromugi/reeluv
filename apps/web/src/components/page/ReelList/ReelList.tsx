import { CreateReelModalButton } from './CreateReelModalButton'
import { ReelListSection } from './ReelListSection'

import { Typography } from '@/components/ui/Typography'

/**
 * ショーリール一覧ページ
 * ショーリールの一覧表示と作成機能を提供
 */
export const ReelListPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <Typography as="h1" size="xl" weight="semibold">
          ショーリール
        </Typography>
        <CreateReelModalButton />
      </div>

      {/* リストセクション */}
      <ReelListSection />
    </div>
  )
}
