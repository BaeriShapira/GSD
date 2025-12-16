import { useCalendar } from "../../hooks/useCalendar";
import { Calendar } from "lucide-react";
import logoUrl from "../../assets/Google_Calendar_icon.svg";

export default function GoogleCalendarCard() {
    const {
        syncStatus,
        isLoading,
        enableCalendarSync,
        disableCalendarSync,
        triggerSync,
        disconnectCalendar,
        isEnabling,
        isDisabling,
        isSyncing,
        isDisconnecting,
    } = useCalendar();

    const isConnected = syncStatus?.connected;
    const isEnabled = syncStatus?.enabled;
    const lastSync = syncStatus?.lastSync;
    const syncedItemsCount = syncStatus?.syncedItemsCount || 0;

    const handleConnect = () => {
        // Redirect to Calendar-specific Google OAuth
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        // Remove trailing /api if it exists, then add the full auth path
        const serverUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
        window.location.href = `${serverUrl}/api/auth/google/calendar`;
    };

    const handleToggleSync = () => {
        if (isEnabled) {
            disableCalendarSync();
        } else {
            enableCalendarSync();
        }
    };

    if (isLoading) {
        return (
            <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col items-start ">
                <div className=" flex items-center justify-center">
                    <img
                        src={logoUrl}
                        alt="Google calendar icon"
                        className="w-5 h-5"
                        draggable="false"
                    />
                    <h2 className="pl-2 ">
                        Google Calendar
                    </h2>
                </div>
                <div>
                    <p>
                        Sync tasks and time blocks automatically
                    </p>
                </div>
            </div>

            {/* Status */}
            <div className="mb-1 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-black/60">Status:</span>
                    <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                        {isConnected ? '✓ Connected' : '○ Not Connected'}
                    </span>
                </div>

                {isConnected && (
                    <>

                        {lastSync && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-black/60">Last Sync:</span>
                                <span className="text-sm">
                                    {new Date(lastSync).toLocaleString('he-IL')}
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
                {!isConnected ? (
                    <button
                        onClick={handleConnect}
                        disabled={isEnabling}
                        className="btn btn-primary "
                    >
                        {isEnabling ? 'Connecting...' : 'Connect Google Calendar'}
                    </button>
                ) : (
                    <>
                        {/* Toggle Sync */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-black/90">Auto-Sync</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isEnabled}
                                    onChange={handleToggleSync}
                                    disabled={isEnabling || isDisabling}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Sync Now Button */}
                        <button
                            onClick={triggerSync}
                            disabled={isSyncing || !isEnabled}
                            className="btn btn-secondary w-full"
                        >
                            {isSyncing ? 'Syncing...' : '🔄 Sync Now'}
                        </button>

                        {/* Disconnect Button */}
                        <button
                            onClick={disconnectCalendar}
                            disabled={isDisconnecting}
                            className="btn btn-secondary w-full text-red-600 hover:bg-red-50"
                        >
                            {isDisconnecting ? 'Disconnecting...' : 'Disconnect Calendar'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
