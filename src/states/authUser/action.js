import { login } from '../../api/auth';
import { getOwnProfile } from '../../api/users';
import { putAccessToken } from '../../utils/auth_helper';

const ActionType = {
  SET_AUTH_USER: 'authUser/set',
  UNSET_AUTH_USER: 'authUser/unset',
};

function setAuthUserActionCreator(authUser) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: {
      authUser,
    },
  };
}

function unsetAuthUserActionCreator() {
  return {
    type: ActionType.UNSET_AUTH_USER,
    payload: {
      authUser: null,
    },
  };
}

function asyncSetAuthUser({ username, password }) {
  return async (dispatch) => {
    try {
      const token = await login({ username, password });
      putAccessToken(token);
      const authUser = await getOwnProfile();

      dispatch(setAuthUserActionCreator(authUser));
    } catch (error) {
      console.error('Login error:', error.message);
      // Re-throw the error so it can be caught by the component
      throw error;
    }
  };
}

function asyncUnsetAuthUser() {
  return (dispatch) => {
    dispatch(unsetAuthUserActionCreator());
    putAccessToken('');
  };
}

export {
  ActionType,
  setAuthUserActionCreator,
  unsetAuthUserActionCreator,
  asyncSetAuthUser,
  asyncUnsetAuthUser,
};