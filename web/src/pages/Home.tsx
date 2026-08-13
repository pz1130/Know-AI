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
  { to: '/elevator', kicker: '01', key: 'elevator' as const },
  { to: '/grid', kicker: '02', key: 'grid' as const },
  { to: '/triage', kicker: '03', key: 'triage' as const },
  { to: '/score', kicker: '04', key: 'score' as const },
  { to: '/scenarios', kicker: '05', key: 'scenarios' as const },
  { to: '/glossary', kicker: '06', key: 'glossary' as const },
  { to: '/quiz', kicker: '07', key: 'quiz' as const },
  { to: '/library', kicker: '08', key: 'library' as const },
]

export function Home() {
  const { t, locale } = useUi()
  const h = ui.home
  const by = locale === 'zh' ? 'letters' : 'words'

  return (
    <div>
      <section className="relative mb-14">
        <p className="mb-2 text-[13px] font-medium text-mist">
          <ShinyText
            text={t(h.kicker)}
            speed={2.4}
            color="var(--eap-mist)"
            shineColor="var(--eap-paper)"
            className="text-[13px] font-medium"
          />
        </p>

        <div className="max-w-3xl">
          <BlurText
            text={t(h.title1)}
            delay={locale === 'zh' ? 35 : 80}
            animateBy={by}
            direction="top"
            stepDuration={0.28}
            className="font-display text-4xl font-semibold tracking-tight leading-[1.15] text-paper md:text-[2.75rem]"
          />
          <div className="mt-1">
            <GradientText
              colors={['#c4b5fd', '#5eead4', '#a78bfa', '#f0abfc']}
              animationSpeed={6}
              className="!mx-0 font-display text-4xl font-semibold tracking-tight leading-[1.15] md:text-[2.75rem]"
            >
              {t(h.title2)}
            </GradientText>
          </div>
        </div>

        <FadeContent blur duration={900} className="mt-5 max-w-2xl">
          <p className="text-[15px] leading-relaxed text-mist">
            {t(h.lead)}{' '}
            <strong className="font-medium text-fog">{t(h.audienceIt)}</strong>
            {' · '}
            <strong className="font-medium text-fog">{t(h.audienceArch)}</strong>.
          </p>
        </FadeContent>

        <div className="mt-8 flex flex-wrap gap-3">
          <Magnet padding={40} magnetStrength={3}>
            <Link
              to="/triage"
              className="inline-flex rounded-xl bg-copper px-4 py-2.5 text-sm font-semibold text-[color:var(--eap-on-accent)] no-underline hover:opacity-90"
            >
              {t(h.ctaTriage)}
            </Link>
          </Magnet>
          <Magnet padding={40} magnetStrength={3}>
            <Link
              to="/elevator"
              className="inline-flex rounded-xl border border-line bg-panel/80 px-4 py-2.5 text-sm text-fog no-underline backdrop-blur-sm hover:border-line-2 hover:text-paper"
            >
              {t(h.ctaElevator)}
            </Link>
          </Magnet>
        </div>
      </section>

      <section className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {moduleKeys.map((m, i) => {
          const mod = h.modules[m.key]
          return (
            <AnimatedContent
              key={m.to}
              distance={28}
              duration={0.55}
              delay={i * 0.05}
              threshold={0.15}
              className="h-full"
            >
              <Link to={m.to} className="group block h-full no-underline">
                <SpotlightCard
                  className="h-full p-5 transition-colors group-hover:border-copper/40"
                  spotlightColor="rgba(196, 181, 253, 0.22)"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-mist">{m.kicker}</span>
                    <span className="text-[10px] text-mist">{t(mod.path)}</span>
                  </div>
                  <h2 className="mt-2 font-display text-lg text-paper transition-colors group-hover:text-copper">
                    {t(mod.title)}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-mist">{t(mod.desc)}</p>
                </SpotlightCard>
              </Link>
            </AnimatedContent>
          )
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {(
          [
            {
              title: t(h.twoPaths),
              accent: false as boolean,
              body: (
                <ul className="mt-3 space-y-2 text-sm text-mist">
                  <li>{t(h.pathTrain)}</li>
                  <li>{t(h.pathArch)}</li>
                  <li>{t(h.pathReview)}</li>
                </ul>
              ),
            },
            {
              title: t(h.stance),
              accent: false as boolean,
              body: (
                <p className="mt-3 text-sm leading-relaxed text-mist">{t(h.stanceBody)}</p>
              ),
            },
            {
              title: t(h.hard),
              accent: true as boolean,
              body: (
                <p className="mt-3 text-sm leading-relaxed text-mist">{t(h.hardBody)}</p>
              ),
            },
          ]
        ).map((item, i) => (
          <FadeContent key={item.title} blur duration={800} delay={i * 80}>
            {item.accent ? (
              <Card accent>
                <h3 className="font-display text-base font-semibold text-paper">{item.title}</h3>
                {item.body}
              </Card>
            ) : (
              <SpotlightCard className="p-5" spotlightColor="rgba(94, 234, 212, 0.12)">
                <h3 className="font-display text-base font-semibold text-paper">{item.title}</h3>
                {item.body}
              </SpotlightCard>
            )}
          </FadeContent>
        ))}
      </section>
    </div>
  )
}
