import { useMemo, useState } from 'react'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

export function Score() {
  const { t, locale } = useUi()
  const s = ui.score
  const { scoreDims, evaluateScores } = useContent()

  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(scoreDims.map((d) => [d.id, 1])),
  )
  const [classified, setClassified] = useState(false)
  const [accountability, setAccountability] = useState(false)

  // When locale changes, scoreDims labels change but ids stay same
  const dims = scoreDims

  const verdicts = useMemo(
    () => evaluateScores(scores, { classified, accountability }),
    [scores, classified, accountability, evaluateScores],
  )
  const total = dims.reduce((sum, d) => sum + (scores[d.id] ?? 0), 0)
  const max = dims.length * 3

  const summary = [
    locale === 'zh' ? `属性打分：总分 ${total}/${max}` : `Scorecard total ${total}/${max}`,
    ...dims.map(
      (d) => `${d.name}=${scores[d.id]}（${d.labels[scores[d.id] ?? 0]}）`,
    ),
    `${t(s.classified)}: ${classified ? (locale === 'zh' ? '是' : 'Yes') : locale === 'zh' ? '否' : 'No'}`,
    `${t(s.accountability)}: ${accountability ? (locale === 'zh' ? '是' : 'Yes') : locale === 'zh' ? '否' : 'No'}`,
    '',
    locale === 'zh' ? '结论：' : 'Verdicts:',
    ...verdicts.map((v) => `[${v.severity}] ${v.text}`),
  ].join('\n')

  return (
    <div>
      <PageHeader kicker={t(s.kicker)} title={t(s.title)} desc={t(s.desc)} />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {dims.map((d) => (
            <Card key={d.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-paper">{d.name}</h3>
                <span className="text-lg font-semibold tabular-nums text-copper">{scores[d.id] ?? 0}</span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                value={scores[d.id] ?? 0}
                onChange={(e) =>
                  setScores((prev) => ({ ...prev, [d.id]: Number(e.target.value) }))
                }
                className="mt-3 w-full"
              />
              <div className="mt-2 grid grid-cols-4 gap-1">
                {d.labels.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setScores((prev) => ({ ...prev, [d.id]: i }))}
                    className={[
                      'rounded border px-1.5 py-1.5 text-left text-[10px] leading-snug transition-colors',
                      (scores[d.id] ?? 0) === i
                        ? 'border-copper/50 bg-copper/15 text-copper'
                        : 'border-line text-mist hover:border-line-2',
                    ].join(' ')}
                  >
                    <span className="tabular-nums font-medium">{i}</span> {label}
                  </button>
                ))}
              </div>
            </Card>
          ))}

          <Card accent>
            <h3 className="font-display text-base text-copper">{t(s.bankFlags)}</h3>
            <p className="mt-2 text-xs leading-relaxed text-mist">{t(s.bankFlagsIntro)}</p>

            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={classified}
                onChange={(e) => setClassified(e.target.checked)}
                className="mt-1"
              />
              <span className="min-w-0">
                <span className="block text-sm text-paper">{t(s.classified)}</span>
                <span className="text-xs text-mist">{t(s.classifiedHint)}</span>
                <span className="mt-2 block rounded border border-line/80 bg-ink-2/40 px-2.5 py-2 text-[11px] leading-relaxed text-fog">
                  {t(s.classifiedHelp)}
                </span>
              </span>
            </label>

            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={accountability}
                onChange={(e) => setAccountability(e.target.checked)}
                className="mt-1"
              />
              <span className="min-w-0">
                <span className="block text-sm text-paper">{t(s.accountability)}</span>
                <span className="text-xs text-mist">{t(s.accountabilityHint)}</span>
                <span className="mt-2 block rounded border border-line/80 bg-ink-2/40 px-2.5 py-2 text-[11px] leading-relaxed text-fog">
                  {t(s.accountabilityHelp)}
                </span>
              </span>
            </label>
          </Card>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <Card>
            <p className="text-[12px] font-medium text-mist">
              {t(s.total)}
            </p>
            <p className="mt-1 font-display text-4xl text-copper">
              {total}
              <span className="text-lg text-mist"> / {max}</span>
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-3">
              <div
                className="h-full rounded-full bg-copper transition-all"
                style={{ width: `${(total / max) * 100}%` }}
              />
            </div>
            <div className="mt-4 space-y-1.5">
              {dims.map((d) => (
                <div key={d.id} className="flex items-center gap-2 text-[10px]">
                  <span className="w-20 truncate text-mist">
                    {d.name.replace(/^\d+\.\s*/, '')}
                  </span>
                  <div className="h-1.5 flex-1 rounded bg-ink-3">
                    <div
                      className="h-full rounded bg-teal/70"
                      style={{ width: `${((scores[d.id] ?? 0) / 3) * 100}%` }}
                    />
                  </div>
                  <span className="tabular-nums text-fog w-3">{scores[d.id] ?? 0}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-base text-paper">{t(s.rules)}</h3>
            <ul className="mt-3 space-y-2">
              {verdicts.map((v, i) => (
                <li
                  key={i}
                  className={[
                    'rounded border px-2.5 py-2 text-xs leading-relaxed',
                    v.severity === 'block'
                      ? 'border-danger/40 bg-danger/10 text-danger'
                      : v.severity === 'warn'
                        ? 'border-copper/40 bg-copper/10 text-copper'
                        : 'border-line bg-panel-2 text-fog',
                  ].join(' ')}
                >
                  <Badge
                    tone={
                      v.severity === 'block'
                        ? 'danger'
                        : v.severity === 'warn'
                          ? 'copper'
                          : 'safe'
                    }
                  >
                    {v.severity}
                  </Badge>
                  <p className="mt-1.5">{v.text}</p>
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 w-full"
              variant="primary"
              onClick={() => navigator.clipboard?.writeText(summary)}
            >
              {t(s.copySummary)}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
