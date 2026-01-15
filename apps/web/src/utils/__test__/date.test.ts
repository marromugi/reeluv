import { describe, expect, it, vi, afterEach } from 'vitest'

import { formatRelativeTime } from '../date'

describe('formatRelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('今日の日付の場合「今日」を返す', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00'))

    expect(formatRelativeTime('2024-01-15T10:00:00')).toBe('今日')
  })

  it('1日前の場合「1日前」を返す', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00'))

    expect(formatRelativeTime('2024-01-14T12:00:00')).toBe('1日前')
  })

  it('2〜6日前の場合「X日前」を返す', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00'))

    expect(formatRelativeTime('2024-01-13T12:00:00')).toBe('2日前')
    expect(formatRelativeTime('2024-01-10T12:00:00')).toBe('5日前')
  })

  it('7〜29日前の場合「X週間前」を返す', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00'))

    expect(formatRelativeTime('2024-01-08T12:00:00')).toBe('1週間前')
    expect(formatRelativeTime('2024-01-01T12:00:00')).toBe('2週間前')
  })

  it('30〜364日前の場合「Xヶ月前」を返す', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00'))

    expect(formatRelativeTime('2023-12-15T12:00:00')).toBe('1ヶ月前')
    expect(formatRelativeTime('2023-07-15T12:00:00')).toBe('6ヶ月前')
  })

  it('365日以上前の場合「X年前」を返す', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00'))

    expect(formatRelativeTime('2023-01-14T12:00:00')).toBe('1年前')
    expect(formatRelativeTime('2022-01-15T12:00:00')).toBe('2年前')
  })
})
