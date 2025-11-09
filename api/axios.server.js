import axios from 'axios';

const apiServer = axios.create({
  baseURL: process.env.API_URL ,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 
export function getServerApi(token) {
  const instance = axios.create({
    baseURL: process.env.API_URL ,
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return instance;
}


export default apiServer;




