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
    Lightbulb,
    Car,
    Laptop,
    Star,
    List,
    Crown,
    Triangle,
    AlertTriangle
} from "lucide-react";

/**
 * Central configuration for Context icons
 * All available icons for contexts with their labels
 */
export const CONTEXT_ICONS = [
    { value: "phone", label: "Phone", component: Phone },
    { value: "whatsapp", label: "WhatsApp", component: MessageCircle },
    { value: "email", label: "Email", component: Mail },
    { value: "home", label: "Home", component: Home },
    { value: "printer", label: "Printer", component: Printer },
    { value: "office", label: "Office", component: Building2 },
    { value: "shopping", label: "Shopping", component: ShoppingCart },
    { value: "settings", label: "Settings", component: Settings },
    { value: "tools", label: "Tools", component: Wrench },
    { value: "chair", label: "Chair", component: Armchair },
    { value: "lamp", label: "Lamp", component: Lightbulb },
    { value: "car", label: "Car", component: Car },
    { value: "laptop", label: "Laptop", component: Laptop },
    { value: "star", label: "Star", component: Star },
    { value: "list", label: "List", component: List },
    { value: "crown", label: "Crown", component: Crown },
    { value: "triangle", label: "Triangle", component: Triangle },
    { value: "alert", label: "Alert", component: AlertTriangle },
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
