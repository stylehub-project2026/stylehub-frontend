import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  signin: (email, password) =>
    instance.post('/customer/auth/signin', { email, password }),

  signup: (firstName, lastName, email, password) =>
    instance.post('/customer/auth/signup', { firstName, lastName, email, password }),

  forgotPassword: (email) =>
    instance.post('/customer/auth/forgot-password', { email }),

  resetPassword: (token, newPassword) =>
    instance.post('/customer/auth/reset-password', { token, newPassword }),

  getMe: () =>
    instance.get('/customer/auth/me'),
};

export const sellerAuthAPI = {
  signin: (email, password) =>
    instance.post('/seller/auth/signin', { email, password }),

  signup: (brandName, email, password, phone, description, category) =>
    instance.post('/seller/auth/signup', { brandName, email, password, phone, description, category }),

  forgotPassword: (email) =>
    instance.post('/seller/auth/forgot-password', { email }),

  resetPassword: (token, newPassword) =>
    instance.post('/seller/auth/reset-password', { token, newPassword }),

  getMe: () =>
    instance.get('/seller/auth/me'),
};

export default instance;