'use client';

import { Inter } from "next/font/google"
import "@/app/globals.css"
import Header from "@/components/Header"
import { ThemeProvider } from "@/components/theme-provider"
import { NostrProvider } from "nostr-react";
import Head from "next/head";

const relayUrls = [
  "wss://relay.damus.io",
  "wss://relay.nostr.band",
];

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Purple Konnektiv</title>
        <meta name="description" content="Purple Konnektiv - Connect with the community through Nostr" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="container mx-auto p-4">
            <NostrProvider relayUrls={relayUrls} debug={true}>
              {children}
            </NostrProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

