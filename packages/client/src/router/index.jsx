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
import Archive from "../pages/Archive";
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
import DashboardMobile from "../pages/DashboardMobile";
import WaitingForMobile from "../pages/WaitingForMobile";
import ProcessBucketMobile from "../pages/ProcessBucketMobile";
import Onboarding from "../pages/Onboarding";
import OnboardingMobile from "../pages/OnboardingMobile";
import WeeklyReview from "../pages/WeeklyReview";
import AdminPanel from "../pages/AdminPanel";
import MoneyKeeper from "../pages/MoneyKeeper";
import MoneyKeeperApp from "../pages/MoneyKeeperApp";
import Playground from "../pages/Playground";

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

    // Money Keeper Landing - public
    {
        path: "/money-keeper",
        element: <MoneyKeeper />,
    },

    // Money Keeper App - public (for now)
    {
        path: "/money-keeper/app",
        element: <MoneyKeeperApp />,
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

    // Onboarding routes - protected but separate
    {
        path: "/onboarding",
        element: <ProtectedRoute />,
        children: [
            { index: true, element: <Onboarding /> },
        ],
    },
    {
        path: "/onboarding-mobile",
        element: <ProtectedRoute />,
        children: [
            { index: true, element: <OnboardingMobile /> },
        ],
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
                            { index: true, element: <Bucket /> },
                            { path: "dashboard", element: <Dashboard /> },
                            { path: "bucket", element: <Bucket /> },
                            { path: "process_bucket", element: <ProcessBucket /> },
                            { path: "reference", element: <Reference /> },
                            { path: "reference/:folderId", element: <Reference /> },
                            { path: "archive", element: <Archive /> },
                            { path: "projects", element: <Projects /> },
                            { path: "projects/:projectId", element: <Projects /> },
                            { path: "next_actions", element: <NextActions /> },
                            { path: "someday", element: <Someday /> },
                            { path: "waiting_for", element: <WaitingFor /> },
                            { path: "settings", element: <Settings /> },
                            { path: "weekly_review", element: <WeeklyReview /> },
                            { path: "admin", element: <AdminPanel /> },
                            // DEV only route
                            ...(import.meta.env.DEV ? [{ path: "playground", element: <Playground /> }] : []),
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
                    {
                        path: "dashboard_mobile",
                        element: <MobileLayout />,
                        children: [
                            { index: true, element: <DashboardMobile /> },
                        ],
                    },
                    {
                        path: "waiting_for_mobile",
                        element: <MobileLayout />,
                        children: [
                            { index: true, element: <WaitingForMobile /> },
                        ],
                    },
                    {
                        path: "process_bucket_mobile",
                        element: <MobileLayout />,
                        children: [
                            { index: true, element: <ProcessBucketMobile /> },
                        ],
                    },
                ],
            },
        ],
    },
]);
