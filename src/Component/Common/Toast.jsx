import React, { useEffect, useState } from "react";

export const Toast = ({ error, timeout = 3000, onClose, successMessage }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-10 left-1/2 p-4 shadow-lg animate-fade-in rounded-lg
        ${error ? "bg-red-500 text-white" : "bg-gray-800 text-white"}`}
    >
      <div className="flex items-center">
        <p>{error ? error : successMessage}</p>
        <button
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-4 text-white"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
