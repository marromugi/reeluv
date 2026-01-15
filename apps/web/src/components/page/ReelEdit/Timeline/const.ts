import { tv } from 'tailwind-variants'

/** Timeline のスタイル定義 */
export const timelineVariants = tv({
  slots: {
    container:
      'h-40 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 animate-fade-in',
    content: 'flex h-full flex-col pt-2',
    track: 'flex-1 overflow-x-auto py-2',
    emptyState: 'flex h-full items-center justify-center',
    clipList: 'flex gap-2 px-4',
  },
})
