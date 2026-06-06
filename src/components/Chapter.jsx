import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'

// Half-width of the fade window around each chapter's `at`.
// With 9 chapters ~0.10 apart on the 600-frame timeline, 0.075 keeps each
// beat readable without two chapters overlapping.
const FADE = 0.075

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
        elRef.current.style.transform = `translateY(${(1 - opacity) * 28}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [chapter, progressRef])

  const alignClass =
    chapter.align === 'right'
      ? 'items-end text-right right-[7%]'
      : 'items-start text-left left-[7%]'

  return (
    <div
      ref={elRef}
      className={`absolute top-1/2 -translate-y-1/2 ${alignClass} max-w-md flex flex-col gap-4 will-change-[opacity,transform]`}
      style={{ opacity: 0, textShadow: '0 2px 24px rgba(0,0,0,0.65)' }}
    >
      <div className="flex items-center gap-3">
        {chapter.align !== 'right' && (
          <span className="h-px w-8 bg-red-500/60" />
        )}
        <p className="text-[11px] tracking-[0.35em] uppercase text-red-400/90">
          {chapter.kicker}
        </p>
        {chapter.align === 'right' && (
          <span className="h-px w-8 bg-red-500/60" />
        )}
      </div>
      <h2 className="font-[Fraunces] text-3xl md:text-5xl font-light text-balance leading-[1.1]">
        {chapter.title}
      </h2>
      <p className="text-neutral-200/90 text-sm md:text-base leading-relaxed max-w-sm">
        {chapter.body}
      </p>
    </div>
  )
}
