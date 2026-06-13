import axios from 'axios';
const API = axios.create({ baseURL: 'https://edu-adapt-gt2pq93c7-charisphilipwibowo-uis-projects.vercel.app' });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;