import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as RPointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import raw from '../data/mindmap.json'
import { PageHeader } from '../components/ui'
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

type LayoutKind = 'balanced' | 'radial' | 'tree'
interface Box {
  id: string
  x: number
  y: number
  w: number
  h: number
  depth: number
  branch: number
  side: 1 | -1
  angle: number
  parent: string | null
  hasKids: boolean
  open: boolean
  label: string
  node: MapNode
}
interface View {
  x: number
  y: number
  k: number
}

const root = raw as unknown as MapNode
const FONT = ["600 17px 'Plus Jakarta Sans','Noto Sans SC',sans-serif", "600 14px 'Plus Jakarta Sans','Noto Sans SC',sans-serif", "500 13px 'Plus Jakarta Sans','Noto Sans SC',sans-serif"]
const PAD_X = [26, 18, 13]
const HEIGHT = [48, 36, 30]
const V_GAP = 10
const H_GAP = 54
const DUR = 520

const index = new Map<string, MapNode>()
const parentOf = new Map<string, string | null>()
;(function walk(n: MapNode, p: string | null) {
  index.set(n.id, n)
  parentOf.set(n.id, p)
  n.children.forEach((c) => walk(c, n.id))
})(root, null)

let ctx: CanvasRenderingContext2D | null = null
const measure = (s: string, depth: number) => {
  const lvl = Math.min(depth, 2)
  if (!ctx) ctx = document.createElement('canvas').getContext('2d')
  let w = s.length * 13
  if (ctx) {
    ctx.font = FONT[lvl]
    w = ctx.measureText(s).width
  }
  return Math.ceil(w + PAD_X[lvl] * 2)
}

function ancestors(id: string): Set<string> {
  const s = new Set<string>()
  let cur: string | null | undefined = id
  while (cur) {
    s.add(cur)
    cur = parentOf.get(cur)
  }
  return s
}

function computeLayout(kind: LayoutKind, open: Set<string>, label: (n: MapNode) => string): Map<string, Box> {
  const out = new Map<string, Box>()
  const kids = (n: MapNode) => (open.has(n.id) ? n.children : [])
  const mk = (n: MapNode, depth: number, branch: number, side: 1 | -1, parent: string | null): Box => {
    const lab = label(n)
    return {
      id: n.id,
      x: 0,
      y: 0,
      w: measure(lab, depth),
      h: HEIGHT[Math.min(depth, 2)],
      depth,
      branch,
      side,
      angle: 0,
      parent,
      hasKids: n.children.length > 0,
      open: open.has(n.id),
      label: lab,
      node: n,
    }
  }

  if (kind === 'radial') {
    const leaves = (n: MapNode): number => (kids(n).length ? kids(n).reduce((a, c) => a + leaves(c), 0) : 1)
    const total = root.children.reduce((a, c) => a + leaves(c), 0)
    const RADII = [0, 250, 520, 760, 960]
    const r0 = mk(root, 0, -1, 1, null)
    out.set(root.id, r0)
    const place = (n: MapNode, depth: number, a0: number, a1: number, branch: number, parent: string) => {
      const a = (a0 + a1) / 2
      const b = mk(n, depth, branch, Math.cos(a) >= 0 ? 1 : -1, parent)
      b.angle = a
      const r = RADII[Math.min(depth, 4)]
      // anchor the near edge of the pill on the ring so labels grow outward
      b.x = Math.cos(a) * r + b.side * (depth > 1 ? b.w / 2 - 12 : 0)
      b.y = Math.sin(a) * r
      out.set(n.id, b)
      let cur = a0
      const L = leaves(n)
      kids(n).forEach((c) => {
        const span = ((a1 - a0) * leaves(c)) / L
        place(c, depth + 1, cur, cur + span, branch, n.id)
        cur += span
      })
    }
    let cur = -Math.PI / 2
    root.children.forEach((c, i) => {
      const span = (Math.PI * 2 * leaves(c)) / total
      place(c, 1, cur, cur + span, i, root.id)
      cur += span
    })
    return out
  }

  // horizontal trees ('balanced' = both sides, 'tree' = all to the right)
  const height = (n: MapNode, depth: number): number => {
    const own = HEIGHT[Math.min(depth, 2)] + V_GAP
    const k = kids(n)
    if (!k.length) return own
    return Math.max(own, k.reduce((a, c) => a + height(c, depth + 1), 0) + (depth === 1 ? 14 : 0))
  }
  const r0 = mk(root, 0, -1, 1, null)
  out.set(root.id, r0)
  const place = (n: MapNode, depth: number, top: number, parent: Box, branch: number, side: 1 | -1) => {
    const b = mk(n, depth, branch, side, parent.id)
    const hh = height(n, depth)
    b.y = top + hh / 2
    b.x = parent.x + side * (parent.w / 2 + H_GAP + b.w / 2)
    out.set(n.id, b)
    const k = kids(n)
    const inner = k.reduce((a, c) => a + height(c, depth + 1), 0)
    let y = top + (hh - inner) / 2
    k.forEach((c) => {
      place(c, depth + 1, y, b, branch, side)
      y += height(c, depth + 1)
    })
  }
  const groups: [MapNode[], 1 | -1][] =
    kind === 'tree'
      ? [[root.children, 1]]
      : [
          [root.children.slice(0, Math.ceil(root.children.length / 2)), 1],
          [root.children.slice(Math.ceil(root.children.length / 2)), -1],
        ]
  groups.forEach(([list, side]) => {
    const total = list.reduce((a, c) => a + height(c, 1), 0)
    let y = -total / 2
    list.forEach((c) => {
      place(c, 1, y, r0, root.children.indexOf(c), side)
      y += height(c, 1)
    })
  })
  return out
}

function edgePath(p: Box, c: Box, kind: LayoutKind): string {
  if (kind === 'radial') {
    const px = p.x,
      py = p.y
    const cx = c.x - c.side * (c.depth > 1 ? c.w / 2 - 12 : 0),
      cy = c.y
    const rp = Math.hypot(px, py),
      rc = Math.hypot(cx, cy)
    const mid = (rp + rc) / 2
    const pa = p.depth === 0 ? c.angle : p.angle
    return `M${px},${py} C${Math.cos(pa) * mid},${Math.sin(pa) * mid} ${Math.cos(c.angle) * mid},${Math.sin(c.angle) * mid} ${cx},${cy}`
  }
  const s = c.side
  const x1 = p.depth === 0 ? p.x + s * (p.w / 2 - 10) : p.x + s * (p.w / 2)
  const y1 = p.y
  const x2 = c.x - s * (c.w / 2)
  const y2 = c.y
  const dx = (x2 - x1) * 0.55
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3)

export function MindMap() {
  const { t, locale } = useUi()
  const m = ui.mindmap
  const navigate = useNavigate()
  const [kind, setKind] = useState<LayoutKind>('balanced')
  const [open, setOpen] = useState<Set<string>>(() => new Set([root.id, ...root.children.map((c) => c.id)]))
  const [hover, setHover] = useState<string | null>(null)
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 })
  const [anim, setAnim] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const label = useCallback((n: MapNode) => (locale === 'en' ? n.en : n.zh), [locale])

  const target = useMemo(() => computeLayout(kind, open, label), [kind, open, label])

  // tween between layouts: every node glides from where it was (or from its parent) to its new place
  const [frame, setFrame] = useState<{ boxes: Box[]; alpha: Map<string, number> }>(() => ({
    boxes: [...target.values()],
    alpha: new Map([...target.keys()].map((k) => [k, 1])),
  }))
  const shown = useRef<Map<string, Box>>(target)
  useLayoutEffect(() => {
    const from = new Map(shown.current)
    const to = target
    const ids = new Set([...from.keys(), ...to.keys()])
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / DUR)
      const e = ease(p)
      const boxes: Box[] = []
      const alpha = new Map<string, number>()
      const cur = new Map<string, Box>()
      ids.forEach((id) => {
        const a = from.get(id)
        const b = to.get(id)
        let src = a,
          dst = b
        if (!a && b) {
          // entering: start at parent's previous spot
          const pp = b.parent ? from.get(b.parent) ?? to.get(b.parent) : undefined
          src = { ...b, x: pp ? pp.x : b.x, y: pp ? pp.y : b.y }
          alpha.set(id, e)
        } else if (a && !b) {
          let pid = a.parent
          while (pid && !to.get(pid)) pid = parentOf.get(pid) ?? null
          const pp = pid ? to.get(pid) : undefined
          dst = { ...a, x: pp ? pp.x : a.x, y: pp ? pp.y : a.y }
          alpha.set(id, 1 - e)
        } else alpha.set(id, 1)
        const s = src!,
          d = dst!
        const box: Box = { ...d, x: s.x + (d.x - s.x) * e, y: s.y + (d.y - s.y) * e, w: s.w + (d.w - s.w) * e }
        boxes.push(box)
        if (b) cur.set(id, box)
      })
      shown.current = cur
      setFrame({ boxes: boxes.sort((x, y) => x.depth - y.depth), alpha })
      if (p < 1) raf = requestAnimationFrame(step)
      else shown.current = to
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])

  const fit = useCallback(
    (smooth = true) => {
      const el = wrap.current
      if (!el) return
      let x0 = Infinity,
        y0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity
      target.forEach((b) => {
        x0 = Math.min(x0, b.x - b.w / 2)
        x1 = Math.max(x1, b.x + b.w / 2)
        y0 = Math.min(y0, b.y - b.h / 2)
        y1 = Math.max(y1, b.y + b.h / 2)
      })
      const W = el.clientWidth,
        H = el.clientHeight
      const k = Math.min(1.25, Math.max(0.2, Math.min((W - 64) / (x1 - x0), (H - 64) / (y1 - y0))))
      setAnim(smooth)
      setView({ k, x: W / 2 - ((x0 + x1) / 2) * k, y: H / 2 - ((y0 + y1) / 2) * k })
    },
    [target],
  )
  // fit on first paint and whenever the layout style / language changes
  useEffect(() => {
    fit(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, locale])

  // wheel zoom around the cursor (non-passive so the page doesn't scroll)
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault()
      const r = el.getBoundingClientRect()
      const px = ev.clientX - r.left,
        py = ev.clientY - r.top
      setAnim(false)
      setView((v) => {
        const k = Math.min(3, Math.max(0.15, v.k * Math.exp(-ev.deltaY * 0.0015)))
        return { k, x: px - ((px - v.x) * k) / v.k, y: py - ((py - v.y) * k) / v.k }
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null)
  const onDown = (e: RPointerEvent) => {
    if ((e.target as Element).closest('[data-node]')) return
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    setAnim(false)
  }
  const onMove = (e: RPointerEvent) => {
    const d = drag.current
    if (!d) return
    d.moved = true
    setView((v) => ({ ...v, x: d.vx + e.clientX - d.x, y: d.vy + e.clientY - d.y }))
  }
  const onUp = () => (drag.current = null)

  const zoomBy = (f: number) => {
    const el = wrap.current
    if (!el) return
    const px = el.clientWidth / 2,
      py = el.clientHeight / 2
    setAnim(true)
    setView((v) => {
      const k = Math.min(3, Math.max(0.15, v.k * f))
      return { k, x: px - ((px - v.x) * k) / v.k, y: py - ((py - v.y) * k) / v.k }
    })
  }

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
  const refit = useRef(false)
  useEffect(() => {
    if (!refit.current) return
    refit.current = false
    fit(true)
  }, [target, fit])
  const expandAll = () => {
    refit.current = true
    setOpen(new Set(index.keys()))
  }
  const collapseAll = () => {
    refit.current = true
    setOpen(new Set([root.id, ...root.children.map((c) => c.id)]))
  }

  const lit = useMemo(() => (hover ? ancestors(hover) : null), [hover])
  const byId = useMemo(() => new Map(frame.boxes.map((b) => [b.id, b])), [frame])
  const mdFile = locale === 'en' ? 'en/mind-map-overview.md' : '思维导图_全景.md'
  const kinds: [LayoutKind, { zh: string; en: string }][] = [
    ['balanced', m.layoutBalanced],
    ['radial', m.layoutRadial],
    ['tree', m.layoutTree],
  ]

  return (
    <div>
      <PageHeader kicker={t(m.kicker)} title={t(m.title)} desc={t(m.desc)} />

      <div className="mm-toolbar">
        <div className="mm-seg" role="group" aria-label={t(m.layout)}>
          {kinds.map(([k, lab]) => (
            <button key={k} type="button" data-active={kind === k} onClick={() => setKind(k)}>
              {t(lab)}
            </button>
          ))}
        </div>
        <div className="mm-actions">
          <button type="button" className="mm-btn" onClick={expandAll}>{t(m.expandAll)}</button>
          <button type="button" className="mm-btn" onClick={collapseAll}>{t(m.collapseAll)}</button>
          <a
            className="mm-btn"
            href={`${import.meta.env.BASE_URL}docs/${mdFile.split('/').map(encodeURIComponent).join('/')}`}
            download
          >
            ↓ {t(ui.common.downloadMd)}
          </a>
        </div>
      </div>

      <div
        ref={wrap}
        className="mm-canvas"
        data-kind={kind}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <svg width="100%" height="100%" role="img" aria-label={t(m.title)}>
          <defs>
            <pattern id="mm-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.1" className="mm-dot" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mm-dots)" />
          <g
            className={anim ? 'mm-view mm-view-anim' : 'mm-view'}
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}
          >
            {kind === 'radial' && (
              <g className="mm-rings">
                {[250, 520, 760].map((r) => (
                  <circle key={r} r={r} />
                ))}
              </g>
            )}
            <g>
              {frame.boxes.map((b) => {
                if (!b.parent) return null
                const p = byId.get(b.parent)
                if (!p) return null
                const on = lit?.has(b.id)
                return (
                  <path
                    key={`e-${b.id}`}
                    d={edgePath(p, b, kind)}
                    className="mm-edge"
                    data-b={b.branch}
                    data-depth={b.depth}
                    data-lit={on ? 'on' : lit ? 'off' : undefined}
                    style={{ opacity: frame.alpha.get(b.id) }}
                  />
                )
              })}
            </g>
            <g>
              {frame.boxes.map((b) => {
                const on = lit?.has(b.id)
                const a = frame.alpha.get(b.id) ?? 1
                const lvl = Math.min(b.depth, 2)
                const tx = b.x
                const toggleX = b.depth === 0 ? 0 : b.side * (b.w / 2 + 11)
                return (
                  <g
                    key={b.id}
                    data-node
                    className="mm-node"
                    data-b={b.branch}
                    data-depth={lvl}
                    data-lit={on ? 'on' : lit ? 'off' : undefined}
                    transform={`translate(${tx},${b.y})`}
                    style={{ opacity: a }}
                    onPointerEnter={() => setHover(b.id)}
                    onPointerLeave={() => setHover((h) => (h === b.id ? null : h))}
                  >
                    <g
                      className="mm-pill"
                      role={b.node.doc ? 'link' : undefined}
                      tabIndex={b.node.doc ? 0 : -1}
                      onClick={() => (b.node.doc ? go(b.node) : b.hasKids && toggle(b.id))}
                      onKeyDown={(e) => e.key === 'Enter' && go(b.node)}
                    >
                      <title>{b.node.doc ? `${b.label} · ${t(m.openDoc)}` : b.label}</title>
                      <rect x={-b.w / 2} y={-b.h / 2} width={b.w} height={b.h} rx={b.h / 2} />
                      <text dy="0.35em" textAnchor="middle">
                        {b.label}
                      </text>
                    </g>
                    {b.hasKids && b.depth > 0 && (
                      <g
                        className="mm-toggle"
                        transform={`translate(${toggleX},0)`}
                        role="button"
                        tabIndex={0}
                        aria-expanded={b.open}
                        aria-label={`${b.open ? t(m.collapse) : t(m.expand)} ${b.label}`}
                        onClick={() => toggle(b.id)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(b.id)}
                      >
                        <circle r={9} />
                        {b.open ? (
                          <path d="M-4,0 H4" />
                        ) : (
                          <text dy="0.35em" textAnchor="middle">
                            {b.node.children.length}
                          </text>
                        )}
                      </g>
                    )}
                  </g>
                )
              })}
            </g>
          </g>
        </svg>

        <div className="mm-zoom">
          <button type="button" onClick={() => zoomBy(1.25)} aria-label={t(m.zoomIn)} title={t(m.zoomIn)}>+</button>
          <button type="button" onClick={() => zoomBy(0.8)} aria-label={t(m.zoomOut)} title={t(m.zoomOut)}>−</button>
          <button type="button" onClick={() => fit(true)} aria-label={t(m.fit)} title={t(m.fit)}>⤢</button>
        </div>
        <div className="mm-hint">{t(m.hint)}</div>
      </div>
    </div>
  )
}
