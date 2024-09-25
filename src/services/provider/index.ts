import { request } from 'umi';

export type ProviderItem = {
  id: string;
  code: string;
  name: string;
  tax: string;
  address: string;
  phone: string;
  response: string;
  major: string;
};

// Fetch all providers
export async function getProviders(params?: { [key: string]: any }) {
  return request<{
    data: ProviderItem[];
    pagination: { total: number; pageSize: number; pageCurrent: number };
  }>('/api/v1/provider', {
    method: 'GET',
    params,
  });
}

// Fetch a single provider by ID
export async function getProviderById(id: string) {
  return request<ProviderItem>(`/api/v1/provider/${id}`, {
    method: 'GET',
  });
}

// Create a new provider
export async function addProvider(data: ProviderItem) {
  return request<ProviderItem>('/api/v1/provider', {
    method: 'POST',
    data,
  });
}

// Update an existing provider
export async function updateProvider(id: string, data: ProviderItem) {
  return request<ProviderItem>(`/api/v1/provider/${id}`, {
    method: 'PUT',
    data,
  });
}

// Delete a provider (soft delete)
export async function removeProvider(id: string) {
  return request(`/api/v1/provider/${id}`, {
    method: 'DELETE',
  });
}
