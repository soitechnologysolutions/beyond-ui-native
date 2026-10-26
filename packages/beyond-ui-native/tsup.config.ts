import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    preset: "src/theme/preset.ts",
    utilities: "src/utilities/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    "react",
    "react-native",
    "nativewind",
    "@rn-primitives/checkbox",
    "@rn-primitives/dialog",
    "@rn-primitives/portal",
    "@rn-primitives/slot",
    "@rn-primitives/switch",
    "@rn-primitives/tabs",
    "@rn-primitives/types",
  ],
});
