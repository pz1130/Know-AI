import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { MorphologyResult } from '../data/triage'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

export function Triage() {
  const { t } = useUi()
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
    <div>
      <PageHeader kicker={t(tr.kicker)} title={t(tr.title)} desc={t(tr.desc)} />

      {!result && step && (
        <Card accent className="anim-fade-up" key={stepId}>
          <div className="flex items-center justify-between gap-2">
            <Badge tone="copper">
              {t(tr.step)} {history.length + 1} · {step.id.toUpperCase()}
            </Badge>
            <div className="flex gap-2">
              <Button onClick={back} disabled={history.length === 0}>
                {t(ui.common.back)}
              </Button>
              <Button onClick={reset}>{t(ui.common.reset)}</Button>
            </div>
          </div>
          <h2 className="mt-4 font-display text-xl text-paper md:text-2xl">{step.question}</h2>
          <p className="mt-2 text-sm text-mist">{step.hint}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {step.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => choose(opt)}
                className="rounded-lg border border-line bg-panel-2/50 p-4 text-left transition-colors hover:border-copper/40 hover:bg-copper/5"
              >
                <span className="block text-sm font-semibold text-paper">{opt.label}</span>
                {opt.detail && (
                  <span className="mt-1 block text-xs text-mist">{opt.detail}</span>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

      {result && (
        <div className="anim-fade-up space-y-4">
          <Card accent>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Badge tone="teal">{t(tr.conclusion)}</Badge>
                <h2 className="mt-2 font-display text-2xl text-paper">
                  {morph
                    ? `${t(tr.form)} ${morph.letter} · ${morph.name}`
                    : resultLabel(result.code)}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fog">{result.note}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={back}>{t(tr.editBack)}</Button>
                <Button variant="primary" onClick={reset}>
                  {t(tr.redo)}
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/score" className="text-sm text-copper no-underline hover:underline">
                {t(tr.toScore)}
              </Link>
              <Link
                to="/scenarios"
                className="text-sm text-copper no-underline hover:underline"
              >
                {t(tr.toScenarios)}
              </Link>
            </div>
          </Card>

          {morph && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <h3 className="text-[12px] font-medium text-mist">
                  {t(tr.must)}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {morph.must.map((m) => (
                    <li
                      key={m}
                      className="text-sm text-fog before:mr-2 before:text-copper before:content-['·']"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-mist">
                  {t(tr.duration)}：{morph.duration}
                </p>
                <p className="mt-1 text-xs text-mist">
                  {t(tr.layer)}：{morph.layer}
                </p>
              </Card>
              <Card>
                <h3 className="text-[12px] font-medium text-mist">
                  {t(tr.dissuade)}
                </h3>
                <ul className="mt-3 space-y-2">
                  {[...morph.dissuade, ...morph.notes].map((d) => (
                    <li key={d} className="text-sm text-mist leading-relaxed">
                      ⚠ {d}
                    </li>
                  ))}
                </ul>
                {morph.products.length > 0 && (
                  <>
                    <h3 className="mt-4 text-[12px] font-medium text-mist">
                      {t(tr.products)}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {morph.products.map((p) => (
                        <Badge key={p}>{p}</Badge>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            </div>
          )}

          <Card>
            <h3 className="font-display text-base text-copper">{t(tr.hard)}</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {hardConstraints.map((h) => (
                <li
                  key={h}
                  className="rounded border border-line bg-ink-2/50 px-3 py-2 text-xs leading-relaxed text-fog"
                >
                  {h}
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
