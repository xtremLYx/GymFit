import { useState, useMemo } from 'react'
import { BODYPARTS, equipmentOf } from '../lib/exercises.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import { Button } from './ui.jsx'

export const PRESETS = [
  {
    id: 'upper',
    label: 'Upper Body',
    icon: 'arm',
    bps: ['chest', 'back', 'shoulders', 'upper arms', 'lower arms'],
    eqs: []
  },
  {
    id: 'lower',
    label: 'Lower Body',
    icon: 'legs',
    bps: ['upper legs', 'lower legs'],
    eqs: []
  },
  {
    id: 'core_cardio',
    label: 'Core & Cardio',
    icon: 'figureRun',
    bps: ['waist', 'cardio'],
    eqs: []
  },
  {
    id: 'free_weights',
    label: 'Free Weights',
    icon: 'dumbbell',
    bps: [],
    eqs: ['dumbbell', 'barbell', 'kettlebell']
  },
  {
    id: 'cables_machines',
    label: 'Cables & Machines',
    icon: 'machine',
    bps: [],
    eqs: ['cable', 'leverage machine', 'smith machine', 'sled machine']
  },
  {
    id: 'bodyweight',
    label: 'Bodyweight Only',
    icon: 'pullup',
    bps: [],
    eqs: ['body weight']
  }
]

export default function ExerciseFilterSheet({
  selectedBps = [],
  selectedEqs = [],
  allList = [],
  mode = 'all',
  isEssentialFn,
  excludedEquipment = [],
  onApply,
  close
}) {
  const [bps, setBps] = useState([...selectedBps])
  const [eqs, setEqs] = useState([...selectedEqs])

  const allEqOptions = useMemo(() => {
    return equipmentOf(allList).filter(eq => !excludedEquipment.includes(eq))
  }, [allList, excludedEquipment])

  // Count matching exercises given current temporary filters
  const matchCount = useMemo(() => {
    return allList.filter(e => {
      if (excludedEquipment.includes(e.eq)) return false
      if (mode === 'essentials' && isEssentialFn && !isEssentialFn(e.id)) return false
      if (bps.length > 0 && !bps.includes(e.bp)) return false
      if (eqs.length > 0 && !eqs.includes(e.eq)) return false
      return true
    }).length
  }, [allList, excludedEquipment, mode, isEssentialFn, bps, eqs])

  const toggleBp = (bp) => {
    setBps(cur => cur.includes(bp) ? cur.filter(x => x !== bp) : [...cur, bp])
  }

  const toggleEq = (eq) => {
    setEqs(cur => cur.includes(eq) ? cur.filter(x => x !== eq) : [...cur, eq])
  }

  const applyPreset = (preset) => {
    if (preset.bps.length > 0) {
      setBps([...preset.bps])
    }
    if (preset.eqs.length > 0) {
      setEqs([...preset.eqs])
    }
  }

  const handleReset = () => {
    setBps([])
    setEqs([])
  }

  const totalActive = bps.length + eqs.length

  const handleCommit = () => {
    onApply({ selectedBps: bps, selectedEqs: eqs })
    close()
  }

  return (
    <div className="filter-sheet-wrap">
      {/* Header */}
      <div className="row between" style={{ marginBottom: 14 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            {t('Filter Exercises')}
          </h3>
          <div className="small dim" style={{ marginTop: 2 }}>
            {totalActive === 0
              ? t('Showing all movements')
              : t('{0} filter(s) active', totalActive)}
          </div>
        </div>
        {totalActive > 0 && (
          <button
            type="button"
            className="filter-reset-link"
            onClick={handleReset}
          >
            {t('Reset all')}
          </button>
        )}
      </div>

      {/* Quick Presets */}
      <div style={{ marginBottom: 16 }}>
        <div className="filter-sec-hdr">
          <span>{t('Quick Presets')}</span>
        </div>
        <div className="filter-preset-row">
          {PRESETS.map(p => {
            const isPresetActive =
              (p.bps.length === 0 || p.bps.every(b => bps.includes(b))) &&
              (p.eqs.length === 0 || p.eqs.every(e => eqs.includes(e))) &&
              (p.bps.length > 0 || p.eqs.length > 0) &&
              (bps.length > 0 || eqs.length > 0)

            return (
              <button
                key={p.id}
                type="button"
                className={'filter-preset-chip' + (isPresetActive ? ' active' : '')}
                onClick={() => applyPreset(p)}
              >
                <Icon name={p.icon} size={14} />
                <span>{t(p.label)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Body Parts (Target Region) */}
      <div style={{ marginBottom: 18 }}>
        <div className="filter-sec-hdr">
          <span>{t('Target Area (Body Part)')}</span>
          {bps.length > 0 && <span className="filter-count-badge">{bps.length}</span>}
        </div>
        <div className="filter-chips-grid">
          {BODYPARTS.map(b => {
            const on = bps.includes(b)
            return (
              <button
                key={b}
                type="button"
                className={'filter-pill' + (on ? ' on' : '')}
                onClick={() => toggleBp(b)}
              >
                {on && <Icon name="check" size={13} className="pill-check" />}
                <span className="capitalize">{t(b)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Equipment */}
      <div style={{ marginBottom: 20 }}>
        <div className="filter-sec-hdr">
          <span>{t('Equipment')}</span>
          {eqs.length > 0 && <span className="filter-count-badge">{eqs.length}</span>}
        </div>
        <div className="filter-chips-grid">
          {allEqOptions.map(eq => {
            const on = eqs.includes(eq)
            return (
              <button
                key={eq}
                type="button"
                className={'filter-pill' + (on ? ' on' : '')}
                onClick={() => toggleEq(eq)}
              >
                {on && <Icon name="check" size={13} className="pill-check" />}
                <span className="capitalize">{t(eq)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="filter-sheet-footer">
        <Button
          variant="primary"
          onClick={handleCommit}
          style={{ width: '100%', justifyContent: 'center', height: 46, fontSize: 16, fontWeight: 600 }}
        >
          {t('Apply Filters ({0})', matchCount)}
        </Button>
      </div>
    </div>
  )
}
