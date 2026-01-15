import { tv } from 'tailwind-variants'

/** InfoPanel のスタイル定義 */
export const infoPanelVariants = tv({
  slots: {
    container:
      'min-w-48 w-1/5 border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4 animate-fade-in',
    itemContainer: 'flex flex-col gap-1',
  },
})
