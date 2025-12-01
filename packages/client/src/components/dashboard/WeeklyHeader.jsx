import { format, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logoUrl from "../../assets/Google_Calendar_icon.svg";
import WeeklyGoal from "./WeeklyGoal";

export default function WeeklyHeader({
    selectedDate,
    viewMode,
    onViewModeChange,
    onPreviousWeek,
    onNextWeek,
    onSyncClick,
    weeklyGoal,
    isLoadingGoal,
    onSaveGoal,
}) {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });

    return (
        <div className="flex flex-col gap-1 bg-white rounded-xl border border-black/10 p-6">
            {/* Top Row: Date Navigation and View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Week Display with Navigation */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onPreviousWeek}
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                        aria-label="Previous week"
                    >
                        <ChevronLeft className="w-5 h-5 text-brand-primary" />
                    </button>

                    <h2 className="text-2xl font-bold text-brand-primary">
                        Week {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                    </h2>

                    <button
                        onClick={onNextWeek}
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                        aria-label="Next week"
                    >
                        <ChevronRight className="w-5 h-5 text-brand-primary" />
                    </button>

                    {/* Google Calendar Icon */}
                    <button
                        onClick={onSyncClick}
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
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                            viewMode === "daily"
                                ? "bg-white text-brand-primary shadow-sm"
                                : "text-black/60 hover:text-black"
                        }`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => onViewModeChange("weekly")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                            viewMode === "weekly"
                                ? "bg-white text-brand-primary shadow-sm"
                                : "text-black/60 hover:text-black"
                        }`}
                    >
                        Weekly
                    </button>
                </div>
            </div>

            {/* Weekly Goal */}
            <WeeklyGoal
                weeklyGoal={weeklyGoal}
                isLoading={isLoadingGoal}
                onSave={onSaveGoal}
            />
        </div>
    );
}
