import { Metadata } from "next";
import ApplicationWrapper from "./applicationWrapper";
import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Project-Management",
  description: "This site is for Management of task assignment and project ",
  icons:{
    icon:"/3d-management-logo.webp",
  }
};

export default function RootLayout({children}:{children: React.ReactNode}) {
 return (
    <html lang="en">
        <body className="inter.className"> 
              <ApplicationWrapper> 
                {children}
              </ApplicationWrapper>    
        </body>
    </html>
 )
}