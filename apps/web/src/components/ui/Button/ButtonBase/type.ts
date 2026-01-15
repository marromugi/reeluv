import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'

import type { IconComponent } from '../../Icon'
import type { buttonVariants } from '../const'

/** バリアント Props の共通型 */
export type ButtonVariantProps = VariantProps<typeof buttonVariants> & {
  /** 左側に表示するアイコン */
  leftIcon?: IconComponent
  /** 右側に表示するアイコン */
  rightIcon?: IconComponent
}

/**
 * ButtonBase コンポーネントの Props 型定義
 * ポリモーフィックコンポーネントとして、任意の要素タイプを受け入れる
 */
export type ButtonBaseProps<T extends React.ElementType = 'span'> = ButtonVariantProps & {
  /** レンダリングする要素の種類 */
  as?: T
  /** 子要素 */
  children?: ReactNode
  /** 追加のクラス名 */
  className?: string
  /** 無効状態 */
  disabled?: boolean
} & Omit<
    ComponentPropsWithoutRef<T>,
    keyof ButtonVariantProps | 'as' | 'children' | 'className' | 'disabled'
  >
