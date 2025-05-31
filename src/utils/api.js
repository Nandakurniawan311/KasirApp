import axios from 'axios';
import { API_CONFIG, checkServerConnection, getAvailablePort } from './config';

// Membuat instance axios dengan konfigurasi dasar
const createApiInstance = (baseURL) => {
  return axios.create({
    baseURL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Fungsi untuk mencoba koneksi dengan retry
const tryConnect = async () => {
  let attempts = 0;
  let api = createApiInstance(API_CONFIG.BASE_URL);

  while (attempts < API_CONFIG.RETRY_ATTEMPTS) {
    try {
      const isConnected = await checkServerConnection();
      if (isConnected) {
        return api;
      }
    } catch (error) {
      console.warn(`Attempt ${attempts + 1} failed:`, error);
    }

    attempts++;
    if (attempts < API_CONFIG.RETRY_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      
      // Coba port lain jika port default tidak tersedia
      const availablePort = await getAvailablePort();
      if (availablePort) {
        api = createApiInstance(`http://localhost:${availablePort}`);
      }
    }
  }

  throw new Error('Tidak dapat terhubung ke server. Pastikan JSON Server berjalan.');
};

// Inisialisasi API instance
let api = createApiInstance(API_CONFIG.BASE_URL);

// Fungsi untuk mendapatkan instance API yang terhubung
const getApi = async () => {
  try {
    await checkServerConnection();
    return api;
  } catch (error) {
    api = await tryConnect();
    return api;
  }
};

// Categories API
export const getCategories = async () => {
  try {
    const apiInstance = await getApi();
    const response = await apiInstance.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Gagal memuat kategori. Pastikan JSON Server berjalan.');
  }
};

// Products API
export const getProducts = async () => {
  try {
    const apiInstance = await getApi();
    const response = await apiInstance.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Gagal memuat produk. Pastikan JSON Server berjalan.');
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const apiInstance = await getApi();
    const response = await apiInstance.get(`/products?kategori=${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Gagal memuat produk berdasarkan kategori.');
  }
};

// Cart API
export const getCart = async () => {
  try {
    const apiInstance = await getApi();
    const response = await apiInstance.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw new Error('Gagal memuat keranjang.');
  }
};

export const addToCart = async (cartItem) => {
  try {
    const apiInstance = await getApi();
    const response = await apiInstance.post('/cart', cartItem);
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw new Error('Gagal menambahkan item ke keranjang.');
  }
};

export const updateCartItem = async (id, cartItem) => {
  try {
    const apiInstance = await getApi();
    const response = await apiInstance.put(`/cart/${id}`, cartItem);
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw new Error('Gagal mengupdate item di keranjang.');
  }
};

export const removeFromCart = async (id) => {
  try {
    const apiInstance = await getApi();
    await apiInstance.delete(`/cart/${id}`);
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw new Error('Gagal menghapus item dari keranjang.');
  }
};

export const clearCart = async () => {
  try {
    const cart = await getCart();
    const deletePromises = cart.map(item => removeFromCart(item.id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw new Error('Gagal mengosongkan keranjang.');
  }
};

// Format currency helper
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};
