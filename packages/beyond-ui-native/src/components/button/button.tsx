import * as React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type PressableProps,
  type TextProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";
import { isTextContent } from "../../utilities/is-text";

export const buttonVariants = cva(
  "flex-row items-center justify-center rounded-xl transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-600 active:bg-primary-700 dark:bg-primary-600 dark:active:bg-primary-700",
        primary: "bg-primary-600 active:bg-primary-700 dark:bg-primary-600 dark:active:bg-primary-700",
        secondary: "bg-secondary-600 active:bg-secondary-700 dark:bg-secondary-600 dark:active:bg-secondary-700",
        danger: "bg-danger-600 active:bg-danger-700 dark:bg-danger-600 dark:active:bg-danger-700",
        destructive: "bg-danger-600 active:bg-danger-700 dark:bg-danger-600 dark:active:bg-danger-700",
        success: "bg-success-600 active:bg-success-700 dark:bg-success-600 dark:active:bg-success-700",
        warning: "bg-warning-600 active:bg-warning-700 dark:bg-warning-600 dark:active:bg-warning-700",
        outline: "border border-neutral-300 dark:border-neutral-700 bg-transparent active:bg-neutral-100 dark:active:bg-neutral-800",
        ghost: "bg-transparent active:bg-neutral-100 dark:active:bg-neutral-800",
        link: "bg-transparent underline",
      },
      size: {
        sm: "min-h-8 px-3 py-1.5 rounded-lg",
        md: "min-h-10 px-4 py-2 rounded-xl",
        lg: "min-h-12 px-6 py-2.5 rounded-xl",
        xl: "min-h-14 px-8 py-3 rounded-2xl",
        icon: "min-h-10 min-w-10 p-0 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const buttonTextVariants = cva("font-semibold text-center select-none", {
  variants: {
    variant: {
      default: "text-white",
      primary: "text-white",
      secondary: "text-white",
      danger: "text-white",
      destructive: "text-white",
      success: "text-white",
      warning: "text-white",
      outline: "text-neutral-800 dark:text-neutral-100",
      ghost: "text-neutral-800 dark:text-neutral-100",
      link: "text-primary-600 dark:text-primary-400 underline",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base font-semibold",
      xl: "text-lg font-bold",
      icon: "text-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends Omit<PressableProps, "children">,
    ButtonVariantProps {
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

interface ButtonContextValue {
  variant: ButtonVariantProps["variant"];
  size: ButtonVariantProps["size"];
}

const ButtonContext = React.createContext<ButtonContextValue>({
  variant: "primary",
  size: "md",
});

export const Button = React.forwardRef<View, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className,
    textClassName,
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;
  const isLightText = variant === "outline" || variant === "ghost" || variant === "link";
  const spinnerColor = isLightText ? "#2563eb" : "#ffffff";

  return (
    <ButtonContext.Provider value={{ variant, size }}>
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!isDisabled, busy: loading }}
        disabled={isDisabled}
        className={cn(
          buttonVariants({ variant, size }),
          isDisabled && "opacity-50",
          className
        )}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={spinnerColor} className="mr-2" size="small" />
        ) : leftIcon ? (
          <View className="mr-2">{leftIcon}</View>
        ) : null}

        {isTextContent(children) ? (
          <Text
            className={cn(
              buttonTextVariants({ variant, size }),
              textClassName
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}

        {rightIcon && !loading ? (
          <View className="ml-2">{rightIcon}</View>
        ) : null}
      </Pressable>
    </ButtonContext.Provider>
  );
});

Button.displayName = "Button";

export function ButtonText({
  children,
  className,
  ...props
}: TextProps & { className?: string }) {
  const { variant, size } = React.useContext(ButtonContext);
  return (
    <Text
      className={cn(buttonTextVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Text>
  );
}

ButtonText.displayName = "Button.Text";
