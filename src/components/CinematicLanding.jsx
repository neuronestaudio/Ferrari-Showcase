import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll } from '../lib/smoothScroll'
import FrameSequence from './FrameSequence'
import Chapter from './Chapter'
import ChapterIndicator from './ChapterIndicator'

// Four quarter "stops". The scroll SNAPS to each `at`, settling the scrub on a
// hand-picked, premium-rendered hero frame while its label rests at full opacity.
//   at ≈ (targetFrame / 516) × SCRUB_END(0.92)
//   01 → f030 (full car + crew)   02 → f180 (rear wing / engine)
//   03 → f340 (cockpit / driver)  04 → f500 (full car, front)
const STOPS = [
  {
    id: 0,
    align: 'left',
    num: '01',
    kicker: 'The Marque',
    title: 'The most coveted name in motorsport',
    body: 'Since 1950, one team has never missed a grid. To wear this red is not to sponsor a car — it is to take a place in history.',
    stats: ['Est. 1929', '16 Constructors’ Titles', 'Every season since 1950'],
    at: 0.055,
  },
  {
    id: 1,
    align: 'right',
    num: '02',
    kicker: 'The Machine',
    title: 'A thousand horsepower, finished by hand',
    body: 'Every surface is computed, every component hand-built and checked twice. This is the precise point where capital becomes velocity.',
    stats: ['1.6L V6 Turbo-Hybrid', '~1,000 bhp', '>15,000 rpm'],
    at: 0.32,
  },
  {
    id: 2,
    align: 'left',
    num: '03',
    kicker: 'The Stage',
    title: 'Your name, where the world is watching',
    body: 'A mark on this car is carried to a global audience across five continents, every other week, for an entire season.',
    stats: ['24 Grands Prix', '5 continents', '~750M global fans'],
    at: 0.61,
  },
  {
    id: 3,
    align: 'right',
    num: '04',
    kicker: 'The Partnership',
    title: 'Stand beside the prancing horse',
    body: 'To appear here is to be chosen. A partnership with Ferrari remains the rarest and most enduring signal of prestige in world sport.',
    stats: ['Maranello', 'By invitation', 'A legacy of winning'],
    at: 0.89,
  },
]

export default function CinematicLanding() {
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const frameRef = useRef(null)
  const progressRef = useRef(0)
  const barRef = useRef(null)

  useLayoutEffect(() => {
    initSmoothScroll()

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: '+=9000',
        pin: true,
        scrub: 1,
        // Snap the scrub to each quarter stop once the user pauses.
        snap: {
          snapTo: STOPS.map((s) => s.at),
          duration: { min: 0.3, max: 0.8 },
          delay: 0.08,
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          progressRef.current = self.progress
          if (frameRef.current) frameRef.current(self.progress)
          if (barRef.current)
            barRef.current.style.transform = `scaleX(${self.progress})`
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      {/* Intro */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(/frames/f030.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0c]/72 via-[#0b0b0c]/45 to-[#0b0b0c]" />
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
      </section>

      {/* Pinned cinematic section */}
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
