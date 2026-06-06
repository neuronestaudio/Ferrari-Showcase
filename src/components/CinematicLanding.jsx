import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll } from '../lib/smoothScroll'
import FrameSequence from './FrameSequence'
import Chapter from './Chapter'
import ChapterIndicator from './ChapterIndicator'

// `at` = scroll progress (0–1) where each chapter sits at full opacity, tuned to
// the 517-frame top-down travel along the car. Frame at progress `p` is roughly
// (p / SCRUB_END 0.92) × 516, so `at ≈ (targetFrame / 516) × 0.92`.
//   The camera pushes from the rear wing forward to the front wing.
const CHAPTERS = [
  {
    id: 0,
    align: 'left',
    kicker: '01 — Maranello',
    title: 'Born red, built to win',
    body: 'Every line begins in a small town in Emilia-Romagna, where since 1947 a single colour has meant one thing — the relentless, uncompromising pursuit of speed.',
    at: 0.06,
  },
  {
    id: 1,
    align: 'right',
    kicker: '02 — Aerodynamics',
    title: 'Sculpted by air it cannot see',
    body: 'Nothing here is decoration. Every wing, vane and channel exists to bend the wind — turning a thousand horsepower into grip the instant it is asked for.',
    at: 0.17,
  },
  {
    id: 2,
    align: 'left',
    kicker: '03 — The Power Unit',
    title: 'A heart that lives at the limit',
    body: 'Behind the driver, an engine spins beyond fifteen thousand times a minute — engineered to scream for two hours straight and never once flinch.',
    at: 0.28,
  },
  {
    id: 3,
    align: 'right',
    kicker: '04 — The Cockpit',
    title: 'One seat. One purpose.',
    body: 'Carbon fibre wrapped to the millimetre around a single human being — the calmest place on the grid, sitting right at the edge of what a body can survive.',
    at: 0.40,
  },
  {
    id: 4,
    align: 'left',
    kicker: '05 — The Driver',
    title: 'Where nerve meets machine',
    body: 'Helmet down, pulse steady, hands light. From here the entire car answers to a few grams of pressure and the courage to keep the throttle open.',
    at: 0.52,
  },
  {
    id: 5,
    align: 'right',
    kicker: '06 — Precision',
    title: 'Measured in thousandths',
    body: 'Tens of thousands of parts, each finished by hand and checked twice over. Perfection isn’t the finish line here — it is merely where the work begins.',
    at: 0.63,
  },
  {
    id: 6,
    align: 'left',
    kicker: '07 — The Front Wing',
    title: 'Where the air is first commanded',
    body: 'The first surface to meet the wind decides the fate of everything behind it. Get this wrong, and nothing downstream can ever be made right.',
    at: 0.75,
  },
  {
    id: 7,
    align: 'right',
    kicker: '08 — The Scuderia',
    title: 'Not a car. A promise kept.',
    body: 'From the prancing horse to the chequered flag — decades of obsession distilled into the few violent seconds it takes to vanish down the straight.',
    at: 0.88,
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
        end: '+=12000',
        pin: true,
        scrub: 1,
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
        {/* faint poster of the car in the pit box */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(/frames/f001.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0c]/70 via-[#0b0b0c]/45 to-[#0b0b0c]" />
        <div className="relative flex flex-col items-center">
          <p className="text-[11px] tracking-[0.5em] uppercase text-red-400/70 mb-7">
            A Cinematic Showcase
          </p>
          <h1 className="font-[Fraunces] text-5xl md:text-8xl font-light text-center text-balance max-w-4xl px-6 leading-[1.05]">
            Rosso Corsa
          </h1>
          <p className="mt-8 max-w-md text-center text-neutral-300/80 text-sm md:text-base leading-relaxed px-6">
            The Scuderia Ferrari Formula&nbsp;1 car, examined frame by frame —
            engineering as a form of devotion.
          </p>
          <p className="mt-14 text-[11px] tracking-[0.35em] uppercase text-neutral-400 animate-pulse">
            Scroll to begin
          </p>
        </div>
      </section>

      {/* Pinned cinematic section */}
      <section ref={pinRef} className="h-screen w-full relative overflow-hidden">
        <FrameSequence ref={frameRef} progressRef={progressRef} />

        {/* cinematic vignette for depth + text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 45%, transparent 38%, rgba(4,4,5,0.6) 100%)',
          }}
        />

        {/* scroll progress bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-gradient-to-r from-red-600 to-red-400"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {CHAPTERS.map((c) => (
          <Chapter key={c.id} chapter={c} progressRef={progressRef} />
        ))}
        <ChapterIndicator chapters={CHAPTERS} progressRef={progressRef} />
      </section>

      {/* Outro */}
      <section className="relative min-h-screen flex flex-col items-center justify-center gap-8 py-32 overflow-hidden">
        <p className="text-[11px] tracking-[0.5em] uppercase text-red-400/60">
          Maranello · Since 1947
        </p>
        <h2 className="font-[Fraunces] text-4xl md:text-7xl font-light text-center text-balance max-w-3xl px-6 leading-[1.08]">
          Built by the few, for the impossible.
        </h2>
        <p className="text-neutral-300/80 max-w-xl text-center px-6 leading-relaxed">
          Speed is the easy part. What you have just travelled across is the
          discipline behind it — a century of obsession, hidden in plain sight
          under a single coat of red.
        </p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="mt-6 inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-red-200/85 border border-red-400/25 rounded-full px-7 py-3 hover:border-red-400/60 hover:text-red-100 transition-colors"
        >
          Watch it again
        </a>
        <p className="mt-10 text-[11px] tracking-[0.3em] uppercase text-neutral-500">
          Dion Lintos · Ferrari Showcase
        </p>
      </section>
    </div>
  )
}
