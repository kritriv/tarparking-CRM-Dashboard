import apiClient from '../apiClient';

export const UserApi = {
  SignIn: '/api/v1/auth/login',
  SignUp: '/api/v1/auth/login',
  Logout: '/api/v1/auth/logout',
  Refresh: '/auth/refresh',
  User: '/user',
};

const signin = (data) => apiClient.post({ url: UserApi.SignIn, data });
const signup = (data) => apiClient.post({ url: UserApi.SignUp, data });
const logout = () => apiClient.post({ url: UserApi.Logout });
const findById = (id) => apiClient.get({ url: `${UserApi.User}/${id}` });

export { 
  signin,
  signup,
  findById,
  logout,
};
