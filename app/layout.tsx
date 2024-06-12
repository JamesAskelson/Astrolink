import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from '@/components/ui/theme'
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

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
              <NextSSRPlugin
              routerConfig={extractRouterConfig(ourFileRouter)}
              />
              <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
              >
              <SocketProvider>
                <ModalProvider />
                <QueryProvider>
                  {children}
                </QueryProvider>
              </SocketProvider>
              </ThemeProvider>
            </body>
        </html>
    </ClerkProvider>
  );
}
