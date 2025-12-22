/**
 * Reusable loading state component with consistent container styling
 * @param {string} message - Optional loading message (default: "Loading...")
 * @param {string} className - Optional additional CSS classes
 */
export default function LoadingState({ message = "Loading...", className = "" }) {
    return (
        <div className={`my-10 border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm max-w-5xl ${className}`}>
            <div className="text-sm text-black/50 dark:text-white/50">{message}</div>
        </div>
    );
}
