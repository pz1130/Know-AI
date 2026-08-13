import { useEffect, useState } from 'react'
import SoftAurora from '../bits/SoftAurora'
import { usePrefs } from '../i18n/context'

/** Full-viewport React Bits SoftAurora — disabled when user prefers reduced motion. */
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

  if (reduce) return null

  const dark = theme === 'dark'

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 opacity-90">
        <SoftAurora
          speed={0.45}
          scale={1.35}
          brightness={dark ? 0.55 : 0.35}
          color1={dark ? '#a78bfa' : '#7c3aed'}
          color2={dark ? '#5eead4' : '#0d9488'}
          noiseFrequency={2.2}
          noiseAmplitude={0.9}
          bandHeight={0.55}
          bandSpread={1.1}
          enableMouseInteraction
          mouseInfluence={0.2}
        />
      </div>
      {/* Fade bottom so content stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? 'linear-gradient(to bottom, transparent 0%, #120f17 88%)'
            : 'linear-gradient(to bottom, transparent 0%, #f6f4f9 90%)',
        }}
      />
    </div>
  )
}
