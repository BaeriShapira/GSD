/**
 * Reusable error state component with consistent container styling
 * @param {string} message - Error message to display
 * @param {Error} error - Optional error object with additional details
 * @param {string} className - Optional additional CSS classes
 */
export default function ErrorState({ message = "An error occurred", error, className = "" }) {
    return (
        <div className={`my-10 border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm max-w-5xl ${className}`}>
            <div className="text-sm text-red-500 dark:text-red-400">
                {message}{error?.message ? `: ${error.message}` : ""}
            </div>
        </div>
    );
}
