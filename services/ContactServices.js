import { fetchAPI } from '@/api/fetchAPI';

const ContactServices = {

    sendMessage: async (data) => {
        return await fetchAPI({ url: '/contacts', method: 'post', data });
    },
};

export default ContactServices;
