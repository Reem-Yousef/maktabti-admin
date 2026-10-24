import { apiClient } from './client';

export const changePassword = (currentPassword, newPassword) =>
  apiClient.post('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data);

export const createAdmin = (payload) =>
  apiClient.post('/auth/admin/create', payload).then((r) => r.data);

// POST /auth/forgot-password
export const forgotPassword = (universityEmail) =>
  apiClient.post('/auth/forgot-password', { universityEmail }).then((r) => r.data);

// POST /auth/reset-password
export const resetPassword = (universityEmail, otp, newPassword) =>
  apiClient.post('/auth/reset-password', { universityEmail, otp, newPassword }).then((r) => r.data);