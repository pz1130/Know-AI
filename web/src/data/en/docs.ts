import type { DocMeta } from '../docs'

/** English translations under public/docs/en/ */
export const docsEn: DocMeta[] = [
  {
    id: 'elevator',
    title: 'Concept map: LLM → Agent',
    file: 'en/concept-map-llm-to-agent.md',
    blurb: 'L0–L6 stack; locate requirements and vendor claims by layer.',
    audience: 'Onboarding · architecture alignment',
  },
  {
    id: 'definitions',
    title: 'Agent / Copilot / Workflow / RAG revision',
    file: 'en/agent-definitions-revision.md',
    blurb: 'Root definition + A/B axes + five knobs; testable criteria.',
    audience: 'Architects · platform governance',
  },
  {
    id: 'selection',
    title: 'AI requirements selection handbook',
    file: 'en/ai-requirements-selection-handbook.md',
    blurb: 'Triage tree, six forms, scorecard, scenarios, build order.',
    audience: 'Solution architects',
  },
  {
    id: 'cost',
    title: 'Cost & capacity estimation (forms A–F)',
    file: 'en/cost-capacity-estimation.md',
    blurb: 'Rough formulas and worked examples for tokens, latency, cost, concurrency; cost-gate values.',
    audience: 'Solution architects · budget review',
  },
  {
    id: 'handbook',
    title: 'Concept handbook for IT teams',
    file: 'en/concept-handbook-for-it.md',
    blurb: 'Term lookup + ten myths + learn-now vs later.',
    audience: 'IT training',
  },
  {
    id: 'glossary-book',
    title: 'Enterprise Agent Platform · term digest',
    file: 'en/enterprise-agent-platform-term-digest.md',
    blurb: 'Book terms across ten domains (model, data, RAG, runtime, security…).',
    audience: 'Deep read vs source book',
  },
  {
    id: 'ops',
    title: 'Release & operations checklist',
    file: 'en/release-and-operations-checklist.md',
    blurb: 'Launch gate, staged release, rollback, model drift monitoring, incident levels and postmortem template.',
    audience: 'Architecture · ops · on-call',
  },
]
