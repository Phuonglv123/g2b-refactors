import { request } from 'umi';

export const getCountry = async () => {
  return await request('/api/v1/location/country', {
    method: 'GET',
  });
};

export const getProvice = async (params: { name?: string }) => {
  return await request('/api/v1/provinces/p', {
    method: 'GET',
    params,
  });
};

export const getDistrict = async (params: { province_code: string; name?: string }) => {
  return await request('/api/v1/provinces/d', {
    method: 'GET',
    params,
  });
};

export const getWard = async (params: { district_code?: string; name?: string }) => {
  return await request('/api/v1/provinces/w', {
    method: 'GET',
    params,
  });
};

export const createLocation = async (data: any) => {
  return await request('/api/v1/location/add', {
    method: 'POST',
    data,
  });
};

export const updateLocation = async (id: string, data: any) => {
  return await request(`/api/v1/location/${id}`, {
    method: 'PUT',
    data,
  });
};

export const getLocationById = async (id: string) => {
  return await request(`/api/v1/location/${id}`, {
    method: 'GET',
  });
};

export const deleteLocation = async (id: string) => {
  return await request(`/api/v1/location/${id}`, {
    method: 'DELETE',
  });
};

export const getLocations = async (params?: any) => {
  return await request('/api/v1/location/list', {
    method: 'GET',
    params,
  });
};
