'use client'

import { useCallback, useState } from 'react'
import { useSWRConfig } from 'swr'

import type {
  CreateShowReelRequestVideoDefinition,
  CreateShowReelRequestVideoStandard,
} from '@/client/api/model'
import { getGetApiReelsKey, usePostApiReels } from '@/client/api/reel/reel'

type UseCreateReelFormOptions = {
  onSuccess?: () => void
}

/**
 * ショーリール作成フォームのロジックを管理するフック
 */
export const useCreateReelForm = ({ onSuccess }: UseCreateReelFormOptions = {}) => {
  const [name, setName] = useState('')
  const [videoStandard, setVideoStandard] = useState<CreateShowReelRequestVideoStandard>('NTSC')
  const [videoDefinition, setVideoDefinition] = useState<CreateShowReelRequestVideoDefinition>('HD')

  const { mutate } = useSWRConfig()
  const { trigger, isMutating } = usePostApiReels()

  const reset = useCallback(() => {
    setName('')
    setVideoStandard('NTSC')
    setVideoDefinition('HD')
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return

    await trigger({
      name: name.trim(),
      videoStandard,
      videoDefinition,
    })

    // リスト再取得
    await mutate(getGetApiReelsKey())

    reset()
    onSuccess?.()
  }, [name, videoStandard, videoDefinition, trigger, mutate, reset, onSuccess])

  return {
    name,
    setName,
    videoStandard,
    setVideoStandard,
    videoDefinition,
    setVideoDefinition,
    handleSubmit,
    isSubmitting: isMutating,
    reset,
  }
}
