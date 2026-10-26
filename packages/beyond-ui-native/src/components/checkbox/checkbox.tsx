import * as React from "react";
import { View, Text } from "react-native";
import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { cn } from "../../utilities/cn";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  className?: string;
  indicatorClassName?: string;
  label?: string;
  labelClassName?: string;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(function Checkbox(
  { className, indicatorClassName, label, labelClassName, ...props },
  ref
) {
  const content = (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "h-6 w-6 shrink-0 items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900",
        props.checked && "bg-primary-600 border-primary-600 dark:bg-primary-600 dark:border-primary-600",
        props.disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("items-center justify-center", indicatorClassName)}
      >
        <Text className="text-white text-xs font-bold leading-none">✓</Text>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label) {
    return content;
  }

  return (
    <View className="flex-row items-center gap-2.5">
      {content}
      <Text
        onPress={props.onCheckedChange ? () => props.onCheckedChange(!props.checked) : undefined}
        className={cn(
          "text-sm font-medium text-neutral-800 dark:text-neutral-200",
          props.disabled && "opacity-50",
          labelClassName
        )}
      >
        {label}
      </Text>
    </View>
  );
});

Checkbox.displayName = "Checkbox";
