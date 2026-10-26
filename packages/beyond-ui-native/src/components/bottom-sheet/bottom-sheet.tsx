import * as React from "react";
import {
  Modal,
  View,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
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
        ref,
        onPress: handlePress,
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
  ({ className, children, ...props }, ref) => {
    const { open, closeSheet } = useBottomSheetContext();
    const screenHeight = Dimensions.get("window").height;

    const translateY = React.useRef(new Animated.Value(screenHeight)).current;
    const backdropOpacity = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      if (open) {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [open, translateY, backdropOpacity, screenHeight]);

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
              useNativeDriver: true,
              bounciness: 4,
            }).start();
          }
        },
      })
    ).current;

    if (!open) return null;

    return (
      <Modal
        transparent
        visible={open}
        animationType="none"
        onRequestClose={closeSheet}
        statusBarTranslucent
      >
        <View className="flex-1 justify-end">
          {/* Backdrop */}
          <Animated.View
            style={{ opacity: backdropOpacity }}
            className="absolute inset-0 bg-black/60"
          >
            <Pressable className="flex-1" onPress={closeSheet} />
          </Animated.View>

          {/* Sheet Container */}
          <Animated.View
            ref={ref}
            style={{ transform: [{ translateY }] }}
            className={cn(
              "w-full bg-card rounded-t-3xl border-t border-border shadow-2xl pt-2 pb-8 px-6 max-h-[85%]",
              className
            )}
            {...props}
          >
            {/* Drag Handle Bar */}
            <View {...panResponder.panHandlers} className="w-full py-2 items-center">
              <View className="w-12 h-1.5 rounded-full bg-muted/40" />
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
    <Heading level={4} className={cn("text-xl font-bold text-foreground", className)}>
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
    <Text className={cn("text-sm text-muted", className)}>
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
        ref,
        onPress: handlePress,
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
