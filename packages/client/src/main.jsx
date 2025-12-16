// packages/client/src/main.jsx
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import "react-phone-input-2/lib/style.css";
import { Suspense, lazy } from "react";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./auth/AuthContext"; // 👈 חדש

const queryClient = new QueryClient();

// Conditionally load Analytics only in production
const Analytics = import.meta.env.PROD
  ? lazy(() => import("@vercel/analytics/react").then(module => ({ default: module.Analytics })))
  : () => null;

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Suspense fallback={null}>
        <Analytics />
      </Suspense>
    </AuthProvider>
  </QueryClientProvider>
);
