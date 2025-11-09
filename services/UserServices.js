import { fetchAPI } from '@/api/fetchAPI';

const UserServices = {

    getUserById: async (id, token) => {
        return await fetchAPI({ url: `/users/${id}`, method: 'get', token });
    },


    getCurrentUser: async (token) => {
        return await fetchAPI({ url: '/users/me', method: 'get', token });
    },


    updateUser: async (token, data) => {
        return await fetchAPI({ url: '/users/me', method: 'put', data, token });
    },
};

export default UserServices;
