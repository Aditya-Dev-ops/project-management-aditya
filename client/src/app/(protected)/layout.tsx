import type { Metadata } from "next";
import { Inter } from "next/font/google";
import DashboardWrapper from "./dashboardWrapper";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
        <DashboardWrapper>{children}</DashboardWrapper>
  );
}