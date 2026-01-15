import { ButtonBase } from './ButtonBase'
import { buttonVariants } from './const'
import type { ButtonProps } from './type'

// buttonVariants を再エクスポート
export { buttonVariants }

/**
 * Button コンポーネント
 * HTMLのbutton要素をレンダリングする
 *
 * @example
 * ```tsx
 * <Button theme="primary" variant="solid" size="md">
 *   ボタン
 * </Button>
 * ```
 */
export const Button = ({
  theme,
  variant,
  size,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <ButtonBase
      as="button"
      theme={theme}
      variant={variant}
      size={size}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      className={className}
      {...props}
    >
      {children}
    </ButtonBase>
  )
}
