import type { MorphologyResult, TriageStep } from '../triage'

export const triageStepsEn: Record<string, TriageStep> = {
  q1: {
    id: 'q1',
    question: 'Is the final output “information” or “action”?',
    hint: 'Information is answers, reports or drafts for humans; action means the system really changes state — approving a withdrawal, sending a notice, writing back to the loan system.',
    options: [
      { id: 'info', label: 'Information', detail: 'Humans decide after reading', next: 'q2' },
      { id: 'action', label: 'Action', detail: 'System mutates state or emits externally', next: 'q4' },
      {
        id: 'unclear',
        label: 'Unclear',
        detail: 'Usually two asks packed as one',
        result: 'split' as MorphologyResult,
        resultNote: 'Split the work and deliver the information half first. If you need both clause answers and an award notice, do Q&A first. Most common project rescue.',
      },
    ],
  },
  q2: {
    id: 'q2',
    question: 'Where do answers come from?',
    hint: 'If you need both sources, do not treat them as one project. Knowledge Q&A and data Q&A stacks barely overlap.',
    options: [
      { id: 'unstructured', label: 'Unstructured materials', detail: 'Policies, handbooks, eval reports, board files…', next: 'q3a' },
      { id: 'structured', label: 'Structured data', detail: 'Loan / procurement / finance / results systems…', next: 'q3b' },
      {
        id: 'generate',
        label: 'Need new content',
        detail: 'Draft concept notes, supervision reports, country briefs…',
        result: 'C',
        resultNote: 'Form C: assisted drafting. A human confirms at the end. Country briefs or supervision-report drafts make a good first AI project.',
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
    hint: 'If you can list about fifty question types or fewer, it is closed — do not build retrieval.',
    options: [
      {
        id: 'closed',
        label: 'Closed (listable)',
        result: 'closed',
        resultNote: 'A classifier plus parameterized templates is enough. Usually an order of magnitude cheaper and more accurate.',
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
    hint: 'If the ask is a few fixed portfolio reports, use parameterized templates, not NL2SQL.',
    options: [
      {
        id: 'closed',
        label: 'Closed (fixed reports/questions)',
        result: 'closed',
        resultNote: 'Parameterized templates plus precompute. Leaders will not sit through a thirty-second wait for one number.',
      },
      {
        id: 'open',
        label: 'Open (free NL questions)',
        result: 'B',
        resultNote: 'Form B: data Q&A. First confirm authoritative definitions for amounts, currency and time; if they are missing, do metrics governance before NL2SQL.',
      },
    ],
  },
  q4: {
    id: 'q4',
    question: 'Can you draw the action path as a flowchart in advance?',
    hint: 'When business says “every project differs”, spend a week drawing before judging.',
    options: [
      { id: 'drawable', label: 'Yes; branches enumerable', next: 'q5', detail: 'Lean Form D' },
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
    hint: 'Funds, external notices, board filings, and sanctions or integrity determinations all need a forced human gate.',
    options: [
      {
        id: 'rev',
        label: 'Fully reversible',
        result: 'D',
        resultNote: 'Form D: workflow automation. Auto-run with rollback; the LLM usually sits on one or two nodes and the rest is hard-coded.',
      },
      {
        id: 'comp',
        label: 'Compensatable',
        result: 'D',
        resultNote: 'Form D, plus compensating transactions and a full audit trail.',
      },
      {
        id: 'irrev',
        label: 'Irreversible or external',
        result: 'gate',
        resultNote: 'Form D, plus a forced human confirmation gate and a full audit trail. Approvals stay with authorized humans.',
      },
    ],
  },
  q5e: {
    id: 'q5e',
    question: 'Is the action reversible? (Form E)',
    hint: 'Four prerequisites: at most fifteen tools, a single domain, rollback-tolerant failures, and clear done-criteria. Miss any and fall back to Form D.',
    options: [
      {
        id: 'ok',
        label: 'Reversible/rollback OK and four prerequisites met',
        result: 'E',
        resultNote: 'Form E: a bounded agent. Needs an eval set, state recovery, and access to business systems as the initiator.',
      },
      {
        id: 'irrev',
        label: 'Irreversible / external / prerequisites fail',
        result: 'gate',
        resultNote: 'Fall back to Form D and split the ask, or put writes behind human confirmation gates.',
      },
    ],
  },
  q5f: {
    id: 'q5f',
    question: 'Do you truly need multi-agent?',
    hint: 'Most asks labelled multi-agent turn out to be Form D or E once split.',
    options: [
      {
        id: 'really',
        label: 'Subtasks truly independent or professional contexts must stay separate',
        result: 'F',
        resultNote: 'Form F: prefer a working Form E monolith that proves the business first, then consider splitting. Plan on sixteen weeks or more.',
      },
      {
        id: 'not',
        label: 'Can be a fixed flow or single bounded agent',
        result: 'E',
        resultNote: 'Prefer Form E or D. Multi-agent coordination, conflict and attribution costs usually dominate the benefit.',
      },
    ],
  },
}

export const hardConstraintsEn = [
  'Freeze classification and ACL before features; filter at retrieval, not by hiding after a full-corpus search',
  'Decide data egress and how the model is deployed before kickoff',
  'Keep an accountable trail: who, when, which inputs, what advice, who confirmed',
  'No AI conclusive judgments on sanctions, integrity, grievances or safeguards — retrieve and summarize only',
  'Firewall external publishing; default label is internal reference',
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
