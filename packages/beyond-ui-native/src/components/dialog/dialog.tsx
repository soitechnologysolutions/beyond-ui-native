import * as React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
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
        ref,
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

export interface DialogOverlayProps extends ViewProps {
  className?: string;
  closeOnPress?: boolean;
}

export const DialogOverlay = React.forwardRef<View, DialogOverlayProps>(
  function DialogOverlay({ className, closeOnPress = true, ...props }, ref) {
    const { onOpenChange } = useDialogContext();

    return (
      <Pressable
        ref={ref}
        style={StyleSheet.absoluteFill}
        className={cn("z-50 bg-black/60", className)}
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
  children: React.ReactNode;
}

export const DialogContent = React.forwardRef<View, DialogContentProps>(
  function DialogContent({ className, overlayClassName, children, ...props }, ref) {
    return (
      <DialogPortal>
        <View
          pointerEvents="box-none"
          style={StyleSheet.absoluteFill}
          className="z-50 items-center justify-center p-4"
        >
          <DialogOverlay className={overlayClassName} />
          <View
            ref={ref}
            role="dialog"
            aria-modal={true}
            className={cn(
              "z-50 w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl",
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
      className={cn("flex-col space-y-2 text-center sm:text-left", className)}
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
      className={cn("flex-row justify-end space-x-2 mt-6", className)}
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
        ref,
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
