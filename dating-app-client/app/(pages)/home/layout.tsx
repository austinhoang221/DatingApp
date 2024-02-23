import ReduxProvider from "@/app/_redux/provider";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <main className="w-full h-screen place-items-center">{children}</main>
    </ReduxProvider>
  );
}
