// Verify every mind-map node's heading prefix hits exactly one heading in its doc (zh + en).
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const j = JSON.parse(readFileSync(join(root, 'web/src/data/mindmap.json'), 'utf8'))
const cache = {}
const heads = (f) => (cache[f] ??= readFileSync(join(root, 'web/public/docs', f), 'utf8')
  .split('\n').filter((l) => /^#{1,4} /.test(l))
  .map((l) => l.replace(/^#+ /, '').replace(/[*`]/g, '').replace(/\s+/g, ' ').trim()))
let bad = 0, n = 0
const walk = (x) => {
  if (x.doc) for (const [k, i] of [['hz', 0], ['he', 1]]) {
    if (!x[k]) continue
    n++
    const f = j.files[x.doc][i]
    const hits = heads(f).filter((h) => h.startsWith(x[k].replace(/\s+/g, ' ').trimStart()))
    if (hits.length !== 1) { bad++; console.error(`✗ ${f} ${JSON.stringify(x[k])} → ${hits.length} hits`) }
  }
  x.children.forEach(walk)
}
walk(j)
if (bad) { console.error(`mind map: ${bad}/${n} links broken`); process.exit(1) }
console.log(`✓ mind map links OK (${n})`)
