import { request } from '@umijs/max';

export const login = async (payload: { username: string; password: string }) => {
  return await request('/api/v1/login', {
    method: 'POST',
    data: payload,
  });
};

export const queryCurrentUser = async () => {
  return await request('/api/v1/me');
};
