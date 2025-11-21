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

const ContactServices = {

    sendMessage: (data) =>
        handleRequest(() =>
            fetchAPI({ url: '/contacts', method: 'post', data })
        ),

    sendReport: (data) =>
        handleRequest(() => {
            // Create FormData for multipart/form-data
            const formData = new FormData();
            const fields = ['description', 'latitude', 'longitude'];
            fields.forEach((key) => data[key] && formData.append(key, data[key]));
            // 
            if (data.image) formData.append('image', data.image);

            return fetchAPI({ url: '/report', method: 'post', data: formData });
        }),
};

export default ContactServices;
