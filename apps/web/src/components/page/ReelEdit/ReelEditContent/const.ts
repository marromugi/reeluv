import { tv } from 'tailwind-variants'

/** ReelEditContent のスタイル定義 */
export const reelEditContentVariants = tv({
  slots: {
    container: 'flex h-dvh flex-col',
    mainArea: 'flex flex-1 overflow-hidden',
  },
})
