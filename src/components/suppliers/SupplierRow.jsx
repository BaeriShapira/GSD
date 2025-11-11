import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "../StatusBadge";
import ChannelPill from "../ChannelPill";
import Tag from "../Tag";

export default function SupplierRow({ row, selected, onToggle, onEdit, onDelete, onRate }) {
    return (
        <tr className="border-t border-black/10">
            <td className="px-4 py-4 align-top">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-black/90">{row.name}</span>
                </div>
                <a className="text-black/40  text-sm" href={row.website} target="_blank">{row.website}</a>
            </td>
            <td className="px-4 py-4 align-top">{row.category}</td>
            <td className="px-4 py-4 align-top">
                <div>{row.contactName}</div>
                <a className="text-brand-primary underline text-xs" href={`mailto:${row.email}`}>{row.email}</a>
                <div>{row.phone}</div>
            </td>
            <td className="px-4 py-4 align-top"><ChannelPill type={row.channel} /></td>
            <td className="px-4 py-4 align-top"><div className="flex flex-wrap gap-2"><div className="flex flex-wrap gap-2">
                {row.tags?.map((t) => <Tag key={t}>{t}</Tag>)}
            </div></div></td>
            <td className="px-4 py-4 align-top">
                <div className="flex gap-1">
                    <button className="cursor-pointer p-1 rounded hover:bg-black/5" onClick={onEdit}><Pencil className="h-4 w-4" /></button>
                    <button className="cursor-pointer p-1 rounded hover:bg-black/5 text-red-600" onClick={onDelete}><Trash2 className="h-4 w-4" /></button>
                </div>
            </td>
        </tr>
    );
}
