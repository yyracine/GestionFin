import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const links = [
  { to: '/', label: 'Tableau de bord', icon: '📊' },
  { to: '/transactions', label: 'Transactions', icon: '💳' },
  { to: '/ocr', label: 'Scanner OCR', icon: '📷' },
  { to: '/categories', label: 'Catégories', icon: '🏷️' },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-primary-600">💰 GestionFin</span>
          <div className="hidden sm:flex items-center gap-1">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                {icon} {label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            title={dark ? 'Mode clair' : 'Mode sombre'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
            {user?.email}
          </span>
          <button onClick={handleSignOut} className="btn-secondary text-sm py-1.5">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="sm:hidden flex border-t border-gray-100 dark:border-gray-700">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 py-2 text-center text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/30'
                  : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
              }`
            }
          >
            <div className="text-lg">{icon}</div>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
