import * as React from "react";
import { Text as NativeText, type TextProps as NativeTextProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";

export const textVariants = cva("text-neutral-900 dark:text-neutral-100", {
  variants: {
    variant: {
      body: "text-base font-normal",
      caption: "text-xs font-normal text-neutral-500 dark:text-neutral-400",
      label: "text-sm font-medium text-neutral-700 dark:text-neutral-300",
      muted: "text-sm font-normal text-neutral-500 dark:text-neutral-400",
      lead: "text-lg font-normal text-neutral-600 dark:text-neutral-300",
    },
    color: {
      default: "text-neutral-900 dark:text-neutral-100",
      muted: "text-neutral-500 dark:text-neutral-400",
      primary: "text-primary-600 dark:text-primary-400",
      secondary: "text-secondary-600 dark:text-secondary-400",
      danger: "text-danger-600 dark:text-danger-400",
      success: "text-success-600 dark:text-success-400",
      warning: "text-warning-600 dark:text-warning-400",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export interface TextProps
  extends NativeTextProps,
    VariantProps<typeof textVariants> {
  className?: string;
}

export const Text = React.forwardRef<NativeText, TextProps>(function Text(
  { className, variant, color, size, weight, ...props },
  ref
) {
  return (
    <NativeText
      ref={ref}
      className={cn(textVariants({ variant, color, size, weight }), className)}
      {...props}
    />
  );
});

Text.displayName = "Text";
