import * as React from "react";
import { View, Text, type ViewProps } from "react-native";
import { cn } from "../../utilities/cn";
import { Card, CardContent } from "../card/card";

export type TrendDirection = "up" | "down" | "neutral";

export interface StatsCardProps extends ViewProps {
  title: string;
  value: string | number;
  trend?: {
    direction: TrendDirection;
    value: string | number;
    label?: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  trend,
  icon,
  className,
  ...props
}: StatsCardProps) {
  const isUp = trend?.direction === "up";
  const isDown = trend?.direction === "down";

  return (
    <Card className={cn("w-full shadow-sm", className)} {...props}>
      <CardContent className="p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </Text>
          {icon ? (
            <View className="h-9 w-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 items-center justify-center">
              {icon}
            </View>
          ) : null}
        </View>

        <Text className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">
          {value}
        </Text>

        {trend ? (
          <View className="flex-row items-center gap-1.5 flex-wrap">
            <View
              className={cn(
                "flex-row items-center rounded-md px-1.5 py-0.5",
                isUp && "bg-success-100 dark:bg-success-950/60",
                isDown && "bg-danger-100 dark:bg-danger-950/60",
                !isUp && !isDown && "bg-neutral-100 dark:bg-neutral-800"
              )}
            >
              <Text
                className={cn(
                  "text-xs font-bold mr-1",
                  isUp && "text-success-700 dark:text-success-300",
                  isDown && "text-danger-700 dark:text-danger-300",
                  !isUp && !isDown && "text-neutral-600 dark:text-neutral-400"
                )}
              >
                {isUp ? "↑" : isDown ? "↓" : "—"}
              </Text>
              <Text
                className={cn(
                  "text-xs font-semibold",
                  isUp && "text-success-700 dark:text-success-300",
                  isDown && "text-danger-700 dark:text-danger-300",
                  !isUp && !isDown && "text-neutral-600 dark:text-neutral-400"
                )}
              >
                {trend.value}
              </Text>
            </View>
            {trend.label ? (
              <Text className="text-xs text-neutral-500 dark:text-neutral-400">
                {trend.label}
              </Text>
            ) : null}
          </View>
        ) : null}
      </CardContent>
    </Card>
  );
}

StatsCard.displayName = "StatsCard";
