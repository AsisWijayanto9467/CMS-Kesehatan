import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import PublicHome from "./pages/public/Home";
import PenyakitDetails from "./pages/public/PenyakitDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/admin.css";
import Obat from "./pages/admin/Obat";
import Suplemen from "./pages/admin/Suplemen";
import Penyakit from "./pages/admin/Penyakit";
import KategoriObat from "./pages/admin/KategoriObat";
import KategoriSuplemen from "./pages/admin/KategoriSuplemen";
import KategoriPenyakit from "./pages/admin/KategoriPenyakit";
import Users from "./pages/admin/Users";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicHome />} />
      <Route path="/penyakit/:id" element={<PenyakitDetails />} />

      {/* Admin Routes (Protected) */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/obat"
        element={
          <ProtectedRoute>
            <Obat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/suplemen"
        element={
          <ProtectedRoute>
            <Suplemen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/penyakit"
        element={
          <ProtectedRoute>
            <Penyakit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kategori-obat"
        element={
          <ProtectedRoute>
            <KategoriObat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/Kategori-suplemen"
        element={
          <ProtectedRoute>
            <KategoriSuplemen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kategori-penyakit"
        element={
          <ProtectedRoute>
            <KategoriPenyakit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
