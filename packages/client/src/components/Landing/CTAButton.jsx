import { Link } from "react-router-dom";

export default function CTAButton() {
    return (
        <div className="flex justify-center py-12">
            <Link
                to="/signup"
                className="bg-amber-400 hover:bg-yellow-500 text-black  px-7 py-2 rounded-2xl transition-all  shadow-lg"
            >
                <h3>Signup</h3>
            </Link>
        </div>
    );
}
