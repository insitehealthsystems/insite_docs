import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, User, Mail, Phone, AlertTriangle, Plus, Trash2, ChevronRight, Check, ArrowLeft } from 'lucide-react'

/* ─────────────────────────────────────────────────────────
   STATIC DATA
   ───────────────────────────────────────────────────────── */
const EQUIPMENT_CATEGORIES = [
  {
    id: 'mobility', label: 'Mobility & Patient Support', icon: '🚑', recommended: true,
    owningDept: 'Nursing / Facilities', defaultQty: 15,
    items: ['Wheelchairs','Transport chairs','Stretchers / gurneys','Bariatric wheelchairs','Patient lifts (Hoyer lifts)','Slings','Bassinets'],
  },
  {
    id: 'infusion', label: 'Infusion & Monitoring', icon: '💉', recommended: true,
    owningDept: 'Biomed', defaultQty: 8,
    items: ['IV pumps','PCA pumps','Feeding pumps (enteral)','Syringe pumps','Vital sign monitors','Telemetry units','Portable ECG machines'],
  },
  {
    id: 'respiratory', label: 'Respiratory & Critical Care', icon: '🫁', recommended: true,
    owningDept: 'Respiratory / ICU', defaultQty: 5,
    items: ['Ventilators','BiPAP / CPAP machines','Oxygen concentrators','Oxygen tanks','Respiratory therapy carts','ECMO support equipment','Dialysis machines','Anesthesia carts'],
  },
  {
    id: 'imaging', label: 'Portable Imaging & Diagnostics', icon: '🩻', recommended: false,
    owningDept: 'Radiology', defaultQty: 3,
    items: ['Portable X-ray machines','Portable ultrasound units','Point-of-care analyzers'],
  },
  {
    id: 'surgical', label: 'Surgical & Procedural', icon: '🔬', recommended: false,
    owningDept: 'OR / Periop', defaultQty: 2,
    items: ['Electrosurgical units','Laparoscopic towers','Surgical lights','C-arms (mobile fluoroscopy)'],
  },
  {
    id: 'it', label: 'IT & Communication', icon: '💻', recommended: false,
    owningDept: 'IT / Nursing', defaultQty: 10,
    items: ['Workstations on wheels (WOWs)','Medication dispensing carts','Laptops / tablets','Portable printers','Communication devices'],
  },
]

const CRITERIA_FIELDS = [
  { key: 'highMobility',   label: 'High Mobility' },
  { key: 'frequentSearch', label: 'Frequent Search' },
  { key: 'highValue',      label: 'High Value ($)' },
  { key: 'patientSafety',  label: 'Patient Safety' },
  { key: 'scarcity',       label: 'Scarcity Issues' },
]

const buildInitialCheckedItems = () => {
  const out = {}
  EQUIPMENT_CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => { out[item] = { checked: false, qty: cat.defaultQty } })
  })
  return out
}

const buildInitialCriteria = () => {
  const out = {}
  EQUIPMENT_CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      out[item] = { highMobility: false, frequentSearch: false, highValue: false, patientSafety: false, scarcity: false }
    })
  })
  return out
}

const buildInitialStakeholders = () => {
  const out = {}
  EQUIPMENT_CATEGORIES.forEach((cat) => { cat.items.forEach((item) => { out[item] = '' }) })
  return out
}

/* ─────────────────────────────────────────────────────────
   STEP CONFIG
   ───────────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Contact',     icon: '👤', description: 'Facility & contact details' },
  { id: 2, label: 'Facility',    icon: '🏥', description: 'Buildings, floors & zones'  },
  { id: 3, label: 'Equipment',   icon: '🔧', description: 'Asset types & quantities'   },
  { id: 4, label: 'Criteria',    icon: '📊', description: 'Priority scoring'            },
  { id: 5, label: 'Stakeholders',icon: '🤝', description: 'Team assignments'            },
  { id: 6, label: 'Finalize',    icon: '✅', description: 'Details & submit'           },
]

/* ─────────────────────────────────────────────────────────
   SHARED STYLES
   ───────────────────────────────────────────────────────── */
const inp = {
  width: '100%', background: 'rgba(10,15,30,0.7)', border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14,
  fontFamily: 'DM Sans, Outfit, sans-serif', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}
const focusOn  = (e) => { e.target.style.borderColor = '#00d9a6'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,166,0.12)' }
const focusOff = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none' }

const card = {
  background: 'rgba(28,36,56,0.55)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16, overflow: 'hidden',
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────── */
export default function PilotSetup() {
  const [step, setStep]   = useState(1)
  const [dir, setDir]     = useState(1)   // 1 = forward, -1 = backward
  const [animating, setAnimating] = useState(false)
  const [stepError, setStepError] = useState(null)
  const contentRef = useRef(null)

  /* ── Form state ─────────────────────────────────────────── */
  const [contact, setContact] = useState({ hospitalName:'', contactName:'', contactEmail:'', contactPhone:'' })
  const [buildings, setBuildings] = useState([{ id: 0, name: '', floors: [{ id: 0, name: '', zones: [''] }] }])
  const [checkedItems, setCheckedItems] = useState(buildInitialCheckedItems)
  const [criteria, setCriteria] = useState(buildInitialCriteria)
  const [stakeholders, setStakeholders] = useState(buildInitialStakeholders)
  const [signoffs, setSignoffs] = useState({ pilotUnit:'', installationDate:'', notes:'' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  /* ── Derived ─────────────────────────────────────────────── */
  const selectedItems = Object.entries(checkedItems).filter(([,v]) => v.checked).map(([k]) => k)
  const totalAssets = Object.values(checkedItems).filter(v => v.checked).reduce((s, v) => s + (Number(v.qty)||0), 0)
  const totalZoneCount = buildings.reduce((s, b) => s + b.floors.reduce((fs, f) => fs + f.zones.filter(z => z.trim() !== '').length, 0), 0)
  const owningDeptFor = (item) => { for (const c of EQUIPMENT_CATEGORIES) { if (c.items.includes(item)) return c.owningDept } return '' }
  const criteriaScore = (item) => Object.values(criteria[item]).filter(Boolean).length

  /* ── Navigation ──────────────────────────────────────────── */
  const validateStep = (s) => {
    if (s === 1) {
      if (!contact.hospitalName.trim()) return 'Please enter your hospital / facility name.'
      if (!contact.contactName.trim())  return 'Please enter your contact name.'
      if (!contact.contactEmail.trim()) return 'Please enter your contact email.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.contactEmail)) return 'Please enter a valid email address.'
    }
    if (s === 2) {
      if (!buildings.some(b => b.name.trim())) return 'Please name at least one building.'
      if (!buildings.some(b => b.floors.some(f => f.zones.some(z => z.trim())))) return 'Please add at least one named zone.'
    }
    if (s === 3) {
      if (selectedItems.length === 0) return 'Please select at least one asset type.'
    }
    return null
  }

  const goTo = (target) => {
    if (animating) return
    const d = target > step ? 1 : -1
    setDir(d)
    const err = d === 1 ? validateStep(step) : null
    if (err) { setStepError(err); return }
    setStepError(null)
    setAnimating(true)
    setTimeout(() => {
      setStep(target)
      setAnimating(false)
      if (contentRef.current) contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 280)
  }

  const isStepDone = (s) => {
    if (s === 1) return !!(contact.hospitalName && contact.contactName && contact.contactEmail)
    if (s === 2) return buildings.some(b => b.name.trim()) && totalZoneCount > 0
    if (s === 3) return selectedItems.length > 0
    if (s === 4) return true // optional
    if (s === 5) return true // optional
    return false
  }

  /* ── Building / floor / zone handlers ───────────────────── */
  const addBuilding = () => setBuildings(p => [...p, { id: Date.now(), name:'', floors:[{ id: Date.now()+1, name:'', zones:[''] }] }])
  const removeBuilding = (id) => setBuildings(p => p.filter(b => b.id !== id))
  const updateBuildingName = (id, name) => setBuildings(p => p.map(b => b.id===id ? {...b, name} : b))
  const addFloor = (bId) => setBuildings(p => p.map(b => b.id===bId ? {...b, floors:[...b.floors,{id:Date.now(),name:'',zones:['']}]} : b))
  const removeFloor = (bId, fId) => setBuildings(p => p.map(b => b.id===bId ? {...b, floors:b.floors.filter(f=>f.id!==fId)} : b))
  const updateFloorName = (bId, fId, name) => setBuildings(p => p.map(b => b.id===bId ? {...b, floors:b.floors.map(f => f.id===fId ? {...f,name} : f)} : b))
  const addZone = (bId, fId) => setBuildings(p => p.map(b => b.id===bId ? {...b, floors:b.floors.map(f => f.id===fId ? {...f,zones:[...f.zones,'']} : f)} : b))
  const removeZone = (bId, fId, zi) => setBuildings(p => p.map(b => b.id===bId ? {...b, floors:b.floors.map(f => f.id===fId ? {...f,zones:f.zones.filter((_,i)=>i!==zi)} : f)} : b))
  const updateZone = (bId, fId, zi, val) => setBuildings(p => p.map(b => b.id===bId ? {...b, floors:b.floors.map(f => f.id===fId ? {...f,zones:f.zones.map((z,i)=>i===zi?val:z)} : f)} : b))

  /* ── Equipment handlers ──────────────────────────────────── */
  const handleCheckItem = (item, defQty) => setCheckedItems(p => ({ ...p, [item]: { checked:!p[item].checked, qty:p[item].qty||defQty } }))
  const handleQty = (item, v) => setCheckedItems(p => ({ ...p, [item]: { ...p[item], qty:Math.max(1,parseInt(v,10)||1) } }))
  const handleCriteria = (item, field) => setCriteria(p => ({ ...p, [item]: { ...p[item], [field]:!p[item][field] } }))
  const handleStakeholder = (item, v) => setStakeholders(p => ({ ...p, [item]:v }))
  const handleSignoff = (e) => setSignoffs(p => ({ ...p, [e.target.name]:e.target.value }))
  const handleContact = (e) => setContact(p => ({ ...p, [e.target.name]:e.target.value }))

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = async () => {
    setSubmitError(null)
    setLoading(true)
    const quantities = {}
    selectedItems.forEach(item => { quantities[item] = checkedItems[item].qty })
    const payload = {
      hospitalName: contact.hospitalName.trim(),
      contactName: contact.contactName.trim(),
      contactEmail: contact.contactEmail.trim(),
      contactPhone: contact.contactPhone.trim(),
      facilityStructure: buildings,
      selectedEquipment: selectedItems,
      quantities,
      criteria: selectedItems.map(item => ({ device: item, ...criteria[item] })),
      stakeholders: selectedItems.map(item => ({ device: item, department: owningDeptFor(item), stakeholder: stakeholders[item] })),
      pilotUnit: signoffs.pilotUnit.trim(),
      installationDate: signoffs.installationDate,
      notes: signoffs.notes.trim(),
    }
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
      const res = await fetch(`${base}/api/pilot/submit`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload),
      })
      if (!res.ok) { const d = await res.json().catch(()=>({})); throw new Error(d.message||`Server error ${res.status}`) }
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message||'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  /* ─────────────────────────────────────────────────────────
     SUCCESS SCREEN
     ───────────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div style={{ minHeight:'100vh', background:'#0a0f1e', display:'flex', alignItems:'center', justifyContent:'center', padding:'96px 24px 48px' }}>
        <div style={{ maxWidth:540, width:'100%', textAlign:'center', background:'rgba(28,36,56,0.7)', border:'1px solid rgba(0,217,166,0.2)', borderRadius:24, padding:'56px 40px', backdropFilter:'blur(20px)' }}>
          {/* Animated checkmark */}
          <div style={{ width:88, height:88, borderRadius:'50%', background:'rgba(0,217,166,0.12)', border:'2px solid rgba(0,217,166,0.35)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M8 18l7 7 13-14" stroke="#00d9a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray:40, strokeDashoffset:0 }} />
            </svg>
          </div>
          <h1 style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontWeight:800, fontSize:34, color:'#fff', marginBottom:12, letterSpacing:'-0.03em' }}>
            Submission Received!
          </h1>
          <p style={{ color:'#8898b4', fontSize:16, marginBottom:8, lineHeight:1.7 }}>
            Thank you, <span style={{ color:'#00d9a6', fontWeight:700 }}>{contact.contactName}</span>.
          </p>
          <p style={{ color:'#8898b4', fontSize:15, marginBottom:36, lineHeight:1.7 }}>
            We'll be in touch within <strong style={{ color:'#fff' }}>1 business day</strong> to begin your pilot at <strong style={{ color:'#fff' }}>{contact.hospitalName}</strong>.
          </p>
          {/* Stats summary */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:36 }}>
            {[
              { label:'Assets', value:totalAssets, color:'#00d9a6' },
              { label:'Zones', value:totalZoneCount, color:'#0ab8ff' },
              { label:'Equipment Types', value:selectedItems.length, color:'#f7c94b' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background:'rgba(255,255,255,0.04)', borderRadius:12, padding:'16px 10px', textAlign:'center' }}>
                <div style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontWeight:800, fontSize:28, color, lineHeight:1 }}>{value}</div>
                <div style={{ color:'#8898b4', fontSize:12, marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, background:'#00d9a6', color:'#0a0f1e', textDecoration:'none', fontWeight:700, fontSize:15, padding:'14px 32px', borderRadius:10, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='#00c49a'; e.currentTarget.style.transform='translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background='#00d9a6'; e.currentTarget.style.transform='translateY(0)' }}>
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  /* ─────────────────────────────────────────────────────────
     STEP PANELS
     ───────────────────────────────────────────────────────── */
  const renderStep = () => {
    switch (step) {
      case 1: return <StepContact contact={contact} handleContact={handleContact} />
      case 2: return <StepFacility buildings={buildings} totalZoneCount={totalZoneCount}
        addBuilding={addBuilding} removeBuilding={removeBuilding} updateBuildingName={updateBuildingName}
        addFloor={addFloor} removeFloor={removeFloor} updateFloorName={updateFloorName}
        addZone={addZone} removeZone={removeZone} updateZone={updateZone} />
      case 3: return <StepEquipment checkedItems={checkedItems} totalAssets={totalAssets}
        handleCheckItem={handleCheckItem} handleQty={handleQty} />
      case 4: return <StepCriteria selectedItems={selectedItems} criteria={criteria} handleCriteria={handleCriteria} criteriaScore={criteriaScore} />
      case 5: return <StepStakeholders selectedItems={selectedItems} stakeholders={stakeholders} owningDeptFor={owningDeptFor} handleStakeholder={handleStakeholder} />
      case 6: return <StepFinalize signoffs={signoffs} handleSignoff={handleSignoff}
        contact={contact} totalAssets={totalAssets} totalZoneCount={totalZoneCount}
        selectedItems={selectedItems} submitError={submitError} loading={loading} onSubmit={handleSubmit} />
      default: return null
    }
  }

  /* ─────────────────────────────────────────────────────────
     RENDER
     ───────────────────────────────────────────────────────── */
  return (
    <div style={{ background:'#0a0f1e', minHeight:'100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ paddingTop:110, paddingBottom:52, position:'relative', overflow:'hidden', textAlign:'center' }}>
        <div className="grid-bg" style={{ position:'absolute', inset:0, zIndex:0 }} />
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:360, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(0,217,166,0.09) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:680, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,217,166,0.1)', border:'1px solid rgba(0,217,166,0.25)', padding:'5px 16px', borderRadius:100, marginBottom:18 }}>
            <span className="animate-pulse-dot" style={{ width:7, height:7, borderRadius:'50%', background:'#00d9a6', display:'inline-block' }} />
            <span style={{ color:'#00d9a6', fontSize:12, fontWeight:700, letterSpacing:'0.05em' }}>PILOT SETUP — 6 STEPS</span>
          </div>
          <h1 style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontWeight:800, fontSize:'clamp(34px,5vw,58px)', color:'#fff', letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:16 }}>
            Configure Your Pilot
          </h1>
          <p style={{ color:'#8898b4', fontSize:17, lineHeight:1.7, maxWidth:520, margin:'0 auto' }}>
            Walk through six quick steps to tell us exactly what you need. We'll follow up within 1 business day.
          </p>
        </div>
      </section>

      {/* ── Step progress bar ─────────────────────────────────── */}
      <div style={{ maxWidth:860, margin:'0 auto', padding:'0 24px 0' }}>
        <StepProgressBar step={step} steps={STEPS} isStepDone={isStepDone} goTo={goTo} />
      </div>

      {/* ── Step content ─────────────────────────────────────── */}
      <div ref={contentRef} style={{ maxWidth:860, margin:'0 auto', padding:'0 24px 100px' }}>

        {/* Animated panel */}
        <div style={{
          opacity: animating ? 0 : 1,
          transform: animating ? `translateX(${dir > 0 ? '32px' : '-32px'})` : 'translateX(0)',
          transition: 'opacity 0.28s ease, transform 0.28s ease',
        }}>
          {/* Step label */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
            <div style={{
              width:40, height:40, borderRadius:'50%',
              background:'rgba(0,217,166,0.15)', border:'2px solid rgba(0,217,166,0.4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Bricolage Grotesque, sans-serif', fontWeight:800, color:'#00d9a6', fontSize:16,
            }}>{step}</div>
            <div>
              <div style={{ color:'#00d9a6', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>
                Step {step} of {STEPS.length}
              </div>
              <div style={{ color:'#fff', fontFamily:'Bricolage Grotesque, sans-serif', fontWeight:700, fontSize:22, lineHeight:1.2 }}>
                {STEPS[step-1].label}
              </div>
            </div>
            {/* Progress fraction */}
            <div style={{ marginLeft:'auto', textAlign:'right' }}>
              <div style={{ color:'#8898b4', fontSize:12, marginBottom:4 }}>{Math.round(((step-1)/STEPS.length)*100)}% complete</div>
              <div style={{ width:120, height:4, background:'rgba(255,255,255,0.07)', borderRadius:4, overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:4, background:'linear-gradient(90deg,#00d9a6,#0ab8ff)', width:`${((step-1)/STEPS.length)*100}%`, transition:'width 0.4s ease' }} />
              </div>
            </div>
          </div>

          {/* Step error */}
          {stepError && (
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,94,58,0.08)', border:'1px solid rgba(255,94,58,0.25)', borderRadius:12, padding:'12px 16px', marginBottom:24 }}>
              <AlertTriangle size={15} color="#ff5e3a" />
              <p style={{ color:'#ff5e3a', fontSize:14, margin:0 }}>{stepError}</p>
            </div>
          )}

          {/* Panel */}
          {renderStep()}

          {/* Navigation */}
          <StepNav
            step={step} totalSteps={STEPS.length}
            onBack={() => goTo(step - 1)}
            onNext={() => goTo(step + 1)}
            loading={loading}
          />
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.5); }
        input::placeholder, textarea::placeholder { color: #4a5568; }
        @media (max-width: 640px) { .pilot-contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 700px) { .pilot-stepbar-labels { display: none !important; } }
        @media (max-width: 860px) { .criteria-table th, .criteria-table td { padding: 10px 8px !important; } }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STEP PROGRESS BAR
   ───────────────────────────────────────────────────────── */
function StepProgressBar({ step, steps, isStepDone, goTo }) {
  return (
    <div style={{ position:'relative', marginBottom:36 }}>
      {/* Connector line */}
      <div style={{ position:'absolute', top:20, left:'calc(50%/6)', right:'calc(50%/6)', height:2, background:'rgba(255,255,255,0.07)', zIndex:0 }} />
      <div style={{ position:'absolute', top:20, left:'calc(50%/6)', height:2, background:'linear-gradient(90deg,#00d9a6,#0ab8ff)', zIndex:1, transition:'width 0.5s ease', width:`${((step-1)/(steps.length-1))*100}%`, maxWidth:'calc(100% - calc(100%/6))' }} />

      <div style={{ display:'flex', justifyContent:'space-between', position:'relative', zIndex:2 }}>
        {steps.map((s, idx) => {
          const isActive = step === s.id
          const isDone   = step > s.id
          const isReachable = s.id <= step || isStepDone(step)
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => isReachable && s.id !== step && goTo(s.id)}
              disabled={!isReachable || s.id === step}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, background:'none', border:'none', cursor: isReachable && s.id !== step ? 'pointer' : 'default', padding:'4px 0', minWidth:0 }}
            >
              <div style={{
                width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:isDone ? 14 : 16, fontWeight:700, transition:'all 0.3s',
                background: isDone ? '#00d9a6' : isActive ? 'rgba(0,217,166,0.15)' : 'rgba(28,36,56,0.9)',
                border: `2px solid ${isDone ? '#00d9a6' : isActive ? '#00d9a6' : 'rgba(255,255,255,0.12)'}`,
                boxShadow: isActive ? '0 0 0 4px rgba(0,217,166,0.15)' : 'none',
                color: isDone ? '#0a0f1e' : isActive ? '#00d9a6' : '#8898b4',
              }}>
                {isDone ? <Check size={16} strokeWidth={3} /> : <span>{s.icon}</span>}
              </div>
              <div className="pilot-stepbar-labels" style={{ textAlign:'center' }}>
                <div style={{ fontSize:11, fontWeight:700, color: isActive ? '#00d9a6' : isDone ? '#fff' : '#8898b4', transition:'color 0.3s', whiteSpace:'nowrap' }}>
                  {s.label}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STEP NAV (back / next / submit)
   ───────────────────────────────────────────────────────── */
function StepNav({ step, totalSteps, onBack, onNext, loading }) {
  const isLast = step === totalSteps
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent: step === 1 ? 'flex-end' : 'space-between', gap:16, marginTop:36, paddingTop:28, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      {step > 1 && (
        <button type="button" onClick={onBack}
          style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 24px', color:'#8898b4', fontWeight:600, fontSize:14, cursor:'pointer', fontFamily:'DM Sans, Outfit, sans-serif', transition:'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#8898b4' }}>
          <ArrowLeft size={15} /> Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        style={{
          display:'inline-flex', alignItems:'center', gap:8,
          background: isLast ? '#00d9a6' : 'rgba(0,217,166,0.12)',
          border:`1px solid ${isLast ? '#00d9a6' : 'rgba(0,217,166,0.35)'}`,
          borderRadius:10, padding:`12px ${isLast ? '32px' : '24px'}`,
          color: isLast ? '#0a0f1e' : '#00d9a6',
          fontWeight:700, fontSize:15, cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily:'DM Sans, Outfit, sans-serif', transition:'all 0.2s',
          boxShadow: isLast ? '0 4px 20px rgba(0,217,166,0.25)' : 'none',
        }}
        onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 24px rgba(0,217,166,${isLast?'0.35':'0.15'})` }}}
        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=isLast?'0 4px 20px rgba(0,217,166,0.25)':'none' }}>
        {loading ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Submitting…
          </>
        ) : isLast ? (
          <>Submit Pilot Survey <ChevronRight size={16} /></>
        ) : (
          <>Continue <ChevronRight size={16} /></>
        )}
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STEP 1 — CONTACT
   ───────────────────────────────────────────────────────── */
function StepContact({ contact, handleContact }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Tip banner */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, background:'rgba(247,201,75,0.07)', border:'1px solid rgba(247,201,75,0.2)', borderRadius:12, padding:'14px 16px' }}>
        <AlertTriangle size={15} color="#f7c94b" style={{ flexShrink:0, marginTop:1 }} />
        <p style={{ color:'#f7c94b', fontSize:13, margin:0, lineHeight:1.65 }}>
          <strong>Best Practice:</strong> Start with wheelchairs + IV pumps + 1 high-value device for the most impactful first pilot.
        </p>
      </div>

      <div style={{ ...card, padding:28 }}>
        <p style={{ color:'#8898b4', fontSize:14, marginBottom:24, lineHeight:1.6 }}>
          Tell us about your facility and who we should follow up with after reviewing your pilot setup.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }} className="pilot-contact-grid">
          {[
            { id:'hospitalName', label:'Hospital / Facility Name', placeholder:"e.g. St. Mary's Medical Center", type:'text', required:true, Icon:Building2 },
            { id:'contactName',  label:'Contact Name',              placeholder:'e.g. Jane Doe',              type:'text', required:true, Icon:User     },
            { id:'contactEmail', label:'Contact Email',             placeholder:'jane@hospital.org',           type:'email', required:true, Icon:Mail  },
            { id:'contactPhone', label:'Contact Phone',             placeholder:'(555) 000-0000',              type:'tel', required:false, Icon:Phone  },
          ].map(({ id, label, placeholder, type, required, Icon }) => (
            <div key={id} style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label htmlFor={id} style={{ display:'flex', alignItems:'center', gap:6, color:'#8898b4', fontSize:13, fontWeight:600 }}>
                <Icon size={13} color="#00d9a6" />
                {label}
                {required
                  ? <span style={{ color:'#ff5e3a', marginLeft:2 }}>*</span>
                  : <span style={{ color:'#4a5568', fontSize:11, marginLeft:4 }}>optional</span>}
              </label>
              <input id={id} name={id} type={type} required={required} value={contact[id]} onChange={handleContact} placeholder={placeholder}
                style={inp} onFocus={focusOn} onBlur={focusOff} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STEP 2 — FACILITY STRUCTURE
   ───────────────────────────────────────────────────────── */
function StepFacility({ buildings, totalZoneCount, addBuilding, removeBuilding, updateBuildingName, addFloor, removeFloor, updateFloorName, addZone, removeZone, updateZone }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Scope guidance */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, background:'rgba(10,184,255,0.06)', border:'1px solid rgba(10,184,255,0.18)', borderRadius:12, padding:'14px 16px' }}>
        <svg style={{ width:15, height:15, color:'#0ab8ff', flexShrink:0, marginTop:2 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        <div>
          <p style={{ color:'#0ab8ff', fontSize:13, fontWeight:700, margin:'0 0 3px' }}>Recommended Pilot Scope</p>
          <p style={{ color:'rgba(10,184,255,0.8)', fontSize:13, lineHeight:1.65, margin:0 }}>
            Cover <strong>10–15 key zones</strong> and tag <strong>30–50 high-use assets</strong> for the optimal first pilot.
            {totalZoneCount > 0 && (
              <span style={{ display:'inline-block', marginLeft:8, fontWeight:700, color: totalZoneCount>=10 && totalZoneCount<=15 ? '#00d9a6' : totalZoneCount<10 ? '#f7c94b' : '#ff5e3a' }}>
                {totalZoneCount} zone{totalZoneCount!==1?'s':''} defined
                {totalZoneCount<10 && ' — aim for at least 10'}
                {totalZoneCount>15 && ' — consider narrowing scope'}
                {totalZoneCount>=10 && totalZoneCount<=15 && ' ✓'}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Buildings */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {buildings.map((building, bIdx) => (
          <div key={building.id} style={card}>
            {/* Building header */}
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.2)' }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'rgba(0,217,166,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Building2 size={13} color="#00d9a6" />
              </div>
              <span style={{ color:'#8898b4', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', flexShrink:0 }}>Building {bIdx+1}</span>
              <input type="text" value={building.name} onChange={e => updateBuildingName(building.id, e.target.value)} placeholder="Building name (e.g. Main Tower)"
                style={{ ...inp, padding:'8px 12px', flex:1 }} onFocus={focusOn} onBlur={focusOff} />
              {buildings.length > 1 && (
                <button type="button" onClick={() => removeBuilding(building.id)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'#8898b4', padding:4, flexShrink:0, transition:'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color='#ff5e3a'}
                  onMouseLeave={e => e.currentTarget.style.color='#8898b4'}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Floors */}
            {building.floors.map((floor, fIdx) => (
              <div key={floor.id} style={{ padding:'13px 18px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <span style={{ color:'#8898b4', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', flexShrink:0, minWidth:52 }}>Floor {fIdx+1}</span>
                  <input type="text" value={floor.name} onChange={e => updateFloorName(building.id, floor.id, e.target.value)} placeholder="Floor name (e.g. 3rd Floor)"
                    style={{ ...inp, padding:'7px 12px', flex:1 }} onFocus={focusOn} onBlur={focusOff} />
                  {building.floors.length > 1 && (
                    <button type="button" onClick={() => removeFloor(building.id, floor.id)}
                      style={{ background:'none', border:'none', cursor:'pointer', color:'#8898b4', padding:4, transition:'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color='#ff5e3a'}
                      onMouseLeave={e => e.currentTarget.style.color='#8898b4'}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                {/* Zones */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, paddingLeft:62 }}>
                  {floor.zones.map((zone, zIdx) => (
                    <div key={zIdx} style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(0,217,166,0.08)', border:'1px solid rgba(0,217,166,0.18)', borderRadius:100, paddingLeft:12, paddingRight:6, paddingTop:5, paddingBottom:5 }}>
                      <input type="text" value={zone} onChange={e => updateZone(building.id, floor.id, zIdx, e.target.value)} placeholder={`Zone ${zIdx+1}`}
                        style={{ fontSize:12, color:'#d0d9e8', background:'transparent', border:'none', outline:'none', width:80, fontFamily:'DM Sans, Outfit, sans-serif' }} />
                      {floor.zones.length > 1 && (
                        <button type="button" onClick={() => removeZone(building.id, floor.id, zIdx)}
                          style={{ background:'none', border:'none', cursor:'pointer', color:'#8898b4', padding:2, transition:'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color='#ff5e3a'}
                          onMouseLeave={e => e.currentTarget.style.color='#8898b4'}>
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addZone(building.id, floor.id)}
                    style={{ display:'inline-flex', alignItems:'center', gap:4, background:'none', border:'1px dashed rgba(0,217,166,0.3)', borderRadius:100, padding:'5px 12px', cursor:'pointer', color:'#00d9a6', fontSize:12, fontWeight:600, transition:'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='#00d9a6'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='rgba(0,217,166,0.3)'}>
                    <Plus size={11} /> Add Zone
                  </button>
                </div>
              </div>
            ))}

            <div style={{ padding:'11px 18px', borderTop:'1px solid rgba(255,255,255,0.04)', background:'rgba(0,0,0,0.12)' }}>
              <button type="button" onClick={() => addFloor(building.id)}
                style={{ background:'none', border:'none', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, color:'#00d9a6', fontSize:13, fontWeight:600, transition:'opacity 0.2s', padding:0 }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                <Plus size={13} /> Add Floor
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addBuilding}
        style={{ display:'inline-flex', alignItems:'center', gap:8, background:'none', border:'2px dashed rgba(0,217,166,0.25)', borderRadius:12, padding:'11px 20px', cursor:'pointer', color:'#00d9a6', fontSize:14, fontWeight:600, transition:'border-color 0.2s', alignSelf:'flex-start' }}
        onMouseEnter={e => e.currentTarget.style.borderColor='rgba(0,217,166,0.55)'}
        onMouseLeave={e => e.currentTarget.style.borderColor='rgba(0,217,166,0.25)'}>
        <Plus size={15} /> Add Building
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STEP 3 — EQUIPMENT SELECTION
   ───────────────────────────────────────────────────────── */
function StepEquipment({ checkedItems, totalAssets, handleCheckItem, handleQty }) {
  const assetColor = totalAssets === 0 ? '#ff5e3a' : totalAssets >= 30 && totalAssets <= 50 ? '#00d9a6' : '#0ab8ff'
  const assetBg    = totalAssets === 0 ? 'rgba(255,94,58,0.1)' : totalAssets >= 30 && totalAssets <= 50 ? 'rgba(0,217,166,0.1)' : 'rgba(10,184,255,0.1)'

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Running total */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:assetBg, border:`1px solid ${assetColor}40`, borderRadius:14, padding:'14px 20px' }}>
        <div>
          <div style={{ color:'#8898b4', fontSize:13 }}>Check each device type you want to track. Adjust quantities as needed.</div>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontWeight:800, fontSize:28, color:assetColor, lineHeight:1 }}>{totalAssets}</div>
          <div style={{ color:assetColor, fontSize:12, fontWeight:600 }}>asset{totalAssets!==1?'s':''} selected</div>
        </div>
      </div>

      {EQUIPMENT_CATEGORIES.map((cat) => {
        const selectedCount = cat.items.filter(item => checkedItems[item]?.checked).length
        return (
          <div key={cat.id} style={card}>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', padding:'13px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize:20 }}>{cat.icon}</span>
              <span style={{ color:'#fff', fontWeight:700, fontSize:15 }}>{cat.label}</span>
              <span style={{ color:'#8898b4', fontSize:12 }}>— {cat.owningDept}</span>
              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
                {selectedCount > 0 && (
                  <span style={{ background:'rgba(0,217,166,0.12)', border:'1px solid rgba(0,217,166,0.2)', color:'#00d9a6', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100 }}>
                    {selectedCount} selected
                  </span>
                )}
                {cat.recommended && (
                  <span style={{ background:'rgba(247,201,75,0.1)', border:'1px solid rgba(247,201,75,0.2)', color:'#f7c94b', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100 }}>
                    ★ Recommended
                  </span>
                )}
              </div>
            </div>
            <ul style={{ listStyle:'none', padding:0, margin:0 }}>
              {cat.items.map((item, iIdx) => {
                const state = checkedItems[item]
                return (
                  <li key={item} style={{
                    display:'flex', alignItems:'center', gap:14, padding:'11px 18px',
                    borderBottom: iIdx < cat.items.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: state.checked ? 'rgba(0,217,166,0.04)' : 'transparent',
                    transition:'background 0.15s',
                  }}>
                    {/* Custom checkbox */}
                    <button type="button" onClick={() => handleCheckItem(item, cat.defaultQty)}
                      style={{
                        width:20, height:20, borderRadius:6, flexShrink:0, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                        background: state.checked ? '#00d9a6' : 'transparent',
                        border: `2px solid ${state.checked ? '#00d9a6' : 'rgba(255,255,255,0.2)'}`,
                        transition:'all 0.15s', outline:'none',
                      }}>
                      {state.checked && <Check size={12} color="#0a0f1e" strokeWidth={3} />}
                    </button>
                    <label onClick={() => handleCheckItem(item, cat.defaultQty)} style={{ flex:1, fontSize:14, cursor:'pointer', userSelect:'none', color: state.checked ? '#fff' : '#8898b4', fontWeight: state.checked ? 600 : 400, transition:'color 0.15s' }}>
                      {item}
                    </label>
                    {state.checked && (
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                        <span style={{ color:'#8898b4', fontSize:12 }}>Qty:</span>
                        <input type="number" min={1} value={state.qty} onChange={e => handleQty(item, e.target.value)}
                          style={{ width:70, background:'rgba(10,15,30,0.8)', border:'1px solid rgba(0,217,166,0.35)', borderRadius:8, padding:'5px 8px', color:'#fff', fontSize:14, fontWeight:700, textAlign:'center', outline:'none', fontFamily:'DM Sans, Outfit, sans-serif', boxSizing:'border-box' }}
                          onFocus={e => e.target.style.borderColor='#00d9a6'}
                          onBlur={e => e.target.style.borderColor='rgba(0,217,166,0.35)'} />
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STEP 4 — SELECTION CRITERIA
   ───────────────────────────────────────────────────────── */
function StepCriteria({ selectedItems, criteria, handleCriteria, criteriaScore }) {
  if (selectedItems.length === 0) {
    return (
      <div style={{ ...card, padding:48, textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>📊</div>
        <p style={{ color:'#8898b4', fontSize:15 }}>No assets selected yet. Go back to Step 3 to select equipment.</p>
      </div>
    )
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <p style={{ color:'#8898b4', fontSize:14, lineHeight:1.65 }}>
        For each selected device, mark which criteria apply. A score of <strong style={{ color:'#fff' }}>3+</strong> marks it as a strong pilot candidate.
      </p>
      <div style={{ ...card, overflowX:'auto' }}>
        <table className="criteria-table" style={{ width:'100%', borderCollapse:'collapse', minWidth:580 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(0,0,0,0.25)' }}>
              <th style={{ textAlign:'left', padding:'12px 18px', color:'#8898b4', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', width:180 }}>Device</th>
              {CRITERIA_FIELDS.map(f => (
                <th key={f.key} style={{ textAlign:'center', padding:'12px 10px', color:'#8898b4', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.04em' }}>{f.label}</th>
              ))}
              <th style={{ textAlign:'center', padding:'12px 14px', color:'#8898b4', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, rIdx) => {
              const score = criteriaScore(item)
              const strong = score >= 3
              return (
                <tr key={item} style={{ borderBottom: rIdx < selectedItems.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'11px 18px', color:'#d0d9e8', fontWeight:600, fontSize:14 }}>{item}</td>
                  {CRITERIA_FIELDS.map(f => (
                    <td key={f.key} style={{ textAlign:'center', padding:'11px 10px' }}>
                      <button type="button" onClick={() => handleCriteria(item, f.key)} aria-pressed={criteria[item][f.key]}
                        style={{
                          width:32, height:32, borderRadius:'50%', border:`2px solid ${criteria[item][f.key] ? '#00d9a6' : 'rgba(255,255,255,0.15)'}`,
                          background: criteria[item][f.key] ? '#00d9a6' : 'transparent',
                          color: criteria[item][f.key] ? '#0a0f1e' : '#8898b4',
                          fontWeight:700, fontSize:12, cursor:'pointer', transition:'all 0.15s', outline:'none',
                          display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto',
                        }}
                        onMouseEnter={e => { if (!criteria[item][f.key]) e.currentTarget.style.borderColor='rgba(0,217,166,0.5)' }}
                        onMouseLeave={e => { if (!criteria[item][f.key]) e.currentTarget.style.borderColor='rgba(255,255,255,0.15)' }}>
                        {criteria[item][f.key] ? <Check size={13} strokeWidth={3} /> : <span style={{ opacity:0.4 }}>—</span>}
                      </button>
                    </td>
                  ))}
                  <td style={{ textAlign:'center', padding:'11px 14px' }}>
                    {strong ? (
                      <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(0,217,166,0.12)', border:'1px solid rgba(0,217,166,0.25)', color:'#00d9a6', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:100, whiteSpace:'nowrap' }}>
                        ★ Strong
                      </span>
                    ) : (
                      <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:26, height:26, borderRadius:'50%', background:'rgba(255,255,255,0.06)', color:'#8898b4', fontSize:13, fontWeight:700, margin:'0 auto' }}>
                        {score}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STEP 5 — STAKEHOLDERS
   ───────────────────────────────────────────────────────── */
function StepStakeholders({ selectedItems, stakeholders, owningDeptFor, handleStakeholder }) {
  if (selectedItems.length === 0) {
    return (
      <div style={{ ...card, padding:48, textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🤝</div>
        <p style={{ color:'#8898b4', fontSize:15 }}>No assets selected yet. Go back to Step 3 to select equipment.</p>
      </div>
    )
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <p style={{ color:'#8898b4', fontSize:14, lineHeight:1.65 }}>
        For each selected device, name the team member responsible for coordinating during the pilot.
      </p>
      <div style={{ ...card, overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:440 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(0,0,0,0.25)' }}>
              {['Device','Owning Department','Stakeholder Name'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'12px 18px', color:'#8898b4', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, rIdx) => (
              <tr key={item} style={{ borderBottom: rIdx < selectedItems.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'11px 18px', color:'#d0d9e8', fontWeight:600, fontSize:14 }}>{item}</td>
                <td style={{ padding:'11px 18px', color:'#8898b4', fontSize:12 }}>{owningDeptFor(item)}</td>
                <td style={{ padding:'9px 18px' }}>
                  <input type="text" value={stakeholders[item]} onChange={e => handleStakeholder(item, e.target.value)} placeholder="Full name or role"
                    style={{ ...inp, padding:'8px 12px' }} onFocus={focusOn} onBlur={focusOff} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STEP 6 — FINALIZE
   ───────────────────────────────────────────────────────── */
function StepFinalize({ signoffs, handleSignoff, contact, totalAssets, totalZoneCount, selectedItems, submitError, loading, onSubmit }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Summary review */}
      <div style={{ ...card, padding:24 }}>
        <h3 style={{ color:'#fff', fontFamily:'Bricolage Grotesque, sans-serif', fontWeight:700, fontSize:16, marginBottom:16, paddingBottom:12, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          Pilot Summary
        </h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }}>
          {[
            { label:'Total Assets', value:totalAssets, color:'#00d9a6', note: totalAssets>=30&&totalAssets<=50 ? 'Ideal range ✓' : totalAssets<30 ? 'Aim for 30+' : 'Consider narrowing' },
            { label:'Zones Defined', value:totalZoneCount, color:'#0ab8ff', note: totalZoneCount>=10&&totalZoneCount<=15 ? 'Ideal range ✓' : totalZoneCount<10 ? 'Aim for 10+' : 'Consider narrowing' },
            { label:'Equipment Types', value:selectedItems.length, color:'#f7c94b', note:`across ${selectedItems.length} device type${selectedItems.length!==1?'s':''}` },
          ].map(({ label, value, color, note }) => (
            <div key={label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'16px 14px', textAlign:'center' }}>
              <div style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontWeight:800, fontSize:30, color, lineHeight:1 }}>{value}</div>
              <div style={{ color:'#fff', fontSize:13, fontWeight:600, marginTop:4 }}>{label}</div>
              <div style={{ color:'#8898b4', fontSize:11, marginTop:3 }}>{note}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          {[
            { label:'Facility', value:contact.hospitalName, color:'#00d9a6' },
            { label:'Contact', value:contact.contactName, color:'#0ab8ff' },
            { label:'Email', value:contact.contactEmail, color:'#8898b4' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'10px 14px', display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ color:'#8898b4', fontSize:12 }}>{label}:</span>
              <span style={{ color, fontSize:13, fontWeight:600 }}>{value || '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pilot details */}
      <div style={{ ...card, padding:24 }}>
        <h3 style={{ color:'#fff', fontFamily:'Bricolage Grotesque, sans-serif', fontWeight:700, fontSize:16, marginBottom:20 }}>Pilot Details</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }} className="pilot-contact-grid">
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label htmlFor="pilotUnit" style={{ color:'#8898b4', fontSize:13, fontWeight:600 }}>Pilot Unit / Floor <span style={{ color:'#4a5568', fontSize:11 }}>optional</span></label>
            <input id="pilotUnit" name="pilotUnit" type="text" value={signoffs.pilotUnit} onChange={handleSignoff} placeholder="e.g. 4 North ICU"
              style={inp} onFocus={focusOn} onBlur={focusOff} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label htmlFor="installationDate" style={{ color:'#8898b4', fontSize:13, fontWeight:600 }}>Target Installation Date <span style={{ color:'#4a5568', fontSize:11 }}>optional</span></label>
            <input id="installationDate" name="installationDate" type="date" value={signoffs.installationDate} onChange={handleSignoff}
              style={{ ...inp, colorScheme:'dark' }} onFocus={focusOn} onBlur={focusOff} />
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:20 }}>
          <label htmlFor="notes" style={{ color:'#8898b4', fontSize:13, fontWeight:600 }}>Additional Notes <span style={{ color:'#4a5568', fontSize:11 }}>optional</span></label>
          <textarea id="notes" name="notes" rows={4} value={signoffs.notes} onChange={handleSignoff} placeholder="Any special requirements, constraints, or context for our team…"
            style={{ ...inp, resize:'vertical', lineHeight:1.65 }} onFocus={focusOn} onBlur={focusOff} />
        </div>
      </div>

      {/* Error */}
      {submitError && (
        <div style={{ display:'flex', alignItems:'flex-start', gap:10, background:'rgba(255,94,58,0.08)', border:'1px solid rgba(255,94,58,0.25)', borderRadius:12, padding:'14px 18px' }}>
          <AlertTriangle size={15} color="#ff5e3a" style={{ flexShrink:0, marginTop:1 }} />
          <p style={{ color:'#ff5e3a', fontSize:14, margin:0 }}>{submitError}</p>
        </div>
      )}

      {/* Consent note */}
      <p style={{ color:'#4a5568', fontSize:12, lineHeight:1.6 }}>
        By submitting, you confirm all information is accurate and authorize InSite Health Systems to contact you regarding your pilot setup.
      </p>
    </div>
  )
}
