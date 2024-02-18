import axios from "axios";
import { NextResponse } from "next/server";
import Endpoint from "../_endpoint/endpoint";
export const axiosInstance = axios.create({
  baseURL: Endpoint.baseUrl, // Replace with your API's base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      config.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async function (error) {
    if (error?.response?.status === 401) {
      NextResponse.redirect(new URL("/login"));
    }
    return Promise.reject(error);
  }
);
