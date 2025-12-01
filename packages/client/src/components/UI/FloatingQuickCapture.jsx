import { useState, useRef, useEffect } from "react";
import { Plus, X, Send } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { BsBucketFill, BsFolderFill } from "react-icons/bs";


export default function FloatingQuickCapture() {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState("");
    const inputRef = useRef(null);
    const { createTask } = useTasks("BUCKET");

    // Auto-focus input when opening
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            await createTask({ text: text.trim(), status: "BUCKET" });
            setText("");
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to create task:", error);
            alert("Failed to create task. Please try again.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            setText("");
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full shadow-lg
                    flex items-center justify-center transition-all cursor-pointer
                    ${isOpen
                        ? "bg-gray-400 hover:bg-gray-300 rotate-45"
                        : "bg-brand-primary hover:bg-brand-primary/90"
                    }`}
                aria-label={isOpen ? "Close quick capture" : "Quick capture"}
            >
                {isOpen ? (
                    <BsBucketFill className="w-4 h-4 text-black" />
                ) : (
                    <BsBucketFill className="w-4 h-4 text-white" />
                )}
            </button>

            {/* Quick Capture Input Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => {
                            setIsOpen(false);
                            setText("");
                        }}
                        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                    />

                    {/* Input Panel */}
                    <div className="fixed bottom-24 right-8 z-50 w-96 bg-white rounded-xl shadow-2xl border border-black/10 p-4">
                        <h3 className="text-lg font-bold text-brand-primary mb-3">
                            Quick Capture
                        </h3>

                        <form onSubmit={handleSubmit} className="relative">
                            <textarea
                                ref={inputRef}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add to your Processing Bucket. (Press Enter to save, or Esc to cancel)"
                                className="w-full min-h-[100px] p-3 pr-12 border border-black/10 rounded-lg
                                           focus:outline-none focus:ring-2 focus:ring-brand-primary
                                           resize-none text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!text.trim()}
                                className="absolute bottom-3 right-3 p-2 rounded-lg bg-brand-primary text-white
                                           hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed
                                           transition-colors cursor-pointer"
                                title="Save to inbox (Enter)"
                            >
                                <Send size={16} />
                            </button>
                        </form>

                    </div>
                </>
            )}
        </>
    );
}
