import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatWidget from "../components/chat/ChatWidget";

export default function AppLayout() {
    return (
        <div className="min-h-screen w-full bg-brand-secondary">
            {/* Sidebar */}
            <Sidebar />

            {/* אזור תוכן */}
            <main className="ml-[256px] min-h-screen p-4">
                <div className="max-w-screen-2xl mx-auto">
                    <div className=" backdrop-blur p-4 min-h-screen">
                        <Outlet />
                    </div>
                </div>
            </main>

            <div className="min-h-screen w-full bg-brand-secondary flex flex-col">
                <ChatWidget />
            </div>

        </div>
    );
}
