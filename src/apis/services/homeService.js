import apiClient from "../apiClient";

export const HomeApi = {
  Users: "/api/v1/users",
};

const users = (page = 1, size = 10) =>
  apiClient.get({ url: `${HomeApi.Users}?page=${page}&size=${size}` });

export { users };
