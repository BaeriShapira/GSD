import { useEffect, useState } from "react";
import { getUserStats } from "../../api/adminApi";
import { Users, Target, CheckCircle2, Calendar, FolderKanban } from "lucide-react";

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
            <div className="border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm">
                <h2>Statistics</h2>
                <p className="text-black/60 dark:text-dark-text-secondary">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm">
                <h2>Statistics</h2>
                <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* User Statistics */}
            <div className="border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Users size={24} className="text-black/80 dark:text-white/80" />
                    <h2>User Statistics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.users?.total || 0}</p>
                    </div>
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">Today</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.users?.today || 0}</p>
                    </div>
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">This Week</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.users?.thisWeek || 0}</p>
                    </div>
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">This Month</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.users?.thisMonth || 0}</p>
                    </div>
                </div>
            </div>

            {/* Task Statistics */}
            <div className="border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={24} className="text-black/80 dark:text-white/80" />
                    <h2>Task Statistics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">Total Tasks</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.tasks?.total || 0}</p>
                    </div>
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">Today</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.tasks?.today || 0}</p>
                    </div>
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">This Week</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.tasks?.thisWeek || 0}</p>
                    </div>
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">This Month</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.tasks?.thisMonth || 0}</p>
                    </div>
                </div>
            </div>

            {/* Project Statistics */}
            <div className="border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <FolderKanban size={24} className="text-black/80 dark:text-white/80" />
                    <h2>Project Statistics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">Total Projects</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.projects?.total || 0}</p>
                    </div>
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">Today</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.projects?.today || 0}</p>
                    </div>
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">This Week</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.projects?.thisWeek || 0}</p>
                    </div>
                    <div className="border border-black/10 dark:border-dark-border rounded-lg p-4 bg-black/5 dark:bg-white/5">
                        <p className="text-sm font-medium text-black/60 dark:text-dark-text-secondary mb-1">This Month</p>
                        <p className="text-3xl font-bold text-black/80 dark:text-white">{stats?.projects?.thisMonth || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
