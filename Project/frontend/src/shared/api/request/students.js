import store from '../config/storage';
import { apiInstance } from './index';

const endpoints = {
  students: 'students/'
};

export const getStudents = async (params) => {
  const res = await apiInstance.get(endpoints.students, { params });
  return res.data;
};
