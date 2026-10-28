import * as React from "react";
import {
  Modal,
  View,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  type ViewProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";
import { isTextContent } from "../../utilities/is-text";
import { Text } from "../text/text";

const selectTriggerVariants = cva(
  "flex-row items-center justify-between rounded-xl border bg-white dark:bg-neutral-900 px-4 py-3 active:opacity-80",
  {
    variants: {
      variant: {
        default: "border-neutral-300 dark:border-neutral-700",
        error: "border-danger",
        success: "border-success",
      },
      size: {
        sm: "h-9 px-3 py-1.5",
        md: "h-12 px-4 py-3",
        lg: "h-14 px-5 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  value?: string;
  onSelect: (val: string) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select compound subcomponents must be used within a Select");
  }
  return context;
}

export interface SelectProps extends VariantProps<typeof selectTriggerVariants> {
  options?: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder = "Select an option...",
  label,
  helperText,
  error,
  disabled = false,
  searchable = false,
  variant,
  size,
  className,
  children,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const handleSelect = React.useCallback(
    (newVal: string) => {
      if (!isControlled) {
        setUncontrolledValue(newVal);
      }
      onValueChange?.(newVal);
      setOpen(false);
      setSearchQuery("");
    },
    [isControlled, onValueChange]
  );

  const selectedOption = options?.find((o) => o.value === currentValue);
  const displayLabel = selectedOption ? selectedOption.label : "";

  const filteredOptions = React.useMemo(() => {
    if (!options) return [];
    if (!searchQuery) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const activeVariant = error ? "error" : variant;

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value: currentValue,
        onSelect: handleSelect,
      }}
    >
      <View className={cn("w-full gap-1.5", className)}>
        {label && (
          <Text className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</Text>
        )}

        {children ? (
          children
        ) : (
          <Pressable
            disabled={disabled}
            onPress={() => setOpen(true)}
            accessibilityRole="combobox"
            accessibilityState={{ disabled, expanded: open }}
            className={cn(
              selectTriggerVariants({ variant: activeVariant, size }),
              disabled && "opacity-50"
            )}
          >
            <Text
              className={cn(
                "text-base",
                displayLabel
                  ? "text-neutral-900 dark:text-neutral-100 font-medium"
                  : "text-neutral-500 dark:text-neutral-400 font-normal"
              )}
            >
              {displayLabel || placeholder}
            </Text>
            <Text className="text-neutral-500 dark:text-neutral-400 text-xs">▼</Text>
          </Pressable>
        )}

        {error ? (
          <Text className="text-xs text-danger font-medium">{error}</Text>
        ) : helperText ? (
          <Text className="text-xs text-neutral-500 dark:text-neutral-400">{helperText}</Text>
        ) : null}

        {/* Modal Options Picker if options prop was passed */}
        {options && (
          <Modal
            transparent
            visible={open}
            animationType="fade"
            onRequestClose={() => setOpen(false)}
            statusBarTranslucent
          >
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              }}
              className="flex-1 justify-end bg-black/60"
            >
              <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setOpen(false)} />
              <View
                style={{
                  maxHeight: Math.round(Dimensions.get("window").height * 0.75),
                  zIndex: 10,
                  elevation: 10,
                }}
                className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl border-t border-neutral-200 dark:border-neutral-800 p-6 overflow-hidden"
              >
                <View className="flex-row items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-3">
                  <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                    {label || placeholder}
                  </Text>
                  <Pressable onPress={() => setOpen(false)} className="p-1">
                    <Text className="text-neutral-500 dark:text-neutral-400 text-lg font-semibold">✕</Text>
                  </Pressable>
                </View>

                {searchable && (
                  <View className="mb-4">
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search options..."
                      placeholderTextColor="#9ca3af"
                      className="h-11 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base"
                    />
                  </View>
                )}

                <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
                  {filteredOptions.length === 0 ? (
                    <View className="py-8 items-center">
                      <Text className="text-neutral-500 dark:text-neutral-400 text-sm">No options found</Text>
                    </View>
                  ) : (
                    filteredOptions.map((opt) => {
                      const isSelected = opt.value === currentValue;
                      return (
                        <Pressable
                          key={opt.value}
                          disabled={opt.disabled}
                          onPress={() => handleSelect(opt.value)}
                          className={cn(
                            "flex-row items-center justify-between py-3.5 px-3 rounded-xl active:bg-neutral-100 dark:active:bg-neutral-800",
                            isSelected && "bg-primary-50 dark:bg-primary-950/40",
                            opt.disabled && "opacity-40"
                          )}
                        >
                          <Text
                            className={cn(
                              "text-base",
                              isSelected
                                ? "text-primary-600 dark:text-primary-400 font-semibold"
                                : "text-neutral-900 dark:text-neutral-100 font-normal"
                            )}
                          >
                            {opt.label}
                          </Text>
                          {isSelected && (
                            <Text className="text-primary-600 dark:text-primary-400 font-bold text-base">✓</Text>
                          )}
                        </Pressable>
                      );
                    })
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SelectContext.Provider>
  );
};
Select.displayName = "Select";

// --- Compound Subcomponents ---

export interface SelectTriggerProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  className,
  children,
  ...props
}) => {
  const { setOpen, open } = useSelectContext();
  return (
    <Pressable
      onPress={() => setOpen(true)}
      accessibilityRole="combobox"
      accessibilityState={{ expanded: open }}
      className={cn(
        "flex-row items-center justify-between rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 active:opacity-80",
        className
      )}
      {...props}
    >
      {children}
      <Text className="text-neutral-500 dark:text-neutral-400 text-xs">▼</Text>
    </Pressable>
  );
};
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder = "Select...",
  className,
}) => {
  const { value } = useSelectContext();
  return (
    <Text
      className={cn(
        "text-base",
        value ? "text-neutral-900 dark:text-neutral-100 font-medium" : "text-neutral-500 dark:text-neutral-400",
        className
      )}
    >
      {value || placeholder}
    </Text>
  );
};
SelectValue.displayName = "SelectValue";

export interface SelectContentProps {
  title?: string;
  children: React.ReactNode;
}

export const SelectContent: React.FC<SelectContentProps> = ({ title, children }) => {
  const { open, setOpen } = useSelectContext();
  if (!open) return null;

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={() => setOpen(false)}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
        className="flex-1 justify-end bg-black/60"
      >
        <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setOpen(false)} />
        <View
          style={{
            maxHeight: Math.round(Dimensions.get("window").height * 0.75),
            zIndex: 10,
            elevation: 10,
          }}
          className="w-full bg-white dark:bg-neutral-900 rounded-t-3xl border-t border-neutral-200 dark:border-neutral-800 p-6 overflow-hidden"
        >
          <View className="flex-row items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 mb-3">
            <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title || "Select"}</Text>
            <Pressable onPress={() => setOpen(false)} className="p-1">
              <Text className="text-neutral-500 dark:text-neutral-400 text-lg font-semibold">✕</Text>
            </Pressable>
          </View>
          <ScrollView className="max-h-80">{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
};
SelectContent.displayName = "SelectContent";

export interface SelectItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const SelectItem: React.FC<SelectItemProps> = ({
  value: itemValue,
  className,
  children,
}) => {
  const { value: selectedValue, onSelect } = useSelectContext();
  const isSelected = selectedValue === itemValue;

  return (
    <Pressable
      onPress={() => onSelect(itemValue)}
      className={cn(
        "flex-row items-center justify-between py-3.5 px-3 rounded-xl active:bg-neutral-100 dark:active:bg-neutral-800",
        isSelected && "bg-primary-50 dark:bg-primary-950/40",
        className
      )}
    >
      {isTextContent(children) ? (
        <Text
          className={cn(
            "text-base",
            isSelected ? "text-primary-600 dark:text-primary-400 font-semibold" : "text-neutral-900 dark:text-neutral-100 font-normal"
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {isSelected && <Text className="text-primary-600 dark:text-primary-400 font-bold text-base">✓</Text>}
    </Pressable>
  );
};
SelectItem.displayName = "SelectItem";
