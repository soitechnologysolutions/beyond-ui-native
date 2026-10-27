import type * as React from "react";

/**
 * Checks whether children should be wrapped into a React Native Text component.
 * Handles strings, numbers, and arrays of string/number/boolean primitives (common in JSX interpolations).
 */
export function isTextContent(children: React.ReactNode): boolean {
  if (typeof children === "string" || typeof children === "number") {
    return true;
  }
  if (Array.isArray(children) && children.length > 0) {
    return children.every(
      (child) =>
        typeof child === "string" ||
        typeof child === "number" ||
        child === null ||
        child === undefined ||
        typeof child === "boolean"
    );
  }
  return false;
}
