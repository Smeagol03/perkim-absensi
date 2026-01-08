import { ref, get, set, onValue } from "firebase/database";
import { database } from "../config/firebase";

// ==================== ABSENSI ====================

/**
 * Simpan absensi PNS untuk tanggal tertentu (batch save)
 * @param {string} tanggal - Format: "2026-01-07"
 * @param {object} absensiData - { pnsId: { status, nama, nip, jabatan } }
 */
export const saveAbsensiPNS = async (tanggal, absensiData) => {
  try {
    const absensiRef = ref(database, `absensi/${tanggal}/pns`);
    await set(absensiRef, {
      ...absensiData,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("Error saving Absensi PNS:", error);
    throw error;
  }
};

/**
 * Ambil data absensi PNS berdasarkan tanggal
 * @param {string} tanggal - Format: "2026-01-07"
 * @returns {Promise<object>} - { pnsId: status, ... }
 */
export const getAbsensiPNS = async (tanggal) => {
  try {
    const snapshot = await get(ref(database, `absensi/${tanggal}/pns`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Konversi ke format { pnsId: status }
      const result = {};
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "updatedAt" && value?.status) {
          result[key] = value.status;
        }
      });
      return result;
    }
    return {};
  } catch (error) {
    console.error("Error fetching Absensi PNS:", error);
    return {};
  }
};

/**
 * Subscribe ke perubahan data absensi PNS (realtime)
 * @param {string} tanggal - Format: "2026-01-07"
 * @param {function} callback
 * @returns {function} Unsubscribe function
 */
export const subscribeAbsensiPNS = (tanggal, callback) => {
  const absensiRef = ref(database, `absensi/${tanggal}/pns`);
  return onValue(absensiRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const result = {};
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "updatedAt" && value?.status) {
          result[key] = value.status;
        }
      });
      callback(result);
    } else {
      callback({});
    }
  });
};

// ==================== ABSENSI P3K ====================

/**
 * Simpan absensi P3K untuk tanggal tertentu (batch save)
 * @param {string} tanggal - Format: "2026-01-07"
 * @param {object} absensiData - { p3kId: { status, nama, nipppk, jabatan } }
 */
export const saveAbsensiP3K = async (tanggal, absensiData) => {
  try {
    const absensiRef = ref(database, `absensi/${tanggal}/p3k`);
    await set(absensiRef, {
      ...absensiData,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("Error saving Absensi P3K:", error);
    throw error;
  }
};

/**
 * Ambil data absensi P3K berdasarkan tanggal
 * @param {string} tanggal - Format: "2026-01-07"
 * @returns {Promise<object>} - { p3kId: status, ... }
 */
export const getAbsensiP3K = async (tanggal) => {
  try {
    const snapshot = await get(ref(database, `absensi/${tanggal}/p3k`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const result = {};
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "updatedAt" && value?.status) {
          result[key] = value.status;
        }
      });
      return result;
    }
    return {};
  } catch (error) {
    console.error("Error fetching Absensi P3K:", error);
    return {};
  }
};

/**
 * Subscribe ke perubahan data absensi P3K (realtime)
 * @param {string} tanggal - Format: "2026-01-07"
 * @param {function} callback
 * @returns {function} Unsubscribe function
 */
export const subscribeAbsensiP3K = (tanggal, callback) => {
  const absensiRef = ref(database, `absensi/${tanggal}/p3k`);
  return onValue(absensiRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const result = {};
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "updatedAt" && value?.status) {
          result[key] = value.status;
        }
      });
      callback(result);
    } else {
      callback({});
    }
  });
};

// ==================== LAPORAN BULANAN ====================

/**
 * Ambil data absensi bulanan (semua tanggal dalam bulan)
 * @param {number} tahun - Tahun (e.g. 2026)
 * @param {number} bulan - Bulan 1-12 (e.g. 1 untuk Januari)
 * @param {string} tipe - "pns" atau "p3k"
 * @returns {Promise<object>} - { tanggal: { karyawanId: {status, nama, ...} } }
 */
export const getAbsensiBulanan = async (tahun, bulan, tipe = "pns") => {
  try {
    // Hitung jumlah hari dalam bulan
    const jumlahHari = new Date(tahun, bulan, 0).getDate();
    const result = {};

    // Loop untuk setiap tanggal dalam bulan
    for (let hari = 1; hari <= jumlahHari; hari++) {
      const tanggal = `${tahun}-${String(bulan).padStart(2, "0")}-${String(
        hari
      ).padStart(2, "0")}`;

      const snapshot = await get(ref(database, `absensi/${tanggal}/${tipe}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        result[tanggal] = {};
        Object.entries(data).forEach(([key, value]) => {
          if (key !== "updatedAt" && value?.status) {
            result[tanggal][key] = value;
          }
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching Absensi Bulanan:", error);
    return {};
  }
};

/**
 * Hitung rekap absensi per karyawan untuk satu bulan
 * @param {object} absensiBulanan - Data dari getAbsensiBulanan
 * @returns {object} - { karyawanId: { nama, nip, hadir, izin, sakit, cuti, alpha } }
 */
export const hitungRekapBulanan = (absensiBulanan) => {
  const rekap = {};

  Object.values(absensiBulanan).forEach((absensiHarian) => {
    Object.entries(absensiHarian).forEach(([karyawanId, data]) => {
      if (!rekap[karyawanId]) {
        rekap[karyawanId] = {
          nama: data.nama || "-",
          nip: data.nip || data.nipppk || "-",
          jabatan: data.jabatan || "-",
          hadir: 0,
          izin: 0,
          sakit: 0,
          cuti: 0,
          alpha: 0,
        };
      }

      // Increment counter berdasarkan status
      const status = data.status?.toLowerCase();
      if (status && rekap[karyawanId][status] !== undefined) {
        rekap[karyawanId][status]++;
      }
    });
  });

  return rekap;
};
