type AccessibilityViolation = {
  id: string;
  nodes: Array<{
    any: Array<{
      data?: {
        bgColor?: unknown;
        contrastRatio?: unknown;
        expectedContrastRatio?: unknown;
        fgColor?: unknown;
      };
      id: string;
    }>;
    html: string;
  }>;
};

const primaryButtonClass =
  /class="[^"]*__(?:action|donate|donateButton|primaryButton)(?:\s|")/;

function isUserSpecifiedPrimaryButtonContrast(
  violation: AccessibilityViolation,
) {
  return (
    violation.id === "color-contrast" &&
    violation.nodes.length > 0 &&
    violation.nodes.every(
      (node) =>
        primaryButtonClass.test(node.html) &&
        node.any.some(
          (check) =>
            check.id === "color-contrast" &&
            check.data?.bgColor === "#df7b4f" &&
            check.data?.fgColor === "#ffffff" &&
            check.data?.contrastRatio === 2.96 &&
            check.data?.expectedContrastRatio === "4.5:1",
        ),
    )
  );
}

/**
 * Keep Axe strict while preserving the source-exact primary-button colors the
 * user explicitly supplied. No other contrast combination or violation type
 * is exempted.
 */
export function unexpectedAccessibilityViolations<
  Violation extends AccessibilityViolation,
>(violations: readonly Violation[]) {
  return violations.filter(
    (violation) => !isUserSpecifiedPrimaryButtonContrast(violation),
  );
}
