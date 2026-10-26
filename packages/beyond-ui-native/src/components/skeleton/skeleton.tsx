import * as React from "react";
import { Animated, type ViewProps } from "react-native";
import { cn } from "../../utilities/cn";

export interface SkeletonProps extends ViewProps {
  className?: string;
}

export function Skeleton({ className, style, ...props }: SkeletonProps) {
  const pulseAnim = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[{ opacity: pulseAnim }, style]}
      className={cn(
        "rounded-xl bg-neutral-200 dark:bg-neutral-800",
        className
      )}
      {...props}
    />
  );
}

Skeleton.displayName = "Skeleton";
