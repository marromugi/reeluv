import type { ComponentPropsWithoutRef } from 'react'
import type { VariantProps } from 'tailwind-variants'

import type { textFieldVariants } from './const'

/** TextField のバリアント Props 型 */
export type TextFieldVariantProps = VariantProps<typeof textFieldVariants>

/**
 * TextField コンポーネントの Props 型定義
 */
export type TextFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & TextFieldVariantProps
