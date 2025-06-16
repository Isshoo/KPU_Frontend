import { register } from '../../api/auth';
import { getAllUsers } from '../../api/users';

const ActionType = {
  RECEIVE_USERS: 'users/recieve',
};

function receiveUsersActionCreator(users) {
  return {
    type: ActionType.RECEIVE_USERS,
    payload: {
      users,
    },
  };
}

function asyncRegisterUser({ name, email, password }) {
  return async () => {
    try {
      await register({ name, email, password });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
}

function asyncRecieveAllUsers() {
  return async (dispatch) => {
    try {
      const users = await getAllUsers();

      dispatch(receiveUsersActionCreator(users));
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receiveUsersActionCreator,
  asyncRegisterUser,
  asyncRecieveAllUsers,
};