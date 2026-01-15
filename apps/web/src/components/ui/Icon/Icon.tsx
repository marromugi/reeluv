import { ICON_VARIANTS } from './const'
import type { IconProps } from './type'

/**
 * Icon コンポーネント
 *
 * @example
 * ```tsx
 * import { AddFill } from '@/components/icon/AddFill'
 *
 * <Icon icon={AddFill} size="md" />
 * ```
 */
export const Icon = ({ icon: IconComponent, size, disabled, className }: IconProps) => {
  return (
    <IconComponent
      className={ICON_VARIANTS({ size, className })}
      aria-hidden="true"
      aria-disabled={disabled}
    />
  )
}
