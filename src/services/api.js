import axios from "axios";

const API_BASE_URL = "https://customer-management-server-67c0.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Customer API calls
export const customerAPI = {
  getAll: (params = {}) => api.get("/customers", { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post("/customers", data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Address API calls
export const addressAPI = {
  getByCustomerId: (customerId) =>
    api.get(`/customers/${customerId}/addresses`),
  getById: (addressId) => api.get(`/addresses/${addressId}`),
  create: (customerId, data) =>
    api.post(`/customers/${customerId}/addresses`, data),
  update: (addressId, data) => api.put(`/addresses/${addressId}`, data),
  delete: (addressId) => api.delete(`/addresses/${addressId}`),
};

export default api;
