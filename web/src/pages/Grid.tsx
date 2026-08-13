import { useMemo, useState } from 'react'
import type { ALevel, BLevel } from '../data/grid'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

const riskTone = {
  low: 'safe' as const,
  mid: 'copper' as const,
  high: 'danger' as const,
  critical: 'danger' as const,
}

export function Grid() {
  const { t } = useUi()
  const g = ui.grid
  const {
    aAxis,
    bAxis,
    cellLabel,
    knobs,
    portrait,
    coarseRows,
    coarseCols,
  } = useContent()

  const [a, setA] = useState<ALevel>(2)
  const [b, setB] = useState<BLevel>(1)
  const [knobVals, setKnobVals] = useState<Record<string, number>>({
    hitl: 2,
    reversibility: 0,
    state: 1,
    auth: 0,
    orchestration: 1,
  })

  const cell = useMemo(() => cellLabel(a, b), [a, b, cellLabel])
  const text = useMemo(() => portrait(a, b, knobVals), [a, b, knobVals, portrait])

  return (
    <div>
      <PageHeader kicker={t(g.kicker)} title={t(g.title)} desc={t(g.desc)} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <Card>
            <div className="mb-4 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[12px] font-medium text-mist">
                  {t(g.axisA)} {aAxis[a].label}
                </label>
                <input
                  type="range"
                  min={0}
                  max={3}
                  value={a}
                  onChange={(e) => setA(Number(e.target.value) as ALevel)}
                  className="mt-2 w-full"
                />
                <p className="mt-1 text-xs text-mist">{aAxis[a].desc}</p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-[12px] font-medium text-mist">
                  {t(g.axisB)} {bAxis[b].label}
                </label>
                <input
                  type="range"
                  min={0}
                  max={3}
                  value={b}
                  onChange={(e) => setB(Number(e.target.value) as BLevel)}
                  className="mt-2 w-full"
                />
                <p className="mt-1 text-xs text-mist">{bAxis[b].desc}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border border-line p-2 text-left text-xs text-mist font-normal" />
                    {coarseCols.map((c) => (
                      <th
                        key={c.bLabel}
                        className="border border-line p-2 text-center text-xs text-mist font-medium"
                      >
                        {c.bLabel}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coarseRows.map((row) => (
                    <tr key={row.aLabel}>
                      <th className="border border-line p-2 text-left text-xs text-mist font-medium">
                        {row.aLabel}
                      </th>
                      {coarseCols.map((col) => {
                        const sampleA = row.aMax
                        const sampleB = col.bMax
                        const info = cellLabel(sampleA, sampleB)
                        const selected =
                          a >= row.aMin &&
                          a <= row.aMax &&
                          b >= col.bMin &&
                          b <= col.bMax
                        const critical = info.risk === 'critical'
                        return (
                          <td key={col.bLabel} className="border border-line p-0">
                            <button
                              type="button"
                              onClick={() => {
                                setA(sampleA)
                                setB(sampleB)
                              }}
                              className={[
                                'flex h-full min-h-[72px] w-full flex-col items-start justify-center p-3 text-left transition-colors',
                                selected
                                  ? critical
                                    ? 'bg-danger/25 ring-2 ring-inset ring-danger'
                                    : 'bg-copper/20 ring-2 ring-inset ring-copper'
                                  : critical
                                    ? 'bg-danger/10 hover:bg-danger/15'
                                    : 'hover:bg-panel-2',
                              ].join(' ')}
                            >
                              <span
                                className={`text-sm font-medium ${critical ? 'text-danger' : 'text-paper'}`}
                              >
                                {info.title}
                              </span>
                              {critical && (
                                <span className="mt-1 text-[11px] font-medium text-danger">
                                  {t(g.highRisk)}
                                </span>
                              )}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="mt-4" accent>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={riskTone[cell.risk]}>{cell.risk.toUpperCase()}</Badge>
              <h2 className="font-display text-xl text-paper">{cell.title}</h2>
              <span className="text-xs text-mist">
                {aAxis[a].label} × {bAxis[b].label}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-fog">{text}</p>
            <Button
              className="mt-4"
              variant="ghost"
              onClick={() => navigator.clipboard?.writeText(text)}
            >
              {t(g.copyPortrait)}
            </Button>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="font-display text-base text-copper">{t(g.knobs)}</h3>
            <p className="mt-1 text-xs text-mist">{t(g.knobsHint)}</p>
            <div className="mt-4 space-y-5">
              {knobs.map((k) => (
                <div key={k.id}>
                  <label className="text-xs font-medium text-fog">{k.name}</label>
                  <input
                    type="range"
                    min={0}
                    max={k.options.length - 1}
                    value={knobVals[k.id] ?? 0}
                    onChange={(e) =>
                      setKnobVals((prev) => ({
                        ...prev,
                        [k.id]: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full"
                  />
                  <p className="mt-1 text-[11px] text-copper">
                    {k.options[knobVals[k.id] ?? 0]?.label}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
