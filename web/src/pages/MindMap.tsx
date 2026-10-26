import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import raw from '../data/mindmap.json'
import { PageHeader, Card, Button } from '../components/ui'
import { useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

interface MapNode {
  id: string
  zh: string
  en: string
  doc: string | null
  hz: string | null
  he: string | null
  children: MapNode[]
}

const root = raw as unknown as MapNode
const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#9B72CF']

function allIds(n: MapNode, acc: string[] = []): string[] {
  if (n.children.length) acc.push(n.id)
  n.children.forEach((c) => allIds(c, acc))
  return acc
}

export function MindMap() {
  const { t, locale } = useUi()
  const m = ui.mindmap
  const navigate = useNavigate()
  const everything = useMemo(() => allIds(root), [])
  // default: docs + their chapters visible, deeper levels collapsed
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(root.children.map((c) => c.id)),
  )

  const toggle = (id: string) =>
    setOpen((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const go = (n: MapNode) => {
    if (!n.doc) return
    const h = locale === 'en' ? n.he : n.hz
    const qs = new URLSearchParams({ doc: n.doc })
    if (h) qs.set('h', h)
    navigate(`/library?${qs.toString()}`)
  }

  const label = (n: MapNode) => (locale === 'en' ? n.en : n.zh)

  const renderNode = (n: MapNode, color: string, depth: number) => {
    const isOpen = open.has(n.id)
    const has = n.children.length > 0
    return (
      <li key={n.id} className="relative">
        <div className="flex items-center gap-1.5 py-0.5">
          {has ? (
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={label(n)}
              onClick={() => toggle(n.id)}
              className="h-5 w-5 shrink-0 cursor-pointer rounded text-xs text-mist transition-transform hover:text-paper"
              style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
            >
              ▸
            </button>
          ) : (
            <span className="h-5 w-5 shrink-0 text-center text-mist">·</span>
          )}
          <button
            type="button"
            onClick={() => go(n)}
            title={t(m.openDoc)}
            className={[
              'cursor-pointer rounded-full border px-3 py-1 text-left leading-snug transition-colors hover:bg-panel-2',
              depth === 1 ? 'text-sm font-semibold text-paper' : 'text-[13px] text-fog',
            ].join(' ')}
            style={{ borderColor: `${color}66` }}
          >
            {label(n)}
          </button>
        </div>
        {has && isOpen && (
          <ul
            className="ml-[0.6rem] border-l pl-4"
            style={{ borderColor: `${color}55` }}
          >
            {n.children.map((c) => renderNode(c, color, depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  const mdFile = locale === 'en' ? 'en/mind-map-overview.md' : '思维导图_全景.md'

  return (
    <div>
      <PageHeader kicker={t(m.kicker)} title={t(m.title)} desc={t(m.desc)} />

      <div className="mb-5 flex flex-wrap gap-2">
        <Button onClick={() => setOpen(new Set(everything))}>{t(m.expandAll)}</Button>
        <Button onClick={() => setOpen(new Set())}>{t(m.collapseAll)}</Button>
        <a
          className="inline-flex items-center rounded-full border border-line px-4 py-2 text-sm font-semibold text-fog no-underline hover:text-paper"
          href={`${import.meta.env.BASE_URL}docs/${mdFile.split('/').map(encodeURIComponent).join('/')}`}
          download
        >
          📥 {t(ui.common.downloadMd)}
        </a>
      </div>

      <div className="mb-6 flex justify-center">
        <span className="rounded-full bg-gradient-to-r from-[#4285F4] via-[#9B72CF] to-[#34A853] px-6 py-2.5 font-display text-lg font-bold text-white shadow-lg">
          {label(root)}
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {root.children.map((d, i) => {
          const color = COLORS[i % COLORS.length]
          return (
            <Card key={d.id} className="p-5">
              <div className="mb-2 h-1 w-12 rounded-full" style={{ background: color }} />
              <ul>{renderNode(d, color, 1)}</ul>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
