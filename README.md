# Beyond UI Native

> High-performance, accessible, NativeWind-first React Native component library for the Beyond Softwares ecosystem.

[![CI](https://github.com/soitechnologysolutions/beyond-ui-native/actions/workflows/ci.yml/badge.svg)](https://github.com/soitechnologysolutions/beyond-ui-native/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Built as the official mobile counterpart to [`@beyondcorp/beyond-ui`](https://github.com/soitechnologysolutions/beyond-ui), Beyond UI Native brings unified design tokens, accessible compound primitives, full screen templates, and production-ready mobile interactions to React Native and Expo.

---

## Workspace Structure

- [`packages/beyond-ui-native`](./packages/beyond-ui-native): The published npm package (`@beyondcorp/beyond-ui-native`).
- [`apps/example`](./apps/example): Expo SDK 52 + NativeWind v4 interactive showcase application.
- [`.github/workflows`](./.github/workflows): GitHub Actions CI and Release pipelines.

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/soitechnologysolutions/beyond-ui-native.git
cd beyond-ui-native

# Install workspace dependencies
npm install

# Run verification test suite
npm test

# Build the library package
npm run build

# Start the Expo example application
npm run example:start
```

---

## Design System & Features

- ⚡ **NativeWind v4-first**: First-class Tailwind CSS utility styling on React Native primitives.
- ♿ **Headless Primitives**: Accessibility-first compound components powered by `@rn-primitives` and screen reader helpers.
- 🎨 **Unified Design Tokens**: Full 50–950 shade scales matching the Beyond UI web library (`primary`, `secondary`, `danger`, `success`, `warning`, `neutral`).
- 🧩 **20+ Production Components**: Button, Input, Select, Textarea, Card, Badge, Avatar, Switch, Checkbox, Radio, Dialog, BottomSheet, Accordion, Toast, Tabs, StatsCard, DataTable, Spinner, Skeleton, Alert, Separator, Box, Pressable.
- 📱 **Mobile Screen Templates**: Complete, responsive, styled screen templates for Auth (Sign In, Sign Up, Forgot Password), Dashboard, and Settings.
- 📦 **Dual Output**: Full ESM + CJS bundle distribution with bundled TypeScript type definitions.

---

## License

MIT © Beyond Softwares
