import * as React from "react";
import { Text as NativeText, type TextProps as NativeTextProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";

export const headingVariants = cva("font-bold text-neutral-900 dark:text-neutral-50 tracking-tight", {
  variants: {
    level: {
      h1: "text-3xl font-extrabold",
      h2: "text-2xl font-bold",
      h3: "text-xl font-bold",
      h4: "text-lg font-semibold",
      h5: "text-base font-semibold",
      h6: "text-sm font-semibold uppercase tracking-wider",
    },
  },
  defaultVariants: {
    level: "h2",
  },
});

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends NativeTextProps,
    Omit<VariantProps<typeof headingVariants>, "level"> {
  level?: HeadingLevel;
  className?: string;
}

export const Heading = React.forwardRef<NativeText, HeadingProps>(function Heading(
  { className, level = "h2", ...props },
  ref
) {
  const normalizedLevel =
    typeof level === "number"
      ? (`h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6")
      : level;

  return (
    <NativeText
      ref={ref}
      accessibilityRole="header"
      className={cn(headingVariants({ level: normalizedLevel }), className)}
      {...props}
    />
  );
});

Heading.displayName = "Heading";
