import { useState } from 'react'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

const questionColors = ['#4285F4', '#FBBC05', '#EA4335', '#34A853']

export function Quiz() {
  const { t, locale } = useUi()
  const qz = ui.quiz
  const { acceptanceQuestions } = useContent()
  const [answers, setAnswers] = useState<Record<number, 'yes' | 'no' | null>>({
    0: null,
    1: null,
    2: null,
    3: null,
  })
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const done = Object.values(answers).every((a) => a !== null)

  function summary(): string[] {
    const lines: string[] = []
    const a = answers
    if (locale === 'zh') {
      if (a[0] === 'yes') lines.push('关掉 LLM 仍能完成 → 本质 Workflow，LLM 是接口糖。')
      if (a[0] === 'no') lines.push('关掉 LLM 不能完成 → 进入 A2 以上。')
      if (a[1] === 'yes') lines.push('可不改代码产生未列举序列 → A3。')
      if (a[1] === 'no') lines.push('不能产生未列举序列 → A2 或以下，可逐条测试。')
      if (a[2] === 'yes') lines.push('失败可能停中间态 → B3，必须补偿/saga。')
      if (a[2] === 'no') lines.push('无中间态风险 → 作用域较低或已原子化。')
      if (a[3] === 'no')
        lines.push('动作日志不可重放/归因 → 不具备上生产审计前提（一票否决）。')
      if (a[3] === 'yes') lines.push('可重放且可归因 → 具备审计前提。')
      if (a[1] === 'yes' && a[2] === 'yes')
        lines.push('⚠ 同时 A3 倾向 + B3 倾向 → 高风险区，重装治理。')
    } else {
      if (a[0] === 'yes') lines.push('Task works without LLM → workflow; LLM is interface sugar.')
      if (a[0] === 'no') lines.push('Fails without LLM → A2+ territory.')
      if (a[1] === 'yes') lines.push('Unlisted sequences without code change → A3.')
      if (a[1] === 'no') lines.push('No unlisted sequences → A2 or below; fully testable.')
      if (a[2] === 'yes') lines.push('Mid-state on failure → B3; need compensation/saga.')
      if (a[2] === 'no') lines.push('No mid-state risk → lower scope or atomic design.')
      if (a[3] === 'no')
        lines.push('Logs not replayable/attributable → fails production audit gate.')
      if (a[3] === 'yes') lines.push('Replayable & attributable → audit prerequisite met.')
      if (a[1] === 'yes' && a[2] === 'yes')
        lines.push('⚠ A3 lean + B3 lean → high-risk cell; full governance.')
    }
    return lines
  }

  function handleCopy() {
    navigator.clipboard?.writeText(summary().join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-10">
      <PageHeader kicker={t(qz.kicker)} title={t(qz.title)} desc={t(qz.desc)} />

      {/* Interactive Question Cards */}
      <div className="space-y-5">
        {acceptanceQuestions.map((item, i) => (
          <Card
            key={item.q}
            accent={answers[i] !== null}
            className="p-6 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl font-mono text-sm font-bold border"
                style={{
                  color: questionColors[i % questionColors.length],
                  borderColor: `${questionColors[i % questionColors.length]}44`,
                  backgroundColor: `${questionColors[i % questionColors.length]}15`,
                }}
              >
                0{i + 1}
              </span>

              <div className="flex-1">
                <h3 className="font-display text-lg sm:text-xl font-bold text-paper leading-snug">
                  {item.q}
                </h3>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Button
                    active={answers[i] === 'yes'}
                    onClick={() => setAnswers((prev) => ({ ...prev, [i]: 'yes' }))}
                    className="min-w-[84px]"
                  >
                    {t(ui.common.yes)}
                  </Button>
                  <Button
                    active={answers[i] === 'no'}
                    onClick={() => setAnswers((prev) => ({ ...prev, [i]: 'no' }))}
                    className="min-w-[84px]"
                  >
                    {t(ui.common.no)}
                  </Button>
                </div>

                {revealed && answers[i] && (
                  <div className="mt-4 rounded-2xl border border-line bg-panel-2/50 p-4 text-xs sm:text-sm leading-relaxed text-fog">
                    <strong className="text-paper mr-2">
                      {answers[i] === 'yes' ? t(ui.common.yes) : t(ui.common.no)}:
                    </strong>
                    {answers[i] === 'yes' ? item.yes : item.no}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          disabled={!done}
          onClick={() => setRevealed(true)}
          className="px-6 py-2.5"
        >
          <span>{t(qz.generate)}</span>
          <span className="ml-1.5">✦</span>
        </Button>
        <Button
          onClick={() => {
            setAnswers({ 0: null, 1: null, 2: null, 3: null })
            setRevealed(false)
          }}
        >
          {t(ui.common.clear)}
        </Button>
      </div>

      {/* Revealed Conclusion Deck */}
      {revealed && done && (
        <Card className="anim-fade-up p-8 border-[#4285F4]/40" accent>
          <div className="flex items-center justify-between border-b border-line pb-4">
            <Badge tone="copper">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
              {t(qz.portrait)} · {locale === 'zh' ? '架构四问裁决画像' : 'Architecture Gate Verdict'}
            </Badge>
          </div>

          <ul className="mt-5 space-y-3">
            {summary().map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 rounded-xl border border-line bg-panel-2/40 p-3.5 text-sm text-fog leading-relaxed font-medium"
              >
                <span className="mt-0.5 text-copper">✦</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Button variant="primary" onClick={handleCopy}>
              {copied
                ? locale === 'zh'
                  ? '✓ 已复制挑战画像'
                  : '✓ Copied Summary'
                : t(qz.copyPortrait)}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
