import { useState, useMemo, useEffect, Fragment } from 'react'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { allExercises, equipmentOf } from '../lib/exercises.js'
import { TOP_EXERCISE_IDS } from '../lib/top-exercises.js'
import { t } from '../lib/i18n.js'
import { vibrate } from '../lib/sound.js'
import { Thumb } from './Media.jsx'
import Icon from './Icon.jsx'
import { Button } from './ui.jsx'

import { CATEGORY_DEFS, usageMap, computeCategoryCounts } from '../lib/categories.js'

export default function ExerciseCategoryPicker({ onPick, onInstantAdd, inRoutineIds = [], routine, close, onCustomEx }) {
  const st = useStore(s => s.S)
  const toast = useUI(s => s.toast)
  const usage = useMemo(() => usageMap(st), [st])
  const all = useMemo(() => allExercises(st), [st])
  const chosenCount = Object.keys(usage).length

  const [localAddedIds, setLocalAddedIds] = useState(() => new Set(inRoutineIds || []))
  const inRoutineKey = (inRoutineIds || []).join(',')

  useEffect(() => {
    if (inRoutineIds && inRoutineIds.length) {
      setLocalAddedIds(prev => {
        let changed = false
        const next = new Set(prev)
        inRoutineIds.forEach(id => {
          if (!next.has(id)) {
            next.add(id)
            changed = true
          }
        })
        return changed ? next : prev
      })
    }
  }, [inRoutineKey])

  const [q, setQ] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeSubcategory, setActiveSubcategory] = useState(null)
  const [selectedEq, setSelectedEq] = useState('')
  const [viewChosen, setViewChosen] = useState(false)
  const [shown, setShown] = useState(50)

  const ql = q.toLowerCase().trim()

  // Compute exercise counts for all categories and subcategories
  const categoryCounts = useMemo(() => computeCategoryCounts(all), [all])

  // Current active filter rule
  const currentFilter = useMemo(() => {
    if (viewChosen) return e => !!usage[e.id]
    if (activeSubcategory) return activeSubcategory.filter
    if (activeCategory && !activeCategory.hasSubcategories) return activeCategory.filter
    return null
  }, [viewChosen, activeCategory, activeSubcategory, usage])

  // Category key for top-ranked exercises
  const activeCategoryKey = activeSubcategory?.id || activeCategory?.id
  const topRankMap = useMemo(() => {
    if (!activeCategoryKey || viewChosen) return new Map()
    const ids = TOP_EXERCISE_IDS[activeCategoryKey] || []
    return new Map(ids.map((id, idx) => [id, idx + 1]))
  }, [activeCategoryKey, viewChosen])

  // Exercises list when inside a category/subcategory or in global search
  const filteredList = useMemo(() => {
    if (ql) {
      return all.filter(e =>
        e.n.toLowerCase().includes(ql) ||
        (e.tg || '').toLowerCase().includes(ql) ||
        (e.bp || '').toLowerCase().includes(ql) ||
        (e.eq || '').toLowerCase().includes(ql) ||
        (e.desc || '').toLowerCase().includes(ql)
      )
    }

    if (!currentFilter) return []

    let list = all.filter(currentFilter)
    if (selectedEq) {
      list = list.filter(e => e.eq === selectedEq)
    }

    if (viewChosen) {
      list = [...list].sort((a, b) => (usage[b.id] - usage[a.id]) || (a.n < b.n ? -1 : 1))
    } else if (topRankMap.size > 0) {
      list = [...list].sort((a, b) => {
        const rankA = topRankMap.has(a.id) ? topRankMap.get(a.id) : 99999
        const rankB = topRankMap.has(b.id) ? topRankMap.get(b.id) : 99999
        if (rankA !== rankB) return rankA - rankB
        return a.n.localeCompare(b.n)
      })
    } else {
      list = [...list].sort((a, b) => a.n.localeCompare(b.n))
    }

    return list
  }, [all, ql, currentFilter, selectedEq, viewChosen, usage, topRankMap])

  const topItemsCount = useMemo(() => {
    if (viewChosen || topRankMap.size === 0) return 0
    return filteredList.filter(e => topRankMap.has(e.id)).length
  }, [filteredList, topRankMap, viewChosen])

  // Available equipments for current category
  const availableEquipments = useMemo(() => {
    if (!currentFilter) return []
    const unFilteredCategoryList = all.filter(currentFilter)
    return equipmentOf(unFilteredCategoryList)
  }, [all, currentFilter])

  const resetNav = () => {
    setActiveCategory(null)
    setActiveSubcategory(null)
    setSelectedEq('')
    setViewChosen(false)
    setShown(50)
  }

  const handleInstantAdd = (ex) => {
    setLocalAddedIds(prev => {
      const next = new Set(prev)
      next.add(ex.id)
      return next
    })
    try { vibrate(25) } catch (_) {}
    if (onInstantAdd) {
      onInstantAdd(ex)
    } else if (onPick) {
      onPick(ex)
    }
    toast(t('“{0}” added to routine', ex.n))
  }

  const handlePick = (ex) => {
    // Opens details / configuration sheet on top.
    // CRUCIAL: Do NOT call close() here! This ensures the picker remains open
    // underneath, so when "Add to routine" is clicked or the details sheet is closed,
    // the user returns right back to this opened category (e.g. Chest exercises).
    if (onPick) {
      onPick(ex, () => {
        setLocalAddedIds(prev => {
          const next = new Set(prev)
          next.add(ex.id)
          return next
        })
      })
    }
  }

  // 1. Global Search Mode (when typing in search)
  if (ql) {
    return (
      <div className="exercise-category-picker">
        <div className="ecp-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>{t('Add exercise')}</h3>
            {close && <button type="button" className="ecp-done-btn" onClick={close}>{t('Done')}</button>}
          </div>
          <div className="search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              className="input"
              placeholder={t('Search {0} exercises…', all.length)}
              value={q}
              autoFocus
              onChange={e => { setQ(e.target.value); setShown(50) }}
            />
            {q && (
              <button className="search-clear-btn" onClick={() => setQ('')} aria-label="Clear search">
                <Icon name="xmark" size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="ecp-subhdr row between">
          <span className="dim small">{t('Search results ({0})', filteredList.length)}</span>
          <button className="link-btn small" onClick={() => setQ('')}>{t('Browse categories')}</button>
        </div>

        <div className="list">
          {filteredList.slice(0, shown).map(e => {
            const isAdded = localAddedIds.has(e.id)
            return (
              <div key={e.id} className="item" onClick={() => handlePick(e)}>
                <Thumb ex={e} />
                <div className="grow">
                  <div className="tt capitalize">{e.n}</div>
                  <div className="ss capitalize">{t(e.tg || e.bp)} · {t(e.eq)}</div>
                </div>
                {usage[e.id] && <span className="tag acc"><Icon name="starFill" /></span>}
                <button
                  type="button"
                  className={'ecp-add-btn' + (isAdded ? ' added' : '')}
                  aria-label={isAdded ? t('In routine') : t('Add to routine')}
                  title={isAdded ? t('In routine') : t('Add to routine')}
                  onClick={(ev) => {
                    ev.stopPropagation()
                    handleInstantAdd(e)
                  }}
                >
                  <Icon name={isAdded ? 'check' : 'plus'} size={18} />
                </button>
              </div>
            )
          })}
          {filteredList.length === 0 && (
            <div className="empty">
              <div className="ico"><Icon name="magnifier" /></div>
              {t('No exercises found matching "{0}"', q)}
            </div>
          )}
        </div>
        {filteredList.length > shown && (
          <div style={{ marginTop: 12 }}>
            <Button onClick={() => setShown(s => s + 50)}>{t('Show more')}</Button>
          </div>
        )}
      </div>
    )
  }

  // 2. Category Exercises View (when user picked a category or subcategory)
  if (currentFilter) {
    const currentTitle = viewChosen
      ? t('Chosen exercises')
      : (activeSubcategory?.title || activeCategory?.title)
    const currentImg = activeSubcategory?.img || activeCategory?.img
    const currentSubtitle = viewChosen
      ? t('{0} exercises you frequently use', chosenCount)
      : (activeSubcategory?.subtitle || activeCategory?.subtitle)

    return (
      <div className="exercise-category-picker">
        <div className="ecp-nav-row">
          <button
            className="ecp-back-btn"
            onClick={() => {
              if (activeSubcategory && activeCategory?.hasSubcategories) {
                setActiveSubcategory(null)
                setSelectedEq('')
              } else {
                resetNav()
              }
            }}
          >
            <Icon name="chevronLeft" size={18} />
            <span>{activeSubcategory ? t(activeCategory.title) : t('All Muscle Groups')}</span>
          </button>
          {close && <button type="button" className="ecp-done-btn" onClick={close}>{t('Done')}</button>}
        </div>

        <div className="ecp-category-hero">
          {currentImg && (
            <div className="ecp-hero-img-wrap">
              <img src={currentImg} alt={currentTitle} className="ecp-hero-img" />
            </div>
          )}
          <div className="ecp-hero-text">
            <h2>{t(currentTitle)}</h2>
            <div className="ecp-hero-sub">{t(currentSubtitle)} · {t('{0} exercises', filteredList.length)}</div>
          </div>
        </div>

        {availableEquipments.length > 1 && (
          <div className="chips" style={{ margin: '12px 0 10px' }}>
            <button
              className={'chip nocap' + (!selectedEq ? ' on' : '')}
              onClick={() => { setSelectedEq(''); setShown(50) }}
            >
              {t('Any equipment')}
            </button>
            {availableEquipments.map(eq => (
              <button
                key={eq}
                className={'chip' + (selectedEq === eq ? ' on' : '')}
                onClick={() => { setSelectedEq(eq); setShown(50) }}
              >
                {t(eq)}
              </button>
            ))}
          </div>
        )}

        <div className="list" style={{ marginTop: 8 }}>
          {filteredList.slice(0, shown).map((e, idx) => {
            const isTop = topRankMap.has(e.id)
            const rank = topRankMap.get(e.id)
            const isFirstTop = idx === 0 && isTop
            const isFirstOther = !isTop && (idx === 0 || topRankMap.has(filteredList[idx - 1].id))

            return (
              <Fragment key={e.id}>
                {isFirstTop && (
                  <div className="ecp-section-header">
                    <span className="ecp-section-title">🔥 {t('Top Essentials')}</span>
                    <span className="ecp-section-hint">{t('Ranked for muscle growth & strength')}</span>
                  </div>
                )}
                {isFirstOther && topItemsCount > 0 && (
                  <div className="ecp-section-header" style={{ marginTop: 14 }}>
                    <span className="ecp-section-title" style={{ color: 'var(--label)' }}>
                      {t('All {0} Exercises', currentTitle)}
                    </span>
                    <span className="ecp-section-hint">{t('Alphabetical order')}</span>
                  </div>
                )}
                <div className="item" onClick={() => handlePick(e)}>
                  <Thumb ex={e} />
                  <div className="grow">
                    <div className="tt capitalize" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{e.n}</span>
                      {isTop && <span className="tag top-pick-badge">#{rank}</span>}
                    </div>
                    <div className="ss capitalize">{t(e.tg || e.bp)} · {t(e.eq)}</div>
                  </div>
                  {usage[e.id] && <span className="tag acc" title={t('Frequently logged')}><Icon name="starFill" /></span>}
                  <button
                    type="button"
                    className={'ecp-add-btn' + (localAddedIds.has(e.id) ? ' added' : '')}
                    aria-label={localAddedIds.has(e.id) ? t('In routine') : t('Add to routine')}
                    title={localAddedIds.has(e.id) ? t('In routine') : t('Add to routine')}
                    onClick={(ev) => {
                      ev.stopPropagation()
                      handleInstantAdd(e)
                    }}
                  >
                    <Icon name={localAddedIds.has(e.id) ? 'check' : 'plus'} size={18} />
                  </button>
                </div>
              </Fragment>
            )
          })}
          {filteredList.length === 0 && (
            <div className="empty">
              {viewChosen
                ? t('Nothing chosen yet — add exercises and they’ll show up here.')
                : t('No exercises found with the selected equipment.')}
            </div>
          )}
        </div>

        {filteredList.length > shown && (
          <div style={{ marginTop: 12 }}>
            <Button onClick={() => setShown(s => s + 50)}>{t('Show more')}</Button>
          </div>
        )}
      </div>
    )
  }

  // 3. Subcategory Selection View (e.g. User tapped "Legs" or "Arms")
  if (activeCategory && activeCategory.hasSubcategories && !activeSubcategory) {
    return (
      <div className="exercise-category-picker">
        <div className="ecp-nav-row">
          <button className="ecp-back-btn" onClick={() => setActiveCategory(null)}>
            <Icon name="chevronLeft" size={18} />
            <span>{t('All Muscle Groups')}</span>
          </button>
          {close && <button type="button" className="ecp-done-btn" onClick={close}>{t('Done')}</button>}
        </div>

        <div className="ecp-title-section">
          <h2>{t(activeCategory.title)}</h2>
          <p className="dim small">{t('Select a specific target area or view all')}</p>
        </div>

        <div className="muscle-cat-list">
          {activeCategory.subcategories.map(sub => (
            <div
              key={sub.id}
              className="muscle-cat-card"
              onClick={() => {
                setActiveSubcategory(sub)
                setSelectedEq('')
                setShown(50)
              }}
            >
              <div className="muscle-cat-thumb">
                <img src={sub.img} alt={sub.title} />
              </div>
              <div className="muscle-cat-info">
                <div className="muscle-cat-title">{t(sub.title)}</div>
                <div className="muscle-cat-subtitle">
                  {categoryCounts[sub.id] || 0} {t('exercises')} · {t(sub.subtitle)}
                </div>
              </div>
              <div className="muscle-cat-arrow">
                <Icon name="arrowRight" size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 4. Main Top-Level Muscle Groups Directory View (Default og.jpg layout)
  return (
    <div className="exercise-category-picker">
      <div className="ecp-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h3 style={{ margin: 0 }}>{t('Add exercise')}</h3>
          {close && <button type="button" className="ecp-done-btn" onClick={close}>{t('Done')}</button>}
        </div>
        <div className="search">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            className="input"
            placeholder={t('Search {0} exercises or pick a muscle…', all.length)}
            value={q}
            onChange={e => { setQ(e.target.value); setShown(50) }}
          />
        </div>
      </div>

      {chosenCount > 0 && (
        <div className="ecp-favorites-bar">
          <button
            className="ecp-fav-chip"
            onClick={() => {
              setViewChosen(true)
              setSelectedEq('')
              setShown(50)
            }}
          >
            <Icon name="starFill" size={14} style={{ color: '#ffd60a' }} />
            <span>{t('Recently Chosen')} ({chosenCount})</span>
            <Icon name="chevronRight" size={14} />
          </button>
        </div>
      )}

      {/* Muscle Group Cards List (Modeled after og.jpg) */}
      <div className="muscle-cat-list">
        {CATEGORY_DEFS.map(cat => {
          const count = categoryCounts[cat.id] || 0
          return (
            <div
              key={cat.id}
              className="muscle-cat-card"
              onClick={() => {
                setActiveCategory(cat)
                setActiveSubcategory(null)
                setSelectedEq('')
                setShown(50)
              }}
            >
              <div className="muscle-cat-thumb">
                <img src={cat.img} alt={cat.title} />
              </div>
              <div className="muscle-cat-info">
                <div className="muscle-cat-title">{t(cat.title)}</div>
                <div className="muscle-cat-subtitle">
                  {count} {t('exercises')} · {t(cat.subtitle)}
                </div>
              </div>
              <div className="muscle-cat-arrow">
                <Icon name="arrowRight" size={16} />
              </div>
            </div>
          )
        })}

        {/* Create Your Own Exercise Card */}
        <div
          className="muscle-cat-card custom-ex-card"
          onClick={() => onCustomEx ? onCustomEx(q.trim()) : null}
        >
          <div className="muscle-cat-thumb thumb-sparkles">
            <Icon name="sparkles" size={24} />
          </div>
          <div className="muscle-cat-info">
            <div className="muscle-cat-title">{t('Create your own exercise')}</div>
            <div className="muscle-cat-subtitle">{t('name + body part, no animation')}</div>
          </div>
          <div className="muscle-cat-arrow">
            <Icon name="plus" size={16} />
          </div>
        </div>
      </div>
    </div>
  )
}
