'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { headerSectionVariants } from './const'
import type { HeaderSectionProps } from './type'

import { ChevronLeft } from '@/components/icon'
import { IconButtonBase } from '@/components/ui/IconButton/IconButtonBase'
import { Typography } from '@/components/ui/Typography'

const styles = headerSectionVariants()

/**
 * ヘッダーセクション
 * リール名の表示と編集機能を提供
 */
export const HeaderSection = ({ name, onUpdateName, isUpdating }: HeaderSectionProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  // 名前が変更されたらeditValueを更新
  useEffect(() => {
    setEditValue(name)
  }, [name])

  // 編集モードに入ったらフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  /** 編集を開始 */
  const startEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  /** 編集をキャンセル */
  const cancelEdit = useCallback(() => {
    setEditValue(name)
    setIsEditing(false)
  }, [name])

  /** 編集を保存 */
  const saveEdit = useCallback(async () => {
    const trimmed = editValue.trim()
    if (!trimmed || trimmed === name) {
      cancelEdit()
      return
    }
    await onUpdateName(trimmed)
    setIsEditing(false)
  }, [editValue, name, onUpdateName, cancelEdit])

  /** キー入力ハンドラ */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        saveEdit()
      } else if (e.key === 'Escape') {
        cancelEdit()
      }
    },
    [saveEdit, cancelEdit]
  )

  return (
    <div className={styles.container()}>
      <Link href="/reels">
        <IconButtonBase
          as="span"
          icon={ChevronLeft}
          theme="secondary"
          variant="ghost"
          size="lg"
          aria-label="戻る"
        />
      </Link>
      <div className={styles.titleWrapper()}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            disabled={isUpdating}
            className={styles.input()}
          />
        ) : (
          <button type="button" onClick={startEdit} className={styles.titleButton()}>
            <Typography as="span" size="md" weight="semibold">
              {name || 'リール名をここに'}
            </Typography>
          </button>
        )}
      </div>
      <div className={styles.spacer()} />
    </div>
  )
}
