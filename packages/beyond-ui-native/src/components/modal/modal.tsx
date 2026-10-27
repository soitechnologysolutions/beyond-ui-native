import * as React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ViewProps,
  type TextProps,
  type PressableProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";

export const modalVariants = cva(
  "w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl relative",
  {
    variants: {
      size: {
        sm: "max-w-xs",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-[95%] max-h-[90%]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface ModalContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModalContext = React.createContext<ModalContextValue | null>(null);

export function useModalContext(): ModalContextValue {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("Modal compound components must be used within a Modal component");
  }
  return context;
}

export interface ModalProps extends VariantProps<typeof modalVariants> {
  open?: boolean;
  visible?: boolean; // alias for open for RN conventions
  onOpenChange?: (open: boolean) => void;
  onRequestClose?: () => void;
  showCloseButton?: boolean;
  closeOnOverlayPress?: boolean;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

export function Modal({
  open: controlledOpen,
  visible,
  onOpenChange,
  onRequestClose,
  showCloseButton = true,
  closeOnOverlayPress = true,
  size = "md",
  children,
  className,
  overlayClassName,
}: ModalProps) {
  const isOpen = (controlledOpen !== undefined ? controlledOpen : visible) ?? false;

  const handleClose = React.useCallback(() => {
    onOpenChange?.(false);
    onRequestClose?.();
  }, [onOpenChange, onRequestClose]);

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ open: isOpen, onOpenChange: (o) => !o && handleClose() }}>
      <RNModal
        transparent
        visible={isOpen}
        animationType="fade"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={StyleSheet.absoluteFill}
        >
          {/* Backdrop Overlay */}
          <Pressable
            style={StyleSheet.absoluteFill}
            className={cn("bg-black/60", overlayClassName)}
            onPress={closeOnOverlayPress ? handleClose : undefined}
            accessibilityRole="button"
            accessibilityLabel="Close modal overlay"
          />

          {/* Modal Container */}
          <View
            pointerEvents="box-none"
            style={StyleSheet.absoluteFill}
            className="items-center justify-center p-4 z-50"
          >
            <View
              role="dialog"
              aria-modal={true}
              className={cn(modalVariants({ size }), className)}
            >
              {showCloseButton && (
                <Pressable
                  onPress={handleClose}
                  hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
                  className="absolute right-4 top-4 z-50 w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center active:opacity-70"
                  accessibilityRole="button"
                  accessibilityLabel="Close modal"
                >
                  <Text className="text-neutral-500 dark:text-neutral-400 text-sm font-semibold leading-none">
                    ✕
                  </Text>
                </Pressable>
              )}
              {children}
            </View>
          </View>
        </KeyboardAvoidingView>
      </RNModal>
    </ModalContext.Provider>
  );
}
Modal.displayName = "Modal";

export function ModalHeader({
  className,
  ...props
}: ViewProps & { className?: string }) {
  return (
    <View
      className={cn("flex-col space-y-1.5 pr-8", className)}
      {...props}
    />
  );
}
ModalHeader.displayName = "ModalHeader";

export const ModalTitle = React.forwardRef<Text, TextProps & { className?: string }>(
  function ModalTitle({ className, ...props }, ref) {
    return (
      <Text
        ref={ref}
        role="heading"
        aria-level={2}
        className={cn(
          "text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50",
          className
        )}
        {...props}
      />
    );
  }
);
ModalTitle.displayName = "ModalTitle";

export const ModalDescription = React.forwardRef<Text, TextProps & { className?: string }>(
  function ModalDescription({ className, ...props }, ref) {
    return (
      <Text
        ref={ref}
        className={cn(
          "text-sm text-neutral-500 dark:text-neutral-400 mt-1",
          className
        )}
        {...props}
      />
    );
  }
);
ModalDescription.displayName = "ModalDescription";

export function ModalContent({
  className,
  children,
  scrollable = false,
  ...props
}: ViewProps & { className?: string; scrollable?: boolean }) {
  if (scrollable) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={cn("py-3 max-h-[70vh]", className)}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View className={cn("py-3", className)} {...props}>
      {children}
    </View>
  );
}
ModalContent.displayName = "ModalContent";

export function ModalFooter({
  className,
  ...props
}: ViewProps & { className?: string }) {
  return (
    <View
      className={cn(
        "flex-row flex-wrap items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800 mt-2",
        className
      )}
      {...props}
    />
  );
}
ModalFooter.displayName = "ModalFooter";
