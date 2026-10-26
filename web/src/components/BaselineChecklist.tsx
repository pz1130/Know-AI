import { useState } from 'react'
import { Card, Button } from './ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

/** 分诊结果下方的"上线底线清单"：一般底线 + 该形态专属底线，可勾选、可复制。 */
export function BaselineChecklist({ code, title }: { code: string; title: string }) {
  const { t } = useUi()
  const bl = ui.baseline
  const { generalBaselines, formBaselines } = useContent()
  const formKey = code === 'gate' ? 'D' : code
  const specific = formBaselines[formKey] ?? []
  const items = [...specific, ...generalBaselines]
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState(false)
  const done = items.filter((i) => checked[i]).length

  function copy() {
    const text = [`${t(bl.title)} · ${title}`, ...items.map((i) => `- [${checked[i] ? 'x' : ' '}] ${i}`)].join('\n')
    void navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const row = (i: string, accent: string) => (
    <li key={i}>
      <label className="flex cursor-pointer items-start gap-2.5 rounded-2xl border border-line bg-panel/60 p-3 text-xs leading-relaxed text-fog">
        <input
          type="checkbox"
          className="mt-0.5 shrink-0"
          style={{ accentColor: accent }}
          checked={!!checked[i]}
          onChange={(e) => setChecked((c) => ({ ...c, [i]: e.target.checked }))}
        />
        <span className={checked[i] ? 'line-through opacity-60' : ''}>{i}</span>
      </label>
    </li>
  )

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#34A853]" />
          <h3 className="font-display text-base font-bold text-paper">
            {t(bl.title)} · {title}
          </h3>
          <span className="text-xs text-mist">
            {done}/{items.length}
          </span>
        </div>
        <Button onClick={copy}>{copied ? t(bl.copied) : t(bl.copy)}</Button>
      </div>
      <p className="mt-2 text-xs text-mist">{t(bl.desc)}</p>
      {specific.length > 0 && (
        <>
          <h4 className="mt-4 text-xs font-semibold text-[#34A853]">{t(bl.specific)}</h4>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">{specific.map((i) => row(i, '#34A853'))}</ul>
        </>
      )}
      <h4 className="mt-4 text-xs font-semibold text-[#4285F4]">{t(bl.general)}</h4>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">{generalBaselines.map((i) => row(i, '#4285F4'))}</ul>
    </Card>
  )
}
