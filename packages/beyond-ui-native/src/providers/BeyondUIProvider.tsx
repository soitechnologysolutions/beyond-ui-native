import * as React from "react";
import { View, useColorScheme as useRNColorScheme } from "react-native";
import { colorScheme as nwColorScheme } from "nativewind";
import { PortalHost } from "@rn-primitives/portal";
import { ToastContext, ToastItem, ToastContextValue } from "../components/toast/types";
import { ToastContainer } from "../components/toast/toast";

export type ColorScheme = "light" | "dark" | "system";

export interface BeyondUIContextValue {
  colorScheme: "light" | "dark";
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

export const BeyondUIContext = React.createContext<BeyondUIContextValue>({
  colorScheme: "light",
  setColorScheme: () => {},
  toggleColorScheme: () => {},
});

export function useBeyondUI() {
  return React.useContext(BeyondUIContext);
}

export interface BeyondUIProviderProps {
  children: React.ReactNode;
  defaultColorScheme?: ColorScheme;
}

export function BeyondUIProvider({
  children,
  defaultColorScheme = "system",
}: BeyondUIProviderProps) {
  const systemScheme = useRNColorScheme() ?? "light";
  const [selectedScheme, setSelectedScheme] = React.useState<ColorScheme>(defaultColorScheme);
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const activeScheme: "light" | "dark" =
    selectedScheme === "system" ? systemScheme : selectedScheme;

  // Sync NativeWind colorScheme store with BeyondUIProvider active scheme
  React.useEffect(() => {
    try {
      nwColorScheme.set(selectedScheme === "system" ? "system" : activeScheme);
    } catch (_) {}
  }, [selectedScheme, activeScheme]);

  const handleSetColorScheme = React.useCallback((scheme: ColorScheme) => {
    setSelectedScheme(scheme);
    try {
      nwColorScheme.set(scheme === "system" ? "system" : scheme);
    } catch (_) {}
  }, []);

  const toggleColorScheme = React.useCallback(() => {
    setSelectedScheme((prev) => {
      const current = prev === "system" ? systemScheme : prev;
      const next = current === "dark" ? "light" : "dark";
      try {
        nwColorScheme.set(next);
      } catch (_) {}
      return next;
    });
  }, [systemScheme]);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = React.useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const toastContextValue: ToastContextValue = React.useMemo(
    () => ({
      toasts,
      show: showToast,
      dismiss: dismissToast,
      success: (title, description) =>
        showToast({ title, description, variant: "success" }),
      danger: (title, description) =>
        showToast({ title, description, variant: "danger" }),
      error: (title, description) =>
        showToast({ title, description, variant: "danger" }),
      warning: (title, description) =>
        showToast({ title, description, variant: "warning" }),
      info: (title, description) =>
        showToast({ title, description, variant: "info" }),
    }),
    [toasts, showToast, dismissToast]
  );

  const contextValue: BeyondUIContextValue = React.useMemo(
    () => ({
      colorScheme: activeScheme,
      setColorScheme: handleSetColorScheme,
      toggleColorScheme,
    }),
    [activeScheme, handleSetColorScheme, toggleColorScheme]
  );

  return (
    <BeyondUIContext.Provider value={contextValue}>
      <ToastContext.Provider value={toastContextValue}>
        <View
          style={{ flex: 1 }}
          className={activeScheme === "dark" ? "dark flex-1 bg-neutral-950" : "flex-1 bg-white"}
        >
          {children}
          <PortalHost />
          <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </View>
      </ToastContext.Provider>
    </BeyondUIContext.Provider>
  );
}
