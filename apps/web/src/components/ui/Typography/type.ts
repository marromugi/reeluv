import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'

import type { typographyVariants } from './const'

/** Typography のバリアント Props */
export type TypographyVariantProps = VariantProps<typeof typographyVariants>

/**
 * Typography コンポーネントの Props 型定義
 * ポリモーフィックコンポーネントとして、任意の要素タイプを受け入れる
 */
export type TypographyProps<T extends React.ElementType = 'span'> = TypographyVariantProps & {
  /** レンダリングする要素の種類 */
  as?: T
  /** 子要素（テキスト内容） */
  children?: ReactNode
  /** 追加のクラス名 */
  className?: string
} & Omit<
    ComponentPropsWithoutRef<T>,
    keyof TypographyVariantProps | 'as' | 'children' | 'className'
  >
