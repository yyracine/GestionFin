import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const links = [
  {
    to: '/',
    label: 'Tableau de bord',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    to: '/transactions',
    label: 'Transactions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    to: '/ocr',
    label: 'Scanner OCR',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    to: '/categories',
    label: 'Catégories',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    to: '/report',
    label: 'Rapport',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
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
    <nav className="sticky top-0 z-10 border-b bg-white border-gray-200 dark:bg-navy dark:border-navy-light/30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo + nav links */}
        <div className="flex items-center gap-6">
          {/* Logo mark */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #c9a84c 0%, #e8c96a 100%)',
                boxShadow: '0 1px 8px rgba(201,168,76,.3)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M4 16 L8 11 L12 13.5 L17 7 L20 9" stroke="#0d1b3e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 7 L20 7 L20 10" stroke="#0d1b3e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-extrabold tracking-tight text-gray-900 dark:text-white">
              GestionFin
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-0.5">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-gold'
                      : 'text-gray-500 hover:text-gray-800 dark:text-white/50 dark:hover:text-white/90'
                  }`
                }
                style={({ isActive }) =>
                  isActive ? { background: 'rgba(201,168,76,.10)' } : undefined
                }
              >
                {icon}
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-white/40 dark:hover:text-white/80 dark:hover:bg-white/[.06] transition-all"
            title={dark ? 'Mode clair' : 'Mode sombre'}
          >
            {dark
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
            }
          </button>

          {/* User email */}
          <span className="hidden sm:block text-[13px] text-gray-400 dark:text-white/30 truncate max-w-[150px]">
            {user?.email}
          </span>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                       text-gray-600 border border-gray-200 hover:bg-gray-50
                       dark:text-white/60 dark:border-navy-light dark:hover:bg-white/[.05]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="sm:hidden flex border-t border-gray-100 dark:border-navy-light/30">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 py-2 flex flex-col items-center text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-gold'
                  : 'text-gray-400 dark:text-white/35'
              }`
            }
          >
            {label.split(' ')[0]}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
