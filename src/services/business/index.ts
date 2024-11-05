import { request } from '@umijs/max';

export const getBusiness = async () => {
  return await request(`/api/v1/business`, {});
};

export const createBusiness = async (data: any) => {
  return await request(`/api/v1/business`, {
    method: 'POST',
    data,
  });
};

export const updateBusiness = async (id: string, data: any) => {
  return await request(`/api/v1/business/${id}`, {
    method: 'PUT',
    data,
  });
};

export const deleteBusiness = async (id: string) => {
  return await request(`/api/v1/business/${id}`, {
    method: 'DELETE',
  });
};
