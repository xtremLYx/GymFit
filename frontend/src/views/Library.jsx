import { useState, useMemo, Fragment } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { EXDB, allExercises, equipmentOf } from '../lib/exercises.js'
import { CATEGORY_DEFS, usageMap, computeCategoryCounts } from '../lib/categories.js'
import { TOP_EXERCISE_IDS } from '../lib/top-exercises.js'
import { bestWeightFor } from '../lib/history.js'
import { fmtNum } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import { Thumb } from '../components/Media.jsx'
import { exerciseDetailSheet, addToRoutineSheet, customExSheet, exerciseFilterSheet } from '../sheets.jsx'
import { isEssential, getEssentialMeta, ESSENTIAL_IDS } from '../lib/essentials.js'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'

export default function Library() {
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)
  const [searchParams, setSearchParams] = useSearchParams()

  const [mode, setMode] = useState(S.libraryMode || 'muscles')
  const [q, setQ] = useState('')
  const [selectedEq, setSelectedEq] = useState('')
  const [shown, setShown] = useState(50)

  // Filter sheet state for "All" / "Essentials" mode
  const [selectedBps, setSelectedBps] = useState([])
  const [selectedEqs, setSelectedEqs] = useState([])

  const ql = q.toLowerCase().trim()

  // Base list of all exercises respecting excluded machines
  const allList = useMemo(() => allExercises(S), [S])
  const availableAllList = useMemo(() => {
    if (S.excludedEquipment && S.excludedEquipment.length > 0) {
      return allList.filter(e => !S.excludedEquipment.includes(e.eq))
    }
    return allList
  }, [allList, S.excludedEquipment])

  // Category counts and usage stats
  const usage = useMemo(() => usageMap(S), [S])
  const chosenCount = useMemo(() => Object.keys(usage).length, [usage])
  const categoryCounts = useMemo(() => computeCategoryCounts(availableAllList), [availableAllList])

  // Route / Query state
  const catId = searchParams.get('cat')
  const subId = searchParams.get('sub')
  const viewChosen = searchParams.get('view') === 'chosen'

  const activeCategory = useMemo(() => {
    if (!catId) return null
    return CATEGORY_DEFS.find(c => c.id === catId) || null
  }, [catId])

  const activeSubcategory = useMemo(() => {
    if (!activeCategory || !subId) return null
    return activeCategory.subcategories?.find(s => s.id === subId) || null
  }, [activeCategory, subId])

  // Current active filter for category mode
  const currentCategoryFilter = useMemo(() => {
    if (viewChosen) return e => !!usage[e.id]
    if (activeSubcategory) return activeSubcategory.filter
    if (activeCategory && !activeCategory.hasSubcategories) return activeCategory.filter
    return null
  }, [viewChosen, activeCategory, activeSubcategory, usage])

  // Top essentials ranking map for the active category
  const activeCategoryKey = activeSubcategory?.id || activeCategory?.id
  const topRankMap = useMemo(() => {
    if (!activeCategoryKey || viewChosen) return new Map()
    const ids = TOP_EXERCISE_IDS[activeCategoryKey] || []
    return new Map(ids.map((id, idx) => [id, idx + 1]))
  }, [activeCategoryKey, viewChosen])

  // Filtered exercises for category view
  const categoryExercises = useMemo(() => {
    if (!currentCategoryFilter) return []
    let list = availableAllList.filter(currentCategoryFilter)
    if (selectedEq) {
      list = list.filter(e => e.eq === selectedEq)
    }

    if (viewChosen) {
      list = [...list].sort((a, b) => (usage[b.id] - usage[a.id]) || a.n.localeCompare(b.n))
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
  }, [availableAllList, currentCategoryFilter, selectedEq, viewChosen, usage, topRankMap])

  const topItemsCount = useMemo(() => {
    if (viewChosen || topRankMap.size === 0) return 0
    return categoryExercises.filter(e => topRankMap.has(e.id)).length
  }, [categoryExercises, topRankMap, viewChosen])

  // Available equipment options for current category
  const availableEquipments = useMemo(() => {
    if (!currentCategoryFilter) return []
    const unfiltered = availableAllList.filter(currentCategoryFilter)
    return equipmentOf(unfiltered)
  }, [availableAllList, currentCategoryFilter])

  // Global search list
  const globalSearchList = useMemo(() => {
    if (!ql) return []
    return availableAllList.filter(e =>
      e.n.toLowerCase().includes(ql) ||
      (e.tg || '').toLowerCase().includes(ql) ||
      (e.bp || '').toLowerCase().includes(ql) ||
      (e.eq || '').toLowerCase().includes(ql) ||
      (e.desc || '').toLowerCase().includes(ql)
    )
  }, [availableAllList, ql])

  // Essentials and All views filtering
  const flatFilteredList = useMemo(() => {
    return availableAllList.filter(e => {
      if (mode === 'essentials' && !isEssential(e.id)) return false
      if (selectedBps.length > 0 && !selectedBps.includes(e.bp)) return false
      if (selectedEqs.length > 0 && !selectedEqs.includes(e.eq)) return false
      if (ql && !e.n.toLowerCase().includes(ql) && !e.tg.includes(ql) && !e.eq.includes(ql) && !(e.desc || '').toLowerCase().includes(ql)) return false
      return true
    })
  }, [availableAllList, mode, selectedBps, selectedEqs, ql])

  const totalActiveFilters = selectedBps.length + selectedEqs.length

  const handleModeChange = (newMode) => {
    setMode(newMode)
    update(s => { s.libraryMode = newMode })
    setShown(50)
    if (newMode !== 'muscles') {
      setSearchParams({})
    }
  }

  const resetCategoryNav = () => {
    setSelectedEq('')
    setShown(50)
    setSearchParams({})
  }

  return (
    <>
      {/* Header */}
      <div className="hdr">
        <div>
          <h1>{t('Exercises')}</h1>
          <div className="sub">
            {mode === 'muscles'
              ? (currentCategoryFilter
                  ? (viewChosen
                      ? t('{0} exercises you frequently use', chosenCount)
                      : `${t(activeSubcategory?.title || activeCategory?.title)} · ${t('{0} exercises', categoryExercises.length)}`)
                  : t('{0} exercises organized by muscle group', availableAllList.length))
              : mode === 'essentials'
              ? t('{0} science-backed foundational movements', ESSENTIAL_IDS.size)
              : t('{0} exercises with animations', availableAllList.length)}
          </div>
        </div>
      </div>

      {/* Segmented Control: Muscles (Default), Essentials, All */}
      <div className="seg" style={{ marginBottom: 12 }}>
        <span
          className="seg-sel"
          style={{
            '--n': 3,
            '--i': mode === 'muscles' ? 0 : mode === 'essentials' ? 1 : 2
          }}
        />
        <button
          type="button"
          className={mode === 'muscles' ? 'on' : ''}
          onClick={() => {
            if (mode === 'muscles' && (catId || viewChosen)) {
              resetCategoryNav()
            } else {
              handleModeChange('muscles')
            }
          }}
        >
          🫀 {t('Muscles')}
        </button>
        <button
          type="button"
          className={mode === 'essentials' ? 'on' : ''}
          onClick={() => handleModeChange('essentials')}
        >
          ⭐ {t('Essentials ({0})', ESSENTIAL_IDS.size)}
        </button>
        <button
          type="button"
          className={mode === 'all' ? 'on' : ''}
          onClick={() => handleModeChange('all')}
        >
          🌐 {t('All ({0})', availableAllList.length)}
        </button>
      </div>

      {/* Excluded Machine Filter Notification */}
      {S.excludedEquipment && S.excludedEquipment.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'rgba(255, 69, 58, 0.08)',
          border: '1px solid rgba(255, 69, 58, 0.25)',
          borderRadius: 'var(--r)',
          marginBottom: 10,
          fontSize: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--red)' }}>
            <span>🚫</span>
            <span>{t('Hidden absent machines: {0}', S.excludedEquipment.join(', '))}</span>
          </div>
          <button
            type="button"
            onClick={() => update(s => { s.excludedEquipment = [] })}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--label-2)',
              fontSize: 11,
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '2px 4px'
            }}
          >
            {t('Reset filter')}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: MUSCLES (Organized Category Architecture)                        */}
      {/* ========================================================================= */}
      {mode === 'muscles' && (
        <>
          {/* 1A. Global Search Active (when typing in search input) */}
          {ql ? (
            <div className="exercise-category-picker" style={{ padding: 0 }}>
              <div className="search-filter-row" style={{ marginBottom: 10 }}>
                <div className="search" style={{ flex: 1, marginBottom: 0 }}>
                  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                  <input
                    className="input"
                    placeholder={t('Search {0} exercises…', availableAllList.length)}
                    value={q}
                    autoFocus
                    onChange={e => { setQ(e.target.value); setShown(50) }}
                  />
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => { setQ(''); setShown(50) }}
                    aria-label="Clear search"
                  >
                    <Icon name="xmark" size={14} />
                  </button>
                </div>
              </div>

              <div className="ecp-subhdr row between" style={{ marginBottom: 12, padding: '0 2px' }}>
                <span className="dim small">{t('Search results ({0})', globalSearchList.length)}</span>
                <button
                  type="button"
                  className="link-btn small"
                  style={{ background: 'none', border: 'none', color: 'var(--acc)', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => setQ('')}
                >
                  {t('Browse muscle groups')}
                </button>
              </div>

              <div className="list">
                {globalSearchList.slice(0, shown).map(e => {
                  const best = bestWeightFor(S, e.id)
                  const meta = getEssentialMeta(e.id)
                  return (
                    <div key={e.id} className="item" onClick={() => exerciseDetailSheet(e)}>
                      <Thumb ex={e} />
                      <div className="grow">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span className="tt capitalize">{e.n}</span>
                          {meta && <span className="badge-glass">{meta.badge}</span>}
                        </div>
                        <div className="ss capitalize">{t(e.tg || e.bp)} · {t(e.eq)}</div>
                      </div>
                      {best > 0 && <span className="tag acc">{fmtNum(best)}</span>}
                      <Button
                        size="sm"
                        variant="tinted"
                        icon="plus"
                        onClick={ev => { ev.stopPropagation(); addToRoutineSheet(e) }}
                      >
                        {t('Plan')}
                      </Button>
                    </div>
                  )
                })}
                {globalSearchList.length === 0 && (
                  <div className="empty">
                    <div className="ico"><Icon name="magnifier" /></div>
                    {t('No exercises found matching "{0}"', q)}
                  </div>
                )}
              </div>
              {globalSearchList.length > shown && (
                <div style={{ marginTop: 12 }}>
                  <Button onClick={() => setShown(s => s + 50)}>{t('Show more')}</Button>
                </div>
              )}
            </div>
          ) : currentCategoryFilter ? (
            /* 1B. Inside Category / Subcategory / Chosen View */
            <div className="exercise-category-picker" style={{ padding: 0 }}>
              <div className="ecp-nav-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="ecp-back-btn"
                  onClick={() => {
                    if (activeSubcategory && activeCategory?.hasSubcategories) {
                      setSearchParams({ cat: activeCategory.id })
                      setSelectedEq('')
                    } else {
                      resetCategoryNav()
                    }
                  }}
                >
                  <Icon name="chevronLeft" size={18} />
                  <span>{activeSubcategory ? t(activeCategory.title) : t('All Muscle Groups')}</span>
                </button>
              </div>

              {/* Category Hero Banner */}
              <div className="ecp-category-hero">
                {(viewChosen ? '/muscles/chest.jpg' : (activeSubcategory?.img || activeCategory?.img)) && (
                  <div className="ecp-hero-img-wrap">
                    <img
                      src={viewChosen ? '/muscles/chest.jpg' : (activeSubcategory?.img || activeCategory?.img)}
                      alt={viewChosen ? 'Chosen' : (activeSubcategory?.title || activeCategory?.title)}
                      className="ecp-hero-img"
                    />
                  </div>
                )}
                <div className="ecp-hero-text">
                  <h2>{viewChosen ? t('Chosen exercises') : t(activeSubcategory?.title || activeCategory?.title)}</h2>
                  <div className="ecp-hero-sub">
                    {viewChosen
                      ? t('{0} exercises you frequently use', chosenCount)
                      : `${t(activeSubcategory?.subtitle || activeCategory?.subtitle)} · ${t('{0} exercises', categoryExercises.length)}`}
                  </div>
                </div>
              </div>

              {/* Equipment Filter Chips */}
              {availableEquipments.length > 1 && (
                <div className="chips" style={{ margin: '12px 0 10px' }}>
                  <button
                    type="button"
                    className={'chip nocap' + (!selectedEq ? ' on' : '')}
                    onClick={() => { setSelectedEq(''); setShown(50) }}
                  >
                    {t('Any equipment')}
                  </button>
                  {availableEquipments.map(eq => (
                    <button
                      key={eq}
                      type="button"
                      className={'chip' + (selectedEq === eq ? ' on' : '')}
                      onClick={() => { setSelectedEq(eq); setShown(50) }}
                    >
                      {t(eq)}
                    </button>
                  ))}
                </div>
              )}

              {/* Category Exercises List */}
              <div className="list" style={{ marginTop: 8 }}>
                {categoryExercises.slice(0, shown).map((e, idx) => {
                  const isTop = topRankMap.has(e.id)
                  const rank = topRankMap.get(e.id)
                  const isFirstTop = idx === 0 && isTop
                  const isFirstOther = !isTop && (idx === 0 || topRankMap.has(categoryExercises[idx - 1]?.id))
                  const best = bestWeightFor(S, e.id)
                  const meta = getEssentialMeta(e.id)

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
                            {t('All {0} Exercises', activeSubcategory?.title || activeCategory?.title)}
                          </span>
                          <span className="ecp-section-hint">{t('Alphabetical order')}</span>
                        </div>
                      )}
                      <div className="item" onClick={() => exerciseDetailSheet(e)}>
                        <Thumb ex={e} />
                        <div className="grow">
                          <div className="tt capitalize" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span>{e.n}</span>
                            {isTop && <span className="tag top-pick-badge">#{rank}</span>}
                            {meta && <span className="badge-glass">{meta.badge}</span>}
                          </div>
                          <div className="ss capitalize">{t(e.tg || e.bp)} · {t(e.eq)}</div>
                          {meta?.why && (
                            <div style={{ fontSize: 11, color: 'var(--label-2)', marginTop: 3, lineHeight: 1.3 }}>
                              {meta.why}
                            </div>
                          )}
                        </div>
                        {best > 0 && <span className="tag acc">{fmtNum(best)}</span>}
                        <Button
                          size="sm"
                          variant="tinted"
                          icon="plus"
                          onClick={ev => { ev.stopPropagation(); addToRoutineSheet(e) }}
                        >
                          {t('Plan')}
                        </Button>
                      </div>
                    </Fragment>
                  )
                })}
                {categoryExercises.length === 0 && (
                  <div className="empty">
                    {viewChosen
                      ? t('Nothing chosen yet — add exercises and they’ll show up here.')
                      : t('No exercises found with the selected equipment.')}
                  </div>
                )}
              </div>

              {categoryExercises.length > shown && (
                <div style={{ marginTop: 12 }}>
                  <Button onClick={() => setShown(s => s + 50)}>{t('Show more')}</Button>
                </div>
              )}
            </div>
          ) : activeCategory && activeCategory.hasSubcategories && !activeSubcategory ? (
            /* 1C. Subcategory Directory (Legs or Arms) */
            <div className="exercise-category-picker" style={{ padding: 0 }}>
              <div className="ecp-nav-row">
                <button type="button" className="ecp-back-btn" onClick={resetCategoryNav}>
                  <Icon name="chevronLeft" size={18} />
                  <span>{t('All Muscle Groups')}</span>
                </button>
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
                      setSearchParams({ cat: activeCategory.id, sub: sub.id })
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
          ) : (
            /* 1D. Main Top-Level Muscle Groups Directory (Matching User's Screenshot) */
            <div className="exercise-category-picker" style={{ padding: 0 }}>
              {/* Search Bar */}
              <div className="search" style={{ marginBottom: 12 }}>
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                  className="input"
                  placeholder={t('Search {0} exercises or pick a muscle…', availableAllList.length)}
                  value={q}
                  onChange={e => { setQ(e.target.value); setShown(50) }}
                />
                {q && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => { setQ(''); setShown(50) }}
                    aria-label="Clear search"
                  >
                    <Icon name="xmark" size={14} />
                  </button>
                )}
              </div>

              {/* Recently Chosen Row (shown if user has logged exercises) */}
              {chosenCount > 0 && (
                <div className="ecp-favorites-bar">
                  <button
                    type="button"
                    className="ecp-fav-chip"
                    onClick={() => {
                      setSearchParams({ view: 'chosen' })
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

              {/* Muscle Group Cards List (Modeled after user's screenshot) */}
              <div className="muscle-cat-list">
                {CATEGORY_DEFS.map(cat => {
                  const count = categoryCounts[cat.id] || 0
                  return (
                    <div
                      key={cat.id}
                      className="muscle-cat-card"
                      onClick={() => {
                        setSearchParams({ cat: cat.id })
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
                  onClick={() => customExSheet(null, ex => exerciseDetailSheet(ex), q.trim())}
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
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODE 2 & 3: ESSENTIALS OR ALL A-Z                                        */}
      {/* ========================================================================= */}
      {(mode === 'essentials' || mode === 'all') && (
        <>
          <div className="search-filter-row" style={{ marginBottom: totalActiveFilters > 0 ? 8 : 12 }}>
            <div className="search" style={{ flex: 1, marginBottom: 0 }}>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              <input
                className="input"
                placeholder={t('Search…')}
                value={q}
                onChange={e => { setQ(e.target.value); setShown(40) }}
              />
              {q && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => { setQ(''); setShown(40) }}
                  aria-label="Clear search"
                >
                  <Icon name="xmark" size={14} />
                </button>
              )}
            </div>
            <button
              type="button"
              className={'filter-trigger-btn' + (totalActiveFilters > 0 ? ' on' : '')}
              onClick={() => exerciseFilterSheet({
                selectedBps,
                selectedEqs,
                allList: availableAllList,
                mode,
                isEssentialFn: isEssential,
                excludedEquipment: S.excludedEquipment || [],
                onApply: ({ selectedBps: nextBps, selectedEqs: nextEqs }) => {
                  setSelectedBps(nextBps)
                  setSelectedEqs(nextEqs)
                  setShown(40)
                }
              })}
              aria-label={t('Filters')}
              title={t('Filter by body part & equipment')}
            >
              <Icon name="sliders" />
              {totalActiveFilters > 0 && <span className="filter-badge">{totalActiveFilters}</span>}
            </button>
          </div>

          {/* Active Filter Chips */}
          {totalActiveFilters > 0 && (
            <div className="active-filters-bar" style={{ marginBottom: 12 }}>
              <div className="active-filter-chips">
                {selectedBps.map(b => (
                  <button
                    key={b}
                    type="button"
                    className="active-filter-chip"
                    onClick={() => {
                      setSelectedBps(cur => cur.filter(x => x !== b))
                      setShown(40)
                    }}
                    title={t('Remove filter')}
                  >
                    <span className="capitalize">{t(b)}</span>
                    <Icon name="xmark" size={11} />
                  </button>
                ))}
                {selectedEqs.map(x => (
                  <button
                    key={x}
                    type="button"
                    className="active-filter-chip"
                    onClick={() => {
                      setSelectedEqs(cur => cur.filter(item => item !== x))
                      setShown(40)
                    }}
                    title={t('Remove filter')}
                  >
                    <span className="capitalize">{t(x)}</span>
                    <Icon name="xmark" size={11} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="active-filter-clear-all"
                onClick={() => {
                  setSelectedBps([])
                  setSelectedEqs([])
                  setShown(40)
                }}
              >
                {t('Clear all')}
              </button>
            </div>
          )}

          <div className="list">
            <div className="item" onClick={() => customExSheet(null, ex => exerciseDetailSheet(ex), q.trim())}>
              <div className="thumb thumb-x"><Icon name="sparkles" /></div>
              <div className="grow">
                <div className="tt">{t('Create your own exercise')}</div>
                <div className="ss">{t('name + body part, no animation')}</div>
              </div>
              <Icon name="plus" className="chev" />
            </div>

            {flatFilteredList.slice(0, shown).map(e => {
              const best = bestWeightFor(S, e.id)
              const meta = getEssentialMeta(e.id)
              return (
                <div key={e.id} className="item" onClick={() => exerciseDetailSheet(e)}>
                  <Thumb ex={e} />
                  <div className="grow">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span className="tt capitalize">{e.n}</span>
                      {meta && <span className="badge-glass">{meta.badge}</span>}
                    </div>
                    <div className="ss capitalize">
                      {t(e.tg || e.bp)} · {t(e.eq)}
                    </div>
                    {meta?.why && (
                      <div style={{ fontSize: 11, color: 'var(--label-2)', marginTop: 3, lineHeight: 1.3 }}>
                        {meta.why}
                      </div>
                    )}
                  </div>
                  {best > 0 && <span className="tag acc">{fmtNum(best)}</span>}
                  <Button
                    size="sm"
                    variant="tinted"
                    icon="plus"
                    onClick={ev => { ev.stopPropagation(); addToRoutineSheet(e) }}
                  >
                    {t('Plan')}
                  </Button>
                </div>
              )
            })}
            {flatFilteredList.length === 0 && (
              <div className="empty">
                <div className="ico"><Icon name="magnifier" /></div>
                {t('No match')}
              </div>
            )}
          </div>

          {flatFilteredList.length > shown && (
            <>
              <div style={{ height: 10 }} />
              <Button onClick={() => setShown(s => s + 40)}>{t('Show more')}</Button>
            </>
          )}
        </>
      )}
    </>
  )
}
