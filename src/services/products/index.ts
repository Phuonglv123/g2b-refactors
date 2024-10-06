import { IProduct } from '@/types/product';
import { request } from '@umijs/max';

export const listProducts = async (params: any) => {
  return await request('/api/v1/product', {
    method: 'GET',
    params,
  });
};

export const getProduct = async (id: string) => {
  return await request(`/api/v1/product/${id}`, {
    method: 'GET',
  });
};

export const createProduct = async (payload: IProduct & any) => {
  const formData = new FormData();
  if (payload.images) {
    payload.images.forEach((image: any) => {
      formData.append('images', image.originFileObj);
    });
  }
  formData.append('product_code', payload.product_code);
  formData.append('product_name', payload.product_name);
  formData.append('type', payload.type);

  payload.areas.forEach((area: any) => {
    formData.append('areas', area);
  });
  formData.append('status', payload.status);
  formData.append('cost', payload.cost);
  formData.append('unit_cost', payload.unit_cost);
  formData.append('provider', payload.provider);
  formData.append('booking_duration', payload.booking_duration);
  formData.append('traffic', payload.traffic);
  formData.append('currency', payload.currency);
  formData.append('production_cost', payload.production_cost);
  formData.append('attributes.width', payload.attributes.width);
  formData.append('attributes.height', payload.attributes.height);
  formData.append('attributes.video_duration', payload.attributes.video_duration);
  formData.append('attributes.pixel_width', payload.attributes.pixel_width);
  formData.append('attributes.pixel_height', payload.attributes.pixel_height);
  formData.append('attributes.opera_time_from', payload.attributes.opera_time_from);
  formData.append('attributes.opera_time_to', payload.attributes.opera_time_to);
  formData.append('attributes.frequency', payload.attributes.frequency);
  formData.append('attributes.shape', payload.attributes.shape);
  formData.append('attributes.note', payload.attributes.note);
  formData.append('attributes.add_side', payload.attributes.add_side);

  formData.append('location', payload.location);
  formData.append('description', payload.description);

  return await request('/api/v1/product/create', {
    method: 'POST',
    data: formData,
  });
};

export const updateProduct = async (id: string, payload: IProduct & any) => {
  console.log(payload);
  const formData = new FormData();
  if (payload?.images) {
    payload.images.forEach((image: any) => {
      if (!image.url) {
        formData.append('images', image.originFileObj);
      }
    });
  }
  formData.append('product_code', payload.product_code);
  formData.append('product_name', payload.product_name);
  formData.append('description', payload.description);
  formData.append('type', payload.type);
  payload?.areas.forEach((area: any) => {
    formData.append('areas', area);
  });
  formData.append('status', payload.status);
  formData.append('cost', payload.cost);
  formData.append('unit_cost', payload.unit_cost);
  formData.append('provider', payload.provider);
  formData.append('booking_duration', payload.booking_duration);
  formData.append('traffic', payload.traffic);
  formData.append('currency', payload.currency);
  formData.append('production_cost', payload.production_cost);
  formData.append('attributes.width', payload.attributes.width);
  formData.append('attributes.height', payload.attributes.height);
  formData.append('attributes.video_duration', payload.attributes.video_duration);
  formData.append('attributes.pixel_width', payload.attributes.pixel_width);
  formData.append('attributes.pixel_height', payload.attributes.pixel_height);
  formData.append('attributes.opera_time_from', payload.attributes.opera_time_from);
  formData.append('attributes.opera_time_to', payload.attributes.opera_time_to);
  formData.append('attributes.frequency', payload.attributes.frequency);
  formData.append('attributes.shape', payload.attributes.shape);
  formData.append('attributes.note', payload.attributes.note);
  formData.append('attributes.add_side', payload.attributes.add_side);

  formData.append('location', payload.location);
  console.log(formData);
  return await request(`/api/v1/product/${id}/update`, {
    method: 'PUT',
    data: formData,
  });
};

export const deleteImageProduct = async (id: string, imageIndex: any) => {
  return await request(`/api/v1/product/${id}/delete/image`, {
    method: 'DELETE',
    data: {
      imageIndex,
    },
  });
};

export const toggleProductStatus = async (id: string) => {
  return await request(`/api/v1/product/${id}/toggle`, {
    method: 'PUT',
  });
};

export const deleteProduct = async (id: string) => {
  return await request(`/api/v1/product/${id}`, {
    method: 'DELETE',
  });
};

export const addWhitelistFromProduct = async (productId: string) => {
  return await request(`/api/v1/user/add-whitelist`, {
    method: 'PUT',
    data: {
      product_id: productId,
    },
  });
};

export const removeWhitelistFromProduct = async (productId: string) => {
  return await request(`/api/v1/user/remove-whitelist`, {
    method: 'PUT',
    data: {
      product_id: productId,
    },
  });
};

export const deleteSoftProduct = async (id: string) => {
  return await request(`/api/v1/product/${id}/delete`, {
    method: 'PUT',
  });
};

export const sortProductWhiteList = async (data: any) => {
  console.log(data);
  return await request(`/api/v1/product/sort/whitelist?ids=${data.ids.join()}`, {
    method: 'GET',
  });
};
