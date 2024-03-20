"use client";
import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";

import { NextResponse } from "next/server";
import { useToast } from "../_context/ToastContext";
import Endpoint from "../_endpoint/endpoint";
import { useRouter } from "next/navigation";
export const axiosInstance = axios.create({
  baseURL: Endpoint.baseUrl, // Replace with your API's base URL
});

const AxiosInterceptor = ({ children }: any) => {
  const { showToast } = useToast();
  const router = useRouter();
  useEffect(() => {
    const resInterceptor = (response: AxiosResponse) => {
      return response;
    };

    const errInterceptor = (error: any) => {
      switch (error.response?.status) {
        case 400:
          const stateError: any[] = [];
          if (error?.response.data?.errors) {
            for (const key in error?.response?.data?.errors) {
              stateError.push(error?.response?.data?.errors[key]);
            }
            break;
          } else {
            throw stateError.flat();
          }
        case 401:
          showToast("error", "Unauthorized");
          router.push("/login");
          break;
        case 500:
          showToast("error", "Unexpected server error");
      }
      return Promise.reject(error);
    };

    const interceptor = axiosInstance.interceptors.response.use(
      resInterceptor,
      errInterceptor
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, []);
  return children;
};

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
axiosInstance.interceptors.response.use((response) => {
  return response.data;
});

export { AxiosInterceptor };
