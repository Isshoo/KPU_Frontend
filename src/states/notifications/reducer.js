import { ActionType } from './action';

/**
 * @description Initial state for notifications
 */
const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: true,
  error: null,
};

/**
 * @description Reducer for notifications state
 * @param {object} state - The current state
 * @param {object} action - The action to be performed
 * @returns {object} The new state
 */
function notificationsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload.notifications,
        unreadCount: action.payload.unreadCount,
        isLoading: false,
        error: null,
      };

    case ActionType.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((notif) =>
          notif.id === action.payload.notificationId
            ? { ...notif, is_read: true }
            : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case ActionType.CLEAR_NOTIFICATIONS:
      return initialState;

    case ActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    case ActionType.SET_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
}

export default notificationsReducer; 