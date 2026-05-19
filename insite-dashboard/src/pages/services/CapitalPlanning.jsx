import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TrendingUp, DollarSign, PieChart, Calendar, BarChart2, FileText, ArrowRight, AlertCircle, Clock, Layers, Target, ChevronRight } from 'lucide-react'
import { fadeUp, stagger, slideInLeft, slideInRight, AnimatedCounter, MagneticButton, ParticleField, GradientOrb, PulseRings, FloatChip, TiltCard, SpotlightCard } from '../../components/MotionUtils'

const CheckDot = ({ color = '#f7c94b', rgb = '247,201,75' }) => (
  <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, background: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
    <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 5.7L8 1" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
)

const SB = ({ label, color, rgb }) => (
  <motion.div variants={fadeUp} custom={0} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.25)`, padding: '5px 16px', borderRadius: 100, marginBottom: 18 }}>
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} className="animate-pulse-dot" />
    <span style={{ color, fontSize: 12, fontWeight: 700, letterSpacing: '0.07em' }}>{label}</span>
  </motion.div>
)

const Card = ({ Icon, title, desc, color, rgb, idx }) => (
  <motion.div variants={fadeUp} custom={idx}>
    <SpotlightCard accentColor={color} style={{ height: '100%', borderRadius: 18, background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
      <TiltCard maxTilt={6} style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
        <motion.div style={{ width: 50, height: 50, borderRadius: 13, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} whileHover={{ scale: 1.12, rotate: 5 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
          <Icon size={22} color={color} />
        </motion.div>
        <h4 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 17, color: '#fff', lineHeight: 1.3 }}>{title}</h4>
        <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.75, flex: 1 }}>{desc}</p>
      </TiltCard>
    </SpotlightCard>
  </motion.div>
)

const StepCard = ({ num, title, desc, idx }) => (
  <motion.div variants={fadeUp} custom={idx}
    style={{ background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '32px 22px', textAlign: 'center', position: 'relative' }}
    whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
    <motion.div initial={{ scale: 0, rotate: -30 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: idx * 0.1 }}
      style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#f7c94b,#ff9500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 11, color: '#0a0f1e' }}>
      {num}
    </motion.div>
    <h4 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 10, marginTop: 4 }}>{title}</h4>
    <p style={{ color: '#8898b4', fontSize: 13, lineHeight: 1.7 }}>{desc}</p>
  </motion.div>
)

const CapitalPlanning = () => {
  const { scrollYProgress } = useScroll()
  const progressW = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const accentColor = '#f7c94b'
  const accentRgb   = '247,201,75'

  const painPoints = [
    { Icon: AlertCircle, title: 'Decisions Made Without Data', desc: 'Capital committees approve multi-million-dollar equipment purchases based on gut feel and spreadsheet estimates—not real utilization evidence.' },
    { Icon: Clock, title: 'Equipment Replaced Too Early', desc: 'Without lifecycle data, facilities replace serviceable equipment prematurely, wasting capital that could fund clinical priorities.' },
    { Icon: Layers, title: 'Invisible Under-Utilization', desc: 'Duplicate equipment hidden in storage rooms and rarely-used devices tied up in wrong departments go undetected without visibility.' },
    { Icon: DollarSign, title: 'Unplanned Emergency Purchases', desc: 'Reactive procurement driven by last-minute shortages always costs more than planned purchasing cycles.' },
  ]

  const capabilities = [
    { Icon: BarChart2, name: 'Utilization Analytics', desc: 'See exactly how often every asset is used, idle, in maintenance, or hoarded—segmented by department, shift, and asset class.' },
    { Icon: TrendingUp, name: 'Lifecycle Tracking', desc: 'Monitor asset age, maintenance history, downtime frequency, and cost-per-use to predict optimal replacement timing.' },
    { Icon: PieChart, name: 'Capital Budget Modeling', desc: 'Model replacement scenarios and new purchase requests with real data. Present defensible ROI projections to your CFO.' },
    { Icon: Calendar, name: '5-Year Forecast Planning', desc: 'Forecast equipment end-of-life schedules, maintenance cost trends, and capital need timelines up to 5 years in advance.' },
    { Icon: FileText, name: 'Board-Ready Reporting', desc: 'Generate executive dashboards and committee-ready reports that translate operational data into financial language.' },
    { Icon: Target, name: 'Purchase Justification Engine', desc: "Automatically generate data-backed purchase justifications that align with your facility's capital approval workflow." },
  ]

  const features = [
    'Real-time utilization dashboards', 'Department-level cost allocation', 'Lifecycle & age reporting', '5-year forecast modeling',
    'Purchase justification templates', 'CFO & board report exports', 'Maintenance cost trending', 'Vendor comparison tools',
    'Budget vs. actual tracking', 'ERP & CMMS integration',
  ]

  const steps = [
    { num: '01', title: 'Asset Census', desc: 'We start with a complete inventory of your equipment portfolio—make, model, age, condition, location, and maintenance history.' },
    { num: '02', title: 'Utilization Baseline', desc: 'Deploy tracking to measure actual usage across your facility and build a 90-day utilization baseline for every asset class.' },
    { num: '03', title: 'Capital Analysis', desc: 'Our team analyzes utilization data alongside maintenance costs and lifecycle benchmarks to identify over-investment and gaps.' },
    { num: '04', title: 'Planning Dashboard', desc: 'Deliver a live capital planning dashboard and a 5-year replacement schedule your finance and clinical teams can act on.' },
  ]

  const testimonials = [
    { name: 'Nicolas Poran', role: 'IT Manager, City Hospital', text: "Capital planning visibility has never been this clear. We stopped over $600k in unnecessary purchases using InSite utilization data." },
    { name: 'Clarence Wesley', role: 'CFO, MediCare Plus', text: "For the first time our capital committee had objective data to support every purchase request. We cut review cycle time in half and improved budget accuracy by 30%." },
  ]

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', overflowX: 'hidden' }}>
      <motion.div style={{ position: 'fixed', top: 0, left: 0, height: 2, background: 'linear-gradient(90deg, #f7c94b, #ff9500)', width: progressW, zIndex: 9999, originX: 0 }} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <ParticleField color="#f7c94b" density={22} style={{ zIndex: 1 }} />
        <GradientOrb color1="#f7c94b" color2="#ff9500" size={700} style={{ top: '-10%', right: '-5%', zIndex: 1 }} />
        <PulseRings color="#f7c94b" size={500} style={{ top: '50%', left: '30%', transform: 'translate(-50%,-50%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, color: '#8898b4', fontSize: 13 }}>
            <Link to="/" style={{ color: '#8898b4', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#8898b4'}>Home</Link>
            <ChevronRight size={13} />
            <Link to="/services" style={{ color: '#8898b4', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#8898b4'}>Services</Link>
            <ChevronRight size={13} />
            <span style={{ color: accentColor }}>Capital Planning</span>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <SB label="DATA-DRIVEN CAPITAL PLANNING" color={accentColor} rgb={accentRgb} />
              <motion.h1 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(36px,5vw,62px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: 20 }}>
                Stop Buying<br />
                <span style={{ background: 'linear-gradient(95deg,#f7c94b,#ff9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>What You Already Own</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.75, maxWidth: 520, marginBottom: 40 }}>
                Replace guesswork with utilization evidence. Make smarter equipment investment decisions that reduce capital spend while improving clinical availability.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <MagneticButton>
                  <Link to="/contact" style={{ background: 'linear-gradient(135deg,#f7c94b,#ff9500)', color: '#0a0f1e', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 24px rgba(247,201,75,0.3)' }}>
                    Get a Capital Assessment <ArrowRight size={15} />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link to="/services" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15, padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)' }}>All Services</Link>
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Hero visual – capital dashboard */}
            <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} className="hero-right">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'rgba(20,28,50,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(247,201,75,0.2)', borderRadius: 24, padding: '28px 32px', width: '100%', maxWidth: 360, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#f7c94b,#ff9500)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <BarChart2 size={14} color="#f7c94b" />
                  <span style={{ color: '#f7c94b', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>CAPITAL DASHBOARD</span>
                  <span style={{ marginLeft: 'auto', color: '#8898b4', fontSize: 11 }}>FY 2026</span>
                </div>
                {/* Bar chart visual */}
                <div style={{ marginBottom: 20 }}>
                  {[
                    { label: 'IV Pumps', pct: 78, c: '#00d9a6' },
                    { label: 'Wheelchairs', pct: 42, c: '#f7c94b' },
                    { label: 'Monitors', pct: 91, c: '#0ab8ff' },
                    { label: 'Beds', pct: 55, c: '#ff5e3a' },
                  ].map((bar, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: '#8898b4', fontSize: 11 }}>{bar.label}</span>
                        <span style={{ color: bar.c, fontSize: 11, fontWeight: 700 }}>{bar.pct}% utilized</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${bar.pct}%` }} transition={{ duration: 1.2, delay: 0.8 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                          style={{ height: '100%', borderRadius: 3, background: bar.c }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(247,201,75,0.08)', border: '1px solid rgba(247,201,75,0.2)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ color: '#f7c94b', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>💡 RECOMMENDATION</div>
                  <div style={{ color: '#c8d5e8', fontSize: 12, lineHeight: 1.5 }}>Defer 3 wheelchair purchases — 42% utilization below 60% threshold</div>
                </div>
              </motion.div>
              <FloatChip delay={0.8} style={{ position: 'absolute', top: -20, left: -10, background: 'rgba(0,217,166,0.12)', border: '1px solid rgba(0,217,166,0.3)', borderRadius: 12, padding: '7px 13px', fontSize: 12, color: '#00d9a6', fontWeight: 700, whiteSpace: 'nowrap' }}>📉 22% avg. cost reduction</FloatChip>
              <FloatChip delay={1.2} style={{ position: 'absolute', bottom: 10, right: -10, background: 'rgba(247,201,75,0.1)', border: '1px solid rgba(247,201,75,0.3)', borderRadius: 12, padding: '7px 13px', fontSize: 12, color: '#f7c94b', fontWeight: 700, whiteSpace: 'nowrap' }}>📊 5-year forecast</FloatChip>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section style={{ padding: '72px 0', background: 'linear-gradient(135deg, rgba(247,201,75,0.06) 0%, rgba(255,149,0,0.04) 100%)', borderTop: '1px solid rgba(247,201,75,0.1)', borderBottom: '1px solid rgba(247,201,75,0.1)', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#f7c94b" density={18} style={{ opacity: 0.4 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, textAlign: 'center' }}>
          {[
            { num: 22, suffix: '%', label: 'Average reduction in capital spend', color: '#f7c94b', delay: 0 },
            { val: '3x', label: 'More accurate 5-year forecasts', color: '#00d9a6', delay: 0.1 },
            { num: 40, suffix: '%', label: 'Fewer emergency purchases', color: '#0ab8ff', delay: 0.2 },
            { num: 85, suffix: '%', label: 'Faster capital approval cycles', color: '#ff5e3a', delay: 0.3 },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: s.delay }} whileHover={{ y: -4, scale: 1.04 }} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,50px)', lineHeight: 1, color: s.color }}>
                {s.num ? <AnimatedCounter to={s.num} suffix={s.suffix} color={s.color} /> : <span style={{ color: s.color }}>{s.val}</span>}
              </div>
              <div style={{ color: '#8898b4', fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pain Points ───────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#ff5e3a" color2="#f7c94b" size={400} style={{ top: '10%', right: '-5%', opacity: 0.4 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <SB label="THE CHALLENGE" color="#ff5e3a" rgb="255,94,58" />
            <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>Capital Decisions Shouldn't<br /><span style={{ background: 'linear-gradient(95deg,#ff5e3a,#f7c94b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Be Based on Guesswork</span></motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{ color: '#8898b4', fontSize: 17, maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>Most healthcare capital committees are flying blind. Without utilization data, every purchase decision is a financial risk.</motion.p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
            {painPoints.map((p, i) => <Card key={i} Icon={p.Icon} title={p.title} desc={p.desc} color="#ff5e3a" rgb="255,94,58" idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Capabilities ──────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#0a0f1e', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#f7c94b" density={20} style={{ opacity: 0.5 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <SB label="PLATFORM CAPABILITIES" color={accentColor} rgb={accentRgb} />
            <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>From Raw Data to<br /><span style={{ background: 'linear-gradient(95deg,#f7c94b,#ff9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Capital Confidence</span></motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
            {capabilities.map((c, i) => <Card key={i} Icon={c.Icon} title={c.name} desc={c.desc} color={accentColor} rgb={accentRgb} idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Feature strip ─────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#f7c94b" color2="#ff9500" size={500} style={{ bottom: '-10%', right: '-5%', opacity: 0.35 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }} className="service-feature-grid">
            <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
              <SB label="WHAT'S INCLUDED" color={accentColor} rgb={accentRgb} />
              <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>Every Tool Your<br /><span style={{ background: 'linear-gradient(95deg,#f7c94b,#ff9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Capital Team Needs</span></h2>
              <p style={{ color: '#8898b4', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>InSite Capital Planning gives finance, operations, and clinical leadership a shared view of equipment performance and investment needs.</p>
              <MagneticButton>
                <Link to="/contact" style={{ background: 'linear-gradient(135deg,#f7c94b,#ff9500)', color: '#0a0f1e', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 20px rgba(247,201,75,0.25)' }}>
                  Schedule a Demo <ArrowRight size={15} />
                </Link>
              </MagneticButton>
            </motion.div>
            <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {features.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckDot color={accentColor} rgb={accentRgb} />
                  <span style={{ color: '#c8d5e8', fontSize: 13, lineHeight: 1.5 }}>{f}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Steps ─────────────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#0a0f1e', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#f7c94b" density={16} style={{ opacity: 0.35 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <SB label="OUR APPROACH" color="#0ab8ff" rgb="10,184,255" />
            <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>Data-Driven Capital Planning in 4 Steps</motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((s, i) => <StepCard key={i} num={s.num} title={s.title} desc={s.desc} idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#f7c94b" color2="#ff9500" size={500} style={{ top: '0', left: '50%', transform: 'translateX(-50%)', opacity: 0.35 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <SB label="CLIENT RESULTS" color={accentColor} rgb={accentRgb} />
            <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15 }}>What Our Clients Say</motion.h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -5, boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }} style={{ background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '32px 28px' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>{[...Array(5)].map((_, j) => <motion.span key={j} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + j * 0.07 }} style={{ fontSize: 14 }}>⭐</motion.span>)}</div>
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
        <ParticleField color="#f7c94b" density={16} style={{ opacity: 0.4 }} />
        <GradientOrb color1="#f7c94b" color2="#ff9500" size={600} style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <PulseRings color="#f7c94b" size={700} style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }} />
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.h2 variants={fadeUp} custom={0} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', color: '#fff', letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.12 }}>
            Make Your Next Capital Cycle<br /><span style={{ background: 'linear-gradient(95deg,#f7c94b,#ff9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Best One</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} style={{ color: '#8898b4', fontSize: 17, lineHeight: 1.75, marginBottom: 40 }}>Stop guessing and start planning with real utilization evidence behind every capital decision.</motion.p>
          <motion.div variants={fadeUp} custom={2} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagneticButton><Link to="/contact" style={{ background: 'linear-gradient(135deg,#f7c94b,#ff9500)', color: '#0a0f1e', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '16px 36px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 30px rgba(247,201,75,0.35)' }}>Request a Capital Assessment <ArrowRight size={16} /></Link></MagneticButton>
            <MagneticButton><Link to="/services" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15, padding: '16px 32px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)' }}>Explore All Services</Link></MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      <style>{`@media(max-width:860px){.hero-grid{grid-template-columns:1fr!important;}.hero-right{display:none!important;}.service-feature-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  )
}

export default CapitalPlanning
