import React, { useState, useEffect } from "react";
import { subscribePNS } from "../../services/database/pns";
import { subscribeP3K } from "../../services/database/p3k";
import {
  getAbsensiBulanan,
  hitungRekapBulanan,
  getAbsensiPNS,
  getAbsensiP3K,
} from "../../services/database/absensi";
import EmptyState from "../../components/EmptyState";

const Laporan = () => {
  const [pnsList, setPnsList] = useState([]);
  const [p3kList, setP3kList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tipeKaryawan, setTipeKaryawan] = useState("pns");

  // Periode: harian, mingguan, bulanan
  const [periode, setPeriode] = useState("bulanan");

  // Filter untuk harian
  const [tanggalHarian, setTanggalHarian] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Filter untuk mingguan
  const [tanggalMulai, setTanggalMulai] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1); // Set to Monday
    return monday.toISOString().split("T")[0];
  });

  // Filter untuk bulanan
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());

  // Data rekap
  const [rekapData, setRekapData] = useState({});
  // Data harian (format berbeda)
  const [dataHarian, setDataHarian] = useState({});

  // Nama bulan
  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Load data karyawan
  useEffect(() => {
    const unsubPNS = subscribePNS((data) => setPnsList(data));
    const unsubP3K = subscribeP3K((data) => setP3kList(data));

    return () => {
      unsubPNS();
      unsubP3K();
    };
  }, []);

  // Helper: Get 5 working days (Senin-Jumat) starting from tanggalMulai
  const getWeekDates = (startDate) => {
    const dates = [];
    const start = new Date(startDate);
    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  // Load rekap berdasarkan periode
  const handleLoadRekap = async () => {
    setLoading(true);
    setRekapData({});
    setDataHarian({});

    try {
      if (periode === "harian") {
        // Query 1 tanggal saja
        const getAbsensi =
          tipeKaryawan === "pns" ? getAbsensiPNS : getAbsensiP3K;
        const absensiHarian = await getAbsensi(tanggalHarian);

        // Gabungkan dengan data karyawan
        const karyawanList = tipeKaryawan === "pns" ? pnsList : p3kList;
        const result = {};
        karyawanList.forEach((k) => {
          result[k.id] = {
            nama: k.nama,
            nip: k.nip || k.nipppk || "-",
            jabatan: k.jabatan || "-",
            status: absensiHarian[k.id] || "-",
          };
        });
        setDataHarian(result);
      } else if (periode === "mingguan") {
        // Query 7 tanggal
        const weekDates = getWeekDates(tanggalMulai);
        const allAbsensi = {};

        for (const tanggal of weekDates) {
          const getAbsensi =
            tipeKaryawan === "pns" ? getAbsensiPNS : getAbsensiP3K;
          const snapshot = await getAbsensi(tanggal);
          // Convert to full data format for hitungRekapBulanan
          allAbsensi[tanggal] = {};
          Object.entries(snapshot).forEach(([id, status]) => {
            const karyawanList = tipeKaryawan === "pns" ? pnsList : p3kList;
            const k = karyawanList.find((x) => x.id === id);
            if (k) {
              allAbsensi[tanggal][id] = {
                status,
                nama: k.nama,
                nip: k.nip || k.nipppk,
                jabatan: k.jabatan,
              };
            }
          });
        }

        const rekap = hitungRekapBulanan(allAbsensi);
        setRekapData(rekap);
      } else {
        // Bulanan (existing logic)
        const absensiBulanan = await getAbsensiBulanan(
          tahun,
          bulan,
          tipeKaryawan
        );
        const rekap = hitungRekapBulanan(absensiBulanan);
        setRekapData(rekap);
      }
    } catch (error) {
      console.error("Error loading rekap:", error);
    } finally {
      setLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = "";
    let filename = "";

    if (periode === "harian") {
      const dataArray = Object.entries(dataHarian);
      if (dataArray.length === 0) {
        alert("Tidak ada data untuk di-export!");
        return;
      }

      const headers = ["No", "Nama", "NIP/NI PPPK", "Jabatan", "Status"];
      const rows = dataArray.map(([_, data], index) =>
        [index + 1, data.nama, data.nip, data.jabatan, data.status].join(",")
      );
      csvContent = [headers.join(","), ...rows].join("\n");
      filename = `Laporan_Absensi_${tipeKaryawan.toUpperCase()}_${tanggalHarian}.csv`;
    } else {
      const rekapArray = Object.entries(rekapData);
      if (rekapArray.length === 0) {
        alert("Tidak ada data untuk di-export!");
        return;
      }

      const headers = [
        "No",
        "Nama",
        "NIP/NI PPPK",
        "Jabatan",
        "Hadir",
        "Izin",
        "Sakit",
        "Cuti",
        "Alpha",
        "Total",
      ];
      const rows = rekapArray.map(([_, data], index) => {
        const total =
          data.hadir + data.izin + data.sakit + data.cuti + data.alpha;
        return [
          index + 1,
          data.nama,
          data.nip,
          data.jabatan,
          data.hadir,
          data.izin,
          data.sakit,
          data.cuti,
          data.alpha,
          total,
        ].join(",");
      });
      csvContent = [headers.join(","), ...rows].join("\n");

      if (periode === "mingguan") {
        filename = `Laporan_Absensi_${tipeKaryawan.toUpperCase()}_Minggu_${tanggalMulai}.csv`;
      } else {
        filename = `Laporan_Absensi_${tipeKaryawan.toUpperCase()}_${
          namaBulan[bulan - 1]
        }_${tahun}.csv`;
      }
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Convert rekap/data to array for display
  const rekapArray = Object.entries(rekapData).map(([id, data]) => ({
    id,
    ...data,
  }));

  const harianArray = Object.entries(dataHarian).map(([id, data]) => ({
    id,
    ...data,
  }));

  // Hitung total statistik
  const totalStats = rekapArray.reduce(
    (acc, curr) => ({
      hadir: acc.hadir + curr.hadir,
      izin: acc.izin + curr.izin,
      sakit: acc.sakit + curr.sakit,
      cuti: acc.cuti + curr.cuti,
      alpha: acc.alpha + curr.alpha,
    }),
    { hadir: 0, izin: 0, sakit: 0, cuti: 0, alpha: 0 }
  );

  // Hitung stats untuk harian
  const harianStats = harianArray.reduce(
    (acc, curr) => {
      const s = curr.status?.toLowerCase();
      if (s === "hadir") acc.hadir++;
      else if (s === "izin") acc.izin++;
      else if (s === "sakit") acc.sakit++;
      else if (s === "cuti") acc.cuti++;
      else if (s === "alpha") acc.alpha++;
      else acc.belum++;
      return acc;
    },
    { hadir: 0, izin: 0, sakit: 0, cuti: 0, alpha: 0, belum: 0 }
  );

  // Get label periode
  const getLabelPeriode = () => {
    if (periode === "harian") return tanggalHarian;
    if (periode === "mingguan") {
      const endDate = new Date(tanggalMulai);
      endDate.setDate(endDate.getDate() + 4); // Senin + 4 = Jumat
      return `${tanggalMulai} s/d ${endDate.toISOString().split("T")[0]}`;
    }
    return `${namaBulan[bulan - 1]} ${tahun}`;
  };

  // Determine if there's data to show
  const hasData =
    periode === "harian" ? harianArray.length > 0 : rekapArray.length > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Laporan Absensi</h2>
          <p className="text-slate-500 mt-1">
            Rekap absensi harian, mingguan, dan bulanan
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!hasData}
          className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-200 active:scale-95"
        >
          <span>📊</span>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col gap-4">
          {/* Row 1: Periode & Tipe */}
          <div className="flex flex-wrap gap-4">
            {/* Periode */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Periode
              </label>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { value: "harian", label: "📅 Harian" },
                  { value: "mingguan", label: "📆 Mingguan" },
                  { value: "bulanan", label: "🗓️ Bulanan" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPeriode(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      periode === opt.value
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipe Karyawan */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Tipe Karyawan
              </label>
              <select
                value={tipeKaryawan}
                onChange={(e) => setTipeKaryawan(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="pns">PNS</option>
                <option value="p3k">P3K</option>
              </select>
            </div>
          </div>

          {/* Row 2: Date selectors based on periode */}
          <div className="flex flex-wrap gap-4 items-end">
            {periode === "harian" && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={tanggalHarian}
                  onChange={(e) => setTanggalHarian(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

            {periode === "mingguan" && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Minggu Mulai (Senin)
                </label>
                <input
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

            {periode === "bulanan" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Bulan
                  </label>
                  <select
                    value={bulan}
                    onChange={(e) => setBulan(Number(e.target.value))}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {namaBulan.map((nama, index) => (
                      <option key={index} value={index + 1}>
                        {nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Tahun
                  </label>
                  <select
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {[2024, 2025, 2026, 2027].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Tombol Load */}
            <button
              onClick={handleLoadRekap}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-all"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memuat...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Tampilkan Rekap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {hasData && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-blue-600">
              {periode === "harian" ? harianArray.length : rekapArray.length}
            </p>
            <p className="text-sm text-slate-500">Karyawan</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-green-600">
              {periode === "harian" ? harianStats.hadir : totalStats.hadir}
            </p>
            <p className="text-sm text-slate-500">
              {periode === "harian" ? "Hadir" : "Total Hadir"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-yellow-600">
              {periode === "harian" ? harianStats.izin : totalStats.izin}
            </p>
            <p className="text-sm text-slate-500">
              {periode === "harian" ? "Izin" : "Total Izin"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-orange-600">
              {periode === "harian" ? harianStats.sakit : totalStats.sakit}
            </p>
            <p className="text-sm text-slate-500">
              {periode === "harian" ? "Sakit" : "Total Sakit"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-blue-500">
              {periode === "harian" ? harianStats.cuti : totalStats.cuti}
            </p>
            <p className="text-sm text-slate-500">
              {periode === "harian" ? "Cuti" : "Total Cuti"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-red-600">
              {periode === "harian" ? harianStats.alpha : totalStats.alpha}
            </p>
            <p className="text-sm text-slate-500">
              {periode === "harian" ? "Alpha" : "Total Alpha"}
            </p>
          </div>
        </div>
      )}

      {/* Table Rekap */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">
            Rekap Absensi {tipeKaryawan.toUpperCase()} - {getLabelPeriode()}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  No
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  NIP/NI PPPK
                </th>
                {periode === "harian" ? (
                  <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                ) : (
                  <>
                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Hadir
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Izin
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Sakit
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Cuti
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Alpha
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={periode === "harian" ? 4 : 8}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-slate-500">Memuat data rekap...</p>
                    </div>
                  </td>
                </tr>
              ) : !hasData ? (
                <tr>
                  <td
                    colSpan={periode === "harian" ? 4 : 8}
                    className="px-6 py-4"
                  >
                    <EmptyState
                      icon="📊"
                      title="Belum ada data rekap"
                      description="Pilih periode dan klik 'Tampilkan Rekap' untuk melihat data"
                    />
                  </td>
                </tr>
              ) : periode === "harian" ? (
                // Render for Harian
                harianArray.map((data, index) => (
                  <tr
                    key={data.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {data.nama}
                      </p>
                      <p className="text-sm text-slate-500">{data.jabatan}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{data.nip}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold ${
                          data.status === "hadir"
                            ? "bg-green-100 text-green-700"
                            : data.status === "izin"
                            ? "bg-yellow-100 text-yellow-700"
                            : data.status === "sakit"
                            ? "bg-orange-100 text-orange-700"
                            : data.status === "cuti"
                            ? "bg-blue-100 text-blue-700"
                            : data.status === "alpha"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {data.status === "-" ? "Belum diisi" : data.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                // Render for Mingguan/Bulanan
                rekapArray.map((data, index) => (
                  <tr
                    key={data.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {data.nama}
                      </p>
                      <p className="text-sm text-slate-500">{data.jabatan}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{data.nip}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                        {data.hadir}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                        {data.izin}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                        {data.sakit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                        {data.cuti}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                        {data.alpha}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {hasData && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Total{" "}
              <span className="font-semibold">
                {periode === "harian" ? harianArray.length : rekapArray.length}
              </span>{" "}
              karyawan {tipeKaryawan.toUpperCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Laporan;
