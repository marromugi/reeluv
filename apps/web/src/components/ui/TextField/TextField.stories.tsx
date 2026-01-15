import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { TextField } from './TextField'

const meta = {
  title: 'UI/TextField',
  component: TextField,
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
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
    readOnly: {
      control: 'boolean',
      description: '読み取り専用',
    },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

/**
 * デフォルトのテキストフィールド（md / outlined / default）
 */
export const Default: Story = {
  args: {
    placeholder: 'テキストを入力',
  },
}

/**
 * Outlined スタイル - デフォルト状態
 */
export const OutlinedDefault: Story = {
  args: {
    variant: 'outlined',
    state: 'default',
    placeholder: 'Outlined Default',
  },
}

/**
 * Outlined スタイル - エラー状態
 */
export const OutlinedError: Story = {
  args: {
    variant: 'outlined',
    state: 'error',
    placeholder: 'Outlined Error',
  },
}

/**
 * Outlined スタイル - 成功状態
 */
export const OutlinedSuccess: Story = {
  args: {
    variant: 'outlined',
    state: 'success',
    placeholder: 'Outlined Success',
  },
}

/**
 * Filled スタイル - デフォルト状態
 */
export const FilledDefault: Story = {
  args: {
    variant: 'filled',
    state: 'default',
    placeholder: 'Filled Default',
  },
}

/**
 * Filled スタイル - エラー状態
 */
export const FilledError: Story = {
  args: {
    variant: 'filled',
    state: 'error',
    placeholder: 'Filled Error',
  },
}

/**
 * Filled スタイル - 成功状態
 */
export const FilledSuccess: Story = {
  args: {
    variant: 'filled',
    state: 'success',
    placeholder: 'Filled Success',
  },
}

/**
 * 小サイズ（sm）
 */
export const SizeSmall: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small',
  },
}

/**
 * 中サイズ（md）- デフォルト
 */
export const SizeMedium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium',
  },
}

/**
 * 大サイズ（lg）
 */
export const SizeLarge: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large',
  },
}

/**
 * 無効状態のテキストフィールド
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '無効',
  },
}

/**
 * 読み取り専用のテキストフィールド
 */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: '読み取り専用',
  },
}

/**
 * 入力値のインタラクションテスト
 */
export const InteractionTest: Story = {
  args: {
    placeholder: 'テキストを入力してください',
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('テキストを入力してください')

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
 * 全バリアント一覧
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {/* Outlined */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Outlined</h3>
        <div className="flex flex-col gap-4">
          <TextField variant="outlined" state="default" placeholder="Default" />
          <TextField variant="outlined" state="error" placeholder="Error" />
          <TextField variant="outlined" state="success" placeholder="Success" />
        </div>
      </div>

      {/* Filled */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Filled</h3>
        <div className="flex flex-col gap-4">
          <TextField variant="filled" state="default" placeholder="Default" />
          <TextField variant="filled" state="error" placeholder="Error" />
          <TextField variant="filled" state="success" placeholder="Success" />
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Sizes</h3>
        <div className="flex flex-col gap-4">
          <TextField size="sm" placeholder="Small" />
          <TextField size="md" placeholder="Medium" />
          <TextField size="lg" placeholder="Large" />
        </div>
      </div>

      {/* States */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">States</h3>
        <div className="flex flex-col gap-4">
          <TextField placeholder="通常状態" />
          <TextField placeholder="無効状態" disabled />
          <TextField defaultValue="読み取り専用" readOnly />
        </div>
      </div>
    </div>
  ),
}
