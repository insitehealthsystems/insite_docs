/**
 * Shared Framer Motion primitives + dynamic SVG effects.
 */
import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* ── Fade + slide variants ─────────────────────────────── */
export const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.07 },
  }),
}

export const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 },
  }),
}

export const slideInLeft = {
  hidden:  { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export const slideInRight = {
  hidden:  { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

/* ── Animated counter (pure RAF, no framer animate util) ── */
export const AnimatedCounter = ({ to, suffix = '', duration = 1800, color = '#00d9a6', style = {} }) => {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const step = (now) => {
            const elapsed = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - elapsed, 3)
            setValue(Math.floor(eased * to))
            if (elapsed < 1) requestAnimationFrame(step)
            else setValue(to)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} style={{ color, fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, ...style }}>
      {value}{suffix}
    </span>
  )
}

/* ── Magnetic hover button ─────────────────────────────── */
export const MagneticButton = ({ children, style = {}, strength = 0.28, ...props }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20 })
  const sy = useSpring(y, { stiffness: 300, damping: 20 })
  const ref = useRef(null)

  const handleMouse = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top  + rect.height / 2)) * strength)
  }, [x, y, strength])

  const handleLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block', ...style }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/* ── Animated particle canvas ──────────────────────────── */
export const ParticleField = ({ color = '#00d9a6', density = 28, style = {} }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width  = W
    canvas.height = H

    const spacing = Math.max(36, Math.floor(W / density))
    const dots = []
    for (let dx = spacing / 2; dx < W; dx += spacing) {
      for (let dy = spacing / 2; dy < H; dy += spacing) {
        dots.push({ bx: dx, by: dy, x: dx, y: dy, t: Math.random() * Math.PI * 2 })
      }
    }

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const d of dots) {
        d.t += 0.007
        d.x = d.bx + Math.sin(d.t * 1.2) * 5
        d.y = d.by + Math.cos(d.t * 0.8) * 4
        const alpha = 0.1 + 0.07 * Math.sin(d.t)
        ctx.beginPath()
        ctx.arc(d.x, d.y, 1.1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.fill()
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = spacing * 1.5
          if (dist < maxDist) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - dist / maxDist) * 0.06})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [color, density])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }} />
}

/* ── Pulsing rings ─────────────────────────────────────── */
export const PulseRings = ({ color = '#00d9a6', size = 400, style = {} }) => (
  <div style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
    {[1, 2, 3].map(i => (
      <motion.div key={i}
        style={{ position: 'absolute', top: '50%', left: '50%', width: size * i * 0.38, height: size * i * 0.38, borderRadius: '50%', border: `1px solid ${color}`, transform: 'translate(-50%,-50%)', opacity: 0 }}
        animate={{ opacity: [0, 0.16, 0], scale: [0.85, 1.15, 1.4] }}
        transition={{ duration: 3.2, delay: i * 0.9, repeat: Infinity, ease: 'easeOut' }}
      />
    ))}
  </div>
)

/* ── Gradient orb ──────────────────────────────────────── */
export const GradientOrb = ({ color1 = '#00d9a6', color2 = '#0ab8ff', size = 600, style = {} }) => (
  <motion.div
    style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', width: size, height: size, background: `radial-gradient(ellipse, ${color1}18 0%, ${color2}08 50%, transparent 70%)`, filter: 'blur(1px)', ...style }}
    animate={{ scale: [1, 1.07, 1], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
  />
)

/* ── Floating chip ─────────────────────────────────────── */
export const FloatChip = ({ children, delay = 0, style = {} }) => (
  <motion.div style={style}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: [0, -8, 0] }}
    transition={{
      opacity: { duration: 0.5, delay },
      y: { duration: 3.5, delay, repeat: Infinity, ease: 'easeInOut' },
    }}
  >
    {children}
  </motion.div>
)

/* ── Signal-line SVG ───────────────────────────────────── */
export const SignalLineSVG = ({ color = '#00d9a6', width = 300, height = 72, style = {} }) => {
  // Pre-calculated simple waveform path
  const mid = height / 2
  const d = [
    `M 0 ${mid}`,
    `L ${width * 0.1} ${mid}`,
    `L ${width * 0.2} ${mid * 0.45}`,
    `L ${width * 0.3} ${mid * 1.55}`,
    `L ${width * 0.4} ${mid * 0.35}`,
    `L ${width * 0.5} ${mid}`,
    `L ${width * 0.6} ${mid}`,
    `L ${width * 0.7} ${mid * 0.25}`,
    `L ${width * 0.8} ${mid * 1.7}`,
    `L ${width * 0.9} ${mid}`,
    `L ${width} ${mid}`,
  ].join(' ')

  const dotXFrames = [0, width * 0.1, width * 0.2, width * 0.3, width * 0.4, width * 0.5, width * 0.6, width * 0.7, width * 0.8, width * 0.9, width]
  const dotYFrames = [mid, mid, mid * 0.45, mid * 1.55, mid * 0.35, mid, mid, mid * 0.25, mid * 1.7, mid, mid]

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={color} stopOpacity="0" />
          <stop offset="40%"  stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <motion.path d={d} stroke={`url(#sg-${color.replace('#','')})`} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.9, 1], ease: 'easeInOut', repeatDelay: 0.5 }}
      />
      <motion.circle r="4" fill={color}
        animate={{ cx: dotXFrames, cy: dotYFrames }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 2.3, times: dotXFrames.map((_, i) => i / (dotXFrames.length - 1)) }}
      />
    </svg>
  )
}

/* ── 3D tilt card ──────────────────────────────────────── */
export const TiltCard = ({ children, style = {}, maxTilt = 8, ...props }) => {
  const ref = useRef(null)
  const rX = useMotionValue(0)
  const rY = useMotionValue(0)
  const srX = useSpring(rX, { stiffness: 200, damping: 18 })
  const srY = useSpring(rY, { stiffness: 200, damping: 18 })

  const handleMouse = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const nx = (e.clientX - rect.left) / rect.width  - 0.5
    const ny = (e.clientY - rect.top)  / rect.height - 0.5
    rX.set(ny * -maxTilt * 2)
    rY.set(nx *  maxTilt * 2)
  }, [rX, rY, maxTilt])

  const handleLeave = useCallback(() => { rX.set(0); rY.set(0) }, [rX, rY])

  return (
    <motion.div ref={ref}
      style={{ rotateX: srX, rotateY: srY, transformStyle: 'preserve-3d', perspective: 800, ...style }}
      onMouseMove={handleMouse} onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/* ── Spotlight card ────────────────────────────────────── */
export const SpotlightCard = ({ children, accentColor = '#00d9a6', style = {}, ...props }) => {
  const [pos, setPos] = useState({ x: 0, y: 0, show: false })
  const ref = useRef(null)

  const handleMouse = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true })
  }, [])
  const handleLeave = useCallback(() => setPos(p => ({ ...p, show: false })), [])

  return (
    <div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave}
      style={{ position: 'relative', overflow: 'hidden', ...style }} {...props}>
      <div style={{
        position: 'absolute', pointerEvents: 'none', zIndex: 0,
        width: 180, height: 180, borderRadius: '50%',
        background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
        transform: `translate(${pos.x - 90}px, ${pos.y - 90}px)`,
        opacity: pos.show ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />
      {children}
    </div>
  )
}
