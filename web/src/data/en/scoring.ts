import type { ScoreDim, ScoreVerdict } from '../scoring'

export const scoreDimsEn: ScoreDim[] = [
  {
    id: 'decision',
    name: '1. Decision rights',
    labels: [
      'Human decides; system informs',
      'System drafts; human confirms',
      'System picks among fixed branches',
      'System generates paths at runtime',
    ],
  },
  {
    id: 'scope',
    name: '2. Scope',
    labels: [
      'Read-only text return',
      'Read-only cross-system query',
      'Writes own state/drafts',
      'Writes business systems or external emit',
    ],
  },
  {
    id: 'reversibility',
    name: '3. Reversibility',
    labels: [
      'Fully reversible',
      'Has compensation',
      'Hard to restore',
      'Irreversible, external, or funds',
    ],
  },
  {
    id: 'domain',
    name: '4. Domain width',
    labels: ['Single form/API', 'Single system', 'Single business domain', 'Cross business units'],
  },
  {
    id: 'duration',
    name: '5. Runtime length',
    labels: ['Seconds', 'Minutes', 'Hours', 'Multi-day / async waits'],
  },
  {
    id: 'data',
    name: '6. Data readiness',
    labels: [
      'Authoritative metrics defined',
      'Warehouse without unified metrics',
      'DBs without warehouse',
      'Data scattered across systems',
    ],
  },
  {
    id: 'verify',
    name: '7. Verifiability',
    labels: [
      'Gold answers for auto check',
      'Spot-checkable',
      'Only subjective human judgment',
      'Volume exceeds human review capacity',
    ],
  },
]

export function evaluateScoresEn(
  scores: Record<string, number>,
  flags: { classified: boolean; accountability: boolean },
): ScoreVerdict[] {
  const d = (id: string) => scores[id] ?? 0
  const total = scoreDimsEn.reduce((s, dim) => s + d(dim.id), 0)
  const out: ScoreVerdict[] = []

  if (d('scope') >= 2 && d('reversibility') >= 2) {
    out.push({
      severity: 'block',
      text: 'Dims 2 and 3 both ≥2 → human confirmation gate and full audit are mandatory.',
    })
  }
  if (d('reversibility') === 3 && d('decision') >= 2) {
    out.push({
      severity: 'block',
      text: 'Dim 3=3 and dim 1≥2 → funds/external + system decides. Not approvable; force dim 1 ≤1.',
    })
  }
  if (d('data') >= 2) {
    out.push({
      severity: 'warn',
      text: 'Dim 6≥2: if Form B, convert to metrics governance first and say so in the proposal.',
    })
  }
  if (d('verify') === 3) {
    out.push({
      severity: 'block',
      text: 'Dim 7=3 → requirement invalid. Output volume exceeds review capacity—errors go unseen.',
    })
  }
  if (d('decision') === 3 && d('domain') === 3) {
    out.push({
      severity: 'warn',
      text: 'Dim 1=3 and 4=3 → research project, not a delivery commitment. Do not promise go-live dates.',
    })
  }
  if (total < 6) {
    out.push({
      severity: 'ok',
      text: `Total ${total} < 6 → skip Agents; rules/templates/workflow engines are cheaper and safer.`,
    })
  } else {
    out.push({
      severity: 'ok',
      text: `Total ${total}. Refine components via triage + form cards.`,
    })
  }
  if (d('duration') >= 2) {
    out.push({
      severity: 'warn',
      text: 'Dim 5≥2 → need durable orchestration with checkpoint/resume; most light frameworks out.',
    })
  }
  if (flags.classified) {
    out.push({
      severity: 'block',
      text: 'Classification touch: ACL design must freeze before features.',
    })
  }
  if (flags.accountability) {
    out.push({
      severity: 'block',
      text: 'Accountability-sensitive: AI may only assemble materials; no conclusions.',
    })
  }
  return out
}
