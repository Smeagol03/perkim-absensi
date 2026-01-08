import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/auth/login";

const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openSubmenu, setOpenSubmenu] = useState(null);

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    {
      label: "Karyawan",
      icon: "👥",
      subItems: [
        { path: "/admin/karyawan/pns", label: "DATA PNS" },
        { path: "/admin/karyawan/p3k", label: "DATA P3K" },
      ],
    },
    {
      label: "Absensi",
      icon: "📋",
      subItems: [
        { path: "/admin/absensi/pns", label: "Absensi PNS" },
        { path: "/admin/absensi/p3k", label: "Absensi P3K" },
      ],
    },
    { path: "/admin/laporan", label: "Laporan", icon: "📈" },
  ];

  useEffect(() => {
    // Auto expand submenu if current path is a subitem
    menuItems.forEach((item) => {
      if (
        item.subItems &&
        item.subItems.some((sub) =>
          window.location.pathname.startsWith(sub.path)
        )
      ) {
        setOpenSubmenu(item.label);
      }
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleSubmenu = (label) => {
    if (openSubmenu === label) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(label);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen bg-slate-900 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">DP</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">
                  Admin Panel
                </span>
                <span className="text-slate-400 text-xs uppercase tracking-wider">
                  Dinas Perkim
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav
            className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Menu Utama
            </p>
            {menuItems.map((item) => {
              if (item.subItems) {
                const isOpen = openSubmenu === item.label;
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-medium ${
                        isOpen ||
                        item.subItems.some((sub) =>
                          window.location.pathname.startsWith(sub.path)
                        )
                          ? "text-white bg-slate-800/50"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <span
                        className={`transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pl-12 space-y-1">
                        {item.subItems.map((sub) => (
                          <NavLink
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                              `block px-4 py-2 rounded-lg text-sm transition-all ${
                                isActive
                                  ? "text-blue-400 font-bold"
                                  : "text-slate-500 hover:text-slate-300"
                              }`
                            }
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Footer - User Info */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-white font-medium text-sm truncate">
                  {user?.email || "Admin"}
                </p>
                <p className="text-slate-500 text-xs">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-72 flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Page Title - Can be dynamic */}
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-slate-800">
                Absensi Digital
              </h1>
              <p className="text-sm text-slate-500">
                Dinas Perumahan dan Kawasan Permukiman - Lombok Timur
              </p>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="px-4 lg:px-8 py-4 text-center text-sm text-slate-500 border-t border-slate-200 bg-white">
          © 2026 E-Absensi Dinas Perkim Lombok Timur
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
