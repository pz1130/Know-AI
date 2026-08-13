import { useMemo, useState } from 'react'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

type Tab = 'terms' | 'confusions' | 'lectures' | 'flash'

export function Glossary() {
  const { t } = useUi()
  const g = ui.glossary
  const { terms, confusions, lectures, flashcards } = useContent()
  const [tab, setTab] = useState<Tab>('terms')
  const [q, setQ] = useState('')
  const [group, setGroup] = useState<string | null>(null)
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const groups = useMemo(() => [...new Set(terms.map((x) => x.group))], [terms])
  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      const hitQ = !q || term.term.includes(q) || term.def.includes(q)
      const hitG = !group || term.group === group
      return hitQ && hitG
    })
  }, [q, group, terms])

  const card = flashcards[cardIdx % flashcards.length]

  return (
    <div>
      <PageHeader kicker={t(g.kicker)} title={t(g.title)} desc={t(g.desc)} />

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ['terms', g.tabTerms],
            ['confusions', g.tabConf],
            ['lectures', g.tabLectures],
            ['flash', g.tabFlash],
          ] as const
        ).map(([id, label]) => (
          <Button key={id} active={tab === id} onClick={() => setTab(id)}>
            {t(label)}
          </Button>
        ))}
      </div>

      {tab === 'terms' && (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t(g.searchTerm)}
              className="flex-1 rounded-md border border-line bg-panel px-3 py-2 text-sm text-paper outline-none focus:border-copper/50"
            />
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setGroup(null)}
                className={`rounded border px-2 py-1 text-xs ${!group ? 'border-copper/40 text-copper bg-copper/10' : 'border-line text-mist'}`}
              >
                {t(ui.common.all)}
              </button>
              {groups.map((gr) => (
                <button
                  key={gr}
                  type="button"
                  onClick={() => setGroup(gr === group ? null : gr)}
                  className={`rounded border px-2 py-1 text-xs ${group === gr ? 'border-copper/40 text-copper bg-copper/10' : 'border-line text-mist'}`}
                >
                  {gr}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {filteredTerms.map((term) => (
              <Card key={term.term + term.group} className="!p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-copper">{term.term}</h3>
                  <Badge>{term.group}</Badge>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-mist">{term.def}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      {tab === 'confusions' && (
        <div className="grid gap-3 md:grid-cols-2">
          {confusions.map((c) => (
            <Card key={c.left + c.right} accent>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-paper">{c.left}</span>
                <span className="text-xs font-medium text-copper">vs</span>
                <span className="font-medium text-paper">{c.right}</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-fog">{c.point}</p>
            </Card>
          ))}
        </div>
      )}

      {tab === 'lectures' && (
        <div className="space-y-3">
          {lectures.map((l, i) => (
            <Card key={l.title}>
              <p className="text-[12px] font-medium text-mist">
                {t(g.talk)} {i + 1}
                {t(g.talkUnit) ? ` ${t(g.talkUnit)}` : ''}
              </p>
              <h3 className="mt-1 font-display text-lg text-paper">{l.title}</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <div>
                  <p className="text-[11px] font-medium text-mist">{t(g.what)}</p>
                  <p className="mt-1 text-xs text-fog leading-relaxed">{l.what}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-mist">{t(g.why)}</p>
                  <p className="mt-1 text-xs text-fog leading-relaxed">{l.why}</p>
                </div>
                <div className="rounded border border-danger/20 bg-danger/5 p-2">
                  <p className="text-[11px] font-medium text-danger">{t(g.myth)}</p>
                  <p className="mt-1 text-xs text-fog leading-relaxed">{l.myth}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'flash' && card && (
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="w-full min-h-[220px] rounded-xl border border-copper/30 bg-gradient-to-br from-panel to-ink-2 p-8 text-center shadow-lg transition-transform hover:scale-[1.01]"
          >
            {!flipped ? (
              <>
                <p className="text-[12px] font-medium text-mist">{t(g.front)}</p>
                <p className="mt-6 font-display text-xl text-paper">{card.front}</p>
              </>
            ) : (
              <>
                <p className="text-[12px] font-medium text-mist">{t(g.back)}</p>
                <p className="mt-6 text-sm leading-relaxed text-fog">{card.back}</p>
              </>
            )}
          </button>
          <div className="mt-4 flex items-center justify-between">
            <Button
              onClick={() => {
                setFlipped(false)
                setCardIdx((i) => (i - 1 + flashcards.length) % flashcards.length)
              }}
            >
              {t(ui.common.prev)}
            </Button>
            <span className="text-xs text-mist">
              {(cardIdx % flashcards.length) + 1} / {flashcards.length}
            </span>
            <Button
              onClick={() => {
                setFlipped(false)
                setCardIdx((i) => (i + 1) % flashcards.length)
              }}
            >
              {t(ui.common.nextCard)}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
