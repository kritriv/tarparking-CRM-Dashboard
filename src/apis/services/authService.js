import apiClient from '../apiClient';

export const AuthApi = {
  SignIn: '/api/v1/auth/login',
  SignUp: '/api/v1/auth/login',
  Logout: '/api/v1/auth/logout',
  Refresh: '/auth/refresh',
  User: '/user',
};

const signin = (data) => apiClient.post({ url: AuthApi.SignIn, data });
const signup = (data) => apiClient.post({ url: AuthApi.SignUp, data });
const logout = () => apiClient.post({ url: AuthApi.Logout });
const findById = (id) => apiClient.get({ url: `${AuthApi.User}/${id}` });

export {
  signin,
  signup,
  logout,
  findById,
};
