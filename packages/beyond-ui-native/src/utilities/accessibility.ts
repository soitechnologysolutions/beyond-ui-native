import type { AccessibilityRole, AccessibilityState } from "react-native";

export interface AccessibilityPropsOptions {
  label?: string;
  hint?: string;
  role?: AccessibilityRole;
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean | "mixed";
  busy?: boolean;
  expanded?: boolean;
}

/**
 * Helper to construct accessible props for React Native components.
 */
export function getAccessibilityProps(options: AccessibilityPropsOptions = {}) {
  const { label, hint, role, disabled, selected, checked, busy, expanded } = options;

  const state: AccessibilityState = {};
  if (disabled !== undefined) state.disabled = disabled;
  if (selected !== undefined) state.selected = selected;
  if (checked !== undefined) state.checked = checked;
  if (busy !== undefined) state.busy = busy;
  if (expanded !== undefined) state.expanded = expanded;

  const hasState = Object.keys(state).length > 0;

  return {
    accessible: true,
    ...(label ? { accessibilityLabel: label } : {}),
    ...(hint ? { accessibilityHint: hint } : {}),
    ...(role ? { accessibilityRole: role } : {}),
    ...(hasState ? { accessibilityState: state } : {}),
  };
}

/**
 * Format a visually hidden text string or accessibility label from parts.
 */
export function joinA11yLabels(...parts: (string | undefined | null | false)[]): string {
  return parts.filter(Boolean).join(", ");
}
