import { useState } from "react";

export default function SomedayDemo() {
    const [items] = useState([
        {
            id: 1,
            text: "Learn to open doors with paws",
            areaColor: "bg-blue-400",
            createdAgo: "2 days ago"
        },
        {
            id: 2,
            text: "Master the art of silent stalking",
            areaColor: "bg-green-400",
            createdAgo: "5 days ago"
        },
        {
            id: 3,
            text: "Explore the mysterious attic",
            areaColor: "bg-purple-400",
            createdAgo: "1 week ago"
        },
        {
            id: 4,
            text: "Perfect the midnight zoomies routine",
            areaColor: "bg-yellow-400",
            createdAgo: "3 days ago"
        },
        {
            id: 5,
            text: "Befriend the neighbor's cat",
            areaColor: "bg-pink-400",
            createdAgo: "2 weeks ago"
        }
    ]);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Someday/Maybe
                </h3>
                <p className="text-gray-600">
                    Store ideas and possibilities you might want to do someday, but not right now.
                </p>
            </div>

            {/* Table */}
            <div className="border border-black/10 rounded-xl bg-white shadow-sm max-w-full overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black/10 bg-gray-50">
                            <th className="w-1/2 p-3 pl-6 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Item
                            </th>
                            <th className="w-1/10 p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
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
                                {/* Item */}
                                <td className="p-3 pl-6 align-top relative">
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

                                {/* Actions */}
                                <td className="p-3 align-top">
                                    <div className="flex items-center gap-2">
                                        <button className="px-3 py-1.5 rounded-3xl text-xs transition-colors cursor-pointer bg-black hover:bg-black/80 text-white">
                                            Activate
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
