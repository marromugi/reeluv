import { Suspense } from 'react'

import { ReelEditContent } from './ReelEditContent'
import { ReelEditSkeleton } from './ReelEditSkeleton'
import type { ReelEditPageProps } from './type'

/**
 * ショーリール編集ページ（Server Component）
 * リールの詳細表示、クリップの追加・削除・並び替えを提供
 */
export const ReelEditPage = ({ reelId }: ReelEditPageProps) => {
  return (
    <Suspense fallback={<ReelEditSkeleton />}>
      <ReelEditContent reelId={reelId} />
    </Suspense>
  )
}
