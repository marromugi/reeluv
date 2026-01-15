import type { ComponentPropsWithoutRef } from 'react'

import type { IconButtonVariantProps } from './IconButtonBase'

// IconButtonBase の型を再エクスポート
export type { IconButtonBaseProps, IconButtonVariantProps } from './IconButtonBase'

/**
 * IconButton コンポーネントの Props 型定義
 * aria-label を必須とする
 */
export type IconButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'aria-label'> &
  IconButtonVariantProps & {
    /** アクセシビリティラベル（必須） */
    'aria-label': string
  }
