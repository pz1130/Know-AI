import type { MorphologyResult, TriageStep } from '../triage'

export const triageStepsEn: Record<string, TriageStep> = {
  q1: {
    id: 'q1',
    question: 'Is the final output “information” or “action”?',
    hint: 'Information = answers/reports/drafts for humans; Action = the system really changes something.',
    options: [
      { id: 'info', label: 'Information', detail: 'Humans decide after reading', next: 'q2' },
      { id: 'action', label: 'Action', detail: 'System mutates state or emits externally', next: 'q4' },
      {
        id: 'unclear',
        label: 'Unclear',
        detail: 'Usually two asks packed as one',
        result: 'split' as MorphologyResult,
        resultNote: 'Split the work; deliver the information half first. Most common project rescue.',
      },
    ],
  },
  q2: {
    id: 'q2',
    question: 'Where do answers come from?',
    hint: 'Need both sources → not one project. A and B stacks barely overlap.',
    options: [
      { id: 'unstructured', label: 'Unstructured materials', detail: 'Policies, handbooks, eval reports, board files…', next: 'q3a' },
      { id: 'structured', label: 'Structured data', detail: 'Loan / procurement / finance / results systems…', next: 'q3b' },
      {
        id: 'generate',
        label: 'Need new content',
        detail: 'Draft concept notes, supervision reports, country briefs…',
        result: 'C',
        resultNote: 'Form C: assisted drafting. Human confirms at the end. Ideal first AI project.',
      },
      {
        id: 'both',
        label: 'Both sources needed',
        result: 'split',
        resultNote: 'Run A and B as separate projects; route later if needed.',
      },
    ],
  },
  q3a: {
    id: 'q3a',
    question: 'Is the question space closed or open? (Knowledge Q&A)',
    hint: 'If you can list ≤ ~50 question types → closed; do not build retrieval.',
    options: [
      {
        id: 'closed',
        label: 'Closed (listable)',
        result: 'closed',
        resultNote: 'Classifier + parameterized templates. Order-of-magnitude cheaper and more accurate.',
      },
      {
        id: 'open',
        label: 'Open (unlistable)',
        result: 'A',
        resultNote: 'Form A: knowledge Q&A. Citations and retrieval-layer ACL are mandatory.',
      },
    ],
  },
  q3b: {
    id: 'q3b',
    question: 'Is the question space closed or open? (Data Q&A)',
    hint: 'Fixed portfolio reports → parameterized templates, not NL2SQL.',
    options: [
      {
        id: 'closed',
        label: 'Closed (fixed reports/questions)',
        result: 'closed',
        resultNote: 'Parameterized templates + precompute. Leaders will not wait 30s.',
      },
      {
        id: 'open',
        label: 'Open (free NL questions)',
        result: 'B',
        resultNote: 'Form B: data Q&A. First confirm authoritative metrics; if missing, it is a governance project.',
      },
    ],
  },
  q4: {
    id: 'q4',
    question: 'Can you draw the action path as a flowchart in advance?',
    hint: 'When business says “every project differs”, spend a week drawing before judging.',
    options: [
      { id: 'drawable', label: 'Yes; branches enumerable', next: 'q5', detail: '→ lean Form D' },
      {
        id: 'narrow',
        label: 'No, but domain is narrow',
        detail: '≤ ~10–15 systems/APIs, single business unit',
        next: 'q5e',
      },
      { id: 'multi', label: 'No, and multi-domain or multi-path parallel', next: 'q5f' },
    ],
  },
  q5: {
    id: 'q5',
    question: 'Is the action reversible? (Form D)',
    hint: 'Funds, external notices, board filings, sanctions/integrity → forced human gate.',
    options: [
      {
        id: 'rev',
        label: 'Fully reversible',
        result: 'D',
        resultNote: 'Form D: workflow automation. Auto-run with rollback. LLM only on select nodes.',
      },
      {
        id: 'comp',
        label: 'Compensatable',
        result: 'D',
        resultNote: 'Form D + compensating transactions + full audit.',
      },
      {
        id: 'irrev',
        label: 'Irreversible or external',
        result: 'gate',
        resultNote: 'Form D + forced human confirmation + full audit trail. Approvals stay with authorized humans.',
      },
    ],
  },
  q5e: {
    id: 'q5e',
    question: 'Is the action reversible? (Form E)',
    hint: 'Four prerequisites: ≤15 tools, single domain, rollback-tolerant, clear done criteria.',
    options: [
      {
        id: 'ok',
        label: 'Reversible/rollback OK and four prerequisites met',
        result: 'E',
        resultNote: 'Form E: bounded agent. Needs eval set, state recovery, initiator identity inheritance.',
      },
      {
        id: 'irrev',
        label: 'Irreversible / external / prerequisites fail',
        result: 'gate',
        resultNote: 'Fall back to Form D decomposition, or split writes behind human gates.',
      },
    ],
  },
  q5f: {
    id: 'q5f',
    question: 'Do you truly need multi-agent?',
    hint: 'Most “multi-agent” asks are D or E.',
    options: [
      {
        id: 'really',
        label: 'Subtasks truly independent or professional contexts must stay separate',
        result: 'F',
        resultNote: 'Form F: prefer a working Form E monolith first. 16+ weeks.',
      },
      {
        id: 'not',
        label: 'Can be a fixed flow or single bounded agent',
        result: 'E',
        resultNote: 'Prefer E or D. Multi-agent coordination/conflict/attribution costs usually dominate.',
      },
    ],
  },
}

export const hardConstraintsEn = [
  'Classification & ACL before features; filter at retrieval, not display',
  'Data egress & deploy model fixed before kickoff',
  'Accountable trail: who / when / inputs / advice / confirmer',
  'No AI conclusive judgments (sanctions, integrity, grievances, safeguards); retrieve & summarize only',
  'External publish firewalled; default “internal reference”',
  'Official multilingual texts require human review',
]

export function resultLabelEn(code: MorphologyResult): string {
  const map: Record<string, string> = {
    split: 'Split the requirement',
    closed: 'Closed demand · templates/routing suffice',
    gate: 'Workflow automation + forced human gate',
  }
  return map[code] ?? code
}
