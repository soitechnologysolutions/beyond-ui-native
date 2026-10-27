import * as React from "react";
import {
  View,
  Pressable,
  Animated,
  type ViewProps,
  type PressableProps,
} from "react-native";
import { cn } from "../../utilities/cn";
import { isTextContent } from "../../utilities/is-text";
import { Text } from "../text/text";

type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  type: AccordionType;
  value: string[];
  toggleItem: (itemValue: string) => void;
  collapsible: boolean;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
}

export interface AccordionProps extends ViewProps {
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Accordion = React.forwardRef<View, AccordionProps>(
  (
    {
      type = "single",
      value: controlledValue,
      defaultValue,
      onValueChange,
      collapsible = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const toArray = (v?: string | string[]): string[] => {
      if (!v) return [];
      return Array.isArray(v) ? v : [v];
    };

    const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
      toArray(defaultValue)
    );

    const isControlled = controlledValue !== undefined;
    const currentValues = isControlled ? toArray(controlledValue) : uncontrolledValue;

    const toggleItem = React.useCallback(
      (itemValue: string) => {
        let nextValues: string[];
        const isCurrentOpen = currentValues.includes(itemValue);

        if (type === "single") {
          if (isCurrentOpen) {
            nextValues = collapsible ? [] : [itemValue];
          } else {
            nextValues = [itemValue];
          }
        } else {
          if (isCurrentOpen) {
            nextValues = currentValues.filter((v) => v !== itemValue);
          } else {
            nextValues = [...currentValues, itemValue];
          }
        }

        if (!isControlled) {
          setUncontrolledValue(nextValues);
        }

        if (onValueChange) {
          onValueChange(type === "single" ? nextValues[0] ?? "" : nextValues);
        }
      },
      [currentValues, type, collapsible, isControlled, onValueChange]
    );

    return (
      <AccordionContext.Provider
        value={{
          type,
          value: currentValues,
          toggleItem,
          collapsible,
        }}
      >
        <View
          ref={ref}
          className={cn("w-full divide-y divide-border", className)}
          {...props}
        >
          {children}
        </View>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

// --- Accordion Item ---

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error("AccordionItem subcomponents must be used within an AccordionItem");
  }
  return context;
}

export interface AccordionItemProps extends ViewProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const AccordionItem = React.forwardRef<View, AccordionItemProps>(
  ({ value, className, children, ...props }, ref) => {
    const { value: selectedValues } = useAccordionContext();
    const isOpen = selectedValues.includes(value);

    return (
      <AccordionItemContext.Provider value={{ value, isOpen }}>
        <View
          ref={ref}
          className={cn("border-b border-neutral-200 dark:border-neutral-800 py-1", className)}
          {...props}
        >
          {children}
        </View>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

// --- Accordion Trigger ---

export interface AccordionTriggerProps extends PressableProps {
  className?: string;
  children: React.ReactNode;
}

export const AccordionTrigger = React.forwardRef<View, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { toggleItem } = useAccordionContext();
    const { value, isOpen } = useAccordionItemContext();

    const rotationAnim = React.useRef(new Animated.Value(isOpen ? 1 : 0)).current;

    React.useEffect(() => {
      Animated.timing(rotationAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [isOpen, rotationAnim]);

    const rotate = rotationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });

    return (
      <Pressable
        ref={ref}
        onPress={() => toggleItem(value)}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        className={cn(
          "flex-row items-center justify-between py-3 px-1 active:opacity-70",
          className
        )}
        {...props}
      >
        <View className="flex-1 pr-2">
          {isTextContent(children) ? (
            <Text className="text-base font-medium text-neutral-900 dark:text-neutral-100">{children}</Text>
          ) : (
            children
          )}
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Text className="text-neutral-500 dark:text-neutral-400 text-base font-semibold">▼</Text>
        </Animated.View>
      </Pressable>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

// --- Accordion Content ---

export interface AccordionContentProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

export const AccordionContent = React.forwardRef<View, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = useAccordionItemContext();

    if (!isOpen) return null;

    return (
      <View
        ref={ref}
        className={cn("pt-1 pb-3 px-1", className)}
        {...props}
      >
        {isTextContent(children) ? (
          <Text className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{children}</Text>
        ) : (
          children
        )}
      </View>
    );
  }
);
AccordionContent.displayName = "AccordionContent";
