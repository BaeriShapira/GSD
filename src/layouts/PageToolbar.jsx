export default function PageToolbar({
    title,
    subtitle,
    breadcrumbs,          // [{label,to}] (אופציונלי)
    right,                // ReactNode – אזור כפתורים/אקשנים מצד ימין
    bottom,               // ReactNode – טאבס/פילטרים שיושבים מתחת לשורה
    sticky = false,       // להפוך ל-toolbar דביק
    className = "",
}) {
    return (
        <header className={`${sticky ? "sticky top-0 z-20 backdrop-blur bg-white/80" : ""}`}>
            <div className={`flex items-center justify-between py-3 ${className}`}>
                <div className="min-w-0">
                    {breadcrumbs?.length > 0 && (
                        <nav className="mb-1 text-xs text-black/60">
                            {breadcrumbs.map((b, i) => (
                                <span key={i}>
                                    {i > 0 && <span className="mx-2">/</span>}
                                    {b.to ? <a href={b.to} className="hover:underline">{b.label}</a> : b.label}
                                </span>
                            ))}
                        </nav>
                    )}
                    <h1 className="text-xl font-bold text-brand-primary truncate">{title}</h1>
                    {subtitle && <p className="text-sm text-black/60 truncate">{subtitle}</p>}
                </div>

                {/* אזור אקשנים ימני (חיפוש, כפתורים וכו') */}
                <div className="flex items-center gap-2 shrink-0">{right}</div>
            </div>

            {/* אזור תחתון לטאבים/פילטרים */}
            {bottom && <div className="pt-2">{bottom}</div>}
        </header>
    );
}
