import type { FormFieldContainerVariantProps } from '@/components/ui/FormField'
import type { RadioGroupProps } from '@/components/ui/RadioGroup'

/** FormFieldRadioGroup のバリアント Props 型 */
export type FormFieldRadioGroupVariantProps = FormFieldContainerVariantProps

/**
 * FormFieldRadioGroup コンポーネントの Props 型定義
 */
export type FormFieldRadioGroupProps = RadioGroupProps &
  FormFieldRadioGroupVariantProps & {
    /** ラベルテキスト */
    label?: string
    /** 必須マーク（*）を表示 */
    required?: boolean
  }
