import { useEffect, useState } from "react";
import { getUserStats } from "../../api/adminApi";
import { Users, Target, CheckCircle2 } from "lucide-react";

export default function UsersStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUserStats();
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                <h2>User Statistics</h2>
                <p className="text-black/60">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                <h2>User Statistics</h2>
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            <h2>User Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {/* Total Users */}
                <div className="border border-black/10 rounded-lg p-4 bg-black/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Users size={24} className="text-black/60" />
                        <p className="text-sm font-medium text-black/60">Total Users</p>
                    </div>
                    <p className="text-3xl font-bold text-black/80">{stats?.users?.total || 0}</p>
                </div>

                {/* Active Users (Last 30 days) */}
                <div className="border border-black/10 rounded-lg p-4 bg-black/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Target size={24} className="text-black/60" />
                        <p className="text-sm font-medium text-black/60">Active (30d)</p>
                    </div>
                    <p className="text-3xl font-bold text-black/80">{stats?.users?.active || 0}</p>
                </div>

                {/* New Users (Last 7 days) */}
                <div className="border border-black/10 rounded-lg p-4 bg-black/5">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 size={24} className="text-black/60" />
                        <p className="text-sm font-medium text-black/60">New (7d)</p>
                    </div>
                    <p className="text-3xl font-bold text-black/80">{stats?.users?.new || 0}</p>
                </div>
            </div>

            {/* Task Statistics */}
            <div className="mt-6 border-t border-black/10 pt-6">
                <h3 className="text-lg font-semibold text-black/80 mb-4">Task Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-black/10 rounded-lg p-4 bg-black/5">
                        <p className="text-sm font-medium text-black/60 mb-1">Total Tasks</p>
                        <p className="text-2xl font-bold text-black/80">{stats?.tasks?.total || 0}</p>
                    </div>
                    <div className="border border-black/10 rounded-lg p-4 bg-black/5">
                        <p className="text-sm font-medium text-black/60 mb-1">Completed Tasks</p>
                        <p className="text-2xl font-bold text-black/80">{stats?.tasks?.completed || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
