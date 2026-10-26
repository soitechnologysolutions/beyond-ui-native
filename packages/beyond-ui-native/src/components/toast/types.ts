import * as React from "react";

export type ToastVariant = "default" | "success" | "danger" | "warning" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  show: (toast: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
  success: (title: string, description?: string) => string;
  danger: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
}

export const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a BeyondUIProvider");
  }
  return context;
}
