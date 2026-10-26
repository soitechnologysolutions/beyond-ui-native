import "./global.css";
import { LogBox } from "react-native";
import { registerRootComponent } from "expo";
import App from "./App";

LogBox.ignoreLogs([
  "You are setting the style `{ shadowOffset: ... }` as a prop",
  "[Reanimated]",
]);

try {
  const { configureReanimatedLogger, ReanimatedLogLevel } = require("react-native-reanimated");
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });
} catch (_) {}

registerRootComponent(App);
