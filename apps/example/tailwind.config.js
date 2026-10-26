/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../packages/beyond-ui-native/src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [
    require("nativewind/preset"),
    require("@beyondcorp/beyond-ui-native/preset").beyondUIPreset,
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
