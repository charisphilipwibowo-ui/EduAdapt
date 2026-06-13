import axios from 'axios';
const API = axios.create({ baseURL: 'https://edu-adapt-9m49fg4or-charisphilipwibowo-uis-projects.vercel.app' });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;