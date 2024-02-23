import { ThemeProvider } from "@mui/material";
import { customTheme } from "../_themeProvider";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={customTheme}>
      <main>{children}</main>
    </ThemeProvider>
  );
}
