import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock scroll when offcanvas is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-lg sm:text-xl tracking-tight">
                  DP
                </span>
              </div>
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="text-slate-900 font-bold text-sm sm:text-lg truncate group-hover:text-blue-700 transition-colors">
                  DINAS PERKIM
                </span>
                <span className="text-slate-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider truncate">
                  Lombok Timur
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-slate-600 hover:text-blue-700 font-medium transition-colors"
              >
                Beranda
              </Link>
              <Link
                to="/informasi"
                className="text-slate-600 hover:text-blue-700 font-medium transition-colors"
              >
                Informasi
              </Link>
              <Link
                to="/login"
                className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
              >
                <span>Login Admin</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                to="/login"
                className="p-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                title="Login Admin"
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-slate-600 hover:text-blue-700 transition-colors bg-slate-50 rounded-xl"
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
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Offcanvas Mobile Menu */}
      <div
        className={`fixed inset-0 z-60 md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Drawer */}
        <div
          className={`absolute inset-y-0 right-0 w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } flex flex-col`}
        >
          {/* Drawer Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Navigasi Menu
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                E-Absensi Digital
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">
                Halaman Utama
              </span>
              <div className="space-y-1 pt-1">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-50 text-slate-600 hover:text-blue-700 font-semibold transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shadow-sm">
                    🏠
                  </div>
                  <span>Beranda</span>
                </Link>
                <a
                  href="#"
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-50 text-slate-600 hover:text-blue-700 font-semibold transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shadow-sm">
                    ℹ️
                  </div>
                  <span>Informasi</span>
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">
                Administrasi
              </span>
              <div className="pt-1">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col gap-1.5 px-5 py-5 rounded-3xl bg-linear-to-tr from-blue-700 to-indigo-600 text-white shadow-xl shadow-blue-100 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09m9.03.06L14.47 18.256"
                      ></path>
                    </svg>
                  </div>
                  <span className="font-bold text-lg">Panel Admin</span>
                  <span className="text-xs text-blue-100 leading-relaxed font-medium">
                    Masuk untuk mengelola data kehadiran & laporan karyawan.
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 shrink-0">
                <span className="text-white font-bold text-xs">DP</span>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-slate-900 font-bold uppercase tracking-tight leading-none">
                  Dinas Perkim
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
                  Kab. Lombok Timur
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
