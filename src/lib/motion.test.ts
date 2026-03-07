import { describe, expect, it } from 'vitest'
import { fadeUp, stagger } from './motion'

describe('motion variants', () => {
  it('fadeUp has correct initial and animate states', () => {
    expect(fadeUp.hidden).toEqual({ opacity: 0, y: 12 })
    expect(fadeUp.visible).toEqual({ opacity: 1, y: 0 })
  })

  it('stagger has correct transition config', () => {
    expect(stagger.visible.transition).toEqual({ staggerChildren: 0.08 })
  })
})
