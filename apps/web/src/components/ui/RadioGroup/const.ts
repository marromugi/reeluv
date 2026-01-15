import { tv } from 'tailwind-variants'

/**
 * RadioGroup のバリアント定義
 */
export const radioGroupVariants = tv({
  base: 'flex',
  variants: {
    direction: {
      horizontal: 'flex-row flex-wrap gap-4',
      vertical: 'flex-col gap-2',
    },
  },
  defaultVariants: {
    direction: 'vertical',
  },
})
