export default function Modal({ open, title, onClose, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="rounded-lg px-2 py-1 hover:bg-black/5">✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}
