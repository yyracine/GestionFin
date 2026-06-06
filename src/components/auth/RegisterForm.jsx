import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function RegisterForm({ onSwitch }) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Créer un compte</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="reg-email">Email</label>
          <input id="reg-email" type="email" required className="input" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
        </div>
        <div>
          <label className="label" htmlFor="reg-password">Mot de passe</label>
          <input id="reg-password" type="password" required className="input" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 caractères" />
        </div>
        <div>
          <label className="label" htmlFor="reg-confirm">Confirmer le mot de passe</label>
          <input id="reg-confirm" type="password" required className="input" value={confirm}
            onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-3 py-2 rounded-lg">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">{success}</p>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Création...' : 'Créer le compte'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
        Déjà un compte ?{' '}
        <button onClick={onSwitch} className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          Se connecter
        </button>
      </p>
    </div>
  )
}
