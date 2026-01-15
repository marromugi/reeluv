import { tv } from 'tailwind-variants'

/** ClipThumbnail のスタイル定義 */
export const clipThumbnailVariants = tv({
  base: [
    'flex h-16 cursor-grab flex-col justify-center rounded border-2 px-2',
    'bg-neutral-200 dark:bg-neutral-800 transition-colors hover:bg-neutral-300 dark:hover:bg-neutral-700',
  ],
  variants: {
    isDragging: {
      true: 'opacity-50 cursor-grabbing',
      false: '',
    },
  },
  defaultVariants: {
    isDragging: false,
  },
})
