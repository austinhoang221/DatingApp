"use client";
import { createTheme } from "@mui/material";

export const customTheme = createTheme({
  typography: {
    fontFamily: "Roboto",
    fontSize: 14,
  },
  palette: {
    background: {
      default: "#fff",
    },
    primary: {
      main: "#f97316", // Set primary color to orange
    },
    secondary: {
      main: "#ff661f",
    },
    text: {
      primary: "#F97316",
      secondary: "#1a1c23",
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    // You can add more component customizations here
  },
});
