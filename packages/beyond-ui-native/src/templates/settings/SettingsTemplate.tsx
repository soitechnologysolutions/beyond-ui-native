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
import { Card } from "../../components/card/card";
import { Switch } from "../../components/switch/switch";
import { Button } from "../../components/button/button";
import { Separator } from "../../components/separator/separator";

export interface SettingsTemplateProps extends ViewProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    plan?: string;
  };
  pushNotifications?: boolean;
  onTogglePushNotifications?: (val: boolean) => void;
  emailNotifications?: boolean;
  onToggleEmailNotifications?: (val: boolean) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: (val: boolean) => void;
  biometricsEnabled?: boolean;
  onToggleBiometrics?: (val: boolean) => void;
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onViewTerms?: () => void;
  onViewPrivacy?: () => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  className?: string;
}

export const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
  user,
  pushNotifications = true,
  onTogglePushNotifications,
  emailNotifications = true,
  onToggleEmailNotifications,
  isDarkMode = false,
  onToggleDarkMode,
  biometricsEnabled = false,
  onToggleBiometrics,
  onEditProfile,
  onChangePassword,
  onViewTerms,
  onViewPrivacy,
  onLogout,
  onDeleteAccount,
  className,
  ...props
}) => {
  return (
    <ScrollView
      {...props}
      style={[{ flex: 1 }, (props as any).style]}
      className={cn("flex-1 bg-background", className)}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6 pt-6 gap-6">
        <Heading level={2} className="text-2xl font-bold text-foreground">
          Settings & Profile
        </Heading>

        {/* User Card */}
        <Card className="p-4 flex-row items-center gap-4">
          <Avatar size="lg">
            {user.avatarUrl && <AvatarImage source={{ uri: user.avatarUrl }} />}
            <AvatarFallback text={user.name.slice(0, 2).toUpperCase()} />
          </Avatar>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-bold text-foreground">{user.name}</Text>
              {user.plan && (
                <Badge variant="primary" size="sm">
                  {user.plan}
                </Badge>
              )}
            </View>
            <Text className="text-xs text-muted">{user.email}</Text>
          </View>
          {onEditProfile && (
            <Button variant="outline" size="sm" onPress={onEditProfile}>
              Edit
            </Button>
          )}
        </Card>

        {/* Preferences Section */}
        <View className="gap-2">
          <Text className="text-xs font-bold text-muted uppercase tracking-wider px-1">
            Preferences
          </Text>
          <Card className="divide-y divide-border/50">
            <View className="p-4 flex-row items-center justify-between">
              <View className="pr-4 flex-1">
                <Text className="text-sm font-semibold text-foreground">
                  Push Notifications
                </Text>
                <Text className="text-xs text-muted">
                  Receive real-time alerts on your mobile device
                </Text>
              </View>
              <Switch
                checked={pushNotifications}
                onCheckedChange={onTogglePushNotifications}
              />
            </View>

            <View className="p-4 flex-row items-center justify-between">
              <View className="pr-4 flex-1">
                <Text className="text-sm font-semibold text-foreground">
                  Email Notifications
                </Text>
                <Text className="text-xs text-muted">
                  Weekly digests and activity summaries
                </Text>
              </View>
              <Switch
                checked={emailNotifications}
                onCheckedChange={onToggleEmailNotifications}
              />
            </View>

            <View className="p-4 flex-row items-center justify-between">
              <View className="pr-4 flex-1">
                <Text className="text-sm font-semibold text-foreground">Dark Theme</Text>
                <Text className="text-xs text-muted">
                  Enable high contrast dark mode appearance
                </Text>
              </View>
              <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
            </View>

            <View className="p-4 flex-row items-center justify-between">
              <View className="pr-4 flex-1">
                <Text className="text-sm font-semibold text-foreground">
                  Biometric Login
                </Text>
                <Text className="text-xs text-muted">
                  Use Face ID or fingerprint to authenticate
                </Text>
              </View>
              <Switch
                checked={biometricsEnabled}
                onCheckedChange={onToggleBiometrics}
              />
            </View>
          </Card>
        </View>

        {/* Security & Account Links */}
        <View className="gap-2">
          <Text className="text-xs font-bold text-muted uppercase tracking-wider px-1">
            Account & Security
          </Text>
          <Card className="divide-y divide-border/50">
            {onChangePassword && (
              <Pressable
                onPress={onChangePassword}
                className="p-4 flex-row items-center justify-between active:bg-muted/10"
              >
                <Text className="text-sm font-semibold text-foreground">
                  Change Password
                </Text>
                <Text className="text-muted text-xs">›</Text>
              </Pressable>
            )}

            {onViewTerms && (
              <Pressable
                onPress={onViewTerms}
                className="p-4 flex-row items-center justify-between active:bg-muted/10"
              >
                <Text className="text-sm font-semibold text-foreground">
                  Terms of Service
                </Text>
                <Text className="text-muted text-xs">›</Text>
              </Pressable>
            )}

            {onViewPrivacy && (
              <Pressable
                onPress={onViewPrivacy}
                className="p-4 flex-row items-center justify-between active:bg-muted/10"
              >
                <Text className="text-sm font-semibold text-foreground">
                  Privacy Policy
                </Text>
                <Text className="text-muted text-xs">›</Text>
              </Pressable>
            )}
          </Card>
        </View>

        {/* Danger Zone */}
        <View className="gap-3 pt-2">
          {onLogout && (
            <Button variant="outline" size="lg" onPress={onLogout}>
              Log Out
            </Button>
          )}

          {onDeleteAccount && (
            <Button
              variant="destructive"
              size="lg"
              onPress={onDeleteAccount}
            >
              Delete Account
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
