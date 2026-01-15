import clsx from 'clsx'
import { tv } from 'tailwind-variants'

/**
 * モーダルのスタイルバリアント
 */
export const modalVariants = tv({
  slots: {
    overlay: 'fixed inset-0 z-50 bg-black/60',
    container: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    content: clsx(
      'relative flex max-h-[90vh] flex-col overflow-hidden',
      'rounded-2xl bg-white shadow-xl dark:bg-neutral-900'
    ),
    header: 'flex items-center justify-between px-6 py-4',
    title: 'text-lg font-semibold text-neutral-900 dark:text-white',
    body: 'flex-1 overflow-y-auto px-6 pb-4 text-neutral-700 dark:text-neutral-300',
    footer: 'flex gap-3 px-6 py-4',
  },
  variants: {
    size: {
      sm: { content: 'w-full max-w-sm' },
      md: { content: 'w-full max-w-md' },
      lg: { content: 'w-full max-w-lg' },
    },
    footerAlign: {
      start: { footer: 'justify-start' },
      center: { footer: 'justify-center' },
      end: { footer: 'justify-end' },
      between: { footer: 'justify-between' },
    },
  },
  defaultVariants: {
    size: 'md',
    footerAlign: 'end',
  },
})
