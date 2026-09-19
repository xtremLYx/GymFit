import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { t } from '../lib/i18n.js'
import { WorkoutRow, workoutDetailSheet, startFlow } from '../sheets.jsx'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'

export default function History() {
  const nav = useNavigate()
  const S = useStore(s => s.S)
  return <>
    <div className="hdr"><button className="iconbtn" onClick={() => nav('/stats')} aria-label={t('Stats')}><Icon name="chevronLeft" /></button>
      <div style={{ flex: 1, marginLeft: 12 }}><h1>{t('History')}</h1><div className="sub">{t('{0} workouts', S.workouts.length)}</div></div></div>
    {S.workouts.length ? <div className="list">{[...S.workouts].reverse().map(w => <WorkoutRow key={w.id} w={w} onClick={() => workoutDetailSheet(w)} />)}</div>
      : <div className="empty" style={{ padding: '48px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div className="ico" style={{ fontSize: 42, marginBottom: 12 }}><Icon name="history" /></div>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--label)', marginBottom: 6 }}>{t('No workouts logged yet')}</div>
        <div className="muted small" style={{ maxWidth: 300, marginBottom: 20 }}>
          {t('Start your first session to track completed sets, volume, and personal records.')}
        </div>
        <Button variant="primary" icon="dumbbell" onClick={() => startFlow()}>{t('Start Workout')}</Button>
      </div>}
  </>
}
