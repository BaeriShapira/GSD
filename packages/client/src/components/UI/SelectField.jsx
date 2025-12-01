// packages/client/src/components/UI/SelectField.jsx
export default function SelectField({
    value,
    onChange,
    options,
    placeholder = "Choose...",
    className = "",
    ...props
}) {
    const baseClassName =
        "w-full rounded-2xl border border-black/10 bg-[#f7f9fb] px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-black/10 cursor-pointer";

    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`${baseClassName} ${className}`}
            {...props}
        >
            {placeholder && (
                <option value="">{placeholder}</option>
            )}

            {options.map(opt => (
                <option
                    key={opt.id ?? opt.value}
                    value={opt.id ?? opt.value}
                >
                    {opt.name ?? opt.label}
                </option>
            ))}
        </select>
    );
}
