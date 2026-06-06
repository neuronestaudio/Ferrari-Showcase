import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll } from '../lib/smoothScroll'
import FrameSequence from './FrameSequence'
import Chapter from './Chapter'
import ChapterIndicator from './ChapterIndicator'
import { STOPS, INTRO_END } from '../lib/timeline'

export default function CinematicLanding() {
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const frameRef = useRef(null)
  const progressRef = useRef(0)
  const barRef = useRef(null)
  const titleRef = useRef(null)

  useLayoutEffect(() => {
    initSmoothScroll()

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        // Longer pin so the HOLD plateaus read as real "scroll a few times"
        // pauses, and the speed-ramped travel segments have room to breathe.
        end: '+=14000',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress
          progressRef.current = p
          if (frameRef.current) frameRef.current(p)
          if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
          // Hero title dissolves (fade + scale + blur) into the parallax.
          if (titleRef.current) {
            const intro = gsap.utils.clamp(0, 1, 1 - (p - 0.015) / (INTRO_END - 0.015))
            titleRef.current.style.opacity = intro
            titleRef.current.style.transform = `scale(${1 + (1 - intro) * 0.08})`
            titleRef.current.style.filter = `blur(${(1 - intro) * 7}px)`
            titleRef.current.style.pointerEvents = intro < 0.02 ? 'none' : 'auto'
          }
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      {/* Pinned cinematic section — the piece starts here, in position */}
      <section ref={pinRef} className="h-screen w-full relative overflow-hidden">
        <FrameSequence ref={frameRef} progressRef={progressRef} />

        {/* cinematic vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 45%, transparent 38%, rgba(4,4,5,0.62) 100%)',
          }}
        />

        {/* brand lockup */}
        <div className="absolute top-6 left-6 md:top-8 md:left-9 z-20 flex items-center gap-3 pointer-events-none">
          <span className="font-[Fraunces] text-sm md:text-base tracking-[0.22em] uppercase text-white/90">
            Scuderia Ferrari
          </span>
          <span className="h-3.5 w-px bg-white/25" />
          <span className="text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-red-400/80">
            Partnership Prospectus
          </span>
        </div>

        {/* scroll progress bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5 z-20">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-gradient-to-r from-red-600 to-red-400"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {STOPS.map((c) => (
          <Chapter key={c.id} chapter={c} progressRef={progressRef} />
        ))}
        <ChapterIndicator chapters={STOPS} progressRef={progressRef} />

        {/* Hero title overlay — black with the title, dissolves into the parallax */}
        <div
          ref={titleRef}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0b0b0c] will-change-[opacity,transform,filter]"
          style={{ opacity: 1 }}
        >
          {/* faint shadow glow behind the title */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 50% at 50% 45%, rgba(120,18,18,0.18), transparent 70%)',
            }}
          />
          <div className="relative flex flex-col items-center">
            <p className="text-[11px] tracking-[0.5em] uppercase text-red-400/70 mb-7">
              Scuderia Ferrari · Partnership Prospectus
            </p>
            <h1 className="font-[Fraunces] text-5xl md:text-8xl font-light text-center text-balance max-w-4xl px-6 leading-[1.05]">
              Rosso Corsa
            </h1>
            <p className="mt-8 max-w-md text-center text-neutral-300/80 text-sm md:text-base leading-relaxed px-6">
              An invitation to stand beside the most valuable name in motorsport —
              presented in four moments.
            </p>
            <p className="mt-14 text-[11px] tracking-[0.35em] uppercase text-neutral-400 animate-pulse">
              Scroll to begin
            </p>
          </div>
        </div>
      </section>

      {/* Outro */}
      <section className="relative min-h-screen flex flex-col items-center justify-center gap-8 py-32 overflow-hidden">
        <p className="text-[11px] tracking-[0.5em] uppercase text-red-400/60">
          Maranello · Since 1947
        </p>
        <h2 className="font-[Fraunces] text-4xl md:text-7xl font-light text-center text-balance max-w-3xl px-6 leading-[1.08]">
          An invitation, extended once.
        </h2>
        <p className="text-neutral-300/80 max-w-xl text-center px-6 leading-relaxed">
          Speed is the easy part. What you have just travelled across is a century
          of obsession — and the rarest seat in global sport, offered to a chosen few.
        </p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="mt-6 inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-red-100 bg-red-600/90 hover:bg-red-600 rounded-full px-8 py-3.5 transition-colors"
        >
          Begin the conversation
        </a>
        <p className="mt-10 text-[11px] tracking-[0.3em] uppercase text-neutral-500">
          Dion Lintos · Ferrari Partnership
        </p>
      </section>
    </div>
  )
}
