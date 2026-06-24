/**
 * Design System - Typography with Font Size Support
 */

const baseFontSizes = {
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body1: 16,
  body2: 14,
  caption: 12,
  overline: 10,
};

// Font size multipliers
export const fontSizeMultipliers = {
  small: 0.875,   // 87.5%
  medium: 1.0,    // 100%
  large: 1.125,   // 112.5%
};

// Function to get typography based on font size setting
export const getTypography = (fontSizeSetting = "medium") => {
  const multiplier = fontSizeMultipliers[fontSizeSetting] || 1.0;

  return {
    h1: {
      fontSize: Math.round(baseFontSizes.h1 * multiplier),
      fontWeight: "bold",
      lineHeight: Math.round(40 * multiplier),
    },
    h2: {
      fontSize: Math.round(baseFontSizes.h2 * multiplier),
      fontWeight: "bold",
      lineHeight: Math.round(36 * multiplier),
    },
    h3: {
      fontSize: Math.round(baseFontSizes.h3 * multiplier),
      fontWeight: "600",
      lineHeight: Math.round(32 * multiplier),
    },
    h4: {
      fontSize: Math.round(baseFontSizes.h4 * multiplier),
      fontWeight: "600",
      lineHeight: Math.round(28 * multiplier),
    },
    h5: {
      fontSize: Math.round(baseFontSizes.h5 * multiplier),
      fontWeight: "600",
      lineHeight: Math.round(24 * multiplier),
    },
    h6: {
      fontSize: Math.round(baseFontSizes.h6 * multiplier),
      fontWeight: "600",
      lineHeight: Math.round(22 * multiplier),
    },
    body1: {
      fontSize: Math.round(baseFontSizes.body1 * multiplier),
      lineHeight: Math.round(24 * multiplier),
    },
    body2: {
      fontSize: Math.round(baseFontSizes.body2 * multiplier),
      lineHeight: Math.round(20 * multiplier),
    },
    caption: {
      fontSize: Math.round(baseFontSizes.caption * multiplier),
      lineHeight: Math.round(16 * multiplier),
    },
    overline: {
      fontSize: Math.round(baseFontSizes.overline * multiplier),
      lineHeight: Math.round(16 * multiplier),
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
  };
};

// Default export (medium size for backwards compatibility)
export const typography = getTypography("medium");

export default typography;
