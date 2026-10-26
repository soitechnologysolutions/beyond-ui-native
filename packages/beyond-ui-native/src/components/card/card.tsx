import * as React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";

export const cardVariants = cva(
  "w-full rounded-2xl border bg-white dark:bg-neutral-900 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-neutral-200 dark:border-neutral-800 shadow-sm",
        elevated: "border-neutral-200/80 dark:border-neutral-800 shadow-md",
        outlined: "border-2 border-primary-200 dark:border-primary-800",
        ghost: "border-transparent bg-transparent shadow-none",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "none",
    },
  }
);

export interface CardProps
  extends ViewProps,
    VariantProps<typeof cardVariants> {
  className?: string;
}

export const Card = React.forwardRef<View, CardProps>(function Card(
  { className, variant, padding, ...props },
  ref
) {
  return (
    <View
      ref={ref}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
});
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  View,
  ViewProps & { className?: string }
>(function CardHeader({ className, ...props }, ref) {
  return (
    <View
      ref={ref}
      className={cn("flex-col space-y-1.5 p-4 pb-2", className)}
      {...props}
    />
  );
});
CardHeader.displayName = "Card.Header";

export const CardTitle = React.forwardRef<
  Text,
  TextProps & { className?: string }
>(function CardTitle({ className, ...props }, ref) {
  return (
    <Text
      ref={ref}
      className={cn(
        "text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50",
        className
      )}
      {...props}
    />
  );
});
CardTitle.displayName = "Card.Title";

export const CardDescription = React.forwardRef<
  Text,
  TextProps & { className?: string }
>(function CardDescription({ className, ...props }, ref) {
  return (
    <Text
      ref={ref}
      className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}
      {...props}
    />
  );
});
CardDescription.displayName = "Card.Description";

export const CardContent = React.forwardRef<
  View,
  ViewProps & { className?: string }
>(function CardContent({ className, ...props }, ref) {
  return (
    <View
      ref={ref}
      className={cn("p-4 pt-1", className)}
      {...props}
    />
  );
});
CardContent.displayName = "Card.Content";

export const CardFooter = React.forwardRef<
  View,
  ViewProps & { className?: string }
>(function CardFooter({ className, ...props }, ref) {
  return (
    <View
      ref={ref}
      className={cn("flex-row items-center p-4 pt-0", className)}
      {...props}
    />
  );
});
CardFooter.displayName = "Card.Footer";
