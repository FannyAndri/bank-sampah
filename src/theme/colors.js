// Light theme colors
export const lightColors = {
  primary: {
    50: "#E8F5E9",
    100: "#C8E6C9",
    200: "#A5D6A7",
    300: "#81C784",
    400: "#66BB6A",
    500: "#4CAF50",
    600: "#43A047",
    700: "#388E3C",
    800: "#2E7D32",
    900: "#1B5E20",
  },

  secondary: {
    50: "#F1F8E9",
    100: "#DCEDC8",
    200: "#C5E1A5",
    300: "#AED581",
    400: "#9CCC65",
    500: "#8BC34A",
    600: "#7CB342",
    700: "#689F38",
    800: "#558B2F",
    900: "#33691E",
  },

  accent: {
    light: "#81C784",
    main: "#4CAF50",
    dark: "#388E3C",
  },

  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",

  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },

  text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#BDBDBD",
    white: "#FFFFFF",
  },

  background: {
    default: "#FFFFFF",
    paper: "#FAFAFA",
    green: "#E8F5E9",
    dark: "#1B5E20",
  },

  border: {
    light: "#E0E0E0",
    default: "#BDBDBD",
    dark: "#757575",
  },
};

// Dark theme colors
export const darkColors = {
  primary: {
    50: "#1B5E20",
    100: "#2E7D32",
    200: "#388E3C",
    300: "#43A047",
    400: "#4CAF50",
    500: "#66BB6A",
    600: "#81C784",
    700: "#A5D6A7",
    800: "#C8E6C9",
    900: "#E8F5E9",
  },

  secondary: {
    50: "#33691E",
    100: "#558B2F",
    200: "#689F38",
    300: "#7CB342",
    400: "#8BC34A",
    500: "#9CCC65",
    600: "#AED581",
    700: "#C5E1A5",
    800: "#DCEDC8",
    900: "#F1F8E9",
  },

  accent: {
    light: "#81C784",
    main: "#66BB6A",
    dark: "#43A047",
  },

  success: "#66BB6A",
  warning: "#FFB74D",
  error: "#EF5350",
  info: "#42A5F5",

  gray: {
    50: "#212121",
    100: "#424242",
    200: "#616161",
    300: "#757575",
    400: "#9E9E9E",
    500: "#BDBDBD",
    600: "#E0E0E0",
    700: "#EEEEEE",
    800: "#F5F5F5",
    900: "#FAFAFA",
  },

  text: {
    primary: "#FFFFFF",
    secondary: "#BDBDBD",
    disabled: "#757575",
    white: "#FFFFFF",
  },

  background: {
    default: "#121212",
    paper: "#1E1E1E",
    green: "#1B5E20",
    dark: "#000000",
  },

  border: {
    light: "#424242",
    default: "#616161",
    dark: "#9E9E9E",
  },
};

// Function to get colors based on theme
export const getColors = (isDark = false) => {
  return isDark ? darkColors : lightColors;
};

// Default export (light theme for backwards compatibility)
export const colors = lightColors;

export default colors;
