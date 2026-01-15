import { tv } from 'tailwind-variants'

/**
 * Typography コンポーネントのバリアント定義
 */
export const typographyVariants = tv({
  base: '',
  variants: {
    /** テキストの用途・カラー */
    variant: {
      /** 本文テキスト（標準色、ダークテーマ対応） */
      body: 'text-neutral-900 dark:text-neutral-100',
      /** 説明文（グレー系） */
      description: 'text-neutral-500 dark:text-neutral-400',
      /** 警告・エラー（赤系） */
      alert: 'text-red-500 dark:text-red-400',
      /** 強調テキスト（黒に近い色） */
      fill: 'text-neutral-950 dark:text-white',
    },
    /** フォントサイズ */
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    /** フォントの太さ */
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    variant: 'body',
    size: 'md',
    weight: 'normal',
  },
})
