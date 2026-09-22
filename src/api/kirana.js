import { api } from './client';

export const kiranaApi = {
  // customers
  listCustomers: (search = '') =>
    api.get('/kirana/customers', { params: { search } }).then((r) => r.data),
  getCustomer: (id) => api.get(`/kirana/customers/${id}`).then((r) => r.data),
  createCustomer: (data) => api.post('/kirana/customers', data).then((r) => r.data),
  updateCustomer: (id, data) => api.patch(`/kirana/customers/${id}`, data).then((r) => r.data),
  deleteCustomer: (id) => api.delete(`/kirana/customers/${id}`).then((r) => r.data),

  // ledger entries
  listEntries: (customerId = '') =>
    api.get('/kirana/entries', { params: customerId ? { customerId } : {} }).then((r) => r.data),
  createEntry: (data) => api.post('/kirana/entries', data).then((r) => r.data),
  deleteEntry: (id) => api.delete(`/kirana/entries/${id}`).then((r) => r.data),
  generateDoc: (entryId, phone) =>
    api.post(`/kirana/entries/${entryId}/generate-doc`, { phone }).then((r) => r.data),

  // inventory
  listInventory: () => api.get('/kirana/inventory').then((r) => r.data),
  createInventoryItem: (data) => api.post('/kirana/inventory', data).then((r) => r.data),
  adjustStock: (id, data) => api.patch(`/kirana/inventory/${id}/adjust`, data).then((r) => r.data),
  deleteInventoryItem: (id) => api.delete(`/kirana/inventory/${id}`).then((r) => r.data),

  // bills
  listBills: () => api.get('/kirana/bills').then((r) => r.data),
  getBill: (id) => api.get(`/kirana/bills/${id}`).then((r) => r.data),
  createBill: (data) => api.post('/kirana/bills', data).then((r) => r.data),

  // receipts
  listReceipts: () => api.get('/kirana/receipts').then((r) => r.data),
  getReceipt: (id) => api.get(`/kirana/receipts/${id}`).then((r) => r.data),
  createReceipt: (data) => api.post('/kirana/receipts', data).then((r) => r.data),
};
