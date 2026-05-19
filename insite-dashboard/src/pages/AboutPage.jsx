import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText, Settings, Stethoscope, TrendingUp, Star, Play, X } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

/* ── Video modal ─────────────────────────────────────────── */
const VideoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: 900 }} onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Close video"
          style={{ position: 'absolute', top: -44, right: 0, background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <X size={20} /> Close
        </button>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden' }}>
          <iframe
            src="https://www.youtube.com/embed/XHOmBV4js_E?autoplay=1"
            title="About InSite Health System"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

/* ── Reusable check icon ─────────────────────────────────── */
const CheckIcon = ({ color = '#00d9a6' }) => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
    <path d="M1 4L3.5 6.5L9 1" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── LinkedIn SVG icon ───────────────────────────────────── */
const LinkedInIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

/* ── Step card ───────────────────────────────────────────── */
const StepCard = ({ step, idx }) => {
  const [ref, visible] = useScrollReveal(0.1)
  const icons = { FileText, Settings, Stethoscope, TrendingUp }
  const Icon = step.icon
  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: '32px 24px', textAlign: 'center', position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.65s ease ${idx * 100}ms, transform 0.65s ease ${idx * 100}ms, border-color 0.2s`,
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,217,166,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      {/* Step number badge */}
      <div style={{
        position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
        width: 28, height: 28, borderRadius: '50%',
        background: 'linear-gradient(135deg, #00d9a6, #0ab8ff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 11, color: '#0a0f1e',
      }}>{step.number}</div>

      <div style={{ width: 56, height: 56, borderRadius: 14, margin: '8px auto 18px', background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={26} color="#00d9a6" />
      </div>
      <h3 style={{ color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{step.title}</h3>
      <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.7 }}>{step.description}</p>
    </div>
  )
}

/* ── Team card ───────────────────────────────────────────── */
const TeamCard = ({ member, idx }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.65s ease ${idx * 100}ms, transform 0.65s ease ${idx * 100}ms, box-shadow 0.25s ease`,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.35)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <img
          src={member.image} alt={member.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,30,0.7) 0%, transparent 60%)' }} />
      </div>

      {/* Info */}
      <div style={{ padding: '20px 22px', textAlign: 'center' }}>
        <h5 style={{ color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{member.name}</h5>
        <div style={{ color: '#00d9a6', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{member.position}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[
            { label: 'f', href: member.social.facebook },
            { label: '𝕏', href: member.social.twitter },
            { label: <LinkedInIcon />, href: member.social.linkedin },
          ].map((s, i) => (
            <a
              key={i} href={s.href}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#8898b4', fontSize: 12, textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,217,166,0.15)'; e.currentTarget.style.color = '#00d9a6'; e.currentTarget.style.borderColor = 'rgba(0,217,166,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#8898b4'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Testimonial card ────────────────────────────────────── */
const TestiCard = ({ t: testimonial, img, idx }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, padding: '32px 28px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.65s ease ${idx * 120}ms, transform 0.65s ease ${idx * 120}ms`,
      }}
    >
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="#f7c94b" color="#f7c94b" />
        ))}
      </div>
      <p style={{ color: '#c8d5e8', fontSize: 15, lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic' }}>
        "{testimonial.comment}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={img} alt={testimonial.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,217,166,0.3)' }} />
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{testimonial.name}</div>
          <div style={{ color: '#00d9a6', fontSize: 12, fontWeight: 600 }}>{testimonial.position}</div>
        </div>
      </div>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────── */
const AboutPage = () => {
  const { t } = useTranslation()
  const [videoOpen, setVideoOpen] = useState(false)

  const processSteps = [
    { number: '01', title: t('about.pilotStep1Title', 'Apply Online'),        description: t('about.pilotStep1Desc', 'Complete our pilot application — no commitment required.'),             icon: FileText    },
    { number: '02', title: t('about.pilotStep2Title', 'Plan Your Pilot'),     description: t('about.pilotStep2Desc', 'We design a custom scope with the right zones and success metrics.'),  icon: Settings    },
    { number: '03', title: t('about.pilotStep3Title', 'Deploy in 5 Days'),    description: t('about.pilotStep3Desc', 'White-glove installation and training with minimal IT involvement.'),  icon: Stethoscope },
    { number: '04', title: t('about.pilotStep4Title', 'See ROI in Days'),     description: t('about.pilotStep4Desc', 'Most facilities measure search-time reduction within the first week.'), icon: TrendingUp  },
  ]

  const teamMembers = [
    { name: 'Dr. Nicolas Poran',   position: t('team.members[0].position', 'Chief Medical Officer'), image: '/assets/images/team-1.jpg', social: { facebook: '#', twitter: '#', linkedin: '#' } },
    { name: 'Dr. Sarah Johnson',   position: t('team.members[1].position', 'Head of Operations'),    image: '/assets/images/team-4.jpg', social: { facebook: '#', twitter: '#', linkedin: '#' } },
    { name: 'Michael Chen',        position: t('team.members[2].position', 'Chief Technology Officer'), image: '/assets/images/team-3.jpg', social: { facebook: '#', twitter: '#', linkedin: '#' } },
    { name: 'Emily Rodriguez',     position: t('team.members[3].position', 'VP of Customer Success'),  image: '/assets/images/team-2.jpg', social: { facebook: '#', twitter: '#', linkedin: '#' } },
  ]

  const testimonialImages = ['/assets/images/testi1.png', '/assets/images/testi2.png', '/assets/images/testi3.png']
  const testimonials = t('about.testimonials', { returnObjects: true }) || [
    { name: 'Dr. Clarence Wesley', position: 'CEO-Founder',          comment: 'InSite has revolutionized our equipment management. The real-time visibility has improved our operational efficiency significantly.' },
    { name: 'Bennett Harper',       position: '24/7 Support Manager', comment: 'The support team understands healthcare workflows and provides solutions that actually work in real hospital environments.' },
    { name: 'Dr. Nicolas Poran',    position: 'Chief Medical Officer', comment: 'Our staff can now focus on patient care instead of searching for equipment. It has been a game-changer for our operations.' },
  ]

  const [heroRef, heroVisible] = useScrollReveal(0.05)
  const [missionRef, missionVisible] = useScrollReveal(0.1)
  const [stepsHeaderRef, stepsHeaderVisible] = useScrollReveal()
  const [teamHeaderRef, teamHeaderVisible] = useScrollReveal()
  const [testiHeaderRef, testiHeaderVisible] = useScrollReveal()
  const [ctaRef, ctaVisible] = useScrollReveal()

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 80, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,217,166,0.09) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div
          ref={heroRef}
          style={{
            position: 'relative', zIndex: 1, maxWidth: 740, margin: '0 auto', padding: '0 24px',
            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20, color: '#8898b4', fontSize: 13 }}>
            <Link to="/" style={{ color: '#8898b4', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#8898b4'}>Home</Link>
            <span>/</span>
            <span style={{ color: '#fff' }}>About</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.25)', padding: '6px 16px', borderRadius: 100, marginBottom: 22 }}>
            <span className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d9a6', display: 'inline-block' }} />
            <span style={{ color: '#00d9a6', fontSize: 13, fontWeight: 600 }}>Our Story</span>
          </div>
          <h1 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 62px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
            {t('about.title', 'About InSite')}{' '}
            <span style={{ background: 'linear-gradient(95deg, #00d9a6, #0ab8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Health System
            </span>
          </h1>
          <p style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.75, maxWidth: 580, margin: '0 auto' }}>
            {t('about.description', 'A leading provider of real-time healthcare technology solutions, specializing in equipment management, operational visibility, and measurable ROI for hospitals.')}
          </p>
        </div>
      </section>

      {/* ── Mission / Why Choose ─────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#070c19' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}
            className="about-mission-grid"
          >
            {/* Left: content */}
            <div
              ref={missionRef}
              style={{
                opacity: missionVisible ? 1 : 0, transform: missionVisible ? 'translateY(0)' : 'translateY(32px)',
                transition: 'opacity 0.65s ease, transform 0.65s ease',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.22)', padding: '5px 16px', borderRadius: 100, marginBottom: 20 }}>
                <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>WHY CHOOSE US</span>
              </div>
              <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px, 3.5vw, 44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
                {t('about.whyChooseTitle', 'Why Choose InSite Health System?')}
              </h2>
              <p style={{ color: '#8898b4', fontSize: 16, lineHeight: 1.75, marginBottom: 36 }}>
                {t('about.whyChooseSubtitle', 'Proven results in healthcare technology, backed by 25+ years of combined clinical and engineering experience.')}
              </p>

              {[
                {
                  title: t('about.feature1Title', 'Pleasant Experience'),
                  desc: t('about.feature1Desc', 'Our user-friendly interface ensures healthcare professionals can adopt our technology with minimal training and maximum confidence.'),
                  color: '#00d9a6', rgb: '0,217,166',
                },
                {
                  title: t('about.feature4Title', 'World-Class Service'),
                  desc: t('about.feature4Desc', 'Our dedicated support team provides 24/7 assistance and works closely with facilities to ensure successful implementation.'),
                  color: '#0ab8ff', rgb: '10,184,255',
                },
              ].map(feat => (
                <div key={feat.title} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: `rgba(${feat.rgb},0.1)`, border: `1px solid rgba(${feat.rgb},0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckIcon color={feat.color} />
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 6, fontFamily: 'Bricolage Grotesque, sans-serif' }}>{feat.title}</h4>
                    <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.7 }}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: video thumbnail */}
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }} className="about-video-col">
              <img
                src="/assets/images/choose.jpg"
                alt="Healthcare Technology"
                style={{ width: '100%', height: 460, objectFit: 'cover', display: 'block' }}
              />
              {/* Overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,15,30,0.4) 0%, rgba(10,15,30,0.15) 100%)' }} />
              {/* Play button */}
              <button
                onClick={() => setVideoOpen(true)}
                aria-label="Watch video"
                style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                  width: 76, height: 76, borderRadius: '50%',
                  background: 'rgba(0,217,166,0.15)', border: '2px solid rgba(0,217,166,0.5)',
                  backdropFilter: 'blur(10px)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.25s, transform 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,217,166,0.3)'; e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1.08)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,217,166,0.15)'; e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1)' }}
              >
                <Play size={28} color="#00d9a6" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pilot Process ────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#0a0f1e' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            ref={stepsHeaderRef}
            style={{
              textAlign: 'center', marginBottom: 64,
              opacity: stepsHeaderVisible ? 1 : 0, transform: stepsHeaderVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(10,184,255,0.08)', border: '1px solid rgba(10,184,255,0.22)', padding: '5px 16px', borderRadius: 100, marginBottom: 18 }}>
              <span style={{ color: '#0ab8ff', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>OUR PROCESS</span>
            </div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 46px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
              {t('about.pilotProcessTitle', 'How the Pilot Program Works')}
            </h2>
            <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              {t('about.pilotProcessSubtitle', 'From application to live system in under two weeks.')}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {processSteps.map((step, idx) => <StepCard key={step.number} step={step} idx={idx} />)}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#070c19' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            ref={teamHeaderRef}
            style={{
              textAlign: 'center', marginBottom: 56,
              opacity: teamHeaderVisible ? 1 : 0, transform: teamHeaderVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(247,201,75,0.08)', border: '1px solid rgba(247,201,75,0.22)', padding: '5px 16px', borderRadius: 100, marginBottom: 18 }}>
              <span style={{ color: '#f7c94b', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>OUR TEAM</span>
            </div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 46px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
              {t('about.teamTitle', 'Meet Our Expert Team')}
            </h2>
            <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
              {t('about.statsSubtitle', 'Decades of healthcare experience combined with cutting-edge technology expertise.')}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {teamMembers.map((member, idx) => <TeamCard key={member.name} member={member} idx={idx} />)}
          </div>
        </div>
      </section>

      {/* ── Stats banner ─────────────────────────────────── */}
      <section style={{
        padding: '72px 0',
        background: 'linear-gradient(135deg, rgba(0,217,166,0.08) 0%, rgba(10,184,255,0.06) 100%)',
        borderTop: '1px solid rgba(0,217,166,0.12)', borderBottom: '1px solid rgba(0,217,166,0.12)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, textAlign: 'center' }}>
          {[
            { value: '25+',   label: 'Years Combined Experience', color: '#00d9a6' },
            { value: '50+',   label: 'Hospital Partners',         color: '#0ab8ff' },
            { value: '5 days', label: 'Avg. Deployment Time',    color: '#f7c94b' },
            { value: '99.9%', label: 'Platform Uptime',          color: '#ff5e3a' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ color: '#8898b4', fontSize: 14, marginTop: 8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#0a0f1e' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            ref={testiHeaderRef}
            style={{
              textAlign: 'center', marginBottom: 60,
              opacity: testiHeaderVisible ? 1 : 0, transform: testiHeaderVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.22)', padding: '5px 16px', borderRadius: 100, marginBottom: 18 }}>
              <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>TESTIMONIALS</span>
            </div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 46px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
              {t('about.testimonialTitle', 'What Our Partners Say')}
            </h2>
            <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              {t('about.testimonialSubtitle', 'Real feedback from hospital leaders who have seen the results firsthand.')}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {testimonials.map((testi, idx) => (
              <TestiCard key={idx} t={testi} img={testimonialImages[idx] || testimonialImages[0]} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '90px 0', background: '#070c19', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div
          ref={ctaRef}
          style={{
            maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center',
            opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
          }}
        >
          <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 50px)', color: '#fff', letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.15 }}>
            Ready to Join Our<br />
            <span style={{ background: 'linear-gradient(95deg, #00d9a6, #0ab8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Founding Partner Program?
            </span>
          </h2>
          <p style={{ color: '#8898b4', fontSize: 17, lineHeight: 1.75, marginBottom: 36 }}>
            Zero financial commitment. White-glove deployment. Measurable results in days.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{
              background: '#00d9a6', color: '#0a0f1e', textDecoration: 'none',
              fontWeight: 700, fontSize: 15, padding: '14px 32px', borderRadius: 10, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(0,217,166,0.25)' }}
              onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none' }}>
              Book a Demo
            </Link>
            <Link to="/services" style={{
              color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15,
              padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.transform = 'translateY(0)' }}>
              Explore Solutions
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){
          .about-mission-grid{grid-template-columns:1fr!important;}
          .about-video-col{display:none!important;}
        }
      `}</style>
    </div>
  )
}

export default AboutPage
