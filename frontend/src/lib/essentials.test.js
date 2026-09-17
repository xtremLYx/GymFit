import { describe, it, expect } from 'vitest'
import { ESSENTIAL_DATA, ESSENTIAL_IDS, isEssential, getEssentialMeta, getQuickSwaps } from './essentials.js'
import { EXIDX } from './exercises.js'

describe('S-Tier Essentials Engine', () => {
  it('every essential ID exists in EXIDX', () => {
    for (const id of ESSENTIAL_IDS) {
      expect(EXIDX[id]).toBeDefined()
      expect(EXIDX[id].n).toBeTruthy()
    }
  })

  it('every substitute ID in ESSENTIAL_DATA exists in EXIDX', () => {
    for (const [id, meta] of Object.entries(ESSENTIAL_DATA)) {
      for (const subId of meta.substitutes || []) {
        expect(EXIDX[subId], `Substitute ${subId} for ${id} should exist`).toBeDefined()
      }
    }
  })

  it('isEssential and getEssentialMeta identify essentials', () => {
    expect(isEssential('0025')).toBe(true)
    expect(isEssential('999999')).toBe(false)

    const meta = getEssentialMeta('0025')
    expect(meta).not.toBeNull()
    expect(meta.badge).toContain('Compound')
    expect(meta.why).toBeTruthy()
  })

  it('getQuickSwaps returns valid substitutes matching equipment', () => {
    const swaps = getQuickSwaps('0025', ['dumbbell', 'body weight'])
    expect(swaps.length).toBeGreaterThan(0)
    for (const s of swaps) {
      expect(['dumbbell', 'body weight']).toContain(s.ex.eq)
    }
  })

  it('getQuickSwaps filters out excluded equipment and finds alternatives', () => {
    // 0585 is Leg Extension (leverage machine)
    const swaps = getQuickSwaps('0585', null, ['leverage machine'])
    expect(swaps.length).toBeGreaterThan(0)
    for (const s of swaps) {
      expect(s.ex.eq).not.toBe('leverage machine')
    }
  })
})
