import * as React from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { cva } from "class-variance-authority";
import { cn } from "../../utilities/cn";
import { ToastItem, ToastVariant } from "./types";

const toastVariants = cva(
  "w-full max-w-sm rounded-xl p-4 shadow-lg border flex-row items-center justify-between mb-2",
  {
    variants: {
      variant: {
        default: "bg-white border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800",
        success: "bg-success-50 border-success-200 dark:bg-success-950/80 dark:border-success-800",
        danger: "bg-danger-50 border-danger-200 dark:bg-danger-950/80 dark:border-danger-800",
        warning: "bg-warning-50 border-warning-200 dark:bg-warning-950/80 dark:border-warning-800",
        info: "bg-primary-50 border-primary-200 dark:bg-primary-950/80 dark:border-primary-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const toastTitleVariants = cva("text-sm font-semibold", {
  variants: {
    variant: {
      default: "text-neutral-900 dark:text-white",
      success: "text-success-700 dark:text-success-300",
      danger: "text-danger-700 dark:text-danger-300",
      warning: "text-warning-800 dark:text-warning-300",
      info: "text-primary-700 dark:text-primary-300",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ToastBannerProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function ToastBanner({ toast, onDismiss }: ToastBannerProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-16)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      handleDismiss();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -16,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  };

  const variant: ToastVariant = toast.variant || "default";

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className="w-full items-center px-4"
    >
      <Pressable
        onPress={handleDismiss}
        className={cn(toastVariants({ variant }))}
      >
        <View className="flex-1 pr-2">
          <Text className={cn(toastTitleVariants({ variant }))}>
            {toast.title}
          </Text>
          {toast.description ? (
            <Text className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              {toast.description}
            </Text>
          ) : null}
        </View>
        <Text className="text-xs text-neutral-400">✕</Text>
      </Pressable>
    </Animated.View>
  );
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      className="absolute top-12 left-0 right-0 z-50 items-center"
    >
      {toasts.map((toast) => (
        <ToastBanner key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </View>
  );
}
