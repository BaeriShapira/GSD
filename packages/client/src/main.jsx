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
  import(/* @vite-ignore */ "@vercel/analytics/react").then(({ inject }) => {
    inject();
  }).catch(() => {
    // Silently fail if Analytics fails to load
  });
}
