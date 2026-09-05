import { Link } from 'react-router-dom'
import { Card } from '../components/ui'
import { useUi } from '../hooks/useContent'
import { ui } from '../i18n/ui'
import BlurText from '../bits/BlurText'
import GradientText from '../bits/GradientText'
import ShinyText from '../bits/ShinyText'
import Magnet from '../bits/Magnet'
import SpotlightCard from '../bits/SpotlightCard'
import FadeContent from '../bits/FadeContent'
import AnimatedContent from '../bits/AnimatedContent'

const moduleKeys = [
  { to: '/elevator', kicker: '01', key: 'elevator' as const, accentColor: '#4285F4' },
  { to: '/grid', kicker: '02', key: 'grid' as const, accentColor: '#9B72CF' },
  { to: '/triage', kicker: '03', key: 'triage' as const, accentColor: '#34A853' },
  { to: '/score', kicker: '04', key: 'score' as const, accentColor: '#FBBC05' },
  { to: '/scenarios', kicker: '05', key: 'scenarios' as const, accentColor: '#EA4335' },
  { to: '/glossary', kicker: '06', key: 'glossary' as const, accentColor: '#4285F4' },
  { to: '/quiz', kicker: '07', key: 'quiz' as const, accentColor: '#9B72CF' },
  { to: '/library', kicker: '08', key: 'library' as const, accentColor: '#34A853' },
]

export function Home() {
  const { t, locale } = useUi()
  const h = ui.home
  const by = locale === 'zh' ? 'letters' : 'words'

  return (
    <div className="space-y-16">
      {/* Google Keynote Stage Hero */}
      <section className="relative pt-6 sm:pt-10 pb-4">
        {/* Top Keynote Badge */}
        <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-line bg-panel/80 px-4 py-1.5 text-xs font-semibold backdrop-blur-xl shadow-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#4285F4]" />
            <span className="h-2 w-2 rounded-full bg-[#EA4335]" />
            <span className="h-2 w-2 rounded-full bg-[#FBBC05]" />
            <span className="h-2 w-2 rounded-full bg-[#34A853]" />
          </span>
          <ShinyText
            text={t(h.kicker)}
            speed={2.2}
            color="var(--eap-mist)"
            shineColor="var(--eap-paper)"
            className="text-xs font-semibold tracking-wider uppercase"
          />
        </div>

        {/* Hero Headlines */}
        <div className="max-w-4xl">
          <BlurText
            text={t(h.title1)}
            delay={locale === 'zh' ? 30 : 60}
            animateBy={by}
            direction="top"
            stepDuration={0.24}
            className="font-display text-4xl sm:text-5xl md:text-[3.6rem] font-bold tracking-tight leading-[1.12] text-paper"
          />
          <div className="mt-2">
            <GradientText
              colors={['#4285F4', '#9B72CF', '#EA4335', '#FBBC05', '#34A853']}
              animationSpeed={5}
              className="!mx-0 font-display text-4xl sm:text-5xl md:text-[3.6rem] font-extrabold tracking-tight leading-[1.12]"
            >
              {t(h.title2)}
            </GradientText>
          </div>
        </div>

        {/* Audience & Stance */}
        <FadeContent blur duration={700} className="mt-6 max-w-3xl">
          <p className="text-base sm:text-lg leading-relaxed text-mist">
            {t(h.lead)}{' '}
            <span className="inline-flex items-center rounded-full bg-[#4285F4]/10 border border-[#4285F4]/20 px-3 py-0.5 text-sm font-semibold text-[#4285F4] dark:text-[#8ab4f8]">
              {t(h.audienceIt)}
            </span>
            {' 与 '}
            <span className="inline-flex items-center rounded-full bg-[#34A853]/10 border border-[#34A853]/20 px-3 py-0.5 text-sm font-semibold text-[#188038] dark:text-[#81c995]">
              {t(h.audienceArch)}
            </span>
            。
          </p>
        </FadeContent>

        {/* Keynote Key Metrics Row */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-4xl">
          {[
            { num: '06', label: locale === 'zh' ? '架构分层 (L0-L5)' : 'Layers (L0-L5)', color: '#4285F4' },
            { num: '16', label: locale === 'zh' ? 'A×B 选型象限' : 'Matrix Cells', color: '#9B72CF' },
            { num: '06', label: locale === 'zh' ? '落地形态 (A-F)' : 'Morphologies', color: '#34A853' },
            { num: '126', label: locale === 'zh' ? '高频架构术语' : 'Concepts Mapped', color: '#FBBC05' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-panel/60 p-3.5 backdrop-blur-md transition-all hover:border-line-2"
            >
              <div
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ color: stat.color }}
              >
                {stat.num}
              </div>
              <div className="mt-0.5 text-xs text-mist font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Hero CTA Buttons */}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Magnet padding={40} magnetStrength={3}>
            <Link
              to="/triage"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4285F4] to-[#1A73E8] px-6 py-3.5 text-sm font-bold text-white no-underline shadow-[0_4px_20px_rgba(66,133,244,0.4)] hover:shadow-[0_6px_28px_rgba(66,133,244,0.55)] hover:scale-[1.02] transition-all duration-200"
            >
              <span>{t(h.ctaTriage)}</span>
              <span className="text-base">→</span>
            </Link>
          </Magnet>
          <Magnet padding={40} magnetStrength={3}>
            <Link
              to="/elevator"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/85 px-6 py-3.5 text-sm font-semibold text-fog no-underline backdrop-blur-md hover:border-line-2 hover:text-paper hover:bg-panel transition-all duration-200"
            >
              <span>{t(h.ctaElevator)}</span>
            </Link>
          </Magnet>
        </div>
      </section>

      {/* Google I/O Bento Grid: 8 Module Showcase */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#4285F4]" />
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-paper">
              {locale === 'zh' ? '架构工作台 · 八大决策与实践模块' : 'Decision Workbench · 8 Modules'}
            </h2>
          </div>
          <span className="text-xs font-semibold text-mist uppercase tracking-wider">
            Bento Grid
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moduleKeys.map((m, i) => {
            const mod = h.modules[m.key]
            return (
              <AnimatedContent
                key={m.to}
                distance={24}
                duration={0.5}
                delay={i * 0.04}
                threshold={0.12}
                className="h-full"
              >
                <Link to={m.to} className="group block h-full no-underline">
                  <SpotlightCard
                    className="h-full rounded-3xl p-6 transition-all duration-300 group-hover:scale-[1.01] group-hover:border-copper/40 group-hover:shadow-[0_12px_32px_rgba(66,133,244,0.16)]"
                    spotlightColor="rgba(66, 133, 244, 0.18)"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="font-display text-xs font-bold px-2 py-0.5 rounded-full border"
                        style={{
                          color: m.accentColor,
                          borderColor: `${m.accentColor}44`,
                          backgroundColor: `${m.accentColor}15`,
                        }}
                      >
                        {m.kicker}
                      </span>
                      <span className="text-[11px] font-mono text-mist">{t(mod.path)}</span>
                    </div>

                    <h3 className="mt-4 font-display text-lg font-bold text-paper transition-colors group-hover:text-copper">
                      {t(mod.title)}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-mist line-clamp-3">
                      {t(mod.desc)}
                    </p>

                    <div className="mt-5 flex items-center gap-1 text-[11px] font-semibold text-copper opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>{locale === 'zh' ? '进入模块' : 'Launch Module'}</span>
                      <span>→</span>
                    </div>
                  </SpotlightCard>
                </Link>
              </AnimatedContent>
            )
          })}
        </div>
      </section>

      {/* Three Pillars of Truth (Google Keynote Presenter Foundations) */}
      <section className="grid gap-5 md:grid-cols-3">
        {(
          [
            {
              title: t(h.twoPaths),
              accent: false,
              badge: locale === 'zh' ? '两条学习路径' : 'Dual Paths',
              color: '#4285F4',
              body: (
                <ul className="mt-3 space-y-2.5 text-sm text-mist">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4285F4]" />
                    <span>{t(h.pathTrain)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9B72CF]" />
                    <span>{t(h.pathArch)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34A853]" />
                    <span>{t(h.pathReview)}</span>
                  </li>
                </ul>
              ),
            },
            {
              title: t(h.stance),
              accent: false,
              badge: locale === 'zh' ? '架构立场' : 'Core Stance',
              color: '#34A853',
              body: (
                <p className="mt-3 text-sm leading-relaxed text-mist">{t(h.stanceBody)}</p>
              ),
            },
            {
              title: t(h.hard),
              accent: true,
              badge: locale === 'zh' ? '红线铁律' : 'Hard Rules',
              color: '#EA4335',
              body: (
                <p className="mt-3 text-sm leading-relaxed text-mist">{t(h.hardBody)}</p>
              ),
            },
          ]
        ).map((item, i) => (
          <FadeContent key={item.title} blur duration={700} delay={i * 80}>
            {item.accent ? (
              <Card accent className="h-full border-[#EA4335]/35 bg-panel/90">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EA4335]/12 border border-[#EA4335]/30 px-2.5 py-0.5 text-[11px] font-semibold text-[#EA4335]">
                    {item.badge}
                  </span>
                  <span className="text-base">⚠</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-paper">{item.title}</h3>
                {item.body}
              </Card>
            ) : (
              <SpotlightCard className="h-full rounded-3xl p-6" spotlightColor="rgba(66, 133, 244, 0.12)">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border"
                  style={{
                    color: item.color,
                    borderColor: `${item.color}35`,
                    backgroundColor: `${item.color}12`,
                  }}
                >
                  {item.badge}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-paper">{item.title}</h3>
                {item.body}
              </SpotlightCard>
            )}
          </FadeContent>
        ))}
      </section>
    </div>
  )
}
