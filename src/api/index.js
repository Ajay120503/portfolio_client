import api from './axios';

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Profile
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// About
export const aboutAPI = {
  get: () => api.get('/about'),
  create: (data) => api.post('/about', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (idOrData, maybeData) => api.put(
    maybeData ? `/about/${idOrData}` : '/about',
    maybeData || idOrData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  ),
  delete: (id) => api.delete(`/about/${id}`),
};

// Skills
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
  reorder: (data) => api.put('/skills/reorder', data),
};

// Experience
export const experienceAPI = {
  getAll: () => api.get('/experience'),
  create: (data) => api.post('/experience', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/experience/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/experience/${id}`),
};

// Education
export const educationAPI = {
  getAll: () => api.get('/education'),
  create: (data) => api.post('/education', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/education/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/education/${id}`),
};

// Projects
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getBySlug: (slug) => api.get(`/projects/${slug}`),
  create: (data) => api.post('/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/projects/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Services
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getAllAdmin: () => api.get('/services/all'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Testimonials
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
  getAllAdmin: () => api.get('/testimonials/all'),
  create: (data) => api.post('/testimonials', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/testimonials/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// Blog
export const blogAPI = {
  getAll: (params) => api.get('/blog', { params }),
  getAllAdmin: (params) => api.get('/blog/admin/all', { params }),
  getBySlug: (slug) => api.get(`/blog/${slug}`),
  getById: (id) => api.get(`/blog/id/${id}`),
  create: (data) => api.post('/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/blog/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/blog/${id}`),
};

// Contact
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  markAsRead: (id) => api.patch(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};

// Settings
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  getDashboardStats: () => api.get('/settings/dashboard/stats'),
};

// edits
// export const editsAPI = {
//   getAll: (params) => api.get('/edits', { params }),
//   getAllAdmin: () => api.get('/edits/all'),
//   getById: (id) => api.get(`/edits/${id}`),
//   create: (data) => api.post('/edits', data),
//   update: (id, data) => api.put(`/edits/${id}`, data),
//   delete: (id) => api.delete(`/edits/${id}`),
//   like: (id) => api.post(`/edits/${id}/like`),
// };

// edits
export const editsAPI = {
  getAll: (params) => api.get('/edits', { params }),
  getAllAdmin: () => api.get('/edits/all'),
  getById: (id) => api.get(`/edits/${id}`),
  create: (data) => api.post('/edits', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/edits/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/edits/${id}`),
  like: (id) => api.post(`/edits/${id}/like`),
};
