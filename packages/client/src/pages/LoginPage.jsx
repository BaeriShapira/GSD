import LoginForm from "../components/Login/LoginForm";
import logoUrl from "../assets/GSD_LOGO_PURPLE.svg";


export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <img
                src={logoUrl}
                alt="GSD cat"
                className="w-80 object-contain select-none"
                draggable="false"
            />
            <LoginForm />
        </div>
    );
}



