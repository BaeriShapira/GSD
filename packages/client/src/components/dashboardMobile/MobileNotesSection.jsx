import { FileText } from "lucide-react";
import MobileCard from "../UI/MobileCard";
import DailyNotes from "../dashboard/DailyNotes";

/**
 * Mobile Notes Section
 * Compact version of daily notes
 */
export default function MobileNotesSection({ selectedDate }) {
    return (
        <div className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center gap-2 px-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Today's Notes</h3>
            </div>

            {/* Notes Component */}
            <DailyNotes selectedDate={selectedDate} />
        </div>
    );
}
