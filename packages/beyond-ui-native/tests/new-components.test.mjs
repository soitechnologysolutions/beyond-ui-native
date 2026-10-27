import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("New Components API & Bundle Verification", () => {
  const dtsPath = path.resolve("dist/index.d.ts");
  const dtsContent = fs.readFileSync(dtsPath, "utf-8");

  test("dist/index.d.ts exports Modal suite", () => {
    assert.ok(dtsContent.includes("Modal,"), "Modal should be exported");
    assert.ok(dtsContent.includes("ModalHeader,"), "ModalHeader should be exported");
    assert.ok(dtsContent.includes("ModalTitle,"), "ModalTitle should be exported");
    assert.ok(dtsContent.includes("ModalDescription,"), "ModalDescription should be exported");
    assert.ok(dtsContent.includes("ModalContent,"), "ModalContent should be exported");
    assert.ok(dtsContent.includes("ModalFooter,"), "ModalFooter should be exported");
    assert.ok(dtsContent.includes("modalVariants"), "modalVariants should be exported");
  });

  test("dist/index.d.ts exports NightModeSwitch", () => {
    assert.ok(dtsContent.includes("NightModeSwitch,"), "NightModeSwitch should be exported");
    assert.ok(dtsContent.includes("nightModeSwitchVariants"), "nightModeSwitchVariants should be exported");
  });

  test("dist/index.d.ts exports DashboardLayout", () => {
    assert.ok(dtsContent.includes("DashboardLayout,"), "DashboardLayout should be exported");
    assert.ok(dtsContent.includes("DashboardLayoutProps"), "DashboardLayoutProps should be exported");
  });
});
