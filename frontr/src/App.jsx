import './index.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/auth/Login';
import AdminDashboard from "./pages/admin/Dashboard";
import PublicHome from "./pages/public/Home";
import PenyakitDetails from "./pages/public/PenyakitDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <Router>
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
      </Routes>
    </Router>
  )
}

export default App
