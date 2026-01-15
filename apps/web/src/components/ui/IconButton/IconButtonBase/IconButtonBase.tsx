import { Icon } from '../../Icon'
import { iconButtonIconSizeMap, iconButtonVariants } from '../const'

import type { IconButtonBaseProps } from './type'

/**
 * IconButtonBase コンポーネント
 * スタイルとアイコンのレンダリングのみを担当し、要素の種類は外部から注入可能
 *
 * @example
 * ```tsx
 * // 通常のボタンとして使用
 * <IconButtonBase as="button" icon={AddFill} theme="primary" aria-label="追加" />
 *
 * // Link でラップして使用
 * <Link href="/path">
 *   <IconButtonBase as="span" icon={AddFill} theme="primary" aria-label="追加" />
 * </Link>
 * ```
 */
export const IconButtonBase = <T extends React.ElementType = 'span'>({
  as,
  theme,
  variant,
  size,
  icon,
  className,
  disabled,
  ...props
}: IconButtonBaseProps<T>) => {
  const Component = as || 'span'
  const iconSize = iconButtonIconSizeMap[size ?? 'md']

  return (
    <Component
      className={iconButtonVariants({ theme, variant, size, className })}
      disabled={disabled}
      {...props}
    >
      <Icon icon={icon} size={iconSize} disabled={disabled} />
    </Component>
  )
}
