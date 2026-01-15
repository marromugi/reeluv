import { tv } from 'tailwind-variants'

/** ClipPanel のスタイル定義 */
export const clipPanelVariants = tv({
  slots: {
    container:
      'min-w-48 w-1/5 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 animate-fade-in',
    header:
      'flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 p-3',
    emptyState: 'flex h-32 items-center justify-center',
  },
})
