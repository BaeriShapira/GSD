import { Link } from "react-router-dom";
import logoUrl from "../../assets/GSD_LOGO.svg";


export default function LandingHeader() {
    return (
        <header className="w-full bg-purple-950 rounded-4xl shadow-[4px_5px_0_0_#231434]">
            <div className="container mx-auto px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src={logoUrl}
                        alt="GSD cat"
                        className="w-60 object-contain select-none"
                        draggable="false"
                    />
                </Link>

                {/* Login Button */}
                <Link
                    to="/login"
                    className="bg-amber-400 hover:bg-yellow-500 text-black  px-7 py-2 rounded-2xl transition-all  shadow-lg"
                >
                    <h3>Login</h3>
                </Link>
            </div>
        </header>
    );
}
