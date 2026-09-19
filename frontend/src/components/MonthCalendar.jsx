import { useState } from 'react'
import { fmtVol, fmtDur, fmtDate, todayISO, MONTHS_LONG, MONTHS } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import { Button } from './ui.jsx'
import { workoutDetailSheet, dayOverrideSheet, WorkoutRow } from '../sheets.jsx'
import { useUI } from '../store/useUI.js'

export default function MonthCalendar({ S, onOpenYearReport, onDay }) {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const todayIso = todayISO()

  const [cur, setCur] = useState(() => {
    const d = new Date()
    d.setDate(1)
    d.setHours(12, 0, 0, 0)
    return d
  })

  const y = cur.getFullYear()
  const mo = cur.getMonth()
  const isCurrentMonth = y === today.getFullYear() && mo === today.getMonth()

  const prevMonth = () => setCur(new Date(y, mo - 1, 1, 12))
  const nextMonth = () => setCur(new Date(y, mo + 1, 1, 12))
  const goToday = () => setCur(new Date(today.getFullYear(), today.getMonth(), 1, 12))

  // Workouts indexing by day
  const byDay = {}
  S.workouts.forEach(w => {
    byDay[w.d] = byDay[w.d] || []
    byDay[w.d].push(w)
  })

  // Current month stats
  const monthPrefix = y + '-' + String(mo + 1).padStart(2, '0')
  const monthWs = S.workouts.filter(w => w.d.startsWith(monthPrefix))
  const monthVol = monthWs.reduce((a, w) => a + (w.vol || 0), 0)
  const monthMs = monthWs.reduce((a, w) => a + Math.max(0, (w.end || w.start) - w.start), 0)

  // Calendar math (Monday first: 0=Mon ... 6=Sun)
  const startOffset = (new Date(y, mo, 1).getDay() + 6) % 7
  const daysIn = new Date(y, mo + 1, 0).getDate()

  const handleDayClick = (iso, ws) => {
    if (onDay) {
      onDay(iso, ws)
      return
    }
    if (ws && ws.length === 1) {
      workoutDetailSheet(ws[0])
      return
    }
    if (ws && ws.length > 1) {
      useUI.getState().openSheet(c2 => (
        <>
          <h3>{fmtDate(iso, true)}</h3>
          <div className="list">
            {ws.map(w => (
              <WorkoutRow
                key={w.id}
                w={w}
                onClick={() => {
                  c2()
                  workoutDetailSheet(w)
                }}
              />
            ))}
          </div>
        </>
      ))
      return
    }
    // Untrained day
    dayOverrideSheet(iso)
  }

  const cells = []
  // Empty slots for leading days
  for (let i = 0; i < startOffset; i++) {
    cells.push(<div key={'empty-' + i} className="month-cal-empty" />)
  }

  // Days of month
  for (let d = 1; d <= daysIn; d++) {
    const iso = monthPrefix + '-' + String(d).padStart(2, '0')
    const ws = byDay[iso]
    const has = !!(ws && ws.length > 0)
    const isToday = iso === todayIso
    const dayDate = new Date(y, mo, d, 12)
    const isFuture = dayDate > today

    let cls = 'month-cal-cell'
    if (has) cls += ' done'
    if (isToday) cls += ' today'
    if (isFuture) cls += ' future'

    cells.push(
      <button
        key={d}
        type="button"
        className={cls}
        onClick={() => handleDayClick(iso, ws)}
        title={
          has
            ? `${iso} · ${ws.length === 1 ? '1 workout' : `${ws.length} workouts`}`
            : iso
        }
      >
        <span className="cal-cell-num">{d}</span>
        {ws && ws.length > 1 && <span className="cal-cell-multi" />}
      </button>
    )
  }

  return (
    <div className="month-cal-card">
      {/* Calendar Header */}
      <div className="month-cal-hdr">
        <div className="month-cal-nav">
          <button
            type="button"
            className="iconbtn"
            onClick={prevMonth}
            aria-label={t('Previous month')}
          >
            <Icon name="chevronLeft" />
          </button>
          <div className="month-cal-title-wrap">
            <h3 className="month-cal-title">
              {t(MONTHS_LONG[mo])} {y}
            </h3>
            {!isCurrentMonth && (
              <button
                type="button"
                className="month-cal-today-btn"
                onClick={goToday}
              >
                {t('Today')}
              </button>
            )}
          </div>
          <button
            type="button"
            className="iconbtn"
            onClick={nextMonth}
            aria-label={t('Next month')}
          >
            <Icon name="chevronRight" />
          </button>
        </div>

        {onOpenYearReport && (
          <Button
            size="sm"
            variant="tinted"
            icon="chart"
            onClick={() => onOpenYearReport({
              initialYear: y,
              initialMonth: null,
              onSelectMonth: (selYear, selMo) => {
                setCur(new Date(selYear, selMo, 1, 12))
              }
            })}
            className="month-cal-year-btn"
          >
            {t('All Year Report')}
          </Button>
        )}
      </div>

      {/* Monthly Summary Subheader */}
      <div className="month-cal-sub">
        {monthWs.length > 0 ? (
          <>
            <span className="sub-stat">
              <b>{monthWs.length}</b> {t(monthWs.length === 1 ? 'workout' : 'workouts')}
            </span>
            <span className="sub-sep">·</span>
            <span className="sub-stat">{fmtDur(monthMs)}</span>
            <span className="sub-sep">·</span>
            <span className="sub-stat">{fmtVol(monthVol, S.unit)}</span>
          </>
        ) : (
          <span className="sub-empty">{t('No workouts logged in {0}', t(MONTHS[mo]))}</span>
        )}
      </div>

      {/* Weekday Labels */}
      <div className="month-cal-weekdays">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(dayName => (
          <div key={dayName} className="month-cal-wd">
            {t(dayName)}
          </div>
        ))}
      </div>

      {/* Circular Days Grid */}
      <div className="month-cal-grid">{cells}</div>

      {/* Legend & Hint */}
      <div className="month-cal-footer">
        <div className="month-cal-legend">
          <span className="legend-item">
            <span className="legend-dot trained" />
            {t('Completed workout')}
          </span>
          <span className="legend-item">
            <span className="legend-dot today" />
            {t('Today')}
          </span>
        </div>
        <div className="legend-hint">
          {t('Tap any trained day to view session details')}
        </div>
      </div>
    </div>
  )
}
