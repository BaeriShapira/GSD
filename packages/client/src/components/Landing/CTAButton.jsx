import { Link } from "react-router-dom";

export default function CTAButton() {
    return (
        <div className="flex justify-center py-12">
            <Link
                to="/signup"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-2xl px-16 py-5 rounded-full transition-all hover:scale-105 shadow-xl"
            >
                Signup
            </Link>
        </div>
    );
}
