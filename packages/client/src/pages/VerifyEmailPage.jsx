import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787/api";

export default function VerifyEmailPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { login: setAuthData } = useAuth();

    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function verifyEmail() {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Verification failed");
                }

                // Store token and user data
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                setStatus("success");
                setMessage("Email verified successfully!");

                // Redirect to app after 2 seconds
                setTimeout(() => {
                    navigate("/app", { replace: true });
                }, 2000);
            } catch (err) {
                setStatus("error");
                setMessage(err.message || "Failed to verify email");
            }
        }

        if (token) {
            verifyEmail();
        }
    }, [token, navigate, setAuthData]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md border border-black/10 rounded-xl bg-white p-8 shadow-sm">
                {status === "verifying" && (
                    <div className="text-center">
                        <div className="inline-block w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mb-4"></div>
                        <h1 className="text-xl font-semibold text-black/80 mb-2">
                            Verifying your email...
                        </h1>
                        <p className="text-sm text-black/60">
                            Please wait while we verify your email address.
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-black/80 mb-2">
                            Email Verified!
                        </h1>
                        <p className="text-sm text-black/60">
                            {message}
                        </p>
                        <p className="text-sm text-black/50 mt-2">
                            Redirecting to app...
                        </p>
                    </div>
                )}

                {status === "error" && (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-black/80 mb-2">
                            Verification Failed
                        </h1>
                        <p className="text-sm text-red-600 mb-4">
                            {message}
                        </p>
                        <div className="space-y-2">
                            <Link
                                to="/login"
                                className="block w-full rounded-lg bg-black text-white py-2 text-sm font-medium hover:bg-black/90"
                            >
                                Go to Login
                            </Link>
                            <Link
                                to="/signup"
                                className="block w-full text-sm text-black/60 hover:text-black"
                            >
                                Sign up again
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
