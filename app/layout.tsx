import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/ui/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

import Footer from "@/components/ui/Footer";
import ThemeProvider from "@/components/ui/Theme-provider";
import { SyncUser } from "@/lib/Sync-User";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your Opinion Matters",
  description: "share your opinion and see what others think",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await SyncUser();
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen flex flex-col `}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-4">
              {children}
            </main>
            <Footer />
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
