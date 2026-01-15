import clsx from 'clsx'
import { tv } from 'tailwind-variants'

/** ベーススタイル */
const baseStyles = clsx(
  'w-full',
  'bg-transparent',
  'border',
  'transition-colors duration-200',
  'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
  'focus:outline-none',
  'disabled:cursor-not-allowed disabled:opacity-50'
)

/** サイズバリアント */
const sizeStyles = {
  sm: 'h-10 px-3 text-sm rounded-md',
  md: 'h-12 px-4 text-base rounded-lg',
  lg: 'h-14 px-5 text-lg rounded-xl',
}

/** スタイルバリアント */
const variantStyles = {
  outlined: '',
  filled: 'border-transparent',
}

/** 状態バリアント */
const stateStyles = {
  default: '',
  error: '',
  success: '',
}

/** スタイル × 状態 の組み合わせスタイル（ライト/ダークモード両対応） */
const styleStateStyles = {
  outlined: {
    default: clsx(
      'border-neutral-200 dark:border-neutral-700',
      'hover:border-neutral-400 dark:hover:border-neutral-500',
      'focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20',
      'text-neutral-900 dark:text-white'
    ),
    error: clsx(
      'border-red-500',
      'hover:border-red-600',
      'focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
      'text-neutral-900 dark:text-white'
    ),
    success: clsx(
      'border-green-500',
      'hover:border-green-600',
      'focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
      'text-neutral-900 dark:text-white'
    ),
  },
  filled: {
    default: clsx(
      'bg-neutral-100 dark:bg-neutral-800',
      'hover:bg-neutral-200 dark:hover:bg-neutral-700',
      'focus:bg-neutral-50 focus:ring-2 focus:ring-orange-500/20 dark:focus:bg-neutral-900',
      'text-neutral-900 dark:text-white'
    ),
    error: clsx(
      'bg-red-50 dark:bg-red-900/20',
      'hover:bg-red-100 dark:hover:bg-red-900/30',
      'focus:bg-red-50 focus:ring-2 focus:ring-red-500/20 dark:focus:bg-red-900/20',
      'text-neutral-900 dark:text-white'
    ),
    success: clsx(
      'bg-green-50 dark:bg-green-900/20',
      'hover:bg-green-100 dark:hover:bg-green-900/30',
      'focus:bg-green-50 focus:ring-2 focus:ring-green-500/20 dark:focus:bg-green-900/20',
      'text-neutral-900 dark:text-white'
    ),
  },
}

/**
 * TextField コンポーネントのバリアント定義
 */
export const textFieldVariants = tv({
  base: baseStyles,
  variants: {
    size: sizeStyles,
    variant: variantStyles,
    state: stateStyles,
  },
  compoundVariants: [
    // outlined
    { variant: 'outlined', state: 'default', class: styleStateStyles.outlined.default },
    { variant: 'outlined', state: 'error', class: styleStateStyles.outlined.error },
    { variant: 'outlined', state: 'success', class: styleStateStyles.outlined.success },
    // filled
    { variant: 'filled', state: 'default', class: styleStateStyles.filled.default },
    { variant: 'filled', state: 'error', class: styleStateStyles.filled.error },
    { variant: 'filled', state: 'success', class: styleStateStyles.filled.success },
  ],
  defaultVariants: {
    size: 'md',
    variant: 'filled',
    state: 'default',
  },
})
