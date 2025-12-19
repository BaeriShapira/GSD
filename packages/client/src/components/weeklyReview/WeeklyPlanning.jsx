import { ExternalLink } from "lucide-react";

export default function WeeklyPlanning() {
    function handleGoToDashboard() {
        window.open("/app/dashboard", "_blank");
    }

    return (
        <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            <h2>Plan Your Week</h2>
            <p className="text-black/60 mb-6">
                Now that everything is processed and organized, it's time to plan your
                week. Set your weekly goal and schedule time blocks for your priorities.
            </p>

            <div className="border border-black/10 rounded-lg p-4 mb-4 bg-black/5">
                <p className="text-sm font-medium mb-2">💡 Planning Tips:</p>
                <ul className="text-sm text-black/60 space-y-1">
                    <li>• Set a clear weekly goal - what's most important this week?</li>
                    <li>• Review your calendar for upcoming commitments</li>
                    <li>• Schedule time blocks for focused work on key projects</li>
                    <li>• Block time for processing email and routine tasks</li>
                    <li>• Assign Next Actions to specific days</li>
                    <li>• Leave buffer time for unexpected items</li>
                    <li>• Be realistic about what you can accomplish</li>
                </ul>
            </div>

            <div className="border border-black/10 rounded-lg p-4 mb-6 bg-black/5">
                <p className="text-sm font-medium mb-2">Week at a Glance:</p>
                <p className="text-sm text-black/60">
                    Use the weekly view in your Dashboard to see the whole week. Plan day by
                    day, ensuring each day has a manageable load. Remember: it's better to
                    undercommit and overdeliver than the reverse.
                </p>
            </div>

            <button
                onClick={handleGoToDashboard}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
                Open Dashboard
                <ExternalLink size={16} />
            </button>

            <p className="text-xs text-black/60 mt-4 text-center">
                After planning your week, click "Finish" to complete your Weekly Review
            </p>
        </div>
    );
}
