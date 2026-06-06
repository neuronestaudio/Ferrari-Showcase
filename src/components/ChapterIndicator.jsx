import { useRef, useLayoutEffect } from 'react'

// Stop counter: "0X / 04" with a tick per stop. The nearest stop is "active".
export default function ChapterIndicator({ chapters, progressRef }) {
  const numRef = useRef(null)
  const ticksRef = useRef([])

  useLayoutEffect(() => {
    let raf
    const tick = () => {
      const p = progressRef.current
      let active = 0
      let best = Infinity
      chapters.forEach((c, i) => {
        const mid = (c.hold[0] + c.hold[1]) / 2
        const d = Math.abs(p - mid)
        if (d < best) {
          best = d
          active = i
        }
      })
      if (numRef.current) numRef.current.textContent = String(active + 1).padStart(2, '0')
      ticksRef.current.forEach((t, i) => {
        if (!t) return
        const on = i === active
        t.style.backgroundColor = on ? '#ef4444' : 'rgba(255,255,255,0.28)'
        t.style.width = on ? '30px' : '14px'
      })
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [chapters, progressRef])

  const total = String(chapters.length).padStart(2, '0')

  return (
    <div className="absolute right-7 md:right-9 top-1/2 -translate-y-1/2 flex flex-col items-end gap-5 pointer-events-none">
      <div className="flex items-baseline gap-1.5 font-[Fraunces]">
        <span ref={numRef} className="text-2xl md:text-3xl text-white leading-none">
          01
        </span>
        <span className="text-xs md:text-sm text-white/40">/ {total}</span>
      </div>
      <div className="flex flex-col items-end gap-2.5">
        {chapters.map((c, i) => (
          <span
            key={c.id}
            ref={(el) => (ticksRef.current[i] = el)}
            className="h-px transition-all duration-300"
            style={{ width: '14px', backgroundColor: 'rgba(255,255,255,0.28)' }}
          />
        ))}
      </div>
    </div>
  )
}
