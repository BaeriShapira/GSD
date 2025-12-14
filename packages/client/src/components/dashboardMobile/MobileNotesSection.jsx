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
            </div>

            {/* Notes Component */}
            <DailyNotes selectedDate={selectedDate} />
        </div>
    );
}
