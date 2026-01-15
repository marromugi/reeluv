import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TextField } from './TextField'

describe('TextField', () => {
  it('基本的なレンダリング', () => {
    render(<TextField />)
    const input = screen.getByRole('textbox')
    expect(input).toBeTruthy()
  })

  it('placeholder 属性が反映されること', () => {
    render(<TextField placeholder="例: example@example.com" />)
    const input = screen.getByPlaceholderText('例: example@example.com')
    expect(input).toBeTruthy()
  })

  it('id 属性が反映されること', () => {
    render(<TextField id="username-input" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.id).toBe('username-input')
  })

  it('disabled 属性が反映されること', () => {
    render(<TextField disabled />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('ref が正しく転送されること', () => {
    const ref = { current: null }
    render(<TextField ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('size バリアントが sm のとき、適切なクラスが適用されること', () => {
    const { container } = render(<TextField size="sm" />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.className).toContain('h-10')
    expect(input.className).toContain('px-3')
    expect(input.className).toContain('text-sm')
    expect(input.className).toContain('rounded-md')
  })

  it('size バリアントが md のとき、適切なクラスが適用されること', () => {
    const { container } = render(<TextField size="md" />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.className).toContain('h-12')
    expect(input.className).toContain('px-4')
    expect(input.className).toContain('text-base')
    expect(input.className).toContain('rounded-lg')
  })

  it('size バリアントが lg のとき、適切なクラスが適用されること', () => {
    const { container } = render(<TextField size="lg" />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.className).toContain('h-14')
    expect(input.className).toContain('px-5')
    expect(input.className).toContain('text-lg')
    expect(input.className).toContain('rounded-xl')
  })

  it('variant が outlined のとき、border が表示されること', () => {
    const { container } = render(<TextField variant="outlined" />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.className).toContain('border')
  })

  it('variant が filled のとき、背景色が設定されること', () => {
    const { container } = render(<TextField variant="filled" />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.className).toContain('border-transparent')
  })

  it('state が error のとき、エラースタイルが適用されること', () => {
    const { container } = render(<TextField state="error" variant="outlined" />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.className).toContain('border-red-500')
  })

  it('state が success のとき、成功スタイルが適用されること', () => {
    const { container } = render(<TextField state="success" variant="outlined" />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.className).toContain('border-green-500')
  })

  it('カスタムクラスが追加されること', () => {
    const { container } = render(<TextField className="custom-class" />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.className).toContain('custom-class')
  })

  it('複数の HTML 属性が転送されること', () => {
    render(<TextField placeholder="プレースホルダー" required autoComplete="off" maxLength={50} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.placeholder).toBe('プレースホルダー')
    expect(input.required).toBe(true)
    expect(input.getAttribute('autocomplete')).toBe('off')
    expect(input.maxLength).toBe(50)
  })

  it('displayName が正しく設定されていること', () => {
    expect(TextField.displayName).toBe('TextField')
  })
})
