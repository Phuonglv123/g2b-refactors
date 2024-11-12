import { request } from '@umijs/max';

export const getTasks = async (params: any) => {
  return await request('/api/v1/task/get', {
    method: 'GET',
    data: params,
  });
};
