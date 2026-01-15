import { tv } from 'tailwind-variants'

/** PreviewSection のスタイル定義 */
export const previewSectionVariants = tv({
  slots: {
    container:
      'flex flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-950 animate-fade-in',
    preview:
      'flex w-4/5 h-4/5 flex-col items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-800',
  },
})
