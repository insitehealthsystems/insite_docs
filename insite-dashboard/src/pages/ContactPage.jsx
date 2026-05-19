import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Stethoscope, Settings, TrendingUp, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { appointmentSchema } from '../utils/formValidation'
import { submitAppointment, getAppointmentAvailability } from '../utils/api'
import { useScrollReveal } from '../hooks/useScrollReveal'

const TIME_SLOTS = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
]

/* ── Shared input style ─────────────────────────────────── */
const inputBase = {
  width: '100%',
  background: 'rgba(10,15,30,0.8)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9,
  padding: '11px 14px',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'DM Sans, Outfit, sans-serif',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const focusOn  = (e) => { e.target.style.borderColor = '#00d9a6'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,166,0.1)' }
const focusOff = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }

/* ── Info card ──────────────────────────────────────────── */
const InfoCard = ({ Icon, label, children, color, rgb }) => (
  <div style={{ textAlign: 'center', padding: '24px 16px' }}>
    <div style={{ width: 56, height: 56, borderRadius: 14, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
      <Icon size={22} color={color} />
    </div>
    <h4 style={{ color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{label}</h4>
    <div style={{ color: '#8898b4', fontSize: 13, lineHeight: 1.6 }}>{children}</div>
  </div>
)

/* ── Step card ──────────────────────────────────────────── */
const StepCard = ({ step, idx }) => {
  const [ref, visible] = useScrollReveal(0.1)
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
        <Icon size={24} color="#00d9a6" />
      </div>
      <h3 style={{ color: '#fff', fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{step.title}</h3>
      <p style={{ color: '#8898b4', fontSize: 14, lineHeight: 1.7 }}>{step.description}</p>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */
const ContactPage = () => {
  const { t } = useTranslation()
  const [appointmentStatus, setAppointmentStatus] = useState(null)
  const [appointmentError, setAppointmentError] = useState('')
  const [availability, setAvailability] = useState({ loading: false, takenSlots: [], fullyBooked: false })

  const today = new Date().toISOString().split('T')[0]

  const {
    register: registerAppointment,
    handleSubmit: handleSubmitAppointment,
    reset: resetAppointment,
    watch,
    formState: { errors: appointmentErrors, isSubmitting: isSubmittingAppointment }
  } = useForm({ resolver: yupResolver(appointmentSchema) })

  const watchedDate = watch('preferredDate')

  useEffect(() => {
    if (!watchedDate) { setAvailability({ loading: false, takenSlots: [], fullyBooked: false }); return }
    let cancelled = false
    setAvailability(prev => ({ ...prev, loading: true }))
    getAppointmentAvailability(watchedDate)
      .then(res => {
        if (cancelled) return
        const taken = res.takenSlots || []
        setAvailability({ loading: false, takenSlots: taken, fullyBooked: taken.length >= 7 })
      })
      .catch(() => { if (!cancelled) setAvailability({ loading: false, takenSlots: [], fullyBooked: false }) })
    return () => { cancelled = true }
  }, [watchedDate])

  const onSubmitAppointment = async (data) => {
    try {
      setAppointmentStatus('loading'); setAppointmentError('')
      await submitAppointment(data)
      setAppointmentStatus('success')
      resetAppointment()
      setAvailability({ loading: false, takenSlots: [], fullyBooked: false })
      setTimeout(() => setAppointmentStatus(null), 5000)
    } catch (error) {
      setAppointmentStatus('error'); setAppointmentError(error.message || '')
      setTimeout(() => { setAppointmentStatus(null); setAppointmentError('') }, 6000)
    }
  }

  const processSteps = [
    { number: '01', title: t('about.pilotStep1Title', 'Apply Online'),     description: t('about.pilotStep1Desc', 'Complete our pilot application — no commitment required.'),              icon: FileText    },
    { number: '02', title: t('about.pilotStep2Title', 'Plan Your Pilot'),  description: t('about.pilotStep2Desc', 'We design a custom scope with the right zones and success metrics.'),   icon: Settings    },
    { number: '03', title: t('about.pilotStep3Title', 'Deploy in 5 Days'), description: t('about.pilotStep3Desc', 'White-glove installation and training with minimal IT involvement.'),  icon: Stethoscope },
    { number: '04', title: t('about.pilotStep4Title', 'See ROI in Days'),  description: t('about.pilotStep4Desc', 'Most facilities measure search-time reduction within the first week.'), icon: TrendingUp  },
  ]

  const [heroRef,    heroVisible]    = useScrollReveal(0.05)
  const [stepsRef,   stepsVisible]   = useScrollReveal(0.1)
  const [formRef,    formVisible]    = useScrollReveal(0.05)
  const [infoRef,    infoVisible]    = useScrollReveal(0.1)

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 80, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,217,166,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div
          ref={heroRef}
          style={{
            position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto', padding: '0 24px',
            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20, color: '#8898b4', fontSize: 13 }}>
            <Link to="/" style={{ color: '#8898b4', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#8898b4'}>{t('nav.home', 'Home')}</Link>
            <span>/</span>
            <span style={{ color: '#fff' }}>{t('contact.pageTitle', 'Contact')}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.25)', padding: '6px 16px', borderRadius: 100, marginBottom: 22 }}>
            <span className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d9a6', display: 'inline-block' }} />
            <span style={{ color: '#00d9a6', fontSize: 13, fontWeight: 600 }}>Book a Demo</span>
          </div>
          <h1 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 62px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
            {t('contact.pageTitle', 'Get in')}{' '}
            <span style={{ background: 'linear-gradient(95deg, #00d9a6, #0ab8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Touch
            </span>
          </h1>
          <p style={{ color: '#8898b4', fontSize: 18, lineHeight: 1.75, maxWidth: 540, margin: '0 auto' }}>
            {t('contact.freePilot', 'Schedule a free pilot consultation — zero commitment, measurable results in days.')}
          </p>
        </div>
      </section>

      {/* ── Process steps ──────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#070c19' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            ref={stepsRef}
            style={{
              textAlign: 'center', marginBottom: 60,
              opacity: stepsVisible ? 1 : 0, transform: stepsVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(10,184,255,0.08)', border: '1px solid rgba(10,184,255,0.22)', padding: '5px 16px', borderRadius: 100, marginBottom: 18 }}>
              <span style={{ color: '#0ab8ff', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>OUR PROCESS</span>
            </div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px, 3.5vw, 44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
              {t('contact.processTitle', 'How the Pilot Program Works')}
            </h2>
            <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              {t('contact.processSubtitle', 'From application to live system in under two weeks.')}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {processSteps.map((step, idx) => <StepCard key={step.number} step={step} idx={idx} />)}
          </div>
        </div>
      </section>

      {/* ── Form section ───────────────────────────────────── */}
      <section style={{ padding: '90px 0', background: '#0a0f1e' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            ref={formRef}
            style={{
              textAlign: 'center', marginBottom: 56,
              opacity: formVisible ? 1 : 0, transform: formVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.22)', padding: '5px 16px', borderRadius: 100, marginBottom: 18 }}>
              <span style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>FREE PILOT</span>
            </div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 'clamp(26px, 3.5vw, 44px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
              {t('contact.getInTouch', 'Schedule Your Free Pilot')}
            </h2>
            <p style={{ color: '#8898b4', fontSize: 17, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Fill out the form and our team will reach out within one business day.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="contact-form-grid">

            {/* Left: image + info */}
            <div>
              <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', marginBottom: 32 }}>
                <img src="/assets/images/choose.jpg" alt="Healthcare consultation" style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,30,0.6) 0%, rgba(10,15,30,0.15) 60%)' }} />
                {/* Glass overlay card */}
                <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(28,36,56,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,217,166,0.2)', borderRadius: 14, padding: '18px 20px' }}>
                  <div style={{ color: '#00d9a6', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>FOUNDING PARTNER BENEFITS</div>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      'Free 90-day hardware pilot',
                      'Deploy in 5 days, white-glove',
                      'Founding partner pricing for life',
                    ].map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#c8d5e8', fontSize: 13 }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#00d9a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div style={{ background: 'rgba(28,36,56,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '36px 32px' }}>
              <form onSubmit={handleSubmitAppointment(onSubmitAppointment)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Name + Patient type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="contact-row">
                  <div>
                    <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('contact.namePlaceholder', 'Name')} *</label>
                    <input type="text" placeholder={t('contact.namePlaceholder', 'Full name')} style={inputBase} onFocus={focusOn} onBlur={focusOff} {...registerAppointment('name')} />
                    {appointmentErrors.name && <p style={{ color: '#ff5e3a', fontSize: 12, marginTop: 4 }}>{appointmentErrors.name.message}</p>}
                  </div>
                  <div>
                    <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('contact.selectPatient', 'Facility type')}</label>
                    <select style={{ ...inputBase, appearance: 'none' }} onFocus={focusOn} onBlur={focusOff} {...registerAppointment('patientType')}>
                      <option value="">{t('contact.selectPatient', 'Select…')}</option>
                      <option value="new">{t('contact.newPatient', 'New inquiry')}</option>
                      <option value="existing">{t('contact.existingPatient', 'Existing partner')}</option>
                    </select>
                  </div>
                </div>

                {/* Email + Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="contact-row">
                  <div>
                    <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('contact.emailPlaceholder', 'Email')} *</label>
                    <input type="email" placeholder={t('contact.emailPlaceholder', 'you@hospital.org')} style={inputBase} onFocus={focusOn} onBlur={focusOff} {...registerAppointment('email')} />
                    {appointmentErrors.email && <p style={{ color: '#ff5e3a', fontSize: 12, marginTop: 4 }}>{appointmentErrors.email.message}</p>}
                  </div>
                  <div>
                    <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('contact.phonePlaceholder', 'Phone')}</label>
                    <input type="tel" placeholder={t('contact.phonePlaceholder', '(555) 000-0000')} style={inputBase} onFocus={focusOn} onBlur={focusOff} {...registerAppointment('phone')} />
                    {appointmentErrors.phone && <p style={{ color: '#ff5e3a', fontSize: 12, marginTop: 4 }}>{appointmentErrors.phone.message}</p>}
                  </div>
                </div>

                {/* Service + Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="contact-row">
                  <div>
                    <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('contact.selectService', 'Service')} *</label>
                    <select style={{ ...inputBase, appearance: 'none' }} onFocus={focusOn} onBlur={focusOff} {...registerAppointment('appointmentType')}>
                      <option value="">{t('contact.selectService', 'Select…')}</option>
                      <option value="Asset Tracking">{t('contact.services.assetTracking', 'Asset Tracking')}</option>
                      <option value="Site Monitoring">{t('contact.services.siteMonitoring', 'Site Monitoring')}</option>
                      <option value="Capital Planning">{t('contact.services.capitalPlanning', 'Capital Planning')}</option>
                      <option value="Mobile Security">{t('contact.services.mobileSecurity', 'Mobile Security')}</option>
                      <option value="Pilot Consultation">{t('contact.services.pilotConsultation', 'Pilot Consultation')}</option>
                    </select>
                    {appointmentErrors.appointmentType && <p style={{ color: '#ff5e3a', fontSize: 12, marginTop: 4 }}>{appointmentErrors.appointmentType.message}</p>}
                  </div>
                  <div>
                    <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Preferred Date *</label>
                    <input type="date" min={today} style={{ ...inputBase, colorScheme: 'dark' }} onFocus={focusOn} onBlur={focusOff} {...registerAppointment('preferredDate')} />
                    {appointmentErrors.preferredDate && <p style={{ color: '#ff5e3a', fontSize: 12, marginTop: 4 }}>{appointmentErrors.preferredDate.message}</p>}
                  </div>
                </div>

                {/* Time slot */}
                <div>
                  <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Time Slot</label>
                  {availability.fullyBooked ? (
                    <p style={{ color: '#f7c94b', fontSize: 13, fontWeight: 600 }}>No availability on this date — please select another.</p>
                  ) : (
                    <select style={{ ...inputBase, appearance: 'none', opacity: availability.loading ? 0.6 : 1 }} disabled={availability.loading} onFocus={focusOn} onBlur={focusOff} {...registerAppointment('preferredTime')}>
                      <option value="">{availability.loading ? 'Checking availability…' : t('contact.placeholders.preferredTime', 'Select a time slot')}</option>
                      {TIME_SLOTS.map(slot => {
                        const taken = availability.takenSlots.includes(slot)
                        return (
                          <option key={slot} value={slot} disabled={taken}>
                            {taken ? `${slot} — Unavailable` : slot}
                          </option>
                        )
                      })}
                    </select>
                  )}
                  {appointmentErrors.preferredTime && <p style={{ color: '#ff5e3a', fontSize: 12, marginTop: 4 }}>{appointmentErrors.preferredTime.message}</p>}
                </div>

                {/* Message */}
                <div>
                  <label style={{ color: '#8898b4', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('contact.commentPlaceholder', 'Message')}</label>
                  <textarea rows={4} placeholder={t('contact.commentPlaceholder', 'Tell us about your facility and goals…')} style={{ ...inputBase, resize: 'vertical', lineHeight: 1.65 }} onFocus={focusOn} onBlur={focusOff} {...registerAppointment('message')} />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmittingAppointment || appointmentStatus === 'loading'}
                  style={{ background: '#00d9a6', color: '#0a0f1e', border: 'none', borderRadius: 10, padding: '13px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s', opacity: (isSubmittingAppointment || appointmentStatus === 'loading') ? 0.6 : 1, marginTop: 4 }}
                  onMouseEnter={e => { if (appointmentStatus !== 'loading' && !isSubmittingAppointment) { e.target.style.background = '#00c49a'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(0,217,166,0.25)' } }}
                  onMouseLeave={e => { e.target.style.background = '#00d9a6'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none' }}
                >
                  {(isSubmittingAppointment || appointmentStatus === 'loading') ? t('contact.sending', 'Sending…') : t('contact.sendRequest', 'Send Request')}
                </button>

                {appointmentStatus === 'success' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(0,217,166,0.08)', border: '1px solid rgba(0,217,166,0.25)', borderRadius: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <circle cx="9" cy="9" r="8" stroke="#00d9a6" strokeWidth="1.5" />
                      <path d="M5.5 9L7.5 11L12.5 6.5" stroke="#00d9a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p style={{ color: '#00d9a6', fontSize: 13, fontWeight: 600 }}>{t('contact.successMsg', 'Request received! We will be in touch within one business day.')}</p>
                  </div>
                )}
                {appointmentStatus === 'error' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(255,94,58,0.08)', border: '1px solid rgba(255,94,58,0.25)', borderRadius: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <circle cx="9" cy="9" r="8" stroke="#ff5e3a" strokeWidth="1.5" />
                      <path d="M9 5.5V9.5" stroke="#ff5e3a" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="9" cy="12" r="0.8" fill="#ff5e3a" />
                    </svg>
                    <p style={{ color: '#ff5e3a', fontSize: 13 }}>{appointmentError || t('contact.errorMsg', 'Something went wrong. Please try again.')}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ─────────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
          <iframe
            src="https://maps.google.com/maps?q=7710+Hazard+Center+Dr,+San+Diego,+CA+92108&t=m&z=15&output=embed&iwloc=near"
            width="100%" height="340"
            style={{ border: 0, display: 'block', filter: 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="InSite Health Systems Location"
          />
        </div>
      </section>

      {/* ── Contact info strip ──────────────────────────────── */}
      <section style={{ padding: '60px 0 80px', background: '#070c19', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div
          ref={infoRef}
          style={{
            maxWidth: 1100, margin: '0 auto', padding: '0 24px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16,
            opacity: infoVisible ? 1 : 0, transform: infoVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
          }}
        >
          <InfoCard Icon={Phone}  label={t('contact.infoPhone',   'Phone')}   color="#0ab8ff" rgb="10,184,255">(858) 366-3838</InfoCard>
          <InfoCard Icon={Mail}   label={t('contact.infoEmail',   'Email')}   color="#00d9a6" rgb="0,217,166">info@insitehealthsystems.com</InfoCard>
          <InfoCard Icon={MapPin} label={t('contact.infoAddress', 'Address')} color="#f7c94b" rgb="247,201,75">2287 Dunlop St.<br />San Diego, CA 92111</InfoCard>
          <InfoCard Icon={Clock}  label={t('contact.infoHours',   'Hours')}   color="#ff5e3a" rgb="255,94,58">
            {t('contact.contactDetails.businessHours', 'Mon–Fri 9am–5pm')}<br />
            {t('contact.contactDetails.emergencySupport', '24/7 emergency support')}
          </InfoCard>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){
          .contact-form-grid{grid-template-columns:1fr!important;}
          .contact-row{grid-template-columns:1fr!important;}
        }
        select option { background: #0e1528; color: #fff; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.5); cursor: pointer; }
        input::placeholder, textarea::placeholder { color: #4a5a72; }
      `}</style>
    </div>
  )
}

export default ContactPage
