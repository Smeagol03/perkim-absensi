import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalPns from "./components/modalPns";
import ModalP3k from "./components/modalP3k";
import { subscribePNS } from "../../services/database/pns";
import { subscribeP3K } from "../../services/database/p3k";
import { getAbsensiPNS, getAbsensiP3K } from "../../services/database/absensi";

const Dashboard = () => {
  const navigate = useNavigate();

  // Modal states
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showAbsensiModal, setShowAbsensiModal] = useState(false);
  const [showPnsModal, setShowPnsModal] = useState(false);
  const [showP3kModal, setShowP3kModal] = useState(false);

  // Data states
  const [totalKaryawan, setTotalKaryawan] = useState(0);
  const [absensiStats, setAbsensiStats] = useState({
    hadir: 0,
    izinSakitCuti: 0,
    alpha: 0,
  });

  // Load data dari Firebase
  useEffect(() => {
    let pnsCount = 0;
    let p3kCount = 0;

    const unsubPNS = subscribePNS((data) => {
      pnsCount = data.length;
      setTotalKaryawan(pnsCount + p3kCount);
    });

    const unsubP3K = subscribeP3K((data) => {
      p3kCount = data.length;
      setTotalKaryawan(pnsCount + p3kCount);
    });

    // Load absensi hari ini
    const loadAbsensiHariIni = async () => {
      const today = new Date().toISOString().split("T")[0];
      const absensiPNS = await getAbsensiPNS(today);
      const absensiP3K = await getAbsensiP3K(today);

      // Gabungkan semua status
      const allStatus = [
        ...Object.values(absensiPNS),
        ...Object.values(absensiP3K),
      ];

      setAbsensiStats({
        hadir: allStatus.filter((s) => s === "hadir").length,
        izinSakitCuti: allStatus.filter(
          (s) => s === "izin" || s === "sakit" || s === "cuti"
        ).length,
        alpha: allStatus.filter((s) => s === "alpha").length,
      });
    };

    loadAbsensiHariIni();

    return () => {
      unsubPNS();
      unsubP3K();
    };
  }, []);

  // Statistik dari Firebase
  const stats = [
    {
      label: "Total Karyawan",
      value: totalKaryawan.toString(),
      icon: "👥",
      color: "blue",
    },
    {
      label: "Hadir Hari Ini",
      value: absensiStats.hadir.toString(),
      icon: "✅",
      color: "green",
    },
    {
      label: "Izin/Sakit/Cuti",
      value: absensiStats.izinSakitCuti.toString(),
      icon: "📝",
      color: "yellow",
    },
    {
      label: "Alpha",
      value: absensiStats.alpha.toString(),
      icon: "❌",
      color: "red",
    },
  ];

  const handleSelectPNS = () => {
    setShowSelectModal(false);
    setShowPnsModal(true);
  };

  const handleSelectP3K = () => {
    setShowSelectModal(false);
    setShowP3kModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Selection Modal - Pilih PNS atau P3K untuk Karyawan */}
      {showSelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSelectModal(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Tambah Karyawan
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Pilih jenis karyawan yang ingin ditambahkan
                </p>
              </div>
              <button
                onClick={() => setShowSelectModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
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
            <div className="p-6 space-y-4">
              <button
                onClick={handleSelectPNS}
                className="w-full flex items-center gap-4 p-5 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-2xl transition-all text-left group"
              >
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  👨‍💼
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">
                    Karyawan PNS
                  </p>
                  <p className="text-sm text-slate-500">Pegawai Negeri Sipil</p>
                </div>
              </button>
              <button
                onClick={handleSelectP3K}
                className="w-full flex items-center gap-4 p-5 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-400 rounded-2xl transition-all text-left group"
              >
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  👨‍💼
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">
                    Karyawan P3K
                  </p>
                  <p className="text-sm text-slate-500">
                    Pegawai Pemerintah dengan Perjanjian Kerja
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selection Modal - Pilih PNS atau P3K untuk Absensi */}
      {showAbsensiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAbsensiModal(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Input Absensi
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Pilih jenis karyawan untuk input absensi
                </p>
              </div>
              <button
                onClick={() => setShowAbsensiModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
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
            <div className="p-6 space-y-4">
              <button
                onClick={() => {
                  setShowAbsensiModal(false);
                  navigate("/admin/absensi/pns");
                }}
                className="w-full flex items-center gap-4 p-5 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-2xl transition-all text-left group"
              >
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  📋
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">
                    Absensi PNS
                  </p>
                  <p className="text-sm text-slate-500">
                    Input kehadiran Pegawai Negeri Sipil
                  </p>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowAbsensiModal(false);
                  navigate("/admin/absensi/p3k");
                }}
                className="w-full flex items-center gap-4 p-5 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-400 rounded-2xl transition-all text-left group"
              >
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  📋
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">
                    Absensi P3K
                  </p>
                  <p className="text-sm text-slate-500">Input kehadiran P3K</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal PNS */}
      <ModalPns
        isOpen={showPnsModal}
        onClose={() => setShowPnsModal(false)}
        editData={null}
      />

      {/* Modal P3K */}
      <ModalP3k
        isOpen={showP3kModal}
        onClose={() => setShowP3kModal(false)}
        editData={null}
      />

      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 mt-1">
          Selamat datang di panel administrasi E-Absensi
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                  stat.color === "blue"
                    ? "bg-blue-100"
                    : stat.color === "green"
                    ? "bg-green-100"
                    : stat.color === "yellow"
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setShowAbsensiModal(true)}
            className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
          >
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-semibold text-slate-800">Input Absensi</p>
              <p className="text-sm text-slate-500">Catat kehadiran hari ini</p>
            </div>
          </button>
          <button
            onClick={() => setShowSelectModal(true)}
            className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left"
          >
            <span className="text-2xl">👤</span>
            <div>
              <p className="font-semibold text-slate-800">Tambah Karyawan</p>
              <p className="text-sm text-slate-500">Daftarkan karyawan baru</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/admin/laporan")}
            className="flex items-center gap-4 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-left"
          >
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-semibold text-slate-800">Lihat Laporan</p>
              <p className="text-sm text-slate-500">Rekap bulanan</p>
            </div>
          </button>
        </div>
      </div>

      {/* Absensi Hari Ini */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Absensi Hari Ini</h3>
          <span className="text-sm text-slate-500">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {absensiStats.hadir +
          absensiStats.izinSakitCuti +
          absensiStats.alpha ===
        0 ? (
          <div className="text-center py-8 text-slate-400">
            <span className="text-5xl mb-4 block">📭</span>
            <p>Belum ada data absensi hari ini.</p>
            <button
              onClick={() => setShowAbsensiModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
            >
              Input Absensi Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress Bars */}
            <div className="space-y-3">
              {/* Hadir */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Hadir</span>
                  <span className="font-semibold text-green-600">
                    {absensiStats.hadir} orang
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totalKaryawan > 0
                          ? (absensiStats.hadir / totalKaryawan) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Izin/Sakit/Cuti */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Izin/Sakit/Cuti</span>
                  <span className="font-semibold text-yellow-600">
                    {absensiStats.izinSakitCuti} orang
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totalKaryawan > 0
                          ? (absensiStats.izinSakitCuti / totalKaryawan) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Alpha */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Alpha</span>
                  <span className="font-semibold text-red-600">
                    {absensiStats.alpha} orang
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totalKaryawan > 0
                          ? (absensiStats.alpha / totalKaryawan) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Total tercatat:{" "}
                <span className="font-semibold">
                  {absensiStats.hadir +
                    absensiStats.izinSakitCuti +
                    absensiStats.alpha}
                </span>{" "}
                dari <span className="font-semibold">{totalKaryawan}</span>{" "}
                karyawan
              </p>
              <button
                onClick={() => setShowAbsensiModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Input Absensi →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
