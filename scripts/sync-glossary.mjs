#!/usr/bin/env node
/**
 * Keep web glossary terms aligned with 概念讲解手册_给IT团队.md (§1.1–1.11).
 *
 * Modes:
 *   (default) --check     Report drift: MD vs web/src/data/glossary.ts
 *   --write               Replace **terms only** from MD parse; keep confusions + lectures
 *   --dry-run             With --write: print stats, do not write
 *
 * English (web/src/data/en/glossary.ts) is never auto-translated; count drift is reported.
 *
 * Usage (repo root):
 *   node scripts/sync-glossary.mjs
 *   node scripts/sync-glossary.mjs --write
 *   node scripts/sync-glossary.mjs --write --dry-run
 *   node scripts/sync-glossary.mjs --md path/to/handbook.md
 *
 * Note: the live site may keep a hand-curated terms list (shorter defs, split cards).
 * Prefer --check after handbook edits; use --write only when the handbook should win.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const args = process.argv.slice(2)
const doWrite = args.includes('--write')
const dryRun = args.includes('--dry-run')
const mdIdx = args.indexOf('--md')
const mdPath = resolve(
  root,
  mdIdx >= 0 && args[mdIdx + 1] ? args[mdIdx + 1] : '概念讲解手册_给IT团队.md',
)
const outPath = join(root, 'web/src/data/glossary.ts')
const enPath = join(root, 'web/src/data/en/glossary.ts')

const SECTION_GROUP = [
  { re: /^##\s+1\.1\b/, group: '模型层' },
  { re: /^##\s+1\.2\b/, group: '数字概念' },
  { re: /^##\s+1\.3\b/, group: '交互' },
  { re: /^##\s+1\.4\b/, group: 'Agent 与工具' },
  { re: /^##\s+1\.5\b/, group: 'Agent 与工具' },
  { re: /^##\s+1\.6\b/, group: '检索' },
  { re: /^##\s+1\.7\b/, group: '数据' },
  { re: /^##\s+1\.8\b/, group: '工程' },
  { re: /^##\s+1\.9\b/, group: '安全' },
  { re: /^##\s+1\.10\b/, group: '治理与成本' },
  { re: /^##\s+1\.11\b/, group: '产品形态' },
]

const TERM_ALIAS = {
  'AI（人工智能）': 'AI',
  'LLM（Large Language Model，大语言模型）': 'LLM',
  'VLM（Vision-Language Model，视觉语言模型）': 'VLM',
  'MLLM（Multimodal Large Language Model，多模态大模型）': 'MLLM',
  'MoE（Mixture of Experts，混合专家）': 'MoE',
  '推理模型（Reasoning Model）': '推理模型',
  '基座模型与微调模型': '基座模型 / 微调模型',
  '幻觉（Hallucination）': '幻觉',
  'Token（词元）': 'Token',
  'Embedding（向量表示）': 'Embedding',
  'Parameter（参数）': 'Parameter',
  'Vocabulary Size（词表大小）': 'Vocabulary Size',
  'Context Window（上下文窗口）': 'Context Window',
  'Training Tokens（训练词元数）': 'Training Tokens',
  '输入 token 与输出 token': '输入 / 输出 token',
  'Temperature（温度）': 'Temperature',
  'Prompt（提示词）': 'Prompt',
  'System Prompt 与 User Prompt': 'System Prompt',
  'Few-shot（示例引导）': 'Few-shot',
  'Context（上下文）': 'Context',
  'Memory（记忆）': 'Memory',
  '结构化输出（Structured Output）/ JSON Schema': '结构化输出 / JSON Schema',
  '流式输出（Streaming）': '流式输出',
  'Agent（智能体）': 'Agent',
  'Function Calling / Tool Use（函数调用 / 工具使用）': 'Function Calling',
  'Tool Call（工具调用请求）': 'Tool Call',
  'Observation（观察结果）': 'Observation',
  'Agent Runtime（运行行为）': 'Agent Runtime',
  '工具注册中心（Tool Registry）': '工具注册中心',
  'MCP（Model Context Protocol）': 'MCP',
  'HITL（Human-in-the-Loop，人在回路）': 'HITL',
  'HITL（人在回路）': 'HITL',
  'Hook（钩子）': 'Hook',
  'Skill（技能）': 'Skill',
  'Plugin（插件）': 'Plugin',
  'Harness（运行框架 / 工作台）': 'Harness',
  '子 Agent（Sub-agent）': '子 Agent',
  'Workflow（工作流）': 'Workflow',
  'RAG（检索增强生成）': 'RAG',
  '上下文工程（Context Engineering）': '上下文工程',
  '向量库（Vector Database）': '向量库',
  '切分 / Chunking': '切分 Chunking',
  '稠密检索（Dense Retrieval）': '稠密检索',
  '稀疏检索（Sparse Retrieval）/ BM25': '稀疏检索 / BM25',
  '混合检索（Hybrid Search）/ RRF': '混合检索 / RRF',
  'Reranker（重排器）': 'Reranker',
  '向量索引（HNSW / IVF / PQ）': '向量索引',
  '召回率与准确率': '召回率 / 准确率',
  '文档解析与 OCR': '文档解析 / OCR',
  '知识库版本与时效': '知识库版本',
  'OLTP 与 OLAP': 'OLTP / OLAP',
  '数据仓库 / 湖仓': '数仓 / 湖仓',
  'MPP（大规模并行处理）': 'MPP',
  '时间旅行（Time Travel）': '时间旅行',
  'CDC（变更数据捕获）': 'CDC',
  'ETL 与 ELT': 'ETL / ELT',
  '指标与维度': '指标 / 维度',
  'NL2SQL（自然语言转 SQL）': 'NL2SQL',
  'Schema Linking（模式链接）': 'Schema Linking',
  '血缘（Lineage）': '血缘 Lineage',
  'Prompt Injection（提示注入）': 'Prompt Injection',
  '间接提示注入（Indirect Prompt Injection）': '间接提示注入',
  '护栏（Guardrails）': '护栏 Guardrails',
  'Copilot（助手）': 'Copilot',
  'Generative UI（生成式界面）': 'Generative UI',
  '脱敏与令牌化（Tokenization）': '脱敏 / 令牌化',
}

const SKIP_RAW = new Set(['大模型的本质', '叫法不通用', '这里要更正一个常见的画法'])

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function stripMd(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseTermsFromMd(md) {
  const cut = md.search(/\n# 第二部分/)
  const part1 = cut >= 0 ? md.slice(0, cut) : md
  const lines = part1.split(/\n/)
  let group = null
  /** @type {{term:string,def:string,group:string}[]} */
  const terms = []
  const seen = new Set()

  const push = (term, def, g) => {
    if (!term || !def || def.length < 6 || seen.has(term)) return
    seen.add(term)
    terms.push({ term, def, group: g })
  }

  for (const line of lines) {
    if (/^##\s+1\.1[2-9]\b/.test(line)) {
      group = null
      continue
    }
    for (const { re, group: g } of SECTION_GROUP) {
      if (re.test(line)) {
        group = g
        break
      }
    }
    if (!group) continue

    const m = line.match(/^\s*-?\s*\*\*([^*]+)\*\*\s*[—–-]+\s*(.+)$/)
    if (!m) continue

    let raw = m[1].trim()
    const def = stripMd(m[2])
    if (SKIP_RAW.has(raw)) continue

    if (raw === '合规框架') {
      push('OWASP LLM Top 10', '大模型应用的十大安全风险清单，作对照用。', group)
      push(
        'NIST AI RMF',
        'AI 风险管理框架，四项职能 GOVERN / MAP / MEASURE / MANAGE。',
        group,
      )
      push('EU AI Act', '欧盟人工智能立法。注意国际组织特有问题需自行补充。', group)
      continue
    }
    if (TERM_ALIAS[raw]) raw = TERM_ALIAS[raw]

    if (/ReAct/.test(raw) && /Plan-and-Execute/.test(raw)) {
      push('ReAct', 'Reason + Act 交替，边想边做。', group)
      push('Plan-and-Execute', '先出完整计划再逐步执行。', group)
      push('Reflexion', '失败后复盘轨迹再重试。', group)
      continue
    }

    push(raw, def, group)
  }
  return terms
}

function loadExistingTs(ts) {
  const body = ts
    .replace(/export interface[\s\S]*?^}/gm, '')
    .replace(/export const flashcards[\s\S]*$/m, '')
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/export const /g, 'const ')
    .replace(/: Term\[\]/g, '')
    .replace(/: Confusion\[\]/g, '')
    .replace(/: Lecture\[\]/g, '')
  try {
    return new Function(`${body}; return { terms, confusions, lectures }`)()
  } catch (e) {
    console.error('Failed to parse existing glossary.ts:', e.message)
    process.exit(1)
  }
}

function formatArray(arr, keys) {
  const items = arr.map((obj) => {
    const fields = keys.map((k) => `    ${k}: '${esc(obj[k])}',`).join('\n')
    return `  {\n${fields}\n  },`
  })
  return `[\n${items.join('\n')}\n]`
}

function main() {
  const md = readFileSync(mdPath, 'utf8')
  const fromMd = parseTermsFromMd(md)
  const existing = loadExistingTs(readFileSync(outPath, 'utf8'))

  const mdKeys = new Set(fromMd.map((t) => t.term))
  const tsKeys = new Set(existing.terms.map((t) => t.term))
  const onlyMd = [...mdKeys].filter((k) => !tsKeys.has(k)).sort((a, b) => a.localeCompare(b, 'zh'))
  const onlyTs = [...tsKeys].filter((k) => !mdKeys.has(k)).sort((a, b) => a.localeCompare(b, 'zh'))

  console.log(`Handbook: ${mdPath}`)
  console.log(`MD parse: ${fromMd.length} terms · glossary.ts: ${existing.terms.length} terms`)
  console.log(`confusions: ${existing.confusions.length} · lectures: ${existing.lectures.length}`)
  if (onlyMd.length) {
    console.log(`\nIn MD, not in TS (${onlyMd.length}):`)
    onlyMd.slice(0, 40).forEach((k) => console.log(`  + ${k}`))
    if (onlyMd.length > 40) console.log(`  … +${onlyMd.length - 40} more`)
  }
  if (onlyTs.length) {
    console.log(`\nIn TS, not in MD parse (${onlyTs.length}) — often intentional splits/curation:`)
    onlyTs.slice(0, 40).forEach((k) => console.log(`  · ${k}`))
    if (onlyTs.length > 40) console.log(`  … +${onlyTs.length - 40} more`)
  }
  if (!onlyMd.length && !onlyTs.length) {
    console.log('\n✓ Term keys match between MD parse and glossary.ts')
  }

  try {
    const enSrc = readFileSync(enPath, 'utf8')
    const enCount = (enSrc.match(/^\s*\{\s*term:/gm) || []).length
    console.log(`\nEN glossary: ${enCount} terms (zh ${existing.terms.length})`)
    if (enCount !== existing.terms.length) {
      console.log('⚠ EN count ≠ ZH — update web/src/data/en/glossary.ts')
    } else {
      console.log('✓ EN term count matches ZH')
    }
  } catch {
    console.log('\nNo EN file at', enPath)
  }

  if (!doWrite) {
    console.log('\n(check only — pass --write to replace terms from MD)')
    return
  }

  const terms = fromMd
  const out = `export interface Term {
  term: string
  def: string
  group: string
}

export interface Confusion {
  left: string
  right: string
  point: string
}

export interface Lecture {
  title: string
  what: string
  why: string
  myth: string
}

/**
 * terms: from handbook via \`node scripts/sync-glossary.mjs --write\`
 * confusions / lectures: curated (preserved by the script)
 */
export const terms: Term[] = [
${terms.map((t) => `  { term: '${esc(t.term)}', def: '${esc(t.def)}', group: '${esc(t.group)}' },`).join('\n')}
]

export const confusions: Confusion[] = ${formatArray(existing.confusions, ['left', 'right', 'point'])}

export const lectures: Lecture[] = ${formatArray(existing.lectures, ['title', 'what', 'why', 'myth'])}

export const flashcards = confusions.map((c, i) => ({
  id: i,
  front: \`\${c.left}  vs  \${c.right}\`,
  back: c.point,
}))
`

  console.log(`\n--write: ${terms.length} terms → ${outPath}${dryRun ? ' (dry-run)' : ''}`)
  if (!dryRun) {
    writeFileSync(outPath, out)
    console.log('Wrote glossary.ts (terms from MD; confusions/lectures preserved)')
  }
}

main()
