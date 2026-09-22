import { api } from './client';

export const coldApi = {
  listStores: (search = '') =>
    api.get('/cold-storage/stores', { params: { search } }).then((r) => r.data),
  getStore: (id) => api.get(`/cold-storage/stores/${id}`).then((r) => r.data),
  createStore: (data) => api.post('/cold-storage/stores', data).then((r) => r.data),
  deleteStore: (id) => api.delete(`/cold-storage/stores/${id}`).then((r) => r.data),

  listEntries: (storeId, mode, search = '') =>
    api
      .get(`/cold-storage/stores/${storeId}/entries`, { params: { mode, search } })
      .then((r) => r.data),
  listLotNumbers: (storeId) =>
    api.get(`/cold-storage/stores/${storeId}/lot-numbers`).then((r) => r.data),
  createInEntry: (data) => api.post('/cold-storage/entries/in', data).then((r) => r.data),
  createOutEntry: (data) => api.post('/cold-storage/entries/out', data).then((r) => r.data),
  deleteEntry: (id) => api.delete(`/cold-storage/entries/${id}`).then((r) => r.data),

  listRentPayments: (storeId, search = '') =>
    api
      .get(`/cold-storage/stores/${storeId}/rent-payments`, { params: { search } })
      .then((r) => r.data),
  createRentPayment: (data) => api.post('/cold-storage/rent-payments', data).then((r) => r.data),
};
