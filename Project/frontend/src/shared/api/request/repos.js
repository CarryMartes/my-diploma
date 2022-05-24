import { apiInstance } from './index';

const endpoints = {
  repositories: 'repositories/',
  all_repositories: 'all_repos/'
};

export const getRepositories = async (params) => {
  const res = await apiInstance.get(endpoints.repositories, { params });
  return res.data;
};

export const getAllRepositories = async (params) => {
  const res = await apiInstance.get(endpoints.all_repositories, { params });
  return res.data;
};

export const addRepository = async (params) => {
  const res = await apiInstance.post(endpoints.repositories, params);

  return res;
};
