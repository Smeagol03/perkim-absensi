import React, { useState, useEffect } from "react";
import { subscribeP3K } from "../../services/database/p3k";
import { saveAbsensiP3K, getAbsensiP3K } from "../../services/database/absensi";
import EmptyState from "../../components/EmptyState";

const AbsensiP3k = () => {
  const [p3kList, setP3kList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAbsensi, setLoadingAbsensi] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0]
  );

  // State untuk menyimpan status absensi
  const [absensiData, setAbsensiData] = useState({});

  // Load data P3K
  useEffect(() => {
    const unsubscribe = subscribeP3K((data) => {
      setP3kList(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load absensi existing saat tanggal berubah
  useEffect(() => {
    const loadAbsensi = async () => {
      setLoadingAbsensi(true);
      const existingAbsensi = await getAbsensiP3K(tanggal);
      setAbsensiData(existingAbsensi);
      setLoadingAbsensi(false);
    };

    loadAbsensi();
  }, [tanggal]);

  // Filter berdasarkan pencarian
  const filteredP3K = p3kList.filter(
    (p3k) =>
      p3k.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p3k.nipppk?.includes(searchTerm) ||
      p3k.jabatan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle perubahan status absensi
  const handleAbsensiChange = (p3kId, status) => {
    setAbsensiData((prev) => ({
      ...prev,
      [p3kId]: status,
    }));
  };

  // Simpan absensi ke Firebase
  const handleSimpanAbsensi = async () => {
    if (Object.keys(absensiData).length === 0) {
      alert("Tidak ada data absensi untuk disimpan!");
      return;
    }

    setSaving(true);
    try {
      // Siapkan data dengan info karyawan
      const dataToSave = {};
      Object.entries(absensiData).forEach(([p3kId, status]) => {
        const p3k = p3kList.find((p) => p.id === p3kId);
        if (p3k) {
          dataToSave[p3kId] = {
            status,
            nama: p3k.nama,
            nipppk: p3k.nipppk,
            jabatan: p3k.jabatan,
            timestamp: new Date().toISOString(),
          };
        }
      });

      await saveAbsensiP3K(tanggal, dataToSave);
      alert(`✅ Absensi P3K berhasil disimpan untuk tanggal ${tanggal}!`);
    } catch (error) {
      alert("❌ Gagal menyimpan absensi: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Set semua hadir
  const handleSetAllHadir = () => {
    const newAbsensi = {};
    p3kList.forEach((p3k) => {
      newAbsensi[p3k.id] = "hadir";
    });
    setAbsensiData(newAbsensi);
  };

  const statusOptions = [
    { value: "hadir", label: "Hadir", color: "bg-green-100 text-green-700" },
    { value: "izin", label: "Izin", color: "bg-yellow-100 text-yellow-700" },
    { value: "sakit", label: "Sakit", color: "bg-orange-100 text-orange-700" },
    { value: "cuti", label: "Cuti", color: "bg-blue-100 text-blue-700" },
    { value: "alpha", label: "Alpha", color: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Absensi P3K</h2>
          <p className="text-slate-500 mt-1">
            Input dan kelola kehadiran karyawan P3K
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSetAllHadir}
            className="inline-flex items-center gap-2 px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl font-semibold transition-all"
          >
            <span>✅</span>
            <span>Set Semua Hadir</span>
          </button>
          <button
            onClick={handleSimpanAbsensi}
            disabled={Object.keys(absensiData).length === 0 || saving}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Simpan Absensi</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Date & Search Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Tanggal */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Tanggal Absensi
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Cari Karyawan
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama, NI PPPK, atau jabatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-blue-600">{p3kList.length}</p>
          <p className="text-sm text-slate-500">Total P3K</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-green-600">
            {Object.values(absensiData).filter((s) => s === "hadir").length}
          </p>
          <p className="text-sm text-slate-500">Hadir</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-yellow-600">
            {Object.values(absensiData).filter((s) => s === "izin").length}
          </p>
          <p className="text-sm text-slate-500">Izin</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-orange-600">
            {
              Object.values(absensiData).filter(
                (s) => s === "sakit" || s === "cuti"
              ).length
            }
          </p>
          <p className="text-sm text-slate-500">Sakit/Cuti</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-red-600">
            {Object.values(absensiData).filter((s) => s === "alpha").length}
          </p>
          <p className="text-sm text-slate-500">Alpha</p>
        </div>
      </div>

      {/* Loading Absensi Indicator */}
      {loadingAbsensi && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-700">Memuat data absensi...</p>
        </div>
      )}

      {/* Table Absensi */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  No
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nama / NI PPPK
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Jabatan
                </th>
                <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status Kehadiran
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-slate-500">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredP3K.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4">
                    <EmptyState
                      icon={searchTerm ? "🔍" : "📭"}
                      title={
                        searchTerm
                          ? "Tidak ada hasil ditemukan"
                          : "Belum ada data karyawan P3K"
                      }
                      description={
                        searchTerm
                          ? `Tidak ditemukan data yang cocok dengan pencarian "${searchTerm}"`
                          : "Silakan tambahkan data karyawan P3K terlebih dahulu"
                      }
                      actionLabel={searchTerm ? "Reset Pencarian" : undefined}
                      onAction={
                        searchTerm ? () => setSearchTerm("") : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredP3K.map((p3k, index) => (
                  <tr
                    key={p3k.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {p3k.nama}
                        </p>
                        <p className="text-sm text-slate-500">{p3k.nipppk}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p3k.jabatan}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleAbsensiChange(p3k.id, option.value)
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              absensiData[p3k.id] === option.value
                                ? `${option.color} ring-2 ring-offset-1 ring-current scale-105`
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {!loading && filteredP3K.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold">{filteredP3K.length}</span> dari{" "}
              <span className="font-semibold">{p3kList.length}</span> karyawan
              P3K
            </p>
            <p className="text-sm text-slate-500">
              <span className="font-semibold">
                {Object.keys(absensiData).length}
              </span>{" "}
              sudah diisi
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsensiP3k;
