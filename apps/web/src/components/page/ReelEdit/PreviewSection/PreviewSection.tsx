import { previewSectionVariants } from './const'
import type { PreviewSectionProps } from './type'

import { Typography } from '@/components/ui/Typography'

const styles = previewSectionVariants()

/**
 * プレビューセクション（中央エリア）
 * 選択中のクリップのプレビューを表示（現在はプレースホルダー）
 */
export const PreviewSection = ({ selectedClip }: PreviewSectionProps) => {
  return (
    <div className={styles.container()}>
      {/* プレースホルダー */}
      <div className={styles.preview()}>
        {selectedClip ? (
          <>
            <Typography as="span" size="lg" className="text-neutral-800 dark:text-neutral-200">
              {selectedClip.name}
            </Typography>
            <Typography as="span" size="sm" className="mt-2 text-neutral-600 dark:text-neutral-400">
              {selectedClip.duration}
            </Typography>
          </>
        ) : (
          <Typography as="span" size="md" className="text-neutral-600 dark:text-neutral-400">
            クリップを選択してください
          </Typography>
        )}
      </div>
    </div>
  )
}
