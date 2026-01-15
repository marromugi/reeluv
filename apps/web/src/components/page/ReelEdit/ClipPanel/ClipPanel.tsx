'use client'

import { useSWRConfig } from 'swr'

import { AddClipModal } from './AddClipModal'
import { ClipThumbnail } from './ClipThumbnail'
import { clipPanelVariants } from './const'
import type { ClipPanelProps } from './type'

import {
  getGetApiReelsIdCompatibleClipsKey,
  useGetApiReelsIdCompatibleClips,
} from '@/client/api/reel/reel'
import { AddFill } from '@/components/icon'
import { IconButton } from '@/components/ui/IconButton'
import { Typography } from '@/components/ui/Typography'
import { useDisclosure } from '@/hooks/useDisclosure'

const styles = clipPanelVariants()

/** fallbackData */
const fallbackData = { data: { clips: [] } }

/**
 * クリップパネル（左サイドバー）
 * 互換性のあるクリップを表示し、ドラッグ＆ドロップでタイムラインに追加
 */
export const ClipPanel = ({ reelId, reel }: ClipPanelProps) => {
  const { mutate } = useSWRConfig()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // 互換性のあるクリップを取得
  const { data, isLoading } = useGetApiReelsIdCompatibleClips(reelId, {
    swr: { fallbackData },
  })

  const compatibleClips = data?.data?.clips ?? []

  /** 互換クリップ一覧を更新 */
  const handleMutate = () => {
    mutate(getGetApiReelsIdCompatibleClipsKey(reelId))
  }

  return (
    <div className={styles.container()}>
      {/* ヘッダー */}
      <div className={styles.header()}>
        <Typography as="span" size="sm" weight="semibold">
          クリップ
        </Typography>
        <IconButton
          icon={AddFill}
          variant="ghost"
          size="sm"
          aria-label="クリップを作成"
          onClick={onOpen}
        />
      </div>

      {/* クリップ一覧 */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className={styles.emptyState()}>
            <Typography as="span" size="sm" variant="description">
              読み込み中...
            </Typography>
          </div>
        ) : compatibleClips.length === 0 ? (
          <div className={styles.emptyState()}>
            <Typography as="span" size="sm" variant="description">
              クリップがありません
            </Typography>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {compatibleClips.map((clip) => (
              <ClipThumbnail key={clip.id} clip={clip} />
            ))}
          </div>
        )}
      </div>

      {/* 新規クリップ作成モーダル */}
      <AddClipModal isOpen={isOpen} onClose={onClose} reel={reel} onMutate={handleMutate} />
    </div>
  )
}
