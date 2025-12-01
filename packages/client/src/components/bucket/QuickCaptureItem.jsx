// components/quick-capture/QuickCaptureItem.jsx
import { useInlineEdit } from "../../hooks/useInlineEdit";
import AttachmentList from "../UI/AttachmentList";

export default function QuickCaptureItem({
    item,
    selected,
    onToggleSelect,
    onChangeText,
}) {
    const { isEditing, draft, setDraft, startEdit, commitEdit, handleKeyDown } = useInlineEdit(
        item.text,
        onChangeText
    );

    return (
        <div className="flex flex-col gap-1">
            {/* שורה: צ'קבוקס + טקסט */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    className="h-3 w-3 accent-black" // בלי mt-1
                    checked={selected}
                    onChange={onToggleSelect}
                />

                {isEditing ? (
                    <input
                        className="w-full px-2 py-1 text-lg font-bold text-black/80 rounded
                                   focus:outline-none focus:ring focus:ring-black/10"
                        value={draft}
                        autoFocus
                        onChange={e => setDraft(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <span
                        className="cursor-text"
                        onDoubleClick={startEdit}
                    >
                        <h4 className="px-2 py-1 text-[16px]">{item.text}</h4>
                    </span>
                )}
            </div>

            {/* Attachments */}
            <AttachmentList attachments={item.attachments} className="pl-7" />
        </div>
    );
}
