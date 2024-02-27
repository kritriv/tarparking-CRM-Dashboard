/* eslint-disable no-useless-catch */
import { message as Message } from "antd";
import axios from "axios";
import { getItem } from "../utils/storage";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const tokenData = getItem("token");
    if (tokenData && tokenData.accessToken) {
      config.headers.Authorization = `Bearer ${tokenData.accessToken}`;
    } else {
      config.headers.Authorization = "Bearer Token";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (res) => {
    if (res.config.url.includes("/logout")) {
      if (res.data && res.data.success === "true") {
        return res.data;
      } else {
        throw new Error(res.data?.message || "Logout failed.");
      }
    }

    if (!res.data) throw new Error("sys.api.apiRequestFailed");

    const { success, data, message } = res.data;
    const hasSuccess =
      data && Reflect.has(res.data, "success") && success === "true";
    if (hasSuccess) {
      return res.data;
    }

    // Business request error
    // if (message && message !== "User deleted successfully" || message && message !== "Client deleted successfully") {
    //   console.log(message)
    //   throw new Error(message || "sys.api.apiRequestFailed");
    // }

    return res.data;
  },
  (error) => {
    const { response, message } = error || {};
    let errMsg = "";
    try {
      errMsg = response?.data?.message || message || "sys.api.errorMessage";
    } catch (error) {
      throw new Error(error);
    }
    Message.error(errMsg);
    return Promise.reject(error);
  }
);

class APIClient {
  async get(config) {
    return this.request({ ...config, method: "GET" });
  }

  async post(config) {
    return this.request({ ...config, method: "POST" });
  }

  async put(config) {
    return this.request({ ...config, method: "PUT" });
  }

  async delete(config) {
    return this.request({ ...config, method: "DELETE" });
  }

  async request(config) {
    try {
      const res = await axiosInstance.request(config);
      return res;
    } catch (e) {
      throw e;
    }
  }
}

export default new APIClient();
