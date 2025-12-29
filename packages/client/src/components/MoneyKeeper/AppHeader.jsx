import MoneyKeeperLogo from '../../assets/MK_RED.svg'
import NotificationBell from './NotificationBell'
import SettingsButton from './SettingsButton'
import UserProfileMenu from './UserProfileMenu'

function AppHeader() {
  const mockUser = {
    name: 'ישראל ישראלי',
    email: 'user@example.com',
    unreadNotifications: 3
  }

  return (
    <header className="bg-white border-b border-black/10 h-16 px-6" dir="rtl">
      <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <img src={MoneyKeeperLogo} alt="Money Keeper" className="h-8 md:h-10" />
        </div>

        {/* Right side: Notifications, Settings, User Menu */}
        <div className="flex items-center gap-2">
          <NotificationBell unreadCount={mockUser.unreadNotifications} />
          <SettingsButton />
          <div className="h-6 w-px bg-black/10 mx-1" /> {/* Divider */}
          <UserProfileMenu user={mockUser} />
        </div>
      </div>
    </header>
  )
}

export default AppHeader
