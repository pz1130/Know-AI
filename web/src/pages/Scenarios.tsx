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
    <div>
      <PageHeader kicker={t(sc.kicker)} title={t(sc.title)} desc={t(sc.desc)} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t(sc.searchPh)}
          className="w-full flex-1 rounded-md border border-line bg-panel px-3 py-2.5 text-sm text-paper outline-none placeholder:text-mist/60 focus:border-copper/50"
        />
        <span className="text-xs text-mist shrink-0">
          {filtered.length} {t(ui.common.count)}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setTag(null)}
          className={`rounded border px-2 py-1 text-xs ${!tag ? 'border-copper/40 bg-copper/15 text-copper' : 'border-line text-mist'}`}
        >
          {t(ui.common.all)}
        </button>
        {tags.map((tg) => (
          <button
            key={tg}
            type="button"
            onClick={() => setTag(tg === tag ? null : tg)}
            className={`rounded border px-2 py-1 text-xs ${tag === tg ? 'border-copper/40 bg-copper/15 text-copper' : 'border-line text-mist'}`}
          >
            {tg}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((s) => (
          <Card key={s.quote} className="!p-4">
            <p className="font-display text-base text-paper leading-snug">「{s.quote}」</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone="copper">{s.result}</Badge>
              {s.tags.map((tg) => (
                <Badge key={tg}>{tg}</Badge>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-mist">{s.note}</p>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-mist py-12">{t(sc.empty)}</p>
      )}

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-display text-lg text-danger">{t(sc.danger)}</h3>
          <p className="mt-1 text-xs text-mist">{t(sc.dangerHint)}</p>
          <ul className="mt-4 space-y-2">
            {dangerSignals.map((d) => (
              <li
                key={d}
                className="border-l-2 border-danger/40 pl-3 text-xs leading-relaxed text-fog"
              >
                {d}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="font-display text-lg text-copper">{t(sc.build)}</h3>
          <p className="mt-1 text-xs text-mist">{t(sc.buildHint)}</p>
          <div className="mt-4 space-y-4">
            {buildOrder.map((b) => (
              <div key={b.layer}>
                <p className="text-[12px] font-medium text-mist tracking-wide">
                  {b.layer} · {b.title}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {b.items.map((i) => (
                    <li key={i} className="text-xs text-mist">
                      · {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-fog leading-relaxed border-t border-line pt-3">
            {t(sc.buildRec)}
          </p>
        </Card>
      </div>
    </div>
  )
}
