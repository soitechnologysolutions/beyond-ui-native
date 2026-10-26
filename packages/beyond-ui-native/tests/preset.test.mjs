import { test, describe } from "node:test";
import assert from "node:assert/strict";

import beyondUIPreset from "../dist/preset.mjs";

describe("Tailwind Preset", () => {
  test("preset theme extends colors with all tokens", () => {
    assert.ok(beyondUIPreset.theme.extend.colors.primary);
    assert.ok(beyondUIPreset.theme.extend.colors.secondary);
    assert.ok(beyondUIPreset.theme.extend.colors.danger);
    assert.ok(beyondUIPreset.theme.extend.colors.destructive);
    assert.ok(beyondUIPreset.theme.extend.colors.success);
    assert.ok(beyondUIPreset.theme.extend.colors.warning);
    assert.ok(beyondUIPreset.theme.extend.colors.neutral);
  });

  test("preset defines border radius and spacing", () => {
    assert.equal(beyondUIPreset.theme.extend.borderRadius.sm, "6px");
    assert.equal(beyondUIPreset.theme.extend.borderRadius.md, "10px");
    assert.equal(beyondUIPreset.theme.extend.borderRadius.lg, "14px");
  });
});
