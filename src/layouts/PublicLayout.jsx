import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function AppLayout() {
    return (
        <div className="min-h-screen w-full bg-brand-secondary flex flex-col items-center">
            <Header />
            <main className="flex-1 w-full flex justify-center mt-8">
                <div className="w-[98%] md:w-[94%] lg:w-[92%] max-w-screen-2xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
