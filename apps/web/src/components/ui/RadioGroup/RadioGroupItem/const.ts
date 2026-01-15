import { tv } from 'tailwind-variants'

/**
 * RadioGroupItem のバリアント定義
 */
export const radioGroupItemVariants = tv({
  slots: {
    container: 'flex cursor-pointer transition-colors',
    indicator:
      'shrink-0 rounded-full border-2 flex items-center justify-center transition-colors border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800',
    innerCircle: 'rounded-full bg-orange-500',
    label: 'font-medium text-neutral-900 dark:text-white',
    description: 'text-neutral-500 dark:text-neutral-400',
  },
  variants: {
    size: {
      sm: {
        container: 'gap-2',
        indicator: 'size-4',
        innerCircle: 'size-2',
        label: 'text-sm',
        description: 'text-xs',
      },
      md: {
        container: 'gap-3',
        indicator: 'size-5',
        innerCircle: 'size-2.5',
        label: 'text-base',
        description: 'text-sm',
      },
      lg: {
        container: 'gap-4',
        indicator: 'size-6',
        innerCircle: 'size-3',
        label: 'text-lg',
        description: 'text-base',
      },
    },
    checked: {
      true: {
        indicator: 'border-orange-500',
      },
      false: {},
    },
    disabled: {
      true: {
        container: 'cursor-not-allowed opacity-50',
        label: 'text-neutral-400 dark:text-neutral-500',
        description: 'text-neutral-300 dark:text-neutral-600',
      },
      false: {},
    },
    focused: {
      true: {
        indicator: 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-neutral-900',
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    checked: false,
    disabled: false,
    focused: false,
  },
})
