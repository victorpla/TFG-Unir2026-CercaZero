import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomeMapPage from "../pages/HomeMapPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MyDonationsPage from "../pages/MyDonationsPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomeMapPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/mis-donaciones"
          element={
            <ProtectedRoute>
              <MyDonationsPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
