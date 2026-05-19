'use client'
import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Mail, Phone, MapPin, ChevronRight, Users } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

/* ── LinkedIn icon ──────────────────────────────────────── */
const LinkedInIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

/* ── Initials avatar ─────────────────────────────────────── */
const AVATAR_GRADIENTS = [
  ['#00d9a6', '#0ab8ff'],
  ['#0ab8ff', '#7b61ff'],
  ['#f7c94b', '#ff9500'],
  ['#ff5e3a', '#ff2d6b'],
  ['#00d9a6', '#f7c94b'],
  ['#7b61ff', '#0ab8ff'],
  ['#0ab8ff', '#00d9a6'],
  ['#f7c94b', '#00d9a6'],
]

const getGradient = (name) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length]
}

const getInitials = (name) =>
  name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase()

const Avatar = ({ name, size = 64 }) => {
  const [c1, c2] = getGradient(name)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800,
      fontSize: size * 0.28, color: '#0a0f1e', userSelect: 'none',
    }}>
      {getInitials(name)}
    </div>
  )
}

/* ── Principal card (hero-size) ─────────────────────────── */
const PrincipalCard = ({ member, idx }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, overflow: 'hidden',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.65s ease ${idx * 80}ms, transform 0.65s ease ${idx * 80}ms`,
      }}
    >
      {/* Top accent */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #00d9a6, #0ab8ff)' }} />
      <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 32 }} className="principal-inner">
        {/* Avatar + name block */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }} className="principal-header">
          <Avatar name={member.name} size={88} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 24, color: '#fff', marginBottom: 4 }}>{member.name}</h3>
            <div style={{ color: '#00d9a6', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{member.title}</div>
            <div style={{ color: '#8898b4', fontSize: 13, fontStyle: 'italic' }}>{member.role}</div>
          </div>
        </div>

        {/* Bio */}
        <p style={{ color: '#c8d5e8', fontSize: 15, lineHeight: 1.8 }}>{member.bio}</p>

        {/* Expertise chips */}
        {member.expertise?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {member.expertise.map((item, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.22)',
                color: '#00d9a6', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 100,
              }}>
                <CheckCircle size={11} /> {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Executive card ─────────────────────────────────────── */
const ExecutiveCard = ({ member, bioComingSoon, idx }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.65s ease ${idx * 80}ms, transform 0.65s ease ${idx * 80}ms, border-color 0.2s, box-shadow 0.25s`,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,217,166,0.2)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ height: 2, background: 'linear-gradient(90deg, #00d9a6, #0ab8ff)' }} />
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
          <Avatar name={member.name} size={56} />
          <div>
            <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 3, lineHeight: 1.3 }}>{member.name}</h3>
            <div style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{member.title}</div>
            <div style={{ color: '#8898b4', fontSize: 11, fontStyle: 'italic' }}>{member.role}</div>
          </div>
        </div>

        {/* Bio */}
        <p style={{ color: '#8898b4', fontSize: 13, lineHeight: 1.75, flex: 1, marginBottom: 16 }}>
          {member.bio || bioComingSoon}
        </p>

        {/* Expertise chips */}
        {member.expertise?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14 }}>
            {member.expertise.map((item, i) => (
              <span key={i} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#8898b4', fontSize: 11, padding: '3px 10px', borderRadius: 100,
              }}>{item}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Clinical card ──────────────────────────────────────── */
const ClinicalCard = ({ member, bioComingSoon, idx }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(10,184,255,0.12)',
        borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.65s ease ${idx * 100}ms, transform 0.65s ease ${idx * 100}ms, border-color 0.2s`,
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(10,184,255,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(10,184,255,0.12)'}
    >
      <div style={{ height: 2, background: 'linear-gradient(90deg, #0ab8ff, #7b61ff)' }} />
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <Avatar name={member.name} size={52} />
          <div>
            <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 3 }}>{member.name}</h3>
            <div style={{ color: '#0ab8ff', fontSize: 12, fontWeight: 700 }}>{member.title}</div>
          </div>
        </div>
        <p style={{ color: '#8898b4', fontSize: 13, lineHeight: 1.75, fontStyle: 'italic', flex: 1 }}>
          {member.bio || bioComingSoon}
        </p>
      </div>
    </div>
  )
}

/* ── Dev card ────────────────────────────────────────────── */
const DevCard = ({ member, idx }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(28,36,56,0.45)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${idx * 60}ms, transform 0.5s ease ${idx * 60}ms, border-color 0.2s`,
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,217,166,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      <Avatar name={member.name} size={44} />
      <div>
        <h4 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 2 }}>{member.name}</h4>
        <div style={{ color: '#8898b4', fontSize: 12 }}>{member.title}</div>
      </div>
    </div>
  )
}

/* ── Section header ─────────────────────────────────────── */
const SectionHeader = ({ label, color = '#00d9a6', rgb = '0,217,166', note }) => {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center', marginBottom: 48,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center', marginBottom: note ? 16 : 0 }}>
        <div style={{ flex: 1, height: 1, background: `rgba(${rgb},0.2)`, maxWidth: 120 }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.25)`,
          padding: '6px 18px', borderRadius: 100,
          color, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
        }}>{label}</span>
        <div style={{ flex: 1, height: 1, background: `rgba(${rgb},0.2)`, maxWidth: 120 }} />
      </div>
      {note && <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.75, maxWidth: 600, margin: '12px auto 0' }}>{note}</p>}
    </div>
  )
}

/* ── TeamPage ────────────────────────────────────────────── */
const TeamPage = () => {
  const { t } = useTranslation()

  const principal  = t('team.members.principal',  { returnObjects: true }) || []
  const executive  = t('team.members.executive',  { returnObjects: true }) || []
  const clinical   = t('team.members.clinical',   { returnObjects: true }) || []
  const dev        = t('team.members.dev',         { returnObjects: true }) || []
  const stats      = t('team.stats',               { returnObjects: true }) || []
  const philosophy = t('team.philosophyItems',     { returnObjects: true }) || []
  const bioComingSoon = t('team.bioComingSoon', 'Profile coming soon.')

  const [heroRef, heroVisible] = useScrollReveal(0.05)
  const [ctaRef, ctaVisible]   = useScrollReveal(0.1)

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 80, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,217,166,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div
          ref={heroRef}
          style={{
            position: 'relative', zIndex: 1, maxWidth: 740, margin: '0 auto', padding: '0 24px',
            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20, color: '#8898b4', fontSize: 13 }}>
            <Link href="/" style={{ color: '#8898b4', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#8898b4'}>Home</Link>
            <span>/</span>
            <span style={{ color: '#fff' }}>{t('nav.team', 'Team')}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.25)', padding: '6px 16px', borderRadius: 100, marginBottom: 22 }}>
            <Users size={14} color="#00d9a6" />
            <span style={{ color: '#00d9a6', fontSize: 13, fontWeight: 600 }}>Our People</span>
          </div>
          <h1 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 62px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
            {t('team.title', 'Meet Our')}{' '}
            <span style={{ background: 'linear-gradient(95deg, #00d9a6, #0ab8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Expert Team
            </span>
          </h1>
          <p style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.75, maxWidth: 600, margin: '0 auto' }}>
            {t('team.subtitle', 'Decades of real-world experience in healthcare, enterprise technology, and infrastructure — united by a mission to transform how hospitals operate.')}
          </p>
        </div>
      </section>

      {/* ── Stats banner ─────────────────────────────────── */}
      {stats.length > 0 && (
        <section style={{
          padding: '60px 0',
          background: 'linear-gradient(135deg, rgba(0,217,166,0.07) 0%, rgba(10,184,255,0.05) 100%)',
          borderTop: '1px solid rgba(0,217,166,0.1)', borderBottom: '1px solid rgba(0,217,166,0.1)',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>
            {stats.map((stat, i) => {
              const colors = ['#00d9a6', '#0ab8ff', '#f7c94b', '#ff5e3a']
              return (
                <div key={i}>
                  <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(30px, 4vw, 48px)', color: colors[i % colors.length], lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: '#8898b4', fontSize: 14, marginTop: 8 }}>{stat.label}</div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Principal ────────────────────────────────────── */}
      {principal.length > 0 && (
        <section style={{ padding: '100px 0', background: '#070c19' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
            <SectionHeader label={t('team.sectionPrincipal', 'Principal')} color="#00d9a6" rgb="0,217,166" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {principal.map((member, i) => <PrincipalCard key={i} member={member} idx={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Executive Leadership ─────────────────────────── */}
      {executive.length > 0 && (
        <section style={{ padding: '100px 0', background: '#0a0f1e' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <SectionHeader label={t('team.sectionExecutive', 'Executive Leadership')} color="#0ab8ff" rgb="10,184,255" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {executive.map((member, i) => <ExecutiveCard key={i} member={member} bioComingSoon={bioComingSoon} idx={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Clinical Advisory ────────────────────────────── */}
      {clinical.length > 0 && (
        <section style={{ padding: '100px 0', background: '#070c19' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
            <SectionHeader
              label={t('team.sectionClinical', 'Clinical Advisory Board')}
              color="#0ab8ff" rgb="10,184,255"
              note={t('team.sectionClinicalNote', 'InSite Health Solutions is forming a Clinical Advisory Board of experienced healthcare professionals to provide guidance on workflow alignment, usability, and operational impact.')}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {clinical.map((member, i) => <ClinicalCard key={i} member={member} bioComingSoon={bioComingSoon} idx={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Dev & Support ────────────────────────────────── */}
      {dev.length > 0 && (
        <section style={{ padding: '100px 0', background: '#0a0f1e' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
            <SectionHeader
              label={t('team.sectionDev', 'Development & Support Team')}
              color="#f7c94b" rgb="247,201,75"
              note={t('team.sectionDevNote', 'Our dedicated software and systems team builds, deploys, and maintains enterprise-grade solutions with a commitment to security, reliability, and continuous improvement.')}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {dev.map((member, i) => <DevCard key={i} member={member} idx={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Leadership Philosophy ─────────────────────────── */}
      {philosophy.length > 0 && (
        <section style={{ padding: '80px 0', background: '#070c19' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
            <SectionHeader label={t('team.philosophy', 'Leadership Philosophy')} color="#00d9a6" rgb="0,217,166" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {philosophy.map((item, i) => {
                const colors = ['#00d9a6', '#0ab8ff', '#f7c94b', '#ff5e3a']
                const rgbs   = ['0,217,166', '10,184,255', '247,201,75', '255,94,58']
                const c = colors[i % colors.length]
                const r = rgbs[i % rgbs.length]
                return (
                  <div key={i} style={{
                    background: 'rgba(28,36,56,0.45)', border: `1px solid rgba(${r},0.15)`,
                    borderRadius: 14, padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 14,
                  }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: `rgba(${r},0.1)`, border: `1px solid rgba(${r},0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                      <CheckCircle size={16} color={c} />
                    </div>
                    <p style={{ color: '#c8d5e8', fontWeight: 600, fontSize: 14, lineHeight: 1.55 }}>{item}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Join CTA ─────────────────────────────────────── */}
      <section style={{ padding: '90px 0', background: '#0a0f1e', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div
          ref={ctaRef}
          style={{
            maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center',
            opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
          }}
        >
          <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 50px)', color: '#fff', letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.15 }}>
            {t('team.joinMission', 'Ready to Join Our')}<br />
            <span style={{ background: 'linear-gradient(95deg, #00d9a6, #0ab8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Mission?
            </span>
          </h2>
          <p style={{ color: '#8898b4', fontSize: 17, lineHeight: 1.75, marginBottom: 36 }}>
            {t('team.joinDesc', "We're always looking for talented individuals who share our passion for improving healthcare through technology.")}
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <Link href="/contact" style={{
              background: '#00d9a6', color: '#0a0f1e', textDecoration: 'none',
              fontWeight: 700, fontSize: 15, padding: '14px 32px', borderRadius: 10, transition: 'all 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#00c49a'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,217,166,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#00d9a6'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              {t('team.viewPositions', 'View Open Positions')} <ChevronRight size={16} />
            </Link>
            <Link href="/contact" style={{
              color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15,
              padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              {t('team.contactTeam', 'Contact Our Team')}
            </Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
            {[
              { Icon: Mail,  text: 'careers@insite.health' },
              { Icon: Phone, text: '(858) 366-3838' },
              { Icon: MapPin, text: 'Southern California' },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8898b4', fontSize: 13 }}>
                <Icon size={15} color="#00d9a6" /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:720px){
          .principal-inner { padding: 24px !important; }
          .principal-header { flex-direction: column; align-items: center !important; text-align: center; }
        }
      `}</style>
    </div>
  )
}

export default TeamPage
