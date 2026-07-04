import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "1rem",
              background: "#163A27",
              color: "#F0F7F3",
              fontSize: "14px",
              fontWeight: 500,
            },
            success: { iconTheme: { primary: "#5BA97C", secondary: "#F0F7F3" } },
            error: { iconTheme: { primary: "#DC2626", secondary: "#F0F7F3" } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
