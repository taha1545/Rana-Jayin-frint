// 
import { apiClient, getServerApi } from './index';


export async function fetchAPI({ url, method = 'get', data, params, token } = {}) {
  try {
    const isServer = typeof window === 'undefined';
    const axiosInstance = isServer
      ? getServerApi(token)
      : apiClient;
    const response = await axiosInstance.request({ url, method, data, params });
    return response.data;
  } catch (error) {
    // 
    if (error.response) {
      throw new Error(error.response.data?.message || 'API Error');
    }
    throw new Error(error.message || 'Network Error');
  }
}
