import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../UI/Modal";
import { useDailyOutcome } from "../../hooks/useDailyOutcome";
import { useInlineEdit } from "../../hooks/useInlineEdit";
import { useCalendar } from "../../hooks/useCalendar";
import logoUrl from "../../assets/Google_Calendar_icon.svg";

export default function DashboardHeader({
    selectedDate,
    viewMode,
    onViewModeChange,
    onPreviousDay,
    onNextDay,
}) {
    const [showSyncModal, setShowSyncModal] = useState(false);
    const { outcome, isLoading, saveOutcome } = useDailyOutcome(selectedDate);

    const {
        syncStatus,
        isLoading: isCalendarLoading,
        enableCalendarSync,
        disableCalendarSync,
        triggerSync,
        disconnectCalendar,
        isEnabling,
        isDisabling,
        isSyncing,
        isDisconnecting,
    } = useCalendar();

    const {
        isEditing,
        draft,
        setDraft,
        startEdit,
        commitEdit,
        handleKeyDown,
    } = useInlineEdit(outcome || "", (newValue) => {
        saveOutcome(newValue);
    });

    const inputRef = useRef(null);

    // Update draft when outcome changes (e.g., when date changes)
    useEffect(() => {
        setDraft(outcome || "");
    }, [outcome, setDraft]);

    // Auto-focus input when entering edit mode
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <>
            <div className="flex flex-col gap-1 bg-white dark:bg-dark-surface rounded-xl border border-black/10 dark:border-dark-border p-6">
                {/* Top Row: Date Navigation and View Toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Date Display with Navigation */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onPreviousDay}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            aria-label="Previous day"
                        >
                            <ChevronLeft className="w-5 h-5 text-brand-primary dark:text-white" />
                        </button>

                        <h2 className="text-2xl font-bold text-brand-primary dark:text-white">
                            {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </h2>

                        <button
                            onClick={onNextDay}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            aria-label="Next day"
                        >
                            <ChevronRight className="w-5 h-5 text-brand-primary dark:text-white" />
                        </button>

                        {/* Google Calendar Icon */}
                        <button
                            onClick={() => setShowSyncModal(true)}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-2"
                            aria-label="Google Calendar sync"
                        >
                            <div title="Google Calendar Sync">
                                <img
                                    src={logoUrl}
                                    alt="Google calendar icon"
                                    className="w-5 h-5"
                                    draggable="false"
                                />
                            </div>
                        </button>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-2 bg-black/5 dark:bg-white/10 rounded-lg p-1">
                        <button
                            onClick={() => onViewModeChange("daily")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${viewMode === "daily"
                                ? "bg-white dark:bg-dark-bg text-brand-primary dark:text-white shadow-sm"
                                : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                                }`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => onViewModeChange("weekly")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${viewMode === "weekly"
                                ? "bg-white dark:bg-dark-bg text-brand-primary dark:text-white shadow-sm"
                                : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                                }`}
                        >
                            Weekly
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Today’s goal */}
                <div className="mt-2 bg-amber-300 w-fit ml-12">
                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-black/80 pl-2">
                            Today’s goal:
                        </span>

                        {isEditing ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={handleKeyDown}
                                className="text-black/80 pr-2 bg-transparent outline-none"
                                placeholder="Enter ideal outcome for today"
                            />
                        ) : (
                            <div
                                onDoubleClick={startEdit}
                                className={`px-1 transition-colors ${outcome
                                    ? "text-black/80 pr-2"
                                    : "text-black/40 pr-2"
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="text-black/40">
                                        Loading...
                                    </span>
                                ) : outcome ? (
                                    outcome
                                ) : (
                                    "double click to add"
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Google Calendar Sync Modal */}
            <Modal
                isOpen={showSyncModal}
                onClose={() => setShowSyncModal(false)}
                title="Google Calendar"
            >
                {isCalendarLoading ? (
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ) : (
                    <div>
                        {/* Header */}
                        <div className="flex items-center mb-4">
                            <img
                                src={logoUrl}
                                alt="Google calendar icon"
                                className="w-5 h-5"
                                draggable="false"
                            />
                            <p className="pl-2 text-black/70">
                                Sync tasks and time blocks automatically
                            </p>
                        </div>

                        {/* Status */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-black/60">Status:</span>
                                <span className={`text-sm font-medium ${syncStatus?.connected ? 'text-green-600' : 'text-gray-500'}`}>
                                    {syncStatus?.connected ? '✓ Connected' : '○ Not Connected'}
                                </span>
                            </div>

                            {syncStatus?.connected && syncStatus?.lastSync && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-black/60">Last Sync:</span>
                                    <span className="text-sm">
                                        {new Date(syncStatus.lastSync).toLocaleString('he-IL')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                            {!syncStatus?.connected ? (
                                <button
                                    onClick={() => {
                                        const baseUrl = import.meta.env.VITE_API_BASE_URL;
                                        const serverUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
                                        window.location.href = `${serverUrl}/api/auth/google/calendar`;
                                    }}
                                    disabled={isEnabling}
                                    className="btn btn-primary w-full"
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
                                                checked={syncStatus?.enabled}
                                                onChange={() => {
                                                    if (syncStatus?.enabled) {
                                                        disableCalendarSync();
                                                    } else {
                                                        enableCalendarSync();
                                                    }
                                                }}
                                                disabled={isEnabling || isDisabling}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {/* Sync Now Button */}
                                    <button
                                        onClick={triggerSync}
                                        disabled={isSyncing || !syncStatus?.enabled}
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
                )}
            </Modal>
        </>
    );
}
