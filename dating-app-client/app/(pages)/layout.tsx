import { ThemeProvider } from "@mui/material";
import { Suspense } from "react";
import { ToastProvider } from "../_context/ToastContext";
import { AxiosInterceptor } from "../_middleware/authenticate";
import { customTheme } from "../_themeProvider";
import Loading from "./loading";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
      <AxiosInterceptor>
        <Suspense fallback={<Loading />}>
          <ThemeProvider theme={customTheme}>
            <main>{children}</main>
          </ThemeProvider>
        </Suspense>
      </AxiosInterceptor>
    </ToastProvider>
  );
}
