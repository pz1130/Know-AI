import { useState } from 'react'
import type { LayerId } from '../data/layers'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

export function Elevator() {
  const { t } = useUi()
  const { layers, crossCuts, laws } = useContent()
  const e = ui.elevator
  const [active, setActive] = useState<LayerId>('L2')
  const [stackOn, setStackOn] = useState(true)
  const layer = layers.find((l) => l.id === active)!
  const idx = layers.findIndex((l) => l.id === active)

  return (
    <div>
      <PageHeader kicker={t(e.kicker)} title={t(e.title)} desc={t(e.desc)} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button active={stackOn} onClick={() => setStackOn((v) => !v)}>
          {stackOn ? t(e.stackOn) : t(e.stackOff)}
        </Button>
        <span className="text-xs text-mist">{t(e.stackHint)}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="relative">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-line" />
          <ul className="relative space-y-1">
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
                      'relative flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-all',
                      isActive
                        ? 'border-copper/50 bg-copper/10'
                        : below
                          ? 'border-line bg-panel/60 opacity-90'
                          : 'border-transparent opacity-45 hover:opacity-80',
                    ].join(' ')}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                      style={{
                        background: isActive || below ? `${l.color}33` : 'transparent',
                        color: l.color,
                        border: `1px solid ${l.color}66`,
                      }}
                    >
                      {l.id}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-paper">{l.name}</span>
                      <span className="block text-[11px] text-mist">{l.subtitle}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <Card accent className="anim-fade-up" key={active}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge tone="copper">{layer.id}</Badge>
              <h2 className="mt-2 font-display text-2xl text-paper">{layer.name}</h2>
              <p className="mt-1 text-sm text-mist">{layer.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <Button disabled={idx === 0} onClick={() => setActive(layers[idx - 1].id)}>
                {t(e.down)}
              </Button>
              <Button
                disabled={idx === layers.length - 1}
                onClick={() => setActive(layers[idx + 1].id)}
              >
                {t(e.up)}
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-[12px] font-medium text-mist">
                {t(e.solves)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">{layer.solves}</p>
            </div>
            <div className="rounded-md border border-copper/25 bg-copper/5 p-3">
              <h3 className="text-[12px] font-medium text-mist">
                {t(e.insight)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-paper">{layer.insight}</p>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-[12px] font-medium text-mist">
              {t(e.failures)}
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {layer.failures.map((f) => (
                <li
                  key={f}
                  className="rounded border border-danger/25 bg-danger/10 px-2 py-1 text-xs text-danger"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <h3 className="text-[12px] font-medium text-mist">
              {t(e.concepts)}
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {layer.concepts.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>
          </div>

          {layer.morphologies.length > 0 && (
            <div className="mt-5">
              <h3 className="text-[12px] font-medium text-mist">
                {t(e.morphs)}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
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

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-display text-lg text-paper">{t(e.cross)}</h3>
          <div className="mt-4 space-y-3">
            {crossCuts.map((c) => (
              <div key={c.title} className="border-l-2 border-teal/40 pl-3">
                <p className="text-sm font-medium text-teal">{c.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">{c.body}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-lg text-paper">{t(e.laws)}</h3>
          <div className="mt-4 space-y-4">
            {laws.map((l) => (
              <div key={l.title}>
                <p className="text-sm font-medium text-copper">{l.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">{l.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
