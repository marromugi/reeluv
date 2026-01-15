import type { ComponentPropsWithoutRef } from 'react'
import type { VariantProps } from 'tailwind-variants'

import type { radioGroupItemVariants } from './const'

/** RadioGroupItem のバリアント Props */
export type RadioGroupItemVariantProps = VariantProps<typeof radioGroupItemVariants>

/** RadioGroupItem コンポーネントの Props */
export type RadioGroupItemProps = {
  /** この項目の値 */
  value: string
  /** ラベル */
  label: string
  /** 説明文（オプション） */
  description?: string
  /** 無効状態（個別に設定可能） */
  disabled?: boolean
  /** 追加のクラス名 */
  className?: string
} & Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'name' | 'value' | 'checked' | 'onChange'>
