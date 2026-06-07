import { useState } from 'react'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

const trustItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Chiffrement de bout en bout',
    sub: 'Données sécurisées avec Supabase',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Authentification sécurisée',
    sub: 'Row Level Security activé',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Données en temps réel',
    sub: 'Synchronisation instantanée',
  },
]

function LogoMark({ size = 42 }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #c9a84c 0%, #e8c96a 100%)',
        boxShadow: '0 2px 12px rgba(201,168,76,.35)',
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" width={Math.round(size * 0.52)} height={Math.round(size * 0.52)}>
        <path d="M4 16 L8 11 L12 13.5 L17 7 L20 9" stroke="#0d1b3e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 7 L20 7 L20 10" stroke="#0d1b3e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14.5" cy="19.5" r="2.5" fill="#0d1b3e" opacity=".35"/>
      </svg>
    </div>
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState('login')

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans" style={{ background: '#091628' }}>

      {/* ── LEFT — Branding ── */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden flex-1"
        style={{
          padding: 'clamp(40px,6vw,80px)',
          background: 'linear-gradient(155deg, #142047 0%, #0d1b3e 55%, #091628 100%)',
          borderRight: '1px solid rgba(255,255,255,.06)',
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Decorative radial glows */}
        <div className="absolute pointer-events-none" style={{ right: -120, top: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,.06) 0%, transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ left: -80, bottom: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,111,235,.08) 0%, transparent 70%)' }} />

        {/* Top section */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3" style={{ marginBottom: 'clamp(48px,8vh,88px)' }}>
            <LogoMark size={42} />
            <div className="flex flex-col leading-none">
              <strong className="text-[18px] font-extrabold text-white tracking-tight">GestionFin</strong>
              <span className="text-[10px] text-white/40 tracking-[.12em] uppercase mt-1 font-mono">Gestion Financière</span>
            </div>
          </div>

          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[.14em] uppercase mb-5 px-3 py-1.5 rounded"
            style={{ color: '#c9a84c', background: 'rgba(201,168,76,.18)', border: '1px solid rgba(201,168,76,.28)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a84c' }} />
            Plateforme sécurisée
          </div>

          {/* Headline */}
          <h1 className="font-bold leading-[1.18] tracking-[-0.025em] text-white mb-4 max-w-[440px]"
              style={{ fontSize: 'clamp(28px,3.5vw,46px)' }}>
            La finance personnelle,{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(90deg, #c9a84c 0%, #e8c96a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              maîtrisée
            </em>{' '}
            avec précision.
          </h1>

          <p className="text-[15px] text-white/45 leading-[1.65] max-w-[380px] mb-10">
            Pilotez revenus, dépenses et budgets depuis un tableau de bord unifié.
            Conçu pour les particuliers.
          </p>

          {/* Trust signals */}
          <ul className="flex flex-col gap-3">
            {trustItems.map(({ icon, title, sub }) => (
              <li key={title} className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded-lg"
                  style={{ width: 32, height: 32, color: '#c9a84c', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}
                >
                  {icon}
                </div>
                <div>
                  <strong className="block text-[13px] font-semibold text-white/70 leading-snug">{title}</strong>
                  <span className="text-[11px] text-white/25">{sub}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom certifications */}
        <div
          className="relative z-10 flex items-center justify-between flex-wrap gap-3 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}
        >
          <div className="flex gap-5">
            {['Supabase Auth', 'HTTPS / TLS'].map((cert) => (
              <div key={cert} className="flex items-center gap-1.5 font-mono text-[10px] tracking-[.08em] uppercase text-white/25">
                <svg viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" opacity=".7">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — Form ── */}
      <div
        className="flex-1 lg:max-w-[520px] flex flex-col justify-center"
        style={{
          padding: 'clamp(40px,6vw,72px) clamp(32px,5vw,64px)',
          background: 'linear-gradient(175deg, #0f1e42 0%, #0a1528 100%)',
        }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <LogoMark size={36} />
          <strong className="text-lg font-extrabold text-white tracking-tight">GestionFin</strong>
        </div>

        {mode === 'login'
          ? <LoginForm onSwitch={() => setMode('register')} />
          : <RegisterForm onSwitch={() => setMode('login')} />
        }
      </div>
    </div>
  )
}
