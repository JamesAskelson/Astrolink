import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from '@/components/ui/theme'

const inter = Roboto_Slab({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Astrolink",
  description: "A peer to peer server chatting program where you can use it to chat, post images/videos, and join calls with your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
        <html lang="en">
            <body className={inter.className}>
              <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </body>
        </html>
    </ClerkProvider>
  );
}
