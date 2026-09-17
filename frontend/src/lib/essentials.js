import { EXIDX, EXDB } from './exercises.js'

/**
 * Curated S-Tier Essentials (~45 high-ROI exercises).
 * Science-backed, hypertrophy-focused, beginner to advanced foundation.
 * Each entry includes:
 * - badge: short iconic tag for UI pills
 * - why: educational sentence ("Why do this?")
 * - compound: boolean (compound vs isolation)
 * - substitutes: array of fallback exercise IDs with equipment variety for in-gym quick swapping
 */
export const ESSENTIAL_DATA = {
  // === CHEST ===
  '0025': {
    badge: '🔥 Compound King',
    why: 'The gold standard for total pectoral development, front delts, and pressing strength.',
    compound: true,
    substitutes: ['0289', '0314', '0662', '0251']
  },
  '0047': {
    badge: '🎯 Upper Chest',
    why: 'Biased towards the clavicular head to create a full, 3D upper chest shelf.',
    compound: true,
    substitutes: ['0314', '0025', '0662']
  },
  '0289': {
    badge: '🛡️ Joint-Friendly',
    why: 'Dumbbells offer convergent pressing path and deeper stretch with less shoulder impingement.',
    compound: true,
    substitutes: ['0025', '0314', '0662']
  },
  '0314': {
    badge: '🎯 Clavicular Head',
    why: 'Deep stretch on the upper pecs with free range of wrist motion.',
    compound: true,
    substitutes: ['0047', '0289', '0025']
  },
  '0251': {
    badge: '⚡ Lower Pec / Dip',
    why: 'Massive stretch under load for lower pecs, anterior delts, and triceps.',
    compound: true,
    substitutes: ['0662', '0025', '0289']
  },
  '0662': {
    badge: '🏠 Anywhere Staple',
    why: 'Core integration with horizontal pressing mechanics; scale anywhere with zero gear.',
    compound: true,
    substitutes: ['0289', '0025', '0251']
  },

  // === BACK ===
  '0032': {
    badge: '👑 Total Posterior',
    why: 'Loads glutes, hamstrings, erectors, and traps with maximum mechanical tension.',
    compound: true,
    substitutes: ['0085', '1459', '0027']
  },
  '0027': {
    badge: '🧱 Back Thickness',
    why: 'Heavy barbell row targeting rhomboids, lats, and mid-traps for a thick back.',
    compound: true,
    substitutes: ['0292', '0861', '1323']
  },
  '0292': {
    badge: '🎯 Lat Stretch',
    why: 'One-arm support eliminates lower back fatigue and allows deep lat contraction.',
    compound: true,
    substitutes: ['0027', '0861', '1323']
  },
  '2330': {
    badge: '📐 V-Taper Width',
    why: 'Consistent cable tension matching the lat muscle fiber orientation for upper back width.',
    compound: true,
    substitutes: ['1326', '0818', '0017', '0007']
  },
  '0818': {
    badge: '📐 Parallel Lats',
    why: 'Neutral grip protects shoulders while driving elbows tight to the hips.',
    compound: true,
    substitutes: ['2330', '1326', '0861']
  },
  '1326': {
    badge: '💪 Bodyweight Pull',
    why: 'Supinated pull engages lats and biceps through full vertical extension.',
    compound: true,
    substitutes: ['2330', '1431', '0017']
  },
  '0017': {
    badge: '🌱 Assisted Pull',
    why: 'Controlled resistance curve to build foundational vertical pulling capacity.',
    compound: true,
    substitutes: ['2330', '1326', '0818']
  },
  '0861': {
    badge: '🎯 Mid-Back Thickness',
    why: 'Horizontally loads mid-traps and lats with zero shear stress on spine.',
    compound: true,
    substitutes: ['1323', '0292', '0027']
  },
  '1323': {
    badge: '⚡ Peak Squeeze',
    why: 'Rope allows natural hand flare at the contraction for maximal scapular retraction.',
    compound: true,
    substitutes: ['0861', '0292', '0027']
  },

  // === SHOULDERS ===
  '0426': {
    badge: '🏔️ Overhead Power',
    why: 'Direct vertical press for anterior and lateral deltoids with free shoulder rotation.',
    compound: true,
    substitutes: ['0361', '0219', '0148']
  },
  '0361': {
    badge: '⚖️ Unilateral Press',
    why: 'Corrects pressing asymmetries while challenging core anti-lateral flexion.',
    compound: true,
    substitutes: ['0426', '0219', '0148']
  },
  '0219': {
    badge: '⚡ Smooth Tension',
    why: 'Continuous cable resistance through the entire vertical pressing arc.',
    compound: true,
    substitutes: ['0426', '0361', '0148']
  },
  '0334': {
    badge: '🎯 Side Delt Width',
    why: 'The essential exercise for the visual illusion of broad shoulders and a narrow waist.',
    compound: false,
    substitutes: ['0178', '0426']
  },
  '0178': {
    badge: '⚡ Constant Tension',
    why: 'Cable provides peak resistance at the bottom stretch where dumbbells offer zero load.',
    compound: false,
    substitutes: ['0334']
  },
  '0359': {
    badge: '🛡️ Rear Delt Health',
    why: 'Balances pressing volume and builds the posterior shoulder head for 3D appearance.',
    compound: false,
    substitutes: ['0225', '0334']
  },
  '0225': {
    badge: '🏹 Cross-Over Rear',
    why: 'Follows natural rear delt line of pull without neck or trap dominance.',
    compound: false,
    substitutes: ['0359']
  },

  // === LEGS - QUADS ===
  '0043': {
    badge: '👑 King of Squats',
    why: 'Deep knee flexion recruits maximum quad, glute, and spinal erector motor units.',
    compound: true,
    substitutes: ['0739', '2287', '0585']
  },
  '0739': {
    badge: '🛡️ Low Back Safe',
    why: 'Overloads quads and glutes with heavy weight without axial spinal compression.',
    compound: true,
    substitutes: ['0043', '2287', '0585']
  },
  '2287': {
    badge: '⚖️ Single Leg Press',
    why: 'Isolates leg drive to eliminate strength discrepancies between quads.',
    compound: true,
    substitutes: ['0739', '0043', '0585']
  },
  '0585': {
    badge: '🎯 Rectus Femoris',
    why: 'Only movement that isolates quads at peak knee extension with no hip involvement.',
    compound: false,
    substitutes: ['0739', '0043']
  },

  // === LEGS - POSTERIOR CHAIN & HAMSTRINGS ===
  '0085': {
    badge: '🍑 Hamstring Stretch',
    why: 'Loaded hinge providing deep hamstring eccentric stretch for hamstring growth and posture.',
    compound: true,
    substitutes: ['1459', '0586', '0032']
  },
  '1459': {
    badge: '🛡️ Natural Hinge',
    why: 'Allows dumbbells to track closer to body center of gravity for safer lower back positioning.',
    compound: true,
    substitutes: ['0085', '0586', '0032']
  },
  '0586': {
    badge: '🎯 Knee Flexion Hamstrings',
    why: 'Direct isolation of the hamstring knee-flexor function to balance quad dominance.',
    compound: false,
    substitutes: ['0085', '1459']
  },
  '0605': {
    badge: '⚡ Gastrocnemius',
    why: 'Standing position keeps knees straight to target the upper, visible calf muscle.',
    compound: false,
    substitutes: ['1370']
  },
  '1370': {
    badge: '🏠 Free Weight Calves',
    why: 'Barbell or dumbbell calf loading without machine reliance.',
    compound: false,
    substitutes: ['0605']
  },

  // === ARMS - BICEPS ===
  '0031': {
    badge: '💪 Mass Builder',
    why: 'Fundamental heavy bicep overload across both short and long heads.',
    compound: false,
    substitutes: ['0447', '0313', '0165']
  },
  '0447': {
    badge: '🛡️ Wrist Ergonomics',
    why: 'Cambered bar reduces wrist and forearm pronation strain while maintaining heavy load.',
    compound: false,
    substitutes: ['0031', '0313', '0165']
  },
  '0313': {
    badge: '🔨 Brachialis & Grip',
    why: 'Neutral grip hammers the brachialis, pushing the bicep higher for greater arm thickness.',
    compound: false,
    substitutes: ['0165', '1648', '0298']
  },
  '0165': {
    badge: '⚡ Constant Arm Load',
    why: 'Rope provides uniform tension at the top contraction where dumbbells drop off.',
    compound: false,
    substitutes: ['0313', '1648', '0031']
  },
  '1648': {
    badge: '🎯 Strict Peak',
    why: 'Seated posture stops swinging and forces pure arm flexion.',
    compound: false,
    substitutes: ['0313', '0165']
  },

  // === ARMS - TRICEPS ===
  '0241': {
    badge: '🔱 Lateral Triceps',
    why: 'The quintessential triceps builder; v-bar pushdown for lateral and medial heads.',
    compound: false,
    substitutes: ['0194', '0060', '0251']
  },
  '0194': {
    badge: '🎯 Long Head Stretch',
    why: 'Overhead angle puts the long head of the triceps into full stretch under cable load.',
    compound: false,
    substitutes: ['0241', '0060']
  },
  '0060': {
    badge: '💀 Heavy Extension',
    why: 'Classic mass builder that creates intense eccentric stretch on the triceps tendon.',
    compound: false,
    substitutes: ['0241', '0194']
  },

  // === CORE / ABS ===
  '0472': {
    badge: '🔥 Lower Abs & Decompression',
    why: 'Hanging creates spine decompression while driving posterior pelvic tilt for deep ab activation.',
    compound: false,
    substitutes: ['0001']
  },
  '0001': {
    badge: '🏠 Classic Core',
    why: 'Controlled crunch motion curling the spine without hip-flexor take-over.',
    compound: false,
    substitutes: ['0472']
  }
}

export const ESSENTIAL_IDS = new Set(Object.keys(ESSENTIAL_DATA))

/**
 * Returns metadata for an exercise ID if it's an essential, or default/fallback info.
 */
export function getEssentialMeta(id) {
  return ESSENTIAL_DATA[id] || null
}

export function isEssential(id) {
  return ESSENTIAL_IDS.has(id)
}

/**
 * Returns list of quick swap candidate exercises matching available equipment and excluding absent machines.
 * @param {string} exerciseId - current exercise ID
 * @param {string[]} [allowedEquipments] - optional array of equipment types user has
 * @param {string[]} [excludedEquipments] - optional array of equipment types user lacks (e.g. ['leverage machine'])
 * @returns {Array<{ex: object, meta: object}>}
 */
export function getQuickSwaps(exerciseId, allowedEquipments = null, excludedEquipments = []) {
  const meta = ESSENTIAL_DATA[exerciseId]
  const currentEx = EXIDX[exerciseId]
  if (!currentEx) return []

  const excludedSet = new Set(excludedEquipments || [])

  let candidateIds = []
  if (meta && meta.substitutes && meta.substitutes.length) {
    candidateIds = [...meta.substitutes]
  }

  // Fallback 1: search other essentials with same target muscle or bodypart
  for (const [id] of Object.entries(ESSENTIAL_DATA)) {
    if (id !== exerciseId && !candidateIds.includes(id)) {
      const ex = EXIDX[id]
      if (ex && (ex.tg === currentEx.tg || ex.bp === currentEx.bp)) {
        candidateIds.push(id)
      }
    }
  }

  // Fallback 2: if still few candidates, search EXDB for matching target muscle
  if (candidateIds.length < 6 && Array.isArray(EXDB)) {
    for (const ex of EXDB) {
      if (ex.id !== exerciseId && !candidateIds.includes(ex.id)) {
        if (ex.tg === currentEx.tg || ex.bp === currentEx.bp) {
          candidateIds.push(ex.id)
          if (candidateIds.length >= 20) break
        }
      }
    }
  }

  const results = []
  for (const cid of candidateIds) {
    const ex = EXIDX[cid]
    if (!ex) continue

    // Filter out any equipment the user doesn't have / has excluded
    if (excludedSet.has(ex.eq)) continue

    // Filter by allowed equipment if provided
    if (allowedEquipments && allowedEquipments.length > 0) {
      if (!allowedEquipments.includes(ex.eq)) continue
    }

    results.push({
      ex,
      meta: ESSENTIAL_DATA[cid] || { badge: '🔄 Alternative', why: `Free weight/bodyweight alternative for ${ex.tg || ex.bp}.` }
    })
    if (results.length >= 6) break
  }

  return results
}

