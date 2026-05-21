// src/api/api.ts (KODE DIPERBARUI)
import axios from 'axios';

// --- PERUBAHAN 1: Hapus IP_BACKEND ---
// const IP_BACKEND = '[IP_ANDA_DISINI]:8080';
// const BASE_URL = `http://${IP_BACKEND}/api`; 

// Ganti menjadi URL relatif. Proxy Vite akan menangkap ini.
const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;

// --- PERUBAHAN 2: Gunakan URL relatif untuk file ---
export const getFileURL = (path: string) => {
  // const BASE_SERVER_URL = `http://${IP_BACKEND}`;
  // return `${BASE_SERVER_URL}/${path.replace(/\\/g, '/')}`;

  // Ganti menjadi URL relatif. Proxy Vite akan menangkap '/uploads'
  return `/${path.replace(/\\/g, '/')}`;
};
