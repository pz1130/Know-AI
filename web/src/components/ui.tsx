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
    <header className="mb-8">
      <p className="text-[13px] font-medium text-mist">{kicker}</p>
      <BlurText
        text={title}
        delay={28}
        animateBy="letters"
        direction="top"
        stepDuration={0.22}
        className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-paper md:text-[2.15rem] md:leading-tight"
      />
      {desc && (
        <FadeContent blur duration={700} className="mt-3 max-w-2xl">
          <p className="text-[15px] leading-relaxed text-mist">{desc}</p>
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
        'rounded-2xl border bg-panel p-5',
        accent ? 'border-copper/35' : 'border-line',
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
  tone?: 'default' | 'copper' | 'teal' | 'danger' | 'safe'
}) {
  const tones = {
    default: 'bg-panel-2 text-mist border-line',
    copper: 'bg-copper/12 text-copper border-copper/25',
    teal: 'bg-teal/12 text-teal border-teal/25',
    danger: 'bg-danger/12 text-danger border-danger/25',
    safe: 'bg-safe/12 text-safe border-safe/25',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}
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
    'inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition-all disabled:opacity-40'
  const variants = {
    ghost: active
      ? 'bg-copper/15 text-copper border border-copper/30'
      : 'bg-panel-2 text-fog border border-line hover:border-line-2 hover:text-paper',
    primary:
      'bg-copper border border-transparent hover:opacity-90 font-semibold shadow-sm text-[color:var(--eap-on-accent)]',
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
