import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { cn } from '../../lib/utils'; // Adjust path as necessary

interface ToastMessage {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, options?: Omit<ToastMessage, 'id' | 'message'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, options: Omit<ToastMessage, 'id' | 'message'> = {}) => {
    const id = toastId++;
    const newToast: ToastMessage = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 3000, // Default duration 3 seconds
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Determine position and base styles for the container
  const positionClasses = "fixed bottom-4 right-4 z-[100]"; // Example position

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className={cn("flex flex-col space-y-2", positionClasses)}>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// --- Individual Toast Component ---

interface ToastProps extends ToastMessage {
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onDismiss }) => {
  const baseClasses = "relative flex w-full max-w-sm items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all";
  const variantClasses = {
    success: "border-green-500 bg-green-100 text-green-800",
    error: "border-red-500 bg-red-100 text-red-800",
    warning: "border-yellow-500 bg-yellow-100 text-yellow-800",
    info: "border-blue-500 bg-blue-100 text-blue-800",
    // Add dark mode variants if needed
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[type])}
      role="alert"
    >
      <div className="text-sm font-semibold">{message}</div>
      <button
        onClick={onDismiss}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2",
          variantClasses[type] // Use variant color for focus ring
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
           <path d="M18 6 6 18"/>
           <path d="m6 6 12 12"/>
        </svg>
        <span className="sr-only">Dismiss</span>
      </button>
    </div>
  );
}; 