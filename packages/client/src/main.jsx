// packages/client/src/main.jsx
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import "react-phone-input-2/lib/style.css";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./auth/AuthContext"; // 👈 חדש

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </AuthProvider>
  </QueryClientProvider>
);

// Load Analytics in production only - after initial render
if (import.meta.env.PROD) {
  // Vercel Analytics
  import("@vercel/analytics/react").then(({ inject }) => {
    console.log("✅ Vercel Analytics loaded successfully");
    inject();
  }).catch((error) => {
    console.warn("⚠️ Failed to load Vercel Analytics:", error);
  });

  // Google Analytics
  import("./utils/analytics").then(({ initGA }) => {
    const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (GA_MEASUREMENT_ID) {
      initGA(GA_MEASUREMENT_ID);
    }
  }).catch((error) => {
    console.warn("⚠️ Failed to load Google Analytics:", error);
  });
}
