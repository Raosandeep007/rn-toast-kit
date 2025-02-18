import { ReactNode } from "react";

export type ToastVariant = "success" | "info" | "error" | "warning";

export type ToastOptions = {
  duration?: number;
  variant: ToastVariant;
};

export type ToastProps = {
  id: string;
  message: string;
  options: ToastOptions;
};

export type ToastProviderProps = {
  children: ReactNode;
};

export type CustomToastArgs = {
  message: string;
  options?: Pick<ToastOptions, "duration">;
};

export type ToastMethod = (
  message: CustomToastArgs["message"],
  options?: CustomToastArgs["options"]
) => void;
