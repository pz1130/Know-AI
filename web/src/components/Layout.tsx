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
  { to: '/selftest', key: 'selftest' as const },
  { to: '/mindmap', key: 'mindmap' as const },
  { to: '/library', key: 'library' as const },
]

export function Layout() {
  const { theme, setTheme, locale, setLocale } = usePrefs()

  return (
    <div className="bg-blueprint relative min-h-screen text-paper selection:bg-copper/30">
      <BitsBackdrop />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Floating Keynote Stage Header */}
        <header className="site-header sticky top-0 z-40 border-b border-line shadow-xs">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <NavLink to="/" className="group flex items-center gap-3 no-underline">
              <Magnet padding={28} magnetStrength={3} wrapperClassName="inline-block">
                {/* Gemini 4-point sparkle icon with Google 4-color gradient */}
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-panel-2 border border-line shadow-xs transition-transform duration-300 group-hover:scale-105">
                  <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                    <defs>
                      <linearGradient id="nav-sparkle" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4285F4" />
                        <stop offset="35%" stopColor="#9B72CF" />
                        <stop offset="70%" stopColor="#EA4335" />
                        <stop offset="100%" stopColor="#34A853" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M16 4C16 10.6274 10.6274 16 4 16C10.6274 16 16 21.3726 16 28C16 21.3726 21.3726 16 28 16C21.3726 16 16 10.6274 16 4Z"
                      fill="url(#nav-sparkle)"
                    />
                  </svg>
                </span>
              </Magnet>

              <div className="flex items-baseline gap-2">
                <span className="font-display text-[17px] font-bold tracking-tight text-paper transition-colors group-hover:text-copper">
                  {t(ui.brand, locale)}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#4285F4]/30 bg-[#4285F4]/10 px-2 py-0.5 text-[10px] font-semibold text-[#4285F4] dark:text-[#8ab4f8]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4] animate-pulse" />
                  {locale === 'zh' ? '选型与内训' : 'Selection'}
                </span>
              </div>
            </NavLink>

            {/* Segmented Controls */}
            <div className="flex items-center gap-2">
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

          {/* Module Navigation Pill Strip */}
          <div className="mx-auto max-w-7xl overflow-x-auto px-4 pb-2.5 sm:px-6">
            <nav className="flex min-w-max items-center gap-1">
              {linkDefs.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    [
                      'relative rounded-full px-3.5 py-1.5 text-[13px] font-medium no-underline transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-[#4285F4]/15 via-[#9B72CF]/15 to-[#34A853]/15 text-paper font-semibold shadow-xs ring-1 ring-copper/40'
                        : 'text-mist hover:bg-panel hover:text-fog',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <span className="inline-flex items-center gap-1.5">
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4] shadow-[0_0_6px_#4285F4]" />
                      )}
                      {t(ui.nav[l.key], locale)}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        {/* Main Presentation Stage */}
        <main className="mx-auto max-w-7xl flex-1 w-full px-4 py-10 sm:px-6 pb-24">
          <Outlet />
        </main>

        {/* Keynote Stage Footer */}
        <footer className="border-t border-line/80 py-10 text-center text-xs text-mist bg-panel/30 backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-4 space-y-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-[#4285F4]" />
              <span className="h-2 w-2 rounded-full bg-[#EA4335]" />
              <span className="h-2 w-2 rounded-full bg-[#FBBC05]" />
              <span className="h-2 w-2 rounded-full bg-[#34A853]" />
              <span className="font-semibold text-fog tracking-wide ml-1">
                {locale === 'zh'
                  ? 'Know-Your-AI · 行内选型与内训'
                  : 'Know-Your-AI · Selection & training'}
              </span>
            </div>
            <p className="leading-relaxed">{t(ui.footer1, locale)}</p>
            {t(ui.footer2, locale) ? (
              <p className="opacity-75">{t(ui.footer2, locale)}</p>
            ) : null}
          </div>
        </footer>
      </div>
    </div>
  )
}
