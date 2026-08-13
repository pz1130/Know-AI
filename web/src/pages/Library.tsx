import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { docs, type DocMeta } from '../data/docs'
import { docsEn } from '../data/en/docs'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

export function Library() {
  const { t, locale } = useUi()
  const lib = ui.library
  const catalog = useMemo(() => (locale === 'en' ? docsEn : docs), [locale])
  const [activeId, setActiveId] = useState(docs[0].id)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const active: DocMeta = catalog.find((d) => d.id === activeId) ?? catalog[0]

  // Keep selection when switching language
  useEffect(() => {
    if (!catalog.some((d) => d.id === activeId)) {
      setActiveId(catalog[0].id)
    }
  }, [catalog, activeId])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    // encode each segment so en/foo.md keeps its slash
    const path = `${import.meta.env.BASE_URL}docs/${active.file
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`

    fetch(path)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then((text) => {
        if (!cancelled) setContent(text)
      })
      .catch((e) => {
        if (!cancelled) setError(String(e))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [active.file])

  return (
    <div>
      <PageHeader kicker={t(lib.kicker)} title={t(lib.title)} desc={t(lib.desc)} />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-2 lg:sticky lg:top-20 lg:self-start">
          {catalog.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveId(d.id)}
              className={[
                'w-full rounded-lg border p-3 text-left transition-colors',
                active.id === d.id
                  ? 'border-copper/40 bg-copper/10'
                  : 'border-line bg-panel/50 hover:border-line-2',
              ].join(' ')}
            >
              <p className="text-sm font-medium text-paper leading-snug">{d.title}</p>
              <p className="mt-1 text-[11px] text-mist">{d.audience}</p>
            </button>
          ))}
        </aside>

        <Card className="min-h-[60vh]">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2 border-b border-line pb-4">
            <div>
              <Badge tone="copper">{active.audience}</Badge>
              <h2 className="mt-2 font-display text-xl text-paper">{active.title}</h2>
              <p className="mt-1 text-xs text-mist">{active.blurb}</p>
            </div>
            <Button
              onClick={() => {
                const blob = new Blob([content], { type: 'text/markdown' })
                const a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                a.download = active.file.split('/').pop() || active.file
                a.click()
              }}
              disabled={!content}
            >
              {t(ui.common.downloadMd)}
            </Button>
          </div>

          {loading && (
            <p className="text-sm text-mist py-12 text-center">{t(ui.common.loading)}</p>
          )}
          {error && (
            <p className="text-sm text-danger py-12 text-center">
              {t(ui.common.loadFail)}：{error}
            </p>
          )}
          {!loading && !error && content && (
            <article
              className="prose-doc max-w-none"
              lang={locale === 'en' ? 'en' : 'zh-CN'}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </article>
          )}
        </Card>
      </div>
    </div>
  )
}
