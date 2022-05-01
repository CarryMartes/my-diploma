import store from '../config/storage';
import { apiInstance } from './index';

const endpoints = {
  userList: '/users/',
  signUp: 'registration/',
  userProfile: 'userProfile/',
  login: 'login/',
  logout: 'logout/'
};

export const getUsersList = async (params) => {
  const res = await apiInstance.get(endpoints.userList, { params });
  if (res.data.message === 'Not Found') return Promise.reject(new Error('User Not found'));
  return Promise.resolve(res.data);
};

export const signUp = async (body) => {
  return apiInstance.post(endpoints.signUp, body);
};

export const login = async (body) => {
  const res = await apiInstance.post(endpoints.login, body);
  store.set('token', res.data.access);
  store.set('refresh_token', res.data.refresh);
  return res.data;
};

export const userProfile = async () => {
  const res = await apiInstance.get(endpoints.userProfile);
  return res.data;
};

export const userLogout = async (data) => {
  const res = await apiInstance.post(endpoints.logout, data);

  return res.data;
};
