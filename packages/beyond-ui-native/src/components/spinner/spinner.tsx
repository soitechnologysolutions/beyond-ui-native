import * as React from "react";
import { ActivityIndicator, View, type ViewProps } from "react-native";
import { cn } from "../../utilities/cn";

export type SpinnerColor =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "white"
  | "muted";

export interface SpinnerProps extends ViewProps {
  size?: "sm" | "md" | "lg";
  color?: SpinnerColor;
  className?: string;
}

const colorMap: Record<SpinnerColor, string> = {
  primary: "#2563eb",
  secondary: "#475569",
  danger: "#dc2626",
  success: "#16a34a",
  warning: "#d97706",
  white: "#ffffff",
  muted: "#94a3b8",
};

export function Spinner({
  size = "md",
  color = "primary",
  className,
  ...props
}: SpinnerProps) {
  const nativeSize = size === "lg" ? "large" : "small";
  const hexColor = colorMap[color] ?? colorMap.primary;

  return (
    <View className={cn("items-center justify-center", className)} {...props}>
      <ActivityIndicator size={nativeSize} color={hexColor} />
    </View>
  );
}

Spinner.displayName = "Spinner";
