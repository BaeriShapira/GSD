import { useEffect, useState } from "react";
import { getMostActiveUsers } from "../../api/adminApi";
import { TrendingUp } from "lucide-react";

export default function MostActiveUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        loadUsers();
    }, [limit]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMostActiveUsers(limit);
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp size={24} className="text-black/80 dark:text-white/80" />
                    <h2>Most Active Users</h2>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-black/60 dark:text-dark-text-secondary">Show:</label>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(parseInt(e.target.value))}
                        className="px-3 py-1 border border-black/10 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-bg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            {loading && <p className="text-black/60 dark:text-dark-text-secondary">Loading...</p>}

            {error && <p className="text-red-600 dark:text-red-400">Error: {error}</p>}

            {!loading && !error && users.length === 0 && (
                <p className="text-black/60 dark:text-dark-text-secondary">No users found</p>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-black/10 dark:border-dark-border">
                                <th className="text-left py-3 px-4 text-sm font-medium text-black/60 dark:text-dark-text-secondary">#</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-black/60 dark:text-dark-text-secondary">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-black/60 dark:text-dark-text-secondary">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-black/60 dark:text-dark-text-secondary">Tasks Created</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-black/60 dark:text-dark-text-secondary">Member Since</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id} className="border-b border-black/5 dark:border-dark-border hover:bg-black/5 dark:hover:bg-white/5">
                                    <td className="py-3 px-4 text-sm text-black/80 dark:text-white font-medium">{index + 1}</td>
                                    <td className="py-3 px-4 text-sm text-black/80 dark:text-white">{user.name || "N/A"}</td>
                                    <td className="py-3 px-4 text-sm text-black/60 dark:text-dark-text-secondary">{user.email}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-purple-950/10 dark:bg-purple-400/20 text-purple-950 dark:text-purple-300 font-semibold">
                                            {user.taskCount}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-black/60 dark:text-dark-text-secondary">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
