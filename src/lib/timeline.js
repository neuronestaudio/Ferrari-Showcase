// Single source of truth for the scroll timeline.
//
// The pinned scroll is split into TRAVEL segments (the frame scrubs) and HOLD
// plateaus (the frame freezes on a hand-picked hero frame while its label pops
// in and rests). This is what makes each section "pause for a few scrolls"
// instead of being one continuous motion.

export const FRAME_COUNT = 517

// Hero frame indices (0-based) the scrub holds on at each stop.
//   01 → f030 (full car + crew)   02 → f180 (rear wing / engine)
//   03 → f340 (cockpit / driver)  04 → f500 (full car, front)
const HERO = { s1: 29, s2: 179, s3: 339, s4: 499 }

// Where the black title overlay finishes dissolving. Until here the canvas is
// hidden behind the hero title — the piece "starts in the pinned position".
export const INTRO_END = 0.1

// Piecewise progress → frame index. Flat segments = HOLD plateaus.
//   INTRO title-hold, travel 0→01, HOLD 01, … , HOLD 04
const KNOTS = [
  [0.0, 0],
  [INTRO_END, 0], // intro title-hold (f001, hidden behind the title overlay)
  [0.17, HERO.s1],
  [0.3, HERO.s1], // hold 01
  [0.42, HERO.s2],
  [0.54, HERO.s2], // hold 02
  [0.65, HERO.s3],
  [0.77, HERO.s3], // hold 03
  [0.88, HERO.s4],
  [1.0, HERO.s4], // hold 04
]

// Cinematic speed ramp applied to every TRAVEL segment: eases out of a hold
// slowly, ramps to a steep peak velocity through the middle, then decelerates
// into the next hold. RAMP raises the steepness (2 = gentle, 4 = quart, 5 =
// quint). 4 gives the classic ~65%-steep industry-grade velocity curve.
const RAMP = 4
function speedRamp(t) {
  return t < 0.5
    ? 0.5 * Math.pow(2 * t, RAMP)
    : 1 - 0.5 * Math.pow(2 * (1 - t), RAMP)
}

export function frameIndexForProgress(p) {
  const x = Math.min(Math.max(p, 0), 1)
  for (let i = 1; i < KNOTS.length; i++) {
    const [p0, f0] = KNOTS[i - 1]
    const [p1, f1] = KNOTS[i]
    if (x <= p1) {
      if (p1 === p0 || f0 === f1) return f0 // hold plateau — frame frozen
      const t = (x - p0) / (p1 - p0)
      return Math.round(f0 + (f1 - f0) * speedRamp(t))
    }
  }
  return KNOTS[KNOTS.length - 1][1]
}

// Each stop's HOLD band [start, end] in scroll progress. The label is visible
// (and pops in) only across this band, while the frame is frozen.
export const STOPS = [
  {
    id: 0,
    align: 'left',
    num: '01',
    kicker: 'The Marque',
    title: 'The most coveted name in motorsport',
    body: 'Since 1950, one team has never missed a grid. To wear this red is not to sponsor a car — it is to take a place in history.',
    stats: ['Est. 1929', '16 Constructors’ Titles', 'Every season since 1950'],
    hold: [0.17, 0.3],
  },
  {
    id: 1,
    align: 'right',
    num: '02',
    kicker: 'The Machine',
    title: 'A thousand horsepower, finished by hand',
    body: 'Every surface is computed, every component hand-built and checked twice. This is the precise point where capital becomes velocity.',
    stats: ['1.6L V6 Turbo-Hybrid', '~1,000 bhp', '>15,000 rpm'],
    hold: [0.42, 0.54],
  },
  {
    id: 2,
    align: 'left',
    num: '03',
    kicker: 'The Stage',
    title: 'Your name, where the world is watching',
    body: 'A mark on this car is carried to a global audience across five continents, every other week, for an entire season.',
    stats: ['24 Grands Prix', '5 continents', '~750M global fans'],
    hold: [0.65, 0.77],
  },
  {
    id: 3,
    align: 'right',
    num: '04',
    kicker: 'The Partnership',
    title: 'Stand beside the prancing horse',
    body: 'To appear here is to be chosen. A partnership with Ferrari remains the rarest and most enduring signal of prestige in world sport.',
    stats: ['Maranello', 'By invitation', 'A legacy of winning'],
    hold: [0.88, 1.0],
  },
]
