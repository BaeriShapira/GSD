import { Bell } from 'lucide-react'

function NotificationBell({ unreadCount = 0 }) {
  return (
    <button className="relative w-10 h-10 p-2 rounded-lg hover:bg-black/5 transition-colors">
      <Bell size={20} className="text-black/80" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </span>
      )}
    </button>
  )
}

export default NotificationBell
