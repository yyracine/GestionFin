import { useState } from 'react'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

export default function AuthPage() {
  const [mode, setMode] = useState('login')

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <div className="text-5xl font-bold mb-4">💰</div>
          <h1 className="text-4xl font-bold mb-4">GestionFin</h1>
          <p className="text-primary-100 text-lg">
            Gérez vos finances personnelles simplement : suivez vos dépenses,
            visualisez vos revenus et gardez le contrôle de votre budget.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <span className="text-4xl">💰</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GestionFin</h1>
          </div>
          {mode === 'login'
            ? <LoginForm onSwitch={() => setMode('register')} />
            : <RegisterForm onSwitch={() => setMode('login')} />
          }
        </div>
      </div>
    </div>
  )
}
