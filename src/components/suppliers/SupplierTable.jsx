import SupplierRow from "./SupplierRow";

export default function SupplierTable({ rows, selectedIds, onToggleAll, onToggleOne, onEdit, onDelete, onRate }) {
    return (
        <div className="overflow-auto rounded-2xl border border-black/10 bg-white px-4">
            <table className="min-w-[900px] w-full text-sm ">
                <thead>
                    <tr className="text-black/70">
                        <th className="px-4 py-6 text-left">Name</th>
                        <th className="px-4 py-6 text-left">Category</th>
                        <th className="px-4 py-6 text-left">Contact</th>
                        <th className="px-4 py-6 text-left">Channel</th>
                        <th className="px-4 py-6 text-left">Tags</th>
                        <th className="px-4" />
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <SupplierRow
                            key={row.id}
                            row={row}
                            selected={selectedIds.has(row.id)}
                            onToggle={() => onToggleOne(row.id)}
                            onEdit={() => onEdit(row)}
                            onDelete={() => onDelete(row.id)}
                            onRate={(v) => onRate(row.id, v)}
                        />
                    ))}
                    {rows.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-black/50">No suppliers found</td></tr>}
                </tbody>
            </table>
        </div>
    );
}
