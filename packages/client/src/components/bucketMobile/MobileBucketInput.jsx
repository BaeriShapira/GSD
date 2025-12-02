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
                    className="input w-full pr-16"
                    placeholder="Quick capture..."
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    autoFocus
                />

                <button
                    type="submit"
                    disabled={!value.trim()}
                    className="btn btn-primary absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={16} />
                </button>
            </div>
        </form>
    );
}
