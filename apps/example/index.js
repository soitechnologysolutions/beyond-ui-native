import "./global.css";
import { LogBox } from "react-native";
import { registerRootComponent } from "expo";
import App from "./App";

LogBox.ignoreLogs([
  "You are setting the style `{ shadowOffset: ... }` as a prop",
  "[Reanimated]",
]);

const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("shadowOffset")
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

registerRootComponent(App);
