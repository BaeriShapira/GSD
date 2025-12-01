import { CONTEXT_ICONS } from "../../config/contextIcons";

/**
 * Icon selector component for choosing a context icon
 * @param {string} value - Currently selected icon value
 * @param {Function} onChange - Callback when icon is selected
 */
export default function ContextIconSelector({ value, onChange }) {
    return (
        <div className="grid grid-cols-6 gap-2">
            {CONTEXT_ICONS.map((iconOption) => {
                const IconComponent = iconOption.component;
                const isSelected = value === iconOption.value;

                return (
                    <button
                        key={iconOption.value}
                        type="button"
                        onClick={() => onChange(iconOption.value)}
                        className={`
                            flex items-center justify-center p-3 rounded-lg
                            border-2 transition-all cursor-pointer
                            ${isSelected
                                ? "border-black/40 bg-black/5 scale-105"
                                : "border-black/10 bg-white hover:border-black/20 hover:bg-black/5"
                            }
                        `}
                        title={iconOption.label}
                    >
                        <IconComponent
                            size={24}
                            className={isSelected ? "text-black/80" : "text-black/60"}
                        />
                    </button>
                );
            })}
        </div>
    );
}
