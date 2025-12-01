import ColumnFilterPopover from "./ColumnFilterPopover";

const urgencyOptions = [
    { id: 1, name: "⭐" },
    { id: 2, name: "⭐⭐" },
    { id: 3, name: "⭐⭐⭐" },
    { id: 4, name: "⭐⭐⭐⭐" },
    { id: 5, name: "⭐⭐⭐⭐⭐" },
];

export default function UrgencyFilterPopover({
    selected,          // מספר 1-5 או null
    onChange,          // פונקציה שמקבלת מספר או null
}) {
    // נעטוף את onChange כי ה-ColumnFilterPopover מחזיר string או null
    function handleChange(value) {
        if (value === null) {
            onChange(null);
        } else {
            onChange(Number(value));
        }
    }

    return (
        <ColumnFilterPopover
            options={urgencyOptions}
            selectedId={selected != null ? String(selected) : null}
            onChange={handleChange}
            labelKey="name"
            valueKey="id"
            placeholder="All urgency levels"
            title="Filter by urgency"
        />
    );
}
