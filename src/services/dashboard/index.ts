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
