import { apiClient } from './client';

export const getBooks = () =>
  apiClient.get('/books').then((r) => r.data.books ?? r.data);

export const getBookById = (id) =>
  apiClient.get(`/books/${id}`).then((r) => r.data.book ?? r.data);

// POST /books — multipart/form-data
export const createBook = (payload, coverImageFile, bookPdfFile) => {
  const form = new FormData();

  // بيانات الكتاب — category بيتبعت كـ categoryName مش ID
  form.append('title',              payload.title);
  form.append('author',             payload.author);
  form.append('categoryName',       payload.categoryName);
  form.append('description',        payload.description);
  form.append('availabilityStatus', payload.availabilityStatus ?? 'متوفر');
  form.append('totalCopies',        payload.totalCopies);
  form.append('availableCopies',    payload.availableCopies);
  form.append('publicationYear',    payload.publicationYear);
  form.append('rating',             payload.rating ?? 0);

  // الملفات — اختيارية
  if (coverImageFile) form.append('coverImage', coverImageFile);
  if (bookPdfFile)    form.append('bookPdf',    bookPdfFile);

  return apiClient.post('/books', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

// PUT /books/:id — multipart/form-data
export const updateBook = (id, payload, coverImageFile, bookPdfFile) => {
  const form = new FormData();

  form.append('title',              payload.title);
  form.append('author',             payload.author);
  form.append('categoryName',       payload.categoryName);
  form.append('description',        payload.description);
  form.append('availabilityStatus', payload.availabilityStatus ?? 'متوفر');
  form.append('totalCopies',        payload.totalCopies);
  form.append('availableCopies',    payload.availableCopies);
  form.append('publicationYear',    payload.publicationYear);
  form.append('rating',             payload.rating ?? 0);

  if (coverImageFile) form.append('coverImage', coverImageFile);
  if (bookPdfFile)    form.append('bookPdf',    bookPdfFile);

  return apiClient.put(`/books/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

export const deleteBook = (id) =>
  apiClient.delete(`/books/${id}`).then((r) => r.data);