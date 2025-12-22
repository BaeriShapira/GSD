import { Folder } from "lucide-react";

export default function ReferenceDemo() {
    const folders = [
        { id: 1, name: "Favorite toys", itemCount: 8 },
        { id: 2, name: "Napping spots", itemCount: 12 },
        { id: 3, name: "Treats recipes", itemCount: 5 },
        { id: 4, name: "Bird watching tips", itemCount: 15 },
        { id: 5, name: "Scratching posts", itemCount: 6 },
        { id: 6, name: "Hunting techniques", itemCount: 9 }
    ];

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Reference
                </h3>
                <p className="text-gray-600">
                    Organize your reference materials in folders. Store useful information you might need later.
                </p>
            </div>

            {/* Folders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {folders.map((folder) => (
                    <div
                        key={folder.id}
                        className="relative group bg-gray-100 rounded-xl p-4 hover:bg-gray-200 transition-colors cursor-pointer border border-transparent hover:border-gray-300"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Folder size={24} className="text-gray-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-800 truncate">
                                        {folder.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {folder.itemCount} {folder.itemCount === 1 ? 'item' : 'items'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
