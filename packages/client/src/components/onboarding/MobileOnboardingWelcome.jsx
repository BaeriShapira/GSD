import { useNavigate } from "react-router-dom";
import { apiCompleteOnboarding } from "../../api/authApi";
import { useAuth } from "../../auth/AuthContext";
import logoUrl from "../../assets/GSD_LOGO_PURPLE.svg";

export default function MobileOnboardingWelcome() {
    const navigate = useNavigate();
    const { updateUser } = useAuth();

    const handleGetStarted = async () => {
        try {
            await apiCompleteOnboarding();
            updateUser({ hasCompletedOnboarding: true });
            navigate("/app/bucket_mobile");
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <img
                        src={logoUrl}
                        alt="GSD cat"
                        className="w-48 mx-auto object-contain select-none"
                        draggable="false"
                    />
                </div>

                {/* Welcome Content */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-4 text-center">Welcome to GSD Mobile!</h1>

                    <p className="text-gray-700 mb-4 text-center">
                        GSD Mobile is designed for quick capture and task completion on the go.
                    </p>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 mb-4">
                        <h2 className="font-semibold mb-2">What you can do:</h2>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start">
                                <span className=" mr-2">✓</span>
                                <span>Quickly add items to your Bucket</span>
                            </li>
                            <li className="flex items-start">
                                <span className=" mr-2">✓</span>
                                <span>View and complete Next Actions</span>
                            </li>
                            <li className="flex items-start">
                                <span className=" mr-2">✓</span>
                                <span>Check items you're Waiting For</span>
                            </li>
                            <li className="flex items-start">
                                <span className=" mr-2">✓</span>
                                <span>Process your Bucket items</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 mb-6">
                        <div className="flex items-start gap-2">

                            <div>
                                <h3 className="font-semibold mb-1">Mobile Limitations</h3>
                                <p className="text-sm text-gray-700">
                                    For full features like managing Projects, Settings configuration,
                                    and Weekly Reviews, we recommend using the desktop version.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Get Started Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleGetStarted}
                        className="btn btn-primary"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}
