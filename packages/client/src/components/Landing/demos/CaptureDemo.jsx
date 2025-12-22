import { useState } from "react";

export default function CaptureDemo() {
    const [inputValue, setInputValue] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [items, setItems] = useState([
        { id: 1, text: "Chase my yom" },
        { id: 2, text: "Eat fish & kibble" },
        { id: 3, text: "Chase the laser" },
        { id: 4, text: "Knock over the milk" },
        { id: 5, text: "Sit in a box" },
        { id: 6, text: "Take a nap" },
    ]);

    function handleAdd() {
        const text = inputValue.trim();
        if (!text) return;

        const newItem = {
            id: Date.now(),
            text: text,
        };
        setItems([...items, newItem]);
        setInputValue("");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    }

    function handleToggleSelect(id) {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }

    function handleDeleteSelected() {
        setItems(items.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Your Processing Bucket
                </h3>
                <p className="text-gray-600">
                    Quickly capture anything that comes to mind. Tasks, ideas, reminders - everything goes into your bucket first, then you can process them later.
                </p>
            </div>

            {/* Styled like QuickCaptureBoard */}
            <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                {/* Input + Actions Row */}
                <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:gap-6">
                    {/* Input */}
                    <div className="w-full lg:max-w-100 lg:flex-1 min-w-0">
                        <div className="relative w-full">
                            <input
                                className="w-full pr-32 px-4 py-2.5 text-base
                                           border border-black/10 rounded-lg
                                           bg-white text-black placeholder:text-black/50
                                           focus:outline-none focus:ring-2 focus:ring-black/10
                                           transition-all"
                                placeholder="Quick capture..."
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2
                                            flex items-center gap-3 text-sm text-black/50">
                                <div className="pl-2 text-sm text-black/50 border-l border-black/10">
                                    Enter ↵
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full lg:w-auto lg:ml-auto gap-2">
                        <button
                            onClick={handleDeleteSelected}
                            disabled={selectedIds.length === 0}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Delete Selected
                        </button>
                    </div>
                </div>

                {/* Items List */}
                {items.length === 0 ? (
                    <p className="text-sm text-black/40 mt-2">
                        No captured items yet. Start typing above ✍️
                    </p>
                ) : (
                    <div className="space-y-2 mt-2">
                        {items.map((item) => (
                            <div key={item.id} className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="h-3 w-3 accent-black cursor-pointer"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => handleToggleSelect(item.id)}
                                    />
                                    <span className="cursor-text">
                                        <h4 className="px-2 py-1 text-[16px] text-black">{item.text}</h4>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
