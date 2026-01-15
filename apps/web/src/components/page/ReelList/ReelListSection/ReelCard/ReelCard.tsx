'use client'

import * as motion from 'motion/react-client'
import Link from 'next/link'

import { reelCardVariants } from './const'
import type { ReelCardProps } from './type'

import { MoreVert } from '@/components/icon'
import { IconButton } from '@/components/ui/IconButton'
import { Typography } from '@/components/ui/Typography'
import { ROUTES } from '@/constants'
import { formatRelativeTime } from '@/utils/date'

/**
 * ショーリールカードコンポーネント
 * サムネイル、タイトル、更新日時を表示
 */
export const ReelCard = ({ reel, index = 0 }: ReelCardProps) => {
  const { container, thumbnail, content, header, footer, avatar } = reelCardVariants()

  return (
    <Link href={ROUTES.REEL_EDIT(reel.id)}>
      <motion.div
        className={container()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        {/* サムネイルプレースホルダー */}
        <div className={thumbnail()}>
          <div className="flex h-full items-center justify-center text-neutral-400">
            {/* プレースホルダー画像 */}
          </div>
        </div>

        {/* コンテンツ */}
        <div className={content()}>
          <div className={header()}>
            <Typography weight="semibold" variant="fill" className="truncate">
              {reel.name}
            </Typography>
            <IconButton
              icon={MoreVert}
              variant="ghost"
              theme="secondary"
              size="sm"
              aria-label="メニュー"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className={footer()}>
            <div className={avatar()} />
            <Typography size="sm" variant="description">
              {formatRelativeTime(reel.updatedAt)}に編集済み
            </Typography>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
