import { describe, it, expect } from 'vitest'
import { generateDeterministicPlan, generateRoutineForMuscles } from './plan-generator.js'
import { EXIDX } from './exercises.js'

describe('Deterministic Plan Generator', () => {
  it('generates PPL split with 3 routines and valid exercises', () => {
    const routines = generateDeterministicPlan('ppl', ['barbell', 'dumbbell', 'cable', 'body weight'])
    expect(routines).toHaveLength(3)
    expect(routines[0].name).toBe('Push Day')
    expect(routines[1].name).toBe('Pull Day')
    expect(routines[2].name).toBe('Leg Day')

    for (const r of routines) {
      expect(r.ex.length).toBeGreaterThanOrEqual(4)
      expect(r.ex.length).toBeLessThanOrEqual(6)
      for (const item of r.ex) {
        expect(EXIDX[item.id]).toBeDefined()
        expect(item.sets).toBeGreaterThan(0)
        expect(item.reps).toBeGreaterThan(0)
      }
    }
  })

  it('generates Upper/Lower split', () => {
    const routines = generateDeterministicPlan('upperlower', ['dumbbell', 'body weight'])
    expect(routines).toHaveLength(2)
    expect(routines[0].name).toBe('Upper Body')
    expect(routines[1].name).toBe('Lower Body')
    for (const r of routines) {
      for (const item of r.ex) {
        expect(EXIDX[item.id]).toBeDefined()
      }
    }
  })

  it('generates Full Body split', () => {
    const routines = generateDeterministicPlan('fullbody')
    expect(routines).toHaveLength(2)
    for (const r of routines) {
      expect(r.ex.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('generates Classic 6-Day (Indian) split with Chest/Back/Legs', () => {
    const routines = generateDeterministicPlan('classic6', ['barbell', 'dumbbell', 'cable', 'body weight'])
    expect(routines).toHaveLength(3)
    expect(routines[0].name).toBe('Chest & Triceps')
    expect(routines[1].name).toBe('Back & Biceps')
    expect(routines[2].name).toBe('Legs & Shoulders')

    for (const r of routines) {
      expect(r.ex.length).toBeGreaterThanOrEqual(4)
      for (const item of r.ex) {
        expect(EXIDX[item.id]).toBeDefined()
      }
    }
  })

  it('strictly excludes machine gear when excludedEquipment is provided', () => {
    const routines = generateDeterministicPlan('classic6', ['barbell', 'dumbbell', 'leverage machine'], ['leverage machine'])
    for (const r of routines) {
      for (const item of r.ex) {
        const ex = EXIDX[item.id]
        expect(ex.eq).not.toBe('leverage machine')
      }
    }
  })

  it('generates routine for specific muscle selection', () => {
    const exList = generateRoutineForMuscles(['chest', 'triceps'], ['barbell', 'cable'])
    expect(exList.length).toBeGreaterThanOrEqual(2)
    for (const item of exList) {
      expect(EXIDX[item.id]).toBeDefined()
    }
  })
})
