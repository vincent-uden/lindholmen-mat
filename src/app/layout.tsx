import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { ThemeProvider } from "next-themes";
import { TRPCReactProvider } from "~/trpc/react";
import MyThemeProvider from "~/components/theme-provider";
import { Footer } from "./_components/footer";

export const metadata: Metadata = {
  title: "Mat på Lindholmen",
  description: "Vad ska vi äta idag?",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <MyThemeProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </MyThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
