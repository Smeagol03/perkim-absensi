import { ref, get, set, push, update, remove, onValue } from "firebase/database";
import { database } from "../config/firebase";

// ==================== P3K (Pegawai Pemerintah dengan Perjanjian Kerja) ====================

/**
 * Ambil semua data P3K
 * @returns {Promise<Array>}
 */
export const getAllP3K = async () => {
  try {
    const snapshot = await get(ref(database, "p3k"));
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
    console.error("Error fetching P3K:", error);
    return [];
  }
};

/**
 * Subscribe ke perubahan data P3K (realtime)
 * @param {function} callback 
 * @returns {function} Unsubscribe function
 */
export const subscribeP3K = (callback) => {
  const p3kRef = ref(database, "p3k");
  return onValue(p3kRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const p3kList = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      callback(p3kList);
    } else {
      callback([]);
    }
  });
};

/**
 * Tambah P3K baru
 * @param {object} p3kData 
 * @returns {Promise<string>} ID dari data baru
 */
export const addP3K = async (p3kData) => {
  try {
    const newRef = push(ref(database, "p3k"));
    await set(newRef, {
      ...p3kData,
      updatedAt: new Date().toISOString(),
    });
    return newRef.key;
  } catch (error) {
    console.error("Error adding P3K:", error);
    throw error;
  }
};

/**
 * Update data P3K
 * @param {string} id 
 * @param {object} p3kData 
 */
export const updateP3K = async (id, p3kData) => {
  try {
    await update(ref(database, `p3k/${id}`), {
      ...p3kData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating P3K:", error);
    throw error;
  }
};

/**
 * Hapus data P3K
 * @param {string} id 
 */
export const deleteP3K = async (id) => {
  try {
    await remove(ref(database, `p3k/${id}`));
  } catch (error) {
    console.error("Error deleting P3K:", error);
    throw error;
  }
};
