import type { ComponentPropsWithoutRef } from 'react'

import type { FormFieldContainerVariantProps } from '@/components/ui/FormField'
import type { TextFieldVariantProps } from '@/components/ui/TextField'

/** FormFieldTextField のバリアント Props 型 */
export type FormFieldTextFieldVariantProps = TextFieldVariantProps & FormFieldContainerVariantProps

/**
 * FormFieldTextField コンポーネントの Props 型定義
 */
export type FormFieldTextFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> &
  FormFieldTextFieldVariantProps & {
    /** ラベルテキスト */
    label?: string
    /** 必須マーク（*）を表示 */
    required?: boolean
  }
