import { fetchAPI } from '@/api/fetchAPI';

const handleRequest = async (fn) => {
    try {
        return await fn();
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            'Unexpected error occurred';
        throw new Error(message);
    }
};

const AuthServices = {

    signupClient: (data) =>
        handleRequest(() =>
            fetchAPI({ url: '/signup-client', method: 'post', data })
        ),

    signupMembre: (data) =>
        handleRequest(() => {
            //
            const formData = new FormData();
            const fields = [
                'name', 'phone', 'password', 'storeName',
                'type', 'description', 'latitude', 'longitude', 'priceRange'
            ];
            fields.forEach((key) => data[key] && formData.append(key, data[key]));
            //
            if (data.certificate) formData.append('certificate', data.certificate);
            //
            if (Array.isArray(data.storeImages)) {
                data.storeImages.forEach((file) => formData.append('storeImages', file));
            }
            //
            return fetchAPI({ url: '/signup-membre', method: 'post', data: formData });
        }),

    login: (data) =>
        handleRequest(() =>
            fetchAPI({ url: '/login', method: 'post', data })
        ),

    updatePassword: (token, data) =>
        handleRequest(() =>
            fetchAPI({ url: '/update-password', method: 'put', data, token })
        ),
};

export default AuthServices;
