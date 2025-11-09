import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            nav("/", { replace: true });
        } catch (e) {
            setErr("Login failed");
        }
    };

    return (
        <div className="min-h-screen flex m-6 justify-center ">
            <div className="w-full h-full max-w-sm bg-white/70 backdrop-blur rounded-2xl p-6 shadow">
                <h1 className="text-2xl font-bold text-[#2a1b42] mb-4">Sign in</h1>
                {err && <p className="text-red-600 text-sm mb-2">{err}</p>}
                <form onSubmit={onSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-black/10 px-3 py-2 bg-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-black/10 px-3 py-2 bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg px-4 py-2 font-semibold text-white bg-[#3f236d] hover:opacity-90"
                    >
                        Sign in
                    </button>
                </form>
                <div className="mt-3 text-xs text-black/60">
                    <Link to="/app" className="underline">Back to site</Link>
                </div>
            </div>
        </div>
    );
}
