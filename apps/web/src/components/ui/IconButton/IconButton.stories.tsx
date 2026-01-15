import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { AddFill } from '../../icon/AddFill'

import { IconButton } from './IconButton'

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['primary', 'secondary', 'alert'],
      description: 'ボタンのテーマカラー',
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: 'ボタンのスタイルバリアント',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'ボタンのサイズ',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * デフォルトのアイコンボタン（primary / solid / md）
 */
export const Default: Story = {
  args: {
    icon: AddFill,
    'aria-label': '追加',
  },
}

/**
 * Primary テーマ - Solid バリアント
 */
export const PrimarySolid: Story = {
  args: {
    icon: AddFill,
    theme: 'primary',
    variant: 'solid',
    'aria-label': '追加',
  },
}

/**
 * Primary テーマ - Outline バリアント
 */
export const PrimaryOutline: Story = {
  args: {
    icon: AddFill,
    theme: 'primary',
    variant: 'outline',
    'aria-label': '追加',
  },
}

/**
 * Primary テーマ - Ghost バリアント
 */
export const PrimaryGhost: Story = {
  args: {
    icon: AddFill,
    theme: 'primary',
    variant: 'ghost',
    'aria-label': '追加',
  },
}

/**
 * Secondary テーマ - Solid バリアント
 */
export const SecondarySolid: Story = {
  args: {
    icon: AddFill,
    theme: 'secondary',
    variant: 'solid',
    'aria-label': '追加',
  },
}

/**
 * Secondary テーマ - Outline バリアント
 */
export const SecondaryOutline: Story = {
  args: {
    icon: AddFill,
    theme: 'secondary',
    variant: 'outline',
    'aria-label': '追加',
  },
}

/**
 * Secondary テーマ - Ghost バリアント
 */
export const SecondaryGhost: Story = {
  args: {
    icon: AddFill,
    theme: 'secondary',
    variant: 'ghost',
    'aria-label': '追加',
  },
}

/**
 * Alert テーマ - Solid バリアント
 */
export const AlertSolid: Story = {
  args: {
    icon: AddFill,
    theme: 'alert',
    variant: 'solid',
    'aria-label': '削除',
  },
}

/**
 * Alert テーマ - Outline バリアント
 */
export const AlertOutline: Story = {
  args: {
    icon: AddFill,
    theme: 'alert',
    variant: 'outline',
    'aria-label': '削除',
  },
}

/**
 * Alert テーマ - Ghost バリアント
 */
export const AlertGhost: Story = {
  args: {
    icon: AddFill,
    theme: 'alert',
    variant: 'ghost',
    'aria-label': '削除',
  },
}

/**
 * 極小サイズ（xs）- 24px
 */
export const SizeXSmall: Story = {
  args: {
    icon: AddFill,
    size: 'xs',
    'aria-label': '追加',
  },
}

/**
 * 小サイズ（sm）- 32px
 */
export const SizeSmall: Story = {
  args: {
    icon: AddFill,
    size: 'sm',
    'aria-label': '追加',
  },
}

/**
 * 中サイズ（md）- 40px - デフォルト
 */
export const SizeMedium: Story = {
  args: {
    icon: AddFill,
    size: 'md',
    'aria-label': '追加',
  },
}

/**
 * 大サイズ（lg）- 48px
 */
export const SizeLarge: Story = {
  args: {
    icon: AddFill,
    size: 'lg',
    'aria-label': '追加',
  },
}

/**
 * 無効状態のアイコンボタン
 */
export const Disabled: Story = {
  args: {
    icon: AddFill,
    disabled: true,
    'aria-label': '追加（無効）',
  },
}

/**
 * 全バリアント一覧
 */
export const AllVariants: Story = {
  args: {
    icon: AddFill,
    disabled: true,
    'aria-label': '追加（無効）',
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {/* Primary */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Primary</h3>
        <div className="flex gap-4">
          <IconButton icon={AddFill} theme="primary" variant="solid" aria-label="追加" />
          <IconButton icon={AddFill} theme="primary" variant="outline" aria-label="追加" />
          <IconButton icon={AddFill} theme="primary" variant="ghost" aria-label="追加" />
        </div>
      </div>

      {/* Secondary */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Secondary</h3>
        <div className="flex gap-4">
          <IconButton icon={AddFill} theme="secondary" variant="solid" aria-label="追加" />
          <IconButton icon={AddFill} theme="secondary" variant="outline" aria-label="追加" />
          <IconButton icon={AddFill} theme="secondary" variant="ghost" aria-label="追加" />
        </div>
      </div>

      {/* Alert */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Alert</h3>
        <div className="flex gap-4">
          <IconButton icon={AddFill} theme="alert" variant="solid" aria-label="削除" />
          <IconButton icon={AddFill} theme="alert" variant="outline" aria-label="削除" />
          <IconButton icon={AddFill} theme="alert" variant="ghost" aria-label="削除" />
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Sizes</h3>
        <div className="flex items-center gap-4">
          <IconButton icon={AddFill} size="xs" aria-label="追加" />
          <IconButton icon={AddFill} size="sm" aria-label="追加" />
          <IconButton icon={AddFill} size="md" aria-label="追加" />
          <IconButton icon={AddFill} size="lg" aria-label="追加" />
        </div>
      </div>

      {/* Disabled */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Disabled</h3>
        <div className="flex gap-4">
          <IconButton icon={AddFill} theme="primary" variant="solid" disabled aria-label="無効" />
          <IconButton icon={AddFill} theme="primary" variant="outline" disabled aria-label="無効" />
          <IconButton icon={AddFill} theme="primary" variant="ghost" disabled aria-label="無効" />
        </div>
      </div>
    </div>
  ),
}
