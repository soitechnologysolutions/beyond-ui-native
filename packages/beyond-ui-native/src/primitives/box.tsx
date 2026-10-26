import * as React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "../utilities/cn";

export interface BoxProps extends ViewProps {
  className?: string;
  children?: React.ReactNode;
}

export const Box = React.forwardRef<View, BoxProps>(
  ({ className, style, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(className)}
        style={style}
        {...props}
      >
        {children}
      </View>
    );
  }
);

Box.displayName = "Box";
