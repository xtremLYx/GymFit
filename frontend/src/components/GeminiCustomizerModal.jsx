import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { generateWithGemini } from '../lib/plan-generator.js'
import { EXIDX } from '../lib/exercises.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import { Button } from './ui.jsx'

const PRESETS = [
  { label: '🛡️ Low-Back Friendly', prompt: 'Design a routine with zero spinal axial loading, avoiding heavy barbell squats and deadlifts.' },
  { label: '⚡ 30-Min Express', prompt: 'Generate a high-density 30-minute workout with maximum 4 high-ROI compound exercises.' },
  { label: '🩹 Shoulder / Cuff Safe', prompt: 'Build a pressing and upper body workout avoiding shoulder impingement with neutral grips.' },
  { label: '🦵 Quad-Focused Bias', prompt: 'High-quad hypertrophy routine emphasizing deep knee flexion and quad isolation.' },
  { label: '🔥 Upper Chest Bias', prompt: 'Prioritize the upper clavicular chest and side delts for an aesthetic V-taper.' }
]

export default function GeminiCustomizerModal({ close, onApply, currentRoutine = null }) {
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)
  const toast = useUI(s => s.toast)

  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please choose a preset or describe your routine request')
      return
    }

    setLoading(true)
    setError('')
    try {
      const key = S.geminiApiKey || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || ''
      const generated = await generateWithGemini(key, prompt.trim(), S.equipment || [], currentRoutine)
      setResult(generated)
    } catch (err) {
      setError(err.message || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (!result) return
    onApply(result)
    toast(t('Customized routine applied!'))
    close()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'color-mix(in srgb, var(--acc) 18%, transparent)',
            color: 'var(--acc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16
          }}>
            <Icon name="sparkles" />
          </div>
          <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700 }}>AI Routine Customizer</h3>
        </div>
        <button
          onClick={close}
          style={{ background: 'none', border: 'none', color: 'var(--label-3)', fontSize: 18, cursor: 'pointer', padding: 4 }}
        >
          ✕
        </button>
      </div>

      <div style={{ fontSize: 13, color: 'var(--label-2)', marginBottom: 14, lineHeight: 1.4 }}>
        Tailor exercises for injuries, time constraints, or muscle focus using intelligent presets.
      </div>

      {/* Preset Chips */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Quick Presets
        </div>
        <div className="chips">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className={`chip nocap ${prompt === p.prompt ? 'on' : ''}`}
              onClick={() => { setPrompt(p.prompt); setError('') }}
              style={{ fontSize: 12 }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Area */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Request / Constraints
        </div>
        <textarea
          className="field area"
          placeholder="E.g., 4 exercises for chest and triceps, gentle on right elbow, using dumbbells only..."
          value={prompt}
          onChange={e => { setPrompt(e.target.value); setError('') }}
          style={{ minHeight: 74, fontSize: 14 }}
        />
      </div>

      {error && (
        <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 12, background: 'rgba(255,69,58,0.1)', padding: '8px 12px', borderRadius: 8 }}>
          {error}
        </div>
      )}

      {/* Generated Preview */}
      {result && (
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--r)',
          padding: 14,
          marginBottom: 16,
          border: '1px solid var(--acc)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--label)' }}>{result.name}</div>
            <span className="badge-glass">⚡ {result.ex.length} Exercises</span>
          </div>
          {result.coachNotes && (
            <div style={{ fontSize: 12, color: 'var(--acc)', marginBottom: 10, fontStyle: 'italic' }}>
              "{result.coachNotes}"
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {result.ex.map((item, i) => {
              const ex = EXIDX[item.id]
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--label)', textTransform: 'capitalize' }}>
                    {ex?.n || 'Exercise'}
                  </span>
                  <span style={{ color: 'var(--label-2)' }}>
                    {item.sets} × {item.reps}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        {!result ? (
          <Button
            variant="primary"
            icon="sparkles"
            onClick={handleGenerate}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Consulting Gemini…' : 'Generate Routine'}
          </Button>
        ) : (
          <>
            <Button
              variant="tinted"
              onClick={() => setResult(null)}
              style={{ flex: '0 0 100px' }}
            >
              Regenerate
            </Button>
            <Button
              variant="primary"
              onClick={handleApply}
              style={{ flex: 1 }}
            >
              Apply to Workout
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
