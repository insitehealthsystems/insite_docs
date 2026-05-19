import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Monitor, Activity, Bell, Server, Thermometer, Droplets, ArrowRight, Zap, Clock, Shield, BarChart3, ChevronRight } from 'lucide-react'
import { fadeUp, stagger, slideInLeft, slideInRight, AnimatedCounter, MagneticButton, ParticleField, GradientOrb, PulseRings, FloatChip, TiltCard, SpotlightCard } from '../../components/MotionUtils'

const CheckDot = ({ color = '#ff5e3a', rgb = '255,94,58' }) => (
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
      style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#ff5e3a,#f7c94b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 11, color: '#0a0f1e' }}>
      {num}
    </motion.div>
    <h4 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 10, marginTop: 4 }}>{title}</h4>
    <p style={{ color: '#8898b4', fontSize: 13, lineHeight: 1.7 }}>{desc}</p>
  </motion.div>
)

const IncidentCard = ({ Icon, step, color, rgb, desc, idx }) => (
  <motion.div variants={fadeUp} custom={idx}
    style={{ background: 'rgba(28,36,56,0.5)', border: `1px solid rgba(${rgb},0.18)`, borderRadius: 18, padding: '36px 28px', textAlign: 'center' }}
    whileHover={{ y: -5, borderColor: `rgba(${rgb},0.4)`, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
    <motion.div style={{ width: 60, height: 60, borderRadius: '50%', background: `rgba(${rgb},0.1)`, border: `2px solid rgba(${rgb},0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }} whileHover={{ scale: 1.15 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
      <Icon size={26} color={color} />
    </motion.div>
    <h4 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 12 }}>{step}</h4>
    <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.75 }}>{desc}</p>
  </motion.div>
)

const SiteMonitoring = () => {
  const { scrollYProgress } = useScroll()
  const progressW = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const accentColor = '#ff5e3a'
  const accentRgb   = '255,94,58'

  const monitoringAreas = [
    { Icon: Activity, title: 'Network Infrastructure', desc: 'Continuous monitoring of switches, routers, and access points. Automatic failover alerts ensure your clinical systems never go dark.' },
    { Icon: Thermometer, title: 'Environmental Conditions', desc: 'Temperature, humidity, and air quality sensors protect medication storage, lab samples, and sensitive medical equipment from environmental damage.' },
    { Icon: Server, title: 'Server & Application Health', desc: 'Real-time monitoring of EHR servers, imaging systems, and clinical applications with uptime SLA tracking and root-cause diagnostics.' },
    { Icon: Droplets, title: 'Utility & Power Systems', desc: 'Monitor UPS status, generator readiness, and critical power circuits. Receive instant alerts before power failures impact patient care.' },
    { Icon: Bell, title: 'Nurse Call & Patient Safety', desc: 'Integration with nurse call systems, duress alarms, and patient wander prevention to ensure full situational awareness.' },
    { Icon: Zap, title: 'Medical Equipment Status', desc: 'Monitor device connectivity, battery levels, and operational status for life-critical equipment in ICU, OR, and emergency departments.' },
  ]

  const features = [
    '24/7 automated monitoring with no manual intervention',
    'Configurable alert thresholds for every sensor type',
    'Escalation workflows that route alerts to the right team',
    'Historical trending for compliance audit evidence',
    'Single dashboard across all campuses and buildings',
    'Integration with existing BMS and HVAC systems',
    'Mobile app push notifications for on-call staff',
    'Automated incident ticket creation in ITSM tools',
    'HIPAA-compliant data retention and audit logs',
    'Custom SLA reporting for executive dashboards',
  ]

  const steps = [
    { num: '01', title: 'Discovery & Scoping', desc: 'We map your physical infrastructure, identify critical monitoring points, and define alert thresholds based on clinical and operational requirements.' },
    { num: '02', title: 'Sensor Deployment', desc: 'Our certified technicians install and configure environmental sensors, network probes, and agent software with minimal disruption to operations.' },
    { num: '03', title: 'Alert Tuning', desc: 'We calibrate thresholds, escalation paths, and notification rules to eliminate alert fatigue while ensuring nothing critical is missed.' },
    { num: '04', title: 'Continuous Monitoring', desc: '24/7 monitoring with monthly health reviews, threshold adjustments, and infrastructure expansion support as your facility grows.' },
  ]

  const incidentFlow = [
    { Icon: Activity, step: 'Detect', color: '#0ab8ff', rgb: '10,184,255', desc: 'Sensors and probes detect an anomaly. InSite evaluates against configured thresholds and confirms an alert condition within 30 seconds.' },
    { Icon: Bell, step: 'Notify', color: '#f7c94b', rgb: '247,201,75', desc: 'The right team member receives an alert via SMS, email, push notification, or automated phone call based on severity and escalation rules.' },
    { Icon: Shield, step: 'Resolve', color: '#00d9a6', rgb: '0,217,166', desc: 'The incident is logged, remediation steps are documented, and root-cause analysis is appended for compliance and future prevention.' },
  ]

  const testimonials = [
    { name: 'Clarence Wesley', role: 'CEO-Founder, MediCare Plus', text: "InSite site monitoring caught a failing HVAC unit in our medication storage room at 2am. The alert reached our on-call team within seconds—we avoided a $200k medication loss." },
    { name: 'Bennett Harper', role: 'Operations Director, Regional Medical', text: "Before InSite, we found out about network outages when nurses called the help desk. Now we know about issues before clinical staff does—that's a completely different operational posture." },
  ]

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', overflowX: 'hidden' }}>
      <motion.div style={{ position: 'fixed', top: 0, left: 0, height: 2, background: 'linear-gradient(90deg,#ff5e3a,#f7c94b)', width: progressW, zIndex: 9999, originX: 0 }} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <ParticleField color="#ff5e3a" density={22} style={{ zIndex: 1 }} />
        <GradientOrb color1="#ff5e3a" color2="#f7c94b" size={700} style={{ top: '-10%', left: '-5%', zIndex: 1 }} />
        <PulseRings color="#ff5e3a" size={500} style={{ top: '50%', right: '5%', transform: 'translate(0,-50%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, color: '#8898b4', fontSize: 13 }}>
            <Link to="/" style={{ color: '#8898b4', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#8898b4'}>Home</Link>
            <ChevronRight size={13} />
            <Link to="/services" style={{ color: '#8898b4', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#8898b4'}>Services</Link>
            <ChevronRight size={13} />
            <span style={{ color: accentColor }}>Site Monitoring</span>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <SB label="SITE MONITORING & RELIABILITY" color={accentColor} rgb={accentRgb} />
              <motion.h1 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(36px,5vw,62px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: 20 }}>
                Know Before<br />
                <span style={{ background: 'linear-gradient(95deg,#ff5e3a,#f7c94b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Problems Happen</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.75, maxWidth: 520, marginBottom: 40 }}>
                Know what's happening across your entire facility—network, environment, power, and clinical systems—before problems impact patient care.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <MagneticButton>
                  <Link to="/contact" style={{ background: 'linear-gradient(135deg,#ff5e3a,#f7c94b)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 24px rgba(255,94,58,0.3)' }}>
                    Request a Site Assessment <ArrowRight size={15} />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link to="/services" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15, padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)' }}>All Services</Link>
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Hero visual – live monitoring status */}
            <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} className="hero-right">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'rgba(20,28,50,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,94,58,0.2)', borderRadius: 24, padding: '28px 32px', width: '100%', maxWidth: 360, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#ff5e3a,#f7c94b)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span className="animate-pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d9a6', display: 'inline-block' }} />
                  <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>LIVE MONITORING</span>
                  <span style={{ marginLeft: 'auto', color: '#8898b4', fontSize: 11 }}>247 sensors</span>
                </div>
                {[
                  { label: 'Med Storage Temp', value: '36.2°F', status: 'ok', c: '#00d9a6' },
                  { label: 'ICU Network', value: '99.98% up', status: 'ok', c: '#00d9a6' },
                  { label: 'UPS Bank B', value: 'Warning', status: 'warn', c: '#f7c94b' },
                  { label: 'EHR Server A', value: 'Nominal', status: 'ok', c: '#00d9a6' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span className={item.status === 'warn' ? 'animate-pulse-dot' : ''} style={{ width: 8, height: 8, borderRadius: '50%', background: item.c, flexShrink: 0 }} />
                    <span style={{ color: '#8898b4', fontSize: 12, flex: 1 }}>{item.label}</span>
                    <span style={{ color: item.c, fontSize: 11, fontWeight: 700, fontFamily: 'monospace' }}>{item.value}</span>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                  style={{ marginTop: 14, background: 'rgba(255,94,58,0.08)', border: '1px solid rgba(255,94,58,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#ff5e3a', fontWeight: 600 }}>
                  ⚠ UPS Bank B — Schedule inspection
                </motion.div>
              </motion.div>
              <FloatChip delay={0.8} style={{ position: 'absolute', top: -20, right: -10, background: 'rgba(0,217,166,0.12)', border: '1px solid rgba(0,217,166,0.3)', borderRadius: 12, padding: '7px 13px', fontSize: 12, color: '#00d9a6', fontWeight: 700, whiteSpace: 'nowrap' }}>🌡 Env. sensors active</FloatChip>
              <FloatChip delay={1.2} style={{ position: 'absolute', bottom: 10, left: -20, background: 'rgba(247,201,75,0.1)', border: '1px solid rgba(247,201,75,0.3)', borderRadius: 12, padding: '7px 13px', fontSize: 12, color: '#f7c94b', fontWeight: 700, whiteSpace: 'nowrap' }}>⚡ &lt;30s alert time</FloatChip>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section style={{ padding: '72px 0', background: 'linear-gradient(135deg,rgba(255,94,58,0.06) 0%,rgba(247,201,75,0.04) 100%)', borderTop: '1px solid rgba(255,94,58,0.1)', borderBottom: '1px solid rgba(255,94,58,0.1)', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#ff5e3a" density={18} style={{ opacity: 0.4 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, textAlign: 'center' }}>
          {[
            { val: '99.95%', label: 'Average uptime achieved', color: '#ff5e3a', delay: 0 },
            { val: '<30s', label: 'Alert response time', color: '#00d9a6', delay: 0.1 },
            { num: 60, suffix: '%', label: 'Fewer unplanned outages', color: '#0ab8ff', delay: 0.2 },
            { val: '24/7', label: 'Active monitoring coverage', color: '#f7c94b', delay: 0.3 },
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

      {/* ── Coverage Areas ────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#ff5e3a" color2="#f7c94b" size={500} style={{ top: '10%', right: '-5%', opacity: 0.4 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 60 }}>
            <SB label="COVERAGE AREAS" color={accentColor} rgb={accentRgb} />
            <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>Complete Visibility<br /><span style={{ background: 'linear-gradient(95deg,#ff5e3a,#f7c94b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Across Your Facility</span></motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{ color: '#8898b4', fontSize: 17, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>From environmental sensors in medication rooms to network probes on clinical systems, InSite monitors every critical element of your operational infrastructure.</motion.p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
            {monitoringAreas.map((a, i) => <Card key={i} Icon={a.Icon} title={a.title} desc={a.desc} color={accentColor} rgb={accentRgb} idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Feature strip ─────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#0a0f1e', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#0ab8ff" color2="#00d9a6" size={400} style={{ bottom: '-10%', left: '-5%', opacity: 0.35 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }} className="service-feature-grid">
            <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
              <SB label="PLATFORM FEATURES" color={accentColor} rgb={accentRgb} />
              <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>Proactive Monitoring That<br /><span style={{ background: 'linear-gradient(95deg,#ff5e3a,#f7c94b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Keeps You Ahead</span></h2>
              <p style={{ color: '#8898b4', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>InSite Site Monitoring gives your operations, IT, and facilities teams a single source of truth for the health of your entire physical and digital infrastructure.</p>
              <MagneticButton>
                <Link to="/contact" style={{ background: 'linear-gradient(135deg,#ff5e3a,#f7c94b)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 20px rgba(255,94,58,0.25)' }}>
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

      {/* ── Incident flow ─────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#ff5e3a" density={18} style={{ opacity: 0.4 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <SB label="INCIDENT RESPONSE" color="#0ab8ff" rgb="10,184,255" />
            <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>From Detection to Resolution<br /><span style={{ background: 'linear-gradient(95deg,#0ab8ff,#00d9a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>in Minutes</span></motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {incidentFlow.map((item, i) => <IncidentCard key={i} Icon={item.Icon} step={item.step} color={item.color} rgb={item.rgb} desc={item.desc} idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Process steps ─────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#0a0f1e', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#ff5e3a" density={16} style={{ opacity: 0.35 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <SB label="GETTING STARTED" color="#00d9a6" rgb="0,217,166" />
            <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>Full Coverage in 4 Phases</motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((s, i) => <StepCard key={i} num={s.num} title={s.title} desc={s.desc} idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#ff5e3a" color2="#f7c94b" size={500} style={{ top: '0', left: '50%', transform: 'translateX(-50%)', opacity: 0.35 }} />
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
        <ParticleField color="#ff5e3a" density={16} style={{ opacity: 0.4 }} />
        <GradientOrb color1="#ff5e3a" color2="#f7c94b" size={600} style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <PulseRings color="#ff5e3a" size={700} style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }} />
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.h2 variants={fadeUp} custom={0} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', color: '#fff', letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.12 }}>
            Stop Finding Out About<br /><span style={{ background: 'linear-gradient(95deg,#ff5e3a,#f7c94b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Problems After the Fact</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} style={{ color: '#8898b4', fontSize: 17, lineHeight: 1.75, marginBottom: 40 }}>Get complete site visibility and respond to issues before they reach your patients and clinical teams.</motion.p>
          <motion.div variants={fadeUp} custom={2} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagneticButton><Link to="/contact" style={{ background: 'linear-gradient(135deg,#ff5e3a,#f7c94b)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '16px 36px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 30px rgba(255,94,58,0.35)' }}>Request a Site Assessment <ArrowRight size={16} /></Link></MagneticButton>
            <MagneticButton><Link to="/services" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15, padding: '16px 32px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)' }}>Explore All Services</Link></MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      <style>{`@media(max-width:860px){.hero-grid{grid-template-columns:1fr!important;}.hero-right{display:none!important;}.service-feature-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  )
}

export default SiteMonitoring
