import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { t } from '../lib/i18n.js'
import { generateDeterministicPlan } from '../lib/plan-generator.js'
import Icon from './Icon.jsx'
import { Button } from './ui.jsx'

const COMMERCIAL_GYM_EQ = [
  'barbell',
  'dumbbell',
  'cable',
  'body weight',
  'leverage machine',
  'sled machine',
  'ez barbell',
  'smith machine'
]

const ENVIRONMENTS = [
  {
    id: 'gym',
    title: 'Commercial Gym',
    desc: 'Barbells, dumbbells, cables, leg press, squat rack, and machines.',
    icon: 'dumbbell',
    defaultEq: COMMERCIAL_GYM_EQ
  },
  {
    id: 'home',
    title: 'Home / Free Weights',
    desc: 'Dumbbells, bench, pull-up bar, and resistance bands.',
    icon: 'sparkles',
    defaultEq: ['dumbbell', 'body weight', 'band', 'resistance band']
  },
  {
    id: 'calisthenics',
    title: 'Bodyweight Only',
    desc: 'Pull-up bar, dip station, and bodyweight floor work.',
    icon: 'flame',
    defaultEq: ['body weight', 'band']
  }
]

const EQUIPMENT_ITEMS = [
  { id: 'barbell', name: 'Barbell & Rack', icon: '🏋️', desc: 'Standard 20kg bar & plates' },
  { id: 'dumbbell', name: 'Dumbbells', icon: '🔩', desc: 'Fixed or adjustable' },
  { id: 'cable', name: 'Cable Machine', icon: '⛓️', desc: 'Pulleys, ropes & handles' },
  { id: 'body weight', name: 'Body Weight', icon: '🤸', desc: 'Pull-up bar & bodyweight' },
  { id: 'leverage machine', name: 'Machines', icon: '⚙️', desc: 'Pin & plate loaded' },
  { id: 'sled machine', name: 'Leg Press / Sled', icon: '🛷', desc: '45° leg press & hack squats' },
  { id: 'band', name: 'Resistance Bands', icon: '🎗️', desc: 'Loop & therapy bands' }
]

const SPLITS = [
  {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    badge: '🔥 Recommended',
    days: '3 to 6 days / week',
    desc: 'Focuses on movement synergy. Chest & shoulders (Push), Back & biceps (Pull), Quads & hamstrings (Legs).'
  },
  {
    id: 'classic6',
    name: 'Classic 6-Day (Chest/Back/Legs)',
    badge: '🇮🇳 India Classic',
    days: '6 days / week',
    desc: 'Mon/Thu: Chest & Tri • Tue/Fri: Back & Bi • Wed/Sat: Legs & Shoulders. Iconic high-frequency mass builder.'
  },
  {
    id: 'custom',
    name: 'Custom Routine',
    badge: '🛠️ Clean Slate',
    days: 'Build from scratch',
    desc: 'Start with a clean slate. No pre-filled routines — create your own custom workouts in the app.'
  }
]

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
    </svg>
  )
}

export default function OnboardingFlow({ onComplete }) {
  const { update, setGuest } = useStore()
  const [step, setStep] = useState(1) // 1: Storage, 2: Environment, 3: Equipment, 4: Split
  const [authMode, setAuthMode] = useState('guest') // 'guest' | 'cloud'
  const [showGoogleAuth, setShowGoogleAuth] = useState(false)
  const [env, setEnv] = useState('gym')
  const [selectedEq, setSelectedEq] = useState(COMMERCIAL_GYM_EQ)
  const [split, setSplit] = useState('ppl')
  const [loading, setLoading] = useState(false)

  const isGym = env === 'gym'
  const totalSteps = isGym ? 3 : 4
  const currentStepNumber = step === 1 ? 1 : step === 2 ? 2 : (step === 3 ? 3 : (isGym ? 3 : 4))

  const toggleEq = (eqId) => {
    setSelectedEq(prev => {
      if (prev.includes(eqId)) {
        if (prev.length <= 1) return prev // keep at least 1
        return prev.filter(x => x !== eqId)
      } else {
        return [...prev, eqId]
      }
    })
  }

  const handleSelectEnv = (envItem) => {
    setEnv(envItem.id)
    setSelectedEq(envItem.defaultEq)
  }

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      if (env === 'gym') {
        // Commercial gym: skip step 3! Assume user has all equipment
        setSelectedEq(COMMERCIAL_GYM_EQ)
        setStep(4)
      } else {
        setStep(3)
      }
    } else if (step === 3) {
      setStep(4)
    }
  }

  const handleBack = () => {
    if (step === 4) {
      if (env === 'gym') {
        setStep(2)
      } else {
        setStep(3)
      }
    } else if (step === 3) {
      setStep(2)
    } else if (step === 2) {
      setStep(1)
    }
  }

  const finishSetup = async () => {
    setLoading(true)
    try {
      setGuest(true)

      let generatedRoutines = []
      const newWeek = {}

      // If user chose custom routine, leave routines and week empty
      if (split !== 'custom') {
        generatedRoutines = generateDeterministicPlan(split, selectedEq)
        if (split === 'classic6' && generatedRoutines.length >= 3) {
          newWeek[1] = generatedRoutines[0].id // Mon: Chest & Tri
          newWeek[2] = generatedRoutines[1].id // Tue: Back & Bi
          newWeek[3] = generatedRoutines[2].id // Wed: Legs & Shoulders
          newWeek[4] = generatedRoutines[0].id // Thu: Chest & Tri
          newWeek[5] = generatedRoutines[1].id // Fri: Back & Bi
          newWeek[6] = generatedRoutines[2].id // Sat: Legs & Shoulders
        } else if (split === 'ppl' && generatedRoutines.length >= 3) {
          newWeek[1] = generatedRoutines[0].id // Mon: Push
          newWeek[2] = generatedRoutines[1].id // Tue: Pull
          newWeek[4] = generatedRoutines[2].id // Thu: Legs
        } else if (split === 'upperlower' && generatedRoutines.length >= 2) {
          newWeek[1] = generatedRoutines[0].id // Mon: Upper
          newWeek[2] = generatedRoutines[1].id // Tue: Lower
          newWeek[4] = generatedRoutines[0].id // Thu: Upper
          newWeek[5] = generatedRoutines[1].id // Fri: Lower
        } else if (generatedRoutines.length >= 2) {
          newWeek[1] = generatedRoutines[0].id // Mon: FB A
          newWeek[3] = generatedRoutines[1].id // Wed: FB B
          newWeek[5] = generatedRoutines[0].id // Fri: FB A
        }
      }

      update(draft => {
        draft.equipment = selectedEq
        draft.environment = env
        draft.onboardingDone = true
        draft.libraryMode = 'muscles'
        if (authMode === 'cloud') draft.storageMode = 'cloud'

        if (split === 'custom') {
          draft.routines = []
          draft.week = {}
        } else if (!draft.routines || draft.routines.length === 0) {
          draft.routines = generatedRoutines
          draft.week = newWeek
        }
      })

      useUI.getState().toast(
        split === 'custom'
          ? t('Welcome to GymFit! Ready to build your routine.')
          : t('Welcome to GymFit! Your routine is ready.')
      )
      if (onComplete) onComplete()
    } catch (err) {
      useUI.getState().toast(err.message || 'Setup error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="onboarding-wrap">
      {/* Top Header / Progress Indicator */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(idx => (
            <div
              key={idx}
              style={{
                height: 4,
                width: 32,
                borderRadius: 99,
                background: idx <= currentStepNumber ? 'var(--acc)' : 'var(--surface-3)',
                transition: 'background var(--fast)'
              }}
            />
          ))}
        </div>

        {/* STEP 1: WELCOME & STORAGE */}
        {step === 1 && (
          <div>
            <div className="onboarding-hero">
              <div className="icon-pill" style={{ overflow: 'hidden', padding: 0, width: 54, height: 54, borderRadius: 14, boxShadow: '0 4px 14px rgba(0,0,0,0.5)' }}>
                <img src="/icon-180.png" alt="GymFit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h1>Welcome to GymFit</h1>
              <p>Apple-crafted workout tracking designed for pure focus, science-backed volume, and zero clutter.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
              {/* Option 1: Local & Private */}
              <div
                className={`card selectable ${authMode === 'guest' ? 'on' : ''}`}
                style={{
                  padding: 16,
                  cursor: 'pointer',
                  border: authMode === 'guest' ? '1.5px solid var(--acc)' : '1.5px solid transparent',
                  borderRadius: 'var(--r)',
                  background: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14
                }}
                onClick={() => setAuthMode('guest')}
              >
                <div style={{ fontSize: 24 }}>🔒</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--label)' }}>Local & Private (Guest)</div>
                  <div style={{ fontSize: 13, color: 'var(--label-2)', marginTop: 2 }}>
                    100% offline-first. No accounts, no tracking. Stored securely on this device.
                  </div>
                </div>
                <div className={`chk ${authMode === 'guest' ? 'on' : ''}`}>
                  <Icon name="checkmark" />
                </div>
              </div>

              {/* Option 2: Save Progress & Sync across devices */}
              <div
                className={`card selectable ${authMode === 'cloud' ? 'on' : ''}`}
                style={{
                  padding: 16,
                  cursor: 'pointer',
                  border: authMode === 'cloud' ? '1.5px solid var(--acc)' : '1.5px solid transparent',
                  borderRadius: 'var(--r)',
                  background: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14
                }}
                onClick={() => {
                  setAuthMode('cloud')
                  setShowGoogleAuth(true)
                }}
              >
                <div style={{ fontSize: 24 }}>☁️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--label)' }}>
                      Save Progress & Sync
                    </span>
                    <span className="badge-glass" style={{ fontSize: 10, color: 'var(--acc)' }}>Google Auth</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--label-2)', marginTop: 2 }}>
                    Save your workouts to the cloud and seamlessly sync across phone, tablet, and PC.
                  </div>
                </div>
                <div className={`chk ${authMode === 'cloud' ? 'on' : ''}`}>
                  <Icon name="checkmark" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ENVIRONMENT */}
        {step === 2 && (
          <div>
            <div className="onboarding-hero">
              <h1>Where do you train?</h1>
              <p>We’ll tailor exercise selections and substitutes to your space.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              {ENVIRONMENTS.map(item => {
                const isSelected = env === item.id
                return (
                  <div
                    key={item.id}
                    data-env={item.id}
                    onClick={() => handleSelectEnv(item)}
                    style={{
                      padding: 16,
                      cursor: 'pointer',
                      border: isSelected ? '1.5px solid var(--acc)' : '1.5px solid transparent',
                      borderRadius: 'var(--r)',
                      background: isSelected ? 'color-mix(in srgb, var(--acc) 10%, var(--surface))' : 'var(--surface)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      transition: 'all var(--fast)'
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'var(--surface-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      color: isSelected ? 'var(--acc)' : 'var(--label)'
                    }}>
                      <Icon name={item.icon} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--label)' }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--label-2)', marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <div className={`chk ${isSelected ? 'on' : ''}`}>
                      <Icon name="checkmark" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 3: EQUIPMENT MULTI-SELECT (Only for Home & Bodyweight) */}
        {step === 3 && (
          <div>
            <div className="onboarding-hero">
              <h1>Select Your Equipment</h1>
              <p>We filter out exercises you can't perform and provide instant smart substitutes.</p>
            </div>

            <div className="eq-card-grid">
              {EQUIPMENT_ITEMS.map(item => {
                const checked = selectedEq.includes(item.id)
                return (
                  <div
                    key={item.id}
                    className={`eq-card ${checked ? 'selected' : ''}`}
                    onClick={() => toggleEq(item.id)}
                  >
                    <div className="top-row">
                      <span className="eq-icon">{item.icon}</span>
                      <div className={`chk ${checked ? 'on' : ''}`} style={{ width: 22, height: 22 }}>
                        <Icon name="checkmark" />
                      </div>
                    </div>
                    <div>
                      <div className="title">{item.name}</div>
                      <div className="sub">{item.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 4: STARTER SPLIT OR CUSTOM ROUTINE */}
        {step === 4 && (
          <div>
            <div className="onboarding-hero">
              <h1>Choose Your Routine</h1>
              <p>Select a science-backed starter routine or begin with a clean custom split.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              {SPLITS.map(s => {
                const isSelected = split === s.id
                return (
                  <div
                    key={s.id}
                    data-split={s.id}
                    onClick={() => setSplit(s.id)}
                    style={{
                      padding: 16,
                      cursor: 'pointer',
                      border: isSelected ? '1.5px solid var(--acc)' : '1.5px solid transparent',
                      borderRadius: 'var(--r)',
                      background: isSelected ? 'color-mix(in srgb, var(--acc) 10%, var(--surface))' : 'var(--surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      transition: 'all var(--fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--label)' }}>{s.name}</span>
                        <span className="badge-glass" style={{ fontSize: 10 }}>{s.badge}</span>
                      </div>
                      <div className={`chk ${isSelected ? 'on' : ''}`}>
                        <Icon name="checkmark" />
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--acc)', fontWeight: 500 }}>{s.days}</div>
                    <div style={{ fontSize: 13, color: 'var(--label-2)', lineHeight: 1.35 }}>{s.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button Row */}
      <div style={{ paddingTop: 24, display: 'flex', gap: 10 }}>
        {step > 1 && (
          <Button
            variant="tinted"
            onClick={handleBack}
            style={{ flex: '0 0 90px' }}
          >
            Back
          </Button>
        )}
        {step < 4 ? (
          <Button
            variant="primary"
            onClick={handleContinue}
            style={{ flex: 1 }}
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={finishSetup}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Setting Up…' : split === 'custom' ? 'Start with Custom Routine' : 'Start Training'}
          </Button>
        )}
      </div>

      {/* Google Auth Staging Bottom Sheet / Modal */}
      {showGoogleAuth && (
        <div id="modal-root" className="open">
          <div className="mback" onClick={() => setShowGoogleAuth(false)} />
          <div className="sheet" style={{ maxHeight: '85vh', textAlign: 'center', padding: '24px 20px' }}>
            <div className="grab" />
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <GoogleIcon />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px', color: 'var(--label)' }}>
              Google Authentication
            </h2>
            <p style={{ fontSize: 13, color: 'var(--label-2)', margin: '0 0 20px', lineHeight: 1.45 }}>
              Sign in with your Google account to automatically back up your workouts and sync your routines across all your devices.
            </p>

            <button
              type="button"
              style={{
                width: '100%',
                padding: '13px 18px',
                borderRadius: 'var(--r)',
                border: 'none',
                background: '#ffffff',
                color: '#1f1f1f',
                fontWeight: 600,
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                marginBottom: 12,
                transition: 'transform var(--fast)'
              }}
              onClick={() => {
                useUI.getState().toast('Google Sign-In ready! Staged for server integration.')
                setShowGoogleAuth(false)
              }}
            >
              <GoogleIcon />
              <span>Sign in with Google</span>
            </button>

            <div style={{
              fontSize: 12,
              color: 'var(--acc)',
              background: 'color-mix(in srgb, var(--acc) 10%, transparent)',
              padding: '10px 14px',
              borderRadius: 10,
              marginBottom: 18,
              textAlign: 'left'
            }}>
              ⚙️ <strong>OAuth Staged:</strong> Cloud sync is enabled. When your backend Google OAuth client ID and secrets are ready, this connects instantly.
            </div>

            <Button
              variant="tinted"
              onClick={() => setShowGoogleAuth(false)}
              style={{ width: '100%' }}
            >
              Continue with Cloud Sync Mode
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
