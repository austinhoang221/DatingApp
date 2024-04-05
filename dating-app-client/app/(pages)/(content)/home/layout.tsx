import ReduxProvider from "@/app/_redux/provider";
import { Grid } from "@mui/material";
import { Suspense } from "react";
import Loading from "./loading";
import Discover from "./discover";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <main className="w-full h-screen place-items-center bg-white box-border">
        <Grid container>
          <Grid item xs={4}>
            <Discover />
          </Grid>
          <Suspense fallback={<Loading />}>
            <Grid item xs={8} className="h-100 bg-gray-100">
              {children}
            </Grid>
          </Suspense>
        </Grid>
      </main>
    </ReduxProvider>
  );
}
