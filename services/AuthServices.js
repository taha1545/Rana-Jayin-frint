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
            const formData = new FormData();
            // Basic fields
            const fields = ['name', 'phone', 'password', 'storeName', 'description', 'latitude', 'longitude', 'priceRange'];
            fields.forEach(key => {
                if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            });
            // Service type as array
            if (Array.isArray(data.serviceType)) {
                formData.append('type', JSON.stringify(data.serviceType));
            }
            // Car data
            if (data.car) formData.append('car', JSON.stringify(data.car));
            // Files
            if (data.certificate) formData.append('certificate', data.certificate);
            if (Array.isArray(data.storeImages)) data.storeImages.forEach(f => formData.append('storeImages', f));
            if (data.sensitiveDocs?.criminalRecord) formData.append('sensitiveDocs', data.sensitiveDocs.criminalRecord);
            if (data.sensitiveDocs?.storeRegistration) formData.append('sensitiveDocs', data.sensitiveDocs.storeRegistration);

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
