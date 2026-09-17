import { EXDB } from '../src/lib/exercises-data.js'

const idsToCheck = [
  '0025', '0047', '0426', '0334', '0241', '0251',
  '2330', '0027', '1323', '0031', '0313',
  '0043', '0085', '0739', '0585', '0586', '0605',
  '0032', '0314', '0289', '0662', '1326', '0861',
  '0292', '0359', '0178', '0225', '0102', '1459',
  '0472', '0001', '0060', '0194', '0165', '1648',
  '1370', '0298', '0447', '0148', '0219', '0361',
  '0017', '1431', '0007', '0818', '1425', '2287'
]

console.log(`Checking ${idsToCheck.length} IDs:`)
const found = []
for (const id of idsToCheck) {
  const ex = EXDB.find(e => e.id === id)
  if (ex) {
    found.push({ id: ex.id, name: ex.n, eq: ex.eq, bp: ex.bp, tg: ex.tg })
    console.log(`[${ex.id}] ${ex.n} | ${ex.eq} | ${ex.bp} | ${ex.tg}`)
  } else {
    console.log(`[${id}] NOT FOUND`)
  }
}
console.log(`Found ${found.length} / ${idsToCheck.length}`)
