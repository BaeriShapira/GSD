import React from "react";
import ChatLauncher from "./ChatLauncher";
import ChatPanel from "./ChatPanel";

export default function ChatWidget({ defaultOpen = false, open: controlledOpen, onOpenChange }) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = (v) => {
        if (!isControlled) setUncontrolledOpen(v);
        onOpenChange?.(v);
    };

    return (
        <>
            {/* ✅ הכפתור יוצג רק כשהצ'ט סגור */}
            {!open && (
                <div className="animate-fadeIn">
                    <ChatLauncher onOpen={() => setOpen(true)} />
                </div>
            )}


            {/* חלון הצ'ט */}
            <ChatPanel open={open} onClose={() => setOpen(false)} />
        </>
    );
}
