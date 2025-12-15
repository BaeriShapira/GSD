export default function GTDOverviewStep() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className=" mb-6 text-center">What is GTD?</h1>

            <p className="text-lg text-gray-700 mb-6 text-center">
                GTD (Getting Things Done) is a time management method created by David Allen. It's designed to help you feel in control and stress-free by capturing all your tasks and organizing them effectively.
            </p>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow mb-6">
                <h2 className=" mb-3">Why GTD?</h2>
                <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                        <span className=" mr-2">•</span>
                        <p className="text-gray-700"><strong>Clear your mind:</strong> Stop keeping everything in your head</p>
                    </li>
                    <li className="flex items-start">
                        <span className=" mr-2">•</span>
                        <span><strong>Reduce stress:</strong> Know exactly what needs to be done</span>
                    </li>
                    <li className="flex items-start">
                        <span className=" mr-2">•</span>
                        <span><strong>Increase productivity:</strong> Focus on what matters most</span>
                    </li>
                    <li className="flex items-start">
                        <span className=" mr-2">•</span>
                        <span><strong>Feel in control:</strong> Have a trusted system managing everything</span>
                    </li>
                </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <p className="text-gray-800 italic text-center">
                    "Your mind is for having ideas, not holding them."
                </p>
                <p className="text-gray-600 mt-2 text-center">— David Allen, Creator of GTD</p>
            </div>
        </div>
    );
}
