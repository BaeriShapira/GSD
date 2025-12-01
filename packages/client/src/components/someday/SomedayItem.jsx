import { useInlineEdit } from "../../hooks/useInlineEdit";
import AttachmentList from "../UI/AttachmentList";

export default function SomedayItem({
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
        <div className="flex flex-col gap-1 ">
            {/* שורה: צ'קבוקס + טקסט */}
            <div className="flex gap-3 items-center">
                <input
                    type="checkbox"
                    className="h-4 w-4 accent-black mt-1"
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
                        className="cursor-text "
                        onDoubleClick={startEdit}
                    >
                        <h3 className="px-2 py-1">{item.text}</h3>
                    </span>
                )}
            </div>

            {/* Attachments */}
            <AttachmentList attachments={item.attachments} className="pl-7 items-center" />
        </div >
    );
}
