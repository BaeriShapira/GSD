import { Link } from "react-router-dom";

export default function LandingHeader() {
    return (
        <header className="w-full bg-gradient-to-r from-purple-900 to-purple-800 rounded-2xl shadow-lg">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="text-4xl group-hover:scale-110 transition-transform">
                        🐱
                    </div>
                    <h1 className="text-white text-2xl font-bold italic tracking-wide">
                        GET SHIT DONE
                    </h1>
                </Link>

                {/* Login Button */}
                <Link
                    to="/login"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full transition-all hover:scale-105 shadow-lg"
                >
                    Login
                </Link>
            </div>
        </header>
    );
}
