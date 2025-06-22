import { BASE_URL } from '../globals/config';
import { _fetchWithAuth } from '../utils/auth_helper';


async function register({ name, email, password }) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const responseJson = await response.json();
  const { status, message } = responseJson;

  if (status !== 'success') {
    throw new Error(message);
  }

  const { data: { user } } = responseJson;

  return user;
}

async function login({ username, password }) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const responseJson = await response.json();
    console.log('Login response:', responseJson);

    if (!response.ok) {
      // Handle different HTTP status codes
      if (response.status === 401) {
        throw new Error('Username atau password salah');
      } else if (response.status === 400) {
        throw new Error(responseJson.message || 'Data login tidak valid');
      } else if (response.status === 500) {
        throw new Error('Terjadi kesalahan pada server');
      } else {
        throw new Error(responseJson.message || 'Terjadi kesalahan saat login');
      }
    }

    const { access_token } = responseJson;

    if (!access_token) {
      throw new Error(responseJson.message || 'Token tidak diterima dari server');
    }

    return access_token;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }
    // Re-throw other errors
    throw error;
  }
}

async function changePassword({ current_password, new_password }) {
  const response = await _fetchWithAuth(`${BASE_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      current_password,
      new_password,
    }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(responseJson.message || 'Terjadi kesalahan saat mengubah password');
  }

  return responseJson;
}

export {
  register,
  login,
  changePassword,
};