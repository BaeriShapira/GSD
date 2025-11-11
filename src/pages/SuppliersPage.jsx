import React from "react";
import { useSuppliers } from "../hooks/useSuppliers";
import SupplierTable from "../components/suppliers/SupplierTable";
import Modal from "../components/Modal";
import SupplierForm from "../components/suppliers/SupplierForm";
import PageToolbar from "../layouts/PageToolbar";
import { SearchInput } from "../components/inputs/SearchInput";
import { Plus } from "lucide-react";

export default function SuppliersPage() {
    const { list, upsert, remove } = useSuppliers();
    const [q, setQ] = React.useState("");
    const [sel, setSel] = React.useState(new Set());
    const [open, setOpen] = React.useState(false);
    const [editing, setEditing] = React.useState(null);

    const filtered = React.useMemo(() => {
        const s = q.toLowerCase().trim(); if (!s) return list;
        return list.filter(x =>
            [x.name, x.category, x.contactName, x.email, (x.tags || []).join(" ")]
                .join(" ")
                .toLowerCase()
                .includes(s)
        );
    }, [q, list]);

    const toggleAll = () =>
        setSel(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(x => x.id)));

    const toggleOne = (id) =>
        setSel(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

    return (
        <section className="space-y-4">
            <PageToolbar
                title="Suppliers"
                breadcrumbs={[{ label: "App", to: "/app" }, { label: "Suppliers" }]}
                right={
                    <>
                        <SearchInput value={q} onChange={setQ} placeholder="Search suppliers…" />
                        <button
                            onClick={() => { setEditing(null); setOpen(true); }}
                            className=" cursor-pointer inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white bg-brand-primary hover:opacity-90"
                        >
                            <Plus className="h-4 w-4" /> New supplier
                        </button>
                    </>
                }
            // bottom={...} // אופציונלי: טאבים/פילטרים ייעודיים
            />

            <SupplierTable
                rows={filtered}
                selectedIds={sel}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
                onEdit={(row) => { setEditing(row); setOpen(true); }}
                onDelete={(id) => remove(id)}
                onRate={(id, v) => upsert({ ...list.find(x => x.id === id), rating: v })}
            />

            <Modal open={open} title={editing ? "Edit supplier" : "New supplier"} onClose={() => setOpen(false)}>
                <SupplierForm
                    initial={editing}
                    onCancel={() => setOpen(false)}
                    onSubmit={(data) => {
                        upsert(editing ? { ...editing, ...data } : { ...data });
                        setOpen(false);
                    }}
                />
            </Modal>
        </section>
    );
}
