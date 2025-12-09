import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logoUrl from "../../assets/GSD_LOGO_PURPLE.svg";

/**
 * Mobile Dashboard Header
 * Shows logo, current date, and navigation arrows
 */
export default function MobileDashboardHeader({ selectedDate, onPreviousDay, onNextDay }) {
    const isToday = format(new Date(), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

    return (
        <div className="pt-2 sm:pt-4 pb-2 px-2 sm:px-4 bg-white border-b border-black/10">
            {/* Logo */}
            <div className="flex justify-center mb-3">
                <img
                    src={logoUrl}
                    alt="GSD"
                    className="w-32 sm:w-40 object-contain select-none"
                    draggable="false"
                />
            </div>

            {/* Date Navigation */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={onPreviousDay}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Previous day"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>

                <div className="text-center">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {isToday ? "Today" : format(selectedDate, "EEEE")}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {format(selectedDate, "MMM d, yyyy")}
                    </p>
                </div>

                <button
                    onClick={onNextDay}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Next day"
                >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
            </div>
        </div>
    );
}
