import { test, expect } from "@playwright/test";
import { testCases } from "./testcases";

const URL = "https://tamil.changathi.com/";
const TEXTAREA = "#transliterateTextarea";

test.describe("Changathi: Thanglish -> Tamil", () => {
  for (const tc of testCases) {
    test(`${tc.id} - ${tc.name}`, async ({ page }) => {
      await page.goto(URL);

      const textarea = page.locator(TEXTAREA);

      await textarea.click();
      await textarea.fill(""); // clear

      // human typing
        await textarea.type(tc.input, { delay: tc.delay ?? 60 });

      // EXTRA trigger for conversion (very important)
        await textarea.type(" ", { delay: 100 });   // force space trigger
        await textarea.blur();                      // simulate clicking outside

// wait for conversion
await page.waitForTimeout(1200);


      const actual = await textarea.inputValue();

      if (tc.type === "positive") {
  // Human-like validation:
  // Output should be generated and should contain Tamil characters.
  expect(actual.trim().length).toBeGreaterThan(0);
  expect(actual).toMatch(/[\u0B80-\u0BFF]/); // Tamil Unicode range
} else if (tc.type === "negative") {
  expect(actual).not.toContain(tc.expectedContains);
} else if (tc.type === "ui") {
        // UI: ensure something changed and expected Tamil appears
        expect(actual.trim().length).toBeGreaterThan(0);
        expect(actual).toContain(tc.expectedContains);
      }
    });
  }
});
