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
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Analytics />
    </AuthProvider>
  </QueryClientProvider>
);
