import { request } from 'umi';

export const getCountry = async () => {
  return await request('/api/v1/location/country', {
    method: 'GET',
  });
};

export const getProvice = async (params: { country: string }) => {
  return await request('/api/v1/location', {
    method: 'GET',
    params,
  });
};

export const getDistrict = async (params: { province: string }) => {
  return await request('/api/v1/location/district', {
    method: 'GET',
    params,
  });
};

export const getWard = async (params: { district: string; province: string }) => {
  return await request('/api/v1/location/ward', {
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
