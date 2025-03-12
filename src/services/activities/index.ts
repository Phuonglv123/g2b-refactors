import { request } from "@umijs/max";


export const getActivities = async (params: any) => {
    return await request('/api/v1/activities/get', { params });
};

export const getActivity = async (id: string) => {
    return await request(`/api/v1/activities/get/${id}`);
};

export const createActivity = async (data: any) => {
    return await request('/api/v1/activities/create', { method: 'POST', data });
};

export const updateActivity = async (id: string, data: any) => {
    return await request(`/api/v1/activities/${id}`, { method: 'PUT', data });
};

export const deleteActivity = async (id: string) => {
    return await request(`/api/v1/activities/delete/${id}`, { method: 'DELETE' });
};