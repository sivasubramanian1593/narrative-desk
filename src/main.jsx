import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import App from "./App";
import { authClient } from "./auth-client";
import "./styles.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL, {
  expectAuth: true,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <App />
    </ConvexBetterAuthProvider>
  </React.StrictMode>,
);
