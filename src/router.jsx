import { createBrowserRouter } from "react-router-dom";
import App from "./pages/App";
import Informasi from "./pages/Informasi";
import Login from "./pages/login/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/dashboard";
import Karyawan from "./pages/admin/pns";
import P3k from "./pages/admin/p3k";
import AbsensiPns from "./pages/admin/absensiPns";
import AbsensiP3k from "./pages/admin/absensiP3k";
import Laporan from "./pages/admin/laporan";
import ProtectedRoute from "./components/ProtectedRoute";

// Definisikan routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/informasi",
    element: <Informasi />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  // Protected Admin Routes dengan Layout
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "karyawan/pns",
        element: <Karyawan />,
      },
      {
        path: "karyawan/p3k",
        element: <P3k />,
      },
      {
        path: "absensi/pns",
        element: <AbsensiPns />,
      },
      {
        path: "absensi/p3k",
        element: <AbsensiP3k />,
      },
      {
        path: "laporan",
        element: <Laporan />,
      },
    ],
  },
]);

export default router;
