import type { Action, State, TimelineClipItem } from './type'

import type { ShowReelClip } from '@/client/api/model'


/** ユニークIDを生成するカウンター */
let uidCounter = 0

/** ユニークIDを生成する */
const generateUid = () => `clip-${++uidCounter}`

/** クリップ配列にユニークIDを付与する */
export const assignUids = (clips: ShowReelClip[]): TimelineClipItem[] =>
  clips.map((clip) => ({ ...clip, uid: generateUid() }))

/** リデューサー */
export const reducer = (_state: State, action: Action): State => {
  switch (action.type) {
    case 'reorder':
      return { localOrder: action.clips }
    case 'reset':
      return { localOrder: null }
  }
}
