import { ref, get, set, push, update, remove, onValue } from "firebase/database";
import { database } from "../config/firebase";

// ==================== PNS (Karyawan) ====================

/**
 * Ambil semua data PNS
 * @returns {Promise<Array>}
 */
export const getAllPNS = async () => {
  try {
    const snapshot = await get(ref(database, "pns"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Konversi object ke array dengan id
      return Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching PNS:", error);
    return [];
  }
};

/**
 * Subscribe ke perubahan data PNS (realtime)
 * @param {function} callback 
 * @returns {function} Unsubscribe function
 */
export const subscribePNS = (callback) => {
  const pnsRef = ref(database, "pns");
  return onValue(pnsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const pnsList = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      callback(pnsList);
    } else {
      callback([]);
    }
  });
};

/**
 * Tambah PNS baru
 * @param {object} pnsData 
 * @returns {Promise<string>} ID dari data baru
 */
export const addPNS = async (pnsData) => {
  try {
    const newRef = push(ref(database, "pns"));
    await set(newRef, {
      ...pnsData,
      updatedAt: new Date().toISOString(),
    });
    return newRef.key;
  } catch (error) {
    console.error("Error adding PNS:", error);
    throw error;
  }
};

/**
 * Update data PNS
 * @param {string} id 
 * @param {object} pnsData 
 */
export const updatePNS = async (id, pnsData) => {
  try {
    await update(ref(database, `pns/${id}`), {
      ...pnsData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating PNS:", error);
    throw error;
  }
};

/**
 * Hapus data PNS
 * @param {string} id 
 */
export const deletePNS = async (id) => {
  try {
    await remove(ref(database, `pns/${id}`));
  } catch (error) {
    console.error("Error deleting PNS:", error);
    throw error;
  }
};
