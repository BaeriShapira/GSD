export default function WeeklyReviewStep() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">The Weekly Review</h1>

            <p className="text-lg text-gray-700 mb-6">
                The Weekly Review is the heart of GTD. It's your time to step back, clear your Bucket, review your projects, and plan ahead.
            </p>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 mb-6">
                <h2 className=" mb-3">What to do in your Weekly Review:</h2>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                        <span className="mr-2 font-bold">✓</span>
                        <span><strong>Process your Bucket:</strong> Clarify and organize everything you captured</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 font-bold">✓</span>
                        <span><strong>Review all Projects:</strong> Check progress and define next actions</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 font-bold">✓</span>
                        <span><strong>Review Next Actions:</strong> Ensure they're still relevant and prioritized</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 font-bold">✓</span>
                        <span><strong>Review Waiting For:</strong> Follow up on items you're waiting on</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 font-bold">✓</span>
                        <span><strong>Review Someday/Maybe:</strong> See if anything is ready to become active</span>
                    </li>
                </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow mb-6">
                <h2 className="mb-3">When to do it:</h2>
                <p className="text-gray-700 mb-2">
                    Find a consistent time each week, such as:
                </p>
                <ul className="space-y-1 text-gray-700">
                    <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Friday afternoon to wrap up the week</span>
                    </li>
                    <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Sunday evening to plan for the week ahead</span>
                    </li>
                </ul>
                <p className="text-gray-600 mt-3 italic">
                    Block 1-2 hours in your calendar to make it a habit!
                </p>
            </div>
        </div>
    );
}
