import React, { useEffect, useState } from "react";

interface IToast {
  show: boolean;
  type: "success" | "danger" | "warning";
  message: string;
  onDismiss: () => void;
}

const Toast: React.FC<IToast> = ({ show, type, message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    setIsVisible(true);

    // Close the toast after 3 seconds
    const timeoutId = setTimeout(() => {
      handleClose();
      onDismiss();
    }, 3000);

    // Clear the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [onDismiss]);

  return show ? (
    <div
      className={`absolute top-2 right-2 end-0 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="alert"
    >
      <span
        className={`w-5 h-5 mr-2 ${
          type === "success"
            ? "text-green-500"
            : type === "danger"
            ? "text-red-500"
            : "text-yellow-500"
        }`}
      >
        {type === "success" ? "✓" : type === "danger" ? "✗" : "⚠"}
      </span>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={handleClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  ) : (
    <></>
  );
};

export default Toast;
