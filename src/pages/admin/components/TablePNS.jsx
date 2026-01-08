import React from "react";
import EmptyState from "../../../components/EmptyState";

/**
 * TablePNS - Komponen tabel khusus untuk data PNS
 *
 * @param {Object} props
 * @param {Array} props.data - Data PNS yang sudah difilter
 * @param {boolean} props.loading - Status loading
 * @param {number} props.totalData - Total data sebelum filter
 * @param {Function} props.onEdit - Handler untuk edit
 * @param {Function} props.onDelete - Handler untuk hapus
 * @param {Object} props.emptyState - Props untuk empty state
 */
const TablePNS = ({
  data = [],
  loading = false,
  totalData = 0,
  onEdit,
  onDelete,
  emptyState = {},
  showActions = true,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                No
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Nama / NIP
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Jabatan
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pangkat / Golongan
              </th>
              {showActions && (
                <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500">Memuat data...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={showActions ? 5 : 4} className="px-6 py-4">
                  <EmptyState
                    icon={emptyState.icon || "📭"}
                    title={emptyState.title || "Belum ada data karyawan"}
                    description={
                      emptyState.description ||
                      "Silakan tambahkan data karyawan PNS baru"
                    }
                    actionLabel={emptyState.actionLabel}
                    onAction={emptyState.onAction}
                  />
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((pns, index) => (
                <tr
                  key={pns.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{pns.nama}</p>
                      <p className="text-sm text-slate-500">{pns.nip}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{pns.jabatan}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-slate-800">{pns.pangkat}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {pns.golongan}
                      </span>
                    </div>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(pns)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDelete(pns)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold">{data.length}</span>{" "}
            dari <span className="font-semibold">{totalData}</span> karyawan
          </p>
        </div>
      )}
    </div>
  );
};

export default TablePNS;
