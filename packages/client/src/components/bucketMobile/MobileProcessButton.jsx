import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Process Button for mobile Bucket page
 * Navigates to the Process Bucket flow
 */
export default function MobileProcessButton({ taskCount }) {
    const navigate = useNavigate();

    // Don't show button if there are no tasks
    if (taskCount === 0) {
        return null;
    }

    return (
        <div className="px-2 sm:px-4 pb-3">
            <button
                onClick={() => navigate("/app/process_bucket_mobile")}
                className="w-full btn btn-primary flex items-center justify-center gap-2"
            >
                <span>Process Bucket</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}
