import { createRoot } from "react-dom/client";
import App from "./view/App";
import "./index.scss";
import "./view/App.scss";
import { GoogleOAuthProvider } from "@react-oauth/google";

console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);