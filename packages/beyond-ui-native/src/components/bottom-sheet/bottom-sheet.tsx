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

interface BottomSheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeSheet: () => void;
}

const BottomSheetContext = React.createContext<BottomSheetContextValue | null>(null);

function useBottomSheetContext() {
  const context = React.useContext(BottomSheetContext);
  if (!context) {
    throw new Error("BottomSheet components must be used within a BottomSheet");
  }
  return context;
}

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

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const closeSheet = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <BottomSheetContext.Provider value={{ open: isOpen, setOpen, closeSheet }}>
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
      setOpen(true);
      onPress?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ...(ref != null ? { ref } : {}),
        onPress: (e: any) => {
          (children.props as any)?.onPress?.(e);
          handlePress(e);
        },
      });
    }

    return (
      <Pressable ref={ref} onPress={handlePress} {...props}>
        {children}
      </Pressable>
    );
  }
);
BottomSheetTrigger.displayName = "BottomSheetTrigger";

// --- BottomSheetContent ---

export interface BottomSheetContentProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetContent = React.forwardRef<View, BottomSheetContentProps>(
  ({ className, children, style, ...props }, ref) => {
    const { open, closeSheet } = useBottomSheetContext();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const [modalVisible, setModalVisible] = React.useState(open);

    const translateY = React.useRef(new Animated.Value(windowHeight)).current;
    const backdropOpacity = React.useRef(new Animated.Value(0)).current;
    const useNativeDriver = Platform.OS !== "web";

    React.useEffect(() => {
      if (open) {
        setModalVisible(true);
        translateY.setValue(windowHeight);
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver,
            bounciness: 4,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: windowHeight,
            duration: 200,
            useNativeDriver,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver,
          }),
        ]).start(({ finished }) => {
          if (finished) {
            setModalVisible(false);
          }
        });
      }
    }, [open, translateY, backdropOpacity, windowHeight, useNativeDriver]);

    // PanResponder for drag down to dismiss
    const panResponder = React.useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 120 || gestureState.vy > 0.8) {
            closeSheet();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver,
              bounciness: 4,
            }).start();
          }
        },
      })
    ).current;

    if (!modalVisible) return null;

    const maxHeight = Math.round(windowHeight * 0.85);

    return (
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
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
          <Animated.View
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
                opacity: backdropOpacity,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              },
            ]}
          >
            <Pressable style={StyleSheet.absoluteFillObject} onPress={closeSheet} />
          </Animated.View>

          {/* Sheet Container */}
          <Animated.View
            ref={ref}
            style={[
              {
                width: windowWidth,
                maxHeight,
                transform: [{ translateY }],
                zIndex: 10,
                elevation: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
              },
              style,
            ]}
            className={cn(
              "w-full bg-white dark:bg-neutral-900 rounded-t-3xl border-t border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-6 overflow-hidden",
              className
            )}
            {...props}
          >
            {/* Drag Handle Bar */}
            <View {...panResponder.panHandlers} className="w-full py-3 items-center">
              <View className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            </View>

            {children}
          </Animated.View>
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
    const { closeSheet } = useBottomSheetContext();

    const handlePress = (e: any) => {
      closeSheet();
      onPress?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ...(ref != null ? { ref } : {}),
        onPress: (e: any) => {
          (children.props as any)?.onPress?.(e);
          handlePress(e);
        },
      });
    }

    return (
      <Pressable ref={ref} onPress={handlePress} {...props}>
        {children}
      </Pressable>
    );
  }
);
BottomSheetClose.displayName = "BottomSheetClose";
