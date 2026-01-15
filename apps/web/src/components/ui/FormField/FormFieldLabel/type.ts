import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'

import type { formFieldLabelVariants } from './const'

/** FormFieldLabel のバリアント Props 型 */
export type FormFieldLabelVariantProps = VariantProps<typeof formFieldLabelVariants>

/**
 * FormFieldLabel コンポーネントの Props 型定義
 */
export type FormFieldLabelProps = ComponentPropsWithoutRef<'label'> &
  FormFieldLabelVariantProps & {
    /** 必須マーク（*）を表示 */
    required?: boolean
    /** ラベルテキスト */
    children: ReactNode
  }
