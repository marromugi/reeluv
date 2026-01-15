import { tv } from 'tailwind-variants'

/**
 * FormFieldLabel コンポーネントのバリアント定義
 */
export const formFieldLabelVariants = tv({
  base: 'font-medium text-neutral-700 dark:text-neutral-300',
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
