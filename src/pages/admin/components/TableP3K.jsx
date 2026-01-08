import React from "react";
import EmptyState from "../../../components/EmptyState";

/**
 * TableP3K - Komponen tabel khusus untuk data P3K
 *
 * @param {Object} props
 * @param {Array} props.data - Data P3K yang sudah difilter
 * @param {boolean} props.loading - Status loading
 * @param {number} props.totalData - Total data sebelum filter
 * @param {Function} props.onEdit - Handler untuk edit
 * @param {Function} props.onDelete - Handler untuk hapus
 * @param {Object} props.emptyState - Props untuk empty state
 */
const TableP3K = ({
  data = [],
  loading = false,
  totalData = 0,
  onEdit,
  onDelete,
  emptyState = {},
  showActions = true,
}) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[550px]">
          {/* Table Header */}
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider w-[50px] sm:w-[60px]">
                No
              </th>
              <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[180px] sm:min-w-[220px]">
                Nama / NI PPPK
              </th>
              <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[120px] sm:min-w-[150px]">
                Jabatan
              </th>
              <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[80px] sm:min-w-[100px]">
                Golongan
              </th>
              {showActions && (
                <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider w-[80px] sm:w-[100px]">
                  Aksi
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              // Loading State
              <tr>
                <td
                  colSpan={showActions ? 5 : 4}
                  className="px-3 sm:px-6 py-8 sm:py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm sm:text-base">
                      Memuat data...
                    </p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={showActions ? 5 : 4} className="px-3 sm:px-6 py-4">
                  <EmptyState
                    icon={emptyState.icon || "📭"}
                    title={emptyState.title || "Belum ada data karyawan P3K"}
                    description={
                      emptyState.description ||
                      "Silakan tambahkan data karyawan P3K baru"
                    }
                    actionLabel={emptyState.actionLabel}
                    onAction={emptyState.onAction}
                  />
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((p3k, index) => (
                <tr
                  key={p3k.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-slate-500 font-medium text-xs sm:text-sm">
                    {index + 1}
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                        {p3k.nama}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 truncate">
                        {p3k.nipppk}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2">
                      {p3k.jabatan}
                    </p>
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                    <span className="inline-block px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-semibold rounded-full">
                      {p3k.golongan}
                    </span>
                  </td>
                  {showActions && (
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => onEdit(p3k)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm sm:text-base"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDelete(p3k)}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {!loading && data.length > 0 && (
        <div className="px-3 sm:px-6 py-3 sm:py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs sm:text-sm text-slate-500">
            Menampilkan <span className="font-semibold">{data.length}</span>{" "}
            dari <span className="font-semibold">{totalData}</span> karyawan P3K
          </p>
        </div>
      )}
    </div>
  );
};

export default TableP3K;
