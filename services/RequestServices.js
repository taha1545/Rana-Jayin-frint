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
};

export default RequestServices;
