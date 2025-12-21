import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import UsersStats from "../components/Admin/UsersStats";
import AllUsersList from "../components/Admin/AllUsersList";
import BroadcastEmailForm from "../components/Admin/BroadcastEmailForm";
import { Shield } from "lucide-react";

export default function AdminPanel() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin (userId === 1)
        if (!user) {
            setLoading(false);
            return;
        }

        if (user.id !== 1) {
            // Not admin - redirect to dashboard
            navigate("/app/dashboard", { replace: true });
            return;
        }

        setLoading(false);
    }, [user, navigate]);

    if (loading || !user) {
        return (
            <div className="p-6">
                <p className="text-black/60">Loading...</p>
            </div>
        );
    }

    // Only show admin panel if user.id === 1
    if (user.id !== 1) {
        return null;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Shield size={32} className="text-black/80" />
                    <h1 className="text-3xl font-bold text-black/80">Admin Panel</h1>
                </div>
                <p className="text-black/60">
                    Manage users, view statistics, and send broadcast emails.
                </p>
            </div>

            {/* Statistics */}
            <div className="mb-6">
                <UsersStats />
            </div>

            {/* All Users List */}
            <div className="mb-6">
                <AllUsersList />
            </div>

            {/* Broadcast Email */}
            <div>
                <BroadcastEmailForm />
            </div>
        </div>
    );
}
