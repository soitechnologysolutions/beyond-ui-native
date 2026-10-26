import * as React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";

export const alertVariants = cva(
  "w-full rounded-2xl border p-4 flex-col gap-1",
  {
    variants: {
      variant: {
        info: "bg-primary-50 border-primary-200 dark:bg-primary-950/40 dark:border-primary-800",
        success: "bg-success-50 border-success-200 dark:bg-success-950/40 dark:border-success-800",
        warning: "bg-warning-50 border-warning-200 dark:bg-warning-950/40 dark:border-warning-800",
        danger: "bg-danger-50 border-danger-200 dark:bg-danger-950/40 dark:border-danger-800",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export const alertTitleVariants = cva("text-base font-bold tracking-tight", {
  variants: {
    variant: {
      info: "text-primary-800 dark:text-primary-300",
      success: "text-success-800 dark:text-success-300",
      warning: "text-warning-800 dark:text-warning-300",
      danger: "text-danger-800 dark:text-danger-300",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

export const alertDescriptionVariants = cva("text-sm", {
  variants: {
    variant: {
      info: "text-primary-700 dark:text-primary-400",
      success: "text-success-700 dark:text-success-400",
      warning: "text-warning-700 dark:text-warning-400",
      danger: "text-danger-700 dark:text-danger-400",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

type AlertVariantProps = VariantProps<typeof alertVariants>;

interface AlertContextValue {
  variant: AlertVariantProps["variant"];
}

const AlertContext = React.createContext<AlertContextValue>({ variant: "info" });

export interface AlertProps extends ViewProps, AlertVariantProps {
  className?: string;
}

export function Alert({
  variant = "info",
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <AlertContext.Provider value={{ variant }}>
      <View
        accessibilityRole="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {children}
      </View>
    </AlertContext.Provider>
  );
}

Alert.displayName = "Alert";

export function AlertTitle({
  className,
  children,
  ...props
}: TextProps & { className?: string }) {
  const { variant } = React.useContext(AlertContext);
  return (
    <Text
      className={cn(alertTitleVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Text>
  );
}

AlertTitle.displayName = "Alert.Title";

export function AlertDescription({
  className,
  children,
  ...props
}: TextProps & { className?: string }) {
  const { variant } = React.useContext(AlertContext);
  return (
    <Text
      className={cn(alertDescriptionVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Text>
  );
}

AlertDescription.displayName = "Alert.Description";
