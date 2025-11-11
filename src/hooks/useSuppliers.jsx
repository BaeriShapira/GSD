import React from "react";

const LS_KEY = "gsd_suppliers";

const demo = [
    { id: crypto.randomUUID(), name: "Jaco Shirts – Blanks", status: "active", category: "Apparel", contactName: "Dalia", email: "dalia@jacoshirts.co.il", channel: "whatsapp", rating: 4, leadDays: 5, tags: ["local", "priority"] },
];

export function useSuppliers() {
    const [list, setList] = React.useState(() => {
        try { return JSON.parse(localStorage.getItem(LS_KEY)) || demo; } catch { return demo; }
    });
    React.useEffect(() => localStorage.setItem(LS_KEY, JSON.stringify(list)), [list]);

    const upsert = (row) =>
        setList(prev => row.id ? prev.map(x => x.id === row.id ? row : x)
            : [{ id: crypto.randomUUID(), ...row }, ...prev]);
    const remove = (id) => setList(prev => prev.filter(x => x.id !== id));

    return { list, setList, upsert, remove };
}
