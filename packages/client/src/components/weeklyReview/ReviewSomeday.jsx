import { ExternalLink } from "lucide-react";

export default function ReviewSomeday() {
    function handleGoToSomeday() {
        window.open("/app/someday", "_blank");
    }

    return (
        <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            <h2>Review Your Someday/Maybe List</h2>
            <p className="text-black/60 mb-6">
                Take a moment to review your Someday/Maybe items. Are there any ideas
                or projects that you're ready to commit to now? Move them to your Bucket
                so they can be processed.
            </p>

            <div className="border border-black/10 rounded-lg p-4 mb-6 bg-black/5">
                <p className="text-sm font-medium mb-2">💡 Tips:</p>
                <ul className="text-sm text-black/60 space-y-1">
                    <li>• Look for items that now feel relevant or timely</li>
                    <li>• Consider your current commitments and capacity</li>
                    <li>• It's okay to keep things in Someday - that's what it's for!</li>
                    <li>• Delete items that no longer interest you</li>
                </ul>
            </div>

            <button
                onClick={handleGoToSomeday}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
                Open Someday/Maybe
                <ExternalLink size={16} />
            </button>

            <p className="text-xs text-black/60 mt-4 text-center">
                When you're done reviewing, click "Next" to continue
            </p>
        </div>
    );
}
