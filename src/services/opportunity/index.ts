import { request } from "@umijs/max";

export const getOpportunities = async (params: any) => {
    return await request('/api/v1/opportunity/get', { params });
};

export const getOpportunity = async (id: string) => {
    return await request(`/api/v1/opportunity/get/${id}`);
};

export const  createOpportunity = async (data: any) => {
    return await request('/api/v1/opportunity/create', { method: 'POST', data });
};

export const updateOpportunity = async (id: string, data: any) => {
    return await request(`/api/v1/opportunity/update/${id}`, { method: 'PUT', data });
};

export const deleteOpportunity = async (id: string) => {
    return await request(`/api/v1/opportunity/${id}`, { method: 'DELETE' });
};

//         await Opportunity.findByIdAndDelete(req.params.id);