'use client'
import React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { MapPin, Wifi, BarChart3, Shield, Clock, TrendingDown, CheckCircle, ArrowRight, Zap, Database, Eye, RefreshCw, ChevronRight, Activity } from 'lucide-react'
import {
  fadeUp, stagger, scaleIn, slideInLeft, slideInRight,
  AnimatedCounter, MagneticButton, ParticleField, PulseRings,
  GradientOrb, FloatChip, SignalLineSVG, TiltCard, SpotlightCard,
} from '../../components/MotionUtils'

/* ── Shared micro-components ────────────────────────────── */
const CheckDot = ({ color = '#00d9a6', rgb = '0,217,166' }) => (
  <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, background: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
      <path d="M1 3.5L3.2 5.7L8 1" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
)

const SectionBadge = ({ label, color = '#00d9a6', rgb = '0,217,166' }) => (
  <motion.div variants={fadeUp} custom={0}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.25)`, padding: '5px 16px', borderRadius: 100, marginBottom: 18 }}>
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} className="animate-pulse-dot" />
    <span style={{ color, fontSize: 12, fontWeight: 700, letterSpacing: '0.07em' }}>{label}</span>
  </motion.div>
)

const SectionTitle = ({ children, gradient }) => (
  <motion.h2 variants={fadeUp} custom={1}
    style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
    {gradient
      ? <>{children[0]}<span style={{ background: `linear-gradient(95deg, ${gradient[0]}, ${gradient[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{children[1]}</span></>
      : children
    }
  </motion.h2>
)

/* ── Benefit / tech card with tilt + spotlight ─────────── */
const FeatureCard = ({ Icon, title, desc, color, rgb, idx }) => (
  <motion.div variants={fadeUp} custom={idx}>
    <SpotlightCard accentColor={color}
      style={{ height: '100%', borderRadius: 18, background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}
    >
      <TiltCard maxTilt={6} style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
        <motion.div
          style={{ width: 50, height: 50, borderRadius: 13, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          whileHover={{ scale: 1.12, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Icon size={22} color={color} />
        </motion.div>
        <h4 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 17, color: '#fff', lineHeight: 1.3 }}>{title}</h4>
        <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.75, flex: 1 }}>{desc}</p>
      </TiltCard>
    </SpotlightCard>
  </motion.div>
)

/* ── Process step ──────────────────────────────────────── */
const StepCard = ({ num, title, desc, color, idx }) => (
  <motion.div variants={fadeUp} custom={idx}
    style={{ background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '32px 22px', textAlign: 'center', position: 'relative' }}
    whileHover={{ y: -6, borderColor: `rgba(${color === '#00d9a6' ? '0,217,166' : '10,184,255'},0.3)`, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  >
    <motion.div
      initial={{ scale: 0, rotate: -30 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 400, damping: 15, delay: idx * 0.1 }}
      style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #00d9a6, #0ab8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 11, color: '#0a0f1e' }}
    >{num}</motion.div>
    <h4 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 10, marginTop: 4 }}>{title}</h4>
    <p style={{ color: '#8898b4', fontSize: 13, lineHeight: 1.7 }}>{desc}</p>
  </motion.div>
)

/* ── Stat pill ─────────────────────────────────────────── */
const StatPill = ({ value, numericValue, suffix, label, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    whileHover={{ y: -4, scale: 1.04 }}
    style={{ textAlign: 'center' }}
  >
    <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,50px)', lineHeight: 1, color }}>
      {numericValue
        ? <AnimatedCounter href={numericValue} suffix={suffix || ''} color={color} />
        : <span style={{ color }}>{value}</span>
      }
    </div>
    <div style={{ color: '#8898b4', fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>{label}</div>
  </motion.div>
)

/* ─────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────── */
const AssetTracking = () => {
  const { scrollYProgress } = useScroll()
  const progressW = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const accentColor = '#00d9a6'
  const accentRgb   = '0,217,166'

  const benefits = [
    { Icon: Clock, title: 'Reduce Equipment Search Time by 75%', desc: 'Staff spend an average of 45 minutes per shift searching for misplaced equipment. Our real-time location data eliminates that waste instantly.' },
    { Icon: TrendingDown, title: 'Cut Equipment Loss & Theft', desc: 'Zone-level alerts and exit notifications immediately flag unauthorized equipment movement, dramatically reducing shrinkage across your facility.' },
    { Icon: BarChart3, title: 'Optimize Utilization Rates', desc: 'Understand exactly how often each asset is used, when, and by which department—so you buy only what you need and redeploy what you have.' },
    { Icon: Shield, title: 'HIPAA-Compliant by Design', desc: 'All location data is encrypted in transit and at rest. Role-based access controls ensure only authorized personnel can view sensitive asset locations.' },
  ]

  const techStack = [
    { Icon: Wifi, name: 'BLE Beacons', desc: 'Bluetooth Low Energy tags deliver continuous real-time location updates with a multi-year battery life.' },
    { Icon: MapPin, name: 'RFID Infrastructure', desc: 'Passive RFID readers installed at key chokepoints provide room-level accuracy without per-tag power requirements.' },
    { Icon: Zap, name: 'UWB Precision', desc: 'Ultra-wideband sensors deliver centimeter-level accuracy for high-value surgical and diagnostic equipment.' },
    { Icon: Database, name: 'Wi-Fi Integration', desc: 'Leverage your existing Wi-Fi infrastructure for approximate zone-level location with zero additional hardware.' },
    { Icon: Eye, name: 'Live Dashboard', desc: 'A single-pane-of-glass view of every tracked asset across all floors, wings, and campuses in real time.' },
    { Icon: RefreshCw, name: 'EHR / CMMS Integration', desc: 'Out-of-the-box connectors to Epic, Oracle Health, ServiceNow, and leading CMMS platforms.' },
  ]

  const steps = [
    { num: '01', title: 'Site Assessment', desc: 'Our engineers perform a wireless site survey and asset census to determine optimal tag technology, reader placement, and gateway density.' },
    { num: '02', title: 'Controlled Pilot', desc: 'We deploy on 20–40 assets across one unit or floor so you can validate ROI before committing to a full rollout.' },
    { num: '03', title: 'Full Deployment', desc: 'Phased facility-wide rollout with minimal disruption to clinical operations. Average time-to-live is under 8 weeks.' },
    { num: '04', title: 'Ongoing Optimization', desc: 'Quarterly utilization reviews, firmware updates, and continuous support from our dedicated healthcare operations team.' },
  ]

  const features = [
    'Room-level location accuracy', 'Automated utilization reports',
    'Predictive maintenance alerts', 'Multi-campus support',
    'Mobile app for iOS & Android', 'Custom zone & alert rules',
    'Capital planning dashboards', 'API & EHR integrations',
    'Role-based access control', 'HIPAA-compliant data storage',
  ]

  const testimonials = [
    { name: 'Clarence Wesley', role: 'CEO-Founder, MediCare Plus', text: "InSite's asset tracking transformed our operations. Equipment search time dropped 74% in the first month and our staff morale improved noticeably." },
    { name: 'Bennett Harper', role: 'Operations Director, Regional Medical', text: "We eliminated over $400k in unnecessary equipment purchases in year one by understanding true utilization rates across our two campuses." },
  ]

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Scroll progress bar ───────────────────────────── */}
      <motion.div style={{ position: 'fixed', top: 0, left: 0, height: 2, background: 'linear-gradient(90deg, #00d9a6, #0ab8ff)', width: progressW, zIndex: 9999, originX: 0 }} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
        {/* Layers */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <ParticleField color="#00d9a6" density={22} style={{ zIndex: 1 }} />
        <GradientOrb color1="#00d9a6" color2="#0ab8ff" size={700} style={{ top: '-10%', left: '-5%', zIndex: 1 }} />
        <PulseRings color="#00d9a6" size={500} style={{ top: '50%', left: '60%', transform: 'translate(-50%,-50%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, color: '#8898b4', fontSize: 13 }}>
            <Link href="/" style={{ color: '#8898b4', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#8898b4'}>Home</Link>
            <ChevronRight size={13} />
            <Link href="/services" style={{ color: '#8898b4', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#8898b4'}>Services</Link>
            <ChevronRight size={13} />
            <span style={{ color: accentColor }}>Asset Tracking</span>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">
            {/* Left */}
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <SectionBadge label="INTELLIGENT ASSET TRACKING" color={accentColor} rgb={accentRgb} />

              <motion.h1 variants={fadeUp} custom={1}
                style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(36px,5vw,62px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: 20 }}>
                Find Any Asset<br />
                <span style={{ background: 'linear-gradient(95deg, #00d9a6, #0ab8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  in Under 3 Seconds
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} custom={2}
                style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.75, maxWidth: 520, marginBottom: 40 }}>
                Real-time equipment visibility that eliminates search time, reduces loss, and gives your clinical teams back the minutes that matter.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <MagneticButton>
                  <Link href="/contact"
                    style={{ background: 'linear-gradient(135deg, #00d9a6, #0ab8ff)', color: '#0a0f1e', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 24px rgba(0,217,166,0.3)' }}>
                    Request a Free Pilot <ArrowRight size={15} />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link href="/services"
                    style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15, padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    All Services
                  </Link>
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Right – animated live signal card */}
            <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              className="hero-right"
            >
              {/* Glass card */}
              <motion.div
                style={{ background: 'rgba(20,28,50,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,217,166,0.18)', borderRadius: 24, padding: '28px 32px', width: '100%', maxWidth: 360, position: 'relative', overflow: 'hidden' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #00d9a6, #0ab8ff)' }} />

                {/* Live indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span className="animate-pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d9a6', display: 'inline-block' }} />
                  <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>LIVE TRACKING</span>
                  <span style={{ marginLeft: 'auto', color: '#8898b4', fontSize: 11 }}>Updated 0.3s ago</span>
                </div>

                {/* Signal waveform */}
                <div style={{ marginBottom: 20 }}>
                  <SignalLineSVG color="#00d9a6" width={300} height={72} />
                </div>

                {/* Asset rows */}
                {[
                  { id: 'IV-0284', name: 'IV Pump', floor: 'ICU – Rm 4B', status: 'online' },
                  { id: 'WC-1107', name: 'Wheelchair', floor: 'Floor 2 – Corridor', status: 'idle' },
                  { id: 'MO-0039', name: 'Infusion Monitor', floor: 'ER – Bay 7', status: 'online' },
                ].map((a, i) => (
                  <motion.div key={a.id}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.status === 'online' ? '#00d9a6' : '#f7c94b', flexShrink: 0 }} className="animate-pulse-dot" />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{a.name}</div>
                      <div style={{ color: '#8898b4', fontSize: 11 }}>{a.floor}</div>
                    </div>
                    <div style={{ color: '#8898b4', fontSize: 10, fontFamily: 'monospace' }}>{a.id}</div>
                  </motion.div>
                ))}

                {/* Bottom chips */}
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  {['BLE', 'RFID', 'UWB'].map((t, i) => (
                    <motion.span key={t}
                      initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1 + i * 0.1, type: 'spring', stiffness: 400 }}
                      style={{ background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.25)', color: '#00d9a6', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, letterSpacing: '0.06em' }}
                    >{t}</motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Floating chips around card */}
              <FloatChip delay={0.8} style={{ position: 'absolute', top: -20, right: -10, background: 'rgba(10,184,255,0.12)', border: '1px solid rgba(10,184,255,0.3)', borderRadius: 12, padding: '7px 13px', fontSize: 12, color: '#0ab8ff', fontWeight: 700, whiteSpace: 'nowrap' }}>
                📍 Sub-room accuracy
              </FloatChip>
              <FloatChip delay={1.2} style={{ position: 'absolute', bottom: 10, left: -20, background: 'rgba(247,201,75,0.1)', border: '1px solid rgba(247,201,75,0.3)', borderRadius: 12, padding: '7px 13px', fontSize: 12, color: '#f7c94b', fontWeight: 700, whiteSpace: 'nowrap' }}>
                ⚡ 0.3s latency
              </FloatChip>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section style={{ padding: '72px 0', background: 'linear-gradient(135deg, rgba(0,217,166,0.06) 0%, rgba(10,184,255,0.04) 100%)', borderTop: '1px solid rgba(0,217,166,0.1)', borderBottom: '1px solid rgba(0,217,166,0.1)', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#00d9a6" density={18} style={{ opacity: 0.4 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, textAlign: 'center' }}>
          <StatPill numericValue={75} suffix="%" label="Reduction in search time"   color="#00d9a6" delay={0}    />
          <StatPill numericValue={30} suffix="%" label="Fewer equipment purchases"  color="#0ab8ff" delay={0.1}  />
          <StatPill value="18mo" label="Typical payback period"         color="#f7c94b" delay={0.2}  />
          <StatPill numericValue={500} suffix="+" label="Healthcare facilities served" color="#ff5e3a" delay={0.3} />
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#00d9a6" color2="#0ab8ff" size={500} style={{ top: '10%', right: '-5%', opacity: 0.5 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionBadge label="WHY IT MATTERS" color={accentColor} rgb={accentRgb} />
            <SectionTitle gradient={['#00d9a6', '#0ab8ff']}>{'The Business Case for '}<span>Real-Time Visibility</span></SectionTitle>
            <motion.p variants={fadeUp} custom={2} style={{ color: '#8898b4', fontSize: 17, maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
              Hospital staff lose 45 minutes per shift searching for misplaced equipment. At scale, that becomes millions in lost productivity.
            </motion.p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
            {benefits.map((b, i) => <FeatureCard key={i} Icon={b.Icon} title={b.title} desc={b.desc} color={accentColor} rgb={accentRgb} idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Tech Stack ────────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#0a0f1e', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#0ab8ff" density={20} style={{ opacity: 0.5 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionBadge label="TECHNOLOGY STACK" color="#0ab8ff" rgb="10,184,255" />
            <SectionTitle>The Right Technology for Every Facility</SectionTitle>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
            {techStack.map((t, i) => <FeatureCard key={i} Icon={t.Icon} title={t.name} desc={t.desc} color="#0ab8ff" rgb="10,184,255" idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Feature strip ─────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#f7c94b" color2="#ff5e3a" size={400} style={{ bottom: '-10%', left: '-5%', opacity: 0.35 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }} className="service-feature-grid">
            <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
              <SectionBadge label="PLATFORM FEATURES" color={accentColor} rgb={accentRgb} />
              <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>
                Everything You Need<br />
                <span style={{ background: 'linear-gradient(95deg, #00d9a6, #0ab8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>in One Platform</span>
              </h2>
              <p style={{ color: '#8898b4', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
                InSite's asset tracking platform combines hardware, software, and professional services into a complete solution built specifically for healthcare environments.
              </p>
              <MagneticButton>
                <Link href="/contact"
                  style={{ background: 'linear-gradient(135deg, #00d9a6, #0ab8ff)', color: '#0a0f1e', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 20px rgba(0,217,166,0.25)' }}>
                  Schedule a Demo <ArrowRight size={15} />
                </Link>
              </MagneticButton>
            </motion.div>

            <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {features.map((f, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.5 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckDot color={accentColor} rgb={accentRgb} />
                  <span style={{ color: '#c8d5e8', fontSize: 13, lineHeight: 1.5 }}>{f}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Process steps ─────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#0a0f1e', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#00d9a6" density={16} style={{ opacity: 0.35 }} />
        {/* Connector line */}
        <div style={{ position: 'absolute', top: '50%', left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,217,166,0.2), rgba(10,184,255,0.2), transparent)', zIndex: 0 }} className="process-connector" />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionBadge label="GETTING STARTED" color="#f7c94b" rgb="247,201,75" />
            <SectionTitle>From Pilot to Full Deployment</SectionTitle>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((s, i) => <StepCard key={i} num={s.num} title={s.title} desc={s.desc} idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#00d9a6" color2="#0ab8ff" size={500} style={{ top: '0%', left: '50%', transform: 'translateX(-50%)', opacity: 0.4 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <SectionBadge label="CLIENT RESULTS" color={accentColor} rgb={accentRgb} />
            <SectionTitle>What Our Clients Say</SectionTitle>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 40, rotateX: 8 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}
                style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '32px 28px' }}
              >
                <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                  {[...Array(5)].map((_, j) => (
                    <motion.span key={j} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + j * 0.07 }} style={{ fontSize: 14 }}>⭐</motion.span>
                  ))}
                </div>
                <p style={{ color: '#c8d5e8', fontSize: 15, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 24 }}>"{t.text}"</p>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: accentColor, fontSize: 12, fontWeight: 600 }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#0a0f1e', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#00d9a6" density={16} style={{ opacity: 0.4 }} />
        <GradientOrb color1="#00d9a6" color2="#0ab8ff" size={600} style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <PulseRings color="#00d9a6" size={700} style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }} />

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <motion.h2 variants={fadeUp} custom={0}
            style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', color: '#fff', letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.12 }}>
            Ready to Eliminate<br />
            <span style={{ background: 'linear-gradient(95deg, #00d9a6, #0ab8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Equipment Search Time?
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} style={{ color: '#8898b4', fontSize: 17, lineHeight: 1.75, marginBottom: 40 }}>
            Join 500+ healthcare facilities using InSite to reclaim lost productivity and make smarter capital decisions.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagneticButton>
              <Link href="/contact"
                style={{ background: 'linear-gradient(135deg, #00d9a6, #0ab8ff)', color: '#0a0f1e', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '16px 36px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 30px rgba(0,217,166,0.35)' }}>
                Request Free Pilot <ArrowRight size={16} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/services"
                style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15, padding: '16px 32px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Explore All Services
              </Link>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      <style>{`
        @media(max-width:860px){
          .hero-grid{grid-template-columns:1fr!important;}
          .hero-right{display:none!important;}
          .service-feature-grid{grid-template-columns:1fr!important;}
          .process-connector{display:none!important;}
        }
      `}</style>
    </div>
  )
}

export default AssetTracking
