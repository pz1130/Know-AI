import { useMemo, useState } from 'react'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

type Tab = 'terms' | 'confusions' | 'lectures' | 'flash'

export function Glossary() {
  const { t, locale } = useUi()
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
      const hitQ = !q || term.term.toLowerCase().includes(q.toLowerCase()) || term.def.includes(q)
      const hitG = !group || term.group === group
      return hitQ && hitG
    })
  }, [q, group, terms])

  const card = flashcards[cardIdx % flashcards.length]

  return (
    <div className="space-y-10">
      <PageHeader kicker={t(g.kicker)} title={t(g.title)} desc={t(g.desc)} />

      {/* Google Keynote Segmented Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-full border border-line bg-panel/70 p-1.5 backdrop-blur-xl max-w-max">
        {(
          [
            ['terms', g.tabTerms, '📚'],
            ['confusions', g.tabConf, '⚖️'],
            ['lectures', g.tabLectures, '🎙️'],
            ['flash', g.tabFlash, '🎴'],
          ] as const
        ).map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={[
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer',
              tab === id
                ? 'bg-gradient-to-r from-[#4285F4] to-[#1A73E8] text-white shadow-[0_2px_12px_rgba(66,133,244,0.35)]'
                : 'text-mist hover:text-paper hover:bg-panel-2',
            ].join(' ')}
          >
            <span>{icon}</span>
            <span>{t(label)}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Terms Directory */}
      {tab === 'terms' && (
        <div className="space-y-6 anim-fade-up">
          {/* Search Bar + Group Pills */}
          <div className="space-y-4">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-mist text-sm">🔍</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t(g.searchTerm)}
                className="w-full rounded-full border border-line bg-panel/85 py-3.5 pl-11 pr-24 text-sm text-paper shadow-xs backdrop-blur-xl outline-none transition-all placeholder:text-mist/60 focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20"
              />
              <span className="absolute right-4 rounded-full bg-panel-2 px-2.5 py-1 text-xs font-mono font-medium text-mist border border-line">
                {filteredTerms.length} {t(ui.common.count)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setGroup(null)}
                className={[
                  'rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer border',
                  !group
                    ? 'border-[#4285F4] bg-[#4285F4]/15 text-[#4285F4] dark:text-[#8ab4f8] shadow-xs'
                    : 'border-line bg-panel-2/70 text-mist hover:border-line-2 hover:text-fog',
                ].join(' ')}
              >
                {t(ui.common.all)}
              </button>
              {groups.map((gr) => (
                <button
                  key={gr}
                  type="button"
                  onClick={() => setGroup(gr === group ? null : gr)}
                  className={[
                    'rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer border',
                    group === gr
                      ? 'border-[#4285F4] bg-[#4285F4]/15 text-[#4285F4] dark:text-[#8ab4f8] shadow-xs'
                      : 'border-line bg-panel-2/70 text-mist hover:border-line-2 hover:text-fog',
                  ].join(' ')}
                >
                  {gr}
                </button>
              ))}
            </div>
          </div>

          {/* Terms Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTerms.map((term) => (
              <Card
                key={term.term + term.group}
                className="p-5 hover:border-copper/40 hover:shadow-[0_8px_24px_rgba(66,133,244,0.12)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-paper text-[#4285F4] dark:text-[#8ab4f8]">
                      {term.term}
                    </h3>
                    <Badge tone="copper">{term.group}</Badge>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-fog font-normal">
                    {term.def}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-16 rounded-3xl border border-dashed border-line">
              <p className="text-base text-mist">
                {locale === 'zh' ? '没有匹配的术语，试试别的关键词。' : 'No matching terms found.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Confusions */}
      {tab === 'confusions' && (
        <div className="grid gap-5 md:grid-cols-2 anim-fade-up">
          {confusions.map((c) => (
            <Card key={c.left + c.right} accent className="p-6">
              <div className="flex flex-wrap items-center gap-2.5 pb-3 border-b border-line">
                <span className="rounded-full bg-panel-2 px-3 py-1 font-display text-sm font-bold text-paper border border-line">
                  {c.left}
                </span>
                <span className="font-mono text-xs font-bold text-copper">VS</span>
                <span className="rounded-full bg-panel-2 px-3 py-1 font-display text-sm font-bold text-paper border border-line">
                  {c.right}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-fog font-normal">
                {c.point}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Lectures */}
      {tab === 'lectures' && (
        <div className="space-y-5 anim-fade-up">
          {lectures.map((l, i) => (
            <Card key={l.title} className="p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#4285F4]/15 border border-[#4285F4]/30 px-2.5 py-0.5 text-xs font-mono font-bold text-[#4285F4] dark:text-[#8ab4f8]">
                    {t(g.talk)} 0{i + 1}
                  </span>
                  <h3 className="font-display text-xl font-bold text-paper">{l.title}</h3>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-line bg-panel-2/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#4285F4]">
                    {t(g.what)}
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-fog leading-relaxed font-normal">
                    {l.what}
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-panel-2/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#34A853]">
                    {t(g.why)}
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-fog leading-relaxed font-normal">
                    {l.why}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#EA4335]/30 bg-[#EA4335]/8 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#EA4335]">
                    {t(g.myth)}
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-fog leading-relaxed font-normal">
                    {l.myth}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 4: Flashcards */}
      {tab === 'flash' && card && (
        <div className="mx-auto max-w-xl anim-fade-up">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="w-full min-h-[260px] rounded-3xl border border-copper/40 bg-gradient-to-br from-panel via-panel-2 to-panel p-10 text-center shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_16px_48px_rgba(66,133,244,0.2)] cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-mist">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
                {!flipped ? t(g.front) : t(g.back)}
              </span>
              <span className="text-[11px] font-mono text-copper">
                {flipped ? '✓ 答案解析' : '✦ 点击翻转'}
              </span>
            </div>

            <div className="my-auto py-6">
              {!flipped ? (
                <p className="font-display text-2xl sm:text-3xl font-bold text-paper">
                  {card.front}
                </p>
              ) : (
                <p className="text-base sm:text-lg leading-relaxed text-fog font-medium">
                  {card.back}
                </p>
              )}
            </div>

            <div className="text-[11px] text-mist">
              {cardIdx + 1} of {flashcards.length}
            </div>
          </button>

          <div className="mt-6 flex items-center justify-between">
            <Button
              onClick={() => {
                setFlipped(false)
                setCardIdx((i) => (i - 1 + flashcards.length) % flashcards.length)
              }}
              className="gap-1.5"
            >
              <span>←</span>
              <span>{t(ui.common.prev)}</span>
            </Button>
            <span className="font-mono text-xs font-bold text-mist">
              {(cardIdx % flashcards.length) + 1} / {flashcards.length}
            </span>
            <Button
              onClick={() => {
                setFlipped(false)
                setCardIdx((i) => (i + 1) % flashcards.length)
              }}
              className="gap-1.5"
            >
              <span>{t(ui.common.nextCard)}</span>
              <span>→</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
