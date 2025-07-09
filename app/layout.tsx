import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MonopolyPay - Digital Banking for Board Games",
  description:
    "Modern banking app for Monopoly games with secure transactions and real-time balance tracking",
  manifest: "/manifest.json",
  themeColor: "#dc2626",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MonopolyPay",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <html lang="en" suppressHydrationWarning>
          <head>
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
              name="apple-mobile-web-app-status-bar-style"
              content="default"
            />
            <meta name="apple-mobile-web-app-title" content="MonopolyPay" />
            <link rel="apple-touch-icon" href="/icon-192x192.png" />
          </head>
          <body className={`${inter.className} dark:bg-slate-950`}>
            <div className="max-w-sm mx-auto min-h-screen bg-white dark:bg-slate-950">
              {children}
            </div>
            <Toaster />
          </body>
        </html>
      </ThemeProvider>
    </TRPCReactProvider>
  );
}
