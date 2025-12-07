import { useState } from "react";
import { Send } from "lucide-react";

export default function MobileBucketInput({ onAdd }) {
    const [value, setValue] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const text = value.trim();
        if (!text) return;

        onAdd(text);
        setValue("");
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative w-full">
                <input
                    className="input w-full pr-14 sm:pr-16 text-sm sm:text-base"
                    placeholder="Quick capture..."
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    autoFocus
                />

                <button
                    type="submit"
                    disabled={!value.trim()}
                    className="btn btn-primary absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                >
                    <Send size={14} className="sm:w-4 sm:h-4" />
                </button>
            </div>
        </form>
    );
}
