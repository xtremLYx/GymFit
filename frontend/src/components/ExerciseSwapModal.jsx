import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { getQuickSwaps, getEssentialMeta } from '../lib/essentials.js'
import { exOr } from '../lib/exercises.js'
import { Thumb } from './Media.jsx'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import { Button } from './ui.jsx'

export default function ExerciseSwapModal({ exerciseId, onSelect, close }) {
  const S = useStore(s => s.S)
  const excludeEquipment = useStore(s => s.excludeEquipment)
  const toast = useUI(s => s.toast)
  const currentEx = exOr(exerciseId)
  const currentMeta = getEssentialMeta(exerciseId)
  const [filterEq, setFilterEq] = useState(true)

  // Get swaps with or without equipment filtering and excluding user-excluded gear
  const swaps = getQuickSwaps(exerciseId, filterEq ? S.equipment : null, S.excludedEquipment || [])

  const handleDontHaveMachine = () => {
    if (!currentEx?.eq) return
    excludeEquipment(currentEx.eq)
    // Immediately find best alternative without this machine
    const nextExcluded = [...new Set([...(S.excludedEquipment || []), currentEx.eq])]
    const candidates = getQuickSwaps(exerciseId, S.equipment, nextExcluded)
    const bestCandidate = candidates[0]?.ex
    if (bestCandidate) {
      toast(t('Excluded {0} & auto-swapped with {1}!', currentEx.eq, bestCandidate.n))
      onSelect(bestCandidate.id)
    } else {
      toast(t('Excluded {0} from routines & library.', currentEx.eq))
      close()
    }
  }

  return (
    <div style={{ padding: '4px 0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>⇄</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Quick Swap Exercise</h3>
            <div style={{ fontSize: 12, color: 'var(--label-2)' }}>
              Machine busy or joint discomfort? Pick a biomechanically equivalent movement.
            </div>
          </div>
        </div>
        <button
          onClick={close}
          style={{ background: 'none', border: 'none', color: 'var(--label-3)', fontSize: 18, cursor: 'pointer', padding: 4 }}
        >
          ✕
        </button>
      </div>

      {/* Current Exercise Banner */}
      <div style={{
        background: 'var(--surface-2)',
        borderRadius: 'var(--r)',
        padding: '10px 14px',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <Thumb ex={currentEx} style={{ width: 44, height: 44 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--label-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Current Exercise
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--label)', textTransform: 'capitalize' }}>
            {currentEx.n}
          </div>
          <div style={{ fontSize: 12, color: 'var(--label-2)' }}>
            {currentEx.tg || currentEx.bp} · {currentEx.eq}
          </div>
        </div>
        {currentMeta && <span className="badge-glass subtle">{currentMeta.badge}</span>}
      </div>

      {/* "I don't have this machine" Action Card */}
      {currentEx.eq && currentEx.eq !== 'body weight' && (
        <div style={{
          background: 'rgba(255, 69, 58, 0.08)',
          border: '1px solid rgba(255, 69, 58, 0.25)',
          borderRadius: 'var(--r)',
          padding: '10px 12px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🚫</span> {t("I don't have this machine ({0})", currentEx.eq)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--label-2)', marginTop: 2 }}>
              {t('Filters out all {0} exercises and replaces with best alternative.', currentEx.eq)}
            </div>
          </div>
          <Button
            size="sm"
            variant="danger"
            onClick={handleDontHaveMachine}
            style={{ flexShrink: 0 }}
          >
            {t('Filter & Swap')}
          </Button>
        </div>
      )}

      {/* Equipment Filter Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--label-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Top Equivalent Substitutes
        </span>
        <button
          type="button"
          onClick={() => setFilterEq(v => !v)}
          style={{
            background: 'none',
            border: 'none',
            color: filterEq ? 'var(--acc)' : 'var(--label-3)',
            fontSize: 12,
            cursor: 'pointer',
            padding: 0
          }}
        >
          {filterEq ? '✓ Matching My Gear' : 'All Equipment'}
        </button>
      </div>

      {/* Candidates List */}
      <div className="list" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {swaps.map(({ ex, meta }) => (
          <div
            key={ex.id}
            className="item"
            onClick={() => onSelect(ex.id)}
            style={{
              cursor: 'pointer',
              padding: 12,
              borderRadius: 'var(--r)',
              background: 'var(--surface)',
              alignItems: 'flex-start'
            }}
          >
            <Thumb ex={ex} style={{ width: 48, height: 48, borderRadius: 8 }} />
            <div className="grow" style={{ marginLeft: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span className="tt capitalize" style={{ fontWeight: 600 }}>{ex.n}</span>
                {meta?.badge && <span className="badge-glass">{meta.badge}</span>}
              </div>
              <div className="ss capitalize" style={{ fontSize: 12, color: 'var(--label-2)', marginTop: 2 }}>
                {ex.tg || ex.bp} · {ex.eq}
              </div>
              {meta?.why && (
                <div style={{ fontSize: 11, color: 'var(--label-2)', marginTop: 4, lineHeight: 1.3 }}>
                  {meta.why}
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="tinted"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(ex.id)
              }}
              style={{ marginTop: 6 }}
            >
              Swap
            </Button>
          </div>
        ))}

        {swaps.length === 0 && (
          <div className="empty" style={{ padding: '24px 0' }}>
            <div className="ico"><Icon name="dumbbell" /></div>
            <div>No exact equipment substitutes found.</div>
            <Button
              size="sm"
              variant="tinted"
              onClick={() => setFilterEq(false)}
              style={{ marginTop: 8 }}
            >
              Show all equipment alternatives
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
