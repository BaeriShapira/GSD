// packages/client/src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import MobileLayout from "../layouts/MobileLayout";
import Bucket from "../pages/Bucket";
import BucketMobile from "../pages/BucketMobile";
import NextActionsMobile from "../pages/NextActionsMobile";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import OAuthCallback from "../pages/OAuthCallback";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import EmailVerificationRequired from "../pages/EmailVerificationRequired";
import ProtectedRoute from "../auth/ProtectedRoute";
import ProcessBucket from "../pages/ProcessBucket";
import Reference from "../pages/Reference";
import Someday from "../pages/Someday";
import Settings from "../pages/Settings";
import WaitingFor from "../pages/WaitingFor";
import Projects from "../pages/Projects";
import NextActions from "../pages/NextActions";
import Dashboard from "../pages/Dashboard";
import RootRedirect from "../pages/RootRedirect";
import MobileRedirect from "../components/MobileRedirect";
import LandingPage from "../pages/LandingPage";
import PrivacyPolicy from "../pages/PrivacyPolicy";

export const router = createBrowserRouter([
    // Landing page - public
    {
        path: "/",
        element: <LandingPage />,
    },

    // Privacy Policy - public
    {
        path: "/privacy",
        element: <PrivacyPolicy />,
    },

    // מסך הלוגין – פתוח בלי הגנה
    {
        path: "/login",
        element: <LoginPage />,
    },

    // מסך הרשמה – פתוח בלי הגנה
    {
        path: "/signup",
        element: <SignupPage />,
    },

    // OAuth callback route - open without protection
    {
        path: "/oauth/callback",
        element: <OAuthCallback />,
    },

    // Email verification routes - open without protection
    {
        path: "/verify-email/:token",
        element: <VerifyEmailPage />,
    },
    {
        path: "/email-verification-required",
        element: <EmailVerificationRequired />,
    },

    // כל מה שמתחת ל- ProtectedRoute דורש התחברות
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/app",
                element: <MobileRedirect />,
                children: [
                    // Desktop routes with AppLayout (sidebar + header)
                    {
                        element: <AppLayout />,
                        children: [
                            { index: true, element: <Dashboard /> },
                            { path: "dashboard", element: <Dashboard /> },
                            { path: "bucket", element: <Bucket /> },
                            { path: "process_bucket", element: <ProcessBucket /> },
                            { path: "reference", element: <Reference /> },
                            { path: "reference/:folderId", element: <Reference /> },
                            { path: "projects", element: <Projects /> },
                            { path: "projects/:projectId", element: <Projects /> },
                            { path: "next_actions", element: <NextActions /> },
                            { path: "someday", element: <Someday /> },
                            { path: "waiting_for", element: <WaitingFor /> },
                            { path: "settings", element: <Settings /> },
                        ],
                    },
                    // Mobile routes with MobileLayout (no sidebar, no header)
                    {
                        path: "bucket_mobile",
                        element: <MobileLayout />,
                        children: [
                            { index: true, element: <BucketMobile /> },
                        ],
                    },
                    {
                        path: "next_actions_mobile",
                        element: <MobileLayout />,
                        children: [
                            { index: true, element: <NextActionsMobile /> },
                        ],
                    },
                ],
            },
        ],
    },
]);
