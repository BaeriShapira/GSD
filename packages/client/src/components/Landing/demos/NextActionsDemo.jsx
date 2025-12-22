import { useState } from "react";

export default function NextActionsDemo() {
    const [tasks, setTasks] = useState([
        { id: 1, text: "Chase my yom", project: "Outdoor Skills", urgency: 3, context: "Home", time: 30, areaColor: "bg-blue-400", completed: false },
        { id: 2, text: "Eat fish & kibble", project: null, urgency: 1, context: "Kitchen", time: 10, areaColor: "bg-green-400", completed: false },
        { id: 3, text: "Chase the laser", project: "Territory Control", urgency: 2, context: "Home", time: 15, areaColor: "bg-blue-400", completed: false },
        { id: 4, text: "Knock over the milk", project: null, urgency: 1, context: "Kitchen", time: 20, areaColor: "bg-green-400", completed: false },
        { id: 5, text: "Sit in a box", project: "Territory Control", urgency: 2, context: "Anywhere", time: 5, areaColor: "bg-blue-400", completed: false },
        { id: 6, text: "Take a nap", project: null, urgency: 1, context: "Home", time: 60, areaColor: "bg-purple-400", completed: false },
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
                            <th className="w-[8%] p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr
                                key={task.id}
                                className="border-b border-black/10 hover:bg-gray-50 transition-colors"
                            >
                                {/* Task */}
                                <td className="p-3 pl-6 align-top">
                                    <div className="flex gap-2 items-start">
                                        {task.areaColor && (
                                            <div className={`w-1 h-6 rounded-full ${task.areaColor} flex-shrink-0 mt-1`} />
                                        )}
                                        <div className="flex flex-col gap-1 flex-1">
                                            <h4 className="font-medium text-black/90 whitespace-pre-wrap">
                                                {task.text}
                                            </h4>
                                        </div>
                                    </div>
                                </td>

                                {/* Project */}
                                <td className="p-3 align-top">
                                    <span className="text-sm text-black/70">
                                        {task.project ? (
                                            task.project
                                        ) : (
                                            <span className="text-black/30">—</span>
                                        )}
                                    </span>
                                </td>

                                {/* Urgency */}
                                <td className="p-3 align-top">
                                    {task.urgency ? (
                                        <span
                                            className="text-yellow-500 text-lg leading-none"
                                            title={`Urgency: ${task.urgency}/5`}
                                        >
                                            {"★".repeat(task.urgency) + "☆".repeat(5 - task.urgency)}
                                        </span>
                                    ) : (
                                        <span className="text-black/30 text-sm">—</span>
                                    )}
                                </td>

                                {/* Context */}
                                <td className="p-3 align-top">
                                    <span className="text-sm text-black/70">
                                        {task.context ? (
                                            task.context
                                        ) : (
                                            <span className="text-black/30">—</span>
                                        )}
                                    </span>
                                </td>

                                {/* Est. Time */}
                                <td className="p-3 align-top">
                                    {task.time ? (
                                        <span className="text-sm text-black/70">
                                            {task.time} min
                                        </span>
                                    ) : (
                                        <span className="text-black/30 text-sm">—</span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="p-3 align-top">
                                    <button
                                        onClick={() => handleToggleComplete(task.id)}
                                        className="px-4 py-2 rounded-3xl text-sm flex items-center gap-1 transition-colors cursor-pointer bg-black hover:bg-black/80 text-white"
                                    >
                                        Done
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
