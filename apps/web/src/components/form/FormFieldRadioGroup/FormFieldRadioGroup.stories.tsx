'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { FormFieldRadioGroup } from './FormFieldRadioGroup'

import { RadioGroupItem } from '@/components/ui/RadioGroup'

const meta = {
  title: 'Form/FormFieldRadioGroup',
  component: FormFieldRadioGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'ラジオボタンのサイズ',
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'レイアウト方向',
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'ラベルとラジオグループの間隔',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
    required: {
      control: 'boolean',
      description: '必須マーク表示',
    },
  },
} satisfies Meta<typeof FormFieldRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

/**
 * デフォルトのラジオグループ
 */
export const Default: Story = {
  args: {
    label: 'プランを選択',
    name: 'plan',
    defaultValue: 'free',
  },
  render: (args) => (
    <FormFieldRadioGroup {...args}>
      <RadioGroupItem value="free" label="無料プラン" description="基本機能のみ" />
      <RadioGroupItem value="pro" label="プロプラン" description="全機能利用可能" />
      <RadioGroupItem value="enterprise" label="エンタープライズ" description="カスタムサポート付き" />
    </FormFieldRadioGroup>
  ),
}

/**
 * 必須マーク付き
 */
export const Required: Story = {
  args: {
    label: 'お支払い方法',
    name: 'payment',
    required: true,
  },
  render: (args) => (
    <FormFieldRadioGroup {...args}>
      <RadioGroupItem value="card" label="クレジットカード" />
      <RadioGroupItem value="bank" label="銀行振込" />
      <RadioGroupItem value="convenience" label="コンビニ払い" />
    </FormFieldRadioGroup>
  ),
}

/**
 * 水平レイアウト
 */
export const Horizontal: Story = {
  args: {
    label: '性別',
    name: 'gender',
    direction: 'horizontal',
  },
  render: (args) => (
    <FormFieldRadioGroup {...args}>
      <RadioGroupItem value="male" label="男性" />
      <RadioGroupItem value="female" label="女性" />
      <RadioGroupItem value="other" label="その他" />
    </FormFieldRadioGroup>
  ),
}

/**
 * サイズバリエーション
 */
export const Sizes: Story = {
  args: {
    name: 'sizes-demo',
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <FormFieldRadioGroup label="Small サイズ" name="size-sm" size="sm">
        <RadioGroupItem value="a" label="オプション A" />
        <RadioGroupItem value="b" label="オプション B" />
      </FormFieldRadioGroup>

      <FormFieldRadioGroup label="Medium サイズ" name="size-md" size="md">
        <RadioGroupItem value="a" label="オプション A" />
        <RadioGroupItem value="b" label="オプション B" />
      </FormFieldRadioGroup>

      <FormFieldRadioGroup label="Large サイズ" name="size-lg" size="lg">
        <RadioGroupItem value="a" label="オプション A" />
        <RadioGroupItem value="b" label="オプション B" />
      </FormFieldRadioGroup>
    </div>
  ),
}

/**
 * ギャップバリエーション
 */
export const Gaps: Story = {
  args: {
    name: 'gaps-demo',
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <FormFieldRadioGroup label="Gap: Small" name="gap-sm" gap="sm">
        <RadioGroupItem value="a" label="オプション A" />
        <RadioGroupItem value="b" label="オプション B" />
      </FormFieldRadioGroup>

      <FormFieldRadioGroup label="Gap: Medium" name="gap-md" gap="md">
        <RadioGroupItem value="a" label="オプション A" />
        <RadioGroupItem value="b" label="オプション B" />
      </FormFieldRadioGroup>

      <FormFieldRadioGroup label="Gap: Large" name="gap-lg" gap="lg">
        <RadioGroupItem value="a" label="オプション A" />
        <RadioGroupItem value="b" label="オプション B" />
      </FormFieldRadioGroup>
    </div>
  ),
}

/**
 * 無効状態
 */
export const Disabled: Story = {
  args: {
    label: '無効なグループ',
    name: 'disabled',
    disabled: true,
    defaultValue: 'a',
  },
  render: (args) => (
    <FormFieldRadioGroup {...args}>
      <RadioGroupItem value="a" label="オプション A" />
      <RadioGroupItem value="b" label="オプション B" />
    </FormFieldRadioGroup>
  ),
}

/**
 * インタラクションテスト
 */
export const InteractionTest: Story = {
  args: {
    label: 'テスト選択',
    name: 'test',
    onChange: fn(),
  },
  render: (args) => (
    <FormFieldRadioGroup {...args}>
      <RadioGroupItem value="option1" label="オプション 1" />
      <RadioGroupItem value="option2" label="オプション 2" />
    </FormFieldRadioGroup>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // オプション 2 をクリック
    const option2 = canvas.getByLabelText('オプション 2')
    await userEvent.click(option2)

    // onChange が呼ばれたことを確認
    await expect(args.onChange).toHaveBeenCalledWith('option2')

    // オプション 2 が選択されていることを確認
    await expect(option2).toBeChecked()
  },
}

/**
 * フォーム例
 */
export const FormExample: Story = {
  args: {
    name: 'form-demo',
  },
  render: () => (
    <form className="flex flex-col gap-6">
      <FormFieldRadioGroup label="プランを選択" name="plan" required defaultValue="free">
        <RadioGroupItem value="free" label="無料プラン" description="基本機能のみ" />
        <RadioGroupItem value="pro" label="プロプラン" description="全機能利用可能" />
      </FormFieldRadioGroup>

      <FormFieldRadioGroup label="お支払いサイクル" name="billing" required direction="horizontal">
        <RadioGroupItem value="monthly" label="月払い" />
        <RadioGroupItem value="yearly" label="年払い（20% OFF）" />
      </FormFieldRadioGroup>

      <FormFieldRadioGroup label="通知設定（任意）" name="notification">
        <RadioGroupItem value="all" label="すべて受け取る" />
        <RadioGroupItem value="important" label="重要なもののみ" />
        <RadioGroupItem value="none" label="受け取らない" />
      </FormFieldRadioGroup>
    </form>
  ),
}
