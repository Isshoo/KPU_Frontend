import { BASE_URL } from '../globals/config';
import { _fetchWithAuth } from '../utils/auth_helper';

async function getOwnProfile() {
  const response = await _fetchWithAuth(`${BASE_URL}/users/me`);

  const responseJson = await response.json();

  const { status, message } = responseJson;

  if (status !== 'success') {
    throw new Error(message);
  }

  const { data: { user } } = responseJson;

  return user;
}

async function getAllUsers() {
  const response = await fetch(`${BASE_URL}/users`);

  const responseJson = await response.json();

  const { status, message } = responseJson;

  if (status !== 'success') {
    throw new Error(message);
  }

  const { data: { users } } = responseJson;

  return users;
}

export {
  getOwnProfile,
  getAllUsers,
};