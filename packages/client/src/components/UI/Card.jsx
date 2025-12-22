export default function Card({
    title,
    description,
    selected = false,
    onClick,
    children,
    className = "",
    asButton = false,
}) {
    const Component = asButton ? "button" : "div";

    const baseClasses = `
        rounded-xl border px-4 py-4 transition cursor-pointer
        ${selected ? "border-black/70 dark:border-white/70 bg-black/90 dark:bg-white/90" : "border-black/10 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/40 dark:hover:border-white/40"}
        ${asButton ? "flex flex-col items-start w-full text-left" : ""}
        ${className}
    `;

    const content = children ? (
        children
    ) : (
        <>
            {title && (
                <div className={`text-sm font-semibold mb-1 ${selected ? "text-white dark:text-black" : "text-black/80 dark:text-white"}`}>
                    {title}
                </div>
            )}
            {description && (
                <div className={`text-xs ${selected ? "text-white/80 dark:text-black/80" : "text-black/60 dark:text-dark-text-secondary"}`}>
                    {description}
                </div>
            )}
        </>
    );

    return (
        <Component
            type={asButton ? "button" : undefined}
            onClick={onClick}
            className={baseClasses}
        >
            {content}
        </Component>
    );
}
