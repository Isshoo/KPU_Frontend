import { getNotifications, markSuratAsRead } from '../../api/notifications';
import {
  receiveNotificationsActionCreator,
  markAsReadActionCreator,
  setLoadingActionCreator,
  setErrorActionCreator,
} from './action';

/**
 * @description Thunk to fetch notifications from the API
 */
function asyncReceiveNotifications() {
  return async (dispatch) => {
    dispatch(setLoadingActionCreator(true));
    try {
      const notificationsData = await getNotifications();
      dispatch(receiveNotificationsActionCreator(notificationsData));
    } catch (error) {
      dispatch(setErrorActionCreator(error.message));
    } finally {
      dispatch(setLoadingActionCreator(false));
    }
  };
}

/**
 * @description Thunk to mark a notification as read
 * @param {object} notification - The notification object to mark as read
 */
function asyncMarkAsRead(notification) {
  return async (dispatch) => {
    try {
      // Optimistically update the UI
      dispatch(markAsReadActionCreator(notification.id));
      
      // Call the API to mark as read
      await markSuratAsRead(notification.type, notification.surat_id);
    } catch (error) {
      // If API call fails, revert the change (optional) and show an error
      console.error('Failed to mark notification as read:', error);
      // Here you could dispatch an action to show a toast notification
      // and potentially revert the optimistic update if needed.
    }
  };
}

export { asyncReceiveNotifications, asyncMarkAsRead }; 