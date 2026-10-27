import * as React from "react";
import {
  View,
  Text,
  Pressable,
  type ViewProps,
  type PressableProps,
  type GestureResponderEvent,
} from "react-native";
import { cn } from "../../utilities/cn";
import { isTextContent } from "../../utilities/is-text";

export interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

export const TabsContext = React.createContext<TabsContextValue | null>(null);

export function useTabsContext(): TabsContextValue {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be rendered inside a Tabs component");
  }
  return context;
}

export interface TabsProps extends ViewProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const Tabs = React.forwardRef<View, TabsProps>(function Tabs(
  { value: controlledValue, defaultValue = "", onValueChange, className, children, ...props },
  ref
) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (!isControlled) {
        setInternalValue(val);
      }
      onValueChange?.(val);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <View ref={ref} className={className} {...props}>
        {children}
      </View>
    </TabsContext.Provider>
  );
});
Tabs.displayName = "Tabs";

export interface TabsListProps extends ViewProps {
  className?: string;
}

export const TabsList = React.forwardRef<View, TabsListProps>(function TabsList(
  { className, ...props },
  ref
) {
  return (
    <View
      ref={ref}
      accessibilityRole="radiogroup"
      className={cn(
        "flex-row items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1",
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends Omit<PressableProps, "onPress"> {
  value: string;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
}

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  TabsTriggerProps
>(function TabsTrigger({ value, className, textClassName, children, onPress, disabled, ...props }, ref) {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = selectedValue === value;

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled) return;
    onValueChange(value);
    onPress?.(e);
  };

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: !!disabled }}
      disabled={disabled}
      onPress={handlePress}
      className={cn(
        "flex-1 items-center justify-center rounded-lg py-2 px-3 transition-all",
        isSelected
          ? "bg-white dark:bg-neutral-900 shadow-sm"
          : "bg-transparent opacity-70",
        disabled && "opacity-40",
        className
      )}
      {...props}
    >
      {isTextContent(children) ? (
        <Text
          className={cn(
            "text-sm font-semibold",
            isSelected
              ? "text-neutral-900 dark:text-neutral-50"
              : "text-neutral-600 dark:text-neutral-400",
            textClassName
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
});
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends ViewProps {
  value: string;
  className?: string;
  forceMount?: boolean;
}

export const TabsContent = React.forwardRef<View, TabsContentProps>(function TabsContent(
  { value, className, forceMount, children, ...props },
  ref
) {
  const { value: selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;

  if (!isSelected && !forceMount) {
    return null;
  }

  return (
    <View
      ref={ref}
      role="tabpanel"
      accessibilityElementsHidden={!isSelected}
      className={cn("mt-3", className)}
      {...props}
    >
      {children}
    </View>
  );
});
TabsContent.displayName = "TabsContent";
