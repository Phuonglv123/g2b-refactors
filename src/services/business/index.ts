import { IBusiness } from '@/types/business';
import { request } from '@umijs/max';

export const createBusiness = async (params: IBusiness) => {
  return await request('/api/v1/business/create', {
    method: 'POST',
    data: params,
  });
};

export const getBusiness = async (params: any) => {
  return await request('/api/v1/business/get', {
    method: 'GET',
    params,
  });
};

export const updatedBusiness = async (id: string, params: any) => {
  return await request(`/api/v1/business/update/${id}`, {
    method: 'PUT',
    data: params,
  });
};

export const deleteBusiness = async (id: string) => {
  return await request(`/api/v1/business/delete/${id}`, {
    method: 'DELETE',
  });
};
