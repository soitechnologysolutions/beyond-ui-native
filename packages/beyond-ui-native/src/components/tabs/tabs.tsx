import * as React from "react";
import { Text } from "react-native";
import * as TabsPrimitive from "@rn-primitives/tabs";
import { cn } from "../../utilities/cn";

export interface TabsProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, "value" | "onValueChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(function Tabs({ value: controlledValue, defaultValue = "", onValueChange, ...props }, ref) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsPrimitive.Root
      ref={ref}
      value={currentValue}
      onValueChange={handleValueChange}
      {...props}
    />
  );
});
Tabs.displayName = "Tabs";

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    className?: string;
  }
>(function TabsList({ className, ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "flex-row items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1",
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    className?: string;
    textClassName?: string;
    children?: React.ReactNode;
  }
>(function TabsTrigger({ className, textClassName, children, ...props }, ref) {
  const { value } = TabsPrimitive.useRootContext();
  const isSelected = value === props.value;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex-1 items-center justify-center rounded-lg py-2 px-3 transition-all",
        isSelected
          ? "bg-white dark:bg-neutral-900 shadow-sm"
          : "bg-transparent opacity-70",
        props.disabled && "opacity-40",
        className
      )}
      {...props}
    >
      {typeof children === "string" ? (
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
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    className?: string;
  }
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn("mt-3", className)}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";
