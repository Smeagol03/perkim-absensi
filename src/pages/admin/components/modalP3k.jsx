import React, { useState, useEffect } from "react";
import { addP3K, updateP3K } from "../../../services/database/p3k";

const ModalP3k = ({ isOpen, onClose, editData = null }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nipppk: "",
    jabatan: "",
    pangkat: "",
    golongan: "",
  });

  // Jika ada editData, isi form dengan data yang ada
  useEffect(() => {
    if (editData) {
      setFormData({
        nama: editData.nama || "",
        nipppk: editData.nipppk || "",
        jabatan: editData.jabatan || "",
        pangkat: editData.pangkat || "",
        golongan: editData.golongan || "",
      });
    } else {
      setFormData({
        nama: "",
        nipppk: "",
        jabatan: "",
        pangkat: "",
        golongan: "",
      });
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        // Update existing P3K
        await updateP3K(editData.id, formData);
      } else {
        // Add new P3K
        await addP3K(formData);
      }
      onClose();
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editData ? "Edit Data P3K" : "Tambah Karyawan P3K Baru"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {editData
                ? "Perbarui informasi karyawan P3K"
                : "Isi data karyawan P3K"}
            </p>
          </div>
          <button
            onClick={onClose}
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto max-h-[60vh]"
        >
          {/* Nama */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>

          {/* NI PPPK */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              NI PPPK <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nipppk"
              value={formData.nipppk}
              onChange={handleChange}
              required
              placeholder="Contoh: 19711231 200003 1 033"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Jabatan */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Jabatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              required
              placeholder="Contoh: Ahli Pertama"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Pangkat & Golongan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Pangkat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pangkat"
                value={formData.pangkat}
                onChange={handleChange}
                required
                placeholder="Contoh: IX"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Golongan <span className="text-red-500">*</span>
              </label>
              <select
                name="golongan"
                value={formData.golongan}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              >
                <option value="">Pilih</option>
                <option value="IX">IX</option>
                <option value="X">X</option>
                <option value="VII">VII</option>
                <option value="V">V</option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-medium transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>{editData ? "Simpan Perubahan" : "Tambah Karyawan"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalP3k;
