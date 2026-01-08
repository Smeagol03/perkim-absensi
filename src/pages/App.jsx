import React, { useState, useEffect } from "react";
import Nav from "./component/Nav";
import { subscribePNS } from "../services/database/pns";
import { subscribeP3K } from "../services/database/p3k";
import { getAbsensiPNS, getAbsensiP3K } from "../services/database/absensi";
import TablePNS from "./admin/components/TablePNS";
import TableP3K from "./admin/components/TableP3K";

const App = () => {
  const [pnsList, setPnsList] = useState([]);
  const [p3kList, setP3kList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pns");

  // Stats state
  const [absensiStats, setAbsensiStats] = useState({
    hadir: 0,
    izinSakitCuti: 0,
    alpha: 0,
    total: 0,
  });

  useEffect(() => {
    // 1. Subscribe data PNS
    const unsubPNS = subscribePNS((data) => {
      setPnsList(data);
      if (p3kList.length > 0) setLoading(false);
    });

    // 2. Subscribe data P3K
    const unsubP3K = subscribeP3K((data) => {
      setP3kList(data);
      setLoading(false);
    });

    // 3. Load stats hari ini
    const loadStats = async () => {
      const today = new Date().toISOString().split("T")[0];
      const absPNS = await getAbsensiPNS(today);
      const absP3K = await getAbsensiP3K(today);
      const allStatus = [...Object.values(absPNS), ...Object.values(absP3K)];

      setAbsensiStats({
        hadir: allStatus.filter((s) => s === "hadir").length,
        izinSakitCuti: allStatus.filter((s) =>
          ["izin", "sakit", "cuti"].includes(s)
        ).length,
        alpha: allStatus.filter((s) => s === "alpha").length,
        total: allStatus.length,
      });
    };

    loadStats();

    return () => {
      unsubPNS();
      unsubP3K();
    };
  }, []);

  // Filter logic
  const filteredPNS = pnsList.filter(
    (p) =>
      p.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nip?.includes(searchTerm) ||
      p.jabatan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredP3K = p3kList.filter(
    (p) =>
      p.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nipppk?.includes(searchTerm) ||
      p.jabatan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-700 pb-20">
      <Nav />

      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-16 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16">
            {/* Content */}
            <div className="w-full lg:flex-1 text-center lg:text-left space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-yellow-100 border border-yellow-200 rounded-full text-yellow-800 text-[10px] sm:text-sm font-semibold tracking-wide animate-bounce">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                Absen Digital
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
                Absensi <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-indigo-600">
                  Digital
                </span>
              </h1>

              <p className="text-sm sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Platform digital resmi{" "}
                <span className="font-semibold text-slate-800 text-xs sm:text-xl">
                  Dinas Perumahan dan Kawasan Permukiman
                </span>{" "}
                untuk manajemen absensi yang transparan, akurat, dan efisien
                demi pelayanan publik yang lebih baik.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-bold text-base sm:text-lg transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:scale-95">
                  Lihat Rekap Absensi
                </button>
                <button className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold text-base sm:text-lg transition-all hover:border-slate-300 active:scale-95">
                  Pelajari Sistem
                </button>
              </div>
            </div>

            {/* Visual Element */}
            <div className="w-full lg:flex-1 relative max-w-[550px] lg:max-w-none pt-8 lg:pt-0">
              <div className="relative group mx-auto">
                <div className="absolute -inset-4 bg-linear-to-tr from-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-15 group-hover:opacity-25 transition duration-1000"></div>

                {/* Main "Dashboard" Mockup Card */}
                <div className="relative bg-white border border-slate-100 p-4 sm:p-6 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-slate-100 rounded-lg text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                      Live Update
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="h-3 sm:h-4 w-1/3 bg-slate-100 rounded-full animate-pulse"></div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="h-20 sm:h-24 bg-blue-50/50 border border-blue-100 rounded-2xl p-3 sm:p-4 flex flex-col justify-end gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100"></div>
                        <div className="h-1.5 sm:h-2 w-full bg-blue-200 rounded-full"></div>
                      </div>
                      <div className="h-20 sm:h-24 bg-slate-50 border border-slate-100 rounded-2xl p-3 sm:p-4 flex flex-col justify-end gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-200"></div>
                        <div className="h-1.5 sm:h-2 w-full bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 sm:p-3 bg-white border border-slate-50 rounded-xl shadow-sm"
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-100"></div>
                            <div className="space-y-1 sm:space-y-1.5">
                              <div className="h-1.5 sm:h-2 w-16 sm:w-24 bg-slate-200 rounded-full"></div>
                              <div className="h-1 sm:h-1.5 w-10 sm:w-16 bg-slate-100 rounded-full"></div>
                            </div>
                          </div>
                          <div
                            className={`w-8 sm:w-12 h-3 sm:h-4 rounded-full ${
                              i === 1 ? "bg-green-100" : "bg-slate-100"
                            }`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero & Stats Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Monitor Kehadiran Pegawai <br />
              <span className="text-blue-600">Real-Time</span>
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center transition-transform hover:scale-105">
              <span className="text-3xl mb-2 block">👥</span>
              <p className="text-2xl font-bold text-blue-900">
                {pnsList.length + p3kList.length}
              </p>
              <p className="text-sm font-medium text-blue-600">Total Pegawai</p>
            </div>
            <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center transition-transform hover:scale-105">
              <span className="text-3xl mb-2 block">✅</span>
              <p className="text-2xl font-bold text-green-900">
                {absensiStats.hadir}
              </p>
              <p className="text-sm font-medium text-green-600">
                Hadir Hari Ini
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 text-center transition-transform hover:scale-105">
              <span className="text-3xl mb-2 block">📝</span>
              <p className="text-2xl font-bold text-yellow-900">
                {absensiStats.izinSakitCuti}
              </p>
              <p className="text-sm font-medium text-yellow-600">
                Izin/Sakit/Cuti
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center transition-transform hover:scale-105">
              <span className="text-3xl mb-2 block">❌</span>
              <p className="text-2xl font-bold text-red-900">
                {absensiStats.alpha}
              </p>
              <p className="text-sm font-medium text-red-600">Alpha</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Blocks Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 text-xl">
                🕒
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Jam Kerja</h3>
                <p className="text-slate-500 text-sm">
                  Senin - Jumat (07:30 - 16:00 WITA)
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0 text-xl">
                📍
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Lokasi</h3>
                <p className="text-slate-500 text-sm">
                  Dinas Perkim Kab. Lombok Timur
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shrink-0 text-xl">
                📱
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Digital</h3>
                <p className="text-slate-500 text-sm">
                  Absensi berbasis Web & Firebase
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Table Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-4xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Daftar Pegawai
              </h2>
              <p className="text-slate-500 mt-1">
                Cari nama atau jabatan pegawai
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {/* Tab Selector */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setActiveTab("pns")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "pns"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  PNS
                </button>
                <button
                  onClick={() => setActiveTab("p3k")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "p3k"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  P3K
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Cari pegawai..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tables */}
          {activeTab === "pns" ? (
            <TablePNS
              data={filteredPNS}
              loading={loading}
              totalData={pnsList.length}
              showActions={false}
              emptyState={{
                title: "Pegawai tidak ditemukan",
                description: `Pencarian "${searchTerm}" tidak membuahkan hasil.`,
              }}
            />
          ) : (
            <TableP3K
              data={filteredP3K}
              loading={loading}
              totalData={p3kList.length}
              showActions={false}
              emptyState={{
                title: "Pegawai tidak ditemukan",
                description: `Pencarian "${searchTerm}" tidak membuahkan hasil.`,
              }}
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Dinas Perkim Kabupaten Lombok Timur.
          All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
