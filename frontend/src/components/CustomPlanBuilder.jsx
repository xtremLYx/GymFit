import { useState, useMemo } from 'react'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import BodyMap, { BodyMapLegend } from './BodyMap.jsx'
import { MUSCLES, MUSCLE_NAME } from '../lib/muscles.js'
import { generateRoutineForMuscles } from '../lib/plan-generator.js'
import { uid } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import { Button } from './ui.jsx'
import GeminiCustomizerModal from './GeminiCustomizerModal.jsx'

const PRIMARY_MUSCLE_OPTIONS = [
  { slug: 'chest', name: 'Chest', glyph: 'flame' },
  { slug: 'deltoids', name: 'Shoulders', glyph: 'arrowUp' },
  { slug: 'upper-back', name: 'Back & Lats', glyph: 'pullup' },
  { slug: 'biceps', name: 'Biceps', glyph: 'biceps' },
  { slug: 'triceps', name: 'Triceps', glyph: 'dumbbell' },
  { slug: 'quadriceps', name: 'Quads', glyph: 'legs' },
  { slug: 'hamstring', name: 'Hamstrings', glyph: 'legs' },
  { slug: 'gluteal', name: 'Glutes', glyph: 'legs' },
  { slug: 'calves', name: 'Calves', glyph: 'arrowUp' },
  { slug: 'abs', name: 'Abs & Core', glyph: 'target' }
]

const SPLIT_PRESETS = {
  3: [
    { name: 'Push Day', emoji: 'barbell', muscles: ['chest', 'deltoids', 'triceps'] },
    { name: 'Pull Day', emoji: 'pullup', muscles: ['upper-back', 'biceps'] },
    { name: 'Leg Day', emoji: 'legs', muscles: ['quadriceps', 'hamstring', 'gluteal', 'calves'] }
  ],
  4: [
    { name: 'Upper Body A', emoji: 'biceps', muscles: ['chest', 'upper-back', 'deltoids', 'biceps', 'triceps'] },
    { name: 'Lower Body A', emoji: 'legs', muscles: ['quadriceps', 'hamstring', 'gluteal', 'calves'] },
    { name: 'Upper Body B', emoji: 'barbell', muscles: ['chest', 'upper-back', 'deltoids', 'triceps'] },
    { name: 'Lower Body B', emoji: 'legs', muscles: ['quadriceps', 'hamstring', 'gluteal', 'abs'] }
  ],
  5: [
    { name: 'Chest & Triceps', emoji: 'flame', muscles: ['chest', 'triceps'] },
    { name: 'Back & Biceps', emoji: 'pullup', muscles: ['upper-back', 'biceps'] },
    { name: 'Legs (Quad Bias)', emoji: 'legs', muscles: ['quadriceps', 'calves', 'abs'] },
    { name: 'Shoulders & Arms', emoji: 'barbell', muscles: ['deltoids', 'biceps', 'triceps'] },
    { name: 'Legs (Hinges & Glutes)', emoji: 'legs', muscles: ['hamstring', 'gluteal'] }
  ],
  6: [
    { name: 'Chest & Triceps A', emoji: 'flame', muscles: ['chest', 'triceps'] },
    { name: 'Back & Biceps A', emoji: 'pullup', muscles: ['upper-back', 'biceps'] },
    { name: 'Legs & Shoulders A', emoji: 'legs', muscles: ['quadriceps', 'hamstring', 'deltoids', 'calves'] },
    { name: 'Chest & Triceps B', emoji: 'dumbbell', muscles: ['chest', 'triceps'] },
    { name: 'Back & Biceps B', emoji: 'barbell', muscles: ['upper-back', 'biceps'] },
    { name: 'Legs & Shoulders B', emoji: 'arrowUp', muscles: ['quadriceps', 'gluteal', 'deltoids', 'abs'] }
  ]
}

export default function CustomPlanBuilder({ close, onComplete }) {
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)
  const toast = useUI(s => s.toast)

  const [daysCount, setDaysCount] = useState(3)
  const [days, setDays] = useState(SPLIT_PRESETS[3])
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [showAiModal, setShowAiModal] = useState(false)
  const [selectedMuscle, setSelectedMuscle] = useState(null)

  const handleSplitChange = (count) => {
    setDaysCount(count)
    setDays(SPLIT_PRESETS[count] || SPLIT_PRESETS[3])
    setActiveDayIndex(0)
  }

  const toggleMuscleInDay = (dayIdx, slug) => {
    setDays(prev => prev.map((d, i) => {
      if (i !== dayIdx) return d
      const has = d.muscles.includes(slug)
      const muscles = has ? d.muscles.filter(m => m !== slug) : [...d.muscles, slug]
      return { ...d, muscles }
    }))
  }

  // Calculate live cumulative muscle load for the body heatmap
  const load = useMemo(() => {
    const l = {}
    days.forEach(d => {
      d.muscles.forEach(slug => {
        l[slug] = (l[slug] || 0) + 4 // 4 effective sets weight per trained group
      })
    })
    return l
  }, [days])

  // Coverage audit
  const neglected = useMemo(() => {
    const majorSlugs = ['chest', 'deltoids', 'upper-back', 'biceps', 'triceps', 'quadriceps', 'hamstring', 'calves', 'abs']
    return majorSlugs.filter(s => !load[s])
  }, [load])

  const handleApplyPlan = () => {
    const newRoutines = days.map(d => {
      const generatedExercises = generateRoutineForMuscles(d.muscles, S.equipment || [], S.excludedEquipment || [])
      return {
        id: uid(),
        name: d.name,
        emoji: d.emoji || 'dumbbell',
        ex: generatedExercises
      }
    })

    // Assign to weekly schedule
    const newWeek = {}
    if (newRoutines.length === 3) {
      newWeek[1] = newRoutines[0].id // Mon
      newWeek[3] = newRoutines[1].id // Wed
      newWeek[5] = newRoutines[2].id // Fri
    } else if (newRoutines.length === 4) {
      newWeek[1] = newRoutines[0].id
      newWeek[2] = newRoutines[1].id
      newWeek[4] = newRoutines[2].id
      newWeek[5] = newRoutines[3].id
    } else if (newRoutines.length === 6) {
      // 🇮🇳 Indian Classic 6-Day Split:
      // Mon (1): Chest & Tri A
      // Tue (2): Back & Bi A
      // Wed (3): Legs & Shoulders A
      // Thu (4): Chest & Tri B
      // Fri (5): Back & Bi B
      // Sat (6): Legs & Shoulders B
      // Sun (0): Rest Day
      newWeek[1] = newRoutines[0].id
      newWeek[2] = newRoutines[1].id
      newWeek[3] = newRoutines[2].id
      newWeek[4] = newRoutines[3].id
      newWeek[5] = newRoutines[4].id
      newWeek[6] = newRoutines[5].id
    } else {
      newRoutines.forEach((r, idx) => {
        if (idx < 7) newWeek[idx + 1] = r.id
      })
    }

    update(s => {
      s.routines = newRoutines
      s.week = newWeek
    })

    toast(t('Custom plan generated with {0} routines!', newRoutines.length))
    if (onComplete) onComplete()
    close()
  }

  const handleAiApply = (aiRoutine) => {
    setDays(prev => prev.map((d, i) => {
      if (i !== activeDayIndex) return d
      return {
        ...d,
        name: aiRoutine.name || d.name,
        emoji: aiRoutine.emoji || d.emoji
      }
    }))
  }

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Custom Split Builder
          </h2>
          <div style={{ fontSize: 13, color: 'var(--label-2)' }}>
            Design your days, watch the live muscle heatmap, and generate balanced routines.
          </div>
        </div>
        <button
          onClick={close}
          style={{ background: 'none', border: 'none', color: 'var(--label-3)', fontSize: 20, cursor: 'pointer', padding: 6 }}
        >
          ✕
        </button>
      </div>

      {/* Days Count Selector */}
      <div className="seg" style={{ marginBottom: 16 }}>
        <span className="seg-sel" style={{ '--n': 4, '--i': daysCount === 3 ? 0 : daysCount === 4 ? 1 : daysCount === 5 ? 2 : 3 }} />
        <button
          type="button"
          className={daysCount === 3 ? 'on' : ''}
          onClick={() => handleSplitChange(3)}
        >
          3-Day
        </button>
        <button
          type="button"
          className={daysCount === 4 ? 'on' : ''}
          onClick={() => handleSplitChange(4)}
        >
          4-Day
        </button>
        <button
          type="button"
          className={daysCount === 5 ? 'on' : ''}
          onClick={() => handleSplitChange(5)}
        >
          5-Day
        </button>
        <button
          type="button"
          className={daysCount === 6 ? 'on' : ''}
          onClick={() => handleSplitChange(6)}
        >
          🇮🇳 6-Day Classic
        </button>
      </div>

      {/* Split-Screen Layout */}
      <div className="builder-split">
        {/* Left / Top: Interactive Live Anatomical Heatmap */}
        <div className="builder-map-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--label)' }}>
              Live Muscle Coverage
            </span>
            <span className={`badge-glass ${neglected.length === 0 ? '' : 'warn'}`}>
              {neglected.length === 0 ? '✨ Balanced Split' : `⚠️ Neglected: ${neglected.length}`}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <BodyMap
              load={load}
              body={S.body || 'male'}
              onMuscle={slug => setSelectedMuscle(slug)}
              selected={selectedMuscle}
            />
          </div>
          <BodyMapLegend />

          {neglected.length > 0 && (
            <div style={{ fontSize: 11, color: 'var(--orange)', marginTop: 10, lineHeight: 1.4 }}>
              Tip: Add <b>{neglected.slice(0, 3).map(s => MUSCLE_NAME[s] || s).join(', ')}</b> to ensure complete physique balance.
            </div>
          )}
        </div>

        {/* Right / Bottom: Days Configuration */}
        <div className="builder-days-list">
          {days.map((day, dIdx) => {
            const isActive = activeDayIndex === dIdx
            return (
              <div
                key={dIdx}
                className={`builder-day-card ${isActive ? 'active' : ''}`}
                onClick={() => setActiveDayIndex(dIdx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 26,
                      height: 26,
                      borderRadius: 99,
                      background: isActive ? 'var(--acc)' : 'var(--surface-2)',
                      color: isActive ? 'var(--on-acc)' : 'var(--label)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {dIdx + 1}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--label)' }}>
                      {day.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="badge-glass subtle">
                      {day.muscles.length} Muscle Groups
                    </span>
                    <Button
                      size="sm"
                      variant="tinted"
                      icon="sparkles"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveDayIndex(dIdx)
                        setShowAiModal(true)
                      }}
                    >
                      AI Tailor
                    </Button>
                  </div>
                </div>

                {/* Muscle Chips for this Day */}
                <div>
                  <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 6 }}>
                    Trained Muscles:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {PRIMARY_MUSCLE_OPTIONS.map(m => {
                      const on = day.muscles.includes(m.slug)
                      return (
                        <button
                          key={m.slug}
                          type="button"
                          className={`chip ${on ? 'on' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleMuscleInDay(dIdx, m.slug)
                          }}
                          style={{ fontSize: 12, padding: '5px 11px' }}
                        >
                          {m.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <Button variant="tinted" onClick={close} style={{ flex: '0 0 100px' }}>
          Cancel
        </Button>
        <Button variant="primary" icon="sparkles" onClick={handleApplyPlan} style={{ flex: 1 }}>
          Generate & Save Routines
        </Button>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div id="modal-root" className="open">
          <div className="mback" onClick={() => setShowAiModal(false)} />
          <div className="center" style={{ width: 'min(92vw, 440px)', padding: 20 }}>
            <GeminiCustomizerModal
              close={() => setShowAiModal(false)}
              onApply={handleAiApply}
              currentRoutine={days[activeDayIndex]}
            />
          </div>
        </div>
      )}
    </div>
  )
}
