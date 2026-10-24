import { apiClient } from './client';

// GET /projects
// مهم: لازم الـ token يتبعت عشان الـ backend يعرف إن ده admin ويبعت كل المشاريع
// بدون token بيرجع بس المشاريع المقبولة والمنشورة
export const getProjects = () =>
  apiClient.get('/projects').then((r) => r.data.projects ?? r.data);

// PATCH /projects/:id/status
// body: { status: 'مقبول' | 'مرفوض' | 'منشور' | 'قيد المراجعة' }
export const updateProjectStatus = (id, status) =>
  apiClient.patch(`/projects/${id}/status`, { status }).then((r) => r.data);

// DELETE /projects/:id
export const deleteProject = (id) =>
  apiClient.delete(`/projects/${id}`).then((r) => r.data);
