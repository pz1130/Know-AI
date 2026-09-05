import type { ReactNode } from 'react'
import FadeContent from '../bits/FadeContent'
import BlurText from '../bits/BlurText'

export function PageHeader({
  kicker,
  title,
  desc,
}: {
  kicker: string
  title: string
  desc?: string
}) {
  return (
    <header className="mb-10">
      {/* Keynote Kicker with Google 4-color micro cluster */}
      <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/70 px-3 py-1 text-[12px] font-semibold text-mist backdrop-blur-md shadow-xs">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#EA4335]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#FBBC05]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#34A853]" />
        </span>
        <span className="tracking-wide uppercase text-fog">{kicker}</span>
      </div>

      <div className="mt-3">
        <BlurText
          text={title}
          delay={24}
          animateBy="letters"
          direction="top"
          stepDuration={0.22}
          className="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl md:text-[2.6rem] md:leading-[1.18]"
        />
      </div>

      {desc && (
        <FadeContent blur duration={600} className="mt-3.5 max-w-3xl">
          <p className="text-[15px] leading-relaxed text-mist md:text-base">{desc}</p>
        </FadeContent>
      )}
    </header>
  )
}

export function Card({
  children,
  className = '',
  accent,
}: {
  children: ReactNode
  className?: string
  accent?: boolean
}) {
  return (
    <div
      className={[
        'rounded-3xl border bg-panel/85 p-6 backdrop-blur-xl transition-all duration-300',
        accent
          ? 'border-copper/40 shadow-[0_0_24px_rgba(66,133,244,0.15)] ring-1 ring-copper/30'
          : 'border-line hover:border-line-2',
        className,
      ].join(' ')}
      style={{ boxShadow: 'var(--eap-card-shadow)' }}
    >
      {children}
    </div>
  )
}

export function Badge({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'copper' | 'teal' | 'danger' | 'safe' | 'warning' | 'gemini'
}) {
  const tones = {
    default: 'bg-panel-2 text-mist border-line',
    copper: 'bg-[#4285F4]/12 text-[#4285F4] dark:text-[#8ab4f8] border-[#4285F4]/30',
    teal: 'bg-[#34A853]/12 text-[#188038] dark:text-[#81c995] border-[#34A853]/30',
    danger: 'bg-[#EA4335]/12 text-[#D93025] dark:text-[#f28b82] border-[#EA4335]/30',
    safe: 'bg-[#34A853]/12 text-[#188038] dark:text-[#81c995] border-[#34A853]/30',
    warning: 'bg-[#FBBC05]/15 text-[#B06000] dark:text-[#fdd663] border-[#FBBC05]/35',
    gemini: 'bg-gradient-to-r from-[#4285F4]/15 via-[#9B72CF]/15 to-[#34A853]/15 text-paper border-white/20',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-semibold tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function Button({
  children,
  onClick,
  active,
  variant = 'ghost',
  disabled,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  active?: boolean
  variant?: 'ghost' | 'primary' | 'danger'
  disabled?: boolean
  className?: string
}) {
  const base =
    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
  const variants = {
    ghost: active
      ? 'bg-copper/15 text-copper border border-copper/40 shadow-xs'
      : 'bg-panel-2/90 text-fog border border-line hover:border-line-2 hover:text-paper hover:bg-panel-2',
    primary:
      'bg-gradient-to-r from-[#4285F4] to-[#1A73E8] text-white border border-transparent shadow-[0_4px_16px_rgba(66,133,244,0.35)] hover:shadow-[0_6px_22px_rgba(66,133,244,0.45)] hover:brightness-110',
    danger: 'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
  }
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
