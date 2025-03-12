import { request } from "@umijs/max";

export const getOrders = async (params: any) => {
    return await request('/order', { params });
}

export const getOrder = async (id: string) => {
    return await request(`/order/${id}`);
}

export const createOrder = async (data: any) => {
    return await request('/api/v1/order/create', { method: 'POST', data });
}

export const updateOrder = async (id: string, data: any) => {
    return await request(`/order/${id}`, { method: 'PUT', data });
}

export const deleteOrder = async (id: string) => {
    return await request(`/order/${id}`, { method: 'DELETE' });
}




