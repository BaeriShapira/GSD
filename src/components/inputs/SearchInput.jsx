export function SearchInput({ value, onChange, placeholder = "Search…" }) {
    return (
        <input
            className="w-56 rounded-lg border border-black/10 px-3 py-2 bg-white"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
}