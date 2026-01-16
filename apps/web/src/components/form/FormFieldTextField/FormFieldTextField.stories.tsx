import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { FormFieldTextField } from './FormFieldTextField'

const meta = {
  title: 'Form/FormFieldTextField',
  component: FormFieldTextField,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'テキストフィールドのサイズ',
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
      description: 'テキストフィールドのスタイルバリアント',
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'テキストフィールドの状態',
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'ラベルと入力要素の間隔',
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
} satisfies Meta<typeof FormFieldTextField>

export default meta
type Story = StoryObj<typeof meta>

/**
 * デフォルトのフォームフィールド
 */
export const Default: Story = {
  args: {
    label: 'ラベル',
    placeholder: 'テキストを入力',
  },
}

/**
 * 必須マーク付きフォームフィールド
 */
export const Required: Story = {
  args: {
    label: '必須項目',
    placeholder: 'テキストを入力',
    required: true,
  },
}

/**
 * Outlined スタイル
 */
export const Outlined: Story = {
  args: {
    label: 'メールアドレス',
    placeholder: 'example@example.com',
    variant: 'outlined',
  },
}

/**
 * Filled スタイル
 */
export const Filled: Story = {
  args: {
    label: 'メールアドレス',
    placeholder: 'example@example.com',
    variant: 'filled',
  },
}

/**
 * エラー状態
 */
export const Error: Story = {
  args: {
    label: 'メールアドレス',
    placeholder: 'example@example.com',
    state: 'error',
  },
}

/**
 * 成功状態
 */
export const Success: Story = {
  args: {
    label: 'メールアドレス',
    placeholder: 'example@example.com',
    state: 'success',
  },
}

/**
 * サイズバリエーション
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <FormFieldTextField label="Small" placeholder="Small" size="sm" />
      <FormFieldTextField label="Medium" placeholder="Medium" size="md" />
      <FormFieldTextField label="Large" placeholder="Large" size="lg" />
    </div>
  ),
}

/**
 * ギャップバリエーション
 */
export const Gaps: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <FormFieldTextField label="Gap: Small" placeholder="gap-1" gap="sm" />
      <FormFieldTextField label="Gap: Medium" placeholder="gap-1.5" gap="md" />
      <FormFieldTextField label="Gap: Large" placeholder="gap-2" gap="lg" />
    </div>
  ),
}

/**
 * 無効状態
 */
export const Disabled: Story = {
  args: {
    label: '無効なフィールド',
    placeholder: '入力できません',
    disabled: true,
  },
}

/**
 * 入力値のインタラクションテスト
 */
export const InteractionTest: Story = {
  args: {
    label: 'テスト入力',
    placeholder: 'テキストを入力してください',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('テスト入力')

    // 入力をクリック
    await userEvent.click(input)

    // テキストを入力
    await userEvent.type(input, 'テスト')

    // onChange が呼ばれたことを確認
    await expect(args.onChange).toHaveBeenCalled()

    // 入力値を確認
    await expect(input).toHaveValue('テスト')
  },
}

/**
 * フォーム例
 */
export const FormExample: Story = {
  render: () => (
    <form className="flex flex-col gap-4">
      <FormFieldTextField label="メールアドレス" placeholder="example@example.com" required />
      <FormFieldTextField
        label="パスワード"
        placeholder="パスワードを入力"
        type="password"
        required
      />
      <FormFieldTextField label="自己紹介（任意）" placeholder="自己紹介を入力" />
    </form>
  ),
}
