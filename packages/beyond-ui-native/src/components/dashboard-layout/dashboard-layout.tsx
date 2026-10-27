import * as React from "react";
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  RefreshControl,
  type ViewProps,
} from "react-native";
import { cn } from "../../utilities/cn";
import { Text } from "../text/text";
import { Heading } from "../text/heading";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import { NightModeSwitch } from "../night-mode-switch/night-mode-switch";

export interface DashboardBreadcrumb {
  label: string;
  onPress?: () => void;
}

export interface DashboardLayoutProps extends ViewProps {
  /** Screen or dashboard title */
  title?: string;
  /** Subtitle or section caption */
  subtitle?: string;
  /** Optional breadcrumbs list */
  breadcrumbs?: DashboardBreadcrumb[];
  /** User information for the top bar profile */
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
  };
  onProfilePress?: () => void;
  /** Notification button handler */
  onNotificationPress?: () => void;
  unreadNotificationsCount?: number;
  /** Search bar configuration */
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  /** Night mode toggle display */
  showNightModeSwitch?: boolean;
  /** Navigation back action or drawer action */
  onBackPress?: () => void;
  backIcon?: React.ReactNode;
  /** Custom actions rendered in the top header right section */
  headerActions?: React.ReactNode;
  /** Custom bottom bar or fixed footer */
  footer?: React.ReactNode;
  /** Whether the main content area scrolls */
  scrollable?: boolean;
  /** Pull to refresh handlers */
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Content wrapper class name */
  contentClassName?: string;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  breadcrumbs,
  user,
  onProfilePress,
  onNotificationPress,
  unreadNotificationsCount = 0,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  showNightModeSwitch = true,
  onBackPress,
  backIcon,
  headerActions,
  footer,
  scrollable = true,
  refreshing = false,
  onRefresh,
  contentClassName,
  className,
  children,
  ...props
}) => {
  return (
    <View
      className={cn("flex-1 bg-neutral-50 dark:bg-neutral-950", className)}
      {...props}
    >
      {/* Top Header Bar */}
      <View className="px-5 pt-3 pb-3 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 flex-row items-center justify-between z-10">
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          {onBackPress && (
            <Pressable
              onPress={onBackPress}
              className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              {backIcon || (
                <Text className="text-neutral-700 dark:text-neutral-200 font-bold text-base leading-none">
                  ←
                </Text>
              )}
            </Pressable>
          )}

          {user && (
            <Pressable
              onPress={onProfilePress}
              className="flex-row items-center gap-2 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel={`User profile: ${user.name || "User"}`}
            >
              <Avatar size="sm">
                {user.avatarUrl && <AvatarImage source={{ uri: user.avatarUrl }} />}
                <AvatarFallback text={(user.name || "U").slice(0, 2).toUpperCase()} />
              </Avatar>
              <View className="hidden sm:flex">
                <Text className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-tight">
                  {user.name}
                </Text>
                {user.role && (
                  <Text className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
                    {user.role}
                  </Text>
                )}
              </View>
            </Pressable>
          )}

          {(title || subtitle) && (
            <View className="flex-1">
              {breadcrumbs && breadcrumbs.length > 0 && (
                <View className="flex-row items-center gap-1 mb-0.5">
                  {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && (
                        <Text className="text-[11px] text-neutral-400 dark:text-neutral-500">/</Text>
                      )}
                      <Text
                        onPress={crumb.onPress}
                        className={cn(
                          "text-[11px]",
                          crumb.onPress
                            ? "text-primary-600 dark:text-primary-400 font-medium"
                            : "text-neutral-500 dark:text-neutral-400"
                        )}
                      >
                        {crumb.label}
                      </Text>
                    </React.Fragment>
                  ))}
                </View>
              )}
              {title && (
                <Heading
                  level={3}
                  className="text-lg font-bold text-neutral-900 dark:text-neutral-50 leading-tight"
                >
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Text className="text-xs text-neutral-500 dark:text-neutral-400 leading-tight">
                  {subtitle}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Right header actions */}
        <View className="flex-row items-center gap-2">
          {headerActions}

          {showNightModeSwitch && (
            <NightModeSwitch size="sm" variant="ghost" />
          )}

          {onNotificationPress && (
            <Pressable
              onPress={onNotificationPress}
              className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center relative active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <Text className="text-sm">🔔</Text>
              {unreadNotificationsCount > 0 && (
                <View className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-danger items-center justify-center">
                  <Text className="text-[9px] font-bold text-white leading-none">
                    {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      </View>

      {/* Optional Search Bar */}
      {showSearch && (
        <View className="px-5 py-2 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/50">
          <View className="flex-row items-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2">
            <Text className="text-neutral-400 mr-2 text-sm">🔍</Text>
            <TextInput
              value={searchValue}
              onChangeText={onSearchChange}
              placeholder={searchPlaceholder}
              placeholderTextColor="#9ca3af"
              className="flex-1 text-sm text-neutral-900 dark:text-neutral-100 p-0"
            />
          </View>
        </View>
      )}

      {/* Main Body */}
      {scrollable ? (
        <ScrollView
          className={cn("flex-1", contentClassName)}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View className={cn("flex-1", contentClassName)}>
          {children}
        </View>
      )}

      {/* Optional Fixed Footer / Navigation */}
      {footer}
    </View>
  );
};
DashboardLayout.displayName = "DashboardLayout";
