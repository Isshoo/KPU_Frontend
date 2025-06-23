import { BASE_URL } from '../globals/config';
import { _fetchWithAuth } from '../utils/auth_helper';

/**
 * @description Fetches notifications for the logged-in user
 * @returns {Promise<object>}
 */
export const getNotifications = async () => {
  const response = await _fetchWithAuth(`${BASE_URL}/notifications/`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal mengambil notifikasi');
  }

  const responseJson = await response.json();
  return responseJson.data;
};

/**
 * @description Marks a specific surat (masuk or keluar) as read
 * @param {('surat_masuk'|'surat_keluar')} type - The type of the surat
 * @param {number} id - The ID of the surat
 * @returns {Promise<object>}
 */
export const markSuratAsRead = async (type, id) => {
  const url = `${BASE_URL}/${type === 'surat_masuk' ? 'surat-masuk' : 'surat-keluar'}/${id}/read`;
  
  const response = await _fetchWithAuth(url, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal menandai surat sebagai telah dibaca');
  }

  const responseJson = await response.json();
  return responseJson;
}; 