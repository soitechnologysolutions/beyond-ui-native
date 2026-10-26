import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { tokens } from "../dist/preset.mjs";

describe("Design Tokens System", () => {
  test("contains complete color scales (50-950) for all semantic palettes", () => {
    const expectedScales = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
    const palettes = ["primary", "secondary", "danger", "destructive", "success", "warning", "neutral"];

    for (const pal of palettes) {
      assert.ok(tokens.colors[pal], `tokens.colors.${pal} should exist`);
      for (const scale of expectedScales) {
        assert.ok(tokens.colors[pal][scale], `tokens.colors.${pal}.${scale} should exist`);
      }
    }
  });

  test("destructive scale mirrors danger scale for web compatibility", () => {
    assert.deepEqual(tokens.colors.destructive, tokens.colors.danger);
  });

  test("exports valid border radii and spacing tokens", () => {
    assert.equal(tokens.radius.sm, 6);
    assert.equal(tokens.radius.md, 10);
    assert.equal(tokens.radius.lg, 14);
    assert.equal(tokens.radius.full, 9999);

    assert.equal(tokens.spacing.xs, 4);
    assert.equal(tokens.spacing.sm, 8);
    assert.equal(tokens.spacing.md, 12);
    assert.equal(tokens.spacing.lg, 16);
  });
});
