import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { RadioGroup } from './RadioGroup'
import { RadioGroupItem } from './RadioGroupItem'

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'レイアウト方向',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'サイズ',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

/**
 * デフォルトのRadioGroup（vertical / md）
 */
export const Default: Story = {
  args: {
    name: 'default',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
}

/**
 * 水平レイアウト
 */
export const Horizontal: Story = {
  args: {
    name: 'horizontal',
    direction: 'horizontal',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
}

/**
 * 垂直レイアウト
 */
export const Vertical: Story = {
  args: {
    name: 'vertical',
    direction: 'vertical',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
}

/**
 * 小サイズ（sm）
 */
export const SizeSmall: Story = {
  args: {
    name: 'size-small',
    size: 'sm',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
}

/**
 * 中サイズ（md）- デフォルト
 */
export const SizeMedium: Story = {
  args: {
    name: 'size-medium',
    size: 'md',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
}

/**
 * 大サイズ（lg）
 */
export const SizeLarge: Story = {
  args: {
    name: 'size-large',
    size: 'lg',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
}

/**
 * 説明文付きアイテム
 */
export const WithDescription: Story = {
  args: {
    name: 'with-description',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="free" label="無料プラン" description="基本機能のみ利用可能" />
      <RadioGroupItem
        value="pro"
        label="プロプラン"
        description="全機能利用可能、優先サポート付き"
      />
      <RadioGroupItem
        value="enterprise"
        label="エンタープライズ"
        description="カスタマイズ可能、専任サポート付き"
      />
    </RadioGroup>
  ),
}

/**
 * 説明文なしアイテム
 */
export const WithoutDescription: Story = {
  args: {
    name: 'without-description',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
}

/**
 * グループ全体の無効状態
 */
export const DisabledGroup: Story = {
  args: {
    name: 'disabled-group',
    disabled: true,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
}

/**
 * 個別アイテムの無効状態
 */
export const DisabledItem: Story = {
  args: {
    name: 'disabled-item',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2（無効）" disabled />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
}

/**
 * 制御コンポーネント
 */
export const Controlled: Story = {
  args: {
    name: 'controlled',
  },
  render: function ControlledRadioGroup(args) {
    const [value, setValue] = useState('option1')

    return (
      <div className="flex flex-col gap-4">
        <RadioGroup {...args} value={value} onChange={setValue}>
          <RadioGroupItem value="option1" label="オプション1" />
          <RadioGroupItem value="option2" label="オプション2" />
          <RadioGroupItem value="option3" label="オプション3" />
        </RadioGroup>
        <p className="text-sm text-neutral-500">選択中: {value}</p>
      </div>
    )
  },
}

/**
 * 非制御コンポーネント
 */
export const Uncontrolled: Story = {
  args: {
    name: 'uncontrolled',
    defaultValue: 'option2',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
}

/**
 * 全バリアント一覧
 */
export const AllVariants: Story = {
  args: {
    name: 'all-variants',
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {/* Direction */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Direction</h3>
        <div className="flex gap-8">
          <div>
            <p className="mb-2 text-sm text-neutral-500">Vertical</p>
            <RadioGroup name="direction-vertical" direction="vertical">
              <RadioGroupItem value="option1" label="オプション1" />
              <RadioGroupItem value="option2" label="オプション2" />
            </RadioGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-neutral-500">Horizontal</p>
            <RadioGroup name="direction-horizontal" direction="horizontal">
              <RadioGroupItem value="option1" label="オプション1" />
              <RadioGroupItem value="option2" label="オプション2" />
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Sizes</h3>
        <div className="flex gap-8">
          <div>
            <p className="mb-2 text-sm text-neutral-500">Small</p>
            <RadioGroup name="size-sm" size="sm">
              <RadioGroupItem value="option1" label="オプション1" />
              <RadioGroupItem value="option2" label="オプション2" />
            </RadioGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-neutral-500">Medium</p>
            <RadioGroup name="size-md" size="md">
              <RadioGroupItem value="option1" label="オプション1" />
              <RadioGroupItem value="option2" label="オプション2" />
            </RadioGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-neutral-500">Large</p>
            <RadioGroup name="size-lg" size="lg">
              <RadioGroupItem value="option1" label="オプション1" />
              <RadioGroupItem value="option2" label="オプション2" />
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* With Description */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">With Description</h3>
        <RadioGroup name="with-desc">
          <RadioGroupItem value="free" label="無料プラン" description="基本機能のみ" />
          <RadioGroupItem value="pro" label="プロプラン" description="全機能利用可能" />
        </RadioGroup>
      </div>

      {/* Disabled */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Disabled</h3>
        <RadioGroup name="disabled" disabled>
          <RadioGroupItem value="option1" label="オプション1" />
          <RadioGroupItem value="option2" label="オプション2" />
        </RadioGroup>
      </div>
    </div>
  ),
}

/**
 * インタラクションテスト - クリック選択
 */
export const InteractionTest: Story = {
  args: {
    name: 'interaction-test',
    onChange: fn(),
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // 最初のラジオボタンをクリック
    const firstOption = canvas.getByLabelText('オプション1')
    await userEvent.click(firstOption)

    // onChange が呼ばれたことを確認
    await expect(args.onChange).toHaveBeenCalledWith('option1')

    // 選択状態を確認
    await expect(firstOption).toBeChecked()

    // 2番目のオプションをクリック
    const secondOption = canvas.getByLabelText('オプション2')
    await userEvent.click(secondOption)

    // 選択が切り替わったことを確認
    await expect(secondOption).toBeChecked()
    await expect(firstOption).not.toBeChecked()
  },
}

/**
 * インタラクションテスト - 無効状態
 */
export const DisabledInteractionTest: Story = {
  args: {
    name: 'disabled-interaction-test',
    disabled: true,
    onChange: fn(),
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // 無効状態のラジオボタンをクリック
    const option = canvas.getByLabelText('オプション1')
    await userEvent.click(option)

    // onChange が呼ばれないことを確認
    await expect(args.onChange).not.toHaveBeenCalled()
  },
}

/**
 * インタラクションテスト - キーボードナビゲーション
 */
export const KeyboardNavigationTest: Story = {
  args: {
    name: 'keyboard-test',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション1" />
      <RadioGroupItem value="option2" label="オプション2" />
      <RadioGroupItem value="option3" label="オプション3" />
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Tabでフォーカス
    const firstOption = canvas.getByLabelText('オプション1')
    await userEvent.tab()
    await expect(firstOption).toHaveFocus()

    // Spaceで選択
    await userEvent.keyboard(' ')
    await expect(firstOption).toBeChecked()

    // Arrow Downで次のオプションに移動
    await userEvent.keyboard('{ArrowDown}')
    const secondOption = canvas.getByLabelText('オプション2')
    await expect(secondOption).toHaveFocus()
  },
}
