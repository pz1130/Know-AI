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
  const [copied, setCopied] = useState(false)

  const dims = scoreDims

  const verdicts = useMemo(
    () => evaluateScores(scores, { classified, accountability }),
    [scores, classified, accountability, evaluateScores],
  )
  const total = dims.reduce((sum, d) => sum + (scores[d.id] ?? 0), 0)
  const max = dims.length * 3
  const percent = Math.round((total / max) * 100)

  const summary = [
    locale === 'zh' ? `企业智能体架构属性打分：总分 ${total}/${max} (${percent}%)` : `Architecture Scorecard: Total ${total}/${max} (${percent}%)`,
    ...dims.map(
      (d) => `${d.name}=${scores[d.id]}（${d.labels[scores[d.id] ?? 0]}）`,
    ),
    `${t(s.classified)}: ${classified ? (locale === 'zh' ? '是' : 'Yes') : locale === 'zh' ? '否' : 'No'}`,
    `${t(s.accountability)}: ${accountability ? (locale === 'zh' ? '是' : 'Yes') : locale === 'zh' ? '否' : 'No'}`,
    '',
    locale === 'zh' ? '架构师裁决结论：' : 'Architecture Verdicts:',
    ...verdicts.map((v) => `[${v.severity.toUpperCase()}] ${v.text}`),
  ].join('\n')

  function handleCopy() {
    navigator.clipboard?.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-10">
      <PageHeader kicker={t(s.kicker)} title={t(s.title)} desc={t(s.desc)} />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left Scoring Dimensions */}
        <div className="space-y-5">
          {dims.map((d) => (
            <Card key={d.id} className="p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-bold text-paper">{d.name}</h3>
                <span className="rounded-full bg-[#4285F4]/15 border border-[#4285F4]/30 px-3 py-0.5 text-xs font-mono font-bold text-[#4285F4] dark:text-[#8ab4f8]">
                  Score: {scores[d.id] ?? 0} / 3
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={3}
                value={scores[d.id] ?? 0}
                onChange={(e) =>
                  setScores((prev) => ({ ...prev, [d.id]: Number(e.target.value) }))
                }
                className="mt-4 w-full cursor-pointer accent-[#4285F4]"
              />

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {d.labels.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setScores((prev) => ({ ...prev, [d.id]: i }))}
                    className={[
                      'rounded-xl border p-2.5 text-left text-xs leading-snug transition-all duration-200 cursor-pointer',
                      (scores[d.id] ?? 0) === i
                        ? 'border-[#4285F4] bg-[#4285F4]/15 text-paper font-semibold shadow-xs ring-1 ring-[#4285F4]/40'
                        : 'border-line bg-panel-2/50 text-mist hover:border-line-2 hover:bg-panel-2',
                    ].join(' ')}
                  >
                    <span className="block font-mono text-[10px] font-bold text-mist">
                      LV {i}
                    </span>
                    <span className="mt-0.5 block">{label}</span>
                  </button>
                ))}
              </div>
            </Card>
          ))}

          {/* Hard Constraints / Bank Flags */}
          <Card accent className="p-6 sm:p-8 border-[#EA4335]/30">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#EA4335]" />
              <h3 className="font-display text-lg font-bold text-paper">{t(s.bankFlags)}</h3>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-mist">{t(s.bankFlagsIntro)}</p>

            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-panel-2/50 p-4 transition-colors hover:border-line-2">
                <input
                  type="checkbox"
                  checked={classified}
                  onChange={(e) => setClassified(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-sm accent-[#EA4335] cursor-pointer"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-paper">{t(s.classified)}</span>
                  <span className="mt-0.5 block text-xs text-mist">{t(s.classifiedHint)}</span>
                  <span className="mt-2.5 block rounded-xl border border-line bg-panel/80 p-3 text-xs leading-relaxed text-fog">
                    {t(s.classifiedHelp)}
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-panel-2/50 p-4 transition-colors hover:border-line-2">
                <input
                  type="checkbox"
                  checked={accountability}
                  onChange={(e) => setAccountability(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-sm accent-[#EA4335] cursor-pointer"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-paper">{t(s.accountability)}</span>
                  <span className="mt-0.5 block text-xs text-mist">{t(s.accountabilityHint)}</span>
                  <span className="mt-2.5 block rounded-xl border border-line bg-panel/80 p-3 text-xs leading-relaxed text-fog">
                    {t(s.accountabilityHelp)}
                  </span>
                </span>
              </label>
            </div>
          </Card>
        </div>

        {/* Right Keynote Telemetry HUD */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-5">
          {/* Total Score HUD */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-mist flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
                {t(s.total)}
              </p>
              <Badge tone={percent > 70 ? 'danger' : percent > 40 ? 'warning' : 'safe'}>
                {percent > 70 ? 'HIGH COMPLEXITY' : percent > 40 ? 'MEDIUM' : 'LOW RISK'}
              </Badge>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-5xl font-extrabold text-paper tracking-tight">
                {total}
              </span>
              <span className="font-display text-lg text-mist">/ {max}</span>
              <span className="ml-auto font-mono text-xs font-bold text-mist">
                ({percent}%)
              </span>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-panel-2 border border-line">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${percent}%`,
                  background:
                    percent > 70
                      ? 'linear-gradient(90deg, #FBBC05, #EA4335)'
                      : percent > 40
                        ? 'linear-gradient(90deg, #4285F4, #FBBC05)'
                        : 'linear-gradient(90deg, #34A853, #4285F4)',
                }}
              />
            </div>

            {/* Dimension Breakdown Meters */}
            <div className="mt-5 space-y-2 pt-4 border-t border-line">
              {dims.map((d) => (
                <div key={d.id} className="flex items-center gap-2 text-xs">
                  <span className="w-24 truncate text-mist font-medium">
                    {d.name.replace(/^\d+\.\s*/, '')}
                  </span>
                  <div className="h-1.5 flex-1 rounded-full bg-panel-2 overflow-hidden border border-line">
                    <div
                      className="h-full rounded-full bg-[#4285F4]"
                      style={{ width: `${((scores[d.id] ?? 0) / 3) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-paper w-3 text-right">
                    {scores[d.id] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Verdicts & Rule Engine Results */}
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#4285F4]" />
              <h3 className="font-display text-base font-bold text-paper">{t(s.rules)}</h3>
            </div>

            <ul className="mt-4 space-y-2.5">
              {verdicts.map((v, i) => (
                <li
                  key={i}
                  className={[
                    'rounded-2xl border p-3.5 text-xs leading-relaxed transition-all',
                    v.severity === 'block'
                      ? 'border-[#EA4335]/40 bg-[#EA4335]/10 text-[#EA4335] dark:text-[#f28b82]'
                      : v.severity === 'warn'
                        ? 'border-[#FBBC05]/40 bg-[#FBBC05]/10 text-[#B06000] dark:text-[#fdd663]'
                        : 'border-line bg-panel-2/60 text-fog',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge
                      tone={
                        v.severity === 'block'
                          ? 'danger'
                          : v.severity === 'warn'
                            ? 'warning'
                            : 'safe'
                      }
                    >
                      {v.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="font-medium">{v.text}</p>
                </li>
              ))}
            </ul>

            <Button
              className="mt-5 w-full"
              variant="primary"
              onClick={handleCopy}
            >
              {copied
                ? locale === 'zh'
                  ? '✓ 已复制评审结论'
                  : '✓ Copied Verdicts'
                : t(s.copySummary)}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
