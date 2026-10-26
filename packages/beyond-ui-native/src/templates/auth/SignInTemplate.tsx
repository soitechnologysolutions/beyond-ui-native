import * as React from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { cn } from "../../utilities/cn";
import { Text } from "../../components/text/text";
import { Heading } from "../../components/text/heading";
import { Input } from "../../components/input/input";
import { Button } from "../../components/button/button";
import { Checkbox } from "../../components/checkbox/checkbox";
import { Alert, AlertDescription } from "../../components/alert/alert";
import { Separator } from "../../components/separator/separator";

export interface SignInTemplateProps {
  title?: string;
  subtitle?: string;
  logo?: React.ReactNode;
  onSubmit?: (data: { email: string; password: string; rememberMe: boolean }) => void;
  onForgotPassword?: () => void;
  onSignUpPress?: () => void;
  onGooglePress?: () => void;
  onApplePress?: () => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export const SignInTemplate: React.FC<SignInTemplateProps> = ({
  title = "Welcome Back",
  subtitle = "Sign in to your Beyond account to continue",
  logo,
  onSubmit,
  onForgotPassword,
  onSignUpPress,
  onGooglePress,
  onApplePress,
  isLoading = false,
  error,
  className,
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [emailError, setEmailError] = React.useState<string | undefined>();
  const [passwordError, setPasswordError] = React.useState<string | undefined>();

  const handleSubmit = () => {
    let valid = true;
    setEmailError(undefined);
    setPasswordError(undefined);

    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }
    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    if (valid) {
      onSubmit?.({ email, password, rememberMe });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={cn("flex-1 bg-background", className)}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        className="px-6 py-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-md mx-auto gap-6">
          {/* Logo & Header */}
          <View className="items-center gap-2">
            {logo && <View className="mb-2">{logo}</View>}
            <Heading level={2} className="text-3xl font-extrabold text-foreground text-center">
              {title}
            </Heading>
            <Text className="text-muted text-center text-base">
              {subtitle}
            </Text>
          </View>

          {/* Error Banner */}
          {error && (
            <Alert variant="danger">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Fields */}
          <View className="gap-4">
            <Input
              label="Email Address"
              placeholder="you@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError(undefined);
              }}
              error={emailError}
            />

            <View className="gap-1">
              <Input
                label="Password"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError(undefined);
                }}
                error={passwordError}
                rightElement={
                  <Pressable onPress={() => setShowPassword((p) => !p)} className="p-1">
                    <Text className="text-xs text-muted font-semibold">
                      {showPassword ? "HIDE" : "SHOW"}
                    </Text>
                  </Pressable>
                }
              />
            </View>

            {/* Remember & Forgot */}
            <View className="flex-row items-center justify-between py-1">
              <View className="flex-row items-center gap-2">
                <Checkbox checked={rememberMe} onCheckedChange={setRememberMe} />
                <Text className="text-sm text-foreground">Remember me</Text>
              </View>

              {onForgotPassword && (
                <Pressable onPress={onForgotPassword}>
                  <Text className="text-sm font-semibold text-primary">
                    Forgot password?
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Submit */}
            <Button
              variant="primary"
              size="lg"
              loading={isLoading}
              onPress={handleSubmit}
              className="mt-2"
            >
              Sign In
            </Button>
          </View>

          {/* Social Logins */}
          {(onGooglePress || onApplePress) && (
            <View className="gap-4">
              <View className="flex-row items-center gap-3">
                <Separator className="flex-1" />
                <Text className="text-xs text-muted uppercase">or continue with</Text>
                <Separator className="flex-1" />
              </View>

              <View className="flex-row gap-3">
                {onGooglePress && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onPress={onGooglePress}
                  >
                    Google
                  </Button>
                )}
                {onApplePress && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onPress={onApplePress}
                  >
                    Apple
                  </Button>
                )}
              </View>
            </View>
          )}

          {/* Switch to SignUp */}
          {onSignUpPress && (
            <View className="flex-row justify-center items-center gap-1.5 pt-2">
              <Text className="text-sm text-muted">Don't have an account?</Text>
              <Pressable onPress={onSignUpPress}>
                <Text className="text-sm font-bold text-primary">Sign Up</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
