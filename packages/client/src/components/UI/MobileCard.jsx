/**
 * Shared mobile card component
 * Consistent styling for all mobile item cards
 */
export default function MobileCard({ children, className = "" }) {
    return (
        <div className={`bg-white border border-black/10 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm ${className}`}>
            {children}
        </div>
    );
}
