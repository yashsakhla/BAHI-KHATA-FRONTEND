import { api } from './client';

export const authApi = {
  login: (username, password) => api.post('/auth/login', { username, password }).then((r) => r.data),
  register: (username, password, businessName) =>
    api.post('/auth/register', { username, password, businessName }).then((r) => r.data),
};
