import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ReelEditContent } from './ReelEditContent'

import type {
  CompatibleClipsResponse,
  ShowReelClip,
  ShowReelDetailResponse,
} from '@/client/api/model'
import {
  getGetApiReelsIdCompatibleClipsMockHandler,
  getGetApiReelsIdMockHandler,
} from '@/client/api/reel/reel.msw'

/**
 * 仕様書（docs/spec.md）に基づくテストクリップデータ
 */
const TEST_CLIPS: Record<string, ShowReelClip> = {
  // PAL SD クリップ
  budLight: {
    id: 'clip-bud-light',
    name: 'Bud Light',
    description: 'A factory is working on the new Bud Light Platinum.',
    videoStandard: 'PAL',
    videoDefinition: 'SD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:30:12',
    duration: '00:00:30:12',
  },
  audi: {
    id: 'clip-audi',
    name: 'Audi',
    description:
      'A group of vampires are having a party in the woods. The vampire in charge of drinks arrives in his Audi.',
    videoStandard: 'PAL',
    videoDefinition: 'SD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:01:30:00',
    duration: '00:01:30:00',
  },
  // NTSC SD クリップ
  mms: {
    id: 'clip-mms',
    name: "M&M's",
    description: 'At a party, a brown shelled M&M is mistaken for being naked.',
    videoStandard: 'NTSC',
    videoDefinition: 'SD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:15:27',
    duration: '00:00:15:27',
  },
  fiat: {
    id: 'clip-fiat',
    name: 'Fiat',
    description:
      'A man walks through a street to discover a beautiful woman standing on a parking space.',
    videoStandard: 'NTSC',
    videoDefinition: 'SD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:18:11',
    duration: '00:00:18:11',
  },
  pepsi: {
    id: 'clip-pepsi',
    name: 'Pepsi',
    description: 'People in the Middle Ages try to entertain their king (Elton John) for a Pepsi.',
    videoStandard: 'NTSC',
    videoDefinition: 'SD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:20:00',
    duration: '00:00:20:00',
  },
  // PAL HD クリップ
  bestBuy: {
    id: 'clip-best-buy',
    name: 'Best Buy',
    description:
      'An ad featuring the creators of the camera phone, Siri, and the first text message.',
    videoStandard: 'PAL',
    videoDefinition: 'HD',
    startTimecode: '00:00:00:00',
    endTimecode: '00:00:10:05',
    duration: '00:00:10:05',
  },
}

/**
 * PAL SD リール（空）
 */
const mockPalSdReelEmpty: ShowReelDetailResponse = {
  data: {
    id: 'reel-pal-sd',
    name: 'PAL SD Commercial Reel',
    videoStandard: 'PAL',
    videoDefinition: 'SD',
    clips: [],
    clipCount: 0,
    totalDuration: '00:00:00:00',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
}

/**
 * PAL SD リール（1クリップ）
 */
const mockPalSdReelWithOneClip: ShowReelDetailResponse = {
  data: {
    ...mockPalSdReelEmpty.data,
    clips: [TEST_CLIPS.budLight],
    clipCount: 1,
    totalDuration: '00:00:30:12',
  },
}

/**
 * PAL SD リール（全クリップ追加後）
 * 仕様書 Acceptance Test #3: 総再生時間 00:02:00:12
 */
const mockPalSdReelFull: ShowReelDetailResponse = {
  data: {
    ...mockPalSdReelEmpty.data,
    clips: [TEST_CLIPS.budLight, TEST_CLIPS.audi],
    clipCount: 2,
    totalDuration: '00:02:00:12',
  },
}

/**
 * NTSC SD リール（全クリップ追加後）
 * 仕様書 Acceptance Test #4: 総再生時間 00:00:54:08
 */
const mockNtscSdReelFull: ShowReelDetailResponse = {
  data: {
    id: 'reel-ntsc-sd',
    name: 'NTSC SD Commercial Reel',
    videoStandard: 'NTSC',
    videoDefinition: 'SD',
    clips: [TEST_CLIPS.mms, TEST_CLIPS.fiat, TEST_CLIPS.pepsi],
    clipCount: 3,
    totalDuration: '00:00:54:08',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
}

/**
 * PAL SD 用の互換クリップ
 */
const mockPalSdCompatibleClips: CompatibleClipsResponse = {
  data: {
    clips: [TEST_CLIPS.budLight, TEST_CLIPS.audi],
  },
}

/**
 * NTSC SD 用の互換クリップ
 */
// eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
const mockNtscSdCompatibleClips: CompatibleClipsResponse = {
  data: {
    clips: [TEST_CLIPS.mms, TEST_CLIPS.fiat, TEST_CLIPS.pepsi],
  },
}

/**
 * 空の互換クリップ（全て追加済み）
 */
const mockEmptyCompatibleClips: CompatibleClipsResponse = {
  data: {
    clips: [],
  },
}

const meta: Meta<typeof ReelEditContent> = {
  title: 'Page/ReelEditPage',
  component: ReelEditContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-neutral-900">
        <Story />
      </div>
    ),
  ],
  args: {
    reelId: 'reel-pal-sd',
  },
}

export default meta
type Story = StoryObj<typeof ReelEditContent>

/**
 * デフォルト表示（空のPAL SDリール）
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        getGetApiReelsIdMockHandler(mockPalSdReelEmpty),
        getGetApiReelsIdCompatibleClipsMockHandler(mockPalSdCompatibleClips),
      ],
    },
  },
}

/**
 * クリップが追加された状態
 */
export const WithClips: Story = {
  parameters: {
    msw: {
      handlers: [
        getGetApiReelsIdMockHandler(mockPalSdReelWithOneClip),
        getGetApiReelsIdCompatibleClipsMockHandler({
          data: {
            clips: [TEST_CLIPS.audi], // Bud Lightは追加済み
          },
        }),
      ],
    },
  },
}

/**
 * PAL SD リールに全クリップ追加済み
 * 仕様書 Acceptance Test #3 対応
 */
export const PalSdReelWithAllClips: Story = {
  parameters: {
    msw: {
      handlers: [
        getGetApiReelsIdMockHandler(mockPalSdReelFull),
        getGetApiReelsIdCompatibleClipsMockHandler(mockEmptyCompatibleClips),
      ],
    },
  },
}

/**
 * NTSC SD リールに全クリップ追加済み
 * 仕様書 Acceptance Test #4 対応
 */
export const NtscSdReelWithAllClips: Story = {
  args: {
    reelId: 'reel-ntsc-sd',
  },
  parameters: {
    msw: {
      handlers: [
        getGetApiReelsIdMockHandler(mockNtscSdReelFull),
        getGetApiReelsIdCompatibleClipsMockHandler(mockEmptyCompatibleClips),
      ],
    },
  },
}
