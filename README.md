# Rosso Corsa — A Ferrari Showcase

A scroll-driven cinematic landing: a slow top-down travel along a Scuderia Ferrari
Formula 1 car, scrubbed frame-by-frame as you scroll. React 19 + Vite + Tailwind v4
+ GSAP ScrollTrigger + Lenis, with a canvas-painted WebP frame sequence for the
video scrub.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5178
```

## Frame pipeline

Frames live in `public/frames/f001.webp … f517.webp` (517 frames, 2560×1440 WebP),
extracted from a 4K HEVC master. To regenerate from a new source video:

```bash
ffmpeg -y -i "source.mp4" \
  -vf "scale=2560:1440:flags=lanczos" \
  -c:v libwebp -quality 82 -compression_level 6 \
  -start_number 1 public/frames/f%03d.webp
```

If the frame count changes, update `FRAME_COUNT` / `MAX_FRAME_INDEX` in
`src/components/FrameSequence.jsx` and re-tune the chapter `at` values in
`src/components/CinematicLanding.jsx`.

## Build

```bash
npm run build      # outputs to dist/ (Vercel: framework=vite)
```

Dion Lintos · Ferrari Showcase
