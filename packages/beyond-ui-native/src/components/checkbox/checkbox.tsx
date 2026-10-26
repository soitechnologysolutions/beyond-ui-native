import * as React from "react";
import {
  View,
  Text,
  Pressable,
  type PressableProps,
  type GestureResponderEvent,
} from "react-native";
import { cn } from "../../utilities/cn";

export interface CheckboxProps extends Omit<PressableProps, "onPress"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  indicatorClassName?: string;
  label?: string;
  labelClassName?: string;
  onPress?: (e: GestureResponderEvent) => void;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  CheckboxProps
>(function Checkbox(
  {
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    className,
    indicatorClassName,
    label,
    labelClassName,
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

  const content = (
    <Pressable
      ref={ref}
      role="checkbox"
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled: !!disabled }}
      disabled={disabled}
      onPress={handlePress}
      className={cn(
        "h-6 w-6 shrink-0 items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900",
        isChecked && "bg-primary-600 border-primary-600 dark:bg-primary-600 dark:border-primary-600",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      {isChecked ? (
        <View className={cn("items-center justify-center", indicatorClassName)}>
          <Text className="text-white text-xs font-bold leading-none">✓</Text>
        </View>
      ) : null}
    </Pressable>
  );

  if (!label) {
    return content;
  }

  return (
    <View className="flex-row items-center gap-2.5">
      {content}
      <Text
        onPress={!disabled ? handlePress : undefined}
        className={cn(
          "text-sm font-medium text-neutral-800 dark:text-neutral-200",
          disabled && "opacity-50",
          labelClassName
        )}
      >
        {label}
      </Text>
    </View>
  );
});

Checkbox.displayName = "Checkbox";
