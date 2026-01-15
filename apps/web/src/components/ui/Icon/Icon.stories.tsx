import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { AddFill } from '../../icon/AddFill'
import { Close } from '../../icon/Close'
import { MoreVert } from '../../icon/MoreVert'

import { Icon } from './Icon'

const meta = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'アイコンのサイズ（sm: 16px, md: 20px, lg: 24px）',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/**
 * デフォルトのアイコン（md: 20px）
 */
export const Default: Story = {
  args: {
    icon: AddFill,
  },
}

/**
 * 小サイズ（sm: 16px）
 */
export const SizeSmall: Story = {
  args: {
    icon: AddFill,
    size: 'sm',
  },
}

/**
 * 中サイズ（md: 20px）- デフォルト
 */
export const SizeMedium: Story = {
  args: {
    icon: AddFill,
    size: 'md',
  },
}

/**
 * 大サイズ（lg: 24px）
 */
export const SizeLarge: Story = {
  args: {
    icon: AddFill,
    size: 'lg',
  },
}

/**
 * 無効状態
 */
export const Disabled: Story = {
  args: {
    icon: AddFill,
    disabled: true,
  },
}

/**
 * 各種アイコン一覧
 */
export const IconGallery: Story = {
  args: {
    icon: AddFill,
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {/* サイズ比較 */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">サイズ比較</h3>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <Icon icon={AddFill} size="sm" />
            <span className="text-xs text-neutral-500">sm (16px)</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Icon icon={AddFill} size="md" />
            <span className="text-xs text-neutral-500">md (20px)</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Icon icon={AddFill} size="lg" />
            <span className="text-xs text-neutral-500">lg (24px)</span>
          </div>
        </div>
      </div>

      {/* アイコン一覧 */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">アイコン一覧</h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Icon icon={AddFill} size="lg" />
            <span className="text-xs text-neutral-500">AddFill</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Icon icon={Close} size="lg" />
            <span className="text-xs text-neutral-500">Close</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Icon icon={MoreVert} size="lg" />
            <span className="text-xs text-neutral-500">MoreVert</span>
          </div>
        </div>
      </div>
    </div>
  ),
}
