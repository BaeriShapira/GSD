import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/adminApi";
import { Users } from "lucide-react";

export default function AllUsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            console.log("🟢 AllUsersList: Starting to load users...");
            setLoading(true);
            setError(null);
            const data = await getAllUsers();
            console.log("🟢 AllUsersList: Got users:", data);
            setUsers(data);
        } catch (err) {
            console.error("🔴 AllUsersList: Error loading users:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Users size={24} className="text-black/80" />
                <h2>All Users</h2>
            </div>

            {loading && <p className="text-black/60">Loading...</p>}

            {error && <p className="text-red-600">Error: {error}</p>}

            {!loading && !error && users.length === 0 && (
                <p className="text-black/60">No users found</p>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="overflow-x-auto">
                    <p className="text-sm text-black/60 mb-4">Total: {users.length} users</p>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-black/10">
                                <th className="text-left py-3 px-4 text-sm font-medium text-black/60">ID</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-black/60">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-black/60">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-black/60">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-black/5 hover:bg-black/5">
                                    <td className="py-3 px-4 text-sm text-black/80 font-medium">{user.id}</td>
                                    <td className="py-3 px-4 text-sm text-black/80">{user.name || "N/A"}</td>
                                    <td className="py-3 px-4 text-sm text-black/60">{user.email}</td>
                                    <td className="py-3 px-4 text-sm text-black/60">
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
