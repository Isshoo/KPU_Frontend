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
  console.log(responseJson);

  const { access_token } = responseJson;

  if (!access_token) {
    throw new Error(responseJson.message);
  }

  return access_token;
}

export {
  register,
  login,
};