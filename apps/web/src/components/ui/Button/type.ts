import type { ComponentPropsWithoutRef } from 'react'

import type { ButtonVariantProps } from './ButtonBase'

// ButtonBase の型を再エクスポート
export type { ButtonBaseProps, ButtonVariantProps } from './ButtonBase'

/**
 * Button コンポーネントの Props 型定義
 */
export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonVariantProps
