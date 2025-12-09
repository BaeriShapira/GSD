import SignupForm from "../components/Signup/SignupForm";
import logoUrl from "../assets/GSD_LOGO_PURPLE.svg";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <img
                src={logoUrl}
                alt="GSD cat"
                className="w-80 object-contain select-none"
                draggable="false"
            />
            <SignupForm />

            {/* Footer */}
            <footer className="absolute bottom-4 text-center text-sm text-gray-600">
                <a
                    href="/privacy"
                    className="hover:text-purple-600 transition-colors underline"
                >
                    Privacy Policy
                </a>
            </footer>
        </div>
    );
}
