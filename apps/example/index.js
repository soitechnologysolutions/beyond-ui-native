import "./global.css";
import { LogBox } from "react-native";
import { registerRootComponent } from "expo";

LogBox.ignoreLogs([
  "You are setting the style `{ shadowOffset: ... }` as a prop",
  "You are setting the style",
  "[Reanimated]",
]);

const originalConsoleError = console.error;
console.error = (...args) => {
  const fullMessage = args
    .map((arg) => (typeof arg === "string" ? arg : ""))
    .join(" ");

  if (
    fullMessage.includes("shadowOffset") ||
    fullMessage.includes("You are setting the style")
  ) {
    return;
  }
  originalConsoleError(...args);
};

try {
  const { configureReanimatedLogger, ReanimatedLogLevel } = require("react-native-reanimated");
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });
} catch (_) {}

import App from "./App";

registerRootComponent(App);
