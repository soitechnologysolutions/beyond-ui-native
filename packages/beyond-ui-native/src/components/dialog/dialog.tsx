import * as React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
  type ViewProps,
  type TextProps,
  type PressableProps,
  type GestureResponderEvent,
} from "react-native";
import { cn } from "../../utilities/cn";

export interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DialogContext = React.createContext<DialogContextValue | null>(null);

export function useDialogContext(): DialogContextValue {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog compound components must be used within a Dialog component");
  }
  return context;
}

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}
Dialog.displayName = "Dialog";

export interface DialogTriggerProps extends PressableProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const DialogTrigger = React.forwardRef<View, DialogTriggerProps>(
  function DialogTrigger({ asChild, children, onPress, ...props }, ref) {
    const { open, onOpenChange } = useDialogContext();

    const handlePress = (e: GestureResponderEvent) => {
      onOpenChange(!open);
      onPress?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ...(ref != null ? { ref } : {}),
        onPress: (e: GestureResponderEvent) => {
          (children.props as any)?.onPress?.(e);
          handlePress(e);
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
DialogTrigger.displayName = "DialogTrigger";

export interface DialogPortalProps {
  children: React.ReactNode;
  forceMount?: boolean;
}

export function DialogPortal({ children, forceMount }: DialogPortalProps) {
  const { open, onOpenChange } = useDialogContext();

  if (!open && !forceMount) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
      statusBarTranslucent
    >
      {children}
    </Modal>
  );
}
DialogPortal.displayName = "DialogPortal";

export interface DialogOverlayProps extends PressableProps {
  className?: string;
  closeOnPress?: boolean;
}

export const DialogOverlay = React.forwardRef<View, DialogOverlayProps>(
  function DialogOverlay({ className, closeOnPress = true, style, ...props }, ref) {
    const { onOpenChange } = useDialogContext();

    return (
      <Pressable
        ref={ref}
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(0, 0, 0, 0.6)" },
          style as any,
        ]}
        className={cn("bg-black/60", className)}
        onPress={() => {
          if (closeOnPress) {
            onOpenChange(false);
          }
        }}
        {...props}
      />
    );
  }
);
DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps extends ViewProps {
  className?: string;
  overlayClassName?: string;
  closeOnOverlayPress?: boolean;
  children: React.ReactNode;
}

export const DialogContent = React.forwardRef<View, DialogContentProps>(
  function DialogContent(
    { className, overlayClassName, closeOnOverlayPress = true, children, style, ...props },
    ref
  ) {
    const [dimensions, setDimensions] = React.useState(() => Dimensions.get("window"));

    React.useEffect(() => {
      const sub = Dimensions.addEventListener("change", ({ window }) => {
        setDimensions(window);
      });
      return () => sub?.remove();
    }, []);

    const maxHeight = Math.round(dimensions.height * 0.85);
    const maxWidth = Math.min(512, Math.max(0, Math.round(dimensions.width - 32)));

    return (
      <DialogPortal>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 24,
          }}
          className="flex-1 items-center justify-center p-4"
        >
          <DialogOverlay
            className={overlayClassName}
            closeOnPress={closeOnOverlayPress}
          />
          <View
            ref={ref}
            role="dialog"
            aria-modal={true}
            style={[
              {
                width: "100%",
                maxWidth,
                maxHeight,
                zIndex: 10,
                elevation: 10,
              },
              style,
            ]}
            className={cn(
              "w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl overflow-hidden",
              className
            )}
            {...props}
          >
            {children}
          </View>
        </View>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = "DialogContent";

export function DialogHeader({
  className,
  ...props
}: ViewProps & { className?: string }) {
  return (
    <View
      className={cn("flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}
DialogHeader.displayName = "DialogHeader";

export const DialogTitle = React.forwardRef<Text, TextProps & { className?: string }>(
  function DialogTitle({ className, ...props }, ref) {
    return (
      <Text
        ref={ref}
        role="heading"
        aria-level={2}
        className={cn(
          "text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50",
          className
        )}
        {...props}
      />
    );
  }
);
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef<Text, TextProps & { className?: string }>(
  function DialogDescription({ className, ...props }, ref) {
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
DialogDescription.displayName = "DialogDescription";

export function DialogFooter({
  className,
  ...props
}: ViewProps & { className?: string }) {
  return (
    <View
      className={cn("flex-row items-center justify-end gap-3 mt-6", className)}
      {...props}
    />
  );
}
DialogFooter.displayName = "DialogFooter";

export interface DialogCloseProps extends PressableProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const DialogClose = React.forwardRef<View, DialogCloseProps>(
  function DialogClose({ asChild, children, onPress, ...props }, ref) {
    const { onOpenChange } = useDialogContext();

    const handlePress = (e: GestureResponderEvent) => {
      onOpenChange(false);
      onPress?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ...(ref != null ? { ref } : {}),
        onPress: (e: GestureResponderEvent) => {
          (children.props as any)?.onPress?.(e);
          handlePress(e);
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
DialogClose.displayName = "DialogClose";
