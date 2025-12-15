import { useState } from "react";

export default function PracticeStep() {
    const [taskText, setTaskText] = useState("");
    const [taskAdded, setTaskAdded] = useState(false);

    const handleAddTask = () => {
        if (taskText.trim()) {
            // In a real scenario, this would call the API to add the task
            // For now, we'll just show a success message
            setTaskAdded(true);
            setTaskText("");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Let's Practice!</h1>

            <p className="text-lg text-gray-700 mb-8 text-center">
                Add your first item to the Bucket. It can be anything on your mind - a task, idea, or thought you want to capture.
            </p>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's on your mind?
                </label>
                <input
                    type="text"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    placeholder="e.g., Plan weekend trip, Buy groceries, Call dentist..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                />
                <button
                    onClick={handleAddTask}
                    disabled={!taskText.trim()}
                    className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add to Bucket
                </button>
            </div>

            {taskAdded && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800 text-center">
                        ✅ Great! Your first item is in the Bucket!
                    </p>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <p className="text-gray-700 mb-3">
                    After you complete this tutorial, you'll see your Bucket where you can:
                </p>
                <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Capture more items quickly</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Process them to clarify what they mean</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Organize them into Projects, Next Actions, or other lists</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
