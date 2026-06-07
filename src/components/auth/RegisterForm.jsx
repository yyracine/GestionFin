import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function EyeIcon({ off }) {
  if (off) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function AuthField({ label, id, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-semibold text-white/45 tracking-[.04em] uppercase">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">
          {icon}
        </span>
        {children}
      </div>
    </div>
  )
}

function PwdField({ id, label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <AuthField label={label} id={id} icon={<LockIcon />}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="auth-input pl-10 pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/25 hover:text-white/70 transition-colors"
        aria-label={show ? 'Masquer' : 'Afficher'}
      >
        <EyeIcon off={show} />
      </button>
    </AuthField>
  )
}

export default function RegisterForm({ onSwitch }) {
  const { signUp } = useAuth()
  const [email,    setEmail]   = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return }
    setLoading(true)
    const { error: err } = await signUp(email, password)
    if (err) setError(err.message)
    else setSuccess('Compte créé ! Vérifiez votre email pour confirmer votre inscription.')
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1.5">
          Créer un compte
        </h2>
        <p className="text-[14px] text-white/45 leading-relaxed">
          Rejoignez GestionFin et prenez le contrôle de vos finances.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        <AuthField label="Adresse e-mail" id="reg-email" icon={<MailIcon />}>
          <input
            id="reg-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jean@exemple.com"
            className="auth-input pl-10 pr-4"
          />
        </AuthField>

        <PwdField
          id="reg-password"
          label="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 6 caractères"
        />

        <PwdField
          id="reg-confirm"
          label="Confirmer le mot de passe"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
        />

        {error && (
          <p
            className="text-[13px] px-3 py-2 rounded-lg"
            style={{ color: '#fc8181', background: 'rgba(220,38,38,.10)' }}
          >
            {error}
          </p>
        )}
        {success && (
          <p
            className="text-[13px] px-3 py-2 rounded-lg"
            style={{ color: '#86efac', background: 'rgba(22,163,74,.12)' }}
          >
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-[9px] font-bold text-[14px] tracking-[.02em] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #c9a84c 0%, #e8c96a 100%)',
            color: '#091628',
            boxShadow: '0 4px 16px rgba(201,168,76,.28)',
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 22px rgba(201,168,76,.38)' }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,168,76,.28)' }}
        >
          {loading
            ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(9,22,40,.2)', borderTopColor: '#091628' }} />
            : 'Créer le compte'
          }
        </button>
      </form>

      <p className="mt-6 text-[13px] text-center text-white/45">
        Déjà un compte ?{' '}
        <button
          onClick={onSwitch}
          className="font-medium transition-colors hover:opacity-80"
          style={{ color: '#c9a84c' }}
        >
          Se connecter
        </button>
      </p>
    </div>
  )
}
