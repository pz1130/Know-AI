import { useState } from 'react'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

export function SelfTest() {
  const { t } = useUi()
  const st = ui.selftest
  const { selfTest } = useContent()
  const [picked, setPicked] = useState<Record<number, number>>({})
  const answered = Object.keys(picked).length
  const score = selfTest.filter((q, i) => picked[i] === q.answer).length
  const finished = answered === selfTest.length

  return (
    <div>
      <PageHeader kicker={t(st.kicker)} title={t(st.title)} desc={t(st.desc)} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge tone="teal">
          {answered}/{selfTest.length}
        </Badge>
        {answered > 0 && <Button onClick={() => setPicked({})}>{t(st.retry)}</Button>}
      </div>
      <ol className="space-y-4">
        {selfTest.map((q, i) => {
          const p = picked[i]
          const done = p !== undefined
          return (
            <li key={q.q}>
              <Card className="p-5">
                <p className="font-display text-sm font-bold text-paper">
                  {i + 1}. {q.q}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((o, j) => {
                    const tone = !done
                      ? 'border-line hover:border-[#4285F4]/60'
                      : j === q.answer
                        ? 'border-[#34A853] bg-[#34A853]/10'
                        : j === p
                          ? 'border-[#EA4335] bg-[#EA4335]/10'
                          : 'border-line opacity-60'
                    return (
                      <button
                        key={o}
                        type="button"
                        disabled={done}
                        onClick={() => setPicked((s) => ({ ...s, [i]: j }))}
                        className={`rounded-2xl border p-3 text-left text-xs leading-relaxed text-fog transition ${tone}`}
                      >
                        {String.fromCharCode(65 + j)}. {o}
                      </button>
                    )
                  })}
                </div>
                {done && (
                  <div className="mt-3 rounded-2xl border border-line bg-panel/60 p-3 text-xs leading-relaxed text-fog">
                    <p className={p === q.answer ? 'font-semibold text-[#34A853]' : 'font-semibold text-[#EA4335]'}>
                      {p === q.answer ? t(st.correct) : t(st.wrong)}
                    </p>
                    <p className="mt-1">{q.why}</p>
                    <p className="mt-1 text-mist">
                      {t(st.source)}：{q.source}
                    </p>
                  </div>
                )}
              </Card>
            </li>
          )
        })}
      </ol>
      {finished && (
        <Card accent className="mt-6 p-6">
          <p className="font-display text-2xl font-extrabold text-paper">
            {t(st.score)}：{score}/{selfTest.length}
          </p>
          <p className="mt-2 text-sm text-fog">
            {score / selfTest.length >= 0.8 ? t(st.pass) : t(st.review)}
          </p>
        </Card>
      )}
    </div>
  )
}
