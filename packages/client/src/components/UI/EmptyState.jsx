/**
 * Reusable empty state component with icon, title, and description
 * @param {ReactNode} icon - Icon component to display
 * @param {string} title - Main heading text
 * @param {string} description - Optional description text
 * @param {ReactNode} action - Optional action button or component
 * @param {string} className - Optional additional CSS classes
 */
export default function EmptyState({ icon, title, description, action, className = "" }) {
    return (
        <div className={`text-center py-16 ${className}`}>
            {icon && (
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                    {icon}
                </div>
            )}
            {title && (
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h3>
            )}
            {description && (
                <p className="text-gray-500 dark:text-gray-500 mb-6">{description}</p>
            )}
            {action}
        </div>
    );
}
