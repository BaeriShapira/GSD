import { Star, StarHalf, StarOff } from "lucide-react";
export default function Stars({ value = 0, onChange }) {
    const full = Math.floor(value), half = value % 1 >= 0.5;
    return (
        <div className="inline-flex">
            {[0, 1, 2, 3, 4].map(i => {
                const Icon = i < full ? Star : i === full && half ? StarHalf : StarOff;
                return <button key={i} className="p-0.5 text-black/70 hover:text-brand-primary"
                    onClick={onChange ? () => onChange(i + 1) : undefined}><Icon className="h-4 w-4" /></button>;
            })}
        </div>
    );
}
