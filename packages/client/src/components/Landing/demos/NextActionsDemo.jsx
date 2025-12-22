import { useState } from "react";
import { Check } from "lucide-react";

export default function NextActionsDemo() {
    const [tasks, setTasks] = useState([
        { id: 1, text: "Practice hunting technique", project: "Outdoor Skills", urgency: 3, context: "Home", time: 30, completed: false },
        { id: 2, text: "Sharpen claws on scratching post", project: null, urgency: 1, context: "Anywhere", time: 10, completed: false },
        { id: 3, text: "Inspect all boxes in house", project: "Territory Control", urgency: 2, context: "Home", time: 15, completed: false },
        { id: 4, text: "Test new toy mouse", project: null, urgency: 1, context: "Home", time: 20, completed: false },
    ]);

    function handleToggleComplete(id) {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Next Actions
                </h3>
                <p className="text-gray-600">
                    Your actionable next steps. These are concrete tasks you can do right now. Check them off as you complete them!
                </p>
            </div>

            {/* Demo Board - Table Style */}
            <div className="border border-black/10 rounded-xl bg-white shadow-sm max-w-full overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black/10 bg-gray-50">
                            <th className="w-1/4 p-3 pl-6 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                                Task
                            </th>
                            <th className="w-[10%] p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Project
                            </th>
                            <th className="w-[8%] p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Urgency
                            </th>
                            <th className="w-[10%] p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Context
                            </th>
                            <th className="w-[10%] p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Est. Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr
                                key={task.id}
                                className={`border-b border-black/10 hover:bg-gray-50 transition-colors ${
                                    task.completed ? "opacity-50" : ""
                                }`}
                            >
                                {/* Task */}
                                <td className="p-3 pl-6">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleToggleComplete(task.id)}
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                                                task.completed
                                                    ? "bg-black border-black"
                                                    : "bg-white border-black/30 hover:border-black/50"
                                            }`}
                                        >
                                            {task.completed && (
                                                <Check size={14} className="text-white" strokeWidth={3} />
                                            )}
                                        </button>
                                        <span className={`text-sm ${task.completed ? "line-through text-black/50" : "text-black"}`}>
                                            {task.text}
                                        </span>
                                    </div>
                                </td>

                                {/* Project */}
                                <td className="p-3">
                                    <span className="text-sm text-black/70">
                                        {task.project || "—"}
                                    </span>
                                </td>

                                {/* Urgency */}
                                <td className="p-3">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                        task.urgency === 3 ? "bg-red-100 text-red-700" :
                                        task.urgency === 2 ? "bg-yellow-100 text-yellow-700" :
                                        "bg-gray-100 text-gray-600"
                                    }`}>
                                        {task.urgency === 3 ? "High" : task.urgency === 2 ? "Med" : "Low"}
                                    </span>
                                </td>

                                {/* Context */}
                                <td className="p-3">
                                    <span className="text-sm text-black/70">
                                        {task.context}
                                    </span>
                                </td>

                                {/* Est. Time */}
                                <td className="p-3">
                                    <span className="text-sm text-black/70">
                                        {task.time}m
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
