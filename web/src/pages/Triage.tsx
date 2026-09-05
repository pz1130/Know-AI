import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { MorphologyResult } from '../data/triage'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

export function Triage() {
  const { t, locale } = useUi()
  const tr = ui.triage
  const { triageSteps, hardConstraints, morphologies, resultLabel } = useContent()

  const [stepId, setStepId] = useState('q1')
  const [history, setHistory] = useState<{ step: string; option: string }[]>([])
  const [result, setResult] = useState<{ code: MorphologyResult; note: string } | null>(
    null,
  )

  const step = triageSteps[stepId]

  const morph = useMemo(() => {
    if (!result) return null
    if (['A', 'B', 'C', 'D', 'E', 'F'].includes(result.code)) {
      return morphologies.find((m) => m.id === result.code) ?? null
    }
    return null
  }, [result, morphologies])

  function choose(opt: (typeof step.options)[0]) {
    setHistory((h) => [...h, { step: stepId, option: opt.id }])
    if (opt.result) {
      setResult({ code: opt.result, note: opt.resultNote ?? '' })
    } else if (opt.next) {
      setStepId(opt.next)
    }
  }

  function reset() {
    setStepId('q1')
    setHistory([])
    setResult(null)
  }

  function back() {
    if (result) {
      setResult(null)
      return
    }
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setStepId(prev.step)
  }

  return (
    <div className="space-y-10">
      <PageHeader kicker={t(tr.kicker)} title={t(tr.title)} desc={t(tr.desc)} />

      {/* Step Wizard Question Card */}
      {!result && step && (
        <Card accent className="anim-fade-up p-8" key={stepId}>
          {/* Progress & Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div className="flex items-center gap-3">
              <Badge tone="copper">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4] animate-pulse" />
                {t(tr.step)} 0{history.length + 1} // {step.id.toUpperCase()}
              </Badge>
              <span className="text-xs font-mono text-mist">
                {locale === 'zh' ? `已完成 ${history.length} 个判定点` : `${history.length} decision points completed`}
              </span>
            </div>

            <div className="flex gap-2">
              <Button onClick={back} disabled={history.length === 0} className="gap-1.5">
                <span>←</span>
                <span>{t(ui.common.back)}</span>
              </Button>
              <Button onClick={reset}>{t(ui.common.reset)}</Button>
            </div>
          </div>

          {/* Question Text */}
          <div className="mt-6">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-paper tracking-tight">
              {step.question}
            </h2>
            <p className="mt-2 text-base text-mist">{step.hint}</p>
          </div>

          {/* Interactive Option Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {step.options.map((opt, i) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => choose(opt)}
                className="group relative flex flex-col justify-between rounded-2xl border border-line bg-panel-2/60 p-5 text-left transition-all duration-200 hover:border-[#4285F4] hover:bg-[#4285F4]/10 hover:shadow-[0_8px_24px_rgba(66,133,244,0.18)] hover:scale-[1.01] cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-mist group-hover:text-[#4285F4]">
                      0{i + 1}
                    </span>
                    <span className="h-2 w-2 rounded-full border border-mist/40 group-hover:bg-[#4285F4] group-hover:border-[#4285F4] transition-colors" />
                  </div>
                  <span className="mt-3 block font-display text-base font-bold text-paper group-hover:text-copper transition-colors">
                    {opt.label}
                  </span>
                  {opt.detail && (
                    <span className="mt-2 block text-xs leading-relaxed text-mist">
                      {opt.detail}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-end text-xs font-semibold text-copper opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{locale === 'zh' ? '选择' : 'Select'}</span>
                  <span className="ml-1">→</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Triage Reveal Result Screen */}
      {result && (
        <div className="anim-fade-up space-y-6">
          {/* Main Keynote Conclusion Slide */}
          <Card accent className="p-8 border-[#34A853]/40 shadow-[0_0_32px_rgba(52,168,83,0.15)]">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
              <div>
                <Badge tone="teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34A853]" />
                  {t(tr.conclusion)} · {locale === 'zh' ? '推荐落地形态' : 'Recommended Morphology'}
                </Badge>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-paper tracking-tight">
                  {morph
                    ? `${t(tr.form)} ${morph.letter} · ${morph.name}`
                    : resultLabel(result.code)}
                </h2>
                <p className="mt-2.5 max-w-3xl text-base leading-relaxed text-fog font-normal">
                  {result.note}
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={back}>{t(tr.editBack)}</Button>
                <Button variant="primary" onClick={reset}>
                  {t(tr.redo)}
                </Button>
              </div>
            </div>

            {/* Quick Link Pills */}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/score"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-4 py-2 text-xs font-semibold text-fog no-underline hover:border-[#4285F4] hover:text-paper"
              >
                <span>📊 {t(tr.toScore)}</span>
                <span>→</span>
              </Link>
              <Link
                to="/scenarios"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-4 py-2 text-xs font-semibold text-fog no-underline hover:border-[#34A853] hover:text-paper"
              >
                <span>🔍 {t(tr.toScenarios)}</span>
                <span>→</span>
              </Link>
            </div>
          </Card>

          {/* Morph Details: Must vs Traps */}
          {morph && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#34A853]" />
                  <h3 className="font-display text-base font-bold text-paper">{t(tr.must)}</h3>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {morph.must.map((m) => (
                    <li key={m} className="flex items-start gap-2.5 text-sm text-fog leading-relaxed">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34A853]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-line flex flex-wrap gap-4 text-xs text-mist font-medium">
                  <span>
                    {t(tr.duration)}：<strong className="text-paper">{morph.duration}</strong>
                  </span>
                  <span>
                    {t(tr.layer)}：<strong className="text-copper">{morph.layer}</strong>
                  </span>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#EA4335]" />
                  <h3 className="font-display text-base font-bold text-paper">{t(tr.dissuade)}</h3>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {[...morph.dissuade, ...morph.notes].map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-mist leading-relaxed">
                      <span className="mt-0.5 text-[#EA4335] shrink-0">⚠</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                {morph.products.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-line">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-mist">
                      {t(tr.products)}
                    </h4>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {morph.products.map((p) => (
                        <Badge key={p} tone="copper">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Hard Constraints Grid */}
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#EA4335]" />
              <h3 className="font-display text-base font-bold text-[#EA4335]">{t(tr.hard)}</h3>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {hardConstraints.map((h) => (
                <li
                  key={h}
                  className="rounded-2xl border border-[#EA4335]/25 bg-[#EA4335]/8 p-3.5 text-xs text-[#EA4335] dark:text-[#f28b82] leading-relaxed flex items-start gap-2"
                >
                  <span className="mt-0.5 shrink-0">🚫</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <div className="mt-10">
        <h3 className="font-display text-lg text-paper">{t(tr.overview)}</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {morphologies.map((m) => (
            <Card key={m.id} className="!p-3">
              <span className="text-xs font-medium text-copper">
                {t(tr.form)} {m.letter}
              </span>
              <p className="text-sm font-medium text-paper">
                {m.name}{' '}
                <span className="font-normal text-mist text-xs">· {m.short}</span>
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
