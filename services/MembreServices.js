import { fetchAPI } from '@/api/fetchAPI';

const MembreServices = {
    // Get store analytics
    getAnalytics: async (storeId, token) => {
        return await fetchAPI({
            url: `/membre/stores/${storeId}/analytics`,
            method: 'get',
            token,
        });
    },

    // Get last client request for the store
    getLastRequest: async (storeId, token) => {
        return await fetchAPI({
            url: `/membre/stores/${storeId}/last-request`,
            method: 'get',
            token,
        });
    },

    // Toggle store active status
    toggleActive: async (storeId, isActive, token) => {
        return await fetchAPI({
            url: `/membre/stores/${storeId}/toggle-active`,
            method: 'put',
            token,
            data: { isActive: isActive.toString() },
        });
    },

    // Update store details
    updateStore: async (storeId, data, token) => {
        return await fetchAPI({
            url: `/stores/${storeId}`,
            method: 'put',
            token,
            data,
        });
    },

    // Get the store for a specific member
    getMemberStore: async (membreId, token) => {
        return await fetchAPI({
            url: `/stores/member`,
            method: 'post',
            token,
            data: { membreId: Number(membreId) },
        });
    },

    addStoreImage: async (storeId, imageFile, token) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('storeId', storeId);

        return await fetchAPI({
            url: `/store-images`,
            method: 'post',
            token,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    deleteStoreImage: async (imageId, token) => {
        return await fetchAPI({
            url: `/store-images/${imageId}`,
            method: 'delete',
            token,
        });
    },

    updateMember: async (data, token) => {
        return await fetchAPI({
            url: `/users/me`,
            method: 'put',
            token,
            data,
        });
    },

    // Update full request (existing)
    updateRequest: async (requestId, data, token) => {
        return await fetchAPI({
            url: `/requests/${requestId}`,
            method: 'put',
            token,
            data,
        });
    },

    // Update request status only
    updateRequestStatus: async (requestId, status, token) => {
        return await fetchAPI({
            url: `/requests/${requestId}`,
            method: 'put',
            token,
            data: { status },
        });
    },
};

export default MembreServices;
