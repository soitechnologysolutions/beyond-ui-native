import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { cn, getAccessibilityProps, joinA11yLabels } from "../dist/utilities.mjs";

describe("Utility: cn", () => {
  test("merges string classes correctly", () => {
    const result = cn("p-4", "text-center");
    assert.equal(result, "p-4 text-center");
  });

  test("handles conditional and falsy classes", () => {
    const isPrimary = true;
    const isLarge = false;
    const result = cn("base", isPrimary && "bg-primary-500", isLarge && "text-xl", null, undefined);
    assert.equal(result, "base bg-primary-500");
  });

  test("resolves conflicting Tailwind classes with tailwind-merge", () => {
    const result = cn("p-2 text-sm", "p-4 text-lg");
    assert.equal(result, "p-4 text-lg");
  });
});

describe("Accessibility Utilities", () => {
  test("generates accessible props with roles and states", () => {
    const props = getAccessibilityProps({
      label: "Close dialog",
      role: "button",
      disabled: true,
      expanded: false,
    });

    assert.equal(props.accessible, true);
    assert.equal(props.accessibilityLabel, "Close dialog");
    assert.equal(props.accessibilityRole, "button");
    assert.equal(props.accessibilityState.disabled, true);
    assert.equal(props.accessibilityState.expanded, false);
  });

  test("omits undefined state props", () => {
    const props = getAccessibilityProps({
      label: "Confirm selection",
    });

    assert.equal(props.accessible, true);
    assert.equal(props.accessibilityLabel, "Confirm selection");
    assert.equal(props.accessibilityRole, undefined);
    assert.equal(props.accessibilityState, undefined);
  });

  test("joinA11yLabels joins non-empty strings with comma", () => {
    const label = joinA11yLabels("Submit", false, undefined, "2 items pending");
    assert.equal(label, "Submit, 2 items pending");
  });
});
