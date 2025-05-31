// Konfigurasi API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  TIMEOUT: 5000, // 5 detik
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 detik
};

// Fungsi untuk mengecek koneksi ke server
export const checkServerConnection = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/categories`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Fungsi untuk mendapatkan port yang tersedia
export const getAvailablePort = async (startPort = 3001) => {
  for (let port = startPort; port < startPort + 10; port++) {
    try {
      const response = await fetch(`http://localhost:${port}/categories`);
      if (response.ok) {
        return port;
      }
    } catch (error) {
      continue;
    }
  }
  return null;
}; 