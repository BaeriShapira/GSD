import { useAreas } from "../../hooks/useAreas";
import { colorClasses400 } from "../../config/areaColors";

export default function AreaOfLifeSelector({ value, onChange, label = "Area of Life (optional)" }) {
    const { areas, isLoading } = useAreas();

    return (
        <div>
            <label className="block text-sm font-medium text-black/80 mb-2">
                {label}
            </label>
            {isLoading ? (
                <div className="text-sm text-black/50">Loading areas...</div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm transition-colors ${value === null
                            ? "bg-black/10 text-black font-medium"
                            : "bg-white border border-black/10 text-black/60 hover:bg-black/5"
                            }`}
                    >
                        None
                    </button>
                    {areas.map((area) => (
                        <button
                            key={area.id}
                            type="button"
                            onClick={() => onChange(area.id)}
                            className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${value === area.id
                                ? "bg-black/10 text-black font-medium"
                                : "bg-white border border-black/10 text-black/60 hover:bg-black/5"
                                }`}
                        >
                            <div
                                className={`w-3 h-3 rounded-full ${colorClasses400[area.color] || "bg-gray-400"
                                    }`}
                            />
                            {area.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
