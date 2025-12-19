import { ExternalLink } from "lucide-react";

export default function ClearBucket() {
    function handleGoToBucket() {
        window.open("/app/bucket", "_blank");
    }

    return (
        <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            <h2>Brain Dump to Bucket</h2>
            <p className="text-black/60 mb-6">
                Empty your mind! Capture everything that's been on your mind this week.
                Don't worry about organizing - just get it all into your Bucket.
            </p>

            <div className="border border-black/10 rounded-lg p-4 mb-4 bg-black/5">
                <p className="text-sm font-medium mb-2">💡 Tips:</p>
                <ul className="text-sm text-black/60 space-y-1">
                    <li>• Write down anything that has your attention</li>
                    <li>• Include tasks, ideas, reminders, and concerns</li>
                    <li>• Don't filter - capture everything, no matter how small</li>
                    <li>• Check physical inboxes: email, messages, notes, papers</li>
                    <li>• Review calendar for past and upcoming events</li>
                    <li>• Think about: work, personal, home, errands, calls, etc.</li>
                </ul>
            </div>

            <div className="border border-black/10 rounded-lg p-3 mb-6 bg-black/5">
                <p className="text-sm text-black/60">
                    <strong>Remember:</strong> The goal is to achieve "mind like water" - clear
                    and ready to respond appropriately to whatever comes next.
                </p>
            </div>

            <button
                onClick={handleGoToBucket}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
                Open Bucket
                <ExternalLink size={16} />
            </button>

            <p className="text-xs text-black/60 mt-4 text-center">
                Once you've captured everything, click "Next" to process your Bucket
            </p>
        </div>
    );
}
