/**
 * Reusable error state component with consistent container styling
 * @param {string} message - Error message to display
 * @param {Error} error - Optional error object with additional details
 * @param {string} className - Optional additional CSS classes
 */
export default function ErrorState({ message = "An error occurred", error, className = "" }) {
    return (
        <div className={`my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm max-w-5xl ${className}`}>
            <div className="text-sm text-red-500">
                {message}{error?.message ? `: ${error.message}` : ""}
            </div>
        </div>
    );
}
