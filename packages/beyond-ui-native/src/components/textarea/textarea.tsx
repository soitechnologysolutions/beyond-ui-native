import * as React from "react";
import {
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { cn } from "../../utilities/cn";

export interface TextareaProps
  extends Omit<TextInputProps, "multiline"> {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  rows?: number;
  containerClassName?: string;
  className?: string;
  labelClassName?: string;
}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(function Textarea(
  {
    label,
    error,
    helperText,
    disabled = false,
    rows = 4,
    containerClassName,
    className,
    labelClassName,
    placeholderTextColor,
    accessibilityLabel,
    ...props
  },
  ref
) {
  const minHeight = Math.max(80, rows * 22);

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

      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        editable={!disabled}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={error}
        aria-invalid={!!error}
        placeholderTextColor={placeholderTextColor ?? "#9ca3af"}
        style={{ minHeight }}
        className={cn(
          "w-full rounded-xl border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-3.5 text-base",
          error
            ? "border-danger-500 dark:border-danger-500"
            : "border-neutral-300 dark:border-neutral-700 focus:border-primary-500",
          disabled && "opacity-50 bg-neutral-100 dark:bg-neutral-800",
          className
        )}
        {...props}
      />

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

Textarea.displayName = "Textarea";
