import * as React from "react";
import {
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";

export const inputVariants = cva(
  "w-full rounded-xl border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3.5 flex-row items-center",
  {
    variants: {
      inputSize: {
        sm: "min-h-9 py-1 text-sm",
        md: "min-h-11 py-2 text-base",
        lg: "min-h-14 py-3 text-lg",
      },
      status: {
        default: "border-neutral-300 dark:border-neutral-700 focus:border-primary-500",
        error: "border-danger-500 dark:border-danger-500",
        success: "border-success-500 dark:border-success-500",
      },
      disabled: {
        true: "opacity-50 bg-neutral-100 dark:bg-neutral-800",
        false: "",
      },
    },
    defaultVariants: {
      inputSize: "md",
      status: "default",
      disabled: false,
    },
  }
);

export interface InputProps
  extends Omit<TextInputProps, "editable">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  disabled?: boolean;
  containerClassName?: string;
  className?: string;
  labelClassName?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    leftElement,
    rightElement,
    disabled = false,
    inputSize = "md",
    containerClassName,
    className,
    labelClassName,
    placeholderTextColor,
    accessibilityLabel,
    ...props
  },
  ref
) {
  const status = error ? "error" : "default";

  return (
    <View className={cn("w-full gap-1.5", containerClassName)}>
      {label ? (
        <Text
          className={cn(
            "text-sm font-medium text-neutral-800 dark:text-neutral-200",
            labelClassName
          )}
        >
          {label}
        </Text>
      ) : null}

      <View
        className={cn(
          inputVariants({ inputSize, status, disabled }),
          className
        )}
      >
        {leftIcon || leftElement ? (
          <View className="mr-2">{leftIcon ?? leftElement}</View>
        ) : null}

        <TextInput
          ref={ref}
          editable={!disabled}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={error}
          aria-invalid={!!error}
          placeholderTextColor={
            placeholderTextColor ?? "#9ca3af" // neutral-400
          }
          className="flex-1 py-1 text-neutral-900 dark:text-neutral-100"
          {...props}
        />

        {rightIcon || rightElement ? (
          <View className="ml-2">{rightIcon ?? rightElement}</View>
        ) : null}
      </View>

      {error ? (
        <Text accessibilityRole="alert" className="text-xs font-medium text-danger-600 dark:text-danger-400">
          {error}
        </Text>
      ) : helperText ? (
        <Text className="text-xs text-neutral-500 dark:text-neutral-400">
          {helperText}
        </Text>
      ) : null}
    </View>
  );
});

Input.displayName = "Input";
