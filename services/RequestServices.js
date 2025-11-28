import { fetchAPI } from '@/api/fetchAPI';

const RequestServices = {
    //
    createRequest: async (data, token) => {
        return await fetchAPI({
            url: '/requests',
            method: 'post',
            data,
            token,
        });
    },

    //
    getRequests: async (token) => {
        return await fetchAPI({
            url: '/requests',
            method: 'get',
            token,
        });
    },
    getRequestById: async (id) => {
        return await fetchAPI({
            url: `/requests/${id}`,
            method: 'get',
        });
    },

    updateRequest: async (id, data) => {
        return await fetchAPI({
            url: `/requests/${id}`,
            method: 'put',
            data,
        });
    },

    createReviewForStore: async (storeId, data, token) => {
        return await fetchAPI({
            url: `/reviews/store/${storeId}`,
            method: 'post',
            data,
            token,
        });
    },
};

export default RequestServices;
