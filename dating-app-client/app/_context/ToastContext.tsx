"use client";

import { createContext, useContext, useState } from "react";
import Toast from "../_components/toast/page";

type ToastType = "success" | "error" | "warning";
const ToastContext = createContext({
  toast: { show: false, type: "", message: "" },
  showToast: (type: "success" | "error" | "warning", message: string) => {},
  hideToast: () => {},
});

export const ToastProvider = ({ children }: any) => {
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type: string, message: string) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast({ show: false, type: "", message: "" });
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type as ToastType}
        onDismiss={hideToast}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
