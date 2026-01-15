import { JSX } from 'react'
import type { VariantProps } from 'tailwind-variants'

import type { ICON_VARIANTS } from './const'

/**
 * アイコンコンポーネントの関数型
 */
export type IconComponent = (svgProps: React.SVGProps<SVGSVGElement>) => JSX.Element

/**
 * Icon コンポーネントの Props 型定義
 */
export type IconProps = {
  /** アイコンコンポーネント */
  icon: IconComponent
  /** 無効状態 */
  disabled?: boolean
  /** 追加のクラス名 */
  className?: string
} & VariantProps<typeof ICON_VARIANTS>
