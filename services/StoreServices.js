import { fetchAPI } from '@/api/fetchAPI';

const StoreServices = {

    getStoreById: async (id) => {
        return await fetchAPI({ url: `/stores/${id}`, method: 'get' });
    },

    getNearbyStores: async (latitude, longitude) => {
        return await fetchAPI({
            url: `/services`,
            method: 'get',
            params: { latitude, longitude },
        });
    },
};

export default StoreServices;
