import type { ALevel, BLevel, Knob } from '../grid'

export const aAxisEn = [
  { level: 0 as ALevel, label: 'A0', desc: 'Human decides; system only informs' },
  { level: 1 as ALevel, label: 'A1', desc: 'Human decides; system drafts candidates' },
  { level: 2 as ALevel, label: 'A2', desc: 'System decides only inside predefined branches' },
  { level: 3 as ALevel, label: 'A3', desc: 'System generates paths the developer never listed' },
]

export const bAxisEn = [
  { level: 0 as BLevel, label: 'B0', desc: 'Read-only, inside system boundary' },
  { level: 1 as BLevel, label: 'B1', desc: 'Read-only, cross-system query/retrieval' },
  { level: 2 as BLevel, label: 'B2', desc: 'Writes own state (drafts, memory, session)' },
  { level: 3 as BLevel, label: 'B3', desc: 'Writes external business state (orders, config, messages…)' },
]

export function cellLabelEn(a: ALevel, b: BLevel) {
  const aGroup = a <= 1 ? 'human' : a === 2 ? 'path' : 'runtime'
  const bGroup = b <= 1 ? 'read' : b === 2 ? 'self' : 'biz'

  if (aGroup === 'human' && bGroup === 'read')
    return { title: 'RAG / read assist', risk: 'low' as const, note: 'Information supply; humans decide.' }
  if (aGroup === 'human' && bGroup === 'self')
    return { title: 'Copilot draft zone', risk: 'low' as const, note: 'Writes drafts/memory; humans confirm before externalize.' }
  if (aGroup === 'human' && bGroup === 'biz')
    return { title: 'Automation with approval', risk: 'mid' as const, note: 'Writes business state but humans decide; approvals must be intelligible.' }
  if (aGroup === 'path' && bGroup === 'read')
    return { title: 'Retrieval pipeline', risk: 'low' as const, note: 'Fixed-path retrieval and routing.' }
  if (aGroup === 'path' && bGroup === 'self')
    return { title: 'Stateful workflow', risk: 'mid' as const, note: 'Hard-coded flow + internal state.' }
  if (aGroup === 'path' && bGroup === 'biz')
    return { title: 'Workflow', risk: 'mid' as const, note: 'Classic workflow; path is testable and auditable.' }
  if (aGroup === 'runtime' && bGroup === 'read')
    return { title: 'Research agent', risk: 'mid' as const, note: 'Runtime path planning, read-only.' }
  if (aGroup === 'runtime' && bGroup === 'self')
    return { title: 'Assistant agent', risk: 'high' as const, note: 'Where many market “Agents” actually sit.' }
  return {
    title: 'Agent · high-risk cell',
    risk: 'critical' as const,
    note: 'A3×B3: runtime paths and business writes. Full governance belongs here.',
  }
}

export const knobsEn: Knob[] = [
  {
    id: 'hitl',
    name: 'Human-in-the-loop (HITL)',
    options: [
      { value: 0, label: 'None' },
      { value: 1, label: 'Soft hint' },
      { value: 2, label: 'Final review' },
      { value: 3, label: 'Hard gate per action' },
    ],
  },
  {
    id: 'reversibility',
    name: 'Reversibility',
    options: [
      { value: 0, label: 'Fully reversible' },
      { value: 1, label: 'Compensatable' },
      { value: 2, label: 'Hard to restore' },
      { value: 3, label: 'Irreversible / external / funds' },
    ],
  },
  {
    id: 'state',
    name: 'State lifetime',
    options: [
      { value: 0, label: 'Stateless single turn' },
      { value: 1, label: 'In-session' },
      { value: 2, label: 'Long-term across sessions' },
    ],
  },
  {
    id: 'auth',
    name: 'Acting identity',
    options: [
      { value: 0, label: 'As user (inherit ACL)' },
      { value: 1, label: 'Delegated credentials' },
      { value: 2, label: 'Service account' },
    ],
  },
  {
    id: 'orchestration',
    name: 'Orchestration source',
    options: [
      { value: 0, label: 'Developer-fixed path' },
      { value: 1, label: 'Fixed skeleton + local generation' },
      { value: 2, label: 'Model generates at runtime' },
    ],
  },
]

export function portraitEn(a: ALevel, b: BLevel, knobVals: Record<string, number>): string {
  const cell = cellLabelEn(a, b)
  const hitl = knobsEn[0].options[knobVals.hitl ?? 0]?.label
  const rev = knobsEn[1].options[knobVals.reversibility ?? 0]?.label
  const auth = knobsEn[3].options[knobVals.auth ?? 0]?.label
  const orch = knobsEn[4].options[knobVals.orchestration ?? 0]?.label

  const warnings: string[] = []
  if (a === 3 && b === 3) warnings.push('In A3×B3 high-risk cell: full audit + compensation/saga required')
  if ((knobVals.reversibility ?? 0) >= 2 && a >= 2)
    warnings.push('Low reversibility + system decision: force human gates')
  if ((knobVals.auth ?? 0) === 2 && b >= 1)
    warnings.push('Service-account cross-system access = permission union; usually fails security review')
  if ((knobVals.hitl ?? 0) === 0 && b === 3)
    warnings.push('Business writes without HITL is unacceptable')

  return [
    `[${cell.title}] Decision ${aAxisEn[a].label} · Scope ${bAxisEn[b].label}.`,
    cell.note,
    `Knobs: HITL=${hitl}; Reversibility=${rev}; Identity=${auth}; Orchestration=${orch}.`,
    warnings.length ? `⚠ ${warnings.join('; ')}` : 'No hard-veto rules triggered by current knobs.',
  ].join(' ')
}

export const acceptanceQuestionsEn = [
  {
    q: 'If you turn off the LLM, can the system still complete the task?',
    yes: 'Essentially a workflow; LLM is interface sugar',
    no: 'Then A2+ (model participates in the path)',
  },
  {
    q: 'Without code changes, can it produce an action sequence the developer never listed?',
    yes: 'A3: runtime-generated paths',
    no: 'A2 or below: finite behavior space, fully testable',
  },
  {
    q: 'If any step fails, can business state stop in a mid-state?',
    yes: 'B3: need compensating transactions or sagas',
    no: 'Lower scope, or designed atomic/rollback-safe',
  },
  {
    q: 'Can action logs be replayed and each action attributed to a decision basis?',
    yes: 'Meets production audit prerequisite',
    no: 'Regardless of A/B level, not production-ready',
  },
]

export const coarseRowsEn = [
  { aLabel: 'A0–A1 human decides', aMin: 0 as ALevel, aMax: 1 as ALevel },
  { aLabel: 'A2 fixed path', aMin: 2 as ALevel, aMax: 2 as ALevel },
  { aLabel: 'A3 runtime generate', aMin: 3 as ALevel, aMax: 3 as ALevel },
]

export const coarseColsEn = [
  { bLabel: 'B0–B1 read', bMin: 0 as BLevel, bMax: 1 as BLevel },
  { bLabel: 'B2 write self', bMin: 2 as BLevel, bMax: 2 as BLevel },
  { bLabel: 'B3 write business', bMin: 3 as BLevel, bMax: 3 as BLevel },
]
