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
        ${selected ? "border-black/70 bg-black/90" : "border-black/10 bg-white hover:bg-black/5 hover:border-black/40"}
        ${asButton ? "flex flex-col items-start w-full text-left" : ""}
        ${className}
    `;

    const content = children ? (
        children
    ) : (
        <>
            {title && (
                <div className={`text-sm font-semibold mb-1 ${selected ? "text-white" : "text-black/80"}`}>
                    {title}
                </div>
            )}
            {description && (
                <div className={`text-xs ${selected ? "text-white/80" : "text-black/60"}`}>
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
