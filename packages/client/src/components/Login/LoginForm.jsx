import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787/api";

export default function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(email, password);
            navigate("/app", { replace: true });
        } catch (err) {
            console.error(err);
            // Handle specific error messages
            const errorMessage = err.message || "Incorrect mail or password";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm border border-black/10 rounded-xl bg-white p-6 shadow-sm space-y-4"
        >
            <h1 className="text-lg font-semibold text-black/80 text-center">
                Login
            </h1>

            <div className="space-y-1">
                <label className="block text-sm text-black/70">Email</label>
                <input
                    type="email"
                    className="w-full border border-black/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-black/10"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm text-black/70">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="w-full border border-black/20 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring focus:ring-black/10"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {error && (
                <div className="text-xs text-red-500">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-black text-white py-2 text-sm font-medium hover:bg-black/90 disabled:opacity-60 cursor-pointer"
            >
                {isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-black/50">or</span>
                </div>
            </div>

            {/* Google Sign-In Button */}
            <button
                type="button"
                onClick={() => {
                    window.location.href = `${API_BASE_URL}/auth/google`;
                }}
                className="w-full rounded-lg border border-black/20 bg-white text-black py-2 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-3"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd">
                        <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                    </g>
                </svg>
                <span>Sign in with Google</span>
            </button>

            {/* Link to Signup */}
            <div className="text-center text-sm text-black/60 mt-4">
                Don't have an account?{" "}
                <Link to="/signup" className="text-black font-medium hover:underline">
                    Sign up
                </Link>
            </div>
        </form>
    );
}
