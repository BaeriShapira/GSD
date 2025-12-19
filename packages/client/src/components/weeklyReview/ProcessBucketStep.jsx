import { ExternalLink } from "lucide-react";

export default function ProcessBucketStep() {
    function handleGoToProcess() {
        window.open("/app/process_bucket", "_blank");
    }

    return (
        <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            <h2>Process Your Bucket</h2>
            <p className="text-black/60 mb-6">
                Now it's time to process everything you've captured. Go through each
                item and decide what it is and what to do about it.
            </p>

            <div className="border border-black/10 rounded-lg p-4 mb-4 bg-black/5">
                <p className="text-sm font-medium mb-2">💡 Processing Tips:</p>
                <ul className="text-sm text-black/60 space-y-1">
                    <li>• Process from the top down - don't skip around</li>
                    <li>• Ask: "What is it?" and "What's the next action?"</li>
                    <li>• If it takes less than 2 minutes, do it now</li>
                    <li>• If it's not actionable, decide: trash, reference, or someday</li>
                    <li>• If it's a project, break it down into next actions</li>
                    <li>• Assign to contexts, areas, and projects as appropriate</li>
                </ul>
            </div>

            <div className="border border-black/10 rounded-lg p-4 mb-6 bg-black/5">
                <p className="text-sm font-medium mb-2">The Processing Workflow:</p>
                <div className="text-sm text-black/60 space-y-1">
                    <div>• <strong>Is it actionable?</strong> → No: Trash, Reference, or Someday</div>
                    <div>• <strong>Will it take &lt;2 min?</strong> → Yes: Do it now</div>
                    <div>• <strong>Can you delegate?</strong> → Yes: Waiting For</div>
                    <div>• <strong>Otherwise:</strong> → Next Action or Project</div>
                </div>
            </div>

            <button
                onClick={handleGoToProcess}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
                Open Process Bucket
                <ExternalLink size={16} />
            </button>

            <p className="text-xs text-black/60 mt-4 text-center">
                Process until your Bucket is empty, then click "Next"
            </p>
        </div>
    );
}
