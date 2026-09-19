import { useState, useMemo } from 'react'
import { fmtVol, fmtDur, fmtDate, MONTHS_LONG, MONTHS } from '../lib/format.js'
import { glyphOf } from '../lib/glyphs.js'
import { setsDone } from '../lib/history.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import { Button, Segmented } from './ui.jsx'
import Heatmap from './Heatmap.jsx'

export default function YearReport({ S, initialYear, initialMonth, onSelectMonth, onWorkoutClick, close }) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(initialYear || currentYear)
  const [selectedMonth, setSelectedMonth] = useState(initialMonth != null ? initialMonth : null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'heatmap'

  // Available years from workout history
  const availableYears = useMemo(() => {
    const years = new Set(S.workouts.map(w => parseInt(w.d.slice(0, 4), 10)).filter(Boolean))
    years.add(currentYear)
    return Array.from(years).sort((a, b) => b - a)
  }, [S.workouts, currentYear])

  const yearWs = useMemo(() => {
    return S.workouts.filter(w => w.d.startsWith(String(year)))
  }, [S.workouts, year])

  // Annual Totals
  const totalWorkouts = yearWs.length
  const totalVol = yearWs.reduce((a, w) => a + (w.vol || 0), 0)
  const totalMs = yearWs.reduce((a, w) => a + Math.max(0, (w.end || w.start) - w.start), 0)
  const activeDaysSet = new Set(yearWs.map(w => w.d))
  const activeDaysCount = activeDaysSet.size

  // Group workouts by ISO day
  const byDay = useMemo(() => {
    const map = {}
    yearWs.forEach(w => {
      map[w.d] = (map[w.d] || 0) + 1
    })
    return map
  }, [yearWs])

  // Group workouts by month (0..11)
  const byMonth = useMemo(() => {
    const counts = new Array(12).fill(0)
    yearWs.forEach(w => {
      const mo = parseInt(w.d.slice(5, 7), 10) - 1
      if (mo >= 0 && mo < 12) counts[mo]++
    })
    return counts
  }, [yearWs])

  const maxMonthCount = Math.max(1, ...byMonth)

  // Generate 12 mini months
  const monthsData = useMemo(() => {
    const months = []
    for (let mo = 0; mo < 12; mo++) {
      const startOffset = (new Date(year, mo, 1).getDay() + 6) % 7
      const daysIn = new Date(year, mo + 1, 0).getDate()
      const moPrefix = year + '-' + String(mo + 1).padStart(2, '0')
      const days = []

      for (let i = 0; i < startOffset; i++) {
        days.push({ id: 'empty-' + i, empty: true })
      }
      for (let d = 1; d <= daysIn; d++) {
        const iso = moPrefix + '-' + String(d).padStart(2, '0')
        days.push({
          id: iso,
          d,
          iso,
          has: !!byDay[iso]
        })
      }
      months.push({
        mo,
        name: MONTHS[mo],
        fullName: MONTHS_LONG[mo],
        count: byMonth[mo],
        days
      })
    }
    return months
  }, [year, byDay, byMonth])

  // If a month is selected, render the full Month Report
  if (selectedMonth !== null) {
    const mo = selectedMonth
    const monthPrefix = year + '-' + String(mo + 1).padStart(2, '0')
    const monthWs = (S.workouts || [])
      .filter(w => w.d.startsWith(monthPrefix))
      .sort((a, b) => (b.d > a.d ? 1 : -1))

    const totalVolMonth = monthWs.reduce((a, w) => a + (w.vol || 0), 0)
    const totalMsMonth = monthWs.reduce((a, w) => a + Math.max(0, (w.end || w.start) - w.start), 0)
    const totalPRsMonth = monthWs.reduce((a, w) => a + ((w.prs && w.prs.length) || 0), 0)
    const monthName = t(MONTHS_LONG[mo])

    const handleOpenInCalendar = () => {
      if (onSelectMonth) onSelectMonth(year, mo)
      close()
    }

    return (
      <div className="year-report-wrap month-report-detail">
        {/* Month Report Header */}
        <div className="row between" style={{ marginBottom: 14, alignItems: 'center' }}>
          <Button
            size="sm"
            variant="ghost"
            icon="chevronLeft"
            onClick={() => setSelectedMonth(null)}
          >
            {year} {t('Overview')}
          </Button>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700 }}>
            {monthName} {year}
          </h2>
          <Button
            size="sm"
            variant="tinted"
            icon="calendar"
            onClick={handleOpenInCalendar}
          >
            {t('Calendar')}
          </Button>
        </div>

        {/* Month Summary Tiles */}
        <div className="tiles" style={{ marginBottom: 16 }}>
          <div className="tile">
            <div className="l">
              <Icon name="dumbbell" />
              {t('Workouts')}
            </div>
            <div className="v">{monthWs.length}</div>
          </div>
          <div className="tile">
            <div className="l">
              <Icon name="clock" />
              {t('Time Trained')}
            </div>
            <div className="v">{fmtDur(totalMsMonth)}</div>
          </div>
          <div className="tile">
            <div className="l">
              <Icon name="scale" />
              {t('Volume')}
            </div>
            <div className="v">{fmtVol(totalVolMonth, S.unit)}</div>
          </div>
          <div className="tile">
            <div className="l">
              <Icon name="trophy" />
              {t('PRs')}
            </div>
            <div className="v">{totalPRsMonth}</div>
          </div>
        </div>

        {/* Workouts in this Month */}
        <div className="row between" style={{ marginBottom: 10, alignItems: 'center' }}>
          <h4 className="sec" style={{ margin: 0 }}>
            {t('Workouts in {0}', monthName)} ({monthWs.length})
          </h4>
          {monthWs.length > 0 && (
            <span className="small dim">
              {t('Tap a workout to view details')}
            </span>
          )}
        </div>

        {monthWs.length === 0 ? (
          <div
            className="card small muted"
            style={{ textAlign: 'center', padding: '28px 16px', borderRadius: 'var(--r)' }}
          >
            <Icon name="calendar" style={{ fontSize: 26, opacity: 0.4, marginBottom: 8, display: 'block' }} />
            <div style={{ marginBottom: 12 }}>
              {t('No workouts logged in {0} {1}.', monthName, year)}
            </div>
            <Button size="sm" variant="primary" icon="calendar" onClick={handleOpenInCalendar}>
              {t('Open {0} in Calendar', monthName)}
            </Button>
          </div>
        ) : (
          <div className="list">
            {monthWs.map(w => {
              const routine = (S.routines || []).find(r => r.id === w.routineId)
              const glyph = glyphOf(routine ? routine.emoji : null)
              const dur = Math.max(0, (w.end || w.start) - w.start)
              return (
                <div
                  key={w.id}
                  className="item"
                  onClick={() => onWorkoutClick && onWorkoutClick(w)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="lrow-i" style={{ width: 34, height: 34, borderRadius: 8, fontSize: 19 }}>
                    <Icon name={glyph} />
                  </span>
                  <div className="grow">
                    <div className="tt">{w.name}</div>
                    <div className="ss">
                      {[
                        fmtDate(w.d, true),
                        ...(dur >= 60000 ? [fmtDur(dur)] : []),
                        t('{0} sets', setsDone(w)),
                        fmtVol(w.vol || 0, S.unit)
                      ].join(' · ')}
                    </div>
                  </div>
                  {w.prs && w.prs.length > 0 && (
                    <span className="pr">
                      <Icon name="trophy" />
                      {w.prs.length} PR
                    </span>
                  )}
                  <Icon name="chevronRight" className="chev" />
                </div>
              )
            })}
          </div>
        )}

        <div className="row" style={{ gap: 10, marginTop: 20 }}>
          <Button
            variant="ghost"
            onClick={() => setSelectedMonth(null)}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {t('← Back to All Months')}
          </Button>
          <Button
            variant="tinted"
            icon="calendar"
            onClick={handleOpenInCalendar}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {t('Open in Calendar')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="year-report-wrap">
      {/* Year Navigation Bar */}
      <div className="year-nav-row">
        <button
          type="button"
          className="iconbtn"
          onClick={() => setYear(y => y - 1)}
          aria-label={t('Previous year')}
        >
          <Icon name="chevronLeft" />
        </button>
        <div className="year-title">
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {year} {t('Annual Activity')}
          </h2>
        </div>
        <button
          type="button"
          className="iconbtn"
          onClick={() => setYear(y => y + 1)}
          aria-label={t('Next year')}
        >
          <Icon name="chevronRight" />
        </button>
      </div>

      {/* Annual Summary Metrics */}
      <div className="tiles" style={{ marginBottom: 16 }}>
        <div className="tile">
          <div className="l">
            <Icon name="dumbbell" />
            {t('Workouts')}
          </div>
          <div className="v">{totalWorkouts}</div>
        </div>
        <div className="tile">
          <div className="l">
            <Icon name="clock" />
            {t('Time Trained')}
          </div>
          <div className="v">{fmtDur(totalMs)}</div>
        </div>
        <div className="tile">
          <div className="l">
            <Icon name="scale" />
            {t('Volume')}
          </div>
          <div className="v">{fmtVol(totalVol, S.unit)}</div>
        </div>
        <div className="tile">
          <div className="l">
            <Icon name="flame" />
            {t('Active Days')}
          </div>
          <div className="v">{activeDaysCount}</div>
        </div>
      </div>

      {/* View Toggle */}
      <div style={{ marginBottom: 16 }}>
        <Segmented
          value={viewMode}
          onChange={setViewMode}
          options={[
            { value: 'grid', label: t('12-Month Calendar') },
            { value: 'heatmap', label: t('52-Week Heatmap') }
          ]}
        />
      </div>

      {viewMode === 'grid' ? (
        <>
          {/* Monthly Comparison Bar Chart */}
          <div className="card" style={{ marginBottom: 16, padding: '12px 14px' }}>
            <div className="small dim" style={{ marginBottom: 8 }}>
              {t('Workouts by month (tap a month to inspect)')}
            </div>
            <div className="year-chart-bars">
              {byMonth.map((cnt, idx) => (
                <div
                  key={idx}
                  className="year-bar-col"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedMonth(idx)}
                >
                  <div className="year-bar-track">
                    <div
                      className="year-bar-fill"
                      style={{
                        height: `${Math.round((cnt / maxMonthCount) * 100)}%`,
                        background: cnt > 0 ? 'var(--acc)' : 'transparent'
                      }}
                    />
                  </div>
                  <span className="year-bar-lbl">{MONTHS[idx].slice(0, 1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 12-Month Visual Calendar Matrix */}
          <div className="year-months-grid">
            {monthsData.map(m => (
              <div
                key={m.mo}
                className="year-month-card"
                onClick={() => setSelectedMonth(m.mo)}
              >
                <div className="year-month-hdr">
                  <span className="ym-name">{t(m.name)}</span>
                  <span className="ym-badge">{m.count}</span>
                </div>
                <div className="year-mini-grid">
                  {m.days.map((d, i) =>
                    d.empty ? (
                      <div key={d.id} className="mini-cell empty" />
                    ) : (
                      <div
                        key={d.id}
                        className={'mini-cell' + (d.has ? ' done' : '')}
                        title={d.has ? `${d.iso} (Trained)` : d.iso}
                      >
                        {d.d}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="small dim" style={{ textAlign: 'center', marginTop: 14 }}>
            {t('Tap any month to see its full report & workouts')}
          </div>
        </>
      ) : (
        <div className="card" style={{ padding: 14 }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: 14 }}>{t('Continuous Activity Timeline')}</h4>
          <Heatmap
            S={S}
            onDay={iso => {
              const mo = parseInt(iso.slice(5, 7), 10) - 1
              setSelectedMonth(mo)
            }}
          />
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <Button variant="ghost" onClick={close} style={{ width: '100%', justifyContent: 'center' }}>
          {t('Close')}
        </Button>
      </div>
    </div>
  )
}

