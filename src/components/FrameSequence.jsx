import { useRef, useLayoutEffect, forwardRef } from 'react'

// One continuous cinematic top-down push along a stationary Scuderia Ferrari F1
// car (3840×2160 @ 30fps) → 517 frames re-extracted at 2560×1440 WebP:
//   f001        wide on the full car in the pit box
//   f001–f517   slow travel: rear wing → engine cover → cockpit → nose → front wing
const FRAME_COUNT = 517
// The clip resolves on a natural final frame (the full car) — no loop tail.
const MAX_FRAME_INDEX = 517
// Hold the final frame across the last 8% of scroll.
const SCRUB_END = 0.92

const frameUrl = (i) =>
  `/frames/f${String(i).padStart(3, '0')}.webp`

const FrameSequence = forwardRef(function FrameSequence({ progressRef }, ref) {
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const loadedRef = useRef(0)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Hi-DPI sizing. Allow the backing store up to 2× device pixels so the 4K
    // frames are drawn at (or above) native screen resolution — no upscaling blur.
    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // High-quality resampling — the browser default is "low" (soft bilinear).
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }
    setCanvasSize()

    // Load all frames
    const images = []
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameUrl(i)
      img.onload = () => {
        loadedRef.current++
      }
      images.push(img)
    }
    imagesRef.current = images

    // draw a frame (cover fit)
    const drawFrame = (idx) => {
      const img = images[idx]
      if (!img || !img.complete) return
      const cw = window.innerWidth
      const ch = window.innerHeight
      const ir = img.width / img.height
      const cr = cw / ch
      let dw, dh, dx, dy
      if (ir > cr) {
        dh = ch
        dw = ch * ir
        dx = (cw - dw) / 2
        dy = 0
      } else {
        dw = cw
        dh = cw / ir
        dx = 0
        dy = (ch - dh) / 2
      }
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)
    }

    // map scroll progress -> frame index
    const render = (p) => {
      const clamped = Math.min(p / SCRUB_END, 1)
      const idx = Math.min(
        Math.round(clamped * (MAX_FRAME_INDEX - 1)),
        MAX_FRAME_INDEX - 1
      )
      drawFrame(idx)
    }

    // initial paint once first frame loads
    const firstPaint = setInterval(() => {
      if (loadedRef.current > 0) {
        render(progressRef.current || 0)
        clearInterval(firstPaint)
      }
    }, 50)

    // expose render to parent via ref
    if (ref) {
      ref.current = render
    }

    // redraw on resize
    const onResize = () => {
      setCanvasSize()
      render(progressRef.current || 0)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearInterval(firstPaint)
    }
  }, [ref, progressRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#0b0b0c' }}
    />
  )
})

export default FrameSequence
