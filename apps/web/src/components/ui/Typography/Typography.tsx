import { typographyVariants } from './const'
import type { TypographyProps } from './type'

/**
 * Typography コンポーネント
 * テキストのスタイリングを担当し、要素の種類は外部から注入可能
 *
 * @example
 * ```tsx
 * // 通常の本文テキスト
 * <Typography>本文テキスト</Typography>
 *
 * // 説明文として使用
 * <Typography variant="description" size="sm">説明文</Typography>
 *
 * // 見出しとして使用
 * <Typography as="h1" size="xl" weight="bold">見出し</Typography>
 *
 * // ラベルとして使用
 * <Typography as="label" htmlFor="input-id">ラベル</Typography>
 * ```
 */
export const Typography = <T extends React.ElementType = 'span'>({
  as,
  variant,
  size,
  weight,
  children,
  className,
  ...props
}: TypographyProps<T>) => {
  const Component = as || 'span'

  return (
    <Component className={typographyVariants({ variant, size, weight, className })} {...props}>
      {children}
    </Component>
  )
}
