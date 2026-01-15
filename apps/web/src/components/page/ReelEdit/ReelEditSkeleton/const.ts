import { tv } from 'tailwind-variants'

/** ReelEditSkeleton のスタイル定義 */
export const reelEditSkeletonVariants = tv({
  slots: {
    container: 'flex h-dvh flex-col',
    header: 'flex h-22 items-center border-b border-neutral-200 dark:border-neutral-800 px-4',
    mainArea: 'flex flex-1 overflow-hidden',
    leftPanel:
      'flex min-w-48 w-1/5 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900',
    centerArea: 'flex flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-950',
    rightPanel:
      'min-w-48 w-1/5 border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4',
    bottomArea:
      'h-36 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900',
  },
})
