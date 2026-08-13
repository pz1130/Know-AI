import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'dark' | 'light'
export type Locale = 'zh' | 'en'

interface PrefsContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  locale: Locale
  setLocale: (l: Locale) => void
  toggleLocale: () => void
}

const PrefsContext = createContext<PrefsContextValue | null>(null)

const THEME_KEY = 'eap-theme'
const LOCALE_KEY = 'eap-locale'

function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

function readStoredLocale(): Locale {
  try {
    const v = localStorage.getItem(LOCALE_KEY)
    if (v === 'zh' || v === 'en') return v
  } catch {
    /* ignore */
  }
  return 'zh'
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof window !== 'undefined' ? readStoredTheme() : 'dark',
  )
  const [locale, setLocaleState] = useState<Locale>(() =>
    typeof window !== 'undefined' ? readStoredLocale() : 'zh',
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale === 'zh' ? 'zh-CN' : 'en')
    try {
      localStorage.setItem(LOCALE_KEY, locale)
    } catch {
      /* ignore */
    }
  }, [locale])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  )
  const setLocale = useCallback((l: Locale) => setLocaleState(l), [])
  const toggleLocale = useCallback(
    () => setLocaleState((l) => (l === 'zh' ? 'en' : 'zh')),
    [],
  )

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, locale, setLocale, toggleLocale }),
    [theme, setTheme, toggleTheme, locale, setLocale, toggleLocale],
  )

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

export function usePrefs() {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider')
  return ctx
}
