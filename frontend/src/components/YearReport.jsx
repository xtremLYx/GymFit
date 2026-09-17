import { useState, useMemo } from 'react'
import { fmtVol, fmtDur, MONTHS_LONG, MONTHS } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import { Button, Segmented } from './ui.jsx'
import Heatmap from './Heatmap.jsx'

export default function YearReport({ S, initialYear, onSelectMonth, close }) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(initialYear || currentYear)
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
              {t('Workouts by month')}
            </div>
            <div className="year-chart-bars">
              {byMonth.map((cnt, idx) => (
                <div key={idx} className="year-bar-col">
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
                onClick={() => {
                  if (onSelectMonth) onSelectMonth(year, m.mo)
                  close()
                }}
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
            {t('Tap any month to jump directly into its full calendar view')}
          </div>
        </>
      ) : (
        <div className="card" style={{ padding: 14 }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: 14 }}>{t('Continuous Activity Timeline')}</h4>
          <Heatmap S={S} onDay={iso => { close(); if (onSelectMonth) onSelectMonth(parseInt(iso.slice(0, 4)), parseInt(iso.slice(5, 7)) - 1) }} />
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
