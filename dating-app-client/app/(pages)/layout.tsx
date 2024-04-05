import { ThemeProvider } from "@mui/material";
import { Suspense } from "react";
import Loading from "./loading";
import { ToastProvider } from "../_context/ToastContext";
import { AxiosInterceptor } from "../_middleware/authenticate";
import { customTheme } from "../_themeProvider";
import AuthSessionProvider from "./(auth)/auth-session-provider";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
      <AxiosInterceptor>
        <Suspense fallback={<Loading />}>
          <AuthSessionProvider>
            <ThemeProvider theme={customTheme}>
              <main className="w-full h-screen place-items-center bg-white box-border">
                {children}
              </main>
            </ThemeProvider>
          </AuthSessionProvider>
        </Suspense>
      </AxiosInterceptor>
    </ToastProvider>
  );
}
