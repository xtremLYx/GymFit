import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { DAYN, uid, exCount } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import { dayAssignSheet, loadStarterPlan, loadClassic6Plan, planToolsSheet } from '../sheets.jsx'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'
import { glyphOf, DEFAULT_GLYPH } from '../lib/glyphs.js'
import { coachAvailable } from '../lib/coach.js'
import { DEMO } from '../lib/demo.js'
import { MOBILE } from '../lib/mobile.js'
import CustomPlanBuilder from '../components/CustomPlanBuilder.jsx'

export default function Plan() {
  const nav = useNavigate()
  const location = useLocation()
  const S = useStore(s => s.S)
  const user = useStore(s => s.user)
  const config = useStore(s => s.config)
  const update = useStore(s => s.update)
  const coachOn = coachAvailable(config, user, { demo: DEMO, mobile: MOBILE })
  const [showBuilder, setShowBuilder] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('builder') === '1') {
      setShowBuilder(true)
    }
  }, [location.search])

  const closeBuilder = () => {
    setShowBuilder(false)
    if (location.search.includes('builder')) {
      nav('/plan', { replace: true })
    }
  }

  const addRoutine = () => {
    const r = { id: uid(), name: t('New routine'), emoji: DEFAULT_GLYPH, ex: [] }
    update(s => { s.routines.push(r) })
    nav('/plan/r/' + r.id)
  }

  return <>
    <div className="hdr">
      <div><h1>{t('Plan')}</h1><div className="sub">{t('Your weekly routine')}</div></div>
      {coachOn && <button className="iconbtn" onClick={() => nav('/coach')} aria-label={t('Coach')} title={t('Coach')}><Icon name="sparkles" /></button>}
      <button className="iconbtn" onClick={planToolsSheet} aria-label={t('Share your plan')} title={t('Share your plan')}><Icon name="upload" /></button>
    </div>
    <div className="cols"><div>
      <div className="row between" style={{ minHeight: 35, marginBottom: 8, alignItems: 'center' }}>
        <h4 className="sec" style={{ margin: 0, padding: 0 }}>{t('Week schedule')}</h4>
      </div>
      <div className="list" style={{ display: 'flex', flexDirection: 'column' }}>
        {[1, 2, 3, 4, 5, 6, 0].map(d => {
          const r = S.routines.find(x => x.id === S.week[d])
          return <div key={d} className="item" onClick={() => dayAssignSheet(d)}>
            <div className="grow"><div className="tt">{t(DAYN[d])}</div></div>
            {r ? <span className="tag acc"><Icon name={glyphOf(r.emoji)} />{r.name}</span> : <span className="tag">{t('Rest')}</span>}
            <Icon name="chevronRight" className="chev" /></div>
        })}
      </div>
    </div><div>
      <div className="row between" style={{ minHeight: 35, marginBottom: 8, alignItems: 'center' }}>
        <h4 className="sec" style={{ margin: 0, padding: 0 }}>{t('Routines')}</h4>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" variant="tinted" icon="sparkles" onClick={() => setShowBuilder(true)}>{t('Split Builder')}</Button>
          <Button size="sm" variant="tinted" icon="plus" onClick={addRoutine}>{t('New')}</Button>
        </div>
      </div>
      {S.routines.length ? <div className="list">{S.routines.map(r => <div key={r.id} className="item" onClick={() => nav('/plan/r/' + r.id)}>
        <span className="lrow-i"><Icon name={glyphOf(r.emoji)} /></span>
        <div className="grow"><div className="tt">{r.name}</div><div className="ss">{exCount(r.ex.length)}</div></div>
        <Icon name="chevronRight" className="chev" /></div>)}</div> : <>
        <div className="empty"><div className="ico"><Icon name="clipboard" /></div>{t('No routines yet.')}<br />{t('Create one or use the Split Builder.')}</div>
        <Button variant="primary" icon="sparkles" onClick={() => setShowBuilder(true)} style={{ marginBottom: 8 }}>{t('Build Custom Split (with Muscle Heatmap)')}</Button>
        <Button icon="layers" onClick={loadStarterPlan} style={{ marginBottom: 8 }}>{t('Load default starter plan (Push / Pull / Legs)')}</Button>
        <Button icon="dumbbell" onClick={loadClassic6Plan}>{t('Load Classic 6-Day Split (Chest / Back / Legs)')}</Button>
      </>}
    </div></div>

    {showBuilder && (
      <div id="modal-root" className="open">
        <div className="mback" onClick={closeBuilder} />
        <div className="sheet" style={{ maxHeight: '92vh' }}>
          <div className="grab" />
          <CustomPlanBuilder close={closeBuilder} />
        </div>
      </div>
    )}
  </>
}
