/**
 * Central configuration for Area of Life colors
 * Update colors here and they will automatically update everywhere in the app
 */

// Color options for the color picker in AreaOfLifeModal
export const COLOR_OPTIONS = [
    { value: "yellow", label: "Yellow", class: "bg-yellow-400" },
    { value: "green", label: "Green", class: "bg-green-400" },
    { value: "teal", label: "Teal", class: "bg-teal-400" },

    { value: "blue", label: "Blue", class: "bg-blue-400" },
    { value: "indigo", label: "Indigo", class: "bg-indigo-600" },
    { value: "fuchsia", label: "Fuchsia", class: "bg-fuchsia-600" },

    { value: "purple", label: "Purple", class: "bg-purple-400" },
    { value: "pink", label: "Pink", class: "bg-pink-400" },
    { value: "red", label: "Red", class: "bg-red-400" },
    { value: "orange", label: "Orange", class: "bg-orange-400" },
];

// Valid color values (for validation)
export const VALID_COLORS = ["yellow", "green", "blue", "purple", "pink", "red", "orange", "teal", "indigo", "fuchsia"];

// Color class mappings for shade 400 (most components)
export const colorClasses400 = {
    yellow: "bg-yellow-400",
    green: "bg-green-400",
    teal: "bg-teal-400",

    blue: "bg-blue-400",
    indigo: "bg-indigo-600",
    fuchsia: "bg-fuchsia-600",

    purple: "bg-purple-400",
    pink: "bg-pink-400",
    red: "bg-red-400",
    orange: "bg-orange-400",
};

// Color class mappings for shade 500 (SortableAreaCard, TimeBlockCard)
export const colorClasses500 = {
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    teal: "bg-teal-500",

    blue: "bg-blue-500",
    indigo: "bg-indigo-700",
    fuchsia: "bg-fuchsia-700",

    purple: "bg-purple-500",
    pink: "bg-pink-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
    white: "bg-gray-100",
};

// Color class mappings for shade 600 (TimeBlockCard hover)
export const colorClasses600 = {
    yellow: "bg-yellow-600",
    green: "bg-green-600",
    teal: "bg-teal-600",

    blue: "bg-blue-600",
    indigo: "bg-indigo-800",
    fuchsia: "bg-fuchsia-800",

    purple: "bg-purple-600",
    pink: "bg-pink-600",
    red: "bg-red-600",
    orange: "bg-orange-600",
    white: "bg-gray-200",
};

// Color mappings for light backgrounds and borders (SomedayBoard)
export const colorMapLight = {
    yellow: { bg: "bg-yellow-50", border: "border-yellow-200" },
    green: { bg: "bg-green-50", border: "border-green-200" },
    teal: { bg: "bg-teal-50", border: "border-teal-200" },

    blue: { bg: "bg-blue-50", border: "border-blue-200" },
    indigo: { bg: "bg-indigo-50", border: "border-indigo-400" },
    fuchsia: { bg: "bg-fuchsia-50", border: "border-fuchsia-400" },

    purple: { bg: "bg-purple-50", border: "border-purple-200" },
    pink: { bg: "bg-pink-50", border: "border-pink-200" },
    red: { bg: "bg-red-50", border: "border-red-200" },
    orange: { bg: "bg-orange-50", border: "border-orange-200" },
};
