// packages/client/src/components/UI/TagInput.jsx
import { useState } from "react";

export default function TagInput({
    tags,
    onChange,
    placeholder = "Type and press enter...",
    className = "",
}) {
    const [input, setInput] = useState("");

    function handleKeyDown(e) {
        if (e.key === "Enter" && input.trim()) {
            e.preventDefault();
            const value = input.trim();

            if (!tags.includes(value)) {
                onChange([...tags, value]);
            }
            setInput("");
        }
    }

    function removeTag(tag) {
        onChange(tags.filter(t => t !== tag));
    }

    return (
        <div
            className={`
                flex flex-wrap items-center gap-2 
                rounded-2xl border border-black/10 
                bg-[#f7f9fb] px-3 py-2
                ${className}
            `}
        >
            {tags.map(tag => (
                <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-white px-2 py-1 text-xs text-black/70 border border-black/10"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-black/40 hover:text-black/70"
                    >
                        ×
                    </button>
                </span>
            ))}

            <input
                className="flex-1 min-w-[120px] bg-transparent text-xs outline-none placeholder:text-black/40"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
            />
        </div>
    );
}
