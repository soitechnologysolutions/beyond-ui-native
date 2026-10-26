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
import { Alert, AlertDescription } from "../../components/alert/alert";

export interface ForgotPasswordTemplateProps {
  title?: string;
  subtitle?: string;
  onSubmit?: (data: { email: string }) => void;
  onBackToSignIn?: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  error?: string | null;
  className?: string;
}

export const ForgotPasswordTemplate: React.FC<ForgotPasswordTemplateProps> = ({
  title = "Reset Password",
  subtitle = "Enter your email address and we'll send you recovery instructions",
  onSubmit,
  onBackToSignIn,
  isLoading = false,
  isSuccess = false,
  error,
  className,
}) => {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | undefined>();

  const handleSubmit = () => {
    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError(undefined);
    onSubmit?.({ email });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      className={cn("flex-1 bg-background", className)}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        className="px-6 py-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-md mx-auto gap-6">
          <View className="items-center gap-2">
            <Heading level={2} className="text-3xl font-extrabold text-foreground text-center">
              {title}
            </Heading>
            <Text className="text-muted text-center text-base">
              {subtitle}
            </Text>
          </View>

          {error && (
            <Alert variant="danger">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isSuccess ? (
            <View className="gap-4">
              <Alert variant="success">
                <AlertDescription>
                  Password reset link sent! Check your email inbox.
                </AlertDescription>
              </Alert>

              {onBackToSignIn && (
                <Button variant="primary" size="lg" onPress={onBackToSignIn}>
                  Back to Sign In
                </Button>
              )}
            </View>
          ) : (
            <View className="gap-4">
              <Input
                label="Email Address"
                placeholder="you@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError(undefined);
                }}
                error={emailError}
              />

              <Button
                variant="primary"
                size="lg"
                loading={isLoading}
                onPress={handleSubmit}
                className="mt-2"
              >
                Send Reset Link
              </Button>

              {onBackToSignIn && (
                <View className="flex-row justify-center items-center gap-1.5 pt-2">
                  <Pressable onPress={onBackToSignIn}>
                    <Text className="text-sm font-semibold text-primary">
                      Back to Sign In
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
