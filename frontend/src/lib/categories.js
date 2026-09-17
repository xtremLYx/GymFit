/**
 * Muscle group category definitions and hierarchy.
 * Powers the organized Exercise directory in the Exercises tab and Add Exercise picker.
 */

export function usageMap(st) {
  const u = {}
  ;(st?.workouts || []).forEach(w => (w.ex || []).forEach(e => { u[e.id] = (u[e.id] || 0) + 1 }))
  ;(st?.routines || []).forEach(r => (r.ex || []).forEach(e => { u[e.id] = (u[e.id] || 0) + 1 }))
  return u
}

export const CATEGORY_DEFS = [
  {
    id: 'chest',
    title: 'Chest',
    subtitle: 'Pectorals & Serratus',
    img: '/muscles/chest.jpg',
    filter: e => e.bp === 'chest'
  },
  {
    id: 'back',
    title: 'Back',
    subtitle: 'Lats, Traps & Upper Back',
    img: '/muscles/back.jpg',
    filter: e => e.bp === 'back'
  },
  {
    id: 'legs',
    title: 'Legs',
    subtitle: 'Quads, Hamstrings, Glutes & Calves',
    img: '/muscles/upperlegs.jpg',
    hasSubcategories: true,
    subcategories: [
      {
        id: 'upper_legs',
        title: 'Upper Legs',
        subtitle: 'Quads, Hamstrings & Glutes',
        img: '/muscles/upperlegs.jpg',
        filter: e => e.bp === 'upper legs'
      },
      {
        id: 'lower_legs',
        title: 'Lower Legs / Calves',
        subtitle: 'Calves, Gastrocnemius & Soleus',
        img: '/muscles/lowerlegs.jpg',
        filter: e => e.bp === 'lower legs'
      },
      {
        id: 'all_legs',
        title: 'All Leg Exercises',
        subtitle: 'Complete Lower Body Movements',
        img: '/muscles/upperlegs.jpg',
        filter: e => e.bp === 'upper legs' || e.bp === 'lower legs'
      }
    ]
  },
  {
    id: 'shoulders',
    title: 'Shoulders',
    subtitle: 'Deltoids & Trapezius',
    img: '/muscles/shoulders.jpg',
    filter: e => e.bp === 'shoulders'
  },
  {
    id: 'arms',
    title: 'Arms',
    subtitle: 'Biceps, Triceps & Forearms',
    img: '/muscles/upperarms.jpg',
    hasSubcategories: true,
    subcategories: [
      {
        id: 'upper_arms',
        title: 'Upper Arms',
        subtitle: 'Biceps & Triceps',
        img: '/muscles/upperarms.jpg',
        filter: e => e.bp === 'upper arms'
      },
      {
        id: 'forearms',
        title: 'Forearms / Lower Arms',
        subtitle: 'Forearms & Grip Strength',
        img: '/muscles/forearms.jpg',
        filter: e => e.bp === 'lower arms'
      },
      {
        id: 'all_arms',
        title: 'All Arm Exercises',
        subtitle: 'Complete Arm Movements',
        img: '/muscles/upperarms.jpg',
        filter: e => e.bp === 'upper arms' || e.bp === 'lower arms'
      }
    ]
  },
  {
    id: 'abs',
    title: 'Abs & Core',
    subtitle: 'Abdominals, Obliques & Waist',
    img: '/muscles/abs.jpg',
    filter: e => e.bp === 'waist'
  },
  {
    id: 'cardio',
    title: 'Cardio & Full Body',
    subtitle: 'Cardiovascular & Conditioning',
    img: '/muscles/cardio.jpg',
    filter: e => e.bp === 'cardio'
  }
]

export function computeCategoryCounts(allExercises) {
  const counts = {}
  CATEGORY_DEFS.forEach(cat => {
    if (cat.hasSubcategories) {
      let catTotal = 0
      cat.subcategories.forEach(sub => {
        const c = allExercises.filter(sub.filter).length
        counts[sub.id] = c
        if (sub.id !== 'all_' + cat.id) catTotal += c
      })
      counts[cat.id] = catTotal
    } else {
      counts[cat.id] = allExercises.filter(cat.filter).length
    }
  })
  return counts
}
