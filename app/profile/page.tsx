import { Inter } from "next/font/google"
import "@/app/globals.css"
import Header from "@/components/Header"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PurpleKonnektiv",
  description: "Connect and organize with PurpleKonnektiv",
}

export default function ProfilePage() {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="container mx-auto p-4">
            {/* Hier kommt der Profilseiteninhalt */}
            <h1>Profilseite</h1>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}