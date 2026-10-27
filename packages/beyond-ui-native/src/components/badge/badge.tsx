import * as React from "react";
import { View, Text, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";
import { isTextContent } from "../../utilities/is-text";

export const badgeVariants = cva(
  "inline-flex flex-row items-center justify-center rounded-full self-start",
  {
    variants: {
      variant: {
        default: "bg-primary-600 dark:bg-primary-500",
        primary: "bg-primary-600 dark:bg-primary-500",
        secondary: "bg-secondary-600 dark:bg-secondary-500",
        danger: "bg-danger-600 dark:bg-danger-500",
        destructive: "bg-danger-600 dark:bg-danger-500",
        success: "bg-success-600 dark:bg-success-500",
        warning: "bg-warning-600 dark:bg-warning-500",
        outline: "border border-neutral-300 dark:border-neutral-700 bg-transparent",
      },
      size: {
        sm: "px-2 py-0.5",
        md: "px-2.5 py-1",
        lg: "px-3.5 py-1.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const badgeTextVariants = cva("font-semibold text-center", {
  variants: {
    variant: {
      default: "text-white",
      primary: "text-white",
      secondary: "text-white",
      danger: "text-white",
      destructive: "text-white",
      success: "text-white",
      warning: "text-white",
      outline: "text-neutral-700 dark:text-neutral-300",
    },
    size: {
      sm: "text-[10px]",
      md: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface BadgeProps
  extends ViewProps,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export function Badge({
  children,
  variant = "primary",
  size = "md",
  className,
  textClassName,
  ...props
}: BadgeProps) {
  return (
    <View
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {isTextContent(children) ? (
        <Text
          className={cn(badgeTextVariants({ variant, size }), textClassName)}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

Badge.displayName = "Badge";
