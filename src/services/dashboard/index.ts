import { request } from '@umijs/max';

export const staticProduct = async (params: any) => {
  return await request('/api/v1/dashboard', {
    method: 'GET',
    params,
  });
};

export const chartTypeProductByUser = async (params: any) => {
  return await request('/api/v1/dashboard/chart', {
    method: 'GET',
    params,
  });
};

export const chartFilterTypeProduct = async (params?: any) => {
  return await request('/api/v1/dashboard/chart/productType', {
    method: 'GET',
    params,
  });
};

export const chartProductByProvice = async (params?: any) => {
  return await request('/api/v1/dashboard/chart/product/province', {
    method: 'GET',
    params,
  });
};

export const chartProductByCountry = async (params?: any) => {
  return await request('/api/v1/dashboard/chart/product/country', {
    method: 'GET',
    params,
  });
};

export const chartUserTask = async (params?: any) => {
  return await request('/api/v1/dashboard/chart/task', {
    method: 'GET',
    params,
  });
};

export const chartTaskByUser = async (params?: any) => {
  return await request('/api/v1/dashboard/chart/task/user', {
    method: 'GET',
    params,
  });
};
