import { iconButtonVariants } from './const'
import { IconButtonBase } from './IconButtonBase'
import type { IconButtonProps } from './type'

// iconButtonVariants を再エクスポート
export { iconButtonVariants }

/**
 * IconButton コンポーネント
 * HTMLのbutton要素をレンダリングするアイコンのみのボタン
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={AddFill}
 *   theme="primary"
 *   variant="solid"
 *   size="md"
 *   aria-label="追加"
 * />
 * ```
 */
export const IconButton = ({
  theme,
  variant,
  size,
  icon,
  className,
  ...props
}: IconButtonProps) => {
  return (
    <IconButtonBase
      as="button"
      theme={theme}
      variant={variant}
      size={size}
      icon={icon}
      className={className}
      {...props}
    />
  )
}
