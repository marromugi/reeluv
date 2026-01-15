import { tv } from 'tailwind-variants'

/** TimelineClip のスタイル定義 */
export const timelineClipVariants = tv({
  slots: {
    container: [
      'group relative flex h-16 min-w-32 cursor-grab flex-col justify-center rounded px-3',
      'bg-neutral-300 dark:bg-neutral-700 transition-colors hover:bg-neutral-400 dark:hover:bg-neutral-600',
      'border-2',
    ],
    deleteButton: [
      'absolute -top-2 -right-2 opacity-0 transition-opacity',
      'group-hover:opacity-100',
    ],
  },
  variants: {
    isSelected: {
      true: {
        container: 'border-yellow-500',
      },
      false: {
        container: 'border-transparent',
      },
    },
    isDragging: {
      true: {
        container: 'cursor-grabbing opacity-50',
      },
    },
  },
  defaultVariants: {
    isSelected: false,
    isDragging: false,
  },
})
