import clsx from 'clsx'
import { tv } from 'tailwind-variants'

/** アイコンボタンサイズとアイコンサイズのマッピング */
export const iconButtonIconSizeMap = {
  xs: 'sm',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const

/** ベーススタイル */
const baseStyles = clsx(
  'inline-flex items-center justify-center', // レイアウト
  'cursor-pointer transition-colors', // インタラクション
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2', // フォーカス
  'disabled:cursor-not-allowed disabled:opacity-50' // 無効状態
)

/** サイズバリアント */
const sizeStyles = {
  xs: 'size-6 rounded-md', // 24px
  sm: 'size-8 rounded-lg', // 32px
  md: 'size-10 rounded-lg', // 40px
  lg: 'size-12 rounded-xl', // 48px
}

/** バリアントスタイル */
const variantStyles = {
  solid: '',
  outline: 'border-2 bg-transparent',
  ghost: 'bg-transparent',
}

/** テーマ × バリアント の組み合わせスタイル（ライト/ダークモード両対応） */
const themeVariantStyles = {
  primary: {
    solid: 'bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500',
    outline:
      'border-orange-500 text-orange-500 hover:bg-orange-500/20 focus-visible:ring-orange-500',
    ghost: 'text-orange-500 hover:bg-orange-500/20 focus-visible:ring-orange-500',
  },
  secondary: {
    solid:
      'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus-visible:ring-neutral-400 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus-visible:ring-neutral-600',
    outline:
      'border-neutral-400 text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400 dark:border-white/30 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-white/30',
    ghost:
      'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-white/30',
  },
  alert: {
    solid: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
    outline: 'border-red-500 text-red-500 hover:bg-red-500/20 focus-visible:ring-red-500',
    ghost: 'text-red-500 hover:bg-red-500/20 focus-visible:ring-red-500',
  },
}

/**
 * IconButton コンポーネントのバリアント定義
 */
export const iconButtonVariants = tv({
  base: baseStyles,
  variants: {
    theme: {
      primary: '',
      secondary: '',
      alert: '',
    },
    variant: variantStyles,
    size: sizeStyles,
  },
  compoundVariants: [
    // primary
    { theme: 'primary', variant: 'solid', class: themeVariantStyles.primary.solid },
    { theme: 'primary', variant: 'outline', class: themeVariantStyles.primary.outline },
    { theme: 'primary', variant: 'ghost', class: themeVariantStyles.primary.ghost },
    // secondary
    { theme: 'secondary', variant: 'solid', class: themeVariantStyles.secondary.solid },
    { theme: 'secondary', variant: 'outline', class: themeVariantStyles.secondary.outline },
    { theme: 'secondary', variant: 'ghost', class: themeVariantStyles.secondary.ghost },
    // alert
    { theme: 'alert', variant: 'solid', class: themeVariantStyles.alert.solid },
    { theme: 'alert', variant: 'outline', class: themeVariantStyles.alert.outline },
    { theme: 'alert', variant: 'ghost', class: themeVariantStyles.alert.ghost },
  ],
  defaultVariants: {
    theme: 'primary',
    variant: 'solid',
    size: 'md',
  },
})
