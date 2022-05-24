import store from '../config/storage';
import { apiInstance } from './index';

const endpoints = {
  students: 'students/',
  all_students: 'all_students/'
};

export const getStudents = async (params) => {
  const res = await apiInstance.get(endpoints.students, { params });
  return res.data;
};

export const getAllStudents = async (params) => {
  const res = await apiInstance.get(endpoints.all_students);

  return res.data;
};

export const addStudents = async (params) => {
  const res = await apiInstance.post(endpoints.all_students, params);
  return res;
};
