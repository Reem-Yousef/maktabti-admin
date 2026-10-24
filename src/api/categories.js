import { apiClient } from './client';

// GET /categories → { success, categories: [...] }
export const getCategories = () =>
  apiClient.get('/categories').then((r) => r.data.categories ?? r.data);

// POST /categories  ← يحتاج admin token
export const createCategory = (payload) =>
  apiClient.post('/categories', payload).then((r) => r.data);

// PUT /categories/:id  ← يحتاج admin token
export const updateCategory = (id, payload) =>
  apiClient.put(`/categories/${id}`, payload).then((r) => r.data);

// DELETE /categories/:id  ← يحتاج admin token
export const deleteCategory = (id) =>
  apiClient.delete(`/categories/${id}`).then((r) => r.data);
