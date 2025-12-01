import {
    Phone,
    MessageCircle,
    Mail,
    Home,
    Printer,
    Building2,
    ShoppingCart,
    Settings,
    Wrench,
    Armchair,
    Lightbulb
} from "lucide-react";

/**
 * Central configuration for Context icons
 * All available icons for contexts with their labels
 */
export const CONTEXT_ICONS = [
    { value: "phone", label: "טלפון", component: Phone },
    { value: "whatsapp", label: "ווטסאפ", component: MessageCircle },
    { value: "email", label: "מייל", component: Mail },
    { value: "home", label: "בית", component: Home },
    { value: "printer", label: "מדפסת", component: Printer },
    { value: "office", label: "משרד", component: Building2 },
    { value: "shopping", label: "קניות", component: ShoppingCart },
    { value: "settings", label: "גלגל שיניים", component: Settings },
    { value: "tools", label: "כלי עבודה", component: Wrench },
    { value: "chair", label: "כסא", component: Armchair },
    { value: "lamp", label: "מנורה", component: Lightbulb },
];

/**
 * Valid icon values for validation
 */
export const VALID_CONTEXT_ICONS = CONTEXT_ICONS.map(icon => icon.value);

/**
 * Get icon component by value
 */
export function getContextIcon(iconValue) {
    const icon = CONTEXT_ICONS.find(i => i.value === iconValue);
    return icon?.component || Settings;
}
