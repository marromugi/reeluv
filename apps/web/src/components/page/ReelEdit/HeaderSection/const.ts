import { tv } from 'tailwind-variants'

/** HeaderSection のスタイル定義 */
export const headerSectionVariants = tv({
  slots: {
    container:
      'flex py-2 items-center border-b border-neutral-200 dark:border-neutral-800 px-4 bg-white dark:bg-neutral-900 animate-fade-in',
    titleWrapper: 'flex flex-1 items-center justify-center',
    input:
      'h-8 w-64 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-2 text-sm text-neutral-900 dark:text-neutral-50 outline-none focus:border-primary-500',
    titleButton: 'cursor-pointer rounded px-1 hover:bg-neutral-200 dark:hover:bg-neutral-800',
    spacer: 'w-8',
  },
})
