import type { ComponentPropsWithoutRef } from 'react'
import type { VariantProps } from 'tailwind-variants'

import type { formFieldContainerVariants } from './const'

/** FormFieldContainer のバリアント Props 型 */
export type FormFieldContainerVariantProps = VariantProps<typeof formFieldContainerVariants>

/**
 * FormFieldContainer コンポーネントの Props 型定義
 */
export type FormFieldContainerProps = ComponentPropsWithoutRef<'div'> & FormFieldContainerVariantProps
