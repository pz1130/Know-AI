import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const [params] = useSearchParams()
  const wantDoc = params.get('doc')
  const wantHeading = params.get('h')
  const articleRef = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState(
    wantDoc && docs.some((d) => d.id === wantDoc) ? wantDoc : docs[0].id,
  )

  // Deep link from the mind map: ?doc=<id>&h=<heading prefix>
  useEffect(() => {
    if (wantDoc && docs.some((d) => d.id === wantDoc)) setActiveId(wantDoc)
  }, [wantDoc])
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

  useEffect(() => {
    if (!wantHeading || loading || !content || !articleRef.current) return
    const norm = (x: string) => x.replace(/\s+/g, ' ').trim()
    // keep a trailing space: '1.1 ' must not match '1.10 …'
    const target = wantHeading.replace(/\s+/g, ' ').trimStart()
    const hit = Array.from(articleRef.current.querySelectorAll('h1,h2,h3,h4')).find((el) =>
      norm(el.textContent ?? '').startsWith(target),
    )
    if (hit) {
      hit.classList.add('mindmap-hit')
      hit.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [wantHeading, loading, content])

  return (
    <div>
      <PageHeader kicker={t(lib.kicker)} title={t(lib.title)} desc={t(lib.desc)} />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left Document Catalog Navigator */}
        <aside className="space-y-2.5 lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-wider text-mist px-1 mb-2">
            {locale === 'zh' ? '官方规范白皮书' : 'Official Whitepapers'}
          </p>
          {catalog.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveId(d.id)}
              className={[
                'w-full rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer',
                active.id === d.id
                  ? 'border-[#4285F4] bg-[#4285F4]/15 shadow-[0_4px_16px_rgba(66,133,244,0.18)] ring-1 ring-[#4285F4]/40'
                  : 'border-line bg-panel/70 hover:border-line-2 hover:bg-panel',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] font-bold text-mist">
                  DOC 0{i + 1}
                </span>
                <span className="rounded-full bg-panel-2 px-2 py-0.5 text-[10px] font-medium text-mist border border-line">
                  {d.audience}
                </span>
              </div>
              <p className="font-display text-sm font-bold text-paper leading-snug">
                {d.title}
              </p>
              <p className="mt-1 text-xs text-mist line-clamp-2">{d.blurb}</p>
            </button>
          ))}
        </aside>

        {/* Right Keynote Whitepaper Stage Card */}
        <Card className="min-h-[70vh] p-6 sm:p-10">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
            <div>
              <Badge tone="copper">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
                {active.audience}
              </Badge>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-paper tracking-tight">
                {active.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mist max-w-2xl">{active.blurb}</p>
            </div>

            <Button
              variant="primary"
              onClick={() => {
                const blob = new Blob([content], { type: 'text/markdown' })
                const a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                a.download = active.file.split('/').pop() || active.file
                a.click()
              }}
              disabled={!content}
              className="gap-2"
            >
              <span>📥</span>
              <span>{t(ui.common.downloadMd)}</span>
            </Button>
          </div>

          {loading && (
            <div className="py-20 text-center">
              <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-copper border-t-transparent" />
              <p className="mt-3 text-sm text-mist">{t(ui.common.loading)}</p>
            </div>
          )}

          {error && (
            <div className="py-20 text-center">
              <p className="text-sm text-[#EA4335]">
                {t(ui.common.loadFail)}：{error}
              </p>
            </div>
          )}

          {!loading && !error && content && (
            <article
              ref={articleRef}
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
