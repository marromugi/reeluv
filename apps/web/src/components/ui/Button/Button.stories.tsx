import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { AddFill } from '../../icon/AddFill'

import { Button } from './Button'

const meta = {
  title: 'UI/Button',
  component: Button,
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
      options: ['sm', 'md', 'lg'],
      description: 'ボタンのサイズ',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * デフォルトのボタン（primary / solid / md）
 */
export const Default: Story = {
  args: {
    children: 'ボタン',
  },
}

/**
 * Primary テーマ - Solid バリアント
 */
export const PrimarySolid: Story = {
  args: {
    theme: 'primary',
    variant: 'solid',
    children: 'Primary Solid',
  },
}

/**
 * Primary テーマ - Outline バリアント
 */
export const PrimaryOutline: Story = {
  args: {
    theme: 'primary',
    variant: 'outline',
    children: 'Primary Outline',
  },
}

/**
 * Primary テーマ - Ghost バリアント
 */
export const PrimaryGhost: Story = {
  args: {
    theme: 'primary',
    variant: 'ghost',
    children: 'Primary Ghost',
  },
}

/**
 * Secondary テーマ - Solid バリアント
 */
export const SecondarySolid: Story = {
  args: {
    theme: 'secondary',
    variant: 'solid',
    children: 'Secondary Solid',
  },
}

/**
 * Secondary テーマ - Outline バリアント
 */
export const SecondaryOutline: Story = {
  args: {
    theme: 'secondary',
    variant: 'outline',
    children: 'Secondary Outline',
  },
}

/**
 * Secondary テーマ - Ghost バリアント
 */
export const SecondaryGhost: Story = {
  args: {
    theme: 'secondary',
    variant: 'ghost',
    children: 'Secondary Ghost',
  },
}

/**
 * Alert テーマ - Solid バリアント
 */
export const AlertSolid: Story = {
  args: {
    theme: 'alert',
    variant: 'solid',
    children: 'Alert Solid',
  },
}

/**
 * Alert テーマ - Outline バリアント
 */
export const AlertOutline: Story = {
  args: {
    theme: 'alert',
    variant: 'outline',
    children: 'Alert Outline',
  },
}

/**
 * Alert テーマ - Ghost バリアント
 */
export const AlertGhost: Story = {
  args: {
    theme: 'alert',
    variant: 'ghost',
    children: 'Alert Ghost',
  },
}

/**
 * 小サイズ（sm）
 */
export const SizeSmall: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
}

/**
 * 中サイズ（md）- デフォルト
 */
export const SizeMedium: Story = {
  args: {
    size: 'md',
    children: 'Medium',
  },
}

/**
 * 大サイズ（lg）
 */
export const SizeLarge: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
}

/**
 * 左アイコン付きボタン
 */
export const WithLeftIcon: Story = {
  args: {
    leftIcon: AddFill,
    children: '追加',
  },
}

/**
 * 右アイコン付きボタン
 */
export const WithRightIcon: Story = {
  args: {
    rightIcon: AddFill,
    children: '追加',
  },
}

/**
 * 両側アイコン付きボタン
 */
export const WithBothIcons: Story = {
  args: {
    leftIcon: AddFill,
    rightIcon: AddFill,
    children: '追加',
  },
}

/**
 * アイコン付き小サイズボタン（アイコンサイズ: 16px）
 */
export const IconSmall: Story = {
  args: {
    size: 'sm',
    leftIcon: AddFill,
    children: 'Small',
  },
}

/**
 * アイコン付き大サイズボタン（アイコンサイズ: 24px）
 */
export const IconLarge: Story = {
  args: {
    size: 'lg',
    leftIcon: AddFill,
    children: 'Large',
  },
}

/**
 * 無効状態のボタン
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: '無効',
  },
}

/**
 * 無効状態のアイコン付きボタン
 */
export const DisabledWithIcon: Story = {
  args: {
    disabled: true,
    leftIcon: AddFill,
    children: '無効',
  },
}

/**
 * 全バリアント一覧
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {/* Primary */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Primary</h3>
        <div className="flex gap-4">
          <Button theme="primary" variant="solid">
            Solid
          </Button>
          <Button theme="primary" variant="outline">
            Outline
          </Button>
          <Button theme="primary" variant="ghost">
            Ghost
          </Button>
        </div>
      </div>

      {/* Secondary */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Secondary</h3>
        <div className="flex gap-4">
          <Button theme="secondary" variant="solid">
            Solid
          </Button>
          <Button theme="secondary" variant="outline">
            Outline
          </Button>
          <Button theme="secondary" variant="ghost">
            Ghost
          </Button>
        </div>
      </div>

      {/* Alert */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Alert</h3>
        <div className="flex gap-4">
          <Button theme="alert" variant="solid">
            Solid
          </Button>
          <Button theme="alert" variant="outline">
            Outline
          </Button>
          <Button theme="alert" variant="ghost">
            Ghost
          </Button>
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Sizes</h3>
        <div className="flex items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      {/* With Icons */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">With Icons</h3>
        <div className="flex items-center gap-4">
          <Button size="sm" leftIcon={AddFill}>
            Small
          </Button>
          <Button size="md" leftIcon={AddFill}>
            Medium
          </Button>
          <Button size="lg" leftIcon={AddFill}>
            Large
          </Button>
        </div>
      </div>
    </div>
  ),
}
