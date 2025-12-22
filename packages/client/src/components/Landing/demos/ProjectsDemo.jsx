import { useState } from "react";

export default function ProjectsDemo() {
    const [projects] = useState([
        {
            id: 1,
            name: "Master the red dot",
            areaColor: "bg-blue-400",
            areaName: "Skills & Play",
            nextActions: [
                { id: 1, text: "Practice pouncing technique" },
                { id: 2, text: "Study laser reflection patterns" },
                { id: 3, text: "Build stamina for extended chases" }
            ]
        },
        {
            id: 2,
            name: "Establish kitchen dominance",
            areaColor: "bg-green-400",
            areaName: "Territory",
            nextActions: [
                { id: 4, text: "Knock over the milk" },
                { id: 5, text: "Claim the sunny spot" }
            ]
        },
        {
            id: 3,
            name: "Perfect the nap routine",
            areaColor: "bg-purple-400",
            areaName: "Health & Rest",
            nextActions: [
                { id: 6, text: "Find the coziest box" },
                { id: 7, text: "Take a nap" },
                { id: 8, text: "Stretch luxuriously after waking" }
            ]
        },
        {
            id: 4,
            name: "Train my human",
            areaColor: "bg-yellow-400",
            areaName: "Relationships",
            nextActions: [
                { id: 9, text: "Demand treats at 3 AM" },
                { id: 10, text: "Sit on keyboard during important work" }
            ]
        }
    ]);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Manage Projects
                </h3>
                <p className="text-gray-600">
                    Track your multi-step goals. Each project shows its next actions to keep you moving forward.
                </p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="relative group bg-gray-100 p-4 transition-colors border border-transparent rounded-xl hover:bg-gray-200 hover:border-gray-300 cursor-pointer"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-1 min-w-0">
                                    {/* Project name with area color */}
                                    <div className="flex items-start gap-2 flex-1">
                                        {project.areaColor && (
                                            <div
                                                className={`w-1 h-6 rounded-full mt-0.5 flex-shrink-0 ${project.areaColor}`}
                                            />
                                        )}
                                        <h4 className="flex-1 font-medium text-black/90">{project.name}</h4>
                                    </div>

                                    {/* Area badge */}
                                    {project.areaName && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-[11px] text-black/70 mt-2">
                                            <div className={`w-2 h-2 rounded-full ${project.areaColor}`} />
                                            {project.areaName}
                                        </span>
                                    )}

                                    {/* Next Actions */}
                                    {project.nextActions.length > 0 && (
                                        <div className="mt-3 pt-3">
                                            <div className="flex items-center mb-2">
                                                <span className="text-xs font-semibold text-black/60">
                                                    Next Actions ({project.nextActions.length})
                                                </span>
                                            </div>
                                            <ul className="space-y-1">
                                                {project.nextActions.slice(0, 2).map((action) => (
                                                    <li
                                                        key={action.id}
                                                        className="text-xs text-black/70 truncate"
                                                        title={action.text}
                                                    >
                                                        • {action.text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
