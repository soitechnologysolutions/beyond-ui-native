# @beyondcorp/beyond-ui-native

> A NativeWind-first, accessible, TypeScript-first React Native component library by Beyond Softwares.

Built as the mobile counterpart to [`@beyondcorp/beyond-ui`](https://github.com/beyondcorp/beyond-ui), Beyond UI Native brings unified design tokens, accessible primitives, compound components, reusable screen templates, and production-ready mobile patterns to React Native and Expo.

---

## Highlights

- ⚡ **NativeWind v4-first**: Style universal mobile components using intuitive Tailwind CSS classes.
- ♿ **Accessible by default**: Built on top of `@rn-primitives` (headless Radix primitives for React Native) and dedicated a11y helpers for screen readers, focus states, and ARIA roles.
- 🎨 **Design Token Parity**: Synchronized 50–950 shade scales (`primary`, `secondary`, `danger`/`destructive`, `success`, `warning`, `neutral`), semantic dark/light mode tokens, and border radii matching the Beyond UI web ecosystem.
- 🧩 **Compound Components**: Highly composable APIs for Dialogs, Bottom Sheets, Accordions, Tabs, Selects, Cards, and Alerts.
- 📱 **Screen Templates**: Ready-to-use production mobile screen templates for Authentication (Sign In, Sign Up, Forgot Password), Dashboard Overview, and Profile/Settings.
- 🔔 **Built-in Toast & Portals**: Zero-configuration overlay portals and animated toast banners with `useToast()`.
- 📦 **Dual Module Formats**: Pre-bundled ESM (`.mjs`), CommonJS (`.js`), and full TypeScript definitions (`.d.ts`, `.d.mts`).

---

## Installation

```bash
# In your Expo or React Native app:
npm install @beyondcorp/beyond-ui-native
npx expo install nativewind tailwindcss react-native-reanimated
```

### 1. Configure Tailwind Preset

Add the Beyond UI Native preset to your `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@beyondcorp/beyond-ui-native/dist/**/*.{js,mjs}",
  ],
  presets: [
    require("nativewind/preset"),
    require("@beyondcorp/beyond-ui-native/preset"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 2. Wrap App with `BeyondUIProvider`

```tsx
import React from "react";
import { BeyondUIProvider } from "@beyondcorp/beyond-ui-native";
import { MainNavigator } from "./navigation";

export default function App() {
  return (
    <BeyondUIProvider defaultColorScheme="system">
      <MainNavigator />
    </BeyondUIProvider>
  );
}
```

---

## Component Catalogue

### 1. Primitives & Layout
- **`Box`**: Polymorphic container with forwarded ref, NativeWind class support, and accessibility props.
- **`Pressable`**: Interactive touch target with built-in press feedback (`opacity`, `scale`, `none`).
- **`Separator`**: Accessible horizontal and vertical layout divider.

### 2. Typography
- **`Heading`**: Semantic header (`h1` through `h6`, or numeric levels 1–6).
- **`Text`**: Body text supporting variants (`body`, `muted`, `caption`, `lead`, `error`).

### 3. Actions & Forms
- **`Button`**: Variants (`primary`, `secondary`, `destructive`, `danger`, `outline`, `ghost`, `link`), sizes (`sm`, `md`, `lg`, `xl`), and loading spinners.
- **`Input`**: Text input with `leftIcon`/`rightIcon`, `leftElement`/`rightElement`, error messaging, and helper text.
- **`Textarea`**: Multiline text input with border focus states and validation styling.
- **`Select`**: Mobile-optimized picker with trigger, searchable options sheet, checkmark selection, and compound parts (`SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`).
- **`Switch`**: Smooth toggle switch with dark mode theme support.
- **`Checkbox`**: Accessible checkbox with check indicator.
- **`RadioGroup` & `Radio`**: Single-select radio group.

### 4. Overlays & Feedback
- **`Dialog`**: Compound modal dialog (`DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`).
- **`BottomSheet`**: Slide-up sheet modal with drag-down-to-dismiss gesture, backdrop scrim, handle bar, header, and body.
- **`Accordion`**: Expandable accordion sections (`AccordionItem`, `AccordionTrigger`, `AccordionContent`) supporting single or multiple items.
- **`Toast`**: Context-driven animated notifications via `useToast()` (`toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`).
- **`Alert`**: Status alert banner (`AlertTitle`, `AlertDescription`).
- **`Spinner`**: Animated activity indicator.
- **`Skeleton`**: Pulsing placeholder for asynchronous data loading.

### 5. Data Display
- **`Card`**: Compound card container (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
- **`Badge`**: Status badge supporting `primary`, `secondary`, `success`, `warning`, `danger`, and `outline`.
- **`Avatar`**: User avatar with automatic fallback initials (`AvatarImage`, `AvatarFallback`).
- **`StatsCard`**: Metrics card with trend percentage indicator, icon, and description.
- **`DataTable`**: Mobile-responsive data table and card list with search filter, sortable columns, and pagination.
- **`Tabs`**: Segmented tab control (`TabsList`, `TabsTrigger`, `TabsContent`).

---

## Production Screen Templates

Beyond UI Native includes ready-to-use, fully functional mobile screen templates under `@beyondcorp/beyond-ui-native`:

```tsx
import {
  SignInTemplate,
  SignUpTemplate,
  ForgotPasswordTemplate,
  DashboardTemplate,
  SettingsTemplate,
} from "@beyondcorp/beyond-ui-native";
```

### Sign In Screen
```tsx
<SignInTemplate
  title="Welcome Back"
  subtitle="Sign in to your Beyond account"
  onSubmit={({ email, password, rememberMe }) => handleLogin(email, password)}
  onForgotPassword={() => navigation.navigate("ForgotPassword")}
  onSignUpPress={() => navigation.navigate("SignUp")}
  onGooglePress={handleGoogleLogin}
  onApplePress={handleAppleLogin}
/>
```

### Dashboard Screen
```tsx
<DashboardTemplate
  userName="Mark"
  userRole="Principal Engineer"
  metrics={[
    { id: "1", title: "Revenue", value: "$48,500", trend: { direction: "up", value: "+14.2%", label: "this month" } },
    { id: "2", title: "Active Users", value: "12,400", trend: { direction: "up", value: "+6.8%", label: "growth" } },
  ]}
  quickActions={[
    { id: "1", label: "New Project", icon: "🚀", onPress: () => {} },
    { id: "2", label: "Export", icon: "📊", onPress: () => {} },
  ]}
  recentActivities={[
    { id: "1", title: "New Order #1084", subtitle: "2 items", timestamp: "5m ago", amount: "$149.00", status: { label: "Completed", variant: "success" } },
  ]}
/>
```

### Settings & Profile Screen
```tsx
<SettingsTemplate
  user={{ name: "Mark Otto", email: "mark@beyondsoftwares.com", plan: "Enterprise" }}
  pushNotifications={pushEnabled}
  onTogglePushNotifications={setPushEnabled}
  isDarkMode={colorScheme === "dark"}
  onToggleDarkMode={toggleColorScheme}
  onLogout={handleLogout}
  onDeleteAccount={handleDeleteAccount}
/>
```

---

## Monorepo Architecture

```
beyond-ui-native/
├── packages/
│   └── beyond-ui-native/      # The npm package (@beyondcorp/beyond-ui-native)
│       ├── src/
│       │   ├── components/    # 20+ production UI components
│       │   ├── primitives/    # Box, Pressable layout primitives
│       │   ├── templates/     # Auth, Dashboard, Settings templates
│       │   ├── providers/     # BeyondUIProvider & Portal host
│       │   ├── theme/         # Design tokens & Tailwind preset
│       │   └── utilities/     # cn (clsx + tailwind-merge) & a11y helpers
│       ├── tests/             # Automated test suite
│       └── tsup.config.ts     # ESM, CJS & DTS rollup
├── apps/
│   └── example/               # Expo SDK 52 interactive showcase app
└── .github/
    └── workflows/             # CI & Release automation pipelines
```

---

## Scripts

```bash
# Build the component library
npm run build

# Run TypeScript typechecks
npm run typecheck

# Run unit test suite
npm test

# Start the Expo example application
npm run example:start
```

---

## License

MIT © Beyond Softwares
