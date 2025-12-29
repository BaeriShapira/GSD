import { useState, useEffect, useRef } from 'react'
import { ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react'

function UserProfileMenu({ user = { name: 'ישראל ישראלי', email: 'user@example.com' } }) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const menuItems = [
    { icon: User, label: 'פרופיל', onClick: () => console.log('Profile clicked') },
    { icon: Settings, label: 'הגדרות', onClick: () => console.log('Settings clicked') },
    { icon: HelpCircle, label: 'עזרה ותמיכה', onClick: () => console.log('Help clicked') },
    { icon: LogOut, label: 'התנתק', onClick: () => console.log('Logout clicked'), className: 'text-red-600' }
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-semibold">
          {getInitials(user.name)}
        </div>

        {/* User info - hidden on mobile */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-medium text-black/80">{user.name}</span>
          <span className="text-xs text-black/50">{user.email}</span>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`text-black/60 transition-transform ${showMenu ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute left-0 mt-2 w-56 bg-white border border-black/10 rounded-xl shadow-lg z-50 py-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={() => {
                  item.onClick()
                  setShowMenu(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                  item.className || 'text-black/80'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UserProfileMenu
