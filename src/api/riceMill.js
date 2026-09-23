import { api } from './client';

export const riceApi = {
  listMills: (search = '') =>
    api.get('/rice-mill/mills', { params: { search } }).then((r) => r.data),
  getMill: (id) => api.get(`/rice-mill/mills/${id}`).then((r) => r.data),
  createMill: (data) => api.post('/rice-mill/mills', data).then((r) => r.data),
  deleteMill: (id) => api.delete(`/rice-mill/mills/${id}`).then((r) => r.data),

  listIntake: (millId, partyType, search = '') =>
    api
      .get(`/rice-mill/mills/${millId}/intake`, { params: { partyType, search } })
      .then((r) => r.data),
  createIntake: (data) => api.post('/rice-mill/intake', data).then((r) => r.data),

  listOutput: (millId, partyType, search = '') =>
    api
      .get(`/rice-mill/mills/${millId}/output`, { params: { partyType, search } })
      .then((r) => r.data),
  createOutput: (data) => api.post('/rice-mill/output', data).then((r) => r.data),

  deleteEntry: (id, type) =>
    api.delete(`/rice-mill/entries/${id}`, { params: { type } }).then((r) => r.data),

  getSummary: (millId) =>
    api.get(`/rice-mill/mills/${millId}/summary`).then((r) => r.data),
};
