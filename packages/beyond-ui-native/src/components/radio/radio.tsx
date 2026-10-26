import * as React from "react";
import { View, Text, Pressable, type ViewProps } from "react-native";
import { cn } from "../../utilities/cn";

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

export interface RadioGroupProps extends ViewProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <RadioGroupContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        disabled,
      }}
    >
      <View className={cn("gap-3", className)} {...props}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  indicatorClassName?: string;
  labelClassName?: string;
}

export function Radio({
  value,
  label,
  disabled: itemDisabled,
  className,
  indicatorClassName,
  labelClassName,
}: RadioProps) {
  const group = React.useContext(RadioGroupContext);
  const isSelected = group.value === value;
  const isDisabled = group.disabled || itemDisabled;

  const handlePress = () => {
    if (!isDisabled) {
      group.onValueChange?.(value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      className={cn("flex-row items-center gap-2.5", isDisabled && "opacity-50")}
    >
      <View
        className={cn(
          "h-5 w-5 rounded-full border border-neutral-300 dark:border-neutral-700 items-center justify-center bg-white dark:bg-neutral-900",
          isSelected && "border-primary-600 dark:border-primary-600",
          className
        )}
      >
        {isSelected ? (
          <View
            className={cn(
              "h-2.5 w-2.5 rounded-full bg-primary-600 dark:bg-primary-600",
              indicatorClassName
            )}
          />
        ) : null}
      </View>
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
    </Pressable>
  );
}
