import React from "react";
import { MessageCircle, Minus, X } from "lucide-react";

export default function ChatPanel({ open, onClose }) {
    const panelRef = React.useRef(null);

    // סגירה ב-ESC
    React.useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose?.();
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // סגירה בלחיצה מחוץ
    React.useEffect(() => {
        const onClick = (e) => {
            if (!open) return;
            if (panelRef.current && !panelRef.current.contains(e.target)) onClose?.();
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [open, onClose]);

    return (
        <div
            className={[
                "fixed bottom-5 right-5 z-50 transition-transform",
                open ? "pointer-events-auto translate-y-0" : "pointer-events-none translate-y-6",
            ].join(" ")}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="AI Chat"
                className={[
                    "pointer-events-auto w-[92vw] max-w-[480px] overflow-hidden rounded-2xl border border-black/10 bg-white/95 backdrop-blur shadow-2xl",
                    open ? "opacity-100" : "opacity-0",
                    "transition-opacity duration-200",
                ].join(" ")}
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-black/[0.03] px-3 py-2">
                    <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-primary/10">
                            <MessageCircle className="h-4 w-4 text-brand-primary" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-black/90">GSD Agent</div>
                            <div className="text-[11px] text-black/50">online</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            aria-label="Minimize"
                            onClick={onClose}
                            className="rounded-md p-1.5 text-black/60 hover:bg-black/10"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <button
                            aria-label="Close"
                            onClick={onClose}
                            className="rounded-md p-1.5 text-black/60 hover:bg-black/10"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Messages (דמו) */}
                <div className="max-h-[60vh] min-h-[260px] overflow-y-auto px-3 py-3">
                    <div className="mb-3 flex gap-2">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-primary/10 text-brand-primary">
                            AI
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-black/[0.05] px-3 py-2 text-sm text-black/90">
                            היי! אני סוכן ה־GSD שלך. איך אפשר לעזור?
                        </div>
                    </div>

                    <div className="mb-3 flex justify-end gap-2">
                        <div className="rounded-2xl rounded-tr-sm bg-brand-primary px-3 py-2 text-sm text-white max-w-[75%]">
                            תייצר לי מסך ספקים עם חיפוש ועריכה
                        </div>
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-primary text-white">
                            אתה
                        </div>
                    </div>
                </div>

                {/* Input */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        // TODO: חיבור ל-API בהמשך
                    }}
                    className="flex items-end gap-2 border-t border-black/10 bg-white px-3 py-2"
                >
                    <textarea
                        rows={1}
                        placeholder="כתוב הודעה…"
                        className="max-h-28 min-h-[40px] w-full resize-y rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                    />
                    <button
                        type="submit"
                        className="cursor-pointer rounded-xl bg-brand-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        send
                    </button>
                </form>
            </div>
        </div>
    );
}
