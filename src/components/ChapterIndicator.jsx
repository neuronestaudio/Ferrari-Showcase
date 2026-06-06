import { useRef, useLayoutEffect } from 'react'

export default function ChapterIndicator({ chapters, progressRef }) {
  const dotsRef = useRef([])

  useLayoutEffect(() => {
    let raf
    const tick = () => {
      const p = progressRef.current
      chapters.forEach((c, i) => {
        const dist = Math.abs(p - c.at)
        const active = dist < 0.05
        const dot = dotsRef.current[i]
        if (dot) {
          dot.style.backgroundColor = active ? '#ef4444' : 'transparent'
          dot.style.borderColor = active
            ? 'rgba(239,68,68,0.95)'
            : 'rgba(239,68,68,0.3)'
          dot.style.transform = active ? 'scale(1.5)' : 'scale(1)'
        }
      })
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [chapters, progressRef])

  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
      {chapters.map((c, i) => (
        <div
          key={c.id}
          ref={(el) => (dotsRef.current[i] = el)}
          className="w-2 h-2 rounded-full border transition-transform duration-300"
          style={{ borderColor: 'rgba(239,68,68,0.3)' }}
        />
      ))}
    </div>
  )
}
