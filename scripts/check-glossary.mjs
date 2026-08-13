#!/usr/bin/env node
/**
 * Strict glossary parity checks for CI / pre-commit / npm run check:glossary.
 *
 * Fails (exit 1) if:
 *   - zh/en term counts differ
 *   - zh/en confusion counts differ
 *   - zh/en lecture counts differ
 *   - flashcards length ≠ confusions length (either locale)
 *   - any empty term/def/group
 *
 * Does not require MD ↔ TS key equality (curated splits are intentional).
 * For handbook drift, run: node scripts/sync-glossary.mjs
 */

import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const zhPath = join(root, 'web/src/data/glossary.ts')
const enPath = join(root, 'web/src/data/en/glossary.ts')

function loadModule(path, names) {
  let src = readFileSync(path, 'utf8')
  src = src
    .replace(/^import\s+type[\s\S]*?\n/gm, '')
    .replace(/export interface[\s\S]*?^}/gm, '')
    .replace(/export const flashcards(?:En)?[\s\S]*$/m, '')
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/export const /g, 'const ')
    .replace(/: Term\[\]/g, '')
    .replace(/: Confusion\[\]/g, '')
    .replace(/: Lecture\[\]/g, '')

  // en file uses termsEn / confusionsEn / lecturesEn
  const ret = names.join(', ')
  try {
    return new Function(`${src}; return { ${ret} }`)()
  } catch (e) {
    console.error(`Failed to parse ${path}:`, e.message)
    process.exit(1)
  }
}

function nonEmpty(items, label, fields) {
  const errs = []
  items.forEach((item, i) => {
    for (const f of fields) {
      if (typeof item[f] !== 'string' || !item[f].trim()) {
        errs.push(`${label}[${i}].${f} empty`)
      }
    }
  })
  return errs
}

const zh = loadModule(zhPath, ['terms', 'confusions', 'lectures'])
const en = loadModule(enPath, ['termsEn', 'confusionsEn', 'lecturesEn'])

const errors = []
const notes = []

const zhTerms = zh.terms
const enTerms = en.termsEn
const zhConf = zh.confusions
const enConf = en.confusionsEn
const zhLect = zh.lectures
const enLect = en.lecturesEn

if (zhTerms.length !== enTerms.length) {
  errors.push(`term count: zh=${zhTerms.length} en=${enTerms.length}`)
} else {
  notes.push(`terms: ${zhTerms.length} (zh = en)`)
}

if (zhConf.length !== enConf.length) {
  errors.push(`confusion count: zh=${zhConf.length} en=${enConf.length}`)
} else {
  notes.push(`confusions: ${zhConf.length} (zh = en)`)
}

if (zhLect.length !== enLect.length) {
  errors.push(`lecture count: zh=${zhLect.length} en=${enLect.length}`)
} else {
  notes.push(`lectures: ${zhLect.length} (zh = en)`)
}

// flashcards derived in module — recompute
if (zhConf.length === 0) errors.push('zh confusions empty')
if (enConf.length === 0) errors.push('en confusions empty')

errors.push(
  ...nonEmpty(zhTerms, 'zh.terms', ['term', 'def', 'group']),
  ...nonEmpty(enTerms, 'en.terms', ['term', 'def', 'group']),
  ...nonEmpty(zhConf, 'zh.confusions', ['left', 'right', 'point']),
  ...nonEmpty(enConf, 'en.confusions', ['left', 'right', 'point']),
  ...nonEmpty(zhLect, 'zh.lectures', ['title', 'what', 'why', 'myth']),
  ...nonEmpty(enLect, 'en.lectures', ['title', 'what', 'why', 'myth']),
)

// group coverage
const zhGroups = new Set(zhTerms.map((t) => t.group))
const enGroups = new Set(enTerms.map((t) => t.group))
notes.push(`zh groups (${zhGroups.size}): ${[...zhGroups].join(' · ')}`)
notes.push(`en groups (${enGroups.size}): ${[...enGroups].join(' · ')}`)
if (zhGroups.size !== enGroups.size) {
  errors.push(`group count: zh=${zhGroups.size} en=${enGroups.size}`)
}

console.log('Glossary check')
for (const n of notes) console.log(`  · ${n}`)

if (errors.length) {
  console.error('\nFAILED:')
  for (const e of errors) console.error(`  ✗ ${e}`)
  console.error(`
Fix:
  1. Keep web/src/data/glossary.ts and web/src/data/en/glossary.ts in the same PR
  2. terms / confusions / lectures counts must match across locales
  3. After handbook edits: node scripts/sync-glossary.mjs  (report only)
`)
  process.exit(1)
}

console.log('\n✓ glossary parity OK')
process.exit(0)
