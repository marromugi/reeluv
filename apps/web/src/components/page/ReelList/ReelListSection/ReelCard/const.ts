import { tv } from 'tailwind-variants'

export const reelCardVariants = tv({
  slots: {
    container: [
      'w-[320px] flex flex-col overflow-hidden rounded-xl',
      'bg-white dark:bg-neutral-900',
      'border border-neutral-200 dark:border-neutral-800',
      'cursor-pointer transition-opacity hover:opacity-90',
    ],
    thumbnail: ['aspect-video w-full', 'bg-neutral-100 dark:bg-neutral-800'],
    content: 'flex flex-col gap-2 px-4 py-3',
    header: 'flex items-center justify-between gap-2',
    footer: 'flex items-center gap-2',
    avatar: ['h-6 w-6 rounded-full', 'bg-neutral-300 dark:bg-neutral-600'],
  },
})
