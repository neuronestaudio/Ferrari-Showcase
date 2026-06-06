import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'

// Half-width of the fade window around each stop's `at`. With the scroll snapping
// to the 4 stops, the active card rests at full opacity; cards fade out between.
const FADE = 0.12

export default function Chapter({ chapter, progressRef }) {
  const elRef = useRef(null)

  useLayoutEffect(() => {
    let raf
    const tick = () => {
      const p = progressRef.current
      const dist = Math.abs(p - chapter.at)
      const opacity = gsap.utils.clamp(0, 1, 1 - dist / FADE)
      if (elRef.current) {
        elRef.current.style.opacity = opacity
        elRef.current.style.transform = `translateY(${(1 - opacity) * 24}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [chapter, progressRef])

  const right = chapter.align === 'right'
  const sideClass = right
    ? 'items-end text-right right-[6%]'
    : 'items-start text-left left-[6%]'

  return (
    <div
      ref={elRef}
      className={`absolute top-1/2 -translate-y-1/2 ${sideClass} max-w-lg flex flex-col gap-5 will-change-[opacity,transform]`}
      style={{ opacity: 0 }}
    >
      {/* localised scrim — supports legibility, fades out over the car */}
      <div
        aria-hidden
        className="absolute -inset-x-10 -inset-y-8 -z-10"
        style={{
          background: right
            ? 'radial-gradient(125% 100% at 100% 50%, rgba(5,5,6,0.62), transparent 72%)'
            : 'radial-gradient(125% 100% at 0% 50%, rgba(5,5,6,0.62), transparent 72%)',
        }}
      />

      {/* ghost number + kicker */}
      <div className={`flex items-end gap-4 ${right ? 'flex-row-reverse' : ''}`}>
        <span className="font-[Fraunces] text-6xl md:text-7xl leading-[0.8] text-white/15 select-none">
          {chapter.num}
        </span>
        <div className={`flex items-center gap-3 pb-2 ${right ? 'flex-row-reverse' : ''}`}>
          <span className="h-px w-10 bg-red-500/70" />
          <p className="text-[11px] tracking-[0.4em] uppercase text-red-400/90">
            {chapter.kicker}
          </p>
        </div>
      </div>

      <h2
        className="font-[Fraunces] text-3xl md:text-5xl font-light text-balance leading-[1.08]"
        style={{ textShadow: '0 2px 30px rgba(0,0,0,0.7)' }}
      >
        {chapter.title}
      </h2>

      <p
        className="text-neutral-200/90 text-sm md:text-[15px] leading-relaxed max-w-sm"
        style={{ textShadow: '0 1px 16px rgba(0,0,0,0.75)' }}
      >
        {chapter.body}
      </p>

      {/* stat strip */}
      <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 ${right ? 'justify-end' : ''}`}>
        {chapter.stats.map((s, i) => (
          <span key={i} className={`flex items-center gap-4 ${right ? 'flex-row-reverse' : ''}`}>
            {i > 0 && <span className="h-1 w-1 rotate-45 bg-red-500/70" />}
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/60 whitespace-nowrap">
              {s}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
