import { MessageCircle } from "lucide-react";
import logoUrl from "../../assets/CHAT_WIZARD.svg";


export default function ChatLauncher({ onOpen }) {
    return (
        <button
            aria-label="Open chat"
            onClick={onOpen}
            className="cursor-pointer fixed bottom-5 right-5 z-60 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-xl border border-white/20 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
            <img
                src={logoUrl}
                alt="GSD cat"
                className="w-40 h-10 md:w-80 md:h-20 object-contain select-none"
                draggable="false"
            />
            {/* באדג' לאופציונלי */}
            {/* <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1.5 text-[10px] font-semibold text-white shadow">1</span> */}
        </button>
    );
}
