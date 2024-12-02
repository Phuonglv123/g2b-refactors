import { request } from '@umijs/max';

export const listUser = async (params: any) => {
  return await request('/api/v1/user/list', {
    method: 'GET',
    params,
  });
};

export const updateUserById = async (id: string, data: any) => {
  return await request(`/api/v1/product/${id}/update`, {
    method: 'POST',
    data,
  });
};

export const toggleUserStatus = async (id: string) => {
  return await request(`/api/v1/user/${id}/toggle`, {
    method: 'PUT',
  });
};

export const resetPasswordByAdmin = async (id: string, data: any) => {
  return await request(`/api/v1/user/${id}/reset-password`, {
    method: 'PUT',
    data,
  });
};

export const deactiveUser = async (id: string) => {
  return await request(`/api/v1/product/${id}/deactive`, {
    method: 'POST',
  });
};

export const registerUser = async (data: any) => {
  return await request('/api/v1/register', {
    method: 'POST',
    data,
  });
};

export const updateRoleUser = async (id: string, data: any) => {
  return await request(`/api/v1/user/${id}/role/update`, {
    method: 'PUT',
    data,
  });
};

export const updateAvatar = async (id: string, data: any) => {
  const formData = new FormData();
  formData.append('image', data.image);
  return await request(`/api/v1/user/${id}/avatar/update`, {
    method: 'PUT',
    data: formData,
  });
};

export const updateAvatarForUser = async (data: any) => {
  const formData = new FormData();
  formData.append('image', data.image);
  return await request(`/api/v1/user/me/update/avatar`, {
    method: 'PUT',
    data: formData,
  });
};
