import type { ComponentPropsWithoutRef } from 'react'
import type { VariantProps } from 'tailwind-variants'

import type { IconComponent } from '../../Icon'
import type { iconButtonVariants } from '../const'

/** バリアント Props の共通型 */
export type IconButtonVariantProps = VariantProps<typeof iconButtonVariants> & {
  /** 表示するアイコン */
  icon: IconComponent
}

/**
 * IconButtonBase コンポーネントの Props 型定義
 * ポリモーフィックコンポーネントとして、任意の要素タイプを受け入れる
 */
export type IconButtonBaseProps<T extends React.ElementType = 'span'> = IconButtonVariantProps & {
  /** レンダリングする要素の種類 */
  as?: T
  /** 追加のクラス名 */
  className?: string
  /** 無効状態 */
  disabled?: boolean
} & Omit<
    ComponentPropsWithoutRef<T>,
    keyof IconButtonVariantProps | 'as' | 'children' | 'className' | 'disabled'
  >
