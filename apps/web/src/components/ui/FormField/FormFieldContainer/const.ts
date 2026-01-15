import { tv } from 'tailwind-variants'

/**
 * FormFieldContainer コンポーネントのバリアント定義
 */
export const formFieldContainerVariants = tv({
  base: 'flex w-full flex-col',
  variants: {
    gap: {
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-2',
    },
  },
  defaultVariants: {
    gap: 'md',
  },
})
