import { tv } from 'tailwind-variants'

/** 時間間隔（秒） */
export const INTERVAL_SECONDS = 10

/** 表示する最大の時間（秒） */
export const MAX_SECONDS = 120

/** TimelineRuler のスタイル定義 */
export const timelineRulerVariants = tv({
  slots: {
    container: 'relative flex h-6 border-b border-neutral-200 dark:border-neutral-700',
    mark: 'absolute flex flex-col items-center',
    markLine: 'h-2 w-px bg-neutral-400 dark:bg-neutral-600',
  },
})

