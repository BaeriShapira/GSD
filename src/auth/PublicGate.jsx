import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PublicGate() {
    const { user, loading } = useAuth();
    if (loading) return <div className="p-6">Loading…</div>;
    return user ? <Navigate to="/app" replace /> : <Outlet />;
}
