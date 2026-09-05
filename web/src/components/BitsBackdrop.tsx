import { useEffect, useState } from 'react'
import SoftAurora from '../bits/SoftAurora'
import { usePrefs } from '../i18n/context'

/** Full-viewport Google Keynote Stage Lighting & Gemini Aurora */
export function BitsBackdrop() {
  const { theme } = usePrefs()
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const dark = theme === 'dark'

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Google Keynote Overhead Stage Spotlight Cone */}
      <div className="stage-spotlight-beam" />

      {/* Dynamic Gemini Aurora Field */}
      {!reduce && (
        <div className="absolute inset-0 opacity-80">
          <SoftAurora
            speed={0.4}
            scale={1.4}
            brightness={dark ? 0.6 : 0.4}
            color1={dark ? '#4285f4' : '#1a73e8'}
            color2={dark ? '#9b72cf' : '#8ab4f8'}
            noiseFrequency={2.0}
            noiseAmplitude={0.85}
            bandHeight={0.6}
            bandSpread={1.2}
            enableMouseInteraction
            mouseInfluence={0.25}
          />
        </div>
      )}

      {/* Keynote stage gradient fade so text is crisp */}
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? 'radial-gradient(ellipse 90% 70% at 50% 0%, transparent 20%, #0a0c10 92%)'
            : 'radial-gradient(ellipse 90% 70% at 50% 0%, transparent 20%, #f8f9fd 92%)',
        }}
      />
    </div>
  )
}
