import { Settings } from 'lucide-react'

function SettingsButton() {
  return (
    <button className="w-10 h-10 p-2 rounded-lg hover:bg-black/5 transition-colors">
      <Settings size={20} className="text-black/80" />
    </button>
  )
}

export default SettingsButton
