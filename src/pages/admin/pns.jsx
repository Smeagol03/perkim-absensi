import React, { useState, useEffect } from "react";
import { subscribePNS, deletePNS } from "../../services/database/pns";
import ModalPns from "./components/modalPns";
import TablePNS from "./components/TablePNS";

const Karyawan = () => {
  const [pnsList, setPnsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGolongan, setFilterGolongan] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    // Subscribe ke data PNS (realtime)
    const unsubscribe = subscribePNS((data) => {
      setPnsList(data);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Fungsi buka modal tambah
  const handleOpenAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  // Fungsi buka modal edit
  const handleOpenEdit = (pns) => {
    setEditData(pns);
    setIsModalOpen(true);
  };

  // Fungsi hapus
  const handleDelete = async (pns) => {
    if (window.confirm(`Yakin ingin menghapus data ${pns.nama}?`)) {
      await deletePNS(pns.id);
    }
  };

  // Export to CSV/Excel
  const handleExportCSV = () => {
    if (pnsList.length === 0) {
      alert("Tidak ada data untuk di-export!");
      return;
    }

    const headers = ["No", "Nama", "NIP", "Jabatan", "Pangkat", "Golongan"];
    const rows = pnsList.map((pns, index) =>
      [
        index + 1,
        pns.nama || "-",
        pns.nip || "-",
        pns.jabatan || "-",
        pns.pangkat || "-",
        pns.golongan || "-",
      ].join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Data_Karyawan_PNS_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  // Helper function untuk cek golongan yang lebih akurat
  const matchGolonganPrefix = (golongan, prefix) => {
    if (!golongan) return false;
    // Gunakan regex untuk memastikan match yang tepat
    // Contoh: "IV" harus match "IV/a", "IV/b" tapi tidak "IVX"
    // "III" harus match "III/a" tapi tidak "II/a"
    // "II" harus match "II/a", "II/b" tapi tidak "III/a"
    const regex = new RegExp(`^${prefix}(?:[^IV]|$)`, "i");
    return regex.test(golongan);
  };

  // Filter berdasarkan pencarian dan golongan
  const filteredPNS = pnsList.filter((pns) => {
    // Filter berdasarkan pencarian (termasuk golongan dan pangkat)
    const matchSearch =
      pns.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pns.nip?.includes(searchTerm) ||
      pns.jabatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pns.golongan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pns.pangkat?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter berdasarkan golongan dropdown
    const matchGolonganFilter =
      filterGolongan === "" ||
      matchGolonganPrefix(pns.golongan, filterGolongan);

    return matchSearch && matchGolonganFilter;
  });

  return (
    <div className="space-y-6">
      {/* Modal */}
      <ModalPns
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editData}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Data Karyawan PNS
          </h2>
          <p className="text-slate-500 mt-1">
            Kelola data karyawan Dinas Perkim Lombok Timur
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={pnsList.length === 0}
            className="inline-flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-200 active:scale-95"
          >
            <span>📊</span>
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <span className="text-lg">+</span>
            <span>Tambah Karyawan</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Cari nama, NIP, atau jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
          </div>
          <div className="flex gap-2">
            <select
              value={filterGolongan}
              onChange={(e) => setFilterGolongan(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-600"
            >
              <option value="">Semua Golongan</option>
              <option value="IV">Golongan IV</option>
              <option value="III">Golongan III</option>
              <option value="II">Golongan II</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-blue-600">{pnsList.length}</p>
          <p className="text-sm text-slate-500">Total PNS</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-green-600">
            {
              pnsList.filter((p) => matchGolonganPrefix(p.golongan, "IV"))
                .length
            }
          </p>
          <p className="text-sm text-slate-500">Golongan IV</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-yellow-600">
            {
              pnsList.filter((p) => matchGolonganPrefix(p.golongan, "III"))
                .length
            }
          </p>
          <p className="text-sm text-slate-500">Golongan III</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-purple-600">
            {
              pnsList.filter((p) => matchGolonganPrefix(p.golongan, "II"))
                .length
            }
          </p>
          <p className="text-sm text-slate-500">Golongan II</p>
        </div>
      </div>

      {/* Table */}
      <TablePNS
        data={filteredPNS}
        loading={loading}
        totalData={pnsList.length}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        emptyState={
          searchTerm || filterGolongan
            ? {
                icon: "🔍",
                title: "Tidak ada hasil ditemukan",
                description: `Tidak ditemukan data yang cocok dengan pencarian "${searchTerm}"${
                  filterGolongan ? ` dan filter Golongan ${filterGolongan}` : ""
                }`,
                actionLabel: "Reset Filter",
                onAction: () => {
                  setSearchTerm("");
                  setFilterGolongan("");
                },
              }
            : {
                icon: "📭",
                title: "Belum ada data karyawan",
                description: "Silakan tambahkan data karyawan PNS baru",
                actionLabel: "Tambah Karyawan",
                onAction: handleOpenAdd,
              }
        }
      />
    </div>
  );
};

export default Karyawan;
