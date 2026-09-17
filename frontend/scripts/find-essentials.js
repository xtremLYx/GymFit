import { EXDB } from '../src/lib/exercises-data.js'

const keywords = [
  'barbell bench press', 'dumbbell press', 'incline dumbbell', 'push-up', 'chest dip',
  'deadlift', 'barbell bent over row', 'pull-up', 'chin-up', 'lat pulldown', 'seated cable row',
  'overhead press', 'shoulder press', 'lateral raise', 'face pull', 'reverse fly',
  'barbell squat', 'leg press', 'split squat', 'leg extension', 'leg curl',
  'romanian deadlift', 'hip thrust', 'calf raise',
  'barbell curl', 'dumbbell curl', 'hammer curl', 'triceps pushdown', 'skull crusher', 'overhead triceps',
  'hanging leg raise', 'cable crunch', 'plank', 'rollout'
]

console.log('Searching for key movements:')
for (const kw of keywords) {
  const matches = EXDB.filter(e => e.n.toLowerCase().includes(kw))
  console.log(`\n=== KEYWORD: "${kw}" (${matches.length} matches) ===`)
  matches.slice(0, 4).forEach(m => {
    console.log(`  ID: ${m.id} | Name: "${m.n}" | Eq: "${m.eq}" | Bp: "${m.bp}" | Tg: "${m.tg}"`)
  })
}
