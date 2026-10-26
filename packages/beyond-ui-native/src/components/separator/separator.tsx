import * as React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "../../utilities/cn";

export interface SeparatorProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Separator({
  orientation = "horizontal",
  className,
  ...props
}: SeparatorProps) {
  return (
    <View
      accessibilityRole="none"
      className={cn(
        "bg-neutral-200 dark:bg-neutral-800",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  );
}

Separator.displayName = "Separator";
