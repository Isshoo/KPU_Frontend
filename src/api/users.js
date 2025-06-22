import { BASE_URL } from '../globals/config';
import { _fetchWithAuth } from '../utils/auth_helper';

async function getOwnProfile() {
  try {
    const response = await _fetchWithAuth(`${BASE_URL}/users/me`);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesi telah berakhir. Silakan login kembali.');
      } else if (response.status === 404) {
        throw new Error('Profil pengguna tidak ditemukan');
      } else if (response.status === 500) {
        throw new Error('Terjadi kesalahan pada server');
      } else {
        throw new Error('Terjadi kesalahan saat mengambil profil');
      }
    }

    const responseJson = await response.json();
    console.log('Profile response:', responseJson);

    const { user } = responseJson;

    if (!user) {
      throw new Error('Data profil tidak valid');
    }

    return user;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }
    // Re-throw other errors
    throw error;
  }
}

async function getAllUsers() {
  try {
    const response = await fetch(`${BASE_URL}/users`);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Anda tidak memiliki akses untuk melihat daftar pengguna');
      } else if (response.status === 500) {
        throw new Error('Terjadi kesalahan pada server');
      } else {
        throw new Error('Terjadi kesalahan saat mengambil daftar pengguna');
      }
    }

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message || 'Terjadi kesalahan saat mengambil data');
    }

    const { data: { users } } = responseJson;

    return users;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }
    // Re-throw other errors
    throw error;
  }
}

export {
  getOwnProfile,
  getAllUsers,
};