import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://manoj-kirana.onrender.com/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('bk_token');
      localStorage.removeItem('bk_user');
      if (!location.pathname.startsWith('/login')) {
        location.href = '/login';
      }
    }
    return Promise.reject(err);
  },
);

export function apiErrorMessage(err, fallback = 'Something went wrong') {
  return err?.response?.data?.message || err?.message || fallback;
}
