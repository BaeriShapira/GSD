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
        </div>
    );
}
