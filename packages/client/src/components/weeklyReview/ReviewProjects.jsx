import { ExternalLink } from "lucide-react";

export default function ReviewProjects() {
    function handleGoToProjects() {
        window.open("/app/projects", "_blank");
    }

    return (
        <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            <h2>Review Your Projects</h2>
            <p className="text-black/60 mb-6">
                Go through each of your active projects. For each project, identify
                the next physical action needed and add it to your Bucket to be
                processed.
            </p>

            <div className="border border-black/10 rounded-lg p-4 mb-6 bg-black/5">
                <p className="text-sm font-medium mb-2">💡 Tips:</p>
                <ul className="text-sm text-black/60 space-y-1">
                    <li>• Ask yourself: "What's the very next action to move this forward?"</li>
                    <li>• Make sure each project has at least one next action</li>
                    <li>• Look for projects that might be stalled or need attention</li>
                    <li>• Update project status and notes if needed</li>
                    <li>• Consider if any projects should move to Someday/Maybe</li>
                </ul>
            </div>

            <button
                onClick={handleGoToProjects}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
                Open Projects
                <ExternalLink size={16} />
            </button>

            <p className="text-xs text-black/60 mt-4 text-center">
                After reviewing all your projects, click "Next" to continue
            </p>
        </div>
    );
}
