import { Icon } from '../../Icon'
import { buttonIconSizeMap, buttonVariants } from '../const'

import type { ButtonBaseProps } from './type'

/**
 * ButtonBase コンポーネント
 * スタイルとアイコンのレンダリングのみを担当し、要素の種類は外部から注入可能
 *
 * @example
 * ```tsx
 * // 通常のボタンとして使用
 * <ButtonBase as="button" theme="primary">ボタン</ButtonBase>
 *
 * // Link でラップして使用
 * <Link href="/path">
 *   <ButtonBase as="span" theme="primary">リンクボタン</ButtonBase>
 * </Link>
 * ```
 */
export const ButtonBase = <T extends React.ElementType = 'span'>({
  as,
  theme,
  variant,
  size,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonBaseProps<T>) => {
  const Component = as || 'span'
  const iconSize = buttonIconSizeMap[size ?? 'md']

  return (
    <Component
      className={buttonVariants({ theme, variant, size, className })}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <Icon icon={leftIcon} size={iconSize} disabled={disabled} />}
      {children}
      {rightIcon && <Icon icon={rightIcon} size={iconSize} disabled={disabled} />}
    </Component>
  )
}
