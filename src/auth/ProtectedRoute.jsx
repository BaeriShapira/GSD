import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-6">Loading…</div>;

    return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
