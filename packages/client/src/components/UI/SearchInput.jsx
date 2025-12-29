import { Search, X } from "lucide-react";
import { useState } from "react";

export default function SearchInput({
    value = "",
    onChange,
    onClear,
    placeholder = "Search...",
    className = "",
}) {
    const [isFocused, setIsFocused] = useState(false);

    function handleClear() {
        onChange("");
        onClear?.();
    }

    return (
        <div
            className={`
                w-90 flex items-center gap-2
                rounded-2xl border border-black/10
                bg-[#f7f9fb] px-3 py-2
                transition-all
                ${isFocused ? 'ring-2 ring-black/5' : ''}
                ${className}
            `}
        >
            <Search size={16} className="text-black/40 flex-shrink-0" />

            <input
                type="text"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-black/40"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
            />

            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
                >
                    <X size={14} className="text-black/40 hover:text-black/70" />
                </button>
            )}
        </div>
    );
}
