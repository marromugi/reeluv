import { tv } from 'tailwind-variants'

/**
 * Icon コンポーネントのバリアント定義
 */
export const ICON_VARIANTS = tv({
  base: 'shrink-0',
  variants: {
    size: {
      sm: 'size-4', // 16px
      md: 'size-5', // 20px
      lg: 'size-6', // 24px
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
