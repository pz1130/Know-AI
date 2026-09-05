import { useMemo, useState } from 'react'
import { PageHeader, Card, Badge } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

export function Scenarios() {
  const { t } = useUi()
  const sc = ui.scenarios
  const { scenarios, dangerSignals, buildOrder } = useContent()
  const [q, setQ] = useState('')
  const [tag, setTag] = useState<string | null>(null)

  const tags = useMemo(() => {
    const s = new Set<string>()
    scenarios.forEach((x) => x.tags.forEach((tg) => s.add(tg)))
    return [...s].sort()
  }, [scenarios])

  const filtered = useMemo(() => {
    return scenarios.filter((s) => {
      const hitQ =
        !q ||
        s.quote.includes(q) ||
        s.result.includes(q) ||
        s.note.includes(q) ||
        s.tags.some((tg) => tg.includes(q))
      const hitT = !tag || s.tags.includes(tag)
      return hitQ && hitT
    })
  }, [q, tag, scenarios])

  return (
    <div className="space-y-10">
      <PageHeader kicker={t(sc.kicker)} title={t(sc.title)} desc={t(sc.desc)} />

      {/* Google-Style Search & Filter Bar */}
      <div className="space-y-4">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-mist text-sm">🔍</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(sc.searchPh)}
            className="w-full rounded-full border border-line bg-panel/85 py-3.5 pl-11 pr-24 text-sm text-paper shadow-xs backdrop-blur-xl outline-none transition-all placeholder:text-mist/60 focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20"
          />
          <span className="absolute right-4 rounded-full bg-panel-2 px-2.5 py-1 text-xs font-mono font-medium text-mist border border-line">
            {filtered.length} {t(ui.common.count)}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setTag(null)}
            className={[
              'rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer border',
              !tag
                ? 'border-[#4285F4] bg-[#4285F4]/15 text-[#4285F4] dark:text-[#8ab4f8] shadow-xs'
                : 'border-line bg-panel-2/70 text-mist hover:border-line-2 hover:text-fog',
            ].join(' ')}
          >
            {t(ui.common.all)}
          </button>
          {tags.map((tg) => (
            <button
              key={tg}
              type="button"
              onClick={() => setTag(tg === tag ? null : tg)}
              className={[
                'rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer border',
                tag === tg
                  ? 'border-[#4285F4] bg-[#4285F4]/15 text-[#4285F4] dark:text-[#8ab4f8] shadow-xs'
                  : 'border-line bg-panel-2/70 text-mist hover:border-line-2 hover:text-fog',
              ].join(' ')}
            >
              {tg}
            </button>
          ))}
        </div>
      </div>

      {/* Case Study Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((s, idx) => (
          <Card key={s.quote} className="p-6 hover:border-copper/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-lg font-bold text-paper leading-snug">
                  “{s.quote}”
                </p>
                <span className="font-mono text-xs font-bold text-mist shrink-0">
                  #{idx + 1}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="copper">{s.result}</Badge>
                {s.tags.map((tg) => (
                  <Badge key={tg}>{tg}</Badge>
                ))}
              </div>

              <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-fog font-normal">
                {s.note}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-3xl border border-dashed border-line">
          <p className="text-base text-mist">{t(sc.empty)}</p>
        </div>
      )}

      {/* Bottom Danger Signals & Build Order */}
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {/* Danger Signals (Google Red) */}
        <Card className="p-6 sm:p-8 border-[#EA4335]/30">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#EA4335]" />
            <h3 className="font-display text-xl font-bold text-[#EA4335]">{t(sc.danger)}</h3>
          </div>
          <p className="mt-1.5 text-xs text-mist">{t(sc.dangerHint)}</p>

          <ul className="mt-5 space-y-3">
            {dangerSignals.map((d) => (
              <li
                key={d}
                className="rounded-xl border border-[#EA4335]/25 bg-[#EA4335]/8 p-3 text-xs sm:text-sm leading-relaxed text-[#EA4335] dark:text-[#f28b82] flex items-start gap-2.5"
              >
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Build Order Roadmap (Google Blue/Green) */}
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#4285F4]" />
            <h3 className="font-display text-xl font-bold text-paper">{t(sc.build)}</h3>
          </div>
          <p className="mt-1.5 text-xs text-mist">{t(sc.buildHint)}</p>

          <div className="mt-5 space-y-4">
            {buildOrder.map((b) => (
              <div key={b.layer} className="rounded-2xl border border-line bg-panel-2/50 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#4285F4]/15 border border-[#4285F4]/30 px-2.5 py-0.5 text-xs font-mono font-bold text-[#4285F4] dark:text-[#8ab4f8]">
                    {b.layer}
                  </span>
                  <span className="text-sm font-bold text-paper">{b.title}</span>
                </div>
                <ul className="mt-2.5 space-y-1.5 pl-1">
                  {b.items.map((i) => (
                    <li key={i} className="text-xs text-mist flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-copper" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-fog border-t border-line pt-4">
            {t(sc.buildRec)}
          </p>
        </Card>
      </div>
    </div>
  )
}
