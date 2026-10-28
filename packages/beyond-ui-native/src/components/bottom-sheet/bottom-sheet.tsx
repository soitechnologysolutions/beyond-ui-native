import * as React from "react";
import {
  Modal,
  View,
  Pressable,
  Animated,
  PanResponder,
  useWindowDimensions,
  Platform,
  StyleSheet,
  type ViewProps,
  type PressableProps,
} from "react-native";
import { cn } from "../../utilities/cn";
import { Text } from "../text/text";
import { Heading } from "../text/heading";

export interface BottomSheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeSheet: () => void;
  close: () => void;
}

export const BottomSheetContext = React.createContext<BottomSheetContextValue | null>(null);

export function useBottomSheetContext(): BottomSheetContextValue {
  const context = React.useContext(BottomSheetContext);
  if (!context) {
    throw new Error("BottomSheet components must be used within a BottomSheet");
  }
  return context;
}

export const useBottomSheet = useBottomSheetContext;

export interface BottomSheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const onOpenChangeRef = React.useRef(onOpenChange);
  React.useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      setUncontrolledOpen(nextOpen);
      onOpenChangeRef.current?.(nextOpen);
    },
    []
  );

  const closeSheet = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <BottomSheetContext.Provider value={{ open: isOpen, setOpen, closeSheet, close: closeSheet }}>
      {children}
    </BottomSheetContext.Provider>
  );
};

// --- BottomSheetTrigger ---

export interface BottomSheetTriggerProps extends PressableProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetTrigger = React.forwardRef<View, BottomSheetTriggerProps>(
  ({ asChild, children, onPress, ...props }, ref) => {
    const { setOpen } = useBottomSheetContext();

    const handlePress = (e: any) => {
      try {
        setOpen(true);
      } finally {
        onPress?.(e);
      }
    };

    if (asChild && React.isValidElement(children)) {
      const childProps = (children as React.ReactElement<any>).props || {};
      return React.cloneElement(children as React.ReactElement<any>, {
        ...props,
        ...childProps,
        onPress: (e: any) => {
          try {
            childProps.onPress?.(e);
          } finally {
            handlePress(e);
          }
        },
      });
    }

    return (
      <Pressable ref={ref} onPress={handlePress} role="button" {...props}>
        {children}
      </Pressable>
    );
  }
);
BottomSheetTrigger.displayName = "BottomSheetTrigger";

// --- BottomSheetContent ---

export interface BottomSheetContentProps extends ViewProps {
  className?: string;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

export const BottomSheetContent = React.forwardRef<View, BottomSheetContentProps>(
  ({ className, showCloseButton = true, children, style, ...props }, ref) => {
    const { open, closeSheet } = useBottomSheetContext();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    // PanResponder for drag down on handle bar to dismiss
    const panResponder = React.useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 40 || gestureState.vy > 0.5) {
            closeSheet();
          }
        },
      })
    ).current;

    if (!open) return null;

    const maxHeight = Math.round(windowHeight * 0.85);

    return (
      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={closeSheet}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: windowWidth,
            height: windowHeight,
            justifyContent: "flex-end",
          }}
          pointerEvents="box-none"
        >
          {/* Backdrop */}
          <Pressable
            style={[
              StyleSheet.absoluteFillObject,
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: windowWidth,
                height: windowHeight,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              },
            ]}
            onPress={closeSheet}
          />

          {/* Sheet Container */}
          <View
            style={{
              width: windowWidth,
              maxHeight,
              zIndex: 20,
              elevation: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            }}
            pointerEvents="auto"
          >
            <View
              ref={ref}
              style={style}
              className={cn(
                "w-full bg-white dark:bg-neutral-900 rounded-t-3xl border-t border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-6 overflow-hidden",
                className
              )}
              {...props}
            >
              {/* Drag Handle Bar + Close Button Row */}
              <View className="w-full flex-row items-center justify-between py-2">
                <View style={{ width: 32 }} />
                <View {...panResponder.panHandlers} className="py-2 px-6 items-center">
                  <View className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </View>
                {showCloseButton ? (
                  <Pressable
                    onPress={closeSheet}
                    accessibilityRole="button"
                    accessibilityLabel="Close bottom sheet"
                    hitSlop={12}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text className="text-neutral-500 dark:text-neutral-400 text-base font-bold">
                      ✕
                    </Text>
                  </Pressable>
                ) : (
                  <View style={{ width: 32 }} />
                )}
              </View>

              {children}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);
BottomSheetContent.displayName = "BottomSheetContent";

// --- BottomSheetHeader ---

export interface BottomSheetHeaderProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetHeader = React.forwardRef<View, BottomSheetHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <View ref={ref} className={cn("mb-4 gap-1", className)} {...props}>
      {children}
    </View>
  )
);
BottomSheetHeader.displayName = "BottomSheetHeader";

// --- BottomSheetTitle ---

export interface BottomSheetTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetTitle: React.FC<BottomSheetTitleProps> = ({
  className,
  children,
}) => {
  return (
    <Heading level={4} className={cn("text-xl font-bold text-neutral-900 dark:text-neutral-50", className)}>
      {children}
    </Heading>
  );
};
BottomSheetTitle.displayName = "BottomSheetTitle";

// --- BottomSheetDescription ---

export interface BottomSheetDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetDescription: React.FC<BottomSheetDescriptionProps> = ({
  className,
  children,
}) => {
  return (
    <Text className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}>
      {children}
    </Text>
  );
};
BottomSheetDescription.displayName = "BottomSheetDescription";

// --- BottomSheetBody ---

export interface BottomSheetBodyProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetBody = React.forwardRef<View, BottomSheetBodyProps>(
  ({ className, children, ...props }, ref) => (
    <View ref={ref} className={cn("py-2", className)} {...props}>
      {children}
    </View>
  )
);
BottomSheetBody.displayName = "BottomSheetBody";

// --- BottomSheetFooter ---

export interface BottomSheetFooterProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetFooter = React.forwardRef<View, BottomSheetFooterProps>(
  ({ className, children, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("mt-6 flex-row items-center justify-end gap-3", className)}
      {...props}
    >
      {children}
    </View>
  )
);
BottomSheetFooter.displayName = "BottomSheetFooter";

// --- BottomSheetClose ---

export interface BottomSheetCloseProps extends PressableProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetClose = React.forwardRef<View, BottomSheetCloseProps>(
  ({ asChild, children, onPress, ...props }, ref) => {
    const { closeSheet, setOpen } = useBottomSheetContext();

    const handleClose = () => {
      if (closeSheet) {
        closeSheet();
      } else {
        setOpen(false);
      }
    };

    const handlePress = (e: any) => {
      handleClose();
      onPress?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      const childProps = (children as React.ReactElement<any>).props || {};
      return React.cloneElement(children as React.ReactElement<any>, {
        ...props,
        ...childProps,
        onPress: (e: any) => {
          handleClose();
          childProps.onPress?.(e);
          onPress?.(e);
        },
      });
    }

    return (
      <Pressable ref={ref} onPress={handlePress} accessibilityRole="button" {...props}>
        {children}
      </Pressable>
    );
  }
);
BottomSheetClose.displayName = "BottomSheetClose";
