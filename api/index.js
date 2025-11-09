
import apiClient from './axios.client.';
import { getServerApi } from './axios.server';

const isServer = typeof window === 'undefined';

//
const api = isServer ? null : apiClient;

export { apiClient, getServerApi, api };
