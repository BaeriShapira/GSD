import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../UI/Modal";
import { useDailyOutcome } from "../../hooks/useDailyOutcome";
import { useInlineEdit } from "../../hooks/useInlineEdit";
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
            <div className="flex flex-col gap-1 bg-white rounded-xl border border-black/10 p-6">
                {/* Top Row: Date Navigation and View Toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Date Display with Navigation */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onPreviousDay}
                            className="p-2 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                            aria-label="Previous day"
                        >
                            <ChevronLeft className="w-5 h-5 text-brand-primary" />
                        </button>

                        <h2 className="text-2xl font-bold text-brand-primary">
                            {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </h2>

                        <button
                            onClick={onNextDay}
                            className="p-2 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                            aria-label="Next day"
                        >
                            <ChevronRight className="w-5 h-5 text-brand-primary" />
                        </button>

                        {/* Google Calendar Icon */}
                        <button
                            onClick={() => setShowSyncModal(true)}
                            className="p-2 hover:bg-black/5 rounded-lg transition-colors cursor-pointer ml-2"
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
                    <div className="flex gap-2 bg-black/5 rounded-lg p-1">
                        <button
                            onClick={() => onViewModeChange("daily")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${viewMode === "daily"
                                ? "bg-white text-brand-primary shadow-sm"
                                : "text-black/60 hover:text-black"
                                }`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => onViewModeChange("weekly")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${viewMode === "weekly"
                                ? "bg-white text-brand-primary shadow-sm"
                                : "text-black/60 hover:text-black"
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
                title="Google Calendar Sync"
            >
                <p className="text-black/70">
                    Google Calendar sync feature is not yet available.
                </p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => setShowSyncModal(false)}
                        className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors cursor-pointer"
                    >
                        OK
                    </button>
                </div>
            </Modal>
        </>
    );
}
