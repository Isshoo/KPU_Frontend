/**
 * @description Action types for notifications state
 */
export const ActionType = {
  RECEIVE_NOTIFICATIONS: 'notifications/RECEIVE',
  MARK_AS_READ: 'notifications/MARK_AS_READ',
  CLEAR_NOTIFICATIONS: 'notifications/CLEAR',
  SET_LOADING: 'notifications/SET_LOADING',
  SET_ERROR: 'notifications/SET_ERROR',
};

/**
 * @description Action creator to receive notifications
 * @param {object} notificationsData - { notifications: array, unread_count: number }
 */
export function receiveNotificationsActionCreator(notificationsData) {
  return {
    type: ActionType.RECEIVE_NOTIFICATIONS,
    payload: {
      notifications: notificationsData.notifications,
      unreadCount: notificationsData.unread_count,
    },
  };
}

/**
 * @description Action creator to mark a notification as read
 * @param {string} notificationId - The unique ID of the notification (e.g., 'sm-123')
 */
export function markAsReadActionCreator(notificationId) {
  return {
    type: ActionType.MARK_AS_READ,
    payload: {
      notificationId,
    },
  };
}

/**
 * @description Action creator to clear notifications from state
 */
export function clearNotificationsActionCreator() {
  return {
    type: ActionType.CLEAR_NOTIFICATIONS,
  };
}

/**
 * @description Action creator to set loading state
 * @param {boolean} isLoading
 */
export function setLoadingActionCreator(isLoading) {
  return {
    type: ActionType.SET_LOADING,
    payload: {
      isLoading,
    },
  };
}

/**
 * @description Action creator to set error state
 * @param {string|null} error
 */
export function setErrorActionCreator(error) {
  return {
    type: ActionType.SET_ERROR,
    payload: {
      error,
    },
  };
} 