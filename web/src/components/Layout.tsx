import { NavLink, Outlet } from 'react-router-dom'
import { usePrefs } from '../i18n/context'
import { ui, t } from '../i18n/ui'
import { BitsBackdrop } from './BitsBackdrop'
import Magnet from '../bits/Magnet'

const linkDefs = [
  { to: '/', key: 'home' as const, end: true },
  { to: '/elevator', key: 'elevator' as const },
  { to: '/grid', key: 'grid' as const },
  { to: '/triage', key: 'triage' as const },
  { to: '/score', key: 'score' as const },
  { to: '/scenarios', key: 'scenarios' as const },
  { to: '/glossary', key: 'glossary' as const },
  { to: '/quiz', key: 'quiz' as const },
  { to: '/library', key: 'library' as const },
]

export function Layout() {
  const { theme, setTheme, locale, setLocale } = usePrefs()

  return (
    <div className="bg-blueprint relative min-h-screen">
      <BitsBackdrop />

      <div className="relative z-10">
        <header className="site-header sticky top-0 z-40 border-b border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5">
            <NavLink to="/" className="group flex items-center gap-2.5 no-underline">
              <Magnet padding={28} magnetStrength={4} wrapperClassName="inline-block">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-copper/15 text-[11px] font-semibold text-copper">
                  AI
                </span>
              </Magnet>
              <span className="font-display text-[15px] font-semibold tracking-tight text-paper group-hover:text-copper transition-colors">
                {t(ui.brand, locale)}
              </span>
            </NavLink>

            <div className="flex flex-wrap items-center gap-2">
              <div className="pref-toggle" role="group" aria-label={t(ui.themeToggle, locale)}>
                <button
                  type="button"
                  data-active={theme === 'dark'}
                  onClick={() => setTheme('dark')}
                  title={t(ui.themeDark, locale)}
                >
                  {locale === 'zh' ? '深色' : 'Dark'}
                </button>
                <button
                  type="button"
                  data-active={theme === 'light'}
                  onClick={() => setTheme('light')}
                  title={t(ui.themeLight, locale)}
                >
                  {locale === 'zh' ? '浅色' : 'Light'}
                </button>
              </div>
              <div className="pref-toggle" role="group" aria-label={t(ui.langToggle, locale)}>
                <button
                  type="button"
                  data-active={locale === 'zh'}
                  onClick={() => setLocale('zh')}
                >
                  中文
                </button>
                <button
                  type="button"
                  data-active={locale === 'en'}
                  onClick={() => setLocale('en')}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-6xl overflow-x-auto px-4 pb-3">
            <nav className="flex min-w-max flex-wrap gap-0.5">
              {linkDefs.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    [
                      'rounded-lg px-2.5 py-1.5 text-[13px] font-medium no-underline transition-colors',
                      isActive
                        ? 'bg-copper/12 text-copper'
                        : 'text-mist hover:bg-panel hover:text-fog',
                    ].join(' ')
                  }
                >
                  {t(ui.nav[l.key], locale)}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-9 pb-20">
          <Outlet />
        </main>

        <footer className="border-t border-line py-7 text-center text-[13px] text-mist">
          <p>{t(ui.footer1, locale)}</p>
          {t(ui.footer2, locale) ? (
            <p className="mt-1 opacity-70">{t(ui.footer2, locale)}</p>
          ) : null}
        </footer>
      </div>
    </div>
  )
}
