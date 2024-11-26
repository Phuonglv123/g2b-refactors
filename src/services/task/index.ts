import { request } from '@umijs/max';

export const getTasks = async (params: any) => {
  return await request('/api/v1/task/get', {
    method: 'GET',
    params: params,
  });
};

export const getTask = async (id: string) => {
  return await request(`/api/v1/task/get/${id}`, {
    method: 'GET',
  });
};

export const createTask = async (params: any) => {
  return await request('/api/v1/task/create', {
    method: 'POST',
    data: params,
  });
};

export const updateStateTask = async (id?: string, state?: any) => {
  return await request(`/api/v1/task/update/state/${id}`, {
    method: 'PUT',
    data: {
      state,
    },
  });
};

export const commentTask = async (id: string, content: string) => {
  return await request(`/api/v1/task/comment/${id}`, {
    method: 'PUT',
    data: {
      content,
    },
  });
};

export const updateStatusTask = async (id: string, status: any) => {
  return await request(`/api/v1/task/update/status/${id}`, {
    method: 'PUT',
    data: {
      status,
    },
  });
};

export const updateTask = async (id: string, params: any) => {
  return await request(`/api/v1/task/update/${id}`, {
    method: 'PUT',
    data: params,
  });
};

export const reminderTask = async (id: string, reminder: string) => {
  return await request(`/api/v1/task/reminder/${id}`, {
    method: 'PUT',
    data: {
      reminder,
    },
  });
};

export const deleteTask = async (id: string) => {
  return await request(`/api/v1/task/delete/${id}`, {
    method: 'DELETE',
  });
};
