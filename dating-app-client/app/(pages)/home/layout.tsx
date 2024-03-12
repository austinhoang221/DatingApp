import ReduxProvider from "@/app/_redux/provider";
import { Grid } from "@mui/material";
import Messages from "./discover";
import Nav from "./nav";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <Nav />
      <main className="w-full h-screen place-items-center bg-white box-border">
        <Grid container>
          <Grid item xs={4}>
            <Messages />
          </Grid>
          <Grid item xs={8} className="h-100">
            {children}
          </Grid>
        </Grid>
      </main>
    </ReduxProvider>
  );
}
