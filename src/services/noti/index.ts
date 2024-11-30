import { request } from 'umi';

export const countNotificationsIsRead = async () => {
  return await request('/api/v1/notification/count', {
    method: 'GET',
  });
};

export const getNotifications = async () => {
  return await request('/api/v1/notification/get', {
    method: 'GET',
  });
};

export const readNotification = async (id: string) => {
  return await request(`/api/v1/notification/read/${id}`, {
    method: 'POST',
  });
};
