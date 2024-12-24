import { request } from 'umi';

export const countNotificationsIsRead = async () => {
  return await request('/api/v1/notification/count', {
    method: 'GET',
  });
};

export const getNotifications = async (params: any) => {
  return await request('/api/v1/notification/get', {
    method: 'GET',
    params,
  });
};

export const readNotification = async (id: string) => {
  return await request(`/api/v1/notification/read/${id}`, {
    method: 'POST',
  });
};
