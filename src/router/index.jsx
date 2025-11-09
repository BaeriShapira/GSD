// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import PublicGate from "../auth/PublicGate";
import ProtectedRoute from "../auth/ProtectedRoute";

import PublicLayout from "../layouts/PublicLayout";
import AppLayout from "../layouts/AppLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Vendors from "../pages/Vendors";

export const router = createBrowserRouter([
    // 🔓 אזור ציבורי – אם מחובר => יעוף ל-/app
    {
        element: <PublicGate />,
        children: [
            {
                path: "/",
                element: <PublicLayout />,
                children: [
                    { index: true, element: <Home /> },
                    { path: "auth/login", element: <Login /> },
                ],
            },
        ],
    },

    // 🔒 אזור מוגן – רק למשתמש מחובר
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/app",
                element: <AppLayout />,
                children: [
                    { index: true, element: <Dashboard /> },
                    { path: "purchase_Orders/vendors", element: <Vendors /> },
                    // { path: "tasks", element: <Tasks /> },
                    // { path: "agents", element: <Agents /> },
                    // { path: "settings", element: <Settings /> },
                ],
            },
        ],
    },
]);
