import apiClient from '../apiClient';

export const UserApi = {
  Create: '/api/v1/user/add',
  List: '/api/v1/users',
  Read: '/api/v1/user',
  Delete: '/api/v1/user',
  Update: '/api/v1/user',
};

const createUser = (data) => apiClient.post({ url: UserApi.Create, data });
const listUser = () => apiClient.get({ url: UserApi.List });
const readUser = (id) => apiClient.get({ url: `${UserApi.Read}/${id}` });
const deleteUser = (id) => apiClient.delete({ url: `${UserApi.Delete}/${id}` });
const updateUser = (id, data) => apiClient.put({ url: `${UserApi.Update}/${id}`, data });

export { 
    createUser,
    listUser,
    readUser,
    deleteUser,
    updateUser,
};
