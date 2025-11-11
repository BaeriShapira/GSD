import React from "react";
import PhoneInput from "react-phone-input-2";


export default function SupplierForm({ initial, onSubmit, onCancel }) {
    const [f, setF] = React.useState(
        initial ?? {
            name: "",
            category: "",
            contactName: "",
            email: "",
            phone: "",
            website: "",
            channel: "email",
            tags: [],
        }
    );

    const [tag, setTag] = React.useState("");
    const change = (k, v) => setF((s) => ({ ...s, [k]: v }));

    const addTag = () => {
        const t = tag.trim();
        if (t && !f.tags.includes(t)) {
            change("tags", [...f.tags, t]);
            setTag("");
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(f);
            }}
            className="space-y-4"
        >
            {/* שורה 1: Supplier name + Contact person */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <h4 className="mb-1">Supplier name</h4>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="Supplier name"
                        value={f.name}
                        onChange={(e) => change("name", e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <h4 className="mb-1">Contact Person</h4>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="Contact Person"
                        value={f.contactName}
                        onChange={(e) => change("contactName", e.target.value)}
                    />
                </div>
            </div>

            {/* שורה 2: Email + Phone עם דגלים */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <h4 className="mb-1">Email</h4>
                    <input
                        type="email"
                        className="rounded-lg border px-3 py-2"
                        placeholder="Email"
                        value={f.email}
                        onChange={(e) => change("email", e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <h4 className="mb-1">Phone</h4>
                    <div className="rounded-lg border">
                        <PhoneInput
                            country={"il"}
                            value={f.phone || ""}
                            onChange={(val) => change("phone", val)} // לדוגמה: +972501234567
                            enableSearch
                            preferredCountries={["il", "us", "gb"]}
                            inputStyle={{ width: "100%", direction: "ltr" }}
                            containerStyle={{ width: "100%" }}
                            dropdownStyle={{ zIndex: 50 }}
                        />
                    </div>
                </div>
            </div>

            {/* שורה 3: Website + Communication method (select) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <h4 className="mb-1">Website</h4>
                    <input
                        type=""
                        className="rounded-lg border px-3 py-2"
                        placeholder="https://example.com"
                        value={f.website}
                        onChange={(e) => change("website", e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <h4 className="mb-1">Communication method</h4>
                    <select
                        className="rounded-lg border px-3 py-2"
                        value={f.channel}
                        onChange={(e) => change("channel", e.target.value)}
                    >
                        <option value="whatsapp">Whatsapp</option>
                        <option value="email">Email</option>
                        <option value="website">Website</option>
                    </select>
                </div>
            </div>


            {/* Category */}
            <div className="flex flex-col">
                <h4 className="mb-1">Category</h4>
                <input
                    className="rounded-lg border px-3 py-2"
                    placeholder="Category"
                    value={f.category}
                    onChange={(e) => change("category", e.target.value)}
                />
            </div>

            {/* Tags (שומר על שורה אחת – הקלדה + Enter, הצ'יפים מוצגים מתחת בתוך אותה תיבה) */}
            <div className="flex flex-col">
                <h4 className="mb-1">Tags</h4>
                <div className="rounded-lg border px-3 py-2">
                    <input
                        className="w-full outline-none"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" ? (e.preventDefault(), addTag()) : null
                        }
                        placeholder="Tag + Enter"
                    />
                    {f.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {f.tags.map((t) => (
                                <span
                                    key={t}
                                    className="rounded-full bg-black/5 px-2 py-0.5 text-xs"
                                >
                                    {t}
                                    <button
                                        type="button"
                                        className="cursor-pointer ml-1"
                                        onClick={() =>
                                            change("tags", f.tags.filter((x) => x !== t))
                                        }
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>


            {/* כפתורים */}
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="cursor-pointer rounded-lg border px-3 py-1.5  hover:opacity-80"
                >
                    Cancel
                </button>
                <button className="cursor-pointer rounded-lg px-3 py-1.5 text-white bg-brand-primary  hover:opacity-90">
                    Save
                </button>
            </div>
        </form >
    );
}
