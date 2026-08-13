import type { Scenario } from '../scenarios'

export const scenariosEn: Scenario[] = [
  {
    quote: 'Make the procurement guide askable',
    result: 'Form A',
    note: 'Confirm which version is effective and financing-type exceptions—classic wrong-answer traps.',
    tags: ['knowledge', 'procurement'],
  },
  {
    quote: 'Let staff query lessons from past evaluation reports',
    result: 'Form A',
    note: 'High-value use case. Answers need citations and year; never decontextualize.',
    tags: ['knowledge', 'evaluation'],
  },
  {
    quote: 'Can board documents be asked too?',
    result: 'Form A',
    note: 'Classification is the hard constraint. Difficulty is ACL (retrieval filter + role scope), not Q&A.',
    tags: ['knowledge', 'classification', 'board'],
  },
  {
    quote: 'I want to query portfolio data without waiting for reports',
    result: 'Form B',
    note: 'First ask: is “commitment” approval, signing, or effectiveness amount? Inconsistency → metrics governance.',
    tags: ['data', 'portfolio'],
  },
  {
    quote: 'A portfolio cockpit you can talk to',
    result: 'Form B',
    note: 'Hidden challenges: latency and metric consistency. Precompute and align metrics early.',
    tags: ['data', 'leadership'],
  },
  {
    quote: 'Auto-generate country briefs',
    result: 'Form B + C',
    note: 'Numbers are B; prose is C. Two phases; country team must review text.',
    tags: ['drafting', 'data'],
  },
  {
    quote: 'Draft supervision mission report for task leads',
    result: 'Form C',
    note: 'Value is pulling prior missions and project basics—not model prose style.',
    tags: ['drafting', 'supervision'],
  },
  {
    quote: 'Draft a project concept note',
    result: 'Form C',
    note: 'Wire retrieval of similar past projects; pure generation is weaker.',
    tags: ['drafting'],
  },
  {
    quote: 'Risk review of loan agreement clauses',
    result: 'Form A + C',
    note: 'Surface risks with clause citations; legal concludes. Never auto-approve.',
    tags: ['knowledge', 'legal'],
  },
  {
    quote: 'Auto-review withdrawal applications',
    result: 'Form D + human gate',
    note: 'Dim 3 max (funds, irreversible). Completeness/consistency + flags only; reject any “auto-disburse”.',
    tags: ['workflow', 'funds'],
  },
  {
    quote: 'Auto-screen suppliers against sanctions lists',
    result: 'Form D · accountability-sensitive',
    note: 'List match + similarity only; compliance decides hits; both false pos/neg need trails.',
    tags: ['workflow', 'compliance'],
  },
  {
    quote: 'Can integrity due diligence be automated?',
    result: 'Accountability-sensitive · summarize only',
    note: 'AI max: public info assembly. No conclusions or risk ratings. Align early with business.',
    tags: ['compliance'],
  },
  {
    quote: 'Auto-classify and publish procurement notices',
    result: 'Form D',
    note: 'Classify can be auto; publish is irreversible external action—human confirm.',
    tags: ['workflow', 'procurement'],
  },
  {
    quote: 'Smart matching on consultant CV library',
    result: 'Form A or D',
    note: 'Depends on write-back. Protect personal data; no evaluative judgments on candidates.',
    tags: ['knowledge', 'HR'],
  },
  {
    quote: 'Disbursement lagging—let AI find why',
    result: 'Form E',
    note: 'Good fit: mostly read-only, safe failure, clear done criterion. Writes (rating changes, letters) need gates.',
    tags: ['agent', 'disbursement'],
  },
  {
    quote: 'Procurement complaint arrived—auto preliminary judgment?',
    result: 'Form E retrieval only',
    note: 'Precedents and applicable clauses OK; preliminary judgment is accountability-sensitive—no.',
    tags: ['agent', 'procurement'],
  },
  {
    quote: 'Auto-aggregate results indicators',
    result: 'Form B',
    note: 'Definitions scatter across frameworks; borrower data quality varies. Assess availability first.',
    tags: ['data'],
  },
  {
    quote: 'Member-language files should be askable too',
    result: 'Multilingual spike',
    note: 'Validate on real files; clarify if MT is working draft or official text.',
    tags: ['knowledge', 'multilingual'],
  },
  {
    quote: 'Search old scanned archives too',
    result: 'OCR pilot first',
    note: 'Legacy scan quality varies wildly—do not estimate duration from experience alone.',
    tags: ['knowledge', 'OCR'],
  },
  {
    quote: 'See how other MDBs do it—let AI research the web',
    result: 'High injection exposure',
    note: 'Consuming external pages is injection-prone; minimize tool rights; humans verify sources.',
    tags: ['security'],
  },
  {
    quote: 'Retrieve similar cases for the grievance mechanism',
    result: 'Form A · highly sensitive',
    note: 'Redact complainants, scope visibility, never output case conclusions—set first.',
    tags: ['knowledge', 'compliance'],
  },
  {
    quote: 'We want an AI platform that takes every request',
    result: 'Vision, not a requirement',
    note: 'Demand the first three concrete scenarios, triage each, then define shared platform v1.',
    tags: ['platform'],
  },
  {
    quote: 'Org X already went live—we need the same',
    result: 'Pilot vs production first',
    note: 'Gap is often ~10×: ACL, audit, failure recovery, cost control—where bank bars are highest.',
    tags: ['governance'],
  },
  {
    quote: 'Too much data—let AI find portfolio anomalies',
    result: 'Likely classic anomaly detection',
    note: 'Stats/ML cheaper and more explainable; models only narrate conclusions.',
    tags: ['data'],
  },
]

export const dangerSignalsEn = [
  'Business cannot define “done right”—no acceptance criteria, do not start',
  'Demands “100% accuracy”—reset expectations or use deterministic designs',
  'Scope words like “all / any / fully automatic”—not converged; split',
  'Funds, external publish, board, sanctions/integrity—human gate mandatory',
  'Restricted+ materials but unclear who may see what—ACL before features',
  'Process or metrics already messy—AI only spreads divergence faster',
  'Depends on borrower submissions of uncontrolled quality—sample first',
  'Pointing at a demo video “we want that”—confirm production vs pilot',
  'No business owner, only IT pushing—dies within six months',
]

export const buildOrderEn = [
  {
    layer: 'Layer 0',
    title: 'Shared foundation (first)',
    items: ['Model access & gateway', 'Prompt versioning', 'Observability', 'Cost breakers', 'Deploy form & data egress policy'],
  },
  {
    layer: 'Layer 1',
    title: 'Pick one path, not both',
    items: ['Knowledge: doc pipeline + vector DB + classification ACL', 'Data: warehouse/OLAP + metric definitions'],
  },
  {
    layer: 'Layer 2',
    title: 'Only when Forms D/E',
    items: ['Tool registry & ACL', 'State store', 'Orchestration engine', 'Sandbox', 'Identity propagation (inherit initiator)'],
  },
  {
    layer: 'Layer 3',
    title: 'Only when Forms E/F',
    items: ['Eval system', 'Red team', 'Fine-grained cost attribution', 'Multi-agent coordination'],
  },
]
