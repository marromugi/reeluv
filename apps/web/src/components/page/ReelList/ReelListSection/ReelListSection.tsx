'use client'

import { motion } from 'motion/react'

import { ReelCard } from './ReelCard'
import { ReelListSkeleton } from './ReelListSkeleton'

import { useGetApiReels } from '@/client/api/reel/reel'

/**
 * リール一覧セクション（Client Component）
 * SWRでデータ取得し、グリッド表示
 */
export const ReelListSection = () => {
  const { data, isLoading } = useGetApiReels()

  if (isLoading) {
    return <ReelListSkeleton />
  }

  const showReels = data?.data?.showReels ?? []

  if (showReels.length === 0) {
    return (
      <motion.div
        className="flex h-64 items-center justify-center text-neutral-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        ショーリールがありません。「+ 作成」ボタンから作成してください。
      </motion.div>
    )
  }

  return (
    <div className="flex flex-wrap gap-4">
      {showReels.map((reel, index) => (
        <ReelCard key={reel.id} reel={reel} index={index} />
      ))}
    </div>
  )
}
