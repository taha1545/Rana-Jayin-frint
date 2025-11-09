import { fetchAPI } from '@/api/fetchAPI';

const ReviewServices = {
    //
    getReviewsByStore: async (storeId) => {
        return await fetchAPI({ url: `/reviews/store/${storeId}`, method: 'get' });
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

export default ReviewServices;
