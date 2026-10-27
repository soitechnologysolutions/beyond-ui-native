import * as React from "react";
import {
  Pressable,
  Text,
  type PressableProps,
  type GestureResponderEvent,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";
import { useBeyondUI } from "../../providers/BeyondUIProvider";

export const nightModeSwitchVariants = cva(
  "inline-flex items-center justify-center rounded-full active:opacity-75",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 dark:bg-primary-500",
        secondary: "bg-secondary-600 dark:bg-secondary-500",
        ghost: "bg-transparent active:bg-neutral-100 dark:active:bg-neutral-800",
      },
      size: {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  }
);

export interface NightModeSwitchProps
  extends Omit<PressableProps, "children">,
    VariantProps<typeof nightModeSwitchVariants> {
  ariaLabel?: string;
  className?: string;
  textClassName?: string;
}

export const NightModeSwitch = React.forwardRef<any, NightModeSwitchProps>(
  function NightModeSwitch(
    {
      className,
      textClassName,
      variant,
      size,
      ariaLabel = "Toggle dark mode",
      onPress,
      ...props
    },
    ref
  ) {
    const { colorScheme, toggleColorScheme } = useBeyondUI();
    const isDark = colorScheme === "dark";

    const handlePress = (e: GestureResponderEvent) => {
      toggleColorScheme();
      onPress?.(e);
    };

    const iconSizeClasses = {
      sm: "text-base",
      md: "text-lg",
      lg: "text-xl",
    }[size || "md"];

    return (
      <Pressable
        ref={ref}
        role="button"
        accessibilityRole="button"
        accessibilityLabel={ariaLabel}
        accessibilityState={{ checked: isDark }}
        className={cn(nightModeSwitchVariants({ variant, size }), className)}
        onPress={handlePress}
        {...props}
      >
        <Text
          className={cn(
            iconSizeClasses,
            variant === "ghost"
              ? "text-neutral-700 dark:text-neutral-200"
              : "text-white",
            textClassName
          )}
        >
          {isDark ? "🌙" : "☀️"}
        </Text>
      </Pressable>
    );
  }
);
NightModeSwitch.displayName = "NightModeSwitch";
