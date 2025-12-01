/**
 * Reusable loading state component with consistent container styling
 * @param {string} message - Optional loading message (default: "Loading...")
 * @param {string} className - Optional additional CSS classes
 */
export default function LoadingState({ message = "Loading...", className = "" }) {
    return (
        <div className={`my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm max-w-5xl ${className}`}>
            <div className="text-sm text-black/50">{message}</div>
        </div>
    );
}
