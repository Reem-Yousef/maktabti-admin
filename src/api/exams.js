import { apiClient } from './client';

export const getExams = () =>
  apiClient.get('/exams').then((r) => r.data.exams ?? r.data);

// POST /exams — multipart/form-data
export const createExam = (payload, examPdfFile, solutionPdfFile) => {
  const form = new FormData();

  form.append('courseName',      payload.courseName);
  form.append('courseCode',      payload.courseCode);
  form.append('examType',        payload.examType);
  form.append('examDate',        payload.examDate);
  form.append('academicYear',    payload.academicYear   ?? '');
  form.append('semester',        payload.semester       ?? '');
  form.append('specialization',  payload.specialization ?? '');
  form.append('instructor',      payload.instructor     ?? '');

  // الملفات
  if (examPdfFile)     form.append('examPdf',     examPdfFile);
  if (solutionPdfFile) form.append('solutionPdf', solutionPdfFile);

  return apiClient.post('/exams', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

// PUT /exams/:id — multipart/form-data
export const updateExam = (id, payload, examPdfFile, solutionPdfFile) => {
  const form = new FormData();

  form.append('courseName',      payload.courseName);
  form.append('courseCode',      payload.courseCode);
  form.append('examType',        payload.examType);
  form.append('examDate',        payload.examDate);
  form.append('academicYear',    payload.academicYear   ?? '');
  form.append('semester',        payload.semester       ?? '');
  form.append('specialization',  payload.specialization ?? '');
  form.append('instructor',      payload.instructor     ?? '');

  if (examPdfFile)     form.append('examPdf',     examPdfFile);
  if (solutionPdfFile) form.append('solutionPdf', solutionPdfFile);

  return apiClient.put(`/exams/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

export const deleteExam = (id) =>
  apiClient.delete(`/exams/${id}`).then((r) => r.data);