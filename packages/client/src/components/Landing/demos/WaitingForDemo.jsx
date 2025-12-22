import { useState } from "react";

export default function WaitingForDemo() {
    const [items] = useState([
        {
            id: 1,
            text: "Approval for extra treats budget",
            waitingFor: "My human",
            project: "Kitchen dominance",
            expectedDate: "2024-01-15",
            areaColor: "bg-green-400",
            createdAgo: "3 days ago"
        },
        {
            id: 2,
            text: "New scratching post delivery",
            waitingFor: "Amazon",
            project: null,
            expectedDate: "2024-01-20",
            areaColor: "bg-blue-400",
            createdAgo: "1 week ago"
        },
        {
            id: 3,
            text: "Vet confirmation for checkup",
            waitingFor: "Dr. Whiskers",
            project: "Health tracking",
            expectedDate: "2024-01-18",
            areaColor: "bg-purple-400",
            createdAgo: "2 days ago"
        },
        {
            id: 4,
            text: "Permission to explore the garage",
            waitingFor: "My human",
            project: "Territory expansion",
            expectedDate: null,
            areaColor: "bg-yellow-400",
            createdAgo: "5 days ago"
        }
    ]);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Waiting For
                </h3>
                <p className="text-gray-600">
                    Track things you're waiting on from others. Never let anything fall through the cracks.
                </p>
            </div>

            {/* Table */}
            <div className="border border-black/10 rounded-xl bg-white shadow-sm max-w-full overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black/10 bg-gray-50">
                            <th className="w-1/3 p-3 pl-6 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Task
                            </th>
                            <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Waiting For
                            </th>
                            <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Project
                            </th>
                            <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Expected
                            </th>
                            <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-black/10 hover:bg-gray-50 transition-colors"
                            >
                                {/* Task */}
                                <td className="p-3 pl-6 align-top">
                                    <div className="flex gap-2 items-start">
                                        {item.areaColor && (
                                            <div
                                                className={`w-1 h-6 rounded-full ${item.areaColor} flex-shrink-0 mt-1`}
                                            />
                                        )}

                                        <div className="flex flex-col gap-1 flex-1">
                                            <h4 className="font-medium text-black/90 whitespace-pre-wrap break-words break-all">
                                                {item.text}
                                            </h4>

                                            <span className="text-xs text-black/40">
                                                Created {item.createdAgo}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Waiting For */}
                                <td className="p-3 align-top">
                                    <span className="text-sm text-black/80">
                                        {item.waitingFor}
                                    </span>
                                </td>

                                {/* Project */}
                                <td className="p-3 align-top">
                                    <span className="text-sm text-black/70">
                                        {item.project ? (
                                            item.project
                                        ) : (
                                            <span className="text-black/30">—</span>
                                        )}
                                    </span>
                                </td>

                                {/* Expected */}
                                <td className="p-3 align-top">
                                    {item.expectedDate ? (
                                        <span className="text-sm text-black/70">
                                            {new Date(item.expectedDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    ) : (
                                        <span className="text-black/30 text-sm">—</span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="p-3 align-top">
                                    <div className="flex items-center gap-2">
                                        <button className="px-3 py-1.5 rounded-3xl text-xs transition-colors cursor-pointer bg-black hover:bg-black/80 text-white">
                                            Received
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
