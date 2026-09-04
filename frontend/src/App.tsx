import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/layout/routes";
import { Dashboard } from "@/pages/Dashboard";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";

export function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
