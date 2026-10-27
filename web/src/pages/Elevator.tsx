import { useState } from 'react'
import type { LayerId } from '../data/layers'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

export function Elevator() {
  const { t, locale } = useUi()
  const { layers, crossCuts, laws } = useContent()
  const e = ui.elevator
  const [active, setActive] = useState<LayerId>('L2')
  const [stackOn, setStackOn] = useState(true)
  const layer = layers.find((l) => l.id === active)!
  const idx = layers.findIndex((l) => l.id === active)

  return (
    <div className="space-y-10">
      <PageHeader kicker={t(e.kicker)} title={t(e.title)} desc={t(e.desc)} />

      {/* Keynote Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-panel/60 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button active={stackOn} onClick={() => setStackOn((v) => !v)}>
            {stackOn ? t(e.stackOn) : t(e.stackOff)}
          </Button>
          <span className="text-xs text-mist">{t(e.stackHint)}</span>
        </div>

        <div className="text-xs font-mono text-mist">
          {locale === 'zh' ? '当前层级深度' : 'Active Layer Depth'}:{' '}
          <span className="font-bold text-copper">{layer.id}</span> ({idx + 1}/{layers.length})
        </div>
      </div>

      {/* Main Keynote Rack + Stage Card */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left Elevator Track */}
        <div className="relative rounded-3xl border border-line bg-panel/50 p-4 backdrop-blur-xl">
          <ul className="relative space-y-2">
            {[...layers].reverse().map((l) => {
              const li = layers.findIndex((x) => x.id === l.id)
              const below = stackOn && li <= idx
              const isActive = l.id === active
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setActive(l.id)}
                    className={[
                      'group relative flex w-full items-center gap-3.5 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 cursor-pointer',
                      isActive
                        ? 'border-[#4285F4]/60 bg-[#4285F4]/15 shadow-[0_4px_18px_rgba(66,133,244,0.25)] ring-1 ring-[#4285F4]/40'
                        : below
                          ? 'border-line bg-panel/75 opacity-90 hover:border-line-2'
                          : 'border-transparent opacity-40 hover:opacity-80 hover:bg-panel/40',
                    ].join(' ')}
                  >
                    <span
                      className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-transform group-hover:scale-105"
                      style={{
                        background: isActive || below ? `${l.color}25` : 'transparent',
                        color: l.color,
                        border: `1.5px solid ${l.color}`,
                        boxShadow: isActive ? `0 0 12px ${l.color}66` : 'none',
                      }}
                    >
                      {l.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-paper truncate">{l.name}</span>
                      <span className="block text-[11px] text-mist truncate">{l.subtitle}</span>
                    </span>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-[#4285F4] shadow-[0_0_8px_#4285F4]" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Right Keynote Presentation Slide Card */}
        <Card accent className="anim-fade-up p-8" key={active}>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge tone="copper">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
                  {layer.id} Architecture Layer
                </Badge>
                <span className="text-xs font-mono text-mist">
                  {idx + 1} of {layers.length}
                </span>
              </div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-paper tracking-tight">
                {layer.name}
              </h2>
              <p className="mt-1.5 text-base text-mist font-medium">{layer.subtitle}</p>
            </div>

            {/* Stepper Controllers */}
            <div className="flex gap-2">
              <Button
                disabled={idx === 0}
                onClick={() => setActive(layers[idx - 1].id)}
                className="gap-1.5"
              >
                <span>↓</span>
                <span>{t(e.down)}</span>
              </Button>
              <Button
                disabled={idx === layers.length - 1}
                onClick={() => setActive(layers[idx + 1].id)}
                className="gap-1.5"
              >
                <span>↑</span>
                <span>{t(e.up)}</span>
              </Button>
            </div>
          </div>

          {/* Solves & Key Insight Row */}
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-panel-2/50 p-5">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mist">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
                {t(e.solves)}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-fog font-normal">
                {layer.solves}
              </p>
            </div>

            <div className="rounded-2xl border border-[#FBBC05]/30 bg-[#FBBC05]/8 p-5">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FBBC05] dark:text-[#fdd663]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FBBC05]" />
                {t(e.insight)}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-paper font-medium">
                {layer.insight}
              </p>
            </div>
          </div>

          {/* Failure Modes (Google Red) */}
          <div className="mt-6">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA4335]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA4335]" />
              {t(e.failures)}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {layer.failures.map((f) => (
                <li
                  key={f}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#EA4335]/30 bg-[#EA4335]/10 px-3.5 py-1 text-xs font-semibold text-[#D93025] dark:text-[#f28b82]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EA4335]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Concepts (Google Blue) */}
          <div className="mt-6">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mist">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
              {t(e.concepts)}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {layer.concepts.map((c) => (
                <Badge key={c} tone="copper">
                  {c}
                </Badge>
              ))}
            </div>
          </div>

          {/* Morphologies (Google Green) */}
          {layer.morphologies.length > 0 && (
            <div className="mt-6">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#34A853]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34A853]" />
                {t(e.morphs)}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {layer.morphologies.map((m) => (
                  <Badge key={m} tone="teal">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Keynote Reference Panels */}
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#34A853]" />
            <h3 className="font-display text-lg font-bold text-paper">{t(e.cross)}</h3>
          </div>
          <div className="mt-4 space-y-3.5">
            {crossCuts.map((c) => (
              <div key={c.title} className="rounded-xl border border-line bg-panel-2/40 p-3.5">
                <p className="text-sm font-bold text-[#188038] dark:text-[#81c995]">{c.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">{c.body}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#EA4335]" />
            <h3 className="font-display text-lg font-bold text-paper">{t(e.laws)}</h3>
          </div>
          <div className="mt-4 space-y-3.5">
            {laws.map((l) => (
              <div key={l.title} className="rounded-xl border border-line bg-panel-2/40 p-3.5">
                <p className="text-sm font-bold text-[#D93025] dark:text-[#f28b82]">{l.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">{l.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
