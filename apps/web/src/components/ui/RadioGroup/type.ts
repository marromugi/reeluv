import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'

import type { radioGroupVariants } from './const'

// RadioGroupItem の型を再エクスポート
export type { RadioGroupItemProps, RadioGroupItemVariantProps } from './RadioGroupItem'

/** RadioGroup のサイズバリアント */
export type RadioGroupSize = 'sm' | 'md' | 'lg'

/** RadioGroup のレイアウト方向 */
export type RadioGroupDirection = 'horizontal' | 'vertical'

/** RadioGroup のバリアント Props */
export type RadioGroupVariantProps = VariantProps<typeof radioGroupVariants>

/** RadioGroup コンテキストの値 */
export type RadioGroupContextValue = {
  /** グループの名前（name属性） */
  name: string
  /** 現在選択されている値 */
  value: string | undefined
  /** 値が変更されたときのコールバック */
  onChange: (value: string) => void
  /** サイズ */
  size: RadioGroupSize
  /** 無効状態 */
  disabled?: boolean
}

/** RadioGroup コンポーネントの Props */
export type RadioGroupProps = {
  /** グループの名前（フォーム送信時に使用） */
  name: string
  /** 現在選択されている値 */
  value?: string
  /** デフォルトの選択値（非制御コンポーネント用） */
  defaultValue?: string
  /** 値が変更されたときのコールバック */
  onChange?: (value: string) => void
  /** レイアウト方向 */
  direction?: RadioGroupDirection
  /** サイズ */
  size?: RadioGroupSize
  /** 無効状態 */
  disabled?: boolean
  /** 子要素（RadioGroupItem） */
  children?: ReactNode
  /** 追加のクラス名 */
  className?: string
} & Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'>
