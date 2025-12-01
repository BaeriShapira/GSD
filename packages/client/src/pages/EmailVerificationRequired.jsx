import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787/api";

export default function EmailVerificationRequired() {
    const location = useLocation();
    const email = location.state?.email || "";

    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleResendEmail() {
        if (!email) {
            setError("No email address found. Please try signing up again.");
            return;
        }

        setIsResending(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to resend verification email");
            }

            setMessage("Verification email sent successfully! Please check your inbox.");
        } catch (err) {
            setError(err.message || "Failed to resend email. Please try again.");
        } finally {
            setIsResending(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md border border-black/10 rounded-xl bg-white p-8 shadow-sm">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <h1 className="text-xl font-semibold text-black/80 mb-2">
                        Verify Your Email
                    </h1>

                    <p className="text-sm text-black/60 mb-4">
                        We've sent a verification email to:
                    </p>

                    {email && (
                        <p className="text-sm font-medium text-black/80 mb-6">
                            {email}
                        </p>
                    )}

                    <p className="text-sm text-black/60 mb-6">
                        Please check your inbox and click the verification link to activate your account.
                    </p>

                    {message && (
                        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={handleResendEmail}
                            disabled={isResending}
                            className="w-full rounded-lg bg-black text-white py-2 text-sm font-medium hover:bg-black/90 disabled:opacity-60"
                        >
                            {isResending ? "Sending..." : "Resend Verification Email"}
                        </button>

                        <Link
                            to="/login"
                            className="block w-full text-center text-sm text-black/60 hover:text-black"
                        >
                            Back to Login
                        </Link>
                    </div>

                    <div className="mt-6 pt-6 border-t border-black/10">
                        <p className="text-xs text-black/50">
                            Didn't receive the email? Check your spam folder or try resending.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
