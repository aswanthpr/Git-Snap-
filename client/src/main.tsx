import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <App />
    </UserProvider>
  </StrictMode>
);
