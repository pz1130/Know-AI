import { useState } from 'react'
import { PageHeader, Card, Badge, Button } from '../components/ui'
import { useContent, useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'

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

  return (
    <div>
      <PageHeader kicker={t(qz.kicker)} title={t(qz.title)} desc={t(qz.desc)} />

      <div className="space-y-4">
        {acceptanceQuestions.map((item, i) => (
          <Card key={item.q} accent={answers[i] !== null}>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-copper/40 text-sm font-semibold text-copper">
                {i + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-display text-lg text-paper leading-snug">{item.q}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    active={answers[i] === 'yes'}
                    onClick={() => setAnswers((prev) => ({ ...prev, [i]: 'yes' }))}
                  >
                    {t(ui.common.yes)}
                  </Button>
                  <Button
                    active={answers[i] === 'no'}
                    onClick={() => setAnswers((prev) => ({ ...prev, [i]: 'no' }))}
                  >
                    {t(ui.common.no)}
                  </Button>
                </div>
                {revealed && answers[i] && (
                  <p className="mt-3 text-xs text-mist leading-relaxed">
                    {answers[i] === 'yes' ? item.yes : item.no}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" disabled={!done} onClick={() => setRevealed(true)}>
          {t(qz.generate)}
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

      {revealed && done && (
        <Card className="mt-6 anim-fade-up" accent>
          <Badge tone="copper">{t(qz.portrait)}</Badge>
          <ul className="mt-4 space-y-2">
            {summary().map((line) => (
              <li key={line} className="text-sm text-fog leading-relaxed">
                · {line}
              </li>
            ))}
          </ul>
          <Button
            className="mt-4"
            onClick={() => navigator.clipboard?.writeText(summary().join('\n'))}
          >
            {t(qz.copyPortrait)}
          </Button>
        </Card>
      )}
    </div>
  )
}
