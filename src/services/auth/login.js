import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../config/firebase";

/**
 * Login with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let message = "Terjadi kesalahan saat login.";
    
    switch (error.code) {
      case "auth/user-not-found":
        message = "Akun dengan email ini tidak ditemukan.";
        break;
      case "auth/wrong-password":
        message = "Kata sandi yang Anda masukkan salah.";
        break;
      case "auth/invalid-email":
        message = "Format email tidak valid.";
        break;
      case "auth/user-disabled":
        message = "Akun ini telah dinonaktifkan.";
        break;
      case "auth/too-many-requests":
        message = "Terlalu banyak percobaan login. Coba lagi nanti.";
        break;
      case "auth/invalid-credential":
        message = "Email atau kata sandi salah.";
        break;
      default:
        message = error.message;
    }
    
    return { success: false, error: message };
  }
};

/**
 * Logout current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get current authenticated user
 * @returns {User|null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 * @param {function} callback 
 * @returns {function} Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
