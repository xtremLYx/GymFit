import { ESSENTIAL_DATA, ESSENTIAL_IDS } from './essentials.js'
import { EXIDX } from './exercises.js'
import { uid } from './format.js'

/**
 * Deterministic Plan Generator
 * Science-backed, 4-6 exercises per routine, calibrated for available equipment.
 */

// Candidate exercises by movement pattern / muscle group across barbell, dumbbell, cable, machine, bodyweight
const MOVEMENT_POOLS = {
  chest_compound: ['0025', '0289', '0047', '0314', '0662', '0251'],
  chest_isolation: ['0662', '0251'],
  back_vertical: ['2330', '1326', '0818', '0017', '1431', '0007'],
  back_horizontal: ['0027', '0292', '0861', '1323'],
  shoulders_compound: ['0426', '0361', '0219', '0148'],
  shoulders_isolation: ['0334', '0178', '0359', '0225'],
  quads_compound: ['0043', '1760', '0410', '0739', '2287', '3543'],
  quads_isolation: ['0585', '1760'],
  posterior_compound: ['0085', '1459', '0032'],
  hamstring_isolation: ['0586', '0339', '1459', '0085'],
  calves: ['0605', '1370', '1379', '1373'],
  biceps: ['0031', '0447', '0313', '0165', '1648', '0298'],
  triceps: ['0241', '0194', '0060', '0251'],
  abs: ['0472', '0001']
}

/**
 * Pick the best exercise for a movement pool matching allowed equipment and excluding absent machines
 */
function pickBestForPool(poolKey, allowedEquipment, excludeIds = new Set(), excludedEquipment = []) {
  const pool = MOVEMENT_POOLS[poolKey] || []
  const excludedSet = new Set(excludedEquipment || [])

  for (const id of pool) {
    if (excludeIds.has(id)) continue
    const ex = EXIDX[id]
    if (!ex) continue
    if (excludedSet.has(ex.eq)) continue
    if (!allowedEquipment || allowedEquipment.length === 0 || allowedEquipment.includes(ex.eq)) {
      excludeIds.add(id)
      const isCompound = ESSENTIAL_DATA[id]?.compound ?? true
      return {
        id,
        sets: isCompound ? 4 : 3,
        reps: isCompound ? 8 : 12,
        weight: 0
      }
    }
  }
  // If no exact equipment match in pool, fallback to bodyweight option if not excluded
  if (!excludedSet.has('body weight')) {
    for (const id of pool) {
      if (excludeIds.has(id)) continue
      const ex = EXIDX[id]
      if (ex && ex.eq === 'body weight') {
        excludeIds.add(id)
        return { id, sets: 3, reps: 10, weight: 0 }
      }
    }
  }
  return null
}

/**
 * Generate starter routines deterministically
 * @param {string} splitType - 'ppl' | 'upperlower' | 'classic6' | 'fullbody'
 * @param {string[]} equipment - user's available equipment list
 * @param {string[]} [excludedEquipment] - equipment to filter out (e.g. absent machines)
 * @returns {Array<{ id: string, name: string, emoji: string, ex: Array }>}
 */
export function generateDeterministicPlan(splitType = 'ppl', equipment = [], excludedEquipment = []) {
  const eq = equipment.length ? equipment : ['barbell', 'dumbbell', 'cable', 'body weight', 'leverage machine', 'sled machine']
  const excl = excludedEquipment || []

  if (splitType === 'classic6') {
    // 🇮🇳 Classic Indian 6-Day Split:
    // Mon & Thu: Chest & Triceps
    // Tue & Fri: Back & Biceps
    // Wed & Sat: Legs & Shoulders
    // Sun: Rest
    const chestTriEx = []
    const chestTriSet = new Set()
    ;['chest_compound', 'chest_compound', 'chest_isolation', 'triceps', 'triceps'].forEach(p => {
      const item = pickBestForPool(p, eq, chestTriSet, excl)
      if (item) chestTriEx.push(item)
    })

    const backBiEx = []
    const backBiSet = new Set()
    ;['back_vertical', 'back_horizontal', 'back_vertical', 'biceps', 'biceps'].forEach(p => {
      const item = pickBestForPool(p, eq, backBiSet, excl)
      if (item) backBiEx.push(item)
    })

    const legShoulderEx = []
    const legShoulderSet = new Set()
    ;['quads_compound', 'posterior_compound', 'shoulders_compound', 'shoulders_isolation', 'calves'].forEach(p => {
      const item = pickBestForPool(p, eq, legShoulderSet, excl)
      if (item) legShoulderEx.push(item)
    })

    return [
      { id: uid(), name: 'Chest & Triceps', emoji: 'flame', ex: chestTriEx },
      { id: uid(), name: 'Back & Biceps', emoji: 'pullup', ex: backBiEx },
      { id: uid(), name: 'Legs & Shoulders', emoji: 'legs', ex: legShoulderEx }
    ]
  }

  if (splitType === 'ppl') {
    // Push Day
    const pushEx = []
    const pushExSet = new Set()
    ;['chest_compound', 'shoulders_compound', 'chest_compound', 'shoulders_isolation', 'triceps'].forEach(p => {
      const item = pickBestForPool(p, eq, pushExSet, excl)
      if (item) pushEx.push(item)
    })

    // Pull Day
    const pullEx = []
    const pullExSet = new Set()
    ;['back_vertical', 'back_horizontal', 'back_vertical', 'shoulders_isolation', 'biceps'].forEach(p => {
      const item = pickBestForPool(p, eq, pullExSet, excl)
      if (item) pullEx.push(item)
    })

    // Leg Day
    const legEx = []
    const legExSet = new Set()
    ;['quads_compound', 'posterior_compound', 'quads_compound', 'hamstring_isolation', 'calves'].forEach(p => {
      const item = pickBestForPool(p, eq, legExSet, excl)
      if (item) legEx.push(item)
    })

    return [
      { id: uid(), name: 'Push Day', emoji: 'barbell', ex: pushEx },
      { id: uid(), name: 'Pull Day', emoji: 'pullup', ex: pullEx },
      { id: uid(), name: 'Leg Day', emoji: 'legs', ex: legEx }
    ]
  }

  if (splitType === 'upperlower') {
    // Upper Day
    const upperEx = []
    const upperSet = new Set()
    ;['chest_compound', 'back_vertical', 'shoulders_compound', 'back_horizontal', 'triceps', 'biceps'].forEach(p => {
      const item = pickBestForPool(p, eq, upperSet, excl)
      if (item) upperEx.push(item)
    })

    // Lower Day
    const lowerEx = []
    const lowerSet = new Set()
    ;['quads_compound', 'posterior_compound', 'quads_isolation', 'hamstring_isolation', 'calves', 'abs'].forEach(p => {
      const item = pickBestForPool(p, eq, lowerSet, excl)
      if (item) lowerEx.push(item)
    })

    return [
      { id: uid(), name: 'Upper Body', emoji: 'biceps', ex: upperEx },
      { id: uid(), name: 'Lower Body', emoji: 'legs', ex: lowerEx }
    ]
  }

  // Default: Full Body 3-Day
  const fbA = []
  const fbASet = new Set()
  ;['quads_compound', 'chest_compound', 'back_vertical', 'shoulders_isolation', 'abs'].forEach(p => {
    const item = pickBestForPool(p, eq, fbASet, excl)
    if (item) fbA.push(item)
  })

  const fbB = []
  const fbBSet = new Set()
  ;['posterior_compound', 'back_horizontal', 'shoulders_compound', 'biceps', 'triceps'].forEach(p => {
    const item = pickBestForPool(p, eq, fbBSet, excl)
    if (item) fbB.push(item)
  })

  return [
    { id: uid(), name: 'Full Body A', emoji: 'barbell', ex: fbA },
    { id: uid(), name: 'Full Body B', emoji: 'dumbbell', ex: fbB }
  ]
}

/**
 * Generate plan for custom muscle group selection
 * @param {string[]} muscleSlugs - e.g. ['chest', 'deltoids', 'triceps']
 * @param {string[]} equipment - available equipment
 * @param {string[]} [excludedEquipment] - absent equipment
 * @returns {Array<{ id: string, sets: number, reps: number, weight: number }>}
 */
export function generateRoutineForMuscles(muscleSlugs = [], equipment = [], excludedEquipment = []) {
  const eq = equipment.length ? equipment : ['barbell', 'dumbbell', 'cable', 'body weight', 'leverage machine', 'sled machine']
  const excl = excludedEquipment || []
  const selectedEx = []
  const usedIds = new Set()

  const muscleToPools = {
    chest: ['chest_compound'],
    deltoids: ['shoulders_compound', 'shoulders_isolation'],
    'upper-back': ['back_vertical', 'back_horizontal'],
    biceps: ['biceps'],
    triceps: ['triceps'],
    quadriceps: ['quads_compound', 'quads_isolation'],
    hamstring: ['posterior_compound', 'hamstring_isolation'],
    gluteal: ['quads_compound', 'posterior_compound'],
    calves: ['calves'],
    abs: ['abs']
  }

  muscleSlugs.forEach(slug => {
    const pools = muscleToPools[slug] || []
    pools.forEach(poolKey => {
      const item = pickBestForPool(poolKey, eq, usedIds, excl)
      if (item && selectedEx.length < 7) {
        selectedEx.push(item)
      }
    })
  })

  // Ensure minimum 3 exercises if possible
  if (selectedEx.length < 3) {
    const fallback = pickBestForPool('chest_compound', eq, usedIds, excl) || pickBestForPool('back_vertical', eq, usedIds, excl)
    if (fallback) selectedEx.push(fallback)
  }

  return selectedEx
}

/**
 * Call Gemini API to generate or customize a routine based on natural language prompt
 * @param {string} apiKey - Google Gemini API Key
 * @param {string} prompt - User request, e.g. "Create a dumbbell-only push workout avoiding shoulder pain"
 * @param {string[]} availableEquipment - list of allowed equipment
 * @param {object[]} [currentRoutine] - existing routine to modify
 * @returns {Promise<{ name: string, emoji: string, ex: Array<{ id: string, sets: number, reps: number, weight: number }> }>}
 */
export async function generateWithGemini(apiKey, prompt, availableEquipment = [], currentRoutine = null) {
  const key = apiKey || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || ''

  // If no server/client key is provided yet, fallback to smart science-backed template routine
  if (!key) {
    const isLowBack = /back|spine|axial/i.test(prompt)
    const isShoulder = /shoulder|cuff|rotator/i.test(prompt)
    const isQuad = /quad|leg/i.test(prompt)
    const isUpperChest = /upper chest|chest|incline/i.test(prompt)

    let name = 'Custom AI Routine'
    let emoji = 'sparkles'
    let notes = 'Tailored custom routine generated to match your training constraints.'
    let exPool = []

    if (isLowBack) {
      name = 'Low-Back Friendly Workout'
      emoji = 'shield'
      notes = 'Spine-safe compound and isolation volume avoiding axial loading.'
      exPool = ['0289', '0251', '1326', '0585', '0586']
    } else if (isShoulder) {
      name = 'Shoulder-Safe Routine'
      emoji = 'arm'
      notes = 'Neutral grips and joint-friendly angles protecting rotator cuffs.'
      exPool = ['0289', '0241', '1326', '0861', '0313']
    } else if (isQuad) {
      name = 'Quad Hypertrophy Focus'
      emoji = 'legs'
      notes = 'Deep knee flexion movements maximizing quadriceps activation.'
      exPool = ['0410', '0585', '1760', '0605', '0472']
    } else if (isUpperChest) {
      name = 'Upper Chest & Shoulders'
      emoji = 'barbell'
      notes = 'Clavicular head and side delt emphasis for aesthetic upper body development.'
      exPool = ['0047', '0314', '0334', '0241', '0194']
    } else {
      name = 'Custom Express Session'
      emoji = 'dumbbell'
      notes = 'High-ROI compound movements adapted for time efficiency.'
      exPool = ['0025', '2330', '0043', '0334', '0447']
    }

    return {
      name,
      emoji,
      coachNotes: notes,
      ex: exPool.map(id => ({ id, sets: 3, reps: 10, weight: 0 }))
    }
  }

  // Provide high-ROI curated exercise candidates to Gemini so it returns exact IDs
  const essentialsSubset = Object.entries(ESSENTIAL_DATA).map(([id, meta]) => {
    const e = EXIDX[id]
    return { id, name: e?.n, eq: e?.eq, target: e?.tg, bodyPart: e?.bp, badge: meta.badge }
  })

  const systemInstruction = `You are an elite sports scientist and strength coach.
Generate a structured workout routine adhering strictly to hypertrophy science and Apple-grade precision.
Rules:
1. Return ONLY valid JSON adhering to the specified schema.
2. Select exercises from the provided exercise list whenever possible.
3. Restrict equipment to: ${availableEquipment.join(', ') || 'Any'}.
4. Limit the routine to 4-6 exercises. Avoid redundant overlapping movements.
5. Provide realistic sets (3-4) and reps (6-15).`

  const userContent = `User Request: "${prompt}"
${currentRoutine ? `Current Routine to modify: ${JSON.stringify(currentRoutine)}` : ''}

Available Curated Exercises (ID and details):
${JSON.stringify(essentialsSubset.slice(0, 35))}

Output JSON format:
{
  "name": "Routine Name",
  "emoji": "barbell",
  "exercises": [
    { "id": "0025", "sets": 3, "reps": 10 }
  ],
  "coachNotes": "Brief 1-sentence explanation of why this routine fits the request"
}`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: systemInstruction },
          { text: userContent }
        ]
      }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Gemini API error (${response.status}): ${errText}`)
  }

  const data = await response.json()
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!rawText) throw new Error('No response content from Gemini')

  const parsed = JSON.parse(rawText)
  const validExercises = (parsed.exercises || []).map(item => {
    const id = String(item.id).padStart(4, '0')
    const ex = EXIDX[id] ? id : '0025' // fallback if hallucinated
    return {
      id: ex,
      sets: Number(item.sets) || 3,
      reps: Number(item.reps) || 10,
      weight: 0
    }
  })

  return {
    name: parsed.name || 'Custom Routine',
    emoji: parsed.emoji || 'dumbbell',
    coachNotes: parsed.coachNotes || '',
    ex: validExercises
  }
}
