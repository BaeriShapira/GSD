import { Mail, Globe, MessageCircle, Phone } from "lucide-react";
const map = { whatsapp: [MessageCircle, "Whatsapp"], email: [Mail, "Email"], api: [Globe, "Api"], phone: [Phone, "Phone"], website: [Globe, "Website"] };
export default function ChannelPill({ type }) {
    const [Icon, label] = map[type] ?? map.website;
    return <span className="inline-flex items-center gap-2 text-sm text-black/80"><Icon className="h-4 w-4" />{label}</span>;
}
