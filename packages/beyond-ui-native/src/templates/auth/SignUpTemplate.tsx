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

export interface SignUpTemplateProps {
  title?: string;
  subtitle?: string;
  logo?: React.ReactNode;
  onSubmit?: (data: {
    fullName: string;
    email: string;
    password: string;
    agreeToTerms: boolean;
  }) => void;
  onSignInPress?: () => void;
  onGooglePress?: () => void;
  onApplePress?: () => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export const SignUpTemplate: React.FC<SignUpTemplateProps> = ({
  title = "Create Account",
  subtitle = "Get started with your free Beyond account",
  logo,
  onSubmit,
  onSignInPress,
  onGooglePress,
  onApplePress,
  isLoading = false,
  error,
  className,
}) => {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  const [nameError, setNameError] = React.useState<string | undefined>();
  const [emailError, setEmailError] = React.useState<string | undefined>();
  const [passwordError, setPasswordError] = React.useState<string | undefined>();
  const [termsError, setTermsError] = React.useState<string | undefined>();

  const handleSubmit = () => {
    let valid = true;
    setNameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setTermsError(undefined);

    if (!fullName.trim()) {
      setNameError("Full name is required");
      valid = false;
    }
    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }
    if (!password || password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      valid = false;
    }
    if (!agreeToTerms) {
      setTermsError("You must agree to the Terms of Service");
      valid = false;
    }

    if (valid) {
      onSubmit?.({ fullName, email, password, agreeToTerms });
    }
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
          {/* Header */}
          <View className="items-center gap-2">
            {logo && <View className="mb-2">{logo}</View>}
            <Heading level={2} className="text-3xl font-extrabold text-foreground text-center">
              {title}
            </Heading>
            <Text className="text-muted text-center text-base">
              {subtitle}
            </Text>
          </View>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <View className="gap-4">
            <Input
              label="Full Name"
              placeholder="Mark Otto"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (nameError) setNameError(undefined);
              }}
              error={nameError}
            />

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

            <Input
              label="Password"
              placeholder="At least 8 characters"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError(undefined);
              }}
              error={passwordError}
            />

            {/* Terms checkbox */}
            <View className="gap-1">
              <View className="flex-row items-center gap-2 pt-1">
                <Checkbox
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => {
                    setAgreeToTerms(checked);
                    if (termsError) setTermsError(undefined);
                  }}
                />
                <Text className="text-sm text-foreground flex-1">
                  I agree to the Terms of Service & Privacy Policy
                </Text>
              </View>
              {termsError && (
                <Text className="text-xs text-danger font-medium">{termsError}</Text>
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
              Create Account
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

          {/* Back to SignIn */}
          {onSignInPress && (
            <View className="flex-row justify-center items-center gap-1.5 pt-2">
              <Text className="text-sm text-muted">Already have an account?</Text>
              <Pressable onPress={onSignInPress}>
                <Text className="text-sm font-bold text-primary">Sign In</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
