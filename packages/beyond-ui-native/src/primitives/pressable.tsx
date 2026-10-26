import * as React from "react";
import {
  Pressable as RNPressable,
  type PressableProps as RNPressableProps,
  type View,
  type GestureResponderEvent,
} from "react-native";
import { cn } from "../utilities/cn";

export interface PressableProps extends Omit<RNPressableProps, "children"> {
  className?: string;
  children?: React.ReactNode | ((state: { pressed: boolean }) => React.ReactNode);
  feedback?: "opacity" | "scale" | "none";
}

export const Pressable = React.forwardRef<View, PressableProps>(
  (
    {
      className,
      style,
      disabled,
      feedback = "opacity",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <RNPressable
        ref={ref}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        className={cn(
          feedback === "opacity" && "active:opacity-70",
          feedback === "scale" && "active:scale-[0.98]",
          disabled && "opacity-50",
          className
        )}
        style={style}
        {...props}
      >
        {typeof children === "function" ? children : children}
      </RNPressable>
    );
  }
);

Pressable.displayName = "Pressable";
