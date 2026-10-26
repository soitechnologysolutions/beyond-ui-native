import * as React from "react";
import { View, Text, Image as NativeImage, type ImageProps, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";

export const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full items-center justify-center bg-neutral-200 dark:bg-neutral-800",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-14 w-14",
        xl: "h-20 w-20",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const avatarTextVariants = cva("font-semibold text-neutral-700 dark:text-neutral-300", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-lg",
      xl: "text-2xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface AvatarContextValue {
  size: "sm" | "md" | "lg" | "xl";
}

const AvatarContext = React.createContext<AvatarContextValue>({ size: "md" });

export interface AvatarProps
  extends ViewProps,
    VariantProps<typeof avatarVariants> {
  className?: string;
}

export function Avatar({
  className,
  size = "md",
  children,
  ...props
}: AvatarProps) {
  const currentSize = size ?? "md";
  return (
    <AvatarContext.Provider value={{ size: currentSize }}>
      <View
        className={cn(avatarVariants({ size: currentSize }), className)}
        {...props}
      >
        {children}
      </View>
    </AvatarContext.Provider>
  );
}
Avatar.displayName = "Avatar";

export interface AvatarImageProps extends ImageProps {
  className?: string;
}

export function AvatarImage({ className, ...props }: AvatarImageProps) {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) return null;

  return (
    <NativeImage
      onError={() => setHasError(true)}
      className={cn("h-full w-full rounded-full object-cover", className)}
      {...props}
    />
  );
}
AvatarImage.displayName = "Avatar.Image";

export interface AvatarFallbackProps extends ViewProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  textClassName?: string;
}

export function AvatarFallback({
  children,
  text,
  className,
  textClassName,
  ...props
}: AvatarFallbackProps) {
  const { size } = React.useContext(AvatarContext);
  const content = text ?? children;

  return (
    <View
      className={cn(
        "h-full w-full items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800",
        className
      )}
      {...props}
    >
      {typeof content === "string" ? (
        <Text
          className={cn(avatarTextVariants({ size }), textClassName)}
        >
          {content}
        </Text>
      ) : (
        content
      )}
    </View>
  );
}
AvatarFallback.displayName = "Avatar.Fallback";
