import * as React from "react";
import {
  Pressable,
  View,
  type GestureResponderEvent,
  type PressableProps,
} from "react-native";
import { cn } from "../../utilities/cn";

export interface SwitchProps extends Omit<PressableProps, "onPress"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  thumbClassName?: string;
  onPress?: (event: GestureResponderEvent) => void;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  SwitchProps
>(function Switch(
  {
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    className,
    thumbClassName,
    onPress,
    ...props
  },
  ref
) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled) return;
    const nextChecked = !isChecked;
    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }
    onCheckedChange?.(nextChecked);
    onPress?.(e);
  };

  return (
    <Pressable
      ref={ref}
      role="switch"
      accessibilityRole="switch"
      accessibilityState={{ checked: isChecked, disabled: !!disabled }}
      disabled={disabled}
      onPress={handlePress}
      className={cn(
        "h-7 w-12 shrink-0 flex-row items-center rounded-full p-0.5 transition-colors",
        isChecked
          ? "bg-primary-600 dark:bg-primary-600"
          : "bg-neutral-300 dark:bg-neutral-700",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <View
        role="presentation"
        className={cn(
          "h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
          isChecked ? "translate-x-5" : "translate-x-0",
          thumbClassName
        )}
      />
    </Pressable>
  );
});

Switch.displayName = "Switch";
