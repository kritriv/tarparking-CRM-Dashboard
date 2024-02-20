/* eslint-disable no-useless-catch */
import { message as Message } from "antd";
import axios from "axios";
import { isEmpty } from "ramda";
import { getItem } from "../utils/storage";

// Create axios instance
const axiosInstance = axios.create({
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
    // Do something else before request is sent if needed
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (res) => {
    if (res.config.url.includes("/logout")) {
      // Handle logout response
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
    if (message && message !== "User deleted successfully") {
      throw new Error(message || "sys.api.apiRequestFailed");
    }

    return res.data; // Return response data for successful deletion without throwing an error
  },
  (error) => {
    const { response, message } = error || {};
    let errMsg = "";
    try {
      errMsg = response?.data?.message || message;
    } catch (error) {
      throw new Error(error);
    }
    // Do something with response error
    if (isEmpty(errMsg)) {
      // checkStatus
      // errMsg = checkStatus(response.data.status);
      errMsg = "sys.api.errorMessage";
    }
    Message.error(errMsg);
    // Reject the Promise with the original error
    return Promise.reject(error); // Fix here
  }
);

class APIClient {
  async get(config) {
    return await this.request({ ...config, method: "GET" });
  }

  async post(config) {
    return await this.request({ ...config, method: "POST" });
  }

  async put(config) {
    return await this.request({ ...config, method: "PUT" });
  }

  async delete(config) {
    return await this.request({ ...config, method: "DELETE" });
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
