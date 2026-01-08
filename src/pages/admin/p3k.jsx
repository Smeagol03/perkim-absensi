import React, { useState, useEffect } from "react";
import { subscribeP3K, deleteP3K } from "../../services/database/p3k";
import ModalP3k from "./components/modalP3k";
import TableP3K from "./components/TableP3K";

const P3k = () => {
  const [p3kList, setP3kList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    // Subscribe ke data P3K (realtime)
    const unsubscribe = subscribeP3K((data) => {
      setP3kList(data);
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
  const handleOpenEdit = (p3k) => {
    setEditData(p3k);
    setIsModalOpen(true);
  };

  // Fungsi hapus
  const handleDelete = async (p3k) => {
    if (window.confirm(`Yakin ingin menghapus data ${p3k.nama}?`)) {
      await deleteP3K(p3k.id);
    }
  };

  // Export to CSV/Excel
  const handleExportCSV = () => {
    if (p3kList.length === 0) {
      alert("Tidak ada data untuk di-export!");
      return;
    }

    const headers = [
      "No",
      "Nama",
      "NI PPPK",
      "Jabatan",
      "Pangkat",
      "Golongan",
      "Bidang",
    ];
    const rows = p3kList.map((p3k, index) =>
      [
        index + 1,
        p3k.nama || "-",
        p3k.nipppk || "-",
        p3k.jabatan || "-",
        p3k.pangkat || "-",
        p3k.golongan || "-",
        p3k.bidang || "-",
      ].join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Data_Karyawan_P3K_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  // Filter berdasarkan pencarian
  const filteredP3K = p3kList.filter(
    (p3k) =>
      p3k.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p3k.nipppk?.includes(searchTerm) ||
      p3k.jabatan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Modal */}
      <ModalP3k
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editData}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Data Karyawan P3K
          </h2>
          <p className="text-slate-500 mt-1">
            Kelola data karyawan P3K Dinas Perkim Lombok Timur
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={p3kList.length === 0}
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
            <span>Tambah Karyawan P3K</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-blue-600">{p3kList.length}</p>
          <p className="text-sm text-slate-500">Total P3K</p>
        </div>
      </div>

      {/* Table */}
      <TableP3K
        data={filteredP3K}
        loading={loading}
        totalData={p3kList.length}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        emptyState={
          searchTerm
            ? {
                icon: "🔍",
                title: "Tidak ada hasil ditemukan",
                description: `Tidak ditemukan data yang cocok dengan pencarian "${searchTerm}"`,
                actionLabel: "Reset Pencarian",
                onAction: () => setSearchTerm(""),
              }
            : {
                icon: "📭",
                title: "Belum ada data karyawan P3K",
                description: "Silakan tambahkan data karyawan P3K baru",
                actionLabel: "Tambah Karyawan P3K",
                onAction: handleOpenAdd,
              }
        }
      />
    </div>
  );
};

export default P3k;
