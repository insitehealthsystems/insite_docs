'use client'
import React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Smartphone, Lock, ShieldCheck, Fingerprint, Wifi, RefreshCw, ArrowRight, Key, Eye, AlertTriangle, Globe, ChevronRight } from 'lucide-react'
import { fadeUp, stagger, slideInLeft, slideInRight, AnimatedCounter, MagneticButton, ParticleField, GradientOrb, PulseRings, FloatChip, TiltCard, SpotlightCard } from '../../components/MotionUtils'

const CheckDot = ({ color = '#0ab8ff', rgb = '10,184,255' }) => (
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
    whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  >
    <motion.div initial={{ scale: 0, rotate: -30 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: idx * 0.1 }}
      style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #0ab8ff, #00d9a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 11, color: '#0a0f1e' }}>
      {num}
    </motion.div>
    <h4 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 10, marginTop: 4 }}>{title}</h4>
    <p style={{ color: '#8898b4', fontSize: 13, lineHeight: 1.7 }}>{desc}</p>
  </motion.div>
)

const StatPill = ({ value, numericValue, suffix, label, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }} whileHover={{ y: -4, scale: 1.04 }} style={{ textAlign: 'center' }}>
    <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,50px)', lineHeight: 1, color }}>
      {numericValue ? <AnimatedCounter href={numericValue} suffix={suffix || ''} color={color} /> : <span style={{ color }}>{value}</span>}
    </div>
    <div style={{ color: '#8898b4', fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>{label}</div>
  </motion.div>
)

const MobileSecurity = () => {
  const { scrollYProgress } = useScroll()
  const progressW = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const accentColor = '#0ab8ff'
  const accentRgb   = '10,184,255'

  const challenges = [
    { Icon: AlertTriangle, title: 'Unmanaged Personal Devices', desc: 'Clinicians use personal smartphones and tablets to access patient data, creating uncontrolled endpoints outside your security perimeter.' },
    { Icon: Wifi, title: 'Insecure Wi-Fi Access', desc: 'Open guest networks and legacy Wi-Fi infrastructure expose sensitive EHR traffic to interception and man-in-the-middle attacks.' },
    { Icon: Key, title: 'Shared Credentials', desc: 'Shared logins on workstations-on-wheels and shared tablets make individual accountability nearly impossible to enforce.' },
    { Icon: Eye, title: 'Visibility Gaps', desc: 'No unified view of which devices are accessing which systems means threats can go undetected for days or weeks.' },
  ]

  const capabilities = [
    { Icon: Fingerprint, name: 'Zero-Trust Authentication', desc: 'Every device, every user, every access request is verified—regardless of network location. MFA and biometric options included.' },
    { Icon: ShieldCheck, name: 'Mobile Device Management', desc: 'Centrally manage, configure, and remotely wipe any enrolled device. Policy enforcement applies to both corporate-owned and BYOD endpoints.' },
    { Icon: Lock, name: 'Encrypted Communications', desc: 'AES-256 encryption for all data in transit and at rest. Secure container apps isolate clinical data from personal app content.' },
    { Icon: Globe, name: 'Network Access Control', desc: 'Segment clinical devices onto dedicated VLANs, enforce device compliance checks at connection, and block non-compliant endpoints automatically.' },
    { Icon: RefreshCw, name: 'Automated Patch Management', desc: 'Continuously monitor device OS and app versions. Push critical security patches automatically during off-peak hours.' },
    { Icon: Eye, name: 'Real-Time Threat Detection', desc: 'AI-driven anomaly detection flags unusual access patterns, data exfiltration attempts, and jailbroken or rooted devices instantly.' },
  ]

  const complianceItems = [
    'HIPAA Security Rule alignment', 'HITECH Act compliance support', 'SOC 2 Type II compatible',
    'ISO 27001 framework aligned', 'NIST Cybersecurity Framework', 'Joint Commission IT standards',
    'CMS Conditions of Participation', 'State privacy law readiness',
  ]

  const steps = [
    { num: '01', title: 'Security Assessment', desc: 'We audit your current mobile environment—device inventory, network topology, existing policies—to identify gaps and risk areas.' },
    { num: '02', title: 'Policy Design', desc: 'Our team architects a mobile security policy tailored to your workflows, device mix, and compliance obligations.' },
    { num: '03', title: 'Phased Rollout', desc: 'Enroll devices department by department, minimizing clinical disruption while maintaining continuous visibility throughout.' },
    { num: '04', title: 'Monitor & Respond', desc: '24/7 monitoring dashboard, automated alerts, and incident response playbooks keep your environment secure after go-live.' },
  ]

  const testimonials = [
    { name: 'Bennett Harper', role: 'Operations Director, Regional Medical', text: "InSite's mobile security solution gave us full visibility into every device touching our clinical systems. We passed our HIPAA audit with zero findings for the first time." },
    { name: 'Nicolas Poran', role: 'IT Manager, City Hospital', text: "Onboarding new staff devices went from a 45-minute manual process to under 5 minutes with InSite MDM. The ROI was immediate." },
  ]

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', overflowX: 'hidden' }}>
      <motion.div style={{ position: 'fixed', top: 0, left: 0, height: 2, background: 'linear-gradient(90deg, #0ab8ff, #00d9a6)', width: progressW, zIndex: 9999, originX: 0 }} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <ParticleField color="#0ab8ff" density={22} style={{ zIndex: 1 }} />
        <GradientOrb color1="#0ab8ff" color2="#00d9a6" size={700} style={{ top: '-10%', right: '-5%', zIndex: 1 }} />
        <PulseRings color="#0ab8ff" size={500} style={{ top: '50%', left: '30%', transform: 'translate(-50%,-50%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, color: '#8898b4', fontSize: 13 }}>
            <Link href="/" style={{ color: '#8898b4', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#8898b4'}>Home</Link>
            <ChevronRight size={13} />
            <Link href="/services" style={{ color: '#8898b4', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#8898b4'}>Services</Link>
            <ChevronRight size={13} />
            <span style={{ color: accentColor }}>Mobile Security</span>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <SB label="MOBILE-FIRST SECURE ENVIRONMENT" color={accentColor} rgb={accentRgb} />
              <motion.h1 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(36px,5vw,62px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: 20 }}>
                Zero-Trust Security<br />
                <span style={{ background: 'linear-gradient(95deg, #0ab8ff, #00d9a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>For Every Device</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.75, maxWidth: 520, marginBottom: 40 }}>
                Protect every device, every user, and every data access point across your facility—without slowing down the care your teams deliver.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <MagneticButton>
                  <Link href="/contact" style={{ background: 'linear-gradient(135deg, #0ab8ff, #00d9a6)', color: '#0a0f1e', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 24px rgba(10,184,255,0.3)' }}>
                    Schedule a Security Review <ArrowRight size={15} />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link href="/services" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15, padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)' }}>All Services</Link>
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Hero visual – security status card */}
            <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} className="hero-right">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'rgba(20,28,50,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(10,184,255,0.2)', borderRadius: 24, padding: '28px 32px', width: '100%', maxWidth: 360, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #0ab8ff, #00d9a6)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span className="animate-pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d9a6', display: 'inline-block' }} />
                  <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>SECURITY STATUS</span>
                  <span style={{ marginLeft: 'auto', color: '#8898b4', fontSize: 11 }}>All systems nominal</span>
                </div>
                {[
                  { label: 'Encryption', value: 'AES-256', status: 'active', c: '#00d9a6' },
                  { label: 'Zero-Trust', value: 'Enforced', status: 'active', c: '#00d9a6' },
                  { label: 'MDM Enrollment', value: '214 devices', status: 'active', c: '#0ab8ff' },
                  { label: 'Threats Blocked', value: '0 today', status: 'secure', c: '#f7c94b' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.c, flexShrink: 0 }} className="animate-pulse-dot" />
                    <span style={{ color: '#8898b4', fontSize: 12, flex: 1 }}>{item.label}</span>
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>{item.value}</span>
                  </motion.div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  {['HIPAA', 'SOC 2', 'HITECH'].map((t, i) => (
                    <motion.span key={t} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 + i * 0.1 }}
                      style={{ background: 'rgba(10,184,255,0.1)', border: '1px solid rgba(10,184,255,0.25)', color: '#0ab8ff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, letterSpacing: '0.06em' }}>{t}</motion.span>
                  ))}
                </div>
              </motion.div>
              <FloatChip delay={0.8} style={{ position: 'absolute', top: -20, left: -10, background: 'rgba(0,217,166,0.12)', border: '1px solid rgba(0,217,166,0.3)', borderRadius: 12, padding: '7px 13px', fontSize: 12, color: '#00d9a6', fontWeight: 700, whiteSpace: 'nowrap' }}>🔒 End-to-end encrypted</FloatChip>
              <FloatChip delay={1.2} style={{ position: 'absolute', bottom: 10, right: -10, background: 'rgba(247,201,75,0.1)', border: '1px solid rgba(247,201,75,0.3)', borderRadius: 12, padding: '7px 13px', fontSize: 12, color: '#f7c94b', fontWeight: 700, whiteSpace: 'nowrap' }}>⚡ &lt;30s threat response</FloatChip>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section style={{ padding: '72px 0', background: 'linear-gradient(135deg, rgba(10,184,255,0.06) 0%, rgba(0,217,166,0.04) 100%)', borderTop: '1px solid rgba(10,184,255,0.1)', borderBottom: '1px solid rgba(10,184,255,0.1)', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#0ab8ff" density={18} style={{ opacity: 0.4 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, textAlign: 'center' }}>
          <StatPill value="99.9%" label="Uptime SLA" color="#0ab8ff" delay={0} />
          <StatPill value="&lt;5min" label="Device onboarding" color="#00d9a6" delay={0.1} />
          <StatPill numericValue={100} suffix="%" label="HIPAA alignment" color="#f7c94b" delay={0.2} />
          <StatPill value="24/7" label="Threat monitoring" color="#ff5e3a" delay={0.3} />
        </div>
      </section>

      {/* ── Challenges ────────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#ff5e3a" color2="#f7c94b" size={400} style={{ top: '10%', right: '-5%', opacity: 0.4 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <SB label="THE PROBLEM" color="#ff5e3a" rgb="255,94,58" />
            <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>Healthcare Mobility Creates<br /><span style={{ background: 'linear-gradient(95deg,#ff5e3a,#f7c94b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Unique Security Risks</span></motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{ color: '#8898b4', fontSize: 17, maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>Mobile devices are now integral to care delivery—but they also represent the fastest-growing attack surface in the modern healthcare facility.</motion.p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
            {challenges.map((c, i) => <Card key={i} Icon={c.Icon} title={c.title} desc={c.desc} color="#ff5e3a" rgb="255,94,58" idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Capabilities ──────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#0a0f1e', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#0ab8ff" density={20} style={{ opacity: 0.5 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <SB label="OUR SOLUTION" color={accentColor} rgb={accentRgb} />
            <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>Comprehensive Mobile<br /><span style={{ background: 'linear-gradient(95deg,#0ab8ff,#00d9a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Security Platform</span></motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
            {capabilities.map((c, i) => <Card key={i} Icon={c.Icon} title={c.name} desc={c.desc} color={accentColor} rgb={accentRgb} idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Compliance ────────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#0ab8ff" color2="#00d9a6" size={500} style={{ bottom: '-10%', left: '-5%', opacity: 0.35 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }} className="service-feature-grid">
            <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
              <SB label="COMPLIANCE READY" color={accentColor} rgb={accentRgb} />
              <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>Built for Healthcare<br /><span style={{ background: 'linear-gradient(95deg,#0ab8ff,#00d9a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Regulatory Requirements</span></h2>
              <p style={{ color: '#8898b4', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>Every feature is designed with healthcare compliance frameworks in mind—from HIPAA to HITECH to Joint Commission standards.</p>
              <MagneticButton>
                <Link href="/contact" style={{ background: 'linear-gradient(135deg,#0ab8ff,#00d9a6)', color: '#0a0f1e', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 20px rgba(10,184,255,0.25)' }}>
                  Talk to a Compliance Expert <ArrowRight size={15} />
                </Link>
              </MagneticButton>
            </motion.div>
            <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {complianceItems.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckDot color={accentColor} rgb={accentRgb} />
                  <span style={{ color: '#c8d5e8', fontSize: 13, lineHeight: 1.5 }}>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Steps ─────────────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: '#0a0f1e', position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="#0ab8ff" density={16} style={{ opacity: 0.35 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <SB label="OUR PROCESS" color="#f7c94b" rgb="247,201,75" />
            <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>Secure Your Environment in 4 Steps</motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((s, i) => <StepCard key={i} num={s.num} title={s.title} desc={s.desc} idx={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#070c19', position: 'relative', overflow: 'hidden' }}>
        <GradientOrb color1="#0ab8ff" color2="#00d9a6" size={500} style={{ top: '0', left: '50%', transform: 'translateX(-50%)', opacity: 0.4 }} />
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
        <ParticleField color="#0ab8ff" density={16} style={{ opacity: 0.4 }} />
        <GradientOrb color1="#0ab8ff" color2="#00d9a6" size={600} style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <PulseRings color="#0ab8ff" size={700} style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }} />
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.h2 variants={fadeUp} custom={0} style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', color: '#fff', letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.12 }}>
            Ready to Secure Your<br /><span style={{ background: 'linear-gradient(95deg,#0ab8ff,#00d9a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mobile Environment?</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} style={{ color: '#8898b4', fontSize: 17, lineHeight: 1.75, marginBottom: 40 }}>Let our healthcare security experts assess your current posture and design a zero-trust strategy tailored to your facility.</motion.p>
          <motion.div variants={fadeUp} custom={2} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagneticButton><Link href="/contact" style={{ background: 'linear-gradient(135deg,#0ab8ff,#00d9a6)', color: '#0a0f1e', textDecoration: 'none', fontWeight: 700, fontSize: 15, padding: '16px 36px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 0 30px rgba(10,184,255,0.35)' }}>Get a Free Assessment <ArrowRight size={16} /></Link></MagneticButton>
            <MagneticButton><Link href="/services" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15, padding: '16px 32px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)' }}>Explore All Services</Link></MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      <style>{`@media(max-width:860px){.hero-grid{grid-template-columns:1fr!important;}.hero-right{display:none!important;}.service-feature-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  )
}

export default MobileSecurity
