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
                rounded-2xl border border-black/10 dark:border-dark-border
                bg-[#f7f9fb] dark:bg-dark-surface px-3 py-2
                transition-all
                ${isFocused ? 'ring-2 ring-black/5 dark:ring-white/10' : ''}
                ${className}
            `}
        >
            <Search size={16} className="text-black/40 dark:text-dark-text-secondary flex-shrink-0" />

            <input
                type="text"
                className="flex-1 bg-transparent text-sm outline-none text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40"
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
                    className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <X size={14} className="text-black/40 dark:text-dark-text-secondary hover:text-black/70 dark:hover:text-white" />
                </button>
            )}
        </div>
    );
}
