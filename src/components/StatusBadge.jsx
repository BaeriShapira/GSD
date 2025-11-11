import { CheckCircle2, AlertTriangle } from "lucide-react";
export default function StatusBadge({ status }) {
    return status === "active" ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" /> Active
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs">
            <AlertTriangle className="h-3.5 w-3.5" /> On hold
        </span>
    );
}
