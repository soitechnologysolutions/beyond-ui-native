import * as React from "react";
import {
  View,
  ScrollView,
  Pressable,
  type ViewProps,
} from "react-native";
import { cn } from "../../utilities/cn";
import { Text } from "../../components/text/text";
import { Heading } from "../../components/text/heading";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar/avatar";
import { Badge } from "../../components/badge/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/card/card";
import { StatsCard, type StatsCardProps } from "../../components/stats-card/stats-card";
import { Button } from "../../components/button/button";

export interface DashboardMetric extends StatsCardProps {
  id: string;
}

export interface DashboardActivity {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  amount?: string;
  status?: {
    label: string;
    variant: "primary" | "secondary" | "success" | "warning" | "danger" | "outline";
  };
  avatarUrl?: string;
  avatarInitials?: string;
}

export interface DashboardQuickAction {
  id: string;
  label: string;
  icon?: string;
  onPress: () => void;
}

export interface DashboardTemplateProps extends ViewProps {
  userName: string;
  userRole?: string;
  userAvatarUrl?: string;
  metrics: DashboardMetric[];
  quickActions?: DashboardQuickAction[];
  recentActivities?: DashboardActivity[];
  onViewAllActivities?: () => void;
  onNotificationPress?: () => void;
  unreadNotificationsCount?: number;
  className?: string;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  userName,
  userRole = "Administrator",
  userAvatarUrl,
  metrics,
  quickActions,
  recentActivities,
  onViewAllActivities,
  onNotificationPress,
  unreadNotificationsCount = 0,
  className,
  ...props
}) => {
  return (
    <ScrollView
      {...props}
      style={[{ flex: 1 }, (props as any).style]}
      className={cn("flex-1 bg-neutral-50 dark:bg-neutral-950", className)}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Greeting Header */}
      <View className="px-6 pt-6 pb-4 flex-row items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <View className="flex-row items-center gap-3">
          <Avatar size="lg">
            {userAvatarUrl && <AvatarImage source={{ uri: userAvatarUrl }} />}
            <AvatarFallback text={userName.slice(0, 2).toUpperCase()} />
          </Avatar>
          <View>
            <Text className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">
              {userRole}
            </Text>
            <Heading level={3} className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              Hello, {userName} 👋
            </Heading>
          </View>
        </View>

        {onNotificationPress && (
          <Pressable
            onPress={onNotificationPress}
            className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 items-center justify-center relative active:opacity-70"
          >
            <Text className="text-base text-neutral-900 dark:text-neutral-100">🔔</Text>
            {unreadNotificationsCount > 0 && (
              <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger items-center justify-center">
                <Text className="text-[10px] font-bold text-white">
                  {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                </Text>
              </View>
            )}
          </Pressable>
        )}
      </View>

      <View className="px-6 pt-6 gap-6">
        {/* Quick Actions */}
        {quickActions && quickActions.length > 0 && (
          <View className="gap-2">
            <Text className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Quick Actions
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-6 px-6"
            >
              <View className="flex-row gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onPress={action.onPress}
                  >
                    {action.icon ? `${action.icon} ${action.label}` : action.label}
                  </Button>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Metrics Grid */}
        <View className="gap-3">
          <Text className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Overview Performance
          </Text>
          <View className="gap-3">
            {metrics.map((metric) => (
              <StatsCard key={metric.id} {...metric} />
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        {recentActivities && recentActivities.length > 0 && (
          <Card className="gap-2">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
              {onViewAllActivities && (
                <Pressable onPress={onViewAllActivities}>
                  <Text className="text-xs font-semibold text-primary-600 dark:text-primary-400">View all</Text>
                </Pressable>
              )}
            </CardHeader>
            <CardContent className="gap-3 pt-0">
              {recentActivities.map((act) => (
                <View
                  key={act.id}
                  className="flex-row items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0"
                >
                  <View className="flex-row items-center gap-3 flex-1 pr-2">
                    <Avatar size="sm">
                      {act.avatarUrl && <AvatarImage source={{ uri: act.avatarUrl }} />}
                      <AvatarFallback
                        text={act.avatarInitials || act.title.slice(0, 2).toUpperCase()}
                      />
                    </Avatar>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-100" numberOfLines={1}>
                        {act.title}
                      </Text>
                      <Text className="text-xs text-neutral-500 dark:text-neutral-400" numberOfLines={1}>
                        {act.subtitle} • {act.timestamp}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end gap-1">
                    {act.amount && (
                      <Text className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {act.amount}
                      </Text>
                    )}
                    {act.status && (
                      <Badge variant={act.status.variant} size="sm">
                        {act.status.label}
                      </Badge>
                    )}
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};
