import { useMemo, useState } from 'react'
import type { ALevel, BLevel } from '../data/grid'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

const riskTone = {
  low: 'safe' as const,
  mid: 'warning' as const,
  high: 'danger' as const,
  critical: 'danger' as const,
}

export function Grid() {
  const { t, locale } = useUi()
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
  const [copied, setCopied] = useState(false)
  const [knobVals, setKnobVals] = useState<Record<string, number>>({
    hitl: 2,
    reversibility: 0,
    state: 1,
    auth: 0,
    orchestration: 1,
  })

  const cell = useMemo(() => cellLabel(a, b), [a, b, cellLabel])
  const text = useMemo(() => portrait(a, b, knobVals), [a, b, knobVals, portrait])

  function handleCopy() {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-10">
      <PageHeader kicker={t(g.kicker)} title={t(g.title)} desc={t(g.desc)} />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Main Keynote Interactive Matrix Card */}
          <Card className="p-6 sm:p-8">
            {/* Axis Sliders */}
            <div className="mb-6 grid gap-5 sm:grid-cols-2 rounded-2xl border border-line bg-panel-2/40 p-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-mist flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
                    {t(g.axisA)}
                  </label>
                  <span className="rounded-full bg-[#4285F4]/15 border border-[#4285F4]/30 px-2.5 py-0.5 text-xs font-bold text-[#4285F4] dark:text-[#8ab4f8]">
                    {aAxis[a].label}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={3}
                  value={a}
                  onChange={(e) => setA(Number(e.target.value) as ALevel)}
                  className="mt-3 w-full cursor-pointer accent-[#4285F4]"
                />
                <p className="mt-1.5 text-xs text-mist">{aAxis[a].desc}</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-mist flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9B72CF]" />
                    {t(g.axisB)}
                  </label>
                  <span className="rounded-full bg-[#9B72CF]/15 border border-[#9B72CF]/30 px-2.5 py-0.5 text-xs font-bold text-[#9B72CF] dark:text-[#c4b5fd]">
                    {bAxis[b].label}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={3}
                  value={b}
                  onChange={(e) => setB(Number(e.target.value) as BLevel)}
                  className="mt-3 w-full cursor-pointer accent-[#9B72CF]"
                />
                <p className="mt-1.5 text-xs text-mist">{bAxis[b].desc}</p>
              </div>
            </div>

            {/* Keynote 4x4 Interactive Matrix Grid */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-left text-xs font-semibold text-mist uppercase tracking-wider" />
                    {coarseCols.map((c) => (
                      <th
                        key={c.bLabel}
                        className="p-3 text-center text-xs font-bold text-mist uppercase tracking-wider"
                      >
                        {c.bLabel}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coarseRows.map((row) => (
                    <tr key={row.aLabel}>
                      <th className="p-3 text-left text-xs font-bold text-mist whitespace-nowrap">
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
                          <td key={col.bLabel} className="p-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setA(sampleA)
                                setB(sampleB)
                              }}
                              className={[
                                'flex h-full min-h-[84px] w-full flex-col items-start justify-between rounded-2xl p-3.5 text-left transition-all duration-200 cursor-pointer border',
                                selected
                                  ? critical
                                    ? 'bg-[#EA4335]/20 border-[#EA4335] shadow-[0_0_20px_rgba(234,67,53,0.35)] ring-2 ring-[#EA4335]'
                                    : 'bg-[#4285F4]/20 border-[#4285F4] shadow-[0_0_20px_rgba(66,133,244,0.35)] ring-2 ring-[#4285F4]'
                                  : critical
                                    ? 'bg-[#EA4335]/8 border-[#EA4335]/25 hover:bg-[#EA4335]/15'
                                    : 'bg-panel-2/60 border-line hover:border-line-2 hover:bg-panel-2',
                              ].join(' ')}
                            >
                              <span
                                className={`text-sm font-bold leading-snug ${critical ? 'text-[#EA4335] dark:text-[#f28b82]' : 'text-paper'}`}
                              >
                                {info.title}
                              </span>
                              {critical ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#EA4335]/20 px-2 py-0.5 text-[10px] font-bold text-[#EA4335] dark:text-[#f28b82]">
                                  ⚠ {t(g.highRisk)}
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-mist">
                                  {sampleA} × {sampleB}
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

          {/* Keynote Architecture Spec Sheet Panel */}
          <Card accent className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <Badge tone={riskTone[cell.risk]}>
                  {cell.risk.toUpperCase()} RISK
                </Badge>
                <h2 className="font-display text-2xl font-extrabold text-paper tracking-tight">
                  {cell.title}
                </h2>
              </div>
              <span className="rounded-full bg-panel-2 px-3 py-1 font-mono text-xs font-semibold text-mist border border-line">
                {aAxis[a].label} × {bAxis[b].label}
              </span>
            </div>

            <p className="mt-4 text-base leading-relaxed text-fog font-normal whitespace-pre-line">
              {text}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Button variant="primary" onClick={handleCopy}>
                {copied
                  ? locale === 'zh'
                    ? '✓ 已复制架构画像'
                    : '✓ Copied Blueprint'
                  : t(g.copyPortrait)}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Engineering Knobs Sidebar */}
        <div>
          <Card className="p-6 sticky top-24">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FBBC05]" />
              <h3 className="font-display text-base font-bold text-paper">{t(g.knobs)}</h3>
            </div>
            <p className="mt-1 text-xs text-mist">{t(g.knobsHint)}</p>

            <div className="mt-6 space-y-6">
              {knobs.map((k) => (
                <div key={k.id} className="rounded-2xl border border-line bg-panel-2/30 p-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-fog">{k.name}</label>
                    <span className="text-xs font-mono font-bold text-copper">
                      Lv.{knobVals[k.id] ?? 0}
                    </span>
                  </div>
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
                    className="mt-2 w-full cursor-pointer accent-copper"
                  />
                  <p className="mt-1.5 text-xs font-semibold text-copper">
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
